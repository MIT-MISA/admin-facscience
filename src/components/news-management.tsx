"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Plus, Newspaper, Tag, Image } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Actualite } from "@/services/types/event"
import { useNews } from "@/hooks/useNews"
import { NewsCard } from "./news/NewsCard"
import { NewsFilters } from "./news/NewsFilters"
import { NewsFormDialog } from "./news/NewsFormDialog"
import { CategoryDialog } from "./news/CategoryDialog"
import { MediaManagementDialog } from "./news/MediaManagementDialog"

export function NewsManagement() {
  const { news, categories, createCategories, createMedias, removeMedia, createActualite, updateActus, removeNews, changeStatus } = useNews()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isMediaDialogOpen, setIsMediaDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<Actualite | null>(null)
  const [selectedNewsForMedia, setSelectedNewsForMedia] = useState<Actualite | null>(null)

  const [formData, setFormData] = useState<Actualite>({
    titre: "",
    categorie: "",
    description: undefined,
    contenu: undefined,
    dateCreation: undefined,
    dateMiseAJour: undefined,
    dateCommencement: undefined,
    dateFin: undefined,
    lieu: undefined,
    statut: "",
    medias: [],
  })

  const [categoryForm, setCategoryForm] = useState({ nom: "" })
  const { toast } = useToast()

  const filteredNews = news.filter((n) => {
    const matchesSearch =
      n.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.lieu?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || n.categorie.toString() === selectedCategory
    const matchesStatus = selectedStatus === "all" || n.statut === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const resetForm = () => {
    setFormData({
      titre: "",
      categorie: "",
      description: undefined,
      contenu: undefined,
      dateCreation: undefined,
      dateMiseAJour: undefined,
      dateCommencement: undefined,
      dateFin: undefined,
      lieu: undefined,
      statut: "",
      medias: [],
    })
  }

  const handleAddCategory = async () => {
    if (!categoryForm.nom) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom pour la catégorie",
        variant: "destructive",
      })
      return
    }

    await createCategories(categoryForm.nom)
    setCategoryForm({ nom: "" })
    setIsCategoryDialogOpen(false)
    toast({
      title: "Succès",
      description: "Catégorie ajoutée avec succès",
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedNewsForMedia?.idActualite) {
      const file = e.target.files[0]
      try {
        
        
        // Mettre à jour la liste des actualités pour refléter le nouveau média
        // Vous devrez peut-être rafraîchir les données ici
        
        toast({
          title: "Succès",
          description: "Média ajouté avec succès",
        })
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Erreur lors de l'ajout du média",
          variant: "destructive",
        })
      }
    }
  }

  const handleRemoveMedia = async (mediaId: number) => {
    if (!selectedNewsForMedia?.idActualite) {
      throw new Error("Aucune actualité sélectionnée")
    }

    try {
      await removeMedia(selectedNewsForMedia.idActualite, mediaId)
      toast({
        title: "Succès",
        description: "Média supprimé avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du média",
        variant: "destructive",
      })
    }
  }

  const handleAdd = async () => {
    if (
      !formData.titre ||
      !formData.categorie ||
      !formData.description ||
      !formData.contenu ||
      !formData.dateCommencement
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    const newNews: Actualite = {
      titre: formData.titre,
      categorie: formData.categorie,
      description: formData.description,
      contenu: formData.contenu,
      dateCommencement: formData.dateCommencement,
      dateFin: formData.dateFin,
      lieu: formData.lieu,
      dateCreation: new Date(),
      statut: "draft",
      medias: [],
    }

    try {
      const createdNews = await createActualite(newNews)
      setIsAddDialogOpen(false)
      resetForm()
      
      toast({
        title: "Succès",
        description: "Actualité créée avec succès",
      })

      // Ouvrir directement le dialogue de gestion des médias
      setSelectedNewsForMedia(createdNews)
      setIsMediaDialogOpen(true)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la création de l'actualité",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (n: Actualite) => {
    setEditingNews(n)
    setFormData({
      titre: n.titre,
      categorie: n.categorie,
      description: n.description,
      contenu: n.contenu,
      dateCommencement: n.dateCommencement,
      dateFin: n.dateFin || undefined,
      lieu: n.lieu,
      statut: n.statut,
      medias: [...n.medias],
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (
      !formData.titre ||
      !formData.categorie ||
      !formData.description ||
      !formData.contenu ||
      !formData.dateCommencement ||
      !editingNews
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    const updatedActualite: Actualite = {
      ...editingNews,
      titre: formData.titre,
      categorie: formData.categorie,
      description: formData.description,
      contenu: formData.contenu,
      dateCommencement: formData.dateCommencement || null,
      dateFin: formData.dateFin || undefined,
      dateCreation: formData.dateCreation || undefined,
      dateMiseAJour: new Date(),
      lieu: formData.lieu,
      statut: formData.statut,
    }

    try {
      await updateActus(updatedActualite)
      setIsEditDialogOpen(false)
      setEditingNews(null)
      resetForm()
      toast({
        title: "Succès",
        description: "Actualité mise à jour avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de l'actualité",
        variant: "destructive",
      })
    }
  }

  const handleManageMedia = (n: Actualite) => {
    setSelectedNewsForMedia(n)
    setIsMediaDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await removeNews(id)
      toast({
        title: "Succès",
        description: "Actualité supprimée avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de l'actualité",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (idActualite: number, newStatus: "draft" | "published" | "archived") => {
    try {
      await changeStatus(idActualite, newStatus)
      toast({
        title: "Succès",
        description: `Statut mis à jour vers ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du statut",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (statut: "draft" | "published" | "archived") => {
    switch (statut) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Publié</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Brouillon</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">Archivé</Badge>
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Actualités</h1>
          <p className="text-muted-foreground">Gérer les actualités et événements de l'université</p>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-university-primary">{news.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {news.filter((n) => n.statut === "published").length}
            </div>
            <div className="text-xs text-muted-foreground">Publiées</div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-university-primary" />
              Liste des Actualités
            </CardTitle>
            <div className="flex gap-2 w-full md:w-auto justify-between">
              <Button variant="outline" className="h-10" onClick={() => setIsCategoryDialogOpen(true)}>
                <Tag className="h-4 w-4 mr-2" />
                Gérer Catégories
              </Button>

              <Button
                className="bg-university-primary rounded-full w-10 h-10 sm:w-fit sm:rounded-lg hover:bg-university-primary/90"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <div className="hidden sm:block">Ajouter une Actualité</div>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <NewsFilters
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            selectedStatus={selectedStatus}
            categories={categories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setSelectedCategory}
            onStatusChange={setSelectedStatus}
          />

          <Tabs defaultValue="cards" className="w-full">
            <TabsContent value="cards" className="space-y-4">
              {filteredNews.length === 0 ? (
                <div className="text-center py-8">
                  <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || selectedCategory !== "all" || selectedStatus !== "all"
                      ? "Aucune actualité trouvée pour les filtres sélectionnés"
                      : "Aucune actualité disponible"}
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.map((n) => (
                    <NewsCard
                      key={n.idActualite}
                      news={n}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onManageMedia={handleManageMedia}
                      onStatusChange={handleStatusChange}
                      getStatusBadge={getStatusBadge}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        categoryForm={categoryForm}
        categories={categories}
        onCategoryFormChange={setCategoryForm}
        onAddCategory={handleAddCategory}
      />

      <NewsFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        formData={formData}
        categories={categories}
        onFormChange={setFormData}
        onSubmit={handleAdd}
      />

      <NewsFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        categories={categories}
        isEdit
        onFormChange={setFormData}
        onSubmit={handleUpdate}
      />

      <MediaManagementDialog
        open={isMediaDialogOpen}
        onOpenChange={setIsMediaDialogOpen}
        actualite={selectedNewsForMedia || { idActualite: 0, titre: '', categorie: '', statut: '', medias: [] }}
        onFileChange={handleFileChange}
        onRemoveMedia={handleRemoveMedia}
      />
    </div>
  )
}