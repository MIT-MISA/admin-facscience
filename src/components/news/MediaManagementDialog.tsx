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
} from "@/components/ui/dialog"
import { ImageIcon, X } from "lucide-react"
import { Actualite, Media } from "@/services/types/event"

interface MediaManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actualite: Actualite
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemoveMedia: (mediaId: number) => void
}

export function MediaManagementDialog({
  open,
  onOpenChange,
  actualite,
  onFileChange,
  onRemoveMedia,
}: MediaManagementDialogProps) {
  
  // Filtrer les médias pour enlever les éléments undefined et null
  const validMedias = (actualite.medias || []).filter(media => media != null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gérer les médias de l'actualité</DialogTitle>
          <DialogDescription>
            Ajoutez ou supprimez des médias pour l'actualité "{actualite.titre}"
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Ajouter un média</Label>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <label htmlFor="media-upload" className="cursor-pointer flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Sélectionner un fichier
                <input
                  id="media-upload"
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={onFileChange}
                />
              </label>
            </Button>
          </div>

          <div className="grid gap-2">
            <Label>Médias actuels ({validMedias.length})</Label>
            {validMedias.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun média ajouté</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {validMedias.map((media, index) => (
                  <div key={media?.idMedia || `media-${index}`} className="relative border rounded-lg p-2">
                    {/* Vérification sécurisée pour l'image */}
                    {media?.chemin ? (
                      <img
                        src={media.chemin || "/placeholder.svg"}
                        alt={media?.media || "Média"}
                        className="w-full h-20 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => {
                        if (media?.idMedia !== undefined) {
                          onRemoveMedia(media.idMedia)
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {media?.media || "Fichier média"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}