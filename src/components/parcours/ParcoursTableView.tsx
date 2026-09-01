import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Edit, Trash2, BookOpen } from "lucide-react"
import { FormationEnum, NiveauEnum, Parcours } from "@/services/types/parcours"
import { Mention } from "@/services/types/mention"

interface ParcoursTableViewProps {
  parcours: Parcours[]
  mentions: Mention[]
  onEdit: (parcours: Parcours) => void
  onDelete: (id: number) => void
  hasFilters: boolean
}

export function ParcoursTableView({
  parcours,
  mentions,
  onEdit,
  onDelete,
  hasFilters,
}: ParcoursTableViewProps) {
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

  if (parcours.length === 0) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          {hasFilters
            ? "Aucun parcours trouvé pour les filtres sélectionnés"
            : "Aucun parcours disponible"}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parcours</TableHead>
            <TableHead>Mention</TableHead>
            <TableHead>Niveau</TableHead>
            <TableHead>Formation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parcours.map((p) => {
            const mention = mentions.find((m) => m.id_mention === p.id_mention)
            return (
              <TableRow key={p.id_parcours}>
                <TableCell>
                  <div>
                    <div className="font-medium">{p.nom_parcours}</div>
                    {p.description_parcours && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {p.description_parcours}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {mention?.nom_mention} ({mention?.abbreviation})
                </TableCell>
                <TableCell>
                  <Badge className={getNiveauBadgeColor(p.niveau_parcours || NiveauEnum.L1)}>
                    {p.niveau_parcours}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getFormationBadgeColor(p.formation_type)}>
                    {p.formation_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(p)}>
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
                            Êtes-vous sûr de vouloir supprimer le parcours "{p.nom_parcours}" ? Cette
                            action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(p.id_parcours || 0)}
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
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}