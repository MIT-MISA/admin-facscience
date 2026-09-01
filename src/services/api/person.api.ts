import { baseURL } from "..";
import { BasePerson, BasePersonWithoutId } from "../types/person";

// Fonction utilitaire pour gérer les erreurs
function handleError(error: any): never {
    if (error instanceof TypeError) {
        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
    }

    if (error instanceof SyntaxError) {
        throw new Error('Erreur de format des données reçues du serveur.');
    }

    if (error instanceof Error) {
        throw error;
    }

    throw new Error('Une erreur inattendue s\'est produite.');
}

export async function getAllPersons(): Promise<BasePerson[]> {
    try {
        const response = await fetch(`${baseURL}/api/Personne`);

        if (!response.ok) {
            throw new Error(`Erreur HTTP lors de la récupération des personnes: ${response.status}`);
        }

        const data = await response.json();

        // Transformer les données du backend en format frontend
        return data.map((person: any) => ({
            id: person.id,
            nom: person.nom,
            prenom: person.prenom,
            email: person.email,
            tel: person.tel,
            dateInsertion: person.dateInsertion,
            sexe: person.sexe || "M",
            type: person.type,
            postAffectation: person.postAffectation || "",
            grade: person.grade || "",
            fonction: person.fonction || "",
            titre: person.titre || "",
            appartenance: person.appartenance || "",
            responsabilite: person.responsabilite || ""
        }));
    } catch (error) {
        return handleError(error);
    }
}

export async function createPerson(person: BasePersonWithoutId & { type: string }): Promise<BasePerson> {
    try {
        const response = await fetch(`${baseURL}/api/Personne`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nom: person.nom,
                prenom: person.prenom,
                email: person.email,
                tel: person.tel,
                dateInsertion: person.dateInsertion || new Date().toISOString(),
                type: person.type,
                postAffectation: person.postAffectation,
                grade: person.grade,
                fonction: person.fonction,
                titre: person.titre,
                appartenance: person.appartenance,
                responsabilite: person.responsabilite
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP lors de la création de personne : ${response.status}`);
        }

        const createdPerson = await response.json();

        // Retourner dans le format frontend
        return {
            id: createdPerson.idPersonne,
            nom: createdPerson.nom,
            prenom: createdPerson.prenom,
            email: createdPerson.email,
            tel: createdPerson.tel,
            dateInsertion: createdPerson.dateInsertion,
            sexe: person.sexe,
            type: person.type,
            postAffectation: person.postAffectation || "",
            grade: person.grade || "",
            fonction: person.fonction || "",
            titre: person.titre || "",
            appartenance: person.appartenance || "",
            responsabilite: person.responsabilite || ""
        };
    } catch (error) {
        return handleError(error);
    }
}

export async function updatePerson(person: BasePerson & { type: string }): Promise<BasePerson> {
    try {
        const response = await fetch(`${baseURL}/api/Personne/${person.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idPersonne: person.id,
                nom: person.nom,
                prenom: person.prenom,
                email: person.email,
                tel: person.tel,
                dateInsertion: person.dateInsertion,
                type: person.type,
                postAffectation: person.postAffectation,
                grade: person.grade,
                fonction: person.fonction,
                titre: person.titre,
                appartenance: person.appartenance,
                responsabilite: person.responsabilite
            }),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP lors de la mise à jour de personne : ${response.status}`);
        }

        return person;
    } catch (error) {
        return handleError(error);
    }
}

export async function deletePerson(id: number): Promise<void> {
    try {
        const response = await fetch(`${baseURL}/api/Personne/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP lors de la suppression de personne: ${response.status}`);
        }
    } catch (error) {
        handleError(error);
    }
}

// Fonctions conservées pour la compatibilité (mais elles utilisent maintenant les endpoints unifiés)
export async function getPersonsByType<T extends BasePerson>(type: string): Promise<T[]> {
    const allPersons = await getAllPersons();
    return allPersons.filter(person => person.type === type) as T[];
}

export async function getPerson<T extends BasePerson>(type: string, id: number): Promise<T> {
    const allPersons = await getAllPersons();
    const person = allPersons.find(p => p.id === id && p.type === type);

    if (!person) {
        throw new Error(`Personne non trouvée avec l'ID ${id} et le type ${type}`);
    }

    return person as T;
}