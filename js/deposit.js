import { getWallet, deposit } from './api.js'
import { requireAuth } from './auth.js'
import { formatCurrency } from './utils.js'

requireAuth();

const depositError = document.querySelector("#depositError");
const depositReference = document.querySelector("#depositReference");
const bankTransferAmount = document.querySelector("#bankTransferAmount");
const bankTransferAmountError = document.querySelector("#bankTransferAmountError");
const confirmBankTransferBtn = document.querySelector("#confirmBankTransferBtn");

const stepMethod = document.querySelector("#step-method");
const stepBankTransfer = document.querySelector("#step-bank-transfer");
const stepDebitCard = document.querySelector("#step-debit-card");

let userPhoneNumber = "";
let senderCurrency = "USD";

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function showError(message) {
    depositError.textContent = message;
    depositError.classList.remove("hidden");
}

function clearError() {
    depositError.textContent = "";
    depositError.classList.add("hidden");
}

function showAmountError(message) {
    bankTransferAmountError.textContent = message;
    bankTransferAmountError.classList.remove("hidden");
}

function clearAmountError() {
    bankTransferAmountError.textContent = "";
    bankTransferAmountError.classList.add("hidden");
}

// Load wallet to get currency and phone number
async function loadWallet() {
    try {
        const wallet = await getWallet();
        senderCurrency = wallet.currency;

        // Use phone number stored in localStorage from login
        userPhoneNumber = localStorage.getItem("enum_phone") || "your phone number";
        depositReference.textContent = userPhoneNumber;

    } catch (error) {
        showError(error.message);
    }
}

// Step navigation
document.querySelector("#selectBankTransfer").addEventListener("click", () => {
    clearError();
    hide(stepMethod);
    show(stepBankTransfer);
});

document.querySelector("#selectDebitCard").addEventListener("click", () => {
    clearError();
    hide(stepMethod);
    show(stepDebitCard);
});

document.querySelector("#backFromBankTransfer").addEventListener("click", () => {
    hide(stepBankTransfer);
    show(stepMethod);
    clearAmountError();
    bankTransferAmount.value = "";
});

document.querySelector("#backFromDebitCard").addEventListener("click", () => {
    hide(stepDebitCard);
    show(stepMethod);
});

// Confirm bank transfer
confirmBankTransferBtn.addEventListener("click", async () => {
    clearError();
    clearAmountError();

    const amount = Number(bankTransferAmount.value);

    if (!amount || amount <= 0) {
        showAmountError("Please enter a valid amount.");
        return;
    }

    if (amount < 0.01) {
        showAmountError("Minimum deposit amount is 0.01.");
        return;
    }

    confirmBankTransferBtn.disabled = true;
    confirmBankTransferBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
     </svg>`;

    try {
        const response = await deposit(amount, "BANK_TRANSFER");

        // Redirect to dashboard with success message in URL
        window.location.href = `./dashboard.html?depositSuccess=true&amount=${amount}&currency=${response.currency}`;

    } catch (error) {
        confirmBankTransferBtn.disabled = false;
        confirmBankTransferBtn.textContent = "I have made this transfer";
        showError(error.message);
    }
});

loadWallet();