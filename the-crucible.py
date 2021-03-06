from flask import Flask, render_template
from pymongo import MongoClient
import json
import os

app = Flask(__name__)

# Connection details for the Mongo database, including localhost to allow local editing.

MONGO_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017')
DBS_NAME = os.getenv('MONGO_DB_NAME', 'snooker')

MATCH_COLLECTION = 'extended'
TOURNAMENT_COLLECTION = 'records'
CAREER_COLLECTION = 'careers'

# Define the routes for each page on the site.

@app.route('/')
def champions():
	return render_template('champions.html')


@app.route('/results')
def results():
	return render_template('results.html')


@app.route('/matches')
def matches():
	return render_template('matches.html')


@app.route('/players')
def players():
	return render_template('players.html')


@app.route('/rivalries')
def rivalries():
	return render_template('rivalries.html')


@app.route('/yearstats')
def yearstats():
	return render_template('yearstats.html')

@app.route('/careers')
def careers():
	return render_template('careers.html')

# Define the routes for each data set, declaring the required fields.

@app.route('/match_data')
def match_data():

	FIELDS = {
		'_id': False, 'year': True, 'round': True,
		'winner': True, 'winner_nat': True,
		'winner_score': True, 'loser': True,
		'loser_nat': True, 'loser_score': True,
		'player_1': True, 'player_2': True,
		'player_1_result': True, 'round_code': True,
		'tournament_stage': True, 'match_number': True,
		'player_1_nat': True, 'player_2_nat': True,
		'player_1_score': True, 'player_2_score': True,
		'margin': True, 'match_up': True, 'player_1_win': True,
		'player_2_win': True, 'scoreline': True, 'frames_played': True
	}

	with MongoClient(MONGO_URI) as conn:

		collection = conn[DBS_NAME][MATCH_COLLECTION]
		match_data = collection.find(projection=FIELDS)

		return json.dumps(list(match_data))


@app.route('/year_data')
def year_data():

	FIELDS = {
		'_id': False, 'year': True, 'result': True,
		'result_code': True, 'player': True, 'country': True,
		'frames_played': True, 'frames_won': True,
		'frames_lost': True, 'frame_win_pct': True,
		'record_type': True
	}

	with MongoClient(MONGO_URI) as conn:

		collection = conn[DBS_NAME][TOURNAMENT_COLLECTION]
		year_data = collection.find(projection=FIELDS)

		return json.dumps(list(year_data))

@app.route('/career_data')
def career_data():

	FIELDS = {
		'_id': False, 'player': True, 'country': True,
		'first': True, 'last': True, 'tournaments': True,
		'best_performance': True, 'first_round': True, 'last_16': True,
		'quarter_finals': True, 'semi_finals': True, 'runner_up': True,
		'winner': True, 'matches_played': True, 'matches_won': True,
		'matches_lost': True, 'match_win_pct': True, 'frames_played': True,
		'frames_won': True, 'frames_lost': True, 'frame_win_pct': True,
		'record_type': True
	}

	with MongoClient(MONGO_URI) as conn:

		collection = conn[DBS_NAME][CAREER_COLLECTION]
		career_data = collection.find(projection=FIELDS)

		return json.dumps(list(career_data))


if __name__ == '__main__':
	app.run()
