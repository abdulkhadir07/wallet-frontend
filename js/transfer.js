import { getWallet, getQuote, searchRecipients } from './api.js'
import { requireAuth } from './auth.js'
import { formatCurrency } from './utils.js'

requireAuth();

const transferError = document.querySelector("#transferError");
const recipientPhoneNumberInput = document.querySelector("#recipientPhoneNumberInput");
const recipientResults = document.querySelector("#recipientResults");
const amountInput = document.querySelector("#amountInput");
const senderCurrencySymbol = document.querySelector("#senderCurrencySymbol");
const senderCurrencyText = document.querySelector("#senderCurrencyText");
const quoteBox = document.querySelector("#quoteBox");
const recipientGetsText = document.querySelector("#recipientGetsText");
const quoteSummaryText = document.querySelector("#quoteSummaryText");
const descriptionInput = document.querySelector("#descriptionInput");
const reviewBtn = document.querySelector("#reviewBtn");

let currentQuote = null;
let selectedRecipientPhoneNumber = "";
let senderCurrency = "USD";
let searchTimeoutId = null;
let quoteTimeoutId = null;

function showError(message) {
    transferError.textContent = message;
    transferError.classList.remove("hidden");
}

function clearError() {
    transferError.textContent = "";
    transferError.classList.add("hidden");
}

function resetQuote() {
    currentQuote = null;
    reviewBtn.disabled = true;
    quoteBox.classList.add("hidden");
    recipientGetsText.textContent = "-";
    quoteSummaryText.textContent = "";
}

function getCurrencySymbol(currency) {
    const symbols = {
        USD: "$",
        GBP: "£",
        EUR: "€",
        CAD: "$",
        GMD: "D",
        NGN: "₦",
        GHS: "₵"
    };

    return symbols[currency] || currency;
}

function hideRecipientResults() {
    recipientResults.innerHTML = "";
    recipientResults.classList.add("hidden");
}

function renderRecipientResults(recipients) {
    if (!recipients.length) {
        recipientResults.innerHTML = `
            <div class="px-4 py-3 text-sm text-gray-500">
                No registered recipient found.
            </div>
        `;
        recipientResults.classList.remove("hidden");
        return;
    }

    recipientResults.innerHTML = recipients.map((recipient) => {
        return `
            <button type="button" class="w-full text-left px-4 py-3 hover:bg-gray-50 transition recipient-result"
                data-phone="${recipient.recipientPhoneNumber}">
                <p class="text-sm font-semibold text-[#2D0A45]">
                    ${recipient.recipientName} · ${recipient.country}
                </p>
                <p class="text-xs text-gray-500">
                    ${recipient.recipientPhoneNumber}
                </p>
            </button>
        `;
    }).join("");

    recipientResults.classList.remove("hidden");
}

recipientPhoneNumberInput.addEventListener("input", () => {
    clearError();
    resetQuote();

    selectedRecipientPhoneNumber = "";
    const phoneNumber = recipientPhoneNumberInput.value.trim();

    clearTimeout(searchTimeoutId);

    if (phoneNumber.length < 7) {
        hideRecipientResults();
        return;
    }

    searchTimeoutId = setTimeout(async () => {
        try {
            const recipients = await searchRecipients(phoneNumber);
            renderRecipientResults(recipients);
        } catch (error) {
            hideRecipientResults();
            showError(error.message);
        }
    }, 400);
});

recipientResults.addEventListener("click", (event) => {
    const resultButton = event.target.closest(".recipient-result");

    if (!resultButton) {
        return;
    }

    selectedRecipientPhoneNumber = resultButton.dataset.phone;
    recipientPhoneNumberInput.value = selectedRecipientPhoneNumber;
    hideRecipientResults();
    resetQuote();
    loadQuote();
});

async function loadQuote() {
    clearError();
    resetQuote();

    const recipientPhoneNumber = selectedRecipientPhoneNumber;
    const senderAmount = Number(amountInput.value);

    if (!recipientPhoneNumber || !senderAmount || senderAmount <= 0) {
        return;
    }

    try {
        const quote = await getQuote(recipientPhoneNumber, senderAmount);

        currentQuote = quote;
        reviewBtn.disabled = false;

        recipientGetsText.textContent = formatCurrency(quote.recipientAmount, quote.recipientCurrency);
        
        const summaryParts = [
            `Fee: ${formatCurrency(quote.fee, quote.senderCurrency)}`,
            `Total debit: ${formatCurrency(quote.totalDebitAmount, quote.senderCurrency)}`
        ];
        
        if (quote.transferType === "INTERNATIONAL_FX") {
            summaryParts.push(`Rate: 1 ${quote.senderCurrency} = ${quote.retailRate} ${quote.recipientCurrency}`);
        }
        quoteSummaryText.textContent = summaryParts.join(" · ");
        quoteBox.classList.remove("hidden");
    
    } catch (error) {
        resetQuote();
        showError(error.message);
    }
}

amountInput.addEventListener("input", () => {
    clearTimeout(quoteTimeoutId);
    resetQuote();

    quoteTimeoutId = setTimeout(() => {
        loadQuote();
    }, 400);
});


async function loadSenderWallet() {
    try {
        const wallet = await getWallet();

        senderCurrency = wallet.currency;
        senderCurrencyText.textContent = senderCurrency;
        senderCurrencySymbol.textContent = getCurrencySymbol(senderCurrency);
    } catch (error) {
        showError(error.message);
    }
}

reviewBtn.addEventListener("click", () => {
    clearError();

    if (!currentQuote) {
        showError("Please select a recipient and enter an amount first.");
        return;
    }

    const transferDraft = {
        recipientPhoneNumber: currentQuote.recipientPhoneNumber,
        recipientInfo: currentQuote.recipientInfo,
        senderAmount: currentQuote.senderAmount,
        recipientAmount: currentQuote.recipientAmount,
        fee: currentQuote.fee,
        totalDebitAmount: currentQuote.totalDebitAmount,
        retailRate: currentQuote.retailRate,
        senderCurrency: currentQuote.senderCurrency,
        recipientCurrency: currentQuote.recipientCurrency,
        transferType: currentQuote.transferType,
        description: descriptionInput.value.trim()
    };

    sessionStorage.setItem("transferDraft", JSON.stringify(transferDraft));
    window.location.href = "./review-transfer.html";
});

loadSenderWallet();