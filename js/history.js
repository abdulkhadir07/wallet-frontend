import { getWallet, getTransactions } from './api.js'
import { requireAuth, logout } from './auth.js'
import { formatCurrency, formatDate, formatTransactionType } from './utils.js'

requireAuth();

const historySearchInput = document.querySelector("#historySearchInput");
const historyError = document.querySelector("#historyError");
const filterAllBtn = document.querySelector("#filterAllBtn");
const filterSentBtn = document.querySelector("#filterSentBtn");
const filterReceivedBtn = document.querySelector("#filterReceivedBtn");
const filterDepositsBtn = document.querySelector("#filterDepositsBtn");
const filterWithdrawalsBtn = document.querySelector("#filterWithdrawalsBtn");
const historyList = document.querySelector("#historyList");

let allTransactions = [];
let currentFilter = "all";
let currentCurrency = "USD";

function showError(message) {
    historyError.textContent = message;
    historyError.classList.remove("hidden");
}

function clearError() {
    historyError.textContent = "";
    historyError.classList.add("hidden");
}

function handleAuthError(error) {
    if (error.message === "Authentication required or token is invalid") {
        logout();
        return true;
    }
    return false;
}

async function loadHistory () {
    clearError();

    try {
        const wallet = await getWallet();
        currentCurrency = wallet.currency;

        allTransactions = await getTransactions();

        renderHistory();

    } catch (error) {

        if (handleAuthError (error)) {
            return;
        }
        
        showError(error.message);

    }

}

function filterTransactions(transactions) {
    
    if (currentFilter === "sent") {
        return transactions.filter((transaction) =>
            transaction.transactionSource === "TRANSFER" && transaction.transactionType === "DEBIT"
        );
    }

    if (currentFilter === "received") {
        return transactions.filter((transaction) =>
            transaction.transactionSource === "TRANSFER" && transaction.transactionType === "CREDIT"
        );
    }

    if (currentFilter === "deposits") {
        return transactions.filter((transaction) =>
            transaction.transactionSource === "BANK_DEPOSIT"
        );
    }

    if (currentFilter === "withdrawals") {
        return transactions.filter((transaction) =>
            transaction.transactionSource === "BANK_WITHDRAWAL"
        );
    }

    return transactions;
}

function setActiveFilter(activeButton) {
    const buttons = [
        filterAllBtn,
        filterSentBtn,
        filterReceivedBtn,
        filterDepositsBtn,
        filterWithdrawalsBtn
    ];

    buttons.forEach((button) => {
        button.className = "px-4 py-2 rounded-xl text-sm font-semibold bg-white text-[#2D0A45] border border-gray-200";
    });

    activeButton.className = "px-4 py-2 rounded-xl text-sm font-semibold bg-[#2D0A45] text-white";
}

function renderHistory() {
    const currentFilteredTransactions = filterTransactions(allTransactions);
    const searchTerm = historySearchInput.value.trim().toLowerCase();

    const visibleTransactions = currentFilteredTransactions.filter((transaction) => {
        const searchableText = [
            transaction.description,
            transaction.transactionSource,
            transaction.transactionStatus,
            transaction.reference,
            transaction.transactionType,
            formatDate(transaction.createdAt)
        ].join(" ").toLowerCase();
        
        return searchableText.includes(searchTerm);
    });
    
    if (!visibleTransactions.length) {
        historyList.innerHTML = `<li class="py-3 text-sm text-gray-500">No activity found.</li>`;
        return;
    }

    historyList.innerHTML = visibleTransactions.map((transaction) => {
        const amountPrefix = transaction.transactionType === "DEBIT" ? "-" : "+";
        return `
            <li class="py-4">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="text-sm font-semibold text-[#2D0A45]">
                            ${transaction.description || transaction.transactionSource}
                        </p>
                        <p class="text-xs text-gray-500">
                            ${formatTransactionType(transaction.transactionType)} • ${formatDate(transaction.createdAt)}
                        </p>
                        <p class="text-xs text-gray-400">
                            ${transaction.reference || "No reference"}
                        </p>
                    </div>

                    <div class="text-right">
                        <p class="text-sm font-semibold text-[#2D0A45]">
                            ${amountPrefix}${formatCurrency(transaction.amount, currentCurrency)}
                        </p>
                        <p class="text-xs text-gray-500">
                            ${transaction.transactionStatus}
                        </p>
                    </div>
                </div>
            </li>
        `;
    }).join("");
}

filterAllBtn.addEventListener("click", () => {
    currentFilter = "all";
    setActiveFilter(filterAllBtn);
    renderHistory();
});

filterSentBtn.addEventListener("click", () => {
    currentFilter = "sent";
    setActiveFilter(filterSentBtn);
    renderHistory();
});

filterReceivedBtn.addEventListener("click", () => {
    currentFilter = "received";
    setActiveFilter(filterReceivedBtn);
    renderHistory();
});

filterDepositsBtn.addEventListener("click", () => {
    currentFilter = "deposits";
    setActiveFilter(filterDepositsBtn);
    renderHistory();
});

filterWithdrawalsBtn.addEventListener("click", () => {
    currentFilter = "withdrawals";
    setActiveFilter(filterWithdrawalsBtn);
    renderHistory();
});

historySearchInput.addEventListener("input", () => {
    renderHistory();
});

loadHistory();