import os
from transformers import pipeline

def download_physical_offline_models():
    """
    Physically downloads Heavy PyTorch HuggingFace layers into a local directory array.
    This guarantees true Offline/Air-Gapped deployability on Private Hospital Servers.
    """
    model_path = "./local_models/distilbert"
    if not os.path.exists(model_path):
        os.makedirs(model_path, exist_ok=True)
        print("Downloading raw PyTorch models for offline caching. Please wait...")
        classifier = pipeline("zero-shot-classification", model="typeform/distilbert-base-uncased-mnli")
        classifier.model.save_pretrained(model_path)
        classifier.tokenizer.save_pretrained(model_path)
        print(f"SUCCESS: Physical AI Model extracted securely to {model_path}.")
    else:
        print("Physical Offline Models already exist. Deployable in zero-internet environments.")

if __name__ == "__main__":
    download_physical_offline_models()
