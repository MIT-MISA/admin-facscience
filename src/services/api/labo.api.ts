import { baseURL } from "..";
import { DescriptionItem, Laboratory } from "../types/labo";

export async function getLabos(): Promise<Laboratory[]> {
    try {
        const response = await fetch(`${baseURL}/api/Laboratoire`);
      
        if (!response.ok) {
          throw new Error(`Erreur HTTP lors de la récupération des laboratoires: ${response.status}`);
        }
      
        const labs = await response.json();
        
        // Adapter les données du backend au format frontend avec plus de robustesse
        return labs.map((lab: any) => ({
          idLabo: lab.idLaboratoire || 0,
          nomLabo: lab.nomLabo || "",
          mentionRattachement: lab.mentionRattachement?.toString() || "",
          description: lab.description || "",
          abbreviation: lab.abbreviation || "",
          ecoleDoctoraleRattachement: lab.ecoleDoctoraleRattachement?.toString() || "",
          responsable: "" // Le backend ne fournit pas cette information
        }));
    } catch (error) {
        if (error instanceof TypeError) {
          throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
        }
        
        if (error instanceof SyntaxError) {
          throw new Error('Erreur de format des données reçues du serveur.');
        }
        
        if (error instanceof Error) {
          throw error;
        }
        
        throw new Error('Une erreur inattendue s\'est produite lors de la récupération des laboratoires.');
    }
}

export async function getLaboById(id_labo: number): Promise<Laboratory> {
    try {
        const response = await fetch(`${baseURL}/api/Laboratoire/${id_labo}`);
      
        if (!response.ok) {
          throw new Error(`Erreur HTTP lors de la récupération du laboratoire: ${response.status}`);
        }
      
        const lab = await response.json();
        
        // Adapter les données du backend au format frontend
        return {
          idLabo: lab.idLaboratoire || 0,
          nomLabo: lab.nomLabo || "",
          mentionRattachement: lab.mentionRattachement?.toString() || "",
          description: lab.description || "",
          abbreviation: lab.abbreviation || "",
          ecoleDoctoraleRattachement: lab.ecoleDoctoraleRattachement?.toString() || "",
          responsable: ""
        };
    } catch (error) {
        if (error instanceof TypeError) {
          throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
        }
        
        if (error instanceof SyntaxError) {
          throw new Error('Erreur de format des données reçues du serveur.');
        }
        
        if (error instanceof Error) {
          throw error;
        }
        
        throw new Error('Une erreur inattendue s\'est produite lors de la récupération du laboratoire.');
    }
}

export async function addLabo(data: Laboratory): Promise<Laboratory> {
    try {
        // Préparer les données pour le backend
        const backendData = {
            nomLabo: data.nomLabo,
            mentionRattachement: data.mentionRattachement ? parseInt(data.mentionRattachement) : null,
            description: data.description,
            abbreviation: data.abbreviation || "",
            ecoleDoctoraleRattachement: data.ecoleDoctoraleRattachement ? parseInt(data.ecoleDoctoraleRattachement) : null
        };

        const response = await fetch(`${baseURL}/api/Laboratoire`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(backendData)
        });
      
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP lors de l'ajout de laboratoire: ${response.status} - ${errorText}`);
        }
      
        const lab = await response.json();
        
        // Adapter la réponse du backend au format frontend
        return {
          idLabo: lab.idLaboratoire || 0,
          nomLabo: lab.nomLabo || "",
          mentionRattachement: lab.mentionRattachement?.toString() || "",
          description: lab.description || "",
          abbreviation: lab.abbreviation || "",
          ecoleDoctoraleRattachement: lab.ecoleDoctoraleRattachement?.toString() || "",
          responsable: ""
        };
    } catch (error) {
        if (error instanceof TypeError) {
          throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
        }
        
        if (error instanceof SyntaxError) {
          throw new Error('Erreur de format des données reçues du serveur.');
        }
        
        if (error instanceof Error) {
          throw error;
        }
        
        throw new Error('Une erreur inattendue s\'est produite lors de l\'ajout du laboratoire.');
    }
}

export async function updateLabo(id_labo: number, data: Laboratory): Promise<Laboratory> {
    try {
        // Préparer les données pour le backend
        const backendData = {
            nomLabo: data.nomLabo,
            mentionRattachement: data.mentionRattachement ? parseInt(data.mentionRattachement) : null,
            description: data.description,
            abbreviation: data.abbreviation || "",
            ecoleDoctoraleRattachement: data.ecoleDoctoraleRattachement ? parseInt(data.ecoleDoctoraleRattachement) : null
        };

        const response = await fetch(`${baseURL}/api/Laboratoire/${id_labo}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(backendData),
        });
      
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP lors de la mise à jour du laboratoire: ${response.status} - ${errorText}`);
        }
      
        const lab = await response.json();
        
        // Adapter la réponse du backend au format frontend
        return {
          idLabo: lab.idLaboratoire || 0,
          nomLabo: lab.nomLabo || "",
          mentionRattachement: lab.mentionRattachement?.toString() || "",
          description: lab.description || "",
          abbreviation: lab.abbreviation || "",
          ecoleDoctoraleRattachement: lab.ecoleDoctoraleRattachement?.toString() || "",
          responsable: ""
        };
    } catch (error) {
        if (error instanceof TypeError) {
          throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
        }
        
        if (error instanceof SyntaxError) {
          throw new Error('Erreur de format des données reçues du serveur.');
        }
        
        if (error instanceof Error) {
          throw error;
        }
        
        throw new Error('Une erreur inattendue s\'est produite lors de la mise à jour du laboratoire.');
    }
}

export async function deleteLabo(id_labo: number): Promise<void> {
    try {
        const response = await fetch(`${baseURL}/api/Laboratoire/${id_labo}`, {
            method: "DELETE"
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erreur HTTP lors de la suppression de labo: ${response.status} - ${errorText}`);
        }
    
        // Pour DELETE, on ne retourne généralement pas de données
        return;
    } catch (error) {
        if (error instanceof TypeError) {
          throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
        }
        
        if (error instanceof SyntaxError) {
          throw new Error('Erreur de format des données reçues du serveur.');
        }
        
        if (error instanceof Error) {
          throw error;
        }
        
        throw new Error('Une erreur inattendue s\'est produite lors de la suppression du laboratoire.');
    }
}