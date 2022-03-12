/* eslint-disable no-undef */

$(() => {
  $("#hit-me").click(buttonPress);
  // $("#grocery-aisle tr:last").after("<tr><td>22</td></tr>")
  generateBoard(5)
  newGameOptions()
});

const buttonPress = () => {
  console.log("button pushed")
}

const generateBoard = (size) => {

  const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] //10

  for (let i = 0; i < size; i++) {
    $("#grocery-aisle").append("<tr id=" + "row" + i + "></tr>")
    for (let j = 0; j < size; j++) {
      $("#row" + i).append('<td>' + alphabet[i] + String(j) + '</td>')
    }
  }

  $("td").css("width", 65 / size + "vw")
  $("td").css("height", 62 / size + "vh")

}

const newGameOptions = () => {
  for (let i = 4; i < 9; i++) {
    $("#ng-dropdown").append("<option>" + i + "</option>")
  }
}