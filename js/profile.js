import { getProfile, changePassword, getWallet, freezeWallet, unfreezeWallet } from './api.js'
import { requireAuth, logout } from './auth.js'
import { formatDate } from './utils.js'

requireAuth();

const profileError = document.querySelector("#profileError");
const profileSuccess = document.querySelector("#profileSuccess");

const avatarInitials = document.querySelector("#avatarInitials");
const profileFullName = document.querySelector("#profileFullName");
const profilePhone = document.querySelector("#profilePhone");
const profileFirstName = document.querySelector("#profileFirstName");
const profileLastName = document.querySelector("#profileLastName");
const profileEmail = document.querySelector("#profileEmail");
const profileCountry = document.querySelector("#profileCountry");
const profileDOB = document.querySelector("#profileDOB");
const profileVerified = document.querySelector("#profileVerified");

const walletStatusText = document.querySelector("#walletStatusText");
const freezeWalletBtn = document.querySelector("#freezeWalletBtn");

const toggleChangePassword = document.querySelector("#toggleChangePassword");
const changePasswordForm = document.querySelector("#changePasswordForm");
const cancelChangePassword = document.querySelector("#cancelChangePassword");
const savePasswordBtn = document.querySelector("#savePasswordBtn");
const changePasswordError = document.querySelector("#changePasswordError");

const toggleTerms = document.querySelector("#toggleTerms");
const termsContent = document.querySelector("#termsContent");
const togglePrivacy = document.querySelector("#togglePrivacy");
const privacyContent = document.querySelector("#privacyContent");

const logoutBtn = document.querySelector("#logoutBtn");

let currentWalletStatus = null;

function showError(message) {
    profileError.textContent = message;
    profileError.classList.remove("hidden");
    profileSuccess.classList.add("hidden");
}

function showSuccess(message) {
    profileSuccess.textContent = message;
    profileSuccess.classList.remove("hidden");
    profileError.classList.add("hidden");

    setTimeout(() => {
        profileSuccess.classList.add("hidden");
    }, 4000);
}

function clearMessages() {
    profileError.classList.add("hidden");
    profileSuccess.classList.add("hidden");
}

function showFieldError(el, message) {
    el.textContent = message;
    el.classList.remove("hidden");
}

function clearFieldError(el) {
    el.textContent = "";
    el.classList.add("hidden");
}

function formatCountry(country) {
    if (!country) return "";
    return country.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// Load profile
async function loadProfile() {
    try {
        const profile = await getProfile();

        const initials = profile.firstName.charAt(0).toUpperCase() + profile.lastName.charAt(0).toUpperCase();
        avatarInitials.textContent = initials;
        profileFullName.textContent = profile.firstName + " " + profile.lastName;
        profilePhone.textContent = profile.phoneNumber;
        profileFirstName.textContent = profile.firstName;
        profileLastName.textContent = profile.lastName;
        profileEmail.textContent = profile.email;
        profileCountry.textContent = formatCountry(profile.country);
        profileDOB.textContent = formatDate(profile.dateOfBirth);

        profileVerified.textContent = profile.verified ? "Verified" : "Unverified";
        profileVerified.className = profile.verified
            ? "font-semibold text-green-600 text-right"
            : "font-semibold text-red-500 text-right";

    } catch (error) {
        showError(error.message);
    }
}

// Load wallet status
async function loadWallet() {
    try {
        const wallet = await getWallet();
        currentWalletStatus = wallet.walletStatus;

        walletStatusText.textContent = wallet.walletStatus;
        walletStatusText.className = wallet.walletStatus === "ACTIVE"
            ? "font-semibold text-green-600"
            : "font-semibold text-red-500";

        freezeWalletBtn.textContent = wallet.walletStatus === "ACTIVE"
            ? "Freeze wallet"
            : "Unfreeze wallet";

    } catch (error) {
        showError(error.message);
    }
}

// Freeze / Unfreeze wallet
freezeWalletBtn.addEventListener("click", async () => {
    clearMessages();

    freezeWalletBtn.disabled = true;
    freezeWalletBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
     </svg>`;

    try {
        if (currentWalletStatus === "ACTIVE") {
            await freezeWallet();
            showSuccess("Your wallet has been frozen.");
        } else {
            await unfreezeWallet();
            showSuccess("Your wallet has been unfrozen.");
        }
        await loadWallet();
    } catch (error) {
        showError(error.message);
        freezeWalletBtn.disabled = false;
        await loadWallet();
    }
});

// Toggle change password form
toggleChangePassword.addEventListener("click", () => {
    changePasswordForm.classList.toggle("hidden");
});

cancelChangePassword.addEventListener("click", () => {
    changePasswordForm.classList.add("hidden");
    document.querySelector("#currentPassword").value = "";
    document.querySelector("#newPassword").value = "";
    document.querySelector("#confirmPassword").value = "";
    clearFieldError(document.querySelector("#currentPasswordError"));
    clearFieldError(document.querySelector("#newPasswordError"));
    clearFieldError(document.querySelector("#confirmPasswordError"));
    clearFieldError(changePasswordError);
});

// Save new password
savePasswordBtn.addEventListener("click", async () => {
    clearMessages();

    const currentPasswordEl = document.querySelector("#currentPassword");
    const newPasswordEl = document.querySelector("#newPassword");
    const confirmPasswordEl = document.querySelector("#confirmPassword");
    const currentPasswordError = document.querySelector("#currentPasswordError");
    const newPasswordError = document.querySelector("#newPasswordError");
    const confirmPasswordError = document.querySelector("#confirmPasswordError");

    const currentPasswordVal = currentPasswordEl.value;
    const newPasswordVal = newPasswordEl.value;
    const confirmPasswordVal = confirmPasswordEl.value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;

    clearFieldError(currentPasswordError);
    clearFieldError(newPasswordError);
    clearFieldError(confirmPasswordError);
    clearFieldError(changePasswordError);

    let hasError = false;

    if (!currentPasswordVal) {
        showFieldError(currentPasswordError, "Current password is required.");
        hasError = true;
    }

    if (!newPasswordVal) {
        showFieldError(newPasswordError, "New password is required.");
        hasError = true;
    } else if (!passwordRegex.test(newPasswordVal)) {
        showFieldError(newPasswordError, "Password must contain uppercase, lowercase, number and special character.");
        hasError = true;
    }

    if (!confirmPasswordVal) {
        showFieldError(confirmPasswordError, "Please confirm your new password.");
        hasError = true;
    } else if (newPasswordVal !== confirmPasswordVal) {
        showFieldError(confirmPasswordError, "Passwords do not match.");
        hasError = true;
    }

    if (hasError) return;

    savePasswordBtn.disabled = true;
    savePasswordBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0w 24 24">
     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
     </svg>`;

    try {
        await changePassword(currentPasswordVal, newPasswordVal, confirmPasswordVal);
        savePasswordBtn.disabled = false;
        savePasswordBtn.textContent = "Save new password";
        changePasswordForm.classList.add("hidden");
        currentPasswordEl.value = "";
        newPasswordEl.value = "";
        confirmPasswordEl.value = "";
        showSuccess("Password changed successfully.");
    } catch (error) {
        savePasswordBtn.disabled = false;
        savePasswordBtn.textContent = "Save new password";
        showFieldError(changePasswordError, error.message);
    }
});

// Toggle terms
toggleTerms.addEventListener("click", () => {
    termsContent.classList.toggle("hidden");
});

// Toggle privacy
togglePrivacy.addEventListener("click", () => {
    privacyContent.classList.toggle("hidden");
});

// Logout
logoutBtn.addEventListener("click", () => {
    logout();
});

// Load page
loadProfile();
loadWallet();