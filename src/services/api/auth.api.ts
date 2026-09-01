import { baseURL } from "..";

type Credentials = {
  identifiant: string;
  password: string;
};

export interface LoginResponse {
  idUtilisateur: number;
  identifiant: string;
  email: string;
  role: string;
  token: string;
  derniereConnexion: string;
}

export async function authReal({ identifiant, password }: Credentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${baseURL}/api/Auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifiant, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur de connexion");
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (err: any) {
    throw new Error(err.message || "Erreur réseau");
  }
}

// Fonction pour vérifier le token
export async function verifyToken(): Promise<LoginResponse> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await fetch(`${baseURL}/api/Auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Token invalid');
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (err: any) {
    throw new Error(err.message || 'Erreur de vérification du token');
  }
}