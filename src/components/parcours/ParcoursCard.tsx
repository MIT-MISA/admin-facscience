import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Edit, Trash2 } from "lucide-react"
import { FormationEnum, NiveauEnum, Parcours } from "@/services/types/parcours"

interface ParcoursCardProps {
  parcours: Parcours
  onEdit: (parcours: Parcours) => void
  onDelete: (id: number) => void
}

export function ParcoursCard({ parcours, onEdit, onDelete }: ParcoursCardProps) {
  const getNiveauBadgeColor = (niveau: NiveauEnum) => {
    if (niveau.startsWith("L"))
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    if (niveau.startsWith("M"))
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (niveau.startsWith("D"))
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }

  const getFormationBadgeColor = (formation: FormationEnum) => {
    switch (formation) {
      case "Academique":
        return "bg-university-primary/10 text-university-primary"
      case "Professionnalisante":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="font-medium text-foreground">{parcours.nom_parcours}</h4>
          <Badge className={getNiveauBadgeColor(parcours.niveau_parcours || NiveauEnum.L1)}>
            {parcours.niveau_parcours}
          </Badge>
          <Badge className={getFormationBadgeColor(parcours.formation_type)}>
            {parcours.formation_type}
          </Badge>
        </div>
        {parcours.description_parcours && (
          <p className="text-sm text-muted-foreground mb-2">{parcours.description_parcours}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{parcours.niveau_parcours}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(parcours)}>
          <Edit className="h-4 w-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer le parcours "{parcours.nom_parcours}" ? Cette action
                est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(parcours.id_parcours || 0)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}