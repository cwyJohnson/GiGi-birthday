from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cake', methods=['GET', 'POST'])
def cake():
    return render_template('cake.html')

@app.route('/album')
def album():
    return render_template('album.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)