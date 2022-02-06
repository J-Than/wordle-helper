// Declare universal constants
const letters = {}
const slotColorArray = ['white-letter', 'black-letter', 'yellow-letter', 'green-letter'];
const keyColorArray = ['white-key', 'black-key', 'yellow-key', 'green-key'];

// Declare universal variables
let knownLetters = ['','','','',''];
let goodLetters = [];
let badLetters = [];
let badPosition = [[],[],[],[],[]];
let currentWord = 0;
let currentLetter = 0;
let allWords;
let possibleWords;
let typeActive = true;

// Declare classes
class Letter {
  constructor(letter) {
    this.letter = letter;
    this.keyboard = 0;
    this.slot = [0,0,0,0,0];
    this.base = 0;
    this.locked = false;
  }

  changeColorBySlot(index) {
    if (this.slot[index] === 3) {this.slot[index]-= 3};
    this.slot[index]++;
    if (this.slot[index] > 1) {
      this.base = 2;
    } else {
      if (Math.max(...this.slot) > 1) {
        this.base = 2;
      } else {
        this.base = 1;
        this.slot = [1,1,1,1,1];
      }
    }
    this.storeKeyboard();
    updateAllColors();
  }

  clearData() {
    this.keyboard = 0;
    this.slot = [0,0,0,0,0];
    this.base = 0;
  }

  changeColorByKey() {
    if (this.keyboard === 3) {
      this.clearData();
    } else if (this.keyboard === 2) {
      if (row(checkLetter, 0, this.letter) === undefined) {
        this.clearData();
      } else {
        this.keyboard = 3;
        this.slot[row(checkLetter, 0, this.letter)] = 3;
      }
    } else if (this.keyboard === 1) {
      this.keyboard = 2;
      this.slot = [2,2,2,2,2];
      this.base = 2;
    } else {
      this.keyboard = 1;
      this.slot = [1,1,1,1,1];
      this.base = 1;
    };
    updateAllColors();
  }

  storeKeyboard() {
    this.keyboard = Math.max(...this.slot);
  }

  lockLetter() {
    this.locked = true;
  }
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

// Iterates a function over the entire word grid
const slots = function(pass) {
  for (let i=0; i<=currentWord; i++) {
    for (let j=0; j<5; j++) {
      let button = document.getElementById(`slot-${i}-${j}`);
      pass(button, j);
    }
  }
}

// Iterates a function over the current word row
const row = function(pass, thru, check) {
  for (let i=0; i<5; i++) {
    let button = document.getElementById(`slot-${currentWord}-${i}`);
    if (check) {
      if (pass(button, check) === true) {
        return i;
      }
    };
    pass(button, thru);
  }
}

// Iterates a function over the entire keyboard
const keys = function(pass) {
  for (let i=0; i<26; i++) {
    let letter = String.fromCharCode(97 + i);
    let key = document.getElementById(`key-${letter}`);
    pass(letter, key);
  }
}

// Build object array of letter objects
keys((letter) => {letters[letter] = new Letter(letter)});

// Resets the page
const reset = function() {
  window.location.reload();
}

// Add listener for current letter button
const activate = function(button, func) {
  button.addEventListener('click', func)
}

// Remove listener for current letter button
const deactivate = function(button, func) {
  button.removeEventListener('click', func)
}

// Checks slot for a particular letter
const checkLetter = function(button, letter) {
  return button.textContent.toLowerCase() === letter;
}

// Update slot colors
const updateSlotColor = function(button, j) {
  if (button.textContent !== '-') {
    button.className = slotColorArray[letters[button.textContent.toLowerCase()].slot[j]];
  }
}

// Updates keyboard activation based on rules
const lockKey = function(button) {
  let letter = button .textContent.toLowerCase();
  letters[letter].lockLetter();
  deactivate(document.getElementById(`key-${letter}`), keyClick);
}

// Updates the color of the keyboard
const updateKeyColor = function(letter, key) {
  key.className = keyColorArray[letters[letter].keyboard];
}

// Updates the locks on the keyboard
const updateKeyLock = function(letter, key) {
  if (letters[letter].locked) {
    deactivate(key, keyClick);
  } else {
    activate(key, keyClick);
  }
}

// Update colors of all elements
const updateAllColors = function() {
  slots(updateSlotColor);
  keys(updateKeyColor);
}

// Converts white letters to black on update
const convertToBlack = function(button, j) {
  if (button.className === 'white-letter') {
    letters[button.textContent.toLowerCase()].changeColorBySlot(j);
  }
}

// Handles click for slots
const slotClick = function(e) {
  let button = e.target;
  let parse = button.id.split('');
  let index = parseInt(parse[parse.length-1]);
  row(convertToBlack);
  letters[button.textContent.toLowerCase()].changeColorBySlot(index);
  document.activeElement.blur();
}

// Handles click for keyboard
const keyClick = function(e) {
  let key = e.target;
  let letter = key.textContent.toLowerCase();
  letters[letter].changeColorByKey();
  document.activeElement.blur();
}

// Gives the slot button its initial values
const initializeSlot = function(button, index) {
  color = letters[button.textContent.toLowerCase()].slot[index];
  button.className = slotColorArray[color];
  if (color === 0 || color === 2) {
    activate(button, slotClick);
  }
}

// Puts the most recently typed letter into the guess boxes
const captureLetters = function(e) {
  let button = document.getElementById(`slot-${currentWord}-${currentLetter}`);
  if (e.which === 13) {
    submitWord();
  }
  if (typeActive === true) {
    if (e.which === 8) {
      if (currentLetter > 0) {currentLetter--;}
      button = document.getElementById(`slot-${currentWord}-${currentLetter}`);
      button.textContent = '-';
      button.className = 'no-letter';
    } else if (e.which > 64 && e.which < 91) {
      button.textContent = e.key;
      initializeSlot(button, currentLetter);
      if (currentLetter < 5) {currentLetter++;}
    } else {return false};
  } else {
    if (e.which > 64 && e.which < 91) {
      if (letters[e.key].locked === false) {
        letters[e.key].changeColorByKey();
      }
    }
  }
}

// Saves previous word and adds a new word
const addWord = function() {
  row(lockKey);
  row(deactivate, slotClick);
  currentWord++;
  currentLetter = 0;
  document.getElementById(`word-boxes-${currentWord}`).hidden=false;
  typeActive = true;
  document.activeElement.blur();
}

// Stores bad positions from yellow text slots
const storeYellows = function(button, j) {
  if (button.className === 'yellow-letter') {
    if (!badPosition[j].includes(button.textContent.toLowerCase())) {
      badPosition[j].push(button.textContent.toLowerCase());
    }
  }
}

// Clears out master data for a fresh update
const clearSearchData = function() {
  knownLetters = ['','','','',''];
  goodLetters = [];
  badLetters = [];
  badPosition = [[],[],[],[],[]];
}

// Update search letters
const updateSearch = function(letter) {
  if (letters[letter].base === 2) {
    for (let i=0; i < 5; i++) {
      let color = letters[letter].slot[i];
      if (color === 3) {
        knownLetters[i] = letter;
        if (!goodLetters.includes(letter)) {
          goodLetters.push(letter);
        }
      } else {
        color = 2;
        letters[letter].slot[i] = 2;
        if (!goodLetters.includes(letter)) {
          goodLetters.push(letter);
        }
      }
    }
  } else if (letters[letter].base === 1) {
    if (!badLetters.includes(letter)) {
      badLetters.push(letter);
    }
    for (let i=0; i < 5; i++) {
      letters[letter].slot[i] = 1;
    }
  };
  slots(storeYellows);
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

// Prints words
const printWords = function() {
  document.querySelector('h2').textContent = `Possible words (${possibleWords.length}):`;
  const ul = document.getElementById('results');
  ul.replaceChildren();
  for (word of possibleWords) {
    let newLi = document.createElement('li');
    newLi.textContent = word;
    ul.appendChild(newLi);
    document.activeElement.blur();
  }
}

// Handles submit word button functions
const submitWord = function(e) {
  slots(convertToBlack);
  clearSearchData();
  keys(updateSearch);
  matchWords();
  printWords();
  typeActive = false;
}

// Add event listeners
keys(updateKeyLock);
window.addEventListener('keydown', captureLetters);
document.getElementById('add-word').addEventListener('click', addWord);
document.getElementById('submit-keys').addEventListener('click', submitWord);
document.getElementById('reset').addEventListener('click', reset);