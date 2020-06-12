$(window).on("load", function () {
  const timer = setInterval(countdown, 1000);

  function countdown() {
    // TODOS:
    // - Change timer text to red when under 20 seconds
    // - Slide Guess form up when time is up
    // - slide restart button down when time is up
    $("#seconds").text(`${parseInt($("#seconds").text()) - 1}`);

    if ($("#seconds").text() === "20") {
      $("#seconds").css("color", "khaki");
    } else if ($("#seconds").text() === "10") {
      $("#seconds").css("color", "lightcoral");
    } else if ($("#seconds").text() === "0") {
      clearInterval(timer);
      $("#seconds").text("Time's Up!");
      $("#guessForm").slideUp();
      $("#restart").delay(1000).slideDown();
    }
  }
});

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
  // TODO: chain the lines below together
  $("#message").text(message);
  $("#message").slideDown().delay(1000).slideUp();
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
$("#restartButton").on("click", function () {
  location.reload();
});
