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
let wordleWords;
let scrabbleWords;
let allWords;
let possibleWords;
let wordList = 'scrabble';
let typeActive = true;
let instructions = true;

// Declare classes
class Letter {
  constructor(letter) {
    this.letter = letter;
    this.keyboard = 0;
    this.slot = [0,0,0,0,0];
    this.base = 0;
    this.locked = false;
    this.yellow = false;
  }

  changeColorBySlot(index) {
    if (this.slot[index] === 3) {
      this.slot[index] -= this.yellow ? 2 : 4;
    }
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
    let color = 1;
    if (this.keyboard === 3) {
      color = this.yellow ? 2 : 0;
    } else if (this.keyboard === 2) {
      if (row(checkLetter, 0, this.letter) === undefined) {
        color = 0;
      } else {
        this.keyboard = 3;
        this.slot[row(checkLetter, 0, this.letter)] = 3;
        updateAllColors();
        return null;
      }
    } else if (this.keyboard === 1) {
      color = 2;
    }
    this.keyboard = color;
    this.slot = [color,color,color,color,color];
    this.base = color;
    updateAllColors();
  }

  storeKeyboard() {
    this.keyboard = Math.max(...this.slot);
  }

  lockLetter() {
    this.locked = true;
  }

  confirmYellow() {
    this.yellow = true;
  }
}

// Pull in Wordle word list
const pullWordle = function () {
  fetch ('answerlist.json')
  .then (r => r.json())
  .then ((j) => {
    let wordArray = [];
    for (let i=0; i < j.length; i++) {
      wordArray.push(j[i]['word']);
    }
    wordleWords = wordArray;
    allWords = wordArray;
  })
}

// Pull in reduced Scrabble word list
const pullScrabble = function () {
  fetch ('medlist.json')
  .then (r => r.json())
  .then ((j) => {
    let wordArray = [];
    for (let i=0; i < j.length; i++) {
      wordArray.push(j[i]['word']);
    }
    scrabbleWords = wordArray;
    pullWordle();
  })
}

// Starts loading word lists
pullScrabble();

// Changes the current word list
const swapWordList = function () {
  if (wordList === 'wordle') {
    allWords = scrabbleWords;
    document.getElementById('dict').innerText = 'Scrabble';
    wordList = "scrabble";
  } else if (wordList === 'scrabble') {
    allWords = wordleWords;
    document.getElementById('dict').innerText = 'WORDLE';
    wordList = "wordle";
  }
}

// Toggles visibility of instructions & words
const infoToggle = function () {
  instructions = !instructions;
  document.getElementById('helper-text').hidden = !instructions;
  document.getElementById('results').hidden = instructions;
  if (instructions) {document.querySelector('h3').innerText = 'Instructions:'}
  else {document.querySelector('h3').innerText = `Possible words (${possibleWords.length})`}
}

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

// Adds a word to the page
const newWordBuilder = function() {
  let row;
  if (currentWord > 2) {
    row = document.getElementById('word-boxes').insertRow();
    row.id=`word-boxes-${currentWord}`;
  } else {
    row = document.getElementById(`word-boxes-${currentWord}`)
  }
  let slot0 = document.createElement('td');
  let slot1 = document.createElement('td');
  let slot2 = document.createElement('td');
  let slot3 = document.createElement('td');
  let slot4 = document.createElement('td');
  let button0 = document.createElement('button');
  let button1 = document.createElement('button');
  let button2 = document.createElement('button');
  let button3 = document.createElement('button');
  let button4 = document.createElement('button');
  button0.type='button';
  button0.className='no-letter';
  button0.name=`slot-${currentWord}-0`;
  button0.id=`slot-${currentWord}-0`;
  button1.type='button';
  button1.className='no-letter';
  button1.name=`slot-${currentWord}-1`;
  button1.id=`slot-${currentWord}-1`;
  button2.type='button';
  button2.className='no-letter';
  button2.name=`slot-${currentWord}-2`;
  button2.id=`slot-${currentWord}-2`;
  button3.type='button';
  button3.className='no-letter';
  button3.name=`slot-${currentWord}-3`;
  button3.id=`slot-${currentWord}-3`;
  button4.type='button';
  button4.className='no-letter';
  button4.name=`slot-${currentWord}-4`;
  button4.id=`slot-${currentWord}-4`;
  slot0.appendChild(button0);
  slot1.appendChild(button1);
  slot2.appendChild(button2);
  slot3.appendChild(button3);
  slot4.appendChild(button4);
  row.appendChild(slot0);
  row.appendChild(slot1);
  row.appendChild(slot2);
  row.appendChild(slot3);
  row.appendChild(slot4);
}

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
  if (button.textContent != '') {
    button.className = slotColorArray[letters[button.textContent.toLowerCase()].slot[j]];
  }
}

