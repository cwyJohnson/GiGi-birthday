from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def homepage():
    return render_template('homepage.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/birthdaypage')
def birthdaypage():
    return render_template('birthdaypage.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/cake', methods=['GET', 'POST'])
def cake():
    return render_template('cake.html')

@app.route('/album')
def album():
    return render_template('album.html')

@app.route('/albumv2')
def albumv2():
    return render_template('albumv2.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
