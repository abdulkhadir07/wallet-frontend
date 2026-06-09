const TOKEN_KEY = "enum_token";

export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token)
}

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
   const token = getToken();
   return Boolean(token && token.trim());
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "../pages/login.html";
}

export function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = "../pages/login.html"
    };
}