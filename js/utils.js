export function formatCurrency(amount, currency) {
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

    const formattedAmount = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(amount));

    const symbol = symbols[currency] || currency;

    return `${symbol}${formattedAmount}`;
}

export function formatDate(dateString) {
    return new Intl.DateTimeFormat('en-US', 
        {year: 'numeric', month: 'short',day: 'numeric'}).format (new Date(dateString))
}

export function formatTransactionType(type) {
    return type === "DEBIT" ? "sent" : "received";

}