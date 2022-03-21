
$(function () {
  newGameOptions()
  $("#new-game").click((e) => newGameHandler(e));

  //testing
  // generateBoard(5)
  // $(".mapPoint").click((e) => mapClickHandler(e));
});

const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"] //10
const gameIcons = ["🍉", "🧅", "🫑", "🍆", "🌽"];

let placedLocation = [];
let p2Location = [];
let veggieSizes = [5, 4, 3, 3];
let veggieToDo = [...veggieSizes];
let p1setup = true;
let gameStart = false;
let gameSize = $('#ng-dropdown').find(":selected").text();
let myIcon = gameIcons[Math.floor(Math.random() * 4)];
let remainIcon = gameIcons.filter(item => item !== myIcon)
let p2Icon = remainIcon[Math.floor(Math.random() * 3)];

const p1 = {
  pieceLocations: [],
  icon: myIcon
}

const p2 = {
  pieceLocations: [],
  icon: p2Icon
}

const newGameHandler = (e) => {
  e.preventDefault()

  p1.icon = gameIcons[Math.floor(Math.random() * 4)];
  let remainIcon = gameIcons.filter(item => item !== p1.icon)
  p2.icon = remainIcon[Math.floor(Math.random() * 3)];
  p1.pieceLocations = [];
  p2.pieceLocations = [];
  veggieToDo = [...veggieSizes];
  p1setup = true;
  gameStart = false;
  gameSize = $('#ng-dropdown').find(":selected").text();

  generateBoard(gameSize)
  posSetup() //place locations

  $(".mapPoint").click((e) => mapClickHandler(e));
  $("#my-field").empty();
  $("#message").text(nextSizeMessage)

}

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

  if (p1setup) {
    let aimCoords = $(e.target).parent().attr('id')
    p1setup = validPlacement(p1, aimCoords)

    if (!p1setup) {
      generateMiniBoard(gameSize);
      resetMainBoard();
      autoGenerateP2();
    }
  }

  if (gameStart) {
  }

}

const validPlacement = (player, coords) => {

  console.log("oioi", player, coords)

  let addThis = null;
  let addList = [];
  let keepAdding = true; //my location array < number of ships

  if (!player.pieceLocations.includes(coords)) { // not already used
    let sameRow = $("#" + coords).parent().children()
    let clickIndex = $("#" + coords).index()
    let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieToDo[0])

    console.log(nextLocation.length, veggieToDo[0])
    if (nextLocation.length === veggieToDo[0]) { //good size
      addThis = coords

      for (let i = 0; i < veggieToDo[0]; i++) {
        if (player.pieceLocations.includes(addThis)) {
          keepAdding = false;
        }
        addList.push(addThis)
        addThis = $(sameRow[clickIndex + i + 1]).attr('id')
      }

      if (keepAdding) {
        player.pieceLocations = player.pieceLocations.concat(addList)
        addList = [];
        veggieToDo.shift()
        $("#message").text(nextSizeMessage)
        refreshBoard(player)

        if (veggieToDo.length === 0) { //start game chain here
          return false;
        }

      } else {
        setWarning("failed to add")
        keepAdding = true;
      }

    } else {
      setWarning("too short");
    }
    // console.log("all", player.pieceLocations)
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
      if (p1.pieceLocations.includes(locationMarker)) {
        $("#myrow" + i).append('<td id="m' + locationMarker + '"><p class="mini-map"> ' + p1.icon + ' </p></td>')
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

  p1.pieceLocations.forEach((location) => {
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

  while (p2.pieceLocations.length < sum) {
    p2continue = validPlacement(p2, randomSpot())
  }

  gameStart = true;
}

const randomSpot = () => {

  let spot = "";
  spot = alphabet[Math.floor(Math.random() * gameSize)] + String(Math.floor(Math.random() * gameSize));
  return spot;
}
