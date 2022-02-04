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

// Add event listeners
document.getElementById('word-entry').addEventListener('submit', (e) => {
  e.preventDefault();
  populateGuess();
  displayGuess();
})
document.getElementById('confirm-word').addEventListener('click', (e) => confirmColors(e))

// Populate the letters from the most recent guess
function populateGuess() {
  let wordArray = document.getElementById('word-guess').value.toUpperCase();
  for (let i=0; i<5; i++) {
    const currentButton = document.getElementById(`guess-${currentWord}-${i}`);
    currentButton.textContent = wordArray[i];
    activateButton(currentButton)
  }
}

// Display the most recent guess submission in the table
function displayGuess() {
  document.getElementById(`word-boxes-${currentWord}`).hidden=false;
  document.getElementById('word-entry').hidden=true;
  document.getElementById('word-confirm').hidden=false;
}

// Lines up a new guess
function newGuess() {
  currentWord++;
  document.getElementById('word-entry').hidden=false;
  document.getElementById('word-confirm').hidden=true;
}

// Add listener for current letter button
function activateButton(button) {
  button.addEventListener('click', e => colorChanger(e.target))
}

// Handles updating color of buttons on current guess
function colorChanger(button) {
  if (button.className === 'yellow-letter') {
    button.className = 'green-letter';
  } else if (button.className === 'black-letter') {
    button.className = 'yellow-letter';
  } else {
    button.className = 'black-letter';
  }
}

// Handles storing data from colors
function confirmColors() {
  for (let i=0; i<5; i++) {
    const currentButton = document.getElementById(`guess-${currentWord}-${i}`);
    storeLetter(currentButton.textContent.toLowerCase(), currentButton.className, i);
    currentButton.removeEventListener('click', colorChanger);
  }
  console.log(knownLetters);
  console.log(goodLetters);
  console.log(badLetters);
  console.log(badPosition);
  newGuess();
}

// Store letter for use in search
function storeLetter(letter, color, position) {
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

// Search for words that match the given parameters
function matchWords() {
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

// Prints words
function printWords() {
  console.log(possibleWords);
}