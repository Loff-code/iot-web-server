function random() {
    return Math.floor(Math.random() * 10 * 2);
}

function countMines(board) {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            if (board[row][col] === 'x') continue;
            let neighbors = 0;
            for (let newRow = -1; newRow < 2; newRow++) {
                if (row + newRow < 0 || row + newRow >= board.length) continue;
                for (let newCol = -1; newCol < 2; newCol++) {
                    if (col + newCol < 0 || col + newCol >= board.length) continue;
                    if (board[row + newRow][col + newCol] === 'x') neighbors++;
                }
            }
            board[row][col] = neighbors;
        }
    }
}

function placeMines(board, mines) {
    while (mines > 0) {
        let row = random();
        let col = random();
        if (board[row][col] == 0) {
            board[row][col] = 'x';
            mines--;
        }
    }
}
const numberColors = {
    1: 'blue',
    2: 'green',
    3: 'red',
    4: 'darkblue',
    5: 'maroon',
    6: 'turquoise',
    7: 'black',
    8: 'gray'
};

function checkWin() {
    let unrevealed = 0;
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (!cell.classList.contains('revealed')) {
                unrevealed++;
            }

        }
    }
    if (unrevealed === 99) {
        if (confirm("You Won!\nTry again?")) {
            location.reload();
        }
    }
}

function reveal(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell.classList.contains('revealed') || cell.classList.contains('flagged')) return;
    cell.classList.add('revealed');
    const value = board[row][col];
    if (value !== 0 && value !== 'x') {
        cell.textContent = value;
        cell.style.color = numberColors[value] || 'black';
    } else if (value === 'x') {
        cell.textContent = '💣';
    }

    if (value === 0) {
        for (let newRow = row - 1; newRow <= row + 1; newRow++) {
            for (let newCol = col - 1; newCol <= col + 1; newCol++) {
                if (
                    newCol < 0 || newCol >= board.length ||
                    newRow < 0 || newRow >= board.length ||
                    (row === newRow && col === newCol)
                ) continue;
                reveal(newRow, newCol);
            }
        }
    }
    if (value === 'x') {
        clearInterval(timerInterval);
        setTimeout(() => {
            if (confirm("You lost!\nTry again?")) {
                location.reload();
            }
        }, 50);
    }
    checkWin();
}

function flagging(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell.classList.contains('revealed')) return;
    if (cell.classList.contains('flagged')) {
        cell.classList.remove('flagged');
        cell.textContent = '';
        flags++;
    } else {
        cell.classList.add('flagged');
        cell.textContent = '🚩';
        flags--;
    }
    document.getElementById('flag-count').textContent = `🚩 ${flags}`;
}

function flagReveal(row, col) {
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell.classList.contains('revealed')) return;
    let mines = 0;
    for (let newRow = row - 1; newRow <= row + 1; newRow++) {
        for (let newCol = col - 1; newCol <= col + 1; newCol++) {
            if (
                newCol < 0 || newCol >= board.length ||
                newRow < 0 || newRow >= board.length ||
                (row === newRow && col === newCol)
            ) continue;
            const neighbor = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
            if (neighbor.classList.contains('flagged')) mines++;
        }
    }
    if (mines === board[row][col]) {
        for (let newRow = row - 1; newRow <= row + 1; newRow++) {
            for (let newCol = col - 1; newCol <= col + 1; newCol++) {
                if (
                    newCol < 0 || newCol >= board.length ||
                    newRow < 0 || newRow >= board.length ||
                    (row === newRow && col === newCol)
                ) continue;
                const neighbor = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
                if (!neighbor.classList.contains('flagged')) reveal(newRow, newCol);
            }
        }
    }
}
function AIBoost() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

            if (cell.classList.contains('revealed')) {
                const value = board[row][col];

                if (value > 0 && value < 9) {
                    let flagged = 0;
                    let unrevealed = [];

                    for (let newRow = row - 1; newRow <= row + 1; newRow++) {
                        for (let newCol = col - 1; newCol <= col + 1; newCol++) {
                            if (newRow < 0 || newRow >= board.length) {
                                continue;
                            }
                            if (newCol < 0 || newCol >= board.length) {
                                continue;
                            }
                            if (newRow === row && newCol === col) {
                                continue;
                            }

                            const neighbor = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);

                            if (neighbor.classList.contains('flagged')) {
                                flagged++;
                            } else if (!neighbor.classList.contains('revealed')) {
                                unrevealed.push({ row: newRow, col: newCol });
                            }
                        }
                    }

                    if (unrevealed.length > 0 && value - flagged === unrevealed.length) {
                        for (const n of unrevealed) {
                            flagging(n.row, n.col);
                        }
                    }
                }
            }
        }
    }
}

function AIReveal() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board.length; col++) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell.classList.contains('revealed')) {
                flagReveal(row, col)
            }

        }

    }
}

function AI100() {
    for (let index = 0; index < 100; index++) {
        AIBoost()
        AIReveal()

    }

}


function Play(firstClickRow, firstClickCol, x) {
    do {
        board = Array.from({ length: x }, () => Array(x).fill(0));
        placeMines(board, 99);
        countMines(board);
    } while (board[firstClickRow][firstClickCol] != 0);
    window.board = board;
}

const boardElement = document.getElementById('board');
let board;
let firstClick = true;
const SIZE = 20;
let flags = 99;
let timerInterval;
let startTime;

for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (firstClick && e.button === 0) {
                firstClick = false;
                Play(row, col, SIZE);
                startTime = Date.now();
                timerInterval = setInterval(() => {
                    const seconds = Math.floor((Date.now() - startTime) / 1000);
                    document.getElementById('timer').textContent = `⏱️ ${seconds}`;
                }, 1000);
                reveal(row, col);
                return;
            }
            if (e.button === 0) reveal(row, col);
            else if (e.button === 2) flagging(row, col);
            else if (e.button === 1) flagReveal(row, col);
        });
        boardElement.appendChild(cell);
    }
}

document.addEventListener('contextmenu', (e) => e.preventDefault());