// Updates keyboard activation based on rules
const lockKey = function(button) {
  let letter = button.textContent.toLowerCase();
  if (letter && button.className !== 'yellow-letter') {
    letters[letter].lockLetter();
    deactivate(document.getElementById(`key-${letter}`), keyClick);
  }
}

// Updates the color of the keyboard
const updateKeyColor = function(letter, key) {
  key.className = keyColorArray[letters[letter].keyboard];
}

// Updates the function of the keyboard
const updateKeyFunction = function(letter, key) {
  if (typeActive === false) {
    deactivate(key, typeInput);
    if (letters[letter].locked) {
      deactivate(key, keyClick);
    } else {
      activate(key, keyClick);
    }
  } else {
    deactivate(key, keyClick);
    activate(key, typeInput);
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

// Backspace function for mouse click
const backspaceClick = function(e) {
  if (typeActive === true) {
    if (currentLetter > 0) {currentLetter--;}
    button = document.getElementById(`slot-${currentWord}-${currentLetter}`);
    button.textContent = '';
    button.className = 'no-letter';
  }
}

// Builds functionality for keyboard to work for text input
const typeInput = function(e) {
  let button = document.getElementById(`slot-${currentWord}-${currentLetter}`)
  button.textContent = e.target.textContent.toLowerCase();
  initializeSlot(button, currentLetter);
  if (currentLetter < 5) {currentLetter++;}
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
      button.textContent = '';
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

// Stores bad positions from yellow text slots
const storeYellows = function(button, j) {
  if (button.className === 'yellow-letter') {
    if (!badPosition[j].includes(button.textContent.toLowerCase())) {
      badPosition[j].push(button.textContent.toLowerCase());
    }
    letters[button.textContent.toLowerCase()].confirmYellow();
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
  document.querySelector('h3').textContent = `Possible words (${possibleWords.length})`;
  const ul = document.getElementById('results');
  ul.replaceChildren();
  ul.hidden = false;
  document.getElementById('helper-text').hidden = true;
  instructions = false;
  for (word of possibleWords) {
    let newLi = document.createElement('li');
    newLi.textContent = word;
    ul.appendChild(newLi);
  }
  document.activeElement.blur();
}

// Handles submit word button functions
const submitWord = function(e) {
  slots(convertToBlack);
  clearSearchData();
  keys(updateSearch);
  matchWords();
  printWords();
  typeActive = false;
  keys(updateKeyFunction);
}

// Saves previous word and adds a new word
const addWord = function() {
  row(lockKey);
  row(deactivate, slotClick);
  submitWord();
  currentWord++;
  currentLetter = 0;
  newWordBuilder();
  typeActive = true;
  keys(updateKeyFunction);
  document.activeElement.blur();
}

// Add event listeners
keys(updateKeyFunction);
swapWordList();
window.addEventListener('keydown', captureLetters);
document.getElementById('add-word').addEventListener('click', addWord);
document.getElementById('word-list').addEventListener('click', swapWordList);
document.getElementById('reset').addEventListener('click', reset);
document.getElementById('instructions').addEventListener('click', infoToggle);
document.getElementById('key-ent').addEventListener('click', submitWord);
document.getElementById('key-back').addEventListener('click', backspaceClick);