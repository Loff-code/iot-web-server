function playRound(playerSelection, computerSelection, choices) {
  const player = choices[playerSelection];
  const pc = choices[computerSelection];
  const outcome = ["Computer", "Player", "Tie"];
  let winner = "";
  if (playerSelection === computerSelection) {
    winner = outcome[2];
  } else if (
    (playerSelection === 0 && computerSelection === 2) ||
    (playerSelection === 1 && computerSelection === 0) ||
    (playerSelection === 2 && computerSelection === 1)
  ) {
    winner = outcome[1];
  } else {
    winner = outcome[0];
  }

  const output = String(
    "Player choice: " +
    player +
    "\nComputer choice: " +
    pc +
    "\nWinner: " +
    winner
  );
  return output;
}

function getComputerChoice() {
  return Math.floor(Math.random() * 3);
}

console.log(playRound(playerSelection, computerSelection, choices));
function play(playerSelection) {
  const choices = ["Rock", "Paper", "Scissor"];
  const computerSelection = getComputerChoice();
  alert(playRound(playerSelection, computerSelection, choices));
}
