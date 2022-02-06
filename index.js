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
    this.base = 0;
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

  setData(keyboard, base, slot, index) {

  }

  clearData() {
    this.keyboard = 0;
    this.slot = [0,0,0,0,0];
    this.base = 0;
  }

  changeColorByKey() {
    if (this.keyboard > 1) {return false};
    if (this.keyboard === 1) {
      this.keyboard = 0;
      this.slot = [0,0,0,0,0];
    } else {
      this.keyboard = 1;
      this.slot = [1,1,1,1,1];
    };
    updateAllColors();
  }

  storeKeyboard() {
    this.keyboard = Math.max(...this.slot);
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

// Tests for duplicates in an array
const duplicateFinder = function(array) {
  const uniqueElements = new Set(array);
  const filteredElements = array.filter(item => {
      if (uniqueElements.has(item)) {
          uniqueElements.delete(item);
      } else {
          return item;
      }
  });
  return [...new Set(filteredElements)]
}

// Resets the page
const reset = function() {
  window.location.reload();
}

// Add listener for current letter button
const activateButton = function(button) {
  button.addEventListener('click', slotClick)
}

// Remove listener for current letter button
const deactivateButton = function(button) {
  button.removeEventListener('click', slotClick)
}

// Updates the color of the keyboard
const updateKeyboardColor = function() {
  for (let i=0; i<26; i++) {
    let letter = String.fromCharCode(97 + i);
    let key = document.getElementById(`key-${letter}`);
    key.className = keyColorArray[letters[letter].keyboard];
  }
}

// Handles click for slots
const slotClick = function(event) {
  let button = event.target;
  let parse = button.id.split('');
  let index = parseInt(parse[parse.length-1]);
  if (backspace = true) {
    convertToBlack();
  }
  letters[button.textContent.toLowerCase()].changeColorBySlot(index);
  backspace = false;
}

// Handles click for keyboard
const keyClick = function(event) {
  let key = event.target;
  let letter = key.textContent.toLowerCase();
  letters[letter].changeColorByKey();
}

// Gives the slot button its initial color
const initialColor = function(button, index) {
  color = letters[button.textContent.toLowerCase()].slot[index];
  button.className = colorArray[color];
  if (color === 0 || color === 2) {
    activateButton(button);
  }
}

// Update slot colors
const updateSlotColors = function() {
  for (let i=0; i<5; i++) {
    for (let j=0; j<5; j++) {
      let button = document.getElementById(`slot-${i}-${j}`);
      if (button.textContent !== '-') {
        button.className = colorArray[letters[button.textContent.toLowerCase()].slot[j]];
      }
    }
  }
}

// Update colors of all elements
const updateAllColors = function() {
  updateSlotColors();
  updateKeyboardColor();
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

// Puts the most recently typed letter into the guess boxes
const captureLetters = function(e) {
  let button = document.getElementById(`slot-${currentWord}-${currentLetter}`);
  if (e.which === 8 && backspace === true) {
    if (currentLetter > 0) {currentLetter--;}
    button = document.getElementById(`slot-${currentWord}-${currentLetter}`);
    button.textContent = '-';
    button.className = 'no-letter';
  } else if (e.which > 64 && e.which < 91) {
    button.textContent = e.key;
    initialColor(button, currentLetter);
    if (currentLetter < 5) {currentLetter++;}
  } else {return false};
}

// Saves previous word and adds a new word
const addWord = function() {
  for (let i=0; i<5; i++) {
    const button = document.getElementById(`slot-${currentWord}-${i}`);
    deactivateButton(button);
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
const clearSearchData = function() {
  knownLetters = ['','','','',''];
  goodLetters = [];
  badLetters = [];
  badPosition = [[],[],[],[],[]];
}

// Clears all data out of letter storage
const clearLetterData = function() {
  for (let i=0; i<26; i++) {
    let letter = String.fromCharCode(97 + i);
    letters[letter].clearData();
  }
}

// Pulls fresh data from the letter slots
const pullDataFromSlots = function() {
  clearLetterData();
  let lettersArray = [];
  let colorsArray = [];
  for (let i=0; i<=currentWord; i++) {
    lettersArray.push([]);
    colorsArray.push([]);
    for (let j=0; j < 5; j++){
      let button = document.getElementById(`slot-${i}-${j}`);
      lettersArray[i].push(button.textContent.toLowerCase());
      colorsArray[i].push(colorArray.indexOf(button.className));
    }
  }
  for (let k=0; k<=currentWord; k++) {
    let duplicateLetters = duplicateFinder(lettersArray[k]);
    let duplicateColors = duplicateFinder(colorsArray[k]);
    if (duplicateLetters.length > 0) {
      for (let d=0; d<duplicateLetters.length; d++) {
        let dupOne = lettersArray[k].indexOf(duplicateLetters[d]);
        let dupTwo = lettersArray[k].indexOf(duplicateLetters[d], dupOne+1);
        if (colorsArray[dupOne] > colorsArray[dupTwo]) {
          if (colorsArray[dupOne] === 3) {
            letters[duplicateLetters[d]].setData(3,2,)
          }
        }
      }
    }
  }
}

// Update search letters
const updateSearch = function() {
  clearSearchData();
  for (let i=0; i<26; i++) {
    let l = String.fromCharCode(97 + i);
    if (letters[l].base === 2) {
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
          if (!goodLetters.includes(l)) {
            goodLetters.push(l);
          }
        }
      }
    } else if (letters[l].base === 1) {
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
  }
}

// Handles storing data from colors
const findWords = function() {
  convertToBlack();
  updateSearch();
  matchWords();
  printWords();
}

// Add event listeners
window.addEventListener('keydown', captureLetters)
document.getElementById('update').addEventListener('click', findWords);
document.getElementById('new-word').addEventListener('click', addWord)
document.getElementById('reset').addEventListener('click', reset);

