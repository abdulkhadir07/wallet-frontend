export function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount)
}

export function formatDate(dateString) {
    return new Intl.DateTimeFormat('en-US', 
        {year: 'numeric', month: 'short',day: 'numeric'}).format (new Date(dateString))
}

export function formatTransactionType(type) {
    return type === "DEBIT" ? "sent" : "received";

}