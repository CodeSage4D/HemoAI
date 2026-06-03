import sys
import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

try:
    import ai_engine
except ImportError as e:
    print(f"Failed to import ai_engine: {str(e)}")
    sys.exit(1)

print("WARMUP: Initializing MultiModelHybridEngine...")
engine = ai_engine.get_engine()
print("WARMUP: Engine ready.")

class AIDaemonHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        print(f"[DAEMON] {format%args}")

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')

        try:
            body = json.loads(post_data) if post_data else {}
        except Exception:
            self.send_error_response(400, "Invalid JSON payload")
            return

        if parsed_url.path == "/ocr":
            file_path = body.get("file_path")
            if not file_path or not os.path.exists(file_path):
                self.send_error_response(400, "Missing or invalid file_path")
                return

            try:
                res = ai_engine.ocr_extraction_service(file_path)
                self.send_json_response(res)
            except Exception as e:
                self.send_error_response(500, f"OCR execution failed: {str(e)}")

        elif parsed_url.path == "/ensemble":
            try:
                res = engine.run_ensemble(body)
                self.send_json_response(res)
            except Exception as e:
                self.send_error_response(500, f"Ensemble calculation failed: {str(e)}")

        else:
            self.send_error_response(404, "Endpoint not found")

    def send_json_response(self, data, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def send_error_response(self, status, message):
        self.send_json_response({"error": message}, status)

def run(port=8081):
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, AIDaemonHandler)
    print(f"[DAEMON] AI microservice daemon running on http://127.0.0.1:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    print("[DAEMON] Server stopping...")

if __name__ == "__main__":
    port = 8081
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
    run(port)
