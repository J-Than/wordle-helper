// Declare universal variables
let knownLetters = ['','','','',''];
let goodLetters = [];
let badLetters = [];
let badPosition = [[],[],[],[],[]];
let currentWord = 0;
let currentLetter = 0;
let allWords;
let possibleWords;
const colorArray = ['white-letter', 'black-letter', 'yellow-letter', 'green-letter'];

// Declare classes
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

// Handles updating color of buttons on spots
const spotColorChanger = function(event) {
  let button = event.target;
  let parse = button.id.split('');
  let index = parseInt(parse[parse.length-1]);
  letters[button.textContent.toLowerCase()].changeColor(index);
}

// Updates color of slot button
const updateSlotColor = function(button, index) {
  button.className = colorArray[letters[button.textContent.toLowerCase()].slot[index]];
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
// Add listener for current letter button
const activateButton = function(button) {
  button.addEventListener('click', spotColorChanger)
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
  } else if (e.which > 64 && e.which < 91) {
    currentButton.textContent = e.key;
    activateButton(currentButton);
    updateSlotColor(currentButton, currentLetter);
    if (currentLetter < 5) {currentLetter++;}
  } else {return false};
}

// Display the most recent guess submission in the table
const displayGuess = function() {
  document.getElementById(`word-boxes-${currentWord}`).hidden=false;
  document.getElementById('word-entry').hidden=true;
  document.getElementById('word-entry').reset();
  document.getElementById('word-confirm').hidden=false;
}

// Lines up a new guess
const newGuess = function() {
  currentWord++;
  currentLetter = 0;
  document.getElementById(`word-boxes-${currentWord}`).hidden=false;
}

// Store letter for use in search
const storeLetter = function(letter, color, position) {
  if (color === 'green-letter') {
    knownLetters[position] = letter;
    if (!goodLetters.includes(letter)) {
      goodLetters.push(letter);
    }
  } else if (color === 'yellow-letter') {
    if (!goodLetters.includes(letter)) {
      goodLetters.push(letter);
    }
    if (!badPosition[position].includes(letter)) {
      badPosition[position].push(letter);
    }
  } else if (!badLetters.includes(letter)) {
    if (!knownLetters.includes(letter)) {
      if (!goodLetters.includes(letter)) {
        badLetters.push(letter);
      }
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

// Populate the letters from the most recent guess
const populateGuess = function() {
  let wordArray = document.getElementById('word-slot').value.toUpperCase();
  for (let i=0; i<5; i++) {
    const currentButton = document.getElementById(`slot-${currentWord}-${i}`);
    currentButton.textContent = wordArray[i];
    activateButton(currentButton);
    setButtonColor(currentButton, i);
  }
}

// Search for words that match the given parameters
const matchWords = function() {
  let newWords = possibleWords;
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
  for (let i=0; i<5; i++) {
    const currentButton = document.getElementById(`slot-${currentWord}-${i}`);
    storeLetter(currentButton.textContent.toLowerCase(), currentButton.className, i);
    currentButton.removeEventListener('click', spotColorChanger);
  }
  matchWords();
  printWords();
  document.getElementById('reset').hidden = false;
  newGuess();
}

// Add event listeners
window.addEventListener('keydown', setLetter)

document.getElementById('reset').addEventListener('click', reset);