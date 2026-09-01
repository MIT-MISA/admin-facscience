import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Actualite, Category } from "@/services/types/event"

interface NewsFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: Actualite
  categories: Category[]
  isEdit?: boolean
  onFormChange: (data: Actualite) => void
  onSubmit: () => void
}

export function NewsFormDialog({
  open,
  onOpenChange,
  formData,
  categories,
  isEdit = false,
  onFormChange,
  onSubmit,
}: NewsFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'Actualité" : "Ajouter une Nouvelle Actualité"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifiez les informations de l'actualité sélectionnée."
              : "Remplissez les informations pour créer une nouvelle actualité. Vous pourrez ajouter des médias après la création."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="titre">Titre *</Label>
            <Input
              id="titre"
              value={formData.titre}
              onChange={(e) => onFormChange({ ...formData, titre: e.target.value })}
              placeholder="Titre de l'actualité"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categorie">Catégorie *</Label>
            <Select
              value={formData.categorie}
              onValueChange={(value) => onFormChange({ ...formData, categorie: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      <div className="flex items-center gap-2">{category.name}</div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              placeholder="Description courte de l'actualité"
              rows={2}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contenu">Contenu *</Label>
            <Textarea
              id="contenu"
              value={formData.contenu || ''}
              onChange={(e) => onFormChange({ ...formData, contenu: e.target.value })}
              placeholder="Contenu détaillé de l'actualité"
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date-debut">Date de début *</Label>
              <Input
                id="date-debut"
                type="datetime-local"
                value={formData.dateCommencement?.toISOString().slice(0, 16) ?? ""}
                onChange={(e) => onFormChange({ ...formData, dateCommencement: new Date(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date-fin">Date de fin</Label>
              <Input
                id="date-fin"
                type="datetime-local"
                value={formData.dateFin?.toISOString().slice(0, 16) ?? ""}
                onChange={(e) => onFormChange({ ...formData, dateFin: new Date(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lieu">Lieu</Label>
            <Input
              id="lieu"
              value={formData.lieu || ''}
              onChange={(e) => onFormChange({ ...formData, lieu: e.target.value })}
              placeholder="Lieu de l'événement"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSubmit} className="bg-university-primary hover:bg-university-primary/90">
            {isEdit ? "Mettre à jour" : "Créer l'actualité"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}