import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Calendar, MapPin, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import { Actualite } from "@/services/types/event"

interface NewsCardProps {
  news: Actualite
  onEdit: (news: Actualite) => void
  onDelete: (id: number) => void
  onManageMedia: (news: Actualite) => void
  onStatusChange: (idActualite: number, newStatus: "draft" | "published" | "archived") => void
  getStatusBadge: (statut: "draft" | "published" | "archived") => React.JSX.Element
}

export function NewsCard({
  news,
  onEdit,
  onDelete,
  onManageMedia,
  onStatusChange,
  getStatusBadge,
}: NewsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg leading-tight">{news.titre}</CardTitle>
          {getStatusBadge(news.statut as "draft" | "published" | "archived")}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>
            {news.dateCommencement ? new Date(news.dateCommencement).toLocaleDateString() : "Date non définie"}
          </span>
        </div>
        {news.lieu && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{news.lieu}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {news.description || "Aucune description"}
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(news)}
            className="flex items-center gap-1"
          >
            <Edit className="h-3 w-3" />
            Modifier
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onManageMedia(news)}
            className="flex items-center gap-1"
          >
            <ImageIcon className="h-3 w-3" />
            Médias
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="flex items-center gap-1"
              >
                <Trash2 className="h-3 w-3" />
                Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer l'actualité "{news.titre}" ? Cette action est irréversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(news.idActualite!)}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Boutons de changement de statut */}
        <div className="flex flex-wrap gap-1 mt-3">
          {news.statut !== "published" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(news.idActualite!, "published")}
              className="text-xs h-7"
            >
              Publier
            </Button>
          )}
          {news.statut !== "draft" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(news.idActualite!, "draft")}
              className="text-xs h-7"
            >
              Brouillon
            </Button>
          )}
          {news.statut !== "archived" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(news.idActualite!, "archived")}
              className="text-xs h-7"
            >
              Archiver
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}