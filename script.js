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
    if (board[rowIdx][colIdx].getValue() !== '') return;
    
    board[rowIdx][colIdx].addMark(player);
  };

  const printBoard = () => {
    const boardWithSpaceValues = board.map((row) => row.map((space) => space.getValue()));
    console.log(boardWithSpaceValues);
  };

  const checkWinRow = (row) => {
    const previousValue = board[row][0].getValue();
    for (let i = 1; i < columns; i++) {
      const currValue = board[row][i].getValue();
      if (currValue !== previousValue) {
        return false;
      }
    }
    return true;
  };

  const checkWinColumn = (col) => {
    const previousValue = board[0][col].getValue();
    for (let i = 1; i < rows; i++) {
      const currValue = board[i][col].getValue();
      if (currValue !== previousValue) {
        return false;
      }
    }
    return true;
  };

  const checkWinDiagonals = (row, col) => {
    // Top left to bottom right diagonal
    if (row === col) {
      const previousValue = board[0][0].getValue();
      for (let i = 1; i < rows; i++) {
        const currValue = board[i][i].getValue();
        if (currValue !== previousValue) {
          return false;
        }
      }
      return true;
    }
    // Bottom left to top right diagonal
    if ((Number(row) + Number(col)) == (rows - 1)) {
      const previousValue = board[rows - 1][0].getValue();
      for (let i = 1; i < rows; i++) {
        const currValue = board[rows - 1 - i][i].getValue();
        if (currValue !== previousValue) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  const checkWin = (row, col) => {
    if (checkWinColumn(col) || checkWinRow(row) || checkWinDiagonals(row, col)) {
      movesExist = false;
      return true;
    }
  };

  const checkDraw = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (board[i][j].getValue() === '') {
          return false;
        }
      }
    }
    return true;
  };

  return {getBoard, markSpace, printBoard, checkWin, checkDraw};
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
      token: 'O'
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
      `Dropping ${getActivePlayer().name}'s token into row ${row} and column ${col}...`
    );
    board.markSpace(row, col, getActivePlayer().token);

    if (board.checkWin(row, col)) {
      board.printBoard();
      console.log(`${getActivePlayer().name} won!`);
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {playRound, getActivePlayer, getBoard: board.getBoard, checkWin: board.checkWin, checkDraw: board.checkDraw};
};

function ScreenController() {
  let game;
  let gameOver = false;
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');
  const btn = document.querySelector('.resetStart');
  const playerOneInput = document.querySelector("#playerOneName");
  const playerTwoInput = document.querySelector("#playerTwoName");

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    const rows = board.length;
    const cols = board[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const spaceButton = document.createElement("button");
        const space = board[i][j];
        spaceButton.classList.add("space");
        spaceButton.dataset.row = i;
        spaceButton.dataset.column = j;
        spaceButton.textContent = space.getValue();
        boardDiv.appendChild(spaceButton);
      }
    }
  }

  function clickHandlerBoard(e) {
    const board = game.getBoard();
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    const activePlayer = game.getActivePlayer();

    if (!selectedColumn || !selectedRow) return;
    if (board[selectedRow][selectedColumn].getValue() !== '') return;
    if (gameOver) return;

    game.playRound(selectedRow, selectedColumn);
    updateScreen();
    if (game.checkWin(selectedRow, selectedColumn)) {
      gameOver = true;
      playerTurnDiv.textContent = `${activePlayer.name} won!`;
    }
    if (game.checkDraw()) {
      gameOver = true;
      playerTurnDiv.textContent = `Draw!`;
    }
  }


  btn.addEventListener("click", () => {
    const oneName = playerOneInput.value;
    const twoName = playerTwoInput.value;
    gameOver = false;
    game = GameController(oneName, twoName);
    boardDiv.addEventListener("click", clickHandlerBoard);
    updateScreen();
  })
}

ScreenController();
