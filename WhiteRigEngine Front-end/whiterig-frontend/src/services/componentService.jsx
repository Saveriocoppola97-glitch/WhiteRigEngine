const API_URL = "http://localhost:8080/api/components";

export const getAllComponents = async (category = null) => {
  let url = API_URL;
  if (category && category !== "ALL") {
    url += `?category=${category}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Errore durante il recupero dei componenti.");
  }
  return await response.json();
};

export const getComponentById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Impossibile trovare il componente richiesto.");
  }
  return await response.json();
};

export const updateComponent = async (id, componentData, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(componentData),
  });
  if (!response.ok) {
    throw new Error("Errore durante l'aggiornamento del componente.");
  }
  return await response.json();
};

export const deleteComponent = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Errore durante l'eliminazione del componente.");
  }
};
