import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Category } from "@/services/types/event"

interface CategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoryForm: { nom: string }
  categories: Category[]
  onCategoryFormChange: (form: { nom: string }) => void
  onAddCategory: () => void
}

export function CategoryDialog({
  open,
  onOpenChange,
  categoryForm,
  categories,
  onCategoryFormChange,
  onAddCategory,
}: CategoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Ajouter une Catégorie</DialogTitle>
          <DialogDescription>Créez une nouvelle catégorie pour organiser vos actualités.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category-name">Nom de la catégorie</Label>
            <Input
              id="category-name"
              value={categoryForm.nom}
              onChange={(e) => onCategoryFormChange({ ...categoryForm, nom: e.target.value })}
              placeholder="Ex: Événements"
            />
          </div>
          <div className="space-y-2">
            <Label>Catégories existantes</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.id} className="border">
                  {/* Utilisez category.nom si disponible, sinon category.name */}
                  {category.nom || category.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button onClick={onAddCategory} className="bg-university-primary hover:bg-university-primary/90">
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}