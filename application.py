"""application.py: Primary Draft Interactive Primary Election 2020 Flask Application"""

from flask import Flask, render_template, jsonify, g
from flask_bootstrap import Bootstrap
import os
import sqlite3
from sqlite3 import Error
import pandas as pd

__author__ = "Oscar Antonio Padilla"
__copyright__ = "Copyright 2019, Primary Draft"
__email__ = "PadillaOscarA@gmail.com"
__status__ = "Development"

application = Flask(__name__)
bootstrap = Bootstrap(application)


DATABASE = os.path.join(os.path.dirname(__file__), 'database.sqlite3')
CANDIDATE_CSV = os.path.join(os.path.dirname(__file__), 'static', 'data', 'dem_candidates.csv')
DEM_PRIMARY_CSV = os.path.join(os.path.dirname(__file__), 'static', 'data', 'dem_primary.csv')


@application.route("/")
def home():
    return render_template("home.html",
        candidates=candidates,
        states=states,
        total_delegates=total_delegates,
        default_results=default_results
    )


@application.route("/api/get_candidate_data", methods=['GET'])
def get_candidate_data():
    return jsonify(candidates), 200


@application.route("/api/get_state_data", methods=['GET'])
def get_state_data():
    return jsonify(states), 200


@application.route("/api/get_default_results_data", methods=['GET'])
def get_default_results_data():
    return jsonify(default_results), 200


@application.route("/about")
def about():
    return render_template("about.html")


@application.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404


def get_total_delegates(states):
    """
    Returns total number of delegates for all states in the state data
    """
    total = 0
    for state in states:
        total += state['delegates']
    return total

def get_default_results(candidates):
    """
    Returns default national poll numbers for candidates
    """
    results = {}
    for c in candidates:
        results[c['name']] = c['poll']
    return results

def append_empty_results(candidates, states):
    """
    Appends empty results to each state in the state data
    """ 
    results = {}
    for c in candidates:
        results[c['name']] = 0
    for state in states:
        state['results'] = [results]


def get_db():
    """
    Creates connection with sqlite database
    """
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = dict_factory
        return conn
    except Error as e:
        print(e)


def csv_to_db(conn, csvfile, table_name):
    """
    Converts a CSV file to a SQL database table
    """
    df = pd.read_csv(csvfile)
    df.to_sql(table_name, conn, if_exists='replace')


def query_db(query, args=(), one=False):
    """
    Query a database
    """
    c = get_db().execute(query, args)
    res = c.fetchall()
    c.close()
    return (res[0] if res else None) if one else res


def dict_factory(c, row):
    """
    Forms dictionary from database data in support of row_factory
    """
    d = {}
    for idx, col in enumerate(c.description):
        d[col[0]] = row[idx]
    return d

""" Create CANDIDATE and STATE tables from CSV files """
conn = get_db()
csv_to_db(conn, CANDIDATE_CSV, "candidates_table")
csv_to_db(conn, DEM_PRIMARY_CSV, "states_table")
conn.close()

""" Query database and prepare data for client """
candidates = query_db('''SELECT * FROM candidates_table ORDER BY poll DESC ''')
states = query_db('''SELECT * FROM states_table''')
default_results = get_default_results(candidates)
append_empty_results(candidates, states)
total_delegates = get_total_delegates(states)

if __name__ == '__main__':
    application.run(debug=True)
