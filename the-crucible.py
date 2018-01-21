from flask import Flask, render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'snooker')

COLLECTION_NAME = 'extended'


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


@app.route('/rivalries')
def head_to_head():
    return render_template('rivalries.html')


@app.route('/results')
def results():

    FIELDS = {
        '_id': False, 'year': True, 'round': True,
        'winner': True, 'winner_nat': True,
        'winner_score': True, 'loser': True,
        'loser_nat': True, 'loser_score': True,
        'player_1_result': True, 'tournament_stage': True,
        'match_number': True
    }

    with MongoClient(MONGO_URI) as conn:

        collection = conn[DBS_NAME][COLLECTION_NAME]
        results = collection.find(projection=FIELDS)

        return json.dumps(list(results))


if __name__ == '__main__':
    app.run()
