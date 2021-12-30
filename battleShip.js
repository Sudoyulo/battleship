const util = require("util");

const generateBoard = (shipLocations) => {
  let board = [[], [], [], [], [], [], [], [], [], []];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      board[r].push("?");
    }
  }

  for (let ship in shipLocations) {
    if (ship.length === 1) {
      for (let location of shipLocations[ship]) {
        if (location[0] !== undefined) {
          if (shipLocations.damaged.indexOf(location) >= 0) {
            // remove hit from list
            shipLocations[ship][shipLocations[ship].indexOf(location)] = null;
          } else {
            board[location[0]][location[1]] = ship.toUpperCase();
          }
        }
      }
    }
  }

  for (let miss of shipLocations.missed) {
    // console.log("miss?", miss);
    if (miss[0] !== undefined) {
      board[miss[0]][miss[1]] = "🌍";
    }
  }

  for (let hit of shipLocations.damaged) {
    // console.log("miss?", miss);
    if (hit[0] !== undefined) {
      board[hit[0]][hit[1]] = "🛑";
    }
  }


  return board;
};

const attackTarget = (target, strike) => {

  for (let ship in target) {
    for (let location of target[ship]) {
      // console.log(location, strike);
      if (location === strike) {
        console.log("Hit at ", strike)
        target.damaged.push(location);
        return target;
      }
    }
  }
  
  console.log("Missed at ", strike);
  target.missed.push(strike);
  return target;
};

const displayRemainder = (commander) => {

  console.log("player:", commander.name);
  console.log("ships remaining:", 17 - commander.damaged.length);

  for (let battleship in commander) {
    if (battleship.length === 1) {
      commander[battleship] = commander[battleship].map(part => {
        if (part === null) {
          return "💥";
        } else {
          return "😃";
        }
      });

    }
  }

  console.log("Carrier", commander.c);
  console.log("battleship", commander.b);
  console.log("Cruiser", commander.k);
  console.log("Sumbarine", commander.s);
  console.log("Destroyer", commander.d);

};


let player = {
  c: ["","","","",""],
  b: ["","","",""],
  k: ["","",""],
  s: ["","",""],
  d: ["",""],
  name: "player",
  damaged: [],
  missed: [],
};

let opponent = {
  c: ["00","01","02","03","04"],
  b: ["10","11","12","13"],
  k: ["20","21","22"],
  s: ["30","31","32"],
  d: ["40","41"],
  name: "com",
  damaged: [],
  missed: [],
};

let playerGuess = ["00","01","62","03","04"];
let attackSpot = "13";

for (let guess of playerGuess) {
  opponent = attackTarget(opponent, guess);
  // let pBoard = generateBoard(opponent);
  // console.log(util.inspect(pBoard, { compact: true }));
}
opponent = attackTarget(opponent, attackSpot);

let pBoard = generateBoard(opponent);
let oBoard = generateBoard(player);
// console.log("Opponent Board");
// console.log(util.inspect(pBoard, { compact: true }));
// console.log("Player Board");
// console.log(util.inspect(oBoard, { compact: true }));
// console.log("PLAYERS", player, opponent);

displayRemainder(opponent);

// console.log(opponent.c[1][0]);