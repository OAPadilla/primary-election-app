from flask import Flask, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)
bootstrap = Bootstrap(app)

@app.route("/")
@app.route("/index")
def home():
    candidates = ["Joe Biden", "Bernie Sanders", "Kamala Harris", "Beto O'Rourke",
                  "Elizabeth Warren", "Cory Booker", "Amy Klobuchar", "Pete Buttigieg"]
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


@app.route("/*")
def error404():
    return render_template("404.html")


if __name__ == "__main__":
    app.run(debug=True)
