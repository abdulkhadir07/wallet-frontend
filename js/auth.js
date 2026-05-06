const TOKEN_KEY = "enum_token";

function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function isLoggedIn() {
    return getToken() !== null
}

function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "../pages/login.html";
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = "../pages/login.html"
    };
}