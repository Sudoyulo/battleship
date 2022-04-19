const alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]; //10
const gameIcons = ["🍉", "🧅", "🫑", "🍆", "🌽"];
const veggieSizes = [5, 4, 3, 3];

let veggieToDo = [...veggieSizes];
let gameSize = $("#ng-dropdown").find(":selected").text();
let setup = true;
let gameStart = false;

const P1 = {
  name: "P1",
  pieceLocations: [],
  hitLocations: [],
  missedLocations: [],
  icon: null,
};

const P2 = {
  name: "P2",
  pieceLocations: [],
  hitLocations: [],
  missedLocations: [],
  icon: null,
};

const newGameHandler = (e) => {
  e.preventDefault();

  P1.icon = gameIcons[Math.floor(Math.random() * 4)];
  let remainIcon = gameIcons.filter((item) => item !== P1.icon);
  P2.icon = remainIcon[Math.floor(Math.random() * 3)];
  P1.pieceLocations = [];
  P2.pieceLocations = [];
  P1.hitLocations = [];
  P1.missedLocations = [];
  P2.hitLocations = [];
  P2.missedLocations = [];
  resetHits();
  veggieToDo = [...veggieSizes];
  setup = true;
  gameStart = false;
  gameSize = $("#ng-dropdown").find(":selected").text();

  generateBoard(gameSize);
  posSetup(); //place locations
  showLives(P1, P2);
  showLives(P2, P1);

  $(".mapPoint").click((e) => mapClickHandler(e));
  $("#my-field").empty();
  $("#warning").text(nextSizeMessage);
};

$(function () {
  newGameOptions();
  $("#new-game").click((e) => newGameHandler(e));
});

const generateBoard = (size) => {
  $("#grocery-aisle").empty();

  for (let i = 0; i < size; i++) {
    $("#grocery-aisle").append("<tr id=" + "row" + i + "></tr>");
    for (let j = 0; j < size; j++) {
      let locationMarker = alphabet[i] + String(j);
      $("#row" + i).append(
        '<td id="' + locationMarker + '"><button class="mapPoint"> ? </button></td>'
      );
    }
  }

  $("#grocery-aisle td").css({
    width: 62 / size + "vw",
    height: 44 / size + "vh",
  });
  $(".mapPoint").css({
    width: 22 / size + "vw",
    height: 22 / size + "vh",
  });
};

const newGameOptions = () => {
  for (let i = 5; i < 9; i++) {
    $("#ng-dropdown").append("<option>" + i + "</option>");
  }
};

const mapClickHandler = (e) => {
  e.preventDefault();

  let aimCoords = "";

  if (setup) {
    aimCoords = $(e.target).parent().attr("id");
    setup = validPlacement(P1, aimCoords);

    if (!setup) {
      generateMiniBoard(gameSize);
      resetMainBoard();
      autoGenerateP2();
      gameStart = true;
    }
  }

  if (gameStart) {
    aimCoords = $(e.target).parent().attr("id");

    attackTurn(P1, P2, aimCoords);

    if (P2.hitLocations.length + P2.missedLocations.length !== 0) {
      attackTurn(P2, P1, randomSpot());
    }

    refreshBoard();
    generateMiniBoard(gameSize);
    showLives(P1);
    showLives(P2);
  }
  aimCoords = "";
};

const validPlacement = (player, coords) => {
  let addThis = null;
  let addList = [];
  let keepAdding = true; //my location array < number of ships

  if (!player.pieceLocations.includes(coords)) {
    // not already used
    let sameRow = $("#" + coords)
      .parent()
      .children();
    let clickIndex = $("#" + coords).index();
    let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieToDo[0]);

    if (nextLocation.length === veggieToDo[0]) {
      //good size

      for (let i = 0; i < veggieToDo[0]; i++) {
        if (player.pieceLocations.includes(coords)) {
          keepAdding = false;
        }
        addList.push(coords);
        coords = $(sameRow[clickIndex + i + 1]).attr("id");
      }

      if (keepAdding) {
        player.pieceLocations = player.pieceLocations.concat(addList);
        veggieToDo.shift();
        $("#warning").text(nextSizeMessage);
        if (player.name === "P1") {
          refreshBoard();
        } //show spots
        if (veggieToDo.length === 0) {
          return false;
        } //done
      } else {
        if (player.name === "P1") {
          setWarning("Failed to add");
        }
        keepAdding = true;
      }
    } else {
      if (player.name === "P1") {
        setWarning("Too short");
      }
    }
  }
  return true;
};

const setWarning = (message) => {
  $("#warning").text(message);
  setTimeout(() => {
    $("#warning").text("");
  }, 2000);
};

const nextSizeMessage = () => {
  let message = "";
  if (veggieToDo.length > 0) {
    message = "Next is width: " + veggieToDo[0];
  }
  return message;
};

const posSetup = () => {
  $(".mapPoint").hover(
    (e) => {
      giveGlow(e);
    },
    (e) => {
      takeGlow();
    }
  );
};

const giveGlow = (e) => {
  let sameRow = $(e.target).parent().parent().children();
  let clickIndex = $(e.target).parent().index();
  let nextLocation = sameRow.slice(clickIndex, clickIndex + veggieToDo[0]);
  $(nextLocation).css({ background: "blue" });
};

const takeGlow = () => {
  $(".mapPoint").parent().css({ background: "gainsboro" });
};

const refreshBoard = () => {
  if (setup) {
    P1.pieceLocations.forEach((location) => {
      $("#" + location)
        .html(P1.icon)
        .css({ background: "gainsboro" });
    });
  } else {
    P2.hitLocations.forEach((location) => {
      $("#" + location)
        .html(P2.icon)
        .css({ background: "gainsboro" });
    });
    P2.missedLocations.forEach((location) => {
      $("#" + location)
        .html("💨")
        .css({ background: "gainsboro" });
    });
  }
};

const generateMiniBoard = (size) => {
  $("#my-field").empty();

  for (let i = 0; i < size; i++) {
    $("#my-field").append("<tr id=" + "myrow" + i + "></tr>");
    for (let j = 0; j < size; j++) {
      let locationMarker = alphabet[i] + String(j);

      if (P1.hitLocations.includes(locationMarker)) {
        $("#myrow" + i).append(
          '<td id="m' + locationMarker + '"><p class="mini-map"> 💥 </p></td>'
        );
      } else if (P1.pieceLocations.includes(locationMarker)) {
        $("#myrow" + i).append(
          '<td id="m' + locationMarker + '"><p class="mini-map"> ' + P1.icon + " </p></td>"
        );
      } else if (P1.missedLocations.includes(locationMarker)) {
        $("#myrow" + i).append(
          '<td id="m' + locationMarker + '"><p class="mini-map"> 💨 </p></td>'
        );
      } else {
        $("#myrow" + i).append(
          '<td id="m' + locationMarker + '"><p class="mini-map"> &nbsp - &nbsp </p></td>'
        );
      }
    }
  }

  $("#myfield-td").css({
    width: 44 / size + "vw",
    height: 22 / size + "vh",
  });
  $(".mini-map").css({
    width: 22 / size + "vw",
    height: 11 / size + "vh",
  });
};

const resetMainBoard = () => {
  P1.pieceLocations.forEach((location) => {
    $("#" + location).html('<button class="mapPoint"> ? </button>');
    $("#" + location)
      .children()
      .click((e) => mapClickHandler(e));
  });

  $(".mapPoint").css({
    width: 31 / gameSize + "vw",
    height: 22 / gameSize + "vh",
  });
};

const autoGenerateP2 = () => {
  veggieToDo = [...veggieSizes];
  const sum = veggieToDo.reduce((a, b) => a + b, 0);

  while (P2.pieceLocations.length < sum) {
    P2continue = validPlacement(P2, randomSpot());
  }
};

const randomSpot = () => {
  let spot = "";
  spot =
    alphabet[Math.floor(Math.random() * gameSize)] + String(Math.floor(Math.random() * gameSize));
  return spot;
};

const showLives = (player1) => {
  let $table = $(".user-ships-" + player1.name);
  let veggieList = [];
  let locationCopy = [...player1.pieceLocations];
  $table.empty();

  veggieSizes.forEach((size) => {
    veggieList.push(locationCopy.splice(0, size));
  });

  let hitMiss = veggieList.map((section) => {
    let iconOrX = section.map((piece) => {
      if (player1.hitLocations.includes(piece)) {
        return "X";
      }
      return player1.icon;
    });
    return "<p>" + iconOrX.join("") + "</p > ";
  });
  $($table).append(hitMiss);
};

const attackTurn = (player1, player2, location) => {
  if (
    player2.pieceLocations.includes(location) &&
    !player2.missedLocations.includes(location) &&
    !player2.hitLocations.includes(location)
  ) {
    if (player1.name === "P1") {
      setWarning("hit");
    }
    player2.hitLocations.push(location);
  } else {
    if (player1.name === "P1" && location !== undefined) {
      setWarning("miss");
      player2.missedLocations.push(location);
    } else if (
      player1.name === "P2" &&
      !player2.missedLocations.includes(location) &&
      !player2.hitLocations.includes(location)
    ) {
      player2.missedLocations.push(location);
    } else if (player1.name === "P2") {
      attackTurn(P2, P1, randomSpot());
    }
  }

  $(".hitcount-" + player1.name).text("Hits: " + player2.hitLocations.length);

  if (player2.hitLocations.length === player1.pieceLocations.length) {
    $("#title").text(player1.name + " wins");
    gameStart = false;
  }
};

const resetHits = () => {
  $(".hitcount-P1").text("Hits: 0");
  $(".hitcount-P2").text("Hits: 0");
};
