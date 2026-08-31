const API_URL = "http://localhost:8080/api/components";

export const getComponents = async (
  page = 0,
  size = 20,
  category = "",
  search = "",
) => {
  let url = `http://localhost:8080/api/components?page=${page}&size=${size}`;
  if (category) url += `&category=${category}`;
  if (search) url += `&search=${search}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Errore nel recupero dei componenti");
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
