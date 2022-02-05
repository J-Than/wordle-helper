// Declare universal variables
let knownLetters = ['','','','',''];
let goodLetters = [];
let badLetters = [];
let maybeLetters = [];
let twoLetters = [];
let threeLetters = [];
let badPosition = [[],[],[],[],[]];
let currentWord = 0;
let currentLetter = 0;
let allWords;
let possibleWords;
const colorArray = ['neutral-letter', 'white-letter', 'black-letter', 'yellow-letter', 'green-letter'];

// Declare classes
class Word {
  constructor(row) {
    this.button = [
      document.getElementById(`slot-${row}-0`),
      document.getElementById(`slot-${row}-1`),
      document.getElementById(`slot-${row}-2`),
      document.getElementById(`slot-${row}-3`),
      document.getElementById(`slot-${row}-4`)];
    this.color = [0,0,0,0,0];
    this.letter = ['-','-','-','-','-']
    this.row = row;
    this.word = '-----'
  }

  updateLetter(index, letter) {
    this.slot[index].letter = letter;
    this.checkLetter(index, letter);
  }

  checkLetter(index, letter) {
    if (knownLetters[index] === letter
    let colorSlots = [];
    word0.checkColor(letter);
    if (this.row > 0) {
      word1.checkColor(letter)
    }
    if (this.row > 1) {
      word2.checkColor(letter)
    }
    if (this.row > 2) {
      word3.checkColor(letter)
    }
    if (this.row > 3) {
      word4.checkColor(letter)
    }
  }

  checkColor(letter) {
    if (this.letter.includes(letter)) {
      let color0 = this.color[this.letter.indexOf(letter)];
      if (this.letter.filter(n => n === letter).length > 1)
    }
  }

  setColor(index, color) {
    this.color[index] = color;
  }

  update() {
    this.word = ''.concat('',
      this.button[0].textContent.toLowerCase()).concat('',
      this.button[1].textContent.toLowerCase()).concat('',
      this.button[2].textContent.toLowerCase()).concat('',
      this.button[3].textContent.toLowerCase()).concat('',
      this.button[4].textContent.toLowerCase());
    this.color = [
      colorArray.findIndex((e) => e === this.button[0].className),
      colorArray.findIndex((e) => e === this.button[1].className),
      colorArray.findIndex((e) => e === this.button[2].className),
      colorArray.findIndex((e) => e === this.button[3].className),
      colorArray.findIndex((e) => e === this.button[4].className),
    ];
    this.letter = this.word.split('');
  }
}

class Letter {
  constructor(letter) {
    this.letter = letter;
    this.keyboard = 0;
    this.slot = [0,0,0,0,0];
    this.keyLock = false;
  }

  changeColor(index) {
    if (this.slot[index] === 3) {this.slot[index]-= 4};
    this.slot[index]++;
    this.storeKeyboardColor();
    updateAllColors();
  }

  storeKeyboardColor() {
    this.keyboard = Math.max(...this.slot);
    // updateKeyboardColor();
  }
}

// Build objects
const letters = {}
for (let i=0; i<26; i++) {
  let letter = String.fromCharCode(97 + i);
  letters[letter] = new Letter(letter);
}

row0 = new Word(0);
row1 = new Word(1);
row2 = new Word(2);
row3 = new Word(3);
row4 = new Word(4);
const grid = [row0, row1, row2, row3, row4];

// Pull in word list
fetch ('answerlist.json')
.then (r => r.json())
.then ((j) => {
  let wordArray = [];
  for (let i=0; i < j.length; i++) {
    wordArray.push(j[i]['word']);
  }
  allWords = wordArray;
  possibleWords = wordArray;
})

// Resets the page
const reset = function() {
  // window.location.reload();
  word0 = new Word(0);
  console.log(word0.word);
  console.log(word0.button);
  console.log(word0.color);
  console.log(word0.letter);
}

// Handles updating color of buttons on spots
const spotColorChanger = function(event) {
  let button = event.target;
  let parse = button.id.split('');
  let index = parseInt(parse[parse.length-1]);
  letters[button.textContent.toLowerCase()].changeColor(index);
}

// Updates color of slot button
const updateSlotColor = function(button, index) {
  color = letters[button.textContent.toLowerCase()].slot[index];
  button.className = colorArray[color];
  if (color === 0) {
    activateButton(button);
  } else if (color === 2) {
    activateButton(button);
  }
}

// Update colors of all elements
const updateAllColors = function() {
  for (let i=0; i<5; i++) {
    for (let j=0; j<5; j++) {
      let button = document.getElementById(`slot-${i}-${j}`);
      if (button.textContent !== '-') {
        button.className = colorArray[letters[button.textContent.toLowerCase()].slot[j]];
      }
    }
  }
}

// Converts white letters to black on update
const convertToBlack = function() {
  for (let i=0; i < 5; i++) {
    let button = document.getElementById(`slot-${currentWord}-${i}`);
    if (button.className === 'white-letter') {
      letters[button.textContent.toLowerCase()].changeColor(i);
    }
  }
}

// Add listener for current letter button
const activateButton = function(button) {
  button.addEventListener('click', spotColorChanger)
}

// Remove listener for current letter button
const deactivateButton = function(button) {
  button.removeEventListener('click', spotColorChanger)
}

// Puts the most recently typed letter into the guess boxes
const setLetter = function(e) {
  let currentButton = document.getElementById(`slot-${currentWord}-${currentLetter}`);
  if (e.which === 13) {
    if (currentLetter < 5) {
      incompleteWordError();
      return false;
    } else {
      confirmSubmit();
    }
  } else if (e.which === 8) {
    if (currentLetter > 0) {currentLetter--;}
    currentButton = document.getElementById(`slot-${currentWord}-${currentLetter}`);
    currentButton.textContent = '-';
    currentButton.className = 'no-letter';
    deactivateButton(currentButton);
  } else if (e.which > 64 && e.which < 91) {
    currentButton.textContent = e.key;
    updateSlotColor(currentButton, currentLetter);
    if (currentLetter < 5) {currentLetter++;}
  } else {return false};
}

// Lines up a new guess
const newGuess = function() {
  word0.update();
  console.log(word0.word);
  console.log(word0.button);
  console.log(word0.color);
  console.log(word0.letter);
  // for (let i=0; i<5; i++) {
  //   const currentButton = document.getElementById(`slot-${currentWord}-${i}`);
  //   deactivateButton(currentButton);
  // }
  // currentWord++;
  // currentLetter = 0;
  // document.getElementById(`word-boxes-${currentWord}`).hidden=false;
}

// Stores bad positions from yellow text slots
const storeYellows = function() {
  for (let i=0; i<5; i++) {
    for (let j=0; j<5; j++) {
      let button = document.getElementById(`slot-${i}-${j}`);
      if (button.className === 'yellow-letter') {
        if (!badPosition[j].includes(button.textContent.toLowerCase())) {
          badPosition[j].push(button.textContent.toLowerCase());
        }
      }
    }
  }
}

// Clears out master data for a fresh update
const clearMaster = function() {
  knownLetters = ['','','','',''];
  goodLetters = [];
  badLetters = [];
  maybeLetters = [];
  twoLetters = [];
  threeLetters = [];
  badPosition = [[],[],[],[],[]];
}

// Newer update master letters set
const updateMaster = function() {
  clearMaster();
  for (let i=0; i<currentWord+1; i++) {
    let currentRow = grid[i];
    for (let j=0; j<5; j++) {
      let color = currentRow.color[j];
      let letter = currentRow.letter[j];
      if (color === 4 && knownLetters[j] === '') {
        knownLetters[j] = letter
      }
    }
  }
}


// Updates the master letters set
const updateMasterOld = function() {
  clearMaster();
  for (let i=0; i<currentWord+1; i++) {
    for (let k=0; k<2; k++) {
      for (let j=0; j<5; j++) {
        let color = grid[i].color[j];
        let letter = grid[i].letter[j];
        if (color === 4 && knownLetters[j] === '') {
          knownLetters[j] = letter
        }
        if (color === 3) {
          if (letter === knownLetters[j]) {
            grid[i].setColor(j, 4);
            if (badPosition[j].includes(letter)) {
              badPosition[j].splice(badPosition[j].indexOf(letter), 1);
            }
          } else if (!badPosition[j].includes(letter)) {
            badPosition[j].push(letter);
          }
          if (knownLetters.includes(letter) && letter !== knownLetters[j]) {
            if (!duplicateLetters.includes(letter)) {
              duplicateLetters.push(letter);
            }
            if (goodLetters.includes(letter)) {
              goodLetters.splice(goodLetters.indexOf(letter), 1);
            }
          } else if (!goodLetters.includes(letter)) {
            goodLetters.push(letter);
          }
        }
        if (color === 2) {
          if (letter === knownLetters[j]) {
            grid[i].setColor(j, 4);
            if (badPosition[j].includes(letter)) {
              badPosition[j].splice(badPosition[j].indexOf(letter), 1);
            }
          } else if (!badLetters.includes(letter)) {
            badLetters.push(letter);
          }
          if (knownLetters.includes(letter) && letter !== knownLetters[j]) {
            if (duplicateLetters.includes(letter)) {
              grid[i].setColor(j, 3);
              goodLetters.splice(goodLetters.indexOf(letter), 1);
            }
            else if (goodLetters.includes(letter)) {
              duplicateLetters.push(letter);
            }
            if (goodLetters.includes(letter)) {
              goodLetters.splice(goodLetters.indexOf(letter), 1);
            }
          } else if (!goodLetters.includes(letter)) {
            goodLetters.push(letter);
          }
          if (!badLetters.includes(letter)) {
            badLetters.push(letter);
          }
        }
        if (color === 1) {
          if (!maybeLetters.includes(letter)) {
            maybeLetters.push(letter);
          }
        }
      }
    }
  }
}

// Update search letters
const updateSearch = function() {
  for (let i=0; i<26; i++) {
    let l = String.fromCharCode(97 + i);
    let topColor = letters[l].keyboard;
    if (topColor === 3) {
      for (let j=0; j < 5; j++) {
        let color = letters[l].slot[j];
        if (color === 3) {
          knownLetters[j] = l;
          if (!goodLetters.includes(l)) {
            goodLetters.push(l);
          }
        } else {
          color = 2;
          letters[l].slot[j] = 2;
        }
      }
    } else if (topColor === 2) {
      if (!goodLetters.includes(l)) {
        goodLetters.push(l);
      }
      for (let j=0; j < 5; j++) {
        letters[l].slot[j] = 2;
      }
    } else if (topColor === 1) {
      if (!badLetters.includes(l)) {
        badLetters.push(l);
      }
      for (let j=0; j < 5; j++) {
        letters[l].slot[j] = 1;
      }
    };
  }
  storeYellows();
}

// Prints words
const printWords = function() {
  document.querySelector('h2').textContent = `Possible words (${possibleWords.length}):`;
  const ul = document.getElementById('results');
  ul.replaceChildren();
  for (word of possibleWords) {
    let newLi = document.createElement('li');
    newLi.textContent = word;
    ul.appendChild(newLi);
  }
}

// Search for words that match the given parameters
const matchWords = function() {
  let newWords = allWords;
  possibleWords = allWords;
  for (let i=0; i < 5; i++) {
    if (knownLetters[i]) {
      newWords = possibleWords.filter(word => 
        word.charAt(i) === knownLetters[i]
      )
    }
    possibleWords = newWords;
  }
  for (let i=0; i < goodLetters.length; i++) {
    newWords = possibleWords.filter(word =>
      word.includes(goodLetters[i])
    )
    possibleWords = newWords;
  }
  for (let i=0; i < badLetters.length; i++) {
    newWords = possibleWords.filter(word =>
      !word.includes(badLetters[i])
    )
    possibleWords = newWords
  }
  for (let i=0; i < 5; i++) {
    for (let j=0; j < badPosition[i].length; j++) {
      newWords = possibleWords.filter(word => 
        word.charAt(i) !== badPosition[i][j]
      )
      possibleWords = newWords;
    }
  }
}

// Handles storing data from colors
const updateWords = function() {
  convertToBlack();
  updateSearch();
  matchWords();
  printWords();
}

// Add event listeners
window.addEventListener('keydown', setLetter)
document.getElementById('update').addEventListener('click', updateWords);
document.getElementById('new-word').addEventListener('click', newGuess)
document.getElementById('reset').addEventListener('click', reset);

