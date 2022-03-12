/* eslint-disable no-undef */

$(function () {
  generateBoard(5);
  newGameOptions()
  $("#new-game").click((e) => newGameHandler(e));
  // $(".mapPoint").click((e) => mapClickHandler(e, $(this).parent().attr('id')))
  $(".mapPoint").click((e) => mapClickHandler(e, e.target))

  // $(".mapPoint").click(function (e) { console.log(e.target) })

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
      let locationMarker = alphabet[i] + String(j);
      $("#row" + i).append('<td id="' + locationMarker + '"><button class="mapPoint" id="' + locationMarker + '"> ? </button></td>')
    }
  }

  $("td").css({
    width: 62 / size + "vw",
    height: 62 / size + "vh"
  })
  $(".mapPoint").css({
    width: 31 / size + "vw",
    height: 31 / size + "vh"
  })

}

const newGameOptions = () => {
  for (let i = 5; i < 9; i++) {
    $("#ng-dropdown").append("<option>" + i + "</option>")
  }
}

const mapClickHandler = (e, target) => {
  e.preventDefault()
  let aimCoords = $(target).parent().attr('id')
  console.log("aimed at", aimCoords)
}