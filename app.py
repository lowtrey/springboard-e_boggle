from flask import Flask, render_template, session
from boggle import Boggle

app = Flask(__name__)
boggle_game = Boggle()


@app.route("/")
def show_game():
    """Display Board & Form | Start Session"""

    board = boggle_game.make_board()

    return render_template("board.html", board=board)
