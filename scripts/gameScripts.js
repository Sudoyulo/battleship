const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] //10
const gameIcons = ["🍉", "🧅", "🫑", "🍆", "🌽"];
const veggieSizes = [5, 4, 3, 3];

let veggieToDo = [...veggieSizes];
let gameSize = $('#ng-dropdown').find(":selected").text();
let setup = true;

const P1 = {
  name: "P1",
  pieceLocations: [],
  hitLocations: ["A1", "D1", "C3"],
  missedLocations: [],
  icon: null
}

const P2 = {
  name: "P2",
  pieceLocations: [],
  hitLocations: ["A1", "D1", "C3"],
  missedLocations: [],
  icon: null
}

const newGameHandler = (e) => {
  e.preventDefault()

  P1.icon = gameIcons[Math.floor(Math.random() * 4)];
  let remainIcon = gameIcons.filter(item => item !== P1.icon)
  P2.icon = remainIcon[Math.floor(Math.random() * 3)];
  P1.pieceLocations = [];
  P2.pieceLocations = [];
  veggieToDo = [...veggieSizes];
  setup = true;
  gameStart = false;
  gameSize = $('#ng-dropdown').find(":selected").text();

  generateBoard(gameSize)
  posSetup() //place locations
  showLives(P1, P2);
  showLives(P2, P1);

  $(".mapPoint").click((e) => mapClickHandler(e));
  $("#my-field").empty();
  $("#message").text(nextSizeMessage)

}

$(function () {
  newGameOptions()
  $("#new-game").click((e) => newGameHandler(e));

});

const generateBoard = (size) => {
  $("#grocery-aisle").empty();

  for (let i = 0; i < size; i++) {
    $("#grocery-aisle").append("<tr id=" + "row" + i + "></tr>")
    for (let j = 0; j < size; j++) {
      let locationMarker = alphabet[i] + String(j);
      $("#row" + i).append('<td id="' + locationMarker + '"><button class="mapPoint"> ? </button></td>')
    }
  }

  $("#grocery-aisle td").css({
    width: 62 / size + "vw",
    height: 44 / size + "vh"
  })
  $(".mapPoint").css({
    width: 31 / size + "vw",
    height: 22 / size + "vh"
  })

}

const newGameOptions = () => {
  for (let i = 5; i < 9; i++) {
    $("#ng-dropdown").append("<option>" + i + "</option>")
  }
}

const mapClickHandler = (e) => {
  e.preventDefault()

  if (setup) {
    let aimCoords = $(e.target).parent().attr('id')
    setup = validPlacement(P1, aimCoords)

    if (!setup) {
      generateMiniBoard(gameSize);
      resetMainBoard();
      autoGenerateP2();
    }
  }

  if (gameStart) {
    showLives(P1, P2);
    showLives(P2, P1);
  }

}

const validPlacement = (player, coords) => {

  let addThis = null;
  let addList = [];
  let keepAdding = true; //my location array < number of ships

  if (!player.pieceLocations.includes(coords)) { // not already used
    let sameRow = $("#" + coords).parent().children()
    let clickIndex = $("#" + coords).index()
    let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieToDo[0])

    if (nextLocation.length === veggieToDo[0]) { //good size

      for (let i = 0; i < veggieToDo[0]; i++) {
        if (player.pieceLocations.includes(coords)) {
          keepAdding = false;
        }
        addList.push(coords)
        coords = $(sameRow[clickIndex + i + 1]).attr('id')
      }

      if (keepAdding) {
        player.pieceLocations = player.pieceLocations.concat(addList)
        veggieToDo.shift()
        $("#message").text(nextSizeMessage)
        if (player.name === "P1") { refreshBoard(player) } //show spots
        if (veggieToDo.length === 0) { return false; } //done

      } else {
        if (player.name === "P1") { setWarning("failed to add") }
        keepAdding = true;
      }
    } else {
      if (player.name === "P1") { setWarning("tooshort") }
    }
  }
  return true;
}

const setWarning = (message) => {
  $("#warning").text(message)
  setTimeout(() => {
    $("#warning").text("")
  }, 1000)
}

const nextSizeMessage = () => {
  let message = "";
  if (veggieToDo.length > 0) {
    message = "Next is width: " + veggieToDo[0]
  }
  return message;
}

const posSetup = () => {
  $(".mapPoint").hover((e) => { giveGlow(e) }, (e) => { takeGlow() })
}

const giveGlow = (e) => {
  let sameRow = $(e.target).parent().parent().children()
  let clickIndex = $(e.target).parent().index()
  let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieToDo[0])
  $(nextLocation).css({ background: "blue" })
}

const takeGlow = () => {
  $(".mapPoint").parent().css({ background: "gainsboro" })
}

const refreshBoard = (player) => {
  player.pieceLocations.forEach((location) => {
    $("#" + location).html(player.icon).css({ background: "gainsboro" })
  })
}

const generateMiniBoard = (size) => {
  $("#my-field").empty();

  for (let i = 0; i < size; i++) {
    $("#my-field").append("<tr id=" + "myrow" + i + "></tr>")
    for (let j = 0; j < size; j++) {
      let locationMarker = alphabet[i] + String(j);
      // console.log("placed, put", placedLocation, locationMarker)
      if (P1.pieceLocations.includes(locationMarker)) {
        $("#myrow" + i).append('<td id="m' + locationMarker + '"><p class="mini-map"> ' + P1.icon + ' </p></td>')
      } else {
        $("#myrow" + i).append('<td id="m' + locationMarker + '"><p class="mini-map"> &nbsp - &nbsp </p></td>')
      }
    }
  }

  $("#myfield-td").css({
    width: 44 / size + "vw",
    height: 22 / size + "vh"
  })
  $(".mini-map").css({
    width: 22 / size + "vw",
    height: 11 / size + "vh"
  })

}

const resetMainBoard = () => {

  P1.pieceLocations.forEach((location) => {
    $("#" + location).html('<button class="mapPoint"> ? </button>')
    $("#" + location).children().click((e) => mapClickHandler(e))
  })

  $(".mapPoint").css({
    width: 31 / gameSize + "vw",
    height: 22 / gameSize + "vh"
  })

}

const autoGenerateP2 = () => {

  veggieToDo = [...veggieSizes];
  const sum = veggieToDo.reduce((a, b) => a + b, 0)

  while (P2.pieceLocations.length < sum) {
    P2continue = validPlacement(P2, randomSpot())
  }

  gameStart = true;
}

const randomSpot = () => {

  let spot = "";
  spot = alphabet[Math.floor(Math.random() * gameSize)] + String(Math.floor(Math.random() * gameSize));
  return spot;
}

const showLives = (player1, player2) => {

  let $table = $(".user-ships-" + player1.name)
  let veggieList = [];

  $table.empty();

  veggieSizes.forEach((size) => {
    veggieList.push(player1.pieceLocations.splice(0, size))
  })

  let hitMiss = veggieList.map((section) => {

    let iconOrX = section.map((piece) => {

      if (player2.hitLocations.includes(piece)) {
        return "X"
      }

      return player1.icon
    })

    return "<p>" + iconOrX.join("") + "</p > "

  })

  $($table).append(hitMiss)

}