import { getTransferByReference } from './api.js'
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
const downloadBtn = document.querySelector("#downloadBtn");

const transferDetailsSection = document.querySelector("#transferDetailsSection");
const detailCounterpartyLabel = document.querySelector("#detailCounterpartyLabel");
const detailCounterparty = document.querySelector("#detailCounterparty");
const detailCounterpartyPhoneLabel = document.querySelector("#detailCounterpartyPhoneLabel");
const detailCounterpartyPhone = document.querySelector("#detailCounterpartyPhone");
const detailRecipientReceivedRow = document.querySelector("#detailRecipientReceivedRow");
const detailRecipientReceived = document.querySelector("#detailRecipientReceived");
const detailTransferFeeRow = document.querySelector("#detailTransferFeeRow");
const detailTransferFee = document.querySelector("#detailTransferFee");
const detailTransferRateRow = document.querySelector("#detailTransferRateRow");
const detailTransferRate = document.querySelector("#detailTransferRate");
const detailTransferReference = document.querySelector("#detailTransferReference");

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

function formatAmountWithCode(amount, currency) {
    return `${formatCurrency(amount, currency)} ${currency}`;
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

async function loadTransferDetails() {
    const transaction = savedTransaction?.transaction;
    const transferReference = transaction?.transferReference;

    if (!transferReference) {
        return;
    }

    try {
        const transfer = await getTransferByReference(transferReference);
        const isDebit = transaction.transactionType === "DEBIT";

        transferDetailsSection.classList.remove("hidden");

        if (isDebit) {
            detailCounterpartyLabel.textContent = "Recipient";
            detailCounterpartyPhoneLabel.textContent = "Recipient phone";

            detailCounterparty.textContent = transfer.recipientInfo?.recipientName || "-";
            detailCounterpartyPhone.textContent = transfer.recipientInfo?.recipientPhoneNumber || "-";

            detailRecipientReceivedRow.classList.remove("hidden");
            detailRecipientReceived.textContent = formatAmountWithCode(transfer.recipientAmount, transfer.recipientCurrency);

            detailTransferFeeRow.classList.remove("hidden");
            detailTransferFee.textContent = formatAmountWithCode(transfer.fee, transfer.senderCurrency);

            if (transfer.senderCurrency !== transfer.recipientCurrency) {
                const rate = Number(transfer.recipientAmount) / Number(transfer.senderAmount);

                detailTransferRateRow.classList.remove("hidden");
                detailTransferRate.textContent = `1 ${transfer.senderCurrency} = ${rate.toFixed(4)} ${transfer.recipientCurrency}`;
            } else {
                detailTransferRateRow.classList.add("hidden");
                detailTransferRate.textContent = "";
            }
        } else {
            detailCounterpartyLabel.textContent = "Sender";
            detailCounterpartyPhoneLabel.textContent = "Sender phone";

            detailCounterparty.textContent = transfer.senderInfo?.senderName || "-";
            detailCounterpartyPhone.textContent = transfer.senderInfo?.senderPhoneNumber || "-";

            detailRecipientReceivedRow.classList.add("hidden");
            detailRecipientReceived.textContent = "";

            detailTransferFeeRow.classList.add("hidden");
            detailTransferFee.textContent = "";

            detailTransferRateRow.classList.add("hidden");
            detailTransferRate.textContent = "";
        }

        detailTransferReference.textContent = transfer.reference || "-";
    } catch (error) {
        showError(error.message);
    }
}

renderTransactionDetail();
loadTransferDetails();

downloadBtn.addEventListener("click", () => {
    if (!savedTransaction) {
        showError("Transaction details are missing. Please go back to history and select a transaction.");
        return;
    }

    window.location.href = "./receipt.html";
});