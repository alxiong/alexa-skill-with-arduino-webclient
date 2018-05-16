exports.moveLeft = (beforeState) =>{
  var moved = false;
  var puzzle_state = beforeState;
  loop1:
  for (row=0; row<3;row++){
    // only inspect 2nd and 3rd col
  loop2:
    for (col=1; col<3; col++){
      if (puzzle_state[row][col-1] == null) {
        puzzle_state[row][col-1] = puzzle_state[row][col];
        puzzle_state[row][col] = null;
        moved = true;
        break loop1;
      }
    }
  }
  if (moved) {
    return {
      state: puzzle_state,
      validity: true
    };
  } else {
    console.log("Invalid move!");
    return {
      state: puzzle_state,
      validity: false
    };
  }
}
exports.moveRight = (beforeState) =>{
  var moved = false;
  var puzzle_state = beforeState;
  loop1:
  for (row=0; row<3;row++){
    // only inspect 1st and 2nd col
  loop2:
    for (col=0; col<2; col++){
      if (puzzle_state[row][col+1] == null) {
        puzzle_state[row][col+1] = puzzle_state[row][col];
        puzzle_state[row][col] = null;
        moved = true;
        break loop1;
      }
    }
  }
  if (moved) {
    return {
      state: puzzle_state,
      validity: true
    };
  } else {
    console.log("Invalid move!");
    return {
      state: puzzle_state,
      validity: false
    };
  }
}
exports.moveUp = (beforeState) =>{
  var moved = false;
  var puzzle_state = beforeState;
  // only inspect the 2nd and 3rd row
  loop1:
  for (row=1; row<3;row++){
  loop2:
    for (col=0; col<3; col++){
      if (puzzle_state[row-1][col] == null) {
        puzzle_state[row-1][col] = puzzle_state[row][col];
        puzzle_state[row][col] = null;
        moved = true;
        break loop1;
      }
    }
  }
  if (moved) {
    return {
      state: puzzle_state,
      validity: true
    };
  } else {
    console.log("Invalid move!");
    return {
      state: puzzle_state,
      validity: false
    };
  }
}
exports.moveDown = (beforeState) =>{
  var moved = false;
  var puzzle_state = beforeState;
  // only inspect the 1st and 2nd row
  loop1:
  for (row=0; row<2;row++){
  loop2:
    for (col=0; col<3; col++){
      if (puzzle_state[row+1][col] == null) {
        puzzle_state[row+1][col] = puzzle_state[row][col];
        puzzle_state[row][col] = null;
        moved = true;
        break loop1;
      }
    }
  }
  if (moved) {
    return {
      state: puzzle_state,
      validity: true
    };
  } else {
    console.log("Invalid move!");
    return {
      state: puzzle_state,
      validity: false
    };
  }
}

exports.checkSucess = (puzzle_state) =>{
  loop1:
  for (row=0; row<3;row++){
  loop2:
    for (col=0; col<3; col++){
      if (row == 2 && col == 2){
        break loop1;
      } else {
        if (puzzle_state[row][col] != row*3+col+1) {
          console.log("puzzle not solved yet!");
          return false;
        }
      }
    }
  }
  console.log("puzzle solved!");
  return true;
}
// this.checkSucess();
// console.log(original_puzzle);

exports.getPosition = (puzzle_state) => {
  loop1:
  for (row=0; row<3;row++){
  loop2:
    for (col=0; col<3; col++){
      if (puzzle_state[row][col] == null) {
        return {
          'row': row,
          'col': col
        };
      }
    }
  }
}
