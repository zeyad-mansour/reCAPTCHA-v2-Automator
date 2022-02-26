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
    if request.method == 'POST':
        if 'file' not in request.files:
            print('No file attached in request')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            print('No file selected')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            print(filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
            path =(os.path.join(app.config['UPLOAD_FOLDER'],filename))
            print("path :",path)	   
            result = path.split("/")
            filename2 = result[-1:]
            print("fname :" ,filename2)
            filename1 = " ".join(filename2)               
	    	    
    return render_template('index.html')

if __name__ == "__main__":
    app.run()
