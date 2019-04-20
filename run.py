from flask import Flask, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)
bootstrap = Bootstrap(app)

@app.route("/")
@app.route("/index")
def home():
    candidates = [("Joe Biden", 51), ("Bernie Sanders", 24.5), ("Kamala Harris", 12.3),
                  ("Beto ORourke", 6), ("Elizabeth Warren", 3), ("Cory Booker", 1.5),
                  ("Amy Klobuchar", 1), ("Pete Buttigieg", 0.7)]
    values = [29, 23, 10, 8, 7, 4, 2, 1]
    colors = [ "#F7464A", "#46BFBD", "#FDB45C", "#FEDCBA","#ABCDEF", "#DDDDDD", "#ABCABC" ]
    return render_template(
        "home.html",
        candidates=candidates,
        set=zip(values, candidates, colors)
    )


@app.route("/about")
def about():
    return render_template("about.html")


@app.errorhandler(404)
def page_not_found(error):
    return render_template("404.html"), 404

# localhost:5000
if __name__ == "__main__":
    app.run(debug=True)
