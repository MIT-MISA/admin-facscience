import { createCategory, createMedia, createNews, deleteMedia, deleteNews, getCategory, getNews, UpdateNews, updateStatus } from "@/services/api/event.api";
import { Actualite, Category } from "@/services/types/event";
import { useState, useEffect, useCallback } from "react";


export function useNews() {
  const [news, setNews] = useState<Actualite[]>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([])


  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [newsData, categoriesData] = await Promise.all([
        getNews(),
        getCategory(),
      ]);
      setNews(newsData);
      setCategories(categoriesData);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, []);


  const createCategories = useCallback(async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createCategory(category);

      setCategories((prev) => [...prev, data]);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de la category");
    } finally {
      setLoading(false);
    }
  }, []);


  const createMedias = useCallback(async (file: File, idActualite: number) => {
    setLoading(true);
    setError(null);
    try {
      const newMedia = await createMedia(idActualite, file);
      // Rafraîchir la liste complète pour avoir les données à jour
      await fetchAll();
      return newMedia;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de la média");
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);


  const removeMedia = useCallback(async (idActualite: number, mediaId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteMedia(idActualite, mediaId);

      // Rafraîchir la liste complète pour avoir les données à jour
      await fetchAll();
      return true;

    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression du médias");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);


  const createActualite = useCallback(async (newItem: Actualite) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createNews(newItem);

      // Rafraîchir la liste complète pour avoir les données à jour
      await fetchAll();
      return data;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'actualité");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);


  const updateActus = useCallback(async (actus: Actualite) => {
    setLoading(true);
    setError(null);
    try {
      await UpdateNews(actus);

      // Rafraîchir la liste complète pour avoir les données à jour
      await fetchAll();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour de l'actualite");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);


  const removeNews = useCallback(async (idActualite: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteNews(idActualite);

      // Rafraîchir la liste complète pour avoir les données à jour
      await fetchAll();

      return true;
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression de l'actualité");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);


  const changeStatus = useCallback(async (
    idActualite: number,
    newStatus: "draft" | "published" | "archived"
  ) => {
    setLoading(true);
    setError(null);
    try {
      await updateStatus(idActualite, newStatus);

      // Rafraîchir la liste complète pour avoir les données à jour
      await fetchAll();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du statut");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAll]);


  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    news,
    loading,
    error,
    categories,
    fetchAll,
    createCategories,
    createMedias,
    removeMedia,
    createActualite,
    updateActus,
    removeNews,
    changeStatus
  }
}