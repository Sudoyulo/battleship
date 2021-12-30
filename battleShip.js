const util = require("util");

const generateBoard = (shipLocations) => {
  let board = [[], [], [], [], [], [], [], [], [], []];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      board[r].push("?");
    }
  }

  for (let ship in shipLocations) {
    for (let location of shipLocations[ship]) {
      board[location[0]][location[1]] = ship.toUpperCase();
    }
  }

  return board;
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
};

let g = generateBoard(opponent);
console.log(util.inspect(g, { compact: true }));

// console.log(opponent.c[1][0]);