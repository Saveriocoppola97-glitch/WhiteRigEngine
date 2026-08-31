const API_URL = "http://localhost:8080/api/builds";

// Funzione di supporto unificata per il recupero del token JWT
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  // Fallback se il token è salvato dentro l'oggetto user
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user.token}`,
    };
  }

  return { "Content-Type": "application/json" };
};

// Controlla la compatibilità della build
export const checkBuildCompatibility = async (buildData) => {
  const response = await fetch(`${API_URL}/check-compatibility`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(buildData),
  });
  if (!response.ok) {
    throw new Error("Errore durante il controllo di compatibilità");
  }
  return await response.json();
};

// Salva una nuova custom build
export const saveCustomBuild = async (buildData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(buildData),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Errore durante il salvataggio della build");
  }
  return await response.json();
};

// Recupera le build dell'utente autenticato (tramite Token)
export const getMyBuilds = async () => {
  const response = await fetch(`${API_URL}/my-builds`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Errore nel recupero delle tue configurazioni");
  }
  return await response.json();
};

// Elimina una build per ID
export const deleteCustomBuild = async (buildId) => {
  const response = await fetch(`${API_URL}/${buildId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Errore durante l'eliminazione della build");
  }
};
