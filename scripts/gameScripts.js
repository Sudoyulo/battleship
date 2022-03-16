
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
veggieSizes = [5, 4, 3, 3];
let setup = true;
let gameSize = $('#ng-dropdown').find(":selected").text();

const newGameHandler = (e) => {
  e.preventDefault()


  placedLocation = [];
  veggieSizes = [5, 4, 3, 3];

  gameSize = $('#ng-dropdown').find(":selected").text();
  generateBoard(gameSize)
  $(".mapPoint").click((e) => mapClickHandler(e));
  $("#my-field").empty();
  $("#message").text(nextSizeMessage)
  posSetup() //place locations

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

  if (setup && !placedLocation.includes(aimCoords)) { //setup
    let sameRow = $(e.target).parent().parent().children()
    let clickIndex = $(e.target).parent().index()
    let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieSizes[0])

    if (nextLocation.length === veggieSizes[0]) { //good size
      addThis = $(e.target).parent().attr('id')

      for (let i = 0; i < veggieSizes[0]; i++) {
        if (placedLocation.includes(addThis)) {
          keepAdding = false;
        }
        addList.push(addThis)
        addThis = $(sameRow[clickIndex + i + 1]).attr('id')
      }
      if (keepAdding) {
        placedLocation = placedLocation.concat(addList)
        veggieSizes.shift()
        $("#message").text(nextSizeMessage)
        refreshBoard()

        if (veggieSizes.length === 0) { //start game chain here
          setup = false
          generateMiniBoard(gameSize);
          resetMainBoard();
        }


      } else {
        console.log("failed to add")
        keepAdding = true;
      }

    } else {
      console.log("too short")
    }
    console.log("all", placedLocation)
  } //end

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
  placedLocation.forEach((location) => {
    $("#" + location).html("X").css({ background: "gainsboro" })
  })
}

const generateMiniBoard = (size) => {
  $("#my-field").empty();
  let myIcon = gameIcons[Math.floor(Math.random() * 4)];

  for (let i = 0; i < size; i++) {
    $("#my-field").append("<tr id=" + "myrow" + i + "></tr>")
    for (let j = 0; j < size; j++) {
      let locationMarker = alphabet[i] + String(j);
      // console.log("placed, put", placedLocation, locationMarker)
      if (placedLocation.includes(locationMarker)) {
        $("#myrow" + i).append('<td id="m' + locationMarker + '"><p class="mini-map"> ' + myIcon + ' </p></td>')
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

  placedLocation.forEach((location) => {
    $("#" + location).html('<button class="mapPoint"> ? </button>')
  })

  $(".mapPoint").css({
    width: 31 / gameSize + "vw",
    height: 22 / gameSize + "vh"
  })
}