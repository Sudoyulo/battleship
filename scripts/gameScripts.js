
$(function () {
  newGameOptions()
  $("#new-game").click((e) => newGameHandler(e));

  //testing
  generateBoard(5)
  $(".mapPoint").click((e) => mapClickHandler(e));
});

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] //10

let placedLocation = [];
let veggieSizes = [5, 4, 3, 3];
let setup = false;

const newGameHandler = (e) => {
  e.preventDefault()
  clearBoard();

  placedLocation = ["A4", "B4"];
  veggieSizes = [5, 4, 3, 3];

  var sizeChosen = $('#ng-dropdown').find(":selected").text();
  generateBoard(sizeChosen)
  $(".mapPoint").click((e) => mapClickHandler(e));

  posSetup()

}

const clearBoard = () => {
  $("#grocery-aisle").empty();
}

const generateBoard = (size) => {

  for (let i = 0; i < size; i++) {
    $("#grocery-aisle").append("<tr id=" + "row" + i + "></tr>")
    for (let j = 0; j < size; j++) {
      let locationMarker = alphabet[i] + String(j);
      $("#row" + i).append('<td id="' + locationMarker + '"><button class="mapPoint"> ? </button></td>')
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

const mapClickHandler = (e) => {
  e.preventDefault()
  let aimCoords = $(e.target).parent().attr('id')
  console.log("aimed at", aimCoords)

  if (setup && !placedLocation.includes(aimCoords)) { //unique
    placedLocation.push(aimCoords)
    console.log(placedLocation)
  }
}

const posSetup = () => {
  setup = true;
  $("#message").text("Place your veggies XXXXX")

  $(".mapPoint").hover((e) => { giveGlow(e) }, (e) => { takeGlow(e) })
}


const giveGlow = (e) => {
  let sameRow = $(e.target).parent().parent().children()
  // $(hovering).css({ background: "blue" })
  // console.log($(hovering).next().length)
  // $(hovering).next().css({ background: "blue" })
  let clickIndex = $(e.target).parent().index()
  console.log(sameRow)
  let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieSizes[2])
  $(nextLocation).css({ background: "blue" })

}

const takeGlow = (e) => {
  let hovering = $(e.target).parent().parent().children()
  $(hovering).css({ background: "gainsboro" })
  $(hovering).next().css({ background: "gainsboro" })
}