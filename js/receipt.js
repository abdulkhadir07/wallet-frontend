import { getTransferByReference } from './api.js'
import { requireAuth } from './auth.js'
import { formatCurrency, formatTransactionType } from './utils.js'

requireAuth();

const receiptError = document.querySelector("#receiptError");
const receiptAmount = document.querySelector("#receiptAmount");
const receiptType = document.querySelector("#receiptType");
const receiptSource = document.querySelector("#receiptSource");
const receiptStatus = document.querySelector("#receiptStatus");
const receiptReference = document.querySelector("#receiptReference");
const receiptDescription = document.querySelector("#receiptDescription");
const receiptDate = document.querySelector("#receiptDate");
const printReceiptBtn = document.querySelector("#printReceiptBtn");

const receiptTransferSection = document.querySelector("#receiptTransferSection");
const receiptCounterpartyLabel = document.querySelector("#receiptCounterpartyLabel");
const receiptCounterparty = document.querySelector("#receiptCounterparty");
const receiptCounterpartyPhoneLabel = document.querySelector("#receiptCounterpartyPhoneLabel");
const receiptCounterpartyPhone = document.querySelector("#receiptCounterpartyPhone");
const receiptRecipientReceivedRow = document.querySelector("#receiptRecipientReceivedRow");
const receiptRecipientReceived = document.querySelector("#receiptRecipientReceived");
const receiptTransferFeeRow = document.querySelector("#receiptTransferFeeRow");
const receiptTransferFee = document.querySelector("#receiptTransferFee");
const receiptTransferRateRow = document.querySelector("#receiptTransferRateRow");
const receiptTransferRate = document.querySelector("#receiptTransferRate");
const receiptTransferReference = document.querySelector("#receiptTransferReference");

const savedTransaction = JSON.parse(sessionStorage.getItem("selectedWalletTransaction"));


function showError(message) {
    receiptError.textContent = message;
    receiptError.classList.remove("hidden");
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

function formatAmountWithCode(amount, currency) {
    return `${formatCurrency(amount, currency)} ${currency}`;
}

function renderReceipt() {
    if (!savedTransaction) {
        showError("Receipt details are missing. Please go back to history and select a transaction.");
        printReceiptBtn.disabled = true;
        return;
    }

    const transaction = savedTransaction.transaction;
    const currency = savedTransaction.currency || "USD";
    const amountPrefix = transaction.transactionType === "DEBIT" ? "-" : "";

    receiptAmount.textContent = `${amountPrefix}${formatCurrency(transaction.amount, currency)}`;
    receiptType.textContent = formatLabel(formatTransactionType(transaction.transactionType));
    receiptSource.textContent = formatLabel(transaction.transactionSource);
    receiptStatus.textContent = formatLabel(transaction.transactionStatus);
    receiptReference.textContent = transaction.reference || "-";
    receiptDescription.textContent = transaction.description || "No description";
    receiptDate.textContent = formatDateTime(transaction.createdAt);
}

async function loadReceiptTransferDetails() {
    const transaction = savedTransaction?.transaction;
    const transferReference = transaction?.transferReference;

    if (!transferReference) {
        return;
    }

    try {
        const transfer = await getTransferByReference(transferReference);
        const isDebit = transaction.transactionType === "DEBIT";

        receiptTransferSection.classList.remove("hidden");

        if (isDebit) {
            receiptCounterpartyLabel.textContent = "Recipient";
            receiptCounterpartyPhoneLabel.textContent = "Recipient phone";

            receiptCounterparty.textContent = transfer.recipientInfo?.recipientName || "-";
            receiptCounterpartyPhone.textContent = transfer.recipientInfo?.recipientPhoneNumber || "-";

            receiptRecipientReceivedRow.classList.remove("hidden");
            receiptRecipientReceived.textContent = formatAmountWithCode(transfer.recipientAmount, transfer.recipientCurrency);

            receiptTransferFeeRow.classList.remove("hidden");
            receiptTransferFee.textContent = formatAmountWithCode(transfer.fee, transfer.senderCurrency);

            if (transfer.senderCurrency !== transfer.recipientCurrency) {
                const rate = Number(transfer.recipientAmount) / Number(transfer.senderAmount);

                receiptTransferRateRow.classList.remove("hidden");
                receiptTransferRate.textContent = `1 ${transfer.senderCurrency} = ${rate.toFixed(4)} ${transfer.recipientCurrency}`;
            } else {
                receiptTransferRateRow.classList.add("hidden");
                receiptTransferRate.textContent = "";
            }
        } else {
            receiptCounterpartyLabel.textContent = "Sender";
            receiptCounterpartyPhoneLabel.textContent = "Sender phone";

            receiptCounterparty.textContent = transfer.senderInfo?.senderName || "-";
            receiptCounterpartyPhone.textContent = transfer.senderInfo?.senderPhoneNumber || "-";

            receiptRecipientReceivedRow.classList.add("hidden");
            receiptRecipientReceived.textContent = "";

            receiptTransferFeeRow.classList.add("hidden");
            receiptTransferFee.textContent = "";

            receiptTransferRateRow.classList.add("hidden");
            receiptTransferRate.textContent = "";
        }
        
        receiptTransferReference.textContent = transfer.reference || "-";
    
    } catch (error) {
        showError(error.message);
    }
}

renderReceipt();
loadReceiptTransferDetails();

printReceiptBtn.addEventListener("click", () => {
    window.print();
});