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

// Funzione per recuperare ordine
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

// Funzione per visualizzare PDF
export const downloadOrderPdf = async (orderId) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/${orderId}/pdf`, {
    method: "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      errorText || "Errore durante il download del PDF dell'ordine.",
    );
  }
  // Converto la risposta in un blob PDF
  const blob = await response.blob();
  // Creo un URL temporaneo
  const blobUrl = window.URL.createObjectURL(blob);
  // Apro il PDF direttamente nel browser
  window.open(blobUrl, "_blank");
};
