const BASE_URL = "https://digital-wallet-api-551y.onrender.com"

async function login(phoneNumber, password,) {
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
    const data = await response.json();
    return data;
}

async function register(firstName, lastName, dateOfBirth, country, phoneNumber, email, password) {
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
    const data = await response.json();
    return data;
}

async function verify(phoneNumber, verificationCode){
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
    const data = await response.json();
    return data;
}

async function getWallet() {
    const response = await fetch(`${BASE_URL}/wallet/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });
    const data = await response.json();
    return data;
}

async function getTransactions() {
    const response = await fetch(`${BASE_URL}/wallet/transactions`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });
    const data = await response.json();
    return data;
}

async function sendTransfer(recipientPhoneNumber, senderAmount, description) {
    const response = await fetch(`${BASE_URL}/transfer/send`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify({
            recipientPhoneNumber: recipientPhoneNumber,
            senderAmount: senderAmount,
            description: description
        })
    });
    const data = await response.json();
    return data;
}

async function getHistory() {
    const response = await fetch(`${BASE_URL}/transfer/history`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });
    const data = await response.json();
    return data;
}
async function getSent() {
    const response = await fetch(`${BASE_URL}/transfer/sent`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });
    const data = await response.json();
    return data;
}

async function getReceived() {
    const response = await fetch(`${BASE_URL}/transfer/received`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });
    const data = await response.json();
    return data;
}
async function getTransferByReference(reference) {
    const response = await fetch(`${BASE_URL}/transfer/${reference}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });
    const data = await response.json();
    return data;
}

async function freezeWallet() {
    const response = await fetch(`${BASE_URL}/wallet/freeze`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });
    const data = await response.json()
    return data;
}

async function unfreezeWallet() {
    const response = await fetch(`${BASE_URL}/wallet/unfreeze`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`
        }
    });
    const data = await response.json();
    return data;
}