import os
from flask import Flask, request, render_template, flash, redirect, url_for
from werkzeug.utils import secure_filename


UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {'jpg', 'jfif', 'jpeg', 'png'}

app = Flask(__name__)
app.secret_key = os.urandom(12).hex()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
DIR_PATH = os.path.dirname(os.path.realpath(__file__))

# limit upload size to 3mb
app.config['MAX_CONTENT_LENGTH'] = 3 * 1024 * 1024

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/hsiohackathon", methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return render_template("fail.html")
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            return render_template("fail.html")
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return render_template("success.html")
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''


if __name__ == "__main__":
    app.run()
