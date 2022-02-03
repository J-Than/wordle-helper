// Declare universal variables
const knownLetters = ['','','','',''];
const goodLetters = [];
const badLetters = [];

// Add event listeners
document.getElementById('letter-state').addEventListener('submit', (e) => {
  e.preventDefault();
  storeLetters();
})

// Handle form submission
function storeLetters() {
  knownLetters[0] = document.getElementById('first-letter').value.toLowerCase();
  knownLetters[1] = document.getElementById('second-letter').value.toLowerCase();
  knownLetters[2] = document.getElementById('third-letter').value.toLowerCase();
  knownLetters[3] = document.getElementById('fourth-letter').value.toLowerCase();
  knownLetters[4] = document.getElementById('fifth-letter').value.toLowerCase();
}