class BoggleSession {
  constructor() {
    this.timer = setInterval(this.countdown, 1000);
    this.seconds = 15;
  }

  countdown = () => {
    // Countdown Seconds & Update Text Color
    $("#seconds").text(this.seconds);
    if (this.seconds === 20) {
      $("#seconds").css("color", "khaki");
    } else if (this.seconds === 10) {
      $("#seconds").css("color", "lightcoral");
    } else if (this.seconds === 0) {
      this.endSession();
    }

    this.seconds--;
  };

  endSession = async () => {
    const { message, plays } = await this.updateStats($("#score").text());

    clearInterval(this.timer);
    $("#seconds").text("Time's Up!");
    $("#guessForm").slideUp();
    $("#restart").delay(1000).slideDown();
    $("#scoreMessage").text(message);
    $("#plays").text(plays);
  };

  updateStats = async (score) => {
    const response = await axios.get("/update", {
      params: {
        score,
      },
    });

    return response.data;
  };

  // Validate Guessed Word
  validateGuess = async (guessedWord) => {
    const response = await axios.get("/guess", {
      params: {
        guess: guessedWord,
      },
    });

    return response.data.result;
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const response = await this.validateGuess($("#guess").val());
    this.updateScore(response, $("#guess").val().length);
    this.flashMessage(response);

    // Reset Input Field
    $("#guess").val("");
  };

  flashMessage = (message) => {
    $("#message").text(message).slideDown().delay(1000).slideUp();
  };

  // Score Functionality
  updateScore = (responseString, points) => {
    const $score = $("#score");
    const $scoreBox = $("#scoreBox");
    // initialize score to zero
    if (!$score.text()) {
      $score.text("0");
    } else if (responseString.includes("found")) {
      // update and show score
      $score.text(`${parseInt($score.text()) + points}`);
      if (parseInt($score.text()) >= 1) {
        $scoreBox.slideDown();
      }
    }
  };
}

$(window).on("load", () => {
  const Boggle = new BoggleSession();

  // Add Click Handlers
  $("#guessForm").on("submit", Boggle.handleSubmit);
  $("#restartButton").on("click", () => location.reload());
  $("#resetButton").on("click", () => (window.location = "/reset"));
});
