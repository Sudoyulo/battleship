
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

  placedLocation = [];
  veggieSizes = [2, 5, 4, 3, 3];

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
  let addThis = null;
  let addList = [];
  let keepAdding = true;
  console.log("aimed at", aimCoords)

  if (setup && !placedLocation.includes(aimCoords)) { //setup
    let sameRow = $(e.target).parent().parent().children()
    let clickIndex = $(e.target).parent().index()
    let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieSizes[0])

    // console.log("add", nextLocation.attr('id'))
    if (nextLocation.length === veggieSizes[0]) { //good size
      addThis = $(e.target).parent().attr('id')

      for (let i = 0; i < veggieSizes[0]; i++) {
        if (placedLocation.includes(addThis)) {
          keepAdding = false;
        }
        addList.push(addThis)
        addThis = $(sameRow[clickIndex + i + 1]).attr('id')
      }
      // console.log("ready to add:", addList)
      if (keepAdding) {
        placedLocation = placedLocation.concat(addList)
        veggieSizes.shift()
      } else {
        console.log("failed to add")
        keepAdding = true;
      }

    } else {
      console.log("too short")
    }

    console.log("all", placedLocation)
  } else {
    console.log("already included")
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
  // console.log(sameRow)
  let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieSizes[0])
  $(nextLocation).css({ background: "blue" })

}

const takeGlow = (e) => {
  let hovering = $(e.target).parent().parent().children()
  $(hovering).css({ background: "gainsboro" })
  $(hovering).next().css({ background: "gainsboro" })
}