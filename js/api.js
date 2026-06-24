import { getToken } from './auth.js'
const BASE_URL = "https://digital-wallet-api-551y.onrender.com"

function getAuthHeaders() {
    const headers = { "Content-Type": "application/json"}
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
}

async function readErrorPayload(response) {
  const raw = await response.text();
  if (!raw) return { message: null, detail: raw };
  try {
    const parsed = JSON.parse(raw);
    const message =
      parsed?.message ??
      parsed?.error ??
      (typeof parsed === "string" ? parsed : null);
    return { message, detail: parsed };
  } catch {
    return { message: raw.slice(0, 500), detail: raw };
  }
}

async function assertOk(response) {
  if (response.ok) return;
  const { message } = await readErrorPayload(response);
  throw new Error(message || response.statusText || `Request failed (${response.status})`);
}

export async function login(phoneNumber, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            password: password
        })
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function register(firstName, lastName, dateOfBirth, country, phoneNumber, email, password) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            country: country,
            phoneNumber: phoneNumber,
            email: email,
            password: password
        })
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function verify(phoneNumber, verificationCode){
    const response = await fetch(`${BASE_URL}/auth/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
            verificationCode: verificationCode
        })
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function getWallet() {
    const response = await fetch(`${BASE_URL}/wallet/me`, {
        method: "GET",
        headers: getAuthHeaders()
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function getTransactions() {
    const response = await fetch(`${BASE_URL}/wallet/transactions`, {
        method: "GET",
        headers: getAuthHeaders()
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function sendTransfer(recipientPhoneNumber, senderAmount, description) {
    const response = await fetch(`${BASE_URL}/transfer/send`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            recipientPhoneNumber: recipientPhoneNumber,
            senderAmount: senderAmount,
            description: description
        })
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function getHistory() {
    const response = await fetch(`${BASE_URL}/transfer/history`, {
        method: "GET",
        headers: getAuthHeaders()
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}
export async function getSent() {
    const response = await fetch(`${BASE_URL}/transfer/sent`, {
        method: "GET",
        headers: getAuthHeaders()
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function getReceived() {
    const response = await fetch(`${BASE_URL}/transfer/received`, {
        method: "GET",
        headers: getAuthHeaders()
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}
export async function getTransferByReference(reference) {
    const response = await fetch(`${BASE_URL}/transfer/${reference}`, {
        method: "GET",
        headers: getAuthHeaders()
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function freezeWallet() {
    const response = await fetch(`${BASE_URL}/wallet/freeze`, {
        method: "PATCH",
        headers: getAuthHeaders()
    });
    await assertOk(response);
    const data = await response.json()
    return data;
}

export async function unfreezeWallet() {
    const response = await fetch(`${BASE_URL}/wallet/unfreeze`, {
        method: "PATCH",
        headers: getAuthHeaders()
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function getQuote(recipientPhoneNumber, senderAmount) {
    const response = await fetch(`${BASE_URL}/transfer/quote`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            recipientPhoneNumber: recipientPhoneNumber,
            senderAmount: senderAmount
        })
    });
    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function searchRecipients(phoneNumber) {
    const response = await fetch(`${BASE_URL}/transfer/recipients/search?phone=${encodeURIComponent(phoneNumber)}`, {
        method: "GET",
        headers: getAuthHeaders()
    });

    await assertOk(response);
    const data = await response.json();
    return data;
}

export async function deposit(amount, paymentMethod) {
    const response = await fetch(`${BASE_URL}/wallet/deposit`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            amount: amount,
            paymentMethod: paymentMethod
        })
    });
    await assertOk(response);
    return await response.json();
}

export async function withdraw(amount, paymentMethod, accountName, accountNumber, routingNumber, bankName) {
    const response = await fetch(`${BASE_URL}/wallet/withdraw`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            amount: amount,
            paymentMethod: paymentMethod,
            accountName: accountName,
            accountNumber: accountNumber,
            routingNumber: routingNumber,
            bankName: bankName
        })
    });
    await assertOk(response);
    return await response.json();
}

export async function getProfile() {
    const response = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        headers: getAuthHeaders()
    });
    await assertOk(response);
    return await response.json();
}

export async function changePassword(currentPassword, newPassword, confirmPassword) {
    const response = await fetch(`${BASE_URL}/auth/change-password`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
            currentPassword: currentPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword
        })
    });
    await assertOk(response);
}