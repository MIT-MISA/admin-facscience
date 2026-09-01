import { baseURL } from "..";

export interface Specialite {
  id: number;
  nom: string;
}

// GET: Récupérer toutes les spécialités
export async function getSpecialites(): Promise<Specialite[]> {
  try {
    const response = await fetch(`${baseURL}/api/Specialite`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des spécialités :', error);
    throw error;
  }
}

// GET: Récupérer une spécialité par ID
export async function getSpecialite(id: number): Promise<Specialite> {
  try {
    const response = await fetch(`${baseURL}/api/Specialite/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération de la spécialité :', error);
    throw error;
  }
}

// POST: Créer une nouvelle spécialité
export async function createSpecialite(specialite: Omit<Specialite, 'id'>): Promise<Specialite> {
  try {
    const response = await fetch(`${baseURL}/api/Specialite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        NomSpecialite: specialite.nom
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la création de la spécialité :', error);
    throw error;
  }
}

// PUT: Mettre à jour une spécialité
export async function updateSpecialite(id: number, specialite: Omit<Specialite, 'id'>): Promise<Specialite> {
  try {
    const response = await fetch(`${baseURL}/api/Specialite/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        NomSpecialite: specialite.nom
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la spécialité :', error);
    throw error;
  }
}

// DELETE: Supprimer une spécialité
export async function deleteSpecialite(id: number): Promise<void> {
  try {
    const response = await fetch(`${baseURL}/api/Specialite/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('Erreur lors de la suppression de la spécialité :', error);
    throw error;
  }
}