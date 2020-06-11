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

// Handle Guess Form Submission
$("#guessForm").on("submit", async function (event) {
  event.preventDefault();

  const $guess = $("#guess").val();

  const guessResponse = await validateGuess($guess);

  const message = generateMessage($guess, guessResponse);

  $("#message").text(message);
});
