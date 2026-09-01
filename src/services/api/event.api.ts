import { baseURL } from "..";
import { upcomingEvents } from "../mocked-data";
import { Actualite, Category } from "../types/event";

export const getClosestEvent = async () => {
  try {
    // const response = await fetch(`${baseURL}/api/Actualite/all`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // });

    // if (!response.ok) {
    //   throw new Error(`Erreur HTTP : ${response.status}`);
    // }

    // const data: Actualite[] = await response.json();
    // return data;
    return upcomingEvents;
  } catch (error) {
    console.error('Erreur lors de la récupération des événements :', error);
    throw error;
  }
}

// CATEGORIES
export async function createCategory(name: string) {
  try {
    const response = await fetch(`${baseURL}/api/CategorieActualite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: name }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP lors de la création de catégorie : ${response.status}`);
    }

    return response.json();
  } catch (error) {
    handleError(error, 'création de catégorie');
  }
}

export async function getCategory(): Promise<Category[]> {
  try {
    const res = await fetch(`${baseURL}/api/CategorieActualite`);
    if (!res.ok) throw new Error(`Erreur lors de la récupération des category`);
    const data = await res.json();

    // Mapping des données backend vers le format frontend
    return data.map((cat: any) => ({
      id: cat.id || cat.Id,
      name: cat.nom || cat.Nom
    }));
  } catch (error) {
    handleError(error, 'récupération des catégories');
  }
}

export async function deleteCategory(id: number) {
  try {
    const response = await fetch(`${baseURL}/api/CategorieActualite/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP lors de la suppression de catégorie`);
    }

    return response.json();
  } catch (error) {
    handleError(error, 'suppression de catégorie');
  }
}

// ACTUALITES
export async function createNews(data: Actualite) {
  try {
    // Fonction pour convertir les dates en format ISO (UTC)
    const toUTCString = (date: Date | undefined) => {
      return date ? new Date(date).toISOString() : undefined;
    };

    // Mapping vers le modèle backend
    const backendData = {
      Titre: data.titre,
      IdCategorie: parseInt(data.categorie),
      Description: data.description,
      Contenu: data.contenu,
      DateCommencement: toUTCString(data.dateCommencement),
      DateFin: toUTCString(data.dateFin),
      Lieu: data.lieu,
      IsUrgent: data.isUrgent || false
    };

    console.log('📤 Données envoyées au backend:', backendData);

    const response = await fetch(`${baseURL}/api/Actualite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('❌ Erreur lors de la création d\'actualité:', error);
    throw error;
  }
}

export async function UpdateNews(data: Actualite) {
  try {
    // Mapping vers le modèle backend - CORRECTION ICI
    const backendData = {
      Titre: data.titre,
      IdCategorie: parseInt(data.categorie), // Utilisez 'categorie' au lieu de 'idCategorie'
      Description: data.description,
      Contenu: data.contenu,
      DateCommencement: data.dateCommencement,
      DateFin: data.dateFin,
      Lieu: data.lieu,
      IsUrgent: data.isUrgent || false
    };

    const response = await fetch(`${baseURL}/api/Actualite/${data.idActualite}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour d\'actualité:', error);
    throw error;
  }
}

export async function getNews(): Promise<Actualite[]> {
  try {
    const response = await fetch(`${baseURL}/api/Actualite/all`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP lors de la récupération d'actualités: ${response.status}`);
    }

    const data = await response.json();

    // Mapping depuis le DTO backend vers votre interface frontend
    return data.map((item: any) => ({
      idActualite: item.id,
      titre: item.titre,
      categorie: item.categorie || item.idCategorie?.toString(), // Assurez-vous d'avoir la catégorie
      idCategorie: item.idCategorie,
      isUrgent: item.isUrgent || false,
      contenu: item.contenu,
      description: item.description,
      lieu: item.lieu,
      dateCommencement: item.dateCommencement ? new Date(item.dateCommencement) : undefined,
      dateFin: item.dateFin ? new Date(item.dateFin) : undefined,
      statut: item.statut || "draft",
      medias: item.listMedia || item.ListMedia || [] // Assurez-vous d'avoir les médias
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération d\'actualités:', error);
    throw error;
  }
}

export async function deleteNews(id: number) {
  try {
    const response = await fetch(`${baseURL}/api/Actualite/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP lors de la suppression d'actualité: ${response.status}`);
    }

    // DELETE peut ne pas retourner de contenu, vérifier si la réponse a un corps
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return true; // Succès sans contenu
  } catch (error) {
    console.error('Erreur lors de la suppression d\'actualité:', error);
    throw error;
  }
}

// event.api.ts - fonctions corrigées
export async function createMedia(idActualite: number, data: File) {
  try {
    const formData = new FormData();
    formData.append('file', data);

    const response = await fetch(`${baseURL}/api/Media/actualite/${idActualite}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP lors de l'ajout de média: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Erreur lors de l\'ajout de média:', error);
    throw error;
  }
}

export async function deleteMedia(idActualite: number, id_media: number) {
  try {
    const response = await fetch(`${baseURL}/api/Media/actualite/${idActualite}/${id_media}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP lors de la suppression de média: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Erreur lors de la suppression de média:', error);
    throw error;
  }
}

// STATUT - NOTE: Cet endpoint n'est pas encore implémenté dans votre contrôleur
export async function updateStatus(idActualite: number, statut: string): Promise<Actualite> {
  try {
    const data = {
      statut: statut
    };

    const response = await fetch(`${baseURL}/api/Actualite/${idActualite}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP lors de la mise à jour du statut`);
    }

    return response.json();
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
}

// Fonction utilitaire pour la gestion des erreurs
function handleError(error: unknown, context: string): never {
  if (error instanceof TypeError) {
    throw new Error(`Erreur de connexion au serveur lors de la ${context}. Vérifiez votre connexion internet.`);
  }

  if (error instanceof SyntaxError) {
    throw new Error(`Erreur de format des données reçues du serveur lors de la ${context}.`);
  }

  if (error instanceof Error) {
    throw error;
  }

  throw new Error(`Une erreur inattendue s'est produite lors de la ${context}.`);
}

export async function getActualites(): Promise<Actualite[]> {
  try {
    const response = await fetch(`${baseURL}/api/Actualite`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const actualites = await response.json();

    // Transformer les dates si nécessaire
    return actualites.map((actu: any) => ({
      ...actu,
      dateCommencement: actu.dateCommencement ? new Date(actu.dateCommencement) : null,
      dateFin: actu.dateFin ? new Date(actu.dateFin) : null,
      dateCreation: actu.dateCreation ? new Date(actu.dateCreation) : new Date()
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error);
    throw new Error('Impossible de récupérer les actualités');
  }
}
