// Declare universal variables
let knownLetters = ['','','','',''];
let goodLetters = [];
let badLetters = [];
let badPosition = [[],[],[],[],[]];
let currentWord = 0;
let currentLetter = 0;
let allWords;
let possibleWords;
let backspace = true;
const colorArray = ['white-letter', 'black-letter', 'yellow-letter', 'green-letter'];
const keyColorArray = ['white-key', 'black-key', 'yellow-key', 'green-key'];

// Declare classes

class Letter {
  constructor(letter) {
    this.letter = letter;
    this.keyboard = 0;
    this.slot = [0,0,0,0,0];
    this.keyLock = false;
  }

  changeColorBySlot(index) {
    if (this.slot[index] === 3) {this.slot[index]-= 3};
    this.slot[index]++;
    this.storeKeyboardColor();
    updateAllColors();
  }

  changeColorByKey() {
    if (this.keyboard > 1) {return null};
    if (this.keyboard === 1) {
      this.keyboard = 0;
      this.slot = [0,0,0,0,0];
    } else {
      this.keyboard = 1;
      this.slot = [1,1,1,1,1];
    };
    updateKeyboardColor();
  }

  storeKeyboardColor() {
    this.keyboard = Math.max(...this.slot);
    updateKeyboardColor();
  }
}

// Build objects
const letters = {}
for (let i=0; i<26; i++) {
  let letter = String.fromCharCode(97 + i);
  letters[letter] = new Letter(letter);
}

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
  window.location.reload();
}

// Updates the color of the keyboard
const updateKeyboardColor = function() {
  for (let i=0; i<26; i++) {
    let letter = String.fromCharCode(97 + i);
    let key = document.getElementById(`key-${letter}`);
    key.className = keyColorArray[letters[letter].keyboard];
  }
}

// Handles updating color of buttons on spots
const spotColorChanger = function(event) {
  let button = event.target;
  let parse = button.id.split('');
  let index = parseInt(parse[parse.length-1]);
  letters[button.textContent.toLowerCase()].changeColorBySlot(index);
  backspace = false;
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
      letters[button.textContent.toLowerCase()].changeColorBySlot(i);
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

// Throws an error if the user tries to submit an incomplete word
const incompleteWordError = function() {
  window.alert('You have not entered a complete word!');
}

// Puts the most recently typed letter into the guess boxes
const setLetter = function(e) {
  let currentButton = document.getElementById(`slot-${currentWord}-${currentLetter}`);
  if (e.which === 8 && backspace === true) {
    if (currentLetter > 0) {currentLetter--;}
    currentButton = document.getElementById(`slot-${currentWord}-${currentLetter}`);
    currentButton.textContent = '-';
    currentButton.className = 'no-letter';
  } else if (e.which > 64 && e.which < 91) {
    currentButton.textContent = e.key;
    updateSlotColor(currentButton, currentLetter);
    if (currentLetter < 5) {currentLetter++;}
  } else {return false};
}

// Lines up a new guess
const newGuess = function() {
  for (let i=0; i<5; i++) {
    const currentButton = document.getElementById(`slot-${currentWord}-${i}`);
    deactivateButton(currentButton);
  }
  currentWord++;
  currentLetter = 0;
  backspace = true;
  document.getElementById(`word-boxes-${currentWord}`).hidden=false;
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
  badPosition = [[],[],[],[],[]];
}

// Update search letters
const updateSearch = function() {
  clearMaster();
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

