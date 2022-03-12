/* eslint-disable no-undef */

$(function () {
  generateBoard(5);
  newGameOptions()
  $("#new-game").click((e) => newGameHandler(e));

});

const newGameHandler = (e) => {
  e.preventDefault()
  clearBoard();
  let $gameSize = $("")

  var sizeChosen = $('#ng-dropdown').find(":selected").text();
  generateBoard(sizeChosen)
}

const clearBoard = () => {
  $("#grocery-aisle").empty();
}

const generateBoard = (size) => {

  const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] //10

  for (let i = 0; i < size; i++) {
    $("#grocery-aisle").append("<tr id=" + "row" + i + "></tr>")
    for (let j = 0; j < size; j++) {
      $("#row" + i).append('<td>' + alphabet[i] + String(j) + '</td>')
    }
  }

  $("td").css("width", 62 / size + "vw")
  $("td").css("height", 62 / size + "vh")

}

const newGameOptions = () => {
  for (let i = 4; i < 9; i++) {
    $("#ng-dropdown").append("<option>" + i + "</option>")
  }
}