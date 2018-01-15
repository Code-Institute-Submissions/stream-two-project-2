from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def champions():
    return render_template('champions.html')


@app.route('/tournaments')
def tournaments():
    return render_template('tournaments.html')


@app.route('/matches')
def matches():
    return render_template('matches.html')


@app.route('/frames')
def frames():
    return render_template('frames.html')


@app.route('/players')
def players():
    return render_template('players.html')


@app.route('/countries')
def countries():
    return render_template('countries.html')


@app.route('/h2h')
def head_to_head():
    return render_template('head_to_head.html')


if __name__ == '__main__':
    app.run()
