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
        "date": "3-17-2020",
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
    candidates = [("Joe Biden", 51), ("Bernie Sanders", 24.5), ("Kamala Harris", 12.3),
                  ("Beto ORourke", 6), ("Elizabeth Warren", 3), ("Cory Booker", 1.5),
                  ("Amy Klobuchar", 1), ("Pete Buttigieg", 0.7)]
    colors = [ "#F7464A", "#46BFBD", "#FDB45C", "#FEDCBA","#ABCDEF", "#DDDDDD", "#ABCABC" ]
    return render_template(
        "home.html",
        candidates=candidates,
        set=zip(default_values, candidates, colors)
    )


@app.route("/api/get_candidate_data", methods=['GET'])
def get_candidate_data():
    return jsonify({'candidates': candidates})


@app.route("/api/get_state_data", methods=['GET'])
def get_state_data():
    return jsonify({'states': states})


@app.route("/about")
def about():
    return render_template("about.html")


@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404

# localhost:5000
if __name__ == "__main__":
    app.run(debug=True)
