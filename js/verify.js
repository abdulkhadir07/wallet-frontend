import { verify } from './api.js'

const verifyError = document.querySelector("#verifyError");
const verifyBtn = document.querySelector("#verifyBtn");
const otpInputs = document.querySelectorAll(".otp-input");
const phoneText = document.querySelector("#phoneText");
const demoCodeBox = document.querySelector("#demoCodeBox");
const demoCodeText = document.querySelector("#demoCodeText");

const params = new URLSearchParams(window.location.search);
const phoneNumber = params.get("phone");
const demoVerificationCode = sessionStorage.getItem("demoVerificationCode");

function showError(message) {
    verifyError.textContent = message;
    verifyError.classList.remove("hidden");
}

function clearError() {
    verifyError.textContent = "";
    verifyError.classList.add("hidden");
}

if (!phoneNumber) {
    showError("Phone number is missing. Please register again.");
    verifyBtn.disabled = true;
} else {
    phoneText.textContent = phoneNumber;
}

if (demoVerificationCode) {
    demoCodeText.textContent = demoVerificationCode;
    demoCodeBox.classList.remove("hidden");
}

otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 1);
        
        if (input.value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" && !input.value && index > 0) {
            otpInputs[index - 1].focus();
        }
    });
});

function getVerificationCode() {
    return Array.from(otpInputs)
        .map((input) => input.value)
        .join("");
}

verifyBtn.addEventListener("click", async () => {
    clearError();

    const verificationCode = getVerificationCode();

    if (!phoneNumber) {
        showError("Phone number is missing.");
        return;
    }

    if (verificationCode === "") {
        showError("Verification code is required.");
        return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
        showError("Verification code must be 6 digits.");
        return;
    }

    verifyBtn.disabled = true;
    verifyBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
     </svg>`;
     
    try {
        await verify(phoneNumber, verificationCode);
        sessionStorage.removeItem("demoVerificationCode");
        window.location.href = "./login.html";
    } catch (error) {
        verifyBtn.disabled = false;
        verifyBtn.textContent = "Verify";
        showError(error.message);
    }
});