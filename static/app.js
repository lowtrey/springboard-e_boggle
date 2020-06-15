$(window).on("load", () => {
  const timer = setInterval(countdown, 1000);

  countdown();

  function countdown() {
    $("#seconds").text(`${parseInt($("#seconds").text()) - 1}`);
    const secondsLeft = $("#seconds").text();
    const timesUp = secondsLeft === "0";
    updateColor(secondsLeft);
    if (timesUp) endGame();
  }

  function updateColor(seconds) {
    if (seconds === "20") {
      $("#seconds").css("color", "khaki");
    } else if (seconds === "10") {
      $("#seconds").css("color", "lightcoral");
    }
  }

  async function endGame() {
    const message = await updateStats($("#score").text());
    clearInterval(timer);
    $("#seconds").text("Time's Up!");
    $("#guessForm").slideUp();
    $("#restart").delay(1000).slideDown();
    $("#scoreMessage").text(message);
  }
});

async function updateStats(score) {
  const response = await axios.get("/update", {
    params: {
      score,
    },
  });

  return response.data;
}

// Validate Guessed Word
const validateGuess = async (guessedWord) => {
  const response = await axios.get("/guess", {
    params: {
      guess: guessedWord,
    },
  });

  return response.data.result;
};

// Generate Response Message
const generateMessage = (guessedWord, responseText) => {
  const message =
    responseText === "ok"
      ? `"${guessedWord}" found!`
      : responseText === "not-on-board"
      ? `"${guessedWord}" isn't on the board. Try again...`
      : `"${guessedWord}" isn't a valid word. Try again...`;

  return message;
};

const showMessage = (message) => {
  $("#message").text(message).slideDown().delay(1000).slideUp();
};

// Handle Guess Form Submission
$("#guessForm").on("submit", async function (event) {
  event.preventDefault();

  const $guess = $("#guess").val();
  const guessResponse = await validateGuess($guess);
  const message = generateMessage($guess, guessResponse);
  const wordFound = guessResponse === "ok";

  showMessage(message);

  if (wordFound) updateScore();

  $("#guess").val("");
});

// Score Functionality
const $scoreBox = $("#scoreBox");
const $score = $("#score");

function updateScore() {
  // initialize score to zero
  if (!$score.text()) {
    $score.text("0");
  } else {
    // update score - animate if first point
    $score.text(`${parseInt($score.text()) + 1}`);
    if ($score.text() === "1") {
      $scoreBox.slideToggle();
    }
  }
}

// Reset Game (not board)
$("#restartButton").on("click", () => location.reload());
