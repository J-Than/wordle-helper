// Declare universal variables
let knownLetters = ['','','','',''];
let goodLetters;
let badLetters;
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
document.getElementById('letter-state').addEventListener('submit', (e) => {
  e.preventDefault();
  storeLetters();
  matchWords();
  printWords();
})

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