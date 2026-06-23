import { getWallet, getTransactions } from './api.js'
import { requireAuth, logout } from './auth.js'
import { formatCurrency, formatDate, formatTransactionType } from './utils.js'

requireAuth();

let currentCurrency = "USD";

const dashboardError = document.querySelector("#dashboardError");
const walletBalance = document.querySelector("#walletBalance");
const walletCurrency = document.querySelector("#walletCurrency");
const walletStatus = document.querySelector("#walletStatus");
const sendBtn = document.querySelector("#sendBtn");
const depositBtn = document.querySelector("#depositBtn");
const withdrawBtn = document.querySelector("#withdrawBtn");
const convertBtn = document.querySelector("#convertBtn");
const transactionsList = document.querySelector("#transactionsList");
const totalSentElement = document.querySelector("#totalSent");
const totalReceivedElement = document.querySelector("#totalReceived");

function showError(message) {
    dashboardError.textContent = message;
    dashboardError.classList.remove("hidden");
}

function clearError() {
    dashboardError.textContent = "";
    dashboardError.classList.add("hidden");
}

function handleAuthError(error) {
    if (error.message === "Authentication required or token is invalid") {
        logout();
        return true;
    }

    return false;
}

function calculateTotalByType(transactions, type) {
    return transactions
        .filter((transaction) => transaction.transactionType === type)
        .reduce((total, transaction) => total + transaction.amount, 0);
}

async function loadWallet() {
    clearError();

    try {
        const wallet = await getWallet();
        currentCurrency = wallet.currency;

        walletBalance.textContent = formatCurrency(wallet.balance, currentCurrency);
        walletCurrency.textContent = currentCurrency;
        walletStatus.textContent = wallet.walletStatus;

        walletStatus.className = "inline-flex rounded-full px-3 py-1 text-xs font-semibold";
        
        if (wallet.walletStatus === "ACTIVE") {
            walletStatus.classList.add("bg-green-100", "text-green-700");
        } else if (wallet.walletStatus === "FROZEN") {
            walletStatus.classList.add("bg-red-100", "text-red-700");
        } else {
            walletStatus.classList.add("bg-white/20", "text-white");
        }
    
    } catch (error) {
        if (handleAuthError(error)) {
            return;
        }
        showError(error.message);
    }
}

function formatTransactionTitle(transaction) {
    if (transaction.transactionSource === "TRANSFER") {
        if (transaction.counterpartyName) {
            const counterpartyText = transaction.counterpartyPhoneNumber
                ? `${transaction.counterpartyName} (${transaction.counterpartyPhoneNumber})`
                : transaction.counterpartyName;

            return transaction.transactionType === "DEBIT"
                ? `Transfer to ${counterpartyText}`
                : `Transfer from ${counterpartyText}`;
        }

        return transaction.transactionType === "DEBIT" ? "Transfer sent" : "Transfer received";
    }

    if (transaction.transactionSource === "BANK_DEPOSIT") {
        return "Deposit";
    }

    if (transaction.transactionSource === "BANK_WITHDRAWAL") {
        return "Withdrawal";
    }

    return transaction.transactionSource;
}

async function loadTransactions() {

    try {
        const transactions = await getTransactions();
        
        const totalSent = calculateTotalByType(transactions, "DEBIT");
        const totalReceived = calculateTotalByType(transactions, "CREDIT");
        
        totalSentElement.textContent = formatCurrency(totalSent, currentCurrency);
        totalReceivedElement.textContent = formatCurrency(totalReceived, currentCurrency);
        
        if (!transactions.length) {
            transactionsList.innerHTML = `<li class="py-3 text-sm text-gray-500">No recent activity yet.</li>`;
            return;
        }

        const recentTransactions = transactions.slice(0, 3);
        
        
        transactionsList.innerHTML = recentTransactions.map((transaction) => {
            const amountPrefix = transaction.transactionType === "DEBIT" ? "-" : "+";
            const amountColor = transaction.transactionType === "DEBIT" ? "text-red-600" : "text-green-600";
            
            return `
                <li class="py-3 flex items-center justify-between gap-4">
                    <div>
                        <p class="text-sm font-semibold text-[#2D0A45]">
                            ${formatTransactionTitle(transaction)}
                        </p>
                        <p class="text-xs text-gray-500">
                            ${formatTransactionType(transaction.transactionType)} • ${formatDate(transaction.createdAt)}
                        </p>
                    </div>
                    
                    <div class="text-right">
                        <p class="text-sm font-semibold ${amountColor}">
                            ${amountPrefix}${formatCurrency(transaction.amount, currentCurrency)}
                        </p>
                        <p class="text-xs text-gray-500">
                            ${transaction.transactionStatus}
                        </p>
                    </div>
                </li>
            `;
        }).join("");

    } catch (error) {
        if (handleAuthError(error)) {
            return;
        }
        showError(error.message);
    }
}

sendBtn.addEventListener("click", () => {
    window.location.href = "./transfer.html";
});

depositBtn.addEventListener("click", () => {
    window.location.href = "./deposit.html";
});

withdrawBtn.addEventListener("click", () => {
    showError("Withdraw is coming soon.");
});

convertBtn.addEventListener("click", () => {
    showError("Currency conversion is coming soon.");
});

async function loadDashboard() {
    await loadWallet();
    await loadTransactions();
}

loadDashboard();