import { baseURL } from "..";
import { option, options } from "../types/option";

export async function getSelectOptions(type: keyof options): Promise<string[]> {
    try {

        const res = await fetch(`${baseURL}/options/${type}`);
        if (!res.ok) throw new Error(`Erreur lors de la récupération des options ${type}`);
        const data = await res.json();
        return data;
    } catch (error) {
    // Si c'est une erreur de réseau ou de parsing JSON
    if (error instanceof TypeError) {
      throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
    }
    
    // Si c'est une erreur de parsing JSON
    if (error instanceof SyntaxError) {
      throw new Error('Erreur de format des données reçues du serveur.');
    }
    
    // Relancer l'erreur si elle est déjà personnalisée (erreur HTTP)
    if (error instanceof Error) {
      throw error;
    }
    
    // Erreur inconnue
    throw new Error('Une erreur inattendue s\'est produite lors de la récupération des laboratoires.');
  }
}


export async function createOptions( type: keyof options , data : option): Promise<string[]> {

    try {

        const response = await fetch(`${baseURL}/options/add/${type}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP lors de la création de option : ${response.status}`);
        }
        
        return response.json();
    } catch (error) {
    // Si c'est une erreur de réseau ou de parsing JSON
    if (error instanceof TypeError) {
      throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
    }
    
    // Si c'est une erreur de parsing JSON
    if (error instanceof SyntaxError) {
      throw new Error('Erreur de format des données reçues du serveur.');
    }
    
    // Relancer l'erreur si elle est déjà personnalisée (erreur HTTP)
    if (error instanceof Error) {
      throw error;
    }
    
    // Erreur inconnue
    throw new Error('Une erreur inattendue s\'est produite lors de la récupération des laboratoires.');
  }
}
