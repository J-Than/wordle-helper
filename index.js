// Declare universal variables
let knownLetters = ['','','','',''];
let goodLetters;
let badLetters;
let badPositionOne;
let badPositionTwo;
let badPositionThree;
let badPositionFour;
let badPositionFive;
let currentWord = 1;
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
document.getElementById('word-form').addEventListener('submit', (e) => {
  e.preventDefault();
  populateGuess();
  displayGuess();
})

// Populate the letters from the most recent guess
function populateGuess() {
  let wordArray = document.getElementById('word-guess').value.toUpperCase();
  for (let i=0; i<5; i++) {
    const currentButton = document.getElementById(`guess-${currentWord}-${i+1}`);
    currentButton.textContent = wordArray[i];
    activateButton(currentButton)
  }
}

// Display the most recent guess submission in the table
function displayGuess() {
  document.getElementById(`word-boxes-${currentWord}`).hidden=false;
}

// Add listener for current letter button
function activateButton(button) {
  button.addEventListener('click', e => colorChanger(e.target))
}

// Handles updating color of buttons on current guess
function colorChanger(button) {
  if (button.className === 'yellow-letter') {
    button.className = 'green-letter';
  } else if (button.className === 'green-letter') {
    button.className = 'black-letter';
  } else {
    button.className = 'yellow-letter';
  }
}

// Store letters for use in search
function storeLetters() {
  knownLetters[0] = document.getElementById('first-letter').value.toLowerCase();
  knownLetters[1] = document.getElementById('second-letter').value.toLowerCase();
  knownLetters[2] = document.getElementById('third-letter').value.toLowerCase();
  knownLetters[3] = document.getElementById('fourth-letter').value.toLowerCase();
  knownLetters[4] = document.getElementById('fifth-letter').value.toLowerCase();
  goodLetters = document.getElementById('yellow-letters').value.toLowerCase().split('');
  badLetters = document.getElementById('black-letters').value.toLowerCase().split('');
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