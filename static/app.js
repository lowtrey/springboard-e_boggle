// Handle Guess Submission
$("#guessForm").on("submit", async function (event) {
  event.preventDefault();

  const $guess = $("#guess").val();

  const response = await axios.get("/guess", {
    params: {
      guess: $guess,
    },
  });

  const { result } = response.data;

  // Determine Message and Show to User
  const message =
    result === "ok"
      ? "Word found!"
      : result === "not-on-board"
      ? "That word isn't on the board. Try again..."
      : "That's not a valid word. Try again...";

  $("#message").text(message);

  console.log($guess, result);
});
