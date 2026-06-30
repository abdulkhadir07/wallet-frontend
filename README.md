# Linkcore — Digital Wallet & Remittance Web App (Frontend)

Linkcore is a digital wallet and remittance platform that allows users to send money across borders, manage their wallet balance, deposit and withdraw funds, and track their transaction history, all from a clean, modern web interface.

This repository contains the customer-facing web frontend. The backend API is built with Spring Boot and deployed separately.

---

## Live Demo

[linkcoreweb.netlify.app](https://linkcoreweb.netlify.app)

Backend API: [https://digital-wallet-api-551y.onrender.com/swagger-ui/index.html](https://digital-wallet-api-551y.onrender.com/swagger-ui/index.html)

---

## Tech Stack

- **HTML5** : semantic page structure
- **Tailwind CSS** (CDN) : utility-first styling
- **Vanilla JavaScript** (ES Modules) : all interactivity and API communication
- **Netlify** : hosting and continuous deployment from GitHub

No build tools, no frameworks, no dependencies. Every file is plain HTML + CSS + JS.

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Register | `pages/register.html` | Multi-step account creation — email, personal info, country & phone, password |
| Verify | `pages/verify.html` | Phone number verification via 6-digit OTP |
| Login | `pages/login.html` | Login with phone number and password |
| Dashboard | `pages/dashboard.html` | Wallet balance, recent activity, money overview |
| Transfer | `pages/transfer.html` | Send money to registered users with live quote preview |
| Review Transfer | `pages/review-transfer.html` | Review transfer details before confirming |
| Deposit | `pages/deposit.html` | Deposit funds via bank transfer or debit card |
| Withdraw | `pages/withdrawal.html` | Withdraw funds to a bank account |
| Activity History | `pages/history.html` | Full transaction history with filter and search |
| Transaction Detail | `pages/transaction-detail.html` | Detailed ledger record of a single transaction |
| Receipt | `pages/receipt.html` | Printable receipt for a completed transfer |
| Profile | `pages/profile.html` | Personal info, change password, wallet management, legal |

---

## Features

**Authentication**
- Multi-step registration with full frontend validation (email format, name, age 18+, password strength, phone country code auto-fill)
- Phone number OTP verification
- JWT-based login with token stored in localStorage
- Logout clears token and redirects to login

**Dashboard**
- Live wallet balance and status display
- Recent activity (last 3 transactions)
- Total sent and total received overview
- Avatar with user initials in header

**Transfer**
- Recipient search by phone number (registered users only, minimum 7 characters)
- Live quote preview — shows recipient amount, fee, FX rate, and total debit as user types
- Debounced API calls to avoid excessive requests
- Review screen before confirming transfer
- Loading spinner on confirm button

**Deposit**
- Method selection — Bank Transfer, Debit Card (coming soon), Agent (coming soon)
- Bank transfer instructions with account details and payment reference
- Full amount validation

**Withdrawal**
- Method selection — Bank Account, Debit Card (coming soon), Agent (coming soon)
- Bank account details form with full field validation
- Currency symbol auto-populated from wallet

**Activity History**
- Filter by All, Sent, Received, Deposits, Withdrawals
- Client-side search across description, reference, status, date
- Counterparty name and phone number shown for transfers

**Transaction Detail**
- Ledger-style record with monospace amounts
- Balance before and after
- Printable receipt via dedicated receipt page

**Profile**
- Personal info display
- Inline change password form with strength validation
- Wallet freeze / unfreeze
- Expandable terms and conditions and privacy policy
- Logout

---

## Project Structure

```
wallet-frontend/
├── pages/
│   ├── register.html
│   ├── verify.html
│   ├── login.html
│   ├── dashboard.html
│   ├── transfer.html
│   ├── review-transfer.html
│   ├── deposit.html
│   ├── withdrawal.html
│   ├── history.html
│   ├── transaction-detail.html
│   ├── receipt.html
│   └── profile.html
├── js/
│   ├── api.js           # All API functions
│   ├── auth.js          # Token management and auth guards
│   ├── utils.js         # formatCurrency, formatDate, formatTransactionType
│   ├── register.js
│   ├── verify.js
│   ├── login.js
│   ├── dashboard.js
│   ├── transfer.js
│   ├── review-transfer.js
│   ├── deposit.js
│   ├── withdrawal.js
│   ├── history.js
│   ├── transaction-detail.js
│   ├── receipt.js
│   └── profile.js
├── index.html           # Entry point — redirects to register.html
└── README.md
```

---

## Getting Started

No install required. To run locally:

1. Clone the repo:
```bash
git clone https://github.com/abdulkhadir07/wallet-frontend.git
cd wallet-frontend
```

2. Open with a local server. If you have VS Code, use the Live Server extension and open `index.html`. Alternatively:
```bash
npx serve .
```

3. The app will open at `http://localhost:3000` (or whichever port your server uses).

> The frontend connects to the backend API deployed on Render at `https://digital-wallet-api-551y.onrender.com/swagger-ui/index.html`. No local backend setup is required.

---

## Backend

The backend is a separate Spring Boot API. View the backend repository here:

[github.com/abdulkhadir07/digital-wallet-api](https://github.com/abdulkhadir07/digital-wallet-api)

**Backend stack:** Java 17, Spring Boot 3, PostgreSQL, JWT authentication, deployed on Render.

---

## Brand

| Color | Hex |
|-------|-----|
| Purple | `#2D0A45` |
| Gold | `#A47E1B` |
| Silver | `#BCC6CC` |

---

## Roadmap

- [ ] Stripe debit card deposit and withdrawal
- [ ] Plaid bank account verification
- [ ] Agent network integration
- [ ] React Native mobile app
- [ ] Admin dashboard
- [ ] Token expiry handling
- [ ] Push notifications
- [ ] KYC document upload
- [ ] Multi-language support

---

## API Configuration

The backend base URL is configured in `js/api.js`:

```js
const BASE_URL = "https://digital-wallet-api-551y.onrender.com"
```

Update this value if you want the frontend to point to a different backend environment.

---

## Main User Flow

1. Register with personal details and a phone number.
2. Verify the account using the demo verification code.
3. Log in with phone number and password.
4. View wallet balance and recent activity on the dashboard.
5. Search for a registered recipient and request a transfer quote.
6. Review the transfer details and send money.
7. View full transaction history, transaction details, and receipts.

---

## Deployment

The frontend is deployed on Netlify and publishes from the GitHub repository. Changes merged into the main branch are automatically deployed by Netlify.

---

## Notes

This project is currently a development demo. Some implementation choices, such as Tailwind CDN usage and browser storage for demo authentication, are suitable for rapid development but should be reviewed before production use.
