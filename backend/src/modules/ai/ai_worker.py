import sys
import json
import os

# Append root folder to sys.path so we can import ai_engine
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))

try:
    import ai_engine
except ImportError as e:
    print(json.dumps({"error": f"Failed to import ai_engine: {str(e)}"}))
    sys.exit(1)

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing command or arguments"}))
        sys.exit(1)
        
    cmd = sys.argv[1]
    
    if cmd == "ocr":
        file_path = sys.argv[2]
        try:
            res = ai_engine.ocr_extraction_service(file_path)
            print(json.dumps(res))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
            sys.exit(1)
            
    elif cmd == "ensemble":
        payload_str = sys.argv[2]
        try:
            payload = json.loads(payload_str)
            engine = ai_engine.get_engine()
            res = engine.run_ensemble(payload)
            print(json.dumps(res))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
            sys.exit(1)
            
    else:
        print(json.dumps({"error": "Unknown command"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
