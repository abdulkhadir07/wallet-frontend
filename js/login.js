import { login } from './api.js'
import { saveToken } from './auth.js'

const phoneNumberInput = document.querySelector("#phoneNumberInput");
const passwordInput = document.querySelector("#passwordInput");
const loginBtn = document.querySelector("#loginBtn");
const phoneNumberError = document.querySelector("#phoneNumberError");
const passwordError = document.querySelector("#passwordError");

function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.classList.remove("hidden");

}

function clearError(errorElement) {
    errorElement.textContent = "";
    errorElement.classList.add("hidden");
}

loginBtn.addEventListener("click" , async () => {
    clearError(phoneNumberError);
    clearError(passwordError);

    const phoneNumber = phoneNumberInput.value.trim();
    const password = passwordInput.value;

    if (!phoneNumber) {
        showError(phoneNumberError, "Phone number is required.");
        return;
    } else if (!password){
        showError(passwordError, "Password is required.");
        return;
    }
    
    loginBtn.disabled = true;
    loginBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
     </svg>`;

    try {
        const data = await login(phoneNumber, password);
        saveToken(data.token);
        window.location.href = "./dashboard.html";

    } catch (error) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
        showError(passwordError, error.message);
    }

});