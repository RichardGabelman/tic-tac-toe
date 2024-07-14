function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Space());
    }
  }

  const getBoard = () => board;

  const markSpace = (rowIdx, colIdx, player) => {
    if (!board[rowIdx][colIdx] === '') return;
    
    board[rowIdx][colIdx].addMark(player);
  };

  const printBoard = () => {
    for (let i = 0; i < rows; i++) {
      console.log(board[i]);
    }
  };

  const checkWinRow = (row) => {
    const previousValue = board[row][0];
    for (let i = 1; i < columns; i++) {
      if (!board[row][i] === previousValue) {
        return false;
      }
    }
    return true;
  };

  const checkWinColumn = (col) => {
    const previousValue = board[0][col];
    for (let i = 1; i < rows; i++) {
      if (!board[i][col] === previousValue) {
        return false;
      }
    }
    return true;
  };

  const checkWinDiagonals = (row, col) => {
    // Top left to bottom right diagonal
    if (row === col) {
      const previousValue = board[0][0];
      for (let i = 1; i < rows; i++) {
        if (!board[i][i] === previousValue) {
          return false;
        }
      }
    }
    // Bottom left to top right diagonal
    if ((row + col) === (row - 1)) {
      const previousValue = board[rows - 1][0];
      for (let i = 1; i < rows; i++) {
        if (!board[rows - 1 - i][i] === previousValue) {
          return false;
        }
      }
    }
    return true;
  };

  const checkWin = (row, col) => {
    return (checkWinColumn(col) || checkWinRow(row) || checkWinDiagonals(row, col));
  };

  return {getBoard, markSpace, printBoard, checkWin};
}

function Space() {
  let value = '';

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {addMark, getValue};
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();

  const players = [
    {
      name: playerOneName,
      token: 'X'
    },
    {
      name: playerTwoName,
      token: 'Y'
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s Turn.`);
  };

  const playRound = (row, col) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into row ${row + 1} and column ${col + 1}...`
    );
    board.markSpace(row, col, getActivePlayer().token);

    if (board.checkWin(row, col)) {
      console.log(`${getActivePlayer().name} won!`);
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {playRound, getActivePlayer};
}

const game = GameController();