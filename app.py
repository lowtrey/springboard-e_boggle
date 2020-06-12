from flask import Flask, render_template, session, request, jsonify
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


@app.route("/guess")
def check_guess():

    board = session.get("board")

    guess = request.args.get("guess", "Oops, something went wrong...")

    message = boggle_game.check_valid_word(board, guess)

    response = jsonify({"result": message})

    return response


@app.route("/update")
def update_stats():

    new_score = int(request.args.get("score"))

    message = boggle_game.update_high_score(new_score)

    return message