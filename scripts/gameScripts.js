
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
veggieSizes = [5, 4, 3, 3];
let setup = true;
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
  p1.pieceLocations, p2.pieceLocations = [];
  veggieSizes = [5, 4, 3, 3];
  setup = true;
  gameSize = $('#ng-dropdown').find(":selected").text();

  generateBoard(gameSize)
  posSetup() //place locations
  randomSpot();
  autoGeneratep2();

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
  let aimCoords = $(e.target).parent().attr('id')
  let addThis = null;
  let addList = [];
  let keepAdding = true;
  console.log("aimed at", aimCoords)

  if (setup) {
    if (validPlacement(p1, e)) { // returns false if setup is over
      generateMiniBoard(gameSize);
      resetMainBoard();
    }
  }

}

const validPlacement = (player, e) => {

  let aimCoords = $(e.target).parent().attr('id')
  let addThis = null;
  let addList = [];
  let keepAdding = true; //my location array < number of ships

  if (!placedLocation.includes(aimCoords)) { // not already used
    let sameRow = $(e.target).parent().parent().children()
    let clickIndex = $(e.target).parent().index()
    let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieSizes[0])

    if (nextLocation.length === veggieSizes[0]) { //good size
      addThis = $(e.target).parent().attr('id')

      for (let i = 0; i < veggieSizes[0]; i++) {
        if (player.pieceLocations.includes(addThis)) {
          keepAdding = false;
        }
        addList.push(addThis)
        addThis = $(sameRow[clickIndex + i + 1]).attr('id')
      }

      if (keepAdding) {
        player.pieceLocations = player.pieceLocations.concat(addList)
        veggieSizes.shift()
        $("#message").text(nextSizeMessage)
        refreshBoard()

        if (veggieSizes.length === 0) { //start game chain here
          setup = false;
          generateMiniBoard(gameSize);
          resetMainBoard();
          return true;
        }

      } else {
        console.log("failed to add")
        keepAdding = true;
      }

    } else {
      console.log("too short")
    }
    console.log("all", player.pieceLocations)

  }


  return false;

}


const nextSizeMessage = () => {
  let message = "";
  if (veggieSizes.length > 0) {
    message = "Next is width: " + veggieSizes[0]
  }
  return message;
}

const posSetup = () => {
  setup = true;
  $(".mapPoint").hover((e) => { giveGlow(e) }, (e) => { takeGlow() })
}

const giveGlow = (e) => {
  let sameRow = $(e.target).parent().parent().children()
  let clickIndex = $(e.target).parent().index()
  let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieSizes[0])
  $(nextLocation).css({ background: "blue" })
}

const takeGlow = () => {
  $(".mapPoint").parent().css({ background: "gainsboro" })
}

const refreshBoard = () => {
  p1.pieceLocations.forEach((location) => {
    $("#" + location).html("X").css({ background: "gainsboro" })
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
    $("#" + location).html('<button class="mapPoint"> ' + p2.icon + ' </button>')
  })

  $(".mapPoint").css({
    width: 31 / gameSize + "vw",
    height: 22 / gameSize + "vh"
  })
}

const autoGeneratep2 = (size) => {

  let locationHolder = [];
  let count = 0;

  while (count < veggieSizes.length) {
    p2Location.push(randomSpot())
    count++;

  }

  console.log("p2", p2Location)

}

const randomSpot = () => {

  let spot = "";
  spot = alphabet[Math.floor(Math.random() * gameSize)] + String(Math.floor(Math.random() * gameSize));
  return spot;
}
