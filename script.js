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

  return {getBoard, markSpace, printBoard};
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
    console.log(`${getActivePlayer().name}'s switchPlayerTurn.`);
  };

  const playRound = (row, col) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into row ${row + 1} and column ${col + 1}...`
    );
    board.markSpace(row, col, getActivePlayer().token);

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return {playRound, getActivePlayer};
}

const game = GameController();