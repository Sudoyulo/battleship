/* eslint-disable no-undef */

$(() => {
  $("#hit-me").click(buttonPress);
  // $("#grocery-aisle tr:last").after("<tr><td>22</td></tr>")
  generateBoard(6)
});

const buttonPress = () => {
  console.log("button pushed")
}

const generateBoard = (size) => {

  const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] //10

  for (let i = 0; i < size; i++) {
    $("#grocery-aisle").after("<tr></tr>")
    for (let j = 0; j < size; j++) {
      $("#grocery-aisle").after('<td>' + alphabet[i] + String(j) + '</td>')
      // board[i].push([alphabet[i] + String(j)])
    }
  }
  console.log(board)

}