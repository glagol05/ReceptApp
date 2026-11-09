const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
    if (!API_URL) {
        throw new Error(
            "API-adressen saknas. Skapa en .env-fil i client-mappen med EXPO_PUBLIC_API_URL."
        );
    }

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Något gick fel.");
    }

    return data;
}

export function loginUser(email, password) {
    return apiRequest("/api/login", "POST", { email, password });
}

export function registerUser(email, password) {
    return apiRequest("/api/register", "POST", { email, password });
}

export function getRecipes() {
    return apiRequest("/api/recipes");
}

export function getRecipe(id) {
    return apiRequest(`/api/recipes/${id}`);
}

export function createRecipe(recipe, token) {
    return apiRequest("/api/recipes", "POST", recipe, token);
}

export function updateRecipe(id, recipe, token) {
    return apiRequest(`/api/recipes/${id}`, "PATCH", recipe, token);
}

export function deleteRecipe(id, token) {
    return apiRequest(`/api/recipes/${id}`, "DELETE", null, token);
}
