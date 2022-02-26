import os
import sys

from flask import Flask, request, redirect, url_for, render_template, send_from_directory
from werkzeug.utils import secure_filename
from PIL import Image





app = Flask(__name__)
DIR_PATH = os.path.dirname(os.path.realpath(__file__))
app.config['UPLOAD_FOLDER'] = "uploads"

# limit upload size upto 10mb
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ('jpg', 'jfif', 'jpeg','png','JPG','JPEG','PNG')


#app = Flask(__name__)

@app.route("/hsiohackathon", methods=['GET', 'POST'])
def index():
    if request.method == 'GET':
        return render_template("index.html")

    f = request.files.getlist("files")

    for file in f:
        if file.read() == b"" or not allowed_file(file):

            return render_template("fail.html")

        file_location = app.config['UPLOAD_FOLDER'] + file.filename
        file.save(file_location)

    return render_template("success.html")

if __name__ == "__main__":
    app.run()
