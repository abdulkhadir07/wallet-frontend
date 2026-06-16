import { sendTransfer } from './api.js'
import { requireAuth } from './auth.js'

requireAuth();

const reviewError = document.querySelector("#reviewError");
const reviewRecipientGets = document.querySelector("#reviewRecipientGets");
const reviewSenderAmount = document.querySelector("#reviewSenderAmount");
const reviewRateRow = document.querySelector("#reviewRateRow");
const reviewRate = document.querySelector("#reviewRate");
const reviewFee = document.querySelector("#reviewFee");
const reviewTotalDebit = document.querySelector("#reviewTotalDebit");
const reviewRecipient = document.querySelector("#reviewRecipient");
const reviewRecipientPhoneNumber = document.querySelector("#reviewRecipientPhoneNumber");
const reviewTransferType = document.querySelector("#reviewTransferType");
const reviewDescription = document.querySelector("#reviewDescription");
const reviewDate = document.querySelector("#reviewDate");
const sendNowBtn = document.querySelector("#sendNowBtn");

const draft = JSON.parse(sessionStorage.getItem("transferDraft"));

function showError(message) {
    reviewError.textContent = message;
    reviewError.classList.remove("hidden");
}

function clearError() {
    reviewError.textContent = "";
    reviewError.classList.add("hidden");
}

function getCurrencySymbol(currency) {
    const symbols = {
        USD: "$",
        CAD: "C$",
        EUR: "€",
        GBP: "£",
        CHF: "CHF",
        JPY: "¥",
        INR: "₹",
        CNY: "¥",
        KRW: "₩",
        GMD: "D",
        NGN: "₦",
        GHS: "₵",
        ZAR: "R",
        MAD: "MAD",
        ETB: "Br",
        XAF: "FCFA",
        XOF: "CFA",
        KES: "KSh"
    };

    return symbols[currency] || "";
}

function formatAmountWithCode(amount, currency) {
    const formattedAmount = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(amount));

    const symbol = getCurrencySymbol(currency);

    if (!symbol) {
        return `${formattedAmount} ${currency}`;
    }

    return `${symbol}${formattedAmount} ${currency}`;
}

function formatTransferType(type) {
    if (type === "DOMESTIC_FREE") {
        return "Domestic transfer";
    }

    if (type === "INTERNATIONAL_SAME_CURRENCY") {
        return "International transfer";
    }

    if (type === "INTERNATIONAL_FX") {
        return "International FX transfer";
    }

    return type;
}

function formatDateTime(dateString) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    }).format(new Date(dateString));
}

function renderReview() {
    if (!draft) {
        showError("Transfer details are missing. Please start again.");
        sendNowBtn.disabled = true;
        return;
    }

    reviewRecipientGets.textContent = formatAmountWithCode(draft.recipientAmount, draft.recipientCurrency);
    reviewSenderAmount.textContent = formatAmountWithCode(draft.senderAmount, draft.senderCurrency);
    reviewFee.textContent = formatAmountWithCode(draft.fee, draft.senderCurrency);
    reviewTotalDebit.textContent = formatAmountWithCode(draft.totalDebitAmount, draft.senderCurrency);

    reviewRecipient.textContent = draft.recipientInfo?.recipientName || "Recipient";
    reviewRecipientPhoneNumber.textContent = draft.recipientPhoneNumber;
    reviewTransferType.textContent = formatTransferType(draft.transferType);
    reviewDescription.textContent = draft.description || "No description";
    reviewDate.textContent = formatDateTime(new Date().toISOString());

    if (draft.transferType === "INTERNATIONAL_FX") {
        reviewRateRow.classList.remove("hidden");
        reviewRate.textContent = `1 ${draft.senderCurrency} = ${draft.retailRate} ${draft.recipientCurrency}`;
    }
}

renderReview();

sendNowBtn.addEventListener("click", async () => {
    clearError();

    if (!draft) {
        showError("Transfer details are missing. Please start again.");
        return;
    }

    sendNowBtn.disabled = true;
    sendNowBtn.innerHTML = `<svg class="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
     <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
     <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
     </svg>`;

    try {
        await sendTransfer(
            draft.recipientPhoneNumber,
            draft.senderAmount,
            draft.description
        );

        sessionStorage.removeItem("transferDraft");
        window.location.href = "./dashboard.html";
    } catch (error) {
        sendNowBtn.disabled = false;
        sendNowBtn.textContent = "Send now";
        showError(error.message);
    }
});