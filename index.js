// Declare universal variables
let knownLetters = ['','','','',''];
let goodLetters = [];
let badLetters = [];
let badPosition = [[],[],[],[],[]];
let currentWord = 0;
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

// Display the most recent guess submission in the table
const displayGuess = function() {
  document.getElementById(`word-boxes-${currentWord}`).hidden=false;
  document.getElementById('word-entry').hidden=true;
  document.getElementById('word-confirm').hidden=false;
}

// Lines up a new guess
const newGuess = function() {
  currentWord++;
  document.getElementById('word-entry').hidden=false;
  document.getElementById('word-confirm').hidden=true;
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

// Store letter for use in search
const storeLetter = function(letter, color, position) {
  if (color === 'green-letter') {
    knownLetters[position] = letter;
  } else if (color === 'yellow-letter') {
    if (!goodLetters.includes(letter)) {
      goodLetters.push(letter);
    }
    if (!badPosition[position].includes(letter)) {
      badPosition[position].push(letter);
    }
  } else if (!badLetters.includes(letter)) {
    badLetters.push(letter);
  }
}

// Prints words
const printWords = function() {
  console.log(possibleWords);
}

// Add listener for current letter button
const activateButton = function(button) {
  button.addEventListener('click', colorChanger)
}

// Populate the letters from the most recent guess
const populateGuess = function() {
  let wordArray = document.getElementById('word-guess').value.toUpperCase();
  for (let i=0; i<5; i++) {
    const currentButton = document.getElementById(`guess-${currentWord}-${i}`);
    currentButton.textContent = wordArray[i];
    activateButton(currentButton)
  }
}

// Handles storing data from colors
const confirmColors = function() {
  for (let i=0; i<5; i++) {
    const currentButton = document.getElementById(`guess-${currentWord}-${i}`);
    storeLetter(currentButton.textContent.toLowerCase(), currentButton.className, i);
    currentButton.removeEventListener('click', colorChanger);
  }
  newGuess();
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
}

// Add event listeners
document.getElementById('word-entry').addEventListener('submit', (e) => {
  e.preventDefault();
  populateGuess();
  displayGuess();
})
document.getElementById('confirm-word').addEventListener('click', confirmColors);