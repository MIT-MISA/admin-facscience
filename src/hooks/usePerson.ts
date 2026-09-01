import { useState, useEffect, useCallback } from "react";
import { createOptions, getSelectOptions } from "@/services/api/option.api";
import { createPerson, deletePerson, getPersonsByType, updatePerson } from "@/services/api/person.api"; // <-- assure-toi que c’est bien importé
import { option, options } from "@/services/types/option";
import { Person, PAT, Professeur, COFAC, doyenEtVice, BasePerson } from "@/services/types/person";

export function usePeople(activeTab: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [addOptionType, setAddOptionType] = useState<keyof options>("postAffectations")

  const [selectOptions, setSelectOptions] = useState<options>({
    postAffectations: [],
    grades: [],
    fonctions: [],
    titres: [],
    appartenances: [],
    responsabilites: [],
  });

  const [people, setPeople] = useState<Person[]>([]);

  // Récupération des options globales
  const fetchOptions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        postAffectationsData,
        gradesData,
        fonctionsData,
        titresData,
        appartenancesData,
        responsabilitesData,
      ] = await Promise.all([
        getSelectOptions("postAffectations"),
        getSelectOptions("grades"),
        getSelectOptions("fonctions"),
        getSelectOptions("titres"),
        getSelectOptions("appartenances"),
        getSelectOptions("responsabilites"),
      ]);

      setSelectOptions({
        postAffectations: postAffectationsData,
        grades: gradesData,
        fonctions: fonctionsData,
        titres: titresData,
        appartenances: appartenancesData,
        responsabilites: responsabilitesData,
      });
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des options");
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupération des personnes selon l’onglet actif
  const fetchPeople = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      switch (activeTab) {
        case "pat": {
          const data = await getPersonsByType<PAT>("pat");
          setPeople(data);
          break;
        }
        case "professeur": {
          const data = await getPersonsByType<Professeur>("professeur");
          setPeople(data);
          break;
        }
        case "cofac": {
          const data = await getPersonsByType<COFAC>("cofac");
          setPeople(data);
          break;
        }
        case "doyen_et_vice": {
          const data = await getPersonsByType<doyenEtVice>("doyen_et_vice");
          setPeople(data);
          break;
        }
        default:
          setPeople([]);
      }
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des personnes");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);


    const createOpt = useCallback(async ( addOptionType : keyof options, optionName: option) => {
        setLoading(true);
        setError(null);
        try {
          const addedOption = await createOptions(addOptionType, optionName);
        
          setSelectOptions(prev => ({
            ...prev,
            [addOptionType]: [...prev[addOptionType], addedOption],
          }));
        } catch (err: any) {
        setError(err.message || "Erreur lors de la création de l'option");
        } finally {
        setLoading(false);
        }
    }, []);

    const createNewPerson = useCallback(async (personData: Omit<Person, "id">) => {
        setLoading(true);
        setError(null);
        try {
            const newPerson = await createPerson(personData);
        
            setPeople([...people, newPerson as Person]);
        } catch (err: any) {
        setError(err.message || "Erreur lors de la création de la personne");
        } finally {
        setLoading(false);
        }
    }, []);


    const updatePersons = useCallback(async (personToUpdate :BasePerson & { type: string }) => {
        setLoading(true);
        setError(null);
        try {
      const updatedPerson = await updatePerson(personToUpdate);
        
      setPeople((prev) =>
        prev.map((p) => (p.id === updatedPerson.id ? (updatedPerson as Person) : p))
                );
    } catch (err: any) {
        setError(err.message ||  "Erreur lors de la mise à jour de la personne");
        } finally {
        setLoading(false);
        }
    }, []);


    const removePerson = useCallback(async ( person: Person) => {
          setLoading(true);
          setError(null);
          try {
                await deletePerson(person.type, person.id);

      
                setPeople((prev) => prev.filter((p) => p.id !== person.id));
    
              return true;
          } catch (err: any) {
              setError(err.message || "Erreur lors de la suppression de personne");
              throw err;
            } finally {
              setLoading(false);
          }
          }, []);  
        

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  return {
    selectOptions,
    people,
    loading,
    error,
    createOpt,
    refetchOptions: fetchOptions,
    refetchPeople: fetchPeople,
    createNewPerson,
    updatePersons,
    removePerson
  };
}

export function useImageFallback(fallbackSrc?: string) {
  const [error, setError] = useState(false)

  const handleError = () => {
    setError(true)
  }

  return {
    error,
    handleError,
    src: (src: string) => (error && fallbackSrc ? fallbackSrc : src),
  }
}

