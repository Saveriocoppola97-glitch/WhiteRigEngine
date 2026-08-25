const API_URL = "http://localhost:8080/api/blog";

export const getAllPosts = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Errore nel recupero dei blog.");
    }
    return await response.json();
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
};

export const getPostById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error("Articolo non trovato.");
    }
    return await response.json();
  } catch (error) {
    console.error("Errore:", error);
    throw error;
  }
};

export const createPost = async (postData, token) => {
  const response = await fetch("http://localhost:8080/api/blog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error("Errore durante la creazione dell'articolo.");
  }
  return await response.json();
};

export const deletePost = async (id, token) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Errore durante l'eliminazione dell'articolo.");
  }

  return true;
};

export const updatePost = async (id, postData, token) => {
  const response = await fetch(`http://localhost:8080/api/blog/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    throw new Error("Errore durante l'aggiornamento dell'articolo.");
  }
  return await response.json();
};
