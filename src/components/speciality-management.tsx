"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, Layers } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Specialite, getSpecialites, createSpecialite, updateSpecialite, deleteSpecialite } from "../../src/services/api/specialite.api"

export function SpecialityManagement() {
  const [specialites, setSpecialites] = useState<Specialite[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSpecialite, setEditingSpecialite] = useState<Specialite | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: "",
  })
  const { toast } = useToast()

  // Charger les spécialités
  const loadSpecialites = async () => {
    setIsLoading(true)
    try {
      const data = await getSpecialites()
      setSpecialites(data)
    } catch (error) {
      console.error('Erreur lors du chargement des spécialités:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les spécialités",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSpecialites()
  }, [])

  // Filtrage
  const filteredSpecialites = specialites.filter(
    (s) => s.nom.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Reset form
  const resetForm = () => setFormData({ nom: "" })

  // Ajouter
  const handleAdd = async () => {
    if (!formData.nom) {
      toast({ title: "Erreur", description: "Le nom est obligatoire", variant: "destructive" })
      return
    }

    try {
      const newSpecialite = await createSpecialite(formData)
      setSpecialites(prev => [...prev, newSpecialite])
      setIsAddDialogOpen(false)
      resetForm()
      toast({ title: "Succès", description: "Spécialité ajoutée avec succès" })
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la spécialité",
        variant: "destructive",
      })
    }
  }

  // Modifier
  const handleEdit = (specialite: Specialite) => {
    setEditingSpecialite(specialite)
    setFormData({ nom: specialite.nom })
    setIsEditDialogOpen(true)
  }

  // Mettre à jour
  const handleUpdate = async () => {
    if (!formData.nom || !editingSpecialite) {
      toast({ title: "Erreur", description: "Le nom est obligatoire", variant: "destructive" })
      return
    }

    try {
      const updatedSpecialite = await updateSpecialite(editingSpecialite.id, formData)
      setSpecialites(prev =>
        prev.map((s) => (s.id === editingSpecialite.id ? updatedSpecialite : s))
      )
      setIsEditDialogOpen(false)
      setEditingSpecialite(null)
      resetForm()
      toast({ title: "Succès", description: "Spécialité mise à jour avec succès" })
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la spécialité",
        variant: "destructive",
      })
    }
  }

  // Supprimer
  const handleDelete = async (id: number) => {
    try {
      await deleteSpecialite(id)
      setSpecialites(prev => prev.filter((s) => s.id !== id))
      toast({ title: "Succès", description: "Spécialité supprimée avec succès" })
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la spécialité",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Spécialités</h1>
          <p className="text-muted-foreground">Gérez les spécialités académiques</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-university-primary" />
              Liste des Spécialités
            </CardTitle>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex justify-center items-center bg-university-primary rounded-full md:items-start md:rounded-lg hover:bg-university-primary/90">
                  <Plus className="h-4 w-4" />
                  <div className="hidden md:block">Ajouter une Spécialité</div>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouvelle Spécialité</DialogTitle>
                  <DialogDescription>Entrez le nom de la nouvelle spécialité</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nom">Nom de la spécialité *</Label>
                    <Input
                      id="nom"
                      value={formData.nom}
                      onChange={(e) => setFormData({ nom: e.target.value })}
                      placeholder="Ex: Intelligence Artificielle"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAdd} className="bg-university-primary">Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une spécialité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p>Chargement des spécialités...</p>
            </div>
          ) : (
            <>
              {/* Table Desktop */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSpecialites.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.nom}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(s)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer la spécialité "{s.nom}" ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(s.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {filteredSpecialites.map((s) => (
                  <div key={s.id} className="border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-lg">{s.nom}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(s)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(s.id)}
                        className="text-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!isLoading && filteredSpecialites.length === 0 && (
            <div className="text-center py-8">
              <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "Aucune spécialité trouvée pour votre recherche" : "Aucune spécialité disponible"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la Spécialité</DialogTitle>
            <DialogDescription>
              Modifiez le nom de la spécialité "{editingSpecialite?.nom}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nom">Nom de la spécialité *</Label>
              <Input
                id="edit-nom"
                value={formData.nom}
                onChange={(e) => setFormData({ nom: e.target.value })}
                placeholder="Ex: Intelligence Artificielle"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate} className="bg-university-primary">Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}