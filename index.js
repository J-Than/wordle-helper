// Declare universal variables
let knownLetters = ['','','','',''];
let goodLetters = [];
let badLetters = [];
let badPosition = [[],[],[],[],[]];
let currentWord = 0;
let currentLetter = 0;
let allWords;
let possibleWords;

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

// Confirm submission of a new word
const confirmSubmit = function() {
  if (window.confirm('Are you sure? You can set the colors of each letter by clicking on them.')) {confirmColors();};
}

// Throw error for incomplete word
const incompleteWordError = function() {
  window.alert('You have not filled out all of the letters.');
}

// Handles updating color of buttons on current guess
const colorChanger = function(event) {
  let button = event.target;
  if (button.className === 'yellow-letter') {
    button.className = 'green-letter';
  } else if (button.className === 'black-letter') {
    button.className = 'yellow-letter';
  } else {
    button.className = 'black-letter';
  }
}

// Add listener for current letter button
const activateButton = function(button) {
  button.addEventListener('click', colorChanger)
}

// Sets button color based on prior guesses
const setButtonColor = function(button, index) {
  if (button.textContent.toLowerCase() === knownLetters[index]) {
    button.className = 'green-letter';
    button.removeEventListener('click', colorChanger);
  } else if (goodLetters.includes(button.textContent.toLowerCase())) {
    button.className = 'yellow-letter';
  } else if (badLetters.includes(button.textContent.toLowerCase())) {
    button.className = 'black-letter';
    button.removeEventListener('click', colorChanger);
  } else if (button.textContent === '-') {
    button.className = 'neutral-letter';
  } else {
    button.className = 'black-letter';
  }
}

// Puts the most recently typed letter into the guess boxes
const setLetter = function(e) {
  let currentButton = document.getElementById(`guess-${currentWord}-${currentLetter}`);
  if (e.which === 13) {
    if (currentLetter < 5) {
      incompleteWordError();
      return false;
    } else {
      confirmSubmit();
    }
  } else if (e.which === 8) {
    if (currentLetter > 0) {currentLetter--;}
    currentButton = document.getElementById(`guess-${currentWord}-${currentLetter}`);
    currentButton.textContent = '-';
    setButtonColor(currentButton, currentLetter);
  } else if (e.which > 64 && e.which < 91) {
    currentButton.textContent = e.key.toUpperCase();
    activateButton(currentButton);
    setButtonColor(currentButton, currentLetter);
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
  let wordArray = document.getElementById('word-guess').value.toUpperCase();
  for (let i=0; i<5; i++) {
    const currentButton = document.getElementById(`guess-${currentWord}-${i}`);
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
const confirmColors = function() {
  for (let i=0; i<5; i++) {
    const currentButton = document.getElementById(`guess-${currentWord}-${i}`);
    storeLetter(currentButton.textContent.toLowerCase(), currentButton.className, i);
    currentButton.removeEventListener('click', colorChanger);
  }
  matchWords();
  printWords();
  document.getElementById('reset').hidden = false;
  newGuess();
}

// Add event listeners
window.addEventListener('keydown', setLetter)

document.getElementById('reset').addEventListener('click', reset);