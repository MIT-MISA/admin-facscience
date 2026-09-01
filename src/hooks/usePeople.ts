import { useState, useEffect } from 'react';
import { BasePerson, Person, PersonType } from '@/services/types/person';
import { getAllPersons, createPerson, updatePerson, deletePerson } from '@/services/api/person.api';
import { options } from '@/services/types/option';
import { getSelectOptions, createOptions } from '@/services/api/option.api';

interface UsePeopleReturn {
    people: Person[];
    allPeople: Person[]; // Toutes les personnes pour les compteurs
    loading: boolean;
    error: string | null;
    selectOptions: options;
    createOpt: (optionType: keyof options, data: { nom: string }) => Promise<void>;
    createNewPerson: (personData: any) => Promise<BasePerson>;
    updatePersons: (person: any) => Promise<BasePerson>;
    removePerson: (person: BasePerson) => Promise<void>;
    refresh: () => Promise<void>;
}

export function usePeople(activeTab: PersonType): UsePeopleReturn {
    const [people, setPeople] = useState<Person[]>([]);
    const [allPeople, setAllPeople] = useState<Person[]>([]); // Toutes les personnes
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectOptions, setSelectOptions] = useState<options>({
        postAffectations: [],
        grades: [],
        fonctions: [],
        titres: [],
        appartenances: [],
        responsabilites: []
    });

    const loadOptions = async () => {
        try {
            const [postAffectations, grades, fonctions, titres, appartenances, responsabilites] = await Promise.all([
                getSelectOptions('postAffectations'),
                getSelectOptions('grades'),
                getSelectOptions('fonctions'),
                getSelectOptions('titres'),
                getSelectOptions('appartenances'),
                getSelectOptions('responsabilites')
            ]);

            setSelectOptions({
                postAffectations,
                grades,
                fonctions,
                titres,
                appartenances,
                responsabilites
            });
        } catch (err) {
            console.error("Erreur lors du chargement des options", err);
        }
    };

    const loadPeople = async () => {
        setLoading(true);
        setError(null);
        try {
            const allPeopleData = await getAllPersons();
            // Stocker toutes les personnes
            setAllPeople(allPeopleData.map(person => person as Person));

            // Filtrer par le type actif pour l'affichage
            const filteredPeople = allPeopleData
                .filter(person => person.type === activeTab)
                .map(person => person as Person);

            setPeople(filteredPeople);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const createOpt = async (optionType: keyof options, data: { nom: string }): Promise<void> => {
        try {
            await createOptions(optionType, data);
            await loadOptions(); // Recharger les options
        } catch (err) {
            console.error("Erreur lors de la création de l'option", err);
            throw err;
        }
    };

    const createNewPerson = async (personData: any) => {
        try {
            const newPerson = await createPerson(personData);
            await loadPeople(); // Recharger la liste
            return newPerson;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la création');
            throw err;
        }
    };

    const updatePersons = async (person: any) => {
        try {
            const updatedPerson = await updatePerson(person);
            await loadPeople(); // Recharger la liste
            return updatedPerson;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
            throw err;
        }
    };

    const removePerson = async (person: BasePerson) => {
        try {
            await deletePerson(person.id);
            await loadPeople(); // Recharger la liste
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
            throw err;
        }
    };

    useEffect(() => {
        loadPeople();
    }, [activeTab]);

    useEffect(() => {
        loadOptions();
    }, []);

    return {
        people,
        allPeople,
        loading,
        error,
        selectOptions,
        createOpt,
        createNewPerson,
        updatePersons,
        removePerson,
        refresh: loadPeople
    };
}