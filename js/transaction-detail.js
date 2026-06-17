import { requireAuth } from './auth.js'
import { formatCurrency, formatTransactionType } from './utils.js'

requireAuth();

const transactionDetailError = document.querySelector("#transactionDetailError");
const detailAmount = document.querySelector("#detailAmount");
const detailStatus = document.querySelector("#detailStatus");
const detailType = document.querySelector("#detailType");
const detailSource = document.querySelector("#detailSource");
const detailBalanceBefore = document.querySelector("#detailBalanceBefore");
const detailBalanceAfter = document.querySelector("#detailBalanceAfter");
const detailReference = document.querySelector("#detailReference");
const detailDate = document.querySelector("#detailDate");
const detailDescription = document.querySelector("#detailDescription");

const savedTransaction = JSON.parse(sessionStorage.getItem("selectedWalletTransaction"));

function showError(message) {
    transactionDetailError.textContent = message;
    transactionDetailError.classList.remove("hidden");
}

function clearError() {
    transactionDetailError.textContent = "";
    transactionDetailError.classList.add("hidden");
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

function formatLabel(value) {
    if (!value) {
        return "-";
    }

    return value
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function renderTransactionDetail() {
    clearError();

    if (!savedTransaction) {
        showError("Transaction details are missing. Please go back to history and select a transaction.");
        return;
    }

    const transaction = savedTransaction.transaction;
    const currency = savedTransaction.currency || "USD";
    const amountPrefix = transaction.transactionType === "DEBIT" ? "-" : "";

    detailAmount.textContent = `${amountPrefix}${formatCurrency(transaction.amount, currency)}`;
    detailStatus.textContent = formatLabel(transaction.transactionStatus);
    detailType.textContent = formatLabel(formatTransactionType(transaction.transactionType));
    detailSource.textContent = formatLabel(transaction.transactionSource);
    detailBalanceBefore.textContent = formatCurrency(transaction.balanceBefore, currency);
    detailBalanceAfter.textContent = formatCurrency(transaction.balanceAfter, currency);
    detailReference.textContent = transaction.reference || "-";
    detailDate.textContent = formatDateTime(transaction.createdAt);
    detailDescription.textContent = transaction.description || "No description";
}

renderTransactionDetail();