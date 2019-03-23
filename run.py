from flask import Flask, render_template
from flask_bootstrap import Bootstrap

app = Flask(__name__)
bootstrap = Bootstrap(app)


c = ["Joe Biden", "Bernie Sanders", "Kamala Harris", "Beto O'Rourke",
     "Elizabeth Warren", "Cory Booker", "Amy Klobuchar", "Pete Buttigieg"]

@app.route("/")
@app.route("/index")
def home():
    return render_template(
        "home.html",
        candidates=c
    )


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/*")
def error404():
    return render_template("404.html")


if __name__ == "__main__":
    app.run(debug=True)
