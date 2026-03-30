const BASE_URL = "http://localhost:8080/api";

const parseJsonSafely = async (response) => {
    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
};

// decode JWT payload safely
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

// check if token expired
export const isTokenExpired = (token) => {
    if (!token) return true;

    const decoded = parseJwt(token);

    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp < currentTime;
};

// REGISTER
export const registerUser = async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await parseJsonSafely(response);

    if (!response.ok) {
        throw new Error(data?.message || `Registration failed (${response.status})`);
    }

    return data;
};

// LOGIN
export const loginUser = async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    });

    const data = await parseJsonSafely(response);

    if (!response.ok) {
        throw new Error(data?.message || `Login failed (${response.status})`);
    }

    if (data?.token) {
        localStorage.setItem("token", data.token);
    }

    return data;
};

// LOGOUT
export const logoutUser = () => {
    localStorage.removeItem("token");
};

// CHECK LOGIN
export const isLoggedIn = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return false;
    }

    if (isTokenExpired(token)) {
        localStorage.removeItem("token");
        return false;
    }

    return true;
};

// GET TOKEN
export const getToken = () => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        return null;
    }

    return token;
};

// GET ROLE FROM TOKEN
export const getUserRole = () => {
    const token = getToken();

    if (!token) {
        return null;
    }

    const decoded = parseJwt(token);

    return decoded?.role || null;
};

// MY DETAILS
export const getMyDetails = async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
        headers: getAuthHeaders()
    });

    const data = await parseJsonSafely(response);

    if (!response.ok) {
        if (response.status === 401) {
            logoutUser();
        }

        throw new Error(data?.message || `Failed to fetch my details (${response.status})`);
    }

    return data;
};