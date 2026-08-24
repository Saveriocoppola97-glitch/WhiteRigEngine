import { getToken } from "./authService";

const API_URL = "http://localhost:8080/api/orders";

export const checkoutOrder = async (userEmail, cartItems) => {
  const token = getToken();

  const payload = {
    userEmail: userEmail,
    items: cartItems.map((item) => ({
      componentId: item.id,
      quantity: item.quantity,
    })),
  };

  const response = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Errore durante il checkout dell'ordine.");
  }

  return await response.json();
};

// FUNZIONE PER RECUPERO ORDINI
export const getUserOrders = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Errore durante recupero degli ordini.");
  }

  return await response.json();
};
