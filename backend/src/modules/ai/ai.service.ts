import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';
import { logger } from '../../config/logger';

let daemonProcess: ChildProcess | null = null;

export class AIService {
  private daemonUrl = 'http://127.0.0.1:8081';
  private pythonPath = 'python';

  private getPythonPath(): string {
    const venvPath = path.resolve(__dirname, '../../../venv/Scripts/python.exe');
    const venvPathUnix = path.resolve(__dirname, '../../../venv/bin/python');
    
    if (fs.existsSync(venvPath)) {
      return venvPath;
    } else if (fs.existsSync(venvPathUnix)) {
      return venvPathUnix;
    }
    return this.pythonPath;
  }

  private startDaemon(): Promise<void> {
    return new Promise((resolve) => {
      if (daemonProcess) {
        resolve();
        return;
      }

      const daemonScript = path.resolve(__dirname, './ai_daemon.py');
      const localPython = this.getPythonPath();

      logger.info(`Spawning persistent AI Daemon: ${localPython} ${daemonScript}`);
      
      daemonProcess = spawn(localPython, [daemonScript], {
        detached: true,
        stdio: 'ignore'
      });

      daemonProcess.unref();

      setTimeout(() => {
        logger.success('AI Daemon spawn sequence complete. Warmup delay elapsed.');
        resolve();
      }, 5000);
    });
  }

  private async makeRequest(endpoint: string, body: any, retries = 1): Promise<any> {
    try {
      const response = await fetch(`${this.daemonUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI Daemon returned error ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (err: any) {
      if ((err.code === 'ECONNREFUSED' || err.message.includes('fetch failed')) && retries > 0) {
        logger.warn('AI Daemon not reachable. Initiating startup...');
        await this.startDaemon();
        return this.makeRequest(endpoint, body, retries - 1);
      }
      throw err;
    }
  }

  async runOCR(filePath: string): Promise<any> {
    return this.makeRequest('/ocr', { file_path: filePath });
  }

  async runEnsemble(payload: any): Promise<any> {
    return this.makeRequest('/ensemble', payload);
  }
}
export default AIService;
