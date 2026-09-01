import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { FormationEnum, NiveauEnum, Parcours } from "@/services/types/parcours"

interface ParcoursFormData {
  nom_parcours: string
  id_mention: string
  niveau_parcours: NiveauEnum | ""
  formation_type: FormationEnum | ""
  description_parcours: string
}

interface UseParcoursFormProps {
  createParcours: (data: any) => Promise<void>
  updateParcours: (id: number, data: any) => Promise<void>
  removeParcours: (id: number) => Promise<void>
}

export function useParcoursForm({
  createParcours,
  updateParcours,
  removeParcours,
}: UseParcoursFormProps) {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingParcours, setEditingParcours] = useState<Parcours | null>(null)
  const [formData, setFormData] = useState<ParcoursFormData>({
    nom_parcours: "",
    id_mention: "",
    niveau_parcours: "",
    formation_type: "",
    description_parcours: "",
  })

  const resetForm = () => setFormData({
    nom_parcours: "",
    id_mention: "",
    niveau_parcours: "",
    formation_type: "",
    description_parcours: ""
  })

  const handleAdd = async () => {
    if (!formData.nom_parcours || !formData.id_mention || !formData.niveau_parcours || !formData.formation_type) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" })
      return
    }
    try {
        await createParcours({
        idMention: Number(formData.id_mention),
        nomParcours: formData.nom_parcours,
        niveauParcours: formData.niveau_parcours as NiveauEnum,
        formation: formData.formation_type as FormationEnum,
        descriptionParcours: formData.description_parcours,
        })

      setIsAddDialogOpen(false)
      resetForm()
      toast({ title: "Succès", description: "Parcours ajouté avec succès" })
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible d'ajouter le parcours", variant: "destructive" })
    }
  }

  const handleEdit = (p: Parcours) => {
    setEditingParcours(p)
    setFormData({
      nom_parcours: p.nom_parcours,
      id_mention: p.id_mention.toString(),
      niveau_parcours: p.niveau_parcours || "",
      formation_type: p.formation_type || "Academique",
      description_parcours: p.description_parcours || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!formData.nom_parcours || !formData.id_mention || !formData.niveau_parcours || !formData.formation_type || !editingParcours) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs obligatoires", variant: "destructive" })
      return
    }
    try {
        await updateParcours(editingParcours.id_parcours || 0, {
        idMention: Number(formData.id_mention),
        nomParcours: formData.nom_parcours,
        niveauParcours: formData.niveau_parcours as NiveauEnum,
        formation: formData.formation_type as FormationEnum,
        descriptionParcours: formData.description_parcours,
        })

      setIsEditDialogOpen(false)
      setEditingParcours(null)
      resetForm()
      toast({ title: "Succès", description: "Parcours mis à jour avec succès" })
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le parcours", variant: "destructive" })
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await removeParcours(id)
      toast({ title: "Succès", description: "Parcours supprimé avec succès" })
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de supprimer le parcours", variant: "destructive" })
    }
  }

  return {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
  }
}