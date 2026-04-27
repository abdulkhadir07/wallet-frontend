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