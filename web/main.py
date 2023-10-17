from flask import Flask, render_template, request, redirect, url_for

data = {"username": ""}
app = Flask(__name__, template_folder="pages")

app.static_url_path = "/static"
app.static_folder = "assets"


def authenticate():
    return data["username"] == ""


@app.route("/")
def index():
    if authenticate():
        return redirect(url_for("login"))
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if not authenticate():
        return redirect(url_for("index"))
    if request.method == "POST":
        data["username"] = request.form.get("username")
        return redirect(url_for("index"))

    return render_template("login.html")


@app.route("/logout")
def logout():
    if not authenticate():
        data["username"] = ""

    return redirect(url_for("login"))


# Game page
@app.route("/game")
def game():
    if authenticate():
        return redirect(url_for("login"))
    return render_template("game.html", name=data["username"])


# Portfolio page
@app.route("/portfolio")
def portfolio():
    return render_template("portofolio.html", name=data["username"])


# Quiz page
@app.route("/quiz")
def quiz():
    if authenticate():
        return redirect(url_for("login"))
    return render_template("quiz.html", name=data["username"])


# Chat page
@app.route("/chat")
def chat():
    if authenticate():
        return redirect(url_for("login"))
    return render_template("chat.html", name=data["username"])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
