from flask import Flask, render_template, jsonify
from flask_bootstrap import Bootstrap

app = Flask(__name__)
bootstrap = Bootstrap(app)

# temp data
candidates = [
    {
        "name": "Joe Biden",
        "color": "red"
    },
    {
        "name": "Bernie Sanders",
        "color": "blue"
    },
    {
        "name": "Kamala Harris",
        "color": "purple"
    }
]
states = [
    {
        "name": "Florida",
        "initial": "FL",
        "delegates": 219,
        "super": 29,
        "type": "closed primary",
        "allocation": "proportional",
        "date": "2020-3-17",
        "results": {
            "Joe Biden": 51,
            "Bernie Sanders": 30,
            "Kamala Harris": 19
        }
    },
    {
        "name": "Iowa",
        "initial": "IA",
        "delegates": 41,
        "super": 8,
        "type": "closed caucus",
        "allocation": "proportional",
        "date": "2020-2-3",
        "results": {
            "Joe Biden": 51,
            "Bernie Sanders": 30,
            "Kamala Harris": 19
        }
    },
    {
        "name": "New Hampshire",
        "initial": "NH",
        "delegates": 24,
        "super": 9,
        "type": "open primary",
        "allocation": "proportional",
        "date": "2020-2-11",
        "results": {
            "Joe Biden": 51,
            "Bernie Sanders": 30,
            "Kamala Harris": 19
        }
    }
]


default_values = [51, 24, 11, 6, 4, 2, 1, 1]

@app.route("/")
@app.route("/index")
def home():
    return render_template(
        "home.html",
        candidates=candidates,
        states=states,
        default_values=default_values
    )


@app.route("/api/get_candidate_data", methods=['GET'])
def get_candidate_data():
    return jsonify(candidates)


@app.route("/api/get_state_data", methods=['GET'])
def get_state_data():
    return jsonify(states)


@app.route("/about")
def about():
    return render_template("about.html")


@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404

# localhost:5000
if __name__ == "__main__":
    app.run(debug=True)
