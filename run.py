from flask import Flask, render_template, jsonify, g
from flask_bootstrap import Bootstrap
import os
import sqlite3
from sqlite3 import Error
import pandas as pd

app = Flask(__name__)
bootstrap = Bootstrap(app)


DATABASE = os.path.join(os.path.dirname(__file__), 'database.sqlite3')
CANDIDATE_CSV = os.path.join(os.path.dirname(__file__), 'static', 'data', 'dem_candidates.csv')
DEM_PRIMARY_CSV = os.path.join(os.path.dirname(__file__), 'static', 'data', 'dem_primary.csv')


@app.route("/")
@app.route("/index")
def home():
    return render_template("home.html", candidates=candidates, states=states)


@app.route("/api/get_candidate_data", methods=['GET'])
def get_candidate_data():
    return jsonify(candidates), 200


@app.route("/api/get_state_data", methods=['GET'])
def get_state_data():
    return jsonify(states), 200


@app.route("/about")
def about():
    return render_template("about.html")


@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404


def append_default_results(candidates, states):
    # Collect default poll numbers for candidates
    results = {}
    for c in candidates:
        results[c['name']] = c['poll']
    # Append result to every state
    for state in states:
        state['results'] = [results]


def get_db():
    try:
        conn = sqlite3.connect(DATABASE)
        conn.row_factory = dict_factory
        return conn
    except Error as e:
        print(e)


def csv_to_db(conn, csvfile, table_name):
    df = pd.read_csv(csvfile)
    df.to_sql(table_name, conn, if_exists='replace')


def query_db(query, args=(), one=False):
    c = get_db().execute(query, args)
    res = c.fetchall()
    c.close()
    return (res[0] if res else None) if one else res


def dict_factory(c, row):
    d = {}
    for idx, col in enumerate(c.description):
        d[col[0]] = row[idx]
    return d

conn = get_db()
csv_to_db(conn, CANDIDATE_CSV, "candidates_table")
csv_to_db(conn, DEM_PRIMARY_CSV, "states_table")
conn.close()

candidates = query_db('''SELECT * FROM candidates_table ORDER BY poll DESC ''')
states = query_db('''SELECT * FROM states_table''')
append_default_results(candidates, states)
print(states)

if __name__ == '__main__':
    # localhost:5000
    app.run(debug=True)
