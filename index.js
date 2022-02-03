// Declare universal variables

// Add event listeners
document.getElementById('letter-state').addEventListener('submit', (e) => {
  e.preventDefault();
  submitHandler();
})

// Handle form submission
function submitHandler() {
  console.log('Clicked on the submission button!');
}