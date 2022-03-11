const generateBoard = (row, col) => {

  board = [];
  for (let i = 0; i < row; i++) {
    board.push([]);
    for (let j = 0; j < col; j++) {
      board[i].push([String(i) + String(j)])
    }
  }
  console.log(board)

}

generateBoard(3, 3);