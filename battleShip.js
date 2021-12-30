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
        if (shipLocations.damaged.indexOf(location) >= 0) {
          console.log("HIT");
          board[location[0]][location[1]] = "🛑";
        } else if (location[0] !== undefined) {
          board[location[0]][location[1]] = ship.toUpperCase();
        }
      }
    }
  }

  for (let miss of shipLocations.missed) {
    console.log("miss?", miss);
    board[miss[0]][miss[1]] = "🌍";
  }

  return board;
};

const attackTarget = (target, strike) => {

  for (let ship in target) {
    for (let location of target[ship]) {
      // console.log(location, strike);
      if (location === strike) {
        target.damaged.push(location);
        return target;
      }
    }
  }
  
  target.missed.push(strike);
  return target;
};


let player = {
  c: ["","","","",""],
  b: ["","","",""],
  k: ["","",""],
  s: ["","",""],
  d: ["",""],
};

let opponent = {
  c: ["00","01","02","03","04"],
  b: ["10","11","12","13"],
  k: ["20","21","22"],
  s: ["30","31","32"],
  d: ["40","41"],
  damaged: [],
  missed: [],
};

let playerGuess = ["00","01","62","03","04"]

for (let guess of playerGuess) {
  opponent = attackTarget(opponent, guess);
}
let g = generateBoard(opponent);
console.log(util.inspect(g, { compact: true }));
console.log(opponent)

// console.log(opponent.c[1][0]);