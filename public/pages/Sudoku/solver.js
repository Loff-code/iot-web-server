async function fetchSudokuData() {
  const response = await fetch('https://sudoku-api.vercel.app/api/dosuku');
  const json = await response.json();
  const puzzle = json?.newboard?.grids?.[0]?.value;
  const solution = json?.newboard?.grids?.[0]?.solution;
  return { puzzle, solution };
}

function rules(board, row, col) {
  const num = board[row][col];
  if (num === 0) return true;
  for (let i = 0; i < 9; i++) {
    if ((board[row][i] === num && i !== col) || (board[i][col] === num && i !== row)) return true;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (board[i][j] === num && (i !== row || j !== col)) return true;
    }
  }
  return false;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function recursive(board, std, row, col) {
  if (row === 9) return true;
  const nextRow = row + Math.floor((col + 1) / 9);
  const nextCol = (col + 1) % 9;
  if (std[row][col]) return await recursive(board, std, nextRow, nextCol);
  for (let i = 1; i <= 9; i++) {
    board[row][col] = i;
    if (!rules(board, row, col)) {
      updateCell(row, col, i);
      await sleep(20);
      if (await recursive(board, std, nextRow, nextCol)) return true;
    }
  }
  board[row][col] = 0;
  updateCell(row, col, '');
  await sleep(20);
  return false;
}

function updateCell(row, col, value) {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (cell) {
    cell.textContent = value;
    cell.classList.add('solved');
  }
}

function displayBoard(board, std, tableId, fixedClass, solvedClass) {
  const table = document.getElementById(tableId);
  table.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('td');
      cell.id = tableId === 'sudoku' ? `cell-${i}-${j}` : null;
      const val = board[i][j];
      cell.textContent = val > 0 ? val : '';
      if (val > 0) {
        cell.classList.add(fixedClass);
        if (std) std[i][j] = 1;
      } else {
        if (std) std[i][j] = 0;
      }
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
}

async function startSolver() {
  const { puzzle, solution } = await fetchSudokuData();
  const std = Array.from({ length: 9 }, () => Array(9).fill(0));
  displayBoard(puzzle, std, 'sudoku', 'fixed', 'solved');
  displayBoard(solution, null, 'solution', 'fixed', '');
  await sleep(500);
  await recursive(puzzle, std, 0, 0);
}
