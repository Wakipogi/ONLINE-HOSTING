from flask import Flask, request, jsonify
import os
import subprocess
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

running_processes = {}

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"message": "No file uploaded"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    return jsonify({"message": f"File {filename} uploaded successfully"}), 200

@app.route("/deployed", methods=["GET"])
def deployed_files():
    files = os.listdir(UPLOAD_FOLDER)
    return jsonify(files)

@app.route("/start", methods=["POST"])
def start_file():
    data = request.get_json()
    filename = data["filename"]
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    if filename in running_processes:
        return jsonify({"message": f"{filename} is already running"}), 400

    process = subprocess.Popen(["python", filepath])
    running_processes[filename] = process
    return jsonify({"message": f"{filename} started"}), 200

@app.route("/stop", methods=["POST"])
def stop_file():
    data = request.get_json()
    filename = data["filename"]

    if filename not in running_processes:
        return jsonify({"message": f"{filename} is not running"}), 400

    running_processes[filename].terminate()
    del running_processes[filename]
    return jsonify({"message": f"{filename} stopped"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)