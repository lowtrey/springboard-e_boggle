from flask import Flask, render_template, session, request, jsonify, redirect
from boggle import Boggle

app = Flask(__name__)
boggle_game = Boggle()

# Configure Key for Session
app.config["SECRET_KEY"] = "oh-so-secret"


@app.route("/")
def show_game():
    """Display Board & Form | Start Session"""
    # Get board from session
    if "board" in session:
        board = session.get("board")
    else:
        # Create board | Save board & play count to session
        board = boggle_game.make_board()
        session["board"] = board
    return render_template("board.html", board=board)


@app.route("/guess")
def validate_guess():
    """Validate Submitted Guess | Return Response Message"""
    board = session.get("board")
    guess = request.args.get("guess", " ")
    message = boggle_game.check_valid_word(board, guess)
    response = jsonify({"result": message})
    return response


@app.route("/update")
def update_stats():
    """Update User Stats"""
    new_score = int(request.args.get("score"))
    response = jsonify(boggle_game.update_stats(new_score))
    return response


@app.route("/reset")
def reset_game():
    """Clear Session | Reset Game"""
    session.clear()
    return redirect("/")