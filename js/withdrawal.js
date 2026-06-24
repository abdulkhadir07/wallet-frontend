import { getWallet, withdraw } from './api.js'
import { requireAuth } from './auth.js'

requireAuth();

const withdrawalError = document.querySelector("#withdrawalError");
const withdrawalFormError = document.querySelector("#withdrawalFormError");
const withdrawalCurrencySymbol = document.querySelector("#withdrawalCurrencySymbol");
const withdrawalCurrencyText = document.querySelector("#withdrawalCurrencyText");
const confirmWithdrawalBtn = document.querySelector("#confirmWithdrawalBtn");

const stepMethod = document.querySelector("#step-method");
const stepBankAccount = document.querySelector("#step-bank-account");

let senderCurrency = "USD";

function show(el) { el.classList.remove("hidden"); }
function hide(el) { el.classList.add("hidden"); }

function showError(el, message) {
    el.textContent = message;
    el.classList.remove("hidden");
}

function clearError(el) {
    el.textContent = "";
    el.classList.add("hidden");
}

function getCurrencySymbol(currency) {
    const symbols = {
        USD: "$", GBP: "£", EUR: "€", CAD: "$",
        GMD: "D", NGN: "₦", GHS: "₵"
    };
    return symbols[currency] || currency;
}

async function loadWallet() {
    try {
        const wallet = await getWallet();
        senderCurrency = wallet.currency;
        withdrawalCurrencyText.textContent = senderCurrency;
        withdrawalCurrencySymbol.textContent = getCurrencySymbol(senderCurrency);
    } catch (error) {
        showError(withdrawalError, error.message);
    }
}

// Step navigation
document.querySelector("#selectBankAccount").addEventListener("click", () => {
    clearError(withdrawalError);
    hide(stepMethod);
    show(stepBankAccount);
});

document.querySelector("#backFromBankAccount").addEventListener("click", () => {
    hide(stepBankAccount);
    show(stepMethod);
    clearError(withdrawalFormError);
    document.querySelector("#accountName").value = "";
    document.querySelector("#bankName").value = "";
    document.querySelector("#accountNumber").value = "";
    document.querySelector("#routingNumber").value = "";
    document.querySelector("#withdrawalAmount").value = "";
});

// Confirm withdrawal
confirmWithdrawalBtn.addEventListener("click", async () => {
    clearError(withdrawalFormError);

    const accountName = document.querySelector("#accountName").value.trim();
    const bankName = document.querySelector("#bankName").value.trim();
    const accountNumber = document.querySelector("#accountNumber").value.trim();
    const routingNumber = document.querySelector("#routingNumber").value.trim();
    const amount = Number(document.querySelector("#withdrawalAmount").value);

    const accountNameError = document.querySelector("#accountNameError");
    const bankNameError = document.querySelector("#bankNameError");
    const accountNumberError = document.querySelector("#accountNumberError");
    const routingNumberError = document.querySelector("#routingNumberError");
    const withdrawalAmountError = document.querySelector("#withdrawalAmountError");

    // Clear all field errors
    clearError(accountNameError);
    clearError(bankNameError);
    clearError(accountNumberError);
    clearError(routingNumberError);
    clearError(withdrawalAmountError);

    // Validate
    let hasError = false;

    if (!accountName) {
        showError(accountNameError, "Account holder name is required.");
        hasError = true;
    }

    if (!bankName) {
        showError(bankNameError, "Bank name is required.");
        hasError = true;
    }

    if (!accountNumber) {
        showError(accountNumberError, "Account number is required.");
        hasError = true;
    }

    if (!routingNumber) {
        showError(routingNumberError, "Routing number is required.");
        hasError = true;
    }

    if (!amount || amount <= 0) {
        showError(withdrawalAmountError, "Please enter a valid amount.");
        hasError = true;
    }

    if (hasError) return;

    confirmWithdrawalBtn.disabled = true;
    confirmWithdrawalBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
     </svg>`;

    try {
        await withdraw(amount, "BANK_TRANSFER", accountName, accountNumber, routingNumber, bankName);
        window.location.href = `./dashboard.html?withdrawalSuccess=true&amount=${amount}&currency=${senderCurrency}`;

    } catch (error) {
        confirmWithdrawalBtn.disabled = false;
        confirmWithdrawalBtn.textContent = "Confirm withdrawal";
        showError(withdrawalFormError, error.message);
    }
});

loadWallet();