const API_URL = "http://localhost:8080/api";

export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Credenziali non valide o errore di login");
    }

    const data = await response.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("auth-change"));
    }

    return data;
  } catch (error) {
    console.error("Errore durante il login:", error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Errore durante la registrazione");
  }

  return text;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("auth-change"));
};

export const getToken = () => {
  return localStorage.getItem("token");
};
