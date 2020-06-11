from flask import Flask, render_template, session
from boggle import Boggle

app = Flask(__name__)
boggle_game = Boggle()
# Configure Key for Session
app.config["SECRET_KEY"] = "oh-so-secret"


@app.route("/")
def show_game():
    """Display Board & Form | Start Session"""

    if "board" in session:

        board = session.get("board")

    else:

        board = boggle_game.make_board()

        session["board"] = board

    return render_template("board.html", board=board)
