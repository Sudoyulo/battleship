/* eslint-disable no-undef */

$(() => {
  $("#hit-me").click(buttonPress);
  $("#grocery-aisle tr:last").after("<tr><td>22</td></tr>")
});

const buttonPress = () => {
  console.log("button pushed")
}

const generateBoard = (row, col) => {

  board = [];
  for (let i = 0; i < row; i++) {
    board.push(i);
    for (let j = 0; j < col; j++) {
      board[i].push(j)
    }
  }
  console.log(board)

}

generateBoard(3, 3);