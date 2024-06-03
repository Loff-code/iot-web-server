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
  const choices = ["Straight", "Gay", "Bi"];
  // var userInput = prompt("Enter a number from 0 to 2:");
  // const playerSelection = parseInt(
  //   prompt(
  //     "Straight beats Bi\nGay beats Straight\nBi beats Gay\n0. Straight | 1. Gay | 2. Bi \nEnter a number from 0 to 2:"
  //   )
  // );
  const computerSelection = getComputerChoice();
  alert(playRound(playerSelection, computerSelection, choices));
}
