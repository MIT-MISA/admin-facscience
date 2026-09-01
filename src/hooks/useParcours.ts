import { useActivity } from "@/context/activity-context";
import { create, getAll, getByMention, remove, update } from "@/services/api/parcours.api";
import { Parcours } from "@/services/types/parcours";
import { useState, useEffect, useCallback } from "react";

export function useParcours() {
  const [parcours, setParcours] = useState<Parcours[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const {addActivity} = useActivity();

  // Charger tous les parcours
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAll();
      setParcours(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des parcours");
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger parcours par mention
  const fetchByMention = useCallback(async (id_mention: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getByMention(id_mention);
      setParcours(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des parcours");
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un nouveau parcours
  const createParcours = useCallback(async (newParcours: Parcours) => {
    setLoading(true);
    setError(null);
    try {
      const data = await create(newParcours);
      const activity = {
        title: "Ajout parcours",
        time: new Date().toDateString(),
        status: "success",
      }
      addActivity(activity);
      setParcours(prev => [data, ...prev]);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du parcours");
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour un parcours
  const updateParcours = useCallback(async (id_: number, updateData: Partial<Parcours>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await update(id_, updateData);
      const activity = {
        title: "Mise a jour parcours",
        time: new Date().toDateString(),
        status: "success",
      }
      addActivity(activity);
      setParcours(prev =>
        prev.map(m => (m.id_parcours === id_ ? data : m))
      );
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du parcours");
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer un parcours
  const removeParcours = useCallback(async (id_: number) => {
    setLoading(true);
    setError(null);
    try {
      await remove(id_);
      const activity = {
        title: "Suppression parcours",
        time: new Date().toDateString(),
        status: "success",
      }
      addActivity(activity);
      setParcours(prev => prev.filter(m => m.id_parcours !== id_));
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression du parcours");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    parcours,
    loading,
    error,
    fetchAll,
    fetchByMention,
    createParcours,
    updateParcours,
    removeParcours,
  };
}
