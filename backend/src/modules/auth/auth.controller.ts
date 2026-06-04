import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { setTokenCookies, clearTokenCookies } from '../../utils/jwt';
import { sendSuccess } from '../../utils/response';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import { logger } from '../../config/logger';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName, role } = req.body;
      logger.info(`[AuthFlow] Register initiated for: ${email}`);
      const user = await authService.register(email, password, fullName, role);
      logger.info(`[AuthFlow] Register succeeded for: ${email}`);
      return sendSuccess(res, user, 'Registration successful', 201);
    } catch (error: any) {
      logger.error(`[AuthFlow] Register failed for: ${req.body?.email || 'unknown'}. Error: ${error?.message || error}`);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      logger.info(`[AuthFlow] Login initiated for: ${email}`);
      const result = await authService.login(email, password);
      
      logger.info(`[AuthFlow] Credentials verified, setting secure cookies for: ${email}`);
      setTokenCookies(res, result.accessToken, result.refreshToken);
      
      logger.info(`[AuthFlow] Login successful for: ${email}`);
      return sendSuccess(res, { user: result.user, token: result.accessToken }, 'Login successful');
    } catch (error: any) {
      logger.error(`[AuthFlow] Login failed for: ${req.body?.email || 'unknown'}. Error: ${error?.message || error}`);
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refresh_token;
      if (!refreshToken) {
        return res.status(401).json({
          status: 'error',
          message: 'Refresh token missing',
        });
      }

      const result = await authService.refresh(refreshToken);
      setTokenCookies(res, result.accessToken, result.refreshToken);

      return sendSuccess(res, { token: result.accessToken }, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      clearTokenCookies(res);
      return sendSuccess(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, req.user, 'Current user retrieved');
    } catch (error) {
      next(error);
    }
  }
}
export default AuthController;
