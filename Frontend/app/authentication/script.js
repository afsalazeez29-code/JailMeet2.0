const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});
const stateSelect = document.getElementById('state');

stateSelect.addEventListener('change', (event) => {
	const selectedDistrict = event.target.value;
	stateSelect.dataset.selectedDistrict = selectedDistrict;
});
signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});