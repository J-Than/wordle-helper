// Declare universal variables
let knownLetters = ['','','','',''];
let goodLetters;
let badLetters;

// Add event listeners
document.getElementById('letter-state').addEventListener('submit', (e) => {
  e.preventDefault();
  storeLetters();
  searchWords();
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
