import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { FormationEnum, NiveauEnum } from "@/services/types/parcours"
import { Mention } from "@/services/types/mention"
import { baseURL } from "@/services"

interface ParcoursFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "add" | "edit"
  formData: {
    nom_parcours: string
    id_mention: string
    niveau_parcours: NiveauEnum | ""
    formation_type: FormationEnum | ""
    description_parcours: string
  }
  setFormData: (data: any) => void
  niveauxOptions: NiveauEnum[]
  formationOptions: FormationEnum[]
  onSubmit: () => void
}

export function ParcoursFormDialog({
  open,
  onOpenChange,
  mode,
  formData,
  setFormData,
  niveauxOptions,
  formationOptions,
  onSubmit,
}: ParcoursFormDialogProps) {
  const [mentions, setMentions] = useState<Mention[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMentions = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Fetching mentions from /api/Mention...')
      const response = await fetch(`${baseURL}/api/Mention`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('✅ Mentions reçues:', data)
      console.log('📊 Nombre de mentions:', data?.length || 0)
      
      setMentions(data || [])
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue'
      console.error('❌ Erreur lors du chargement des mentions:', err)
      setError(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      console.log('🚪 Dialog ouvert - Chargement des mentions')
      fetchMentions()
    } else {
      console.log('🚪 Dialog fermé - Reset des mentions')
      setMentions([])
      setError(null)
    }
  }, [open])

  // Log pour déboguer
  useEffect(() => {
    console.log('📋 État actuel:', {
      isLoading,
      error,
      mentionsCount: mentions.length,
      mentions: mentions.slice(0, 3) // Affiche les 3 premières
    })
  }, [isLoading, error, mentions])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Ajouter un Nouveau Parcours" : "Modifier le Parcours"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Remplissez les informations pour créer un nouveau parcours académique."
              : "Modifiez les informations du parcours sélectionné."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fetchMentions}
                className="h-7"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Réessayer
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nom">Nom du parcours *</Label>
            <Input
              id="nom"
              value={formData.nom_parcours}
              onChange={(e) => setFormData({ ...formData, nom_parcours: e.target.value })}
              placeholder="Ex: Génie Logiciel"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mention">
              Mention * 
              {isLoading && <span className="text-xs text-muted-foreground ml-2">(Chargement...)</span>}
              {!isLoading && mentions.length > 0 && (
                <span className="text-xs text-muted-foreground ml-2">({mentions.length} disponible{mentions.length > 1 ? 's' : ''})</span>
              )}
            </Label>
            
            {isLoading ? (
              <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md bg-muted">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Chargement des mentions...</span>
              </div>
            ) : error ? (
              <div className="h-10 px-3 py-2 border rounded-md bg-destructive/10 flex items-center justify-center text-sm text-destructive">
                Erreur de chargement
              </div>
            ) : (
              <Select
                value={formData.id_mention}
                onValueChange={(value) => {
                  console.log('✏️ Mention sélectionnée:', value)
                  setFormData({ ...formData, id_mention: value })
                }}
              >
                <SelectTrigger id="mention">
                  <SelectValue placeholder="Sélectionner une mention" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5}>
                  {mentions.length === 0 ? (
                    <SelectItem value="__empty__" disabled>
                      Aucune mention disponible
                    </SelectItem>
                  ) : (
                    mentions
                        .filter((mention) => {
                            const id = mention.id_mention ?? mention.idMention
                            const isValid = id != null
                            if (!isValid) console.warn('⚠️ Mention sans ID:', mention)
                            return isValid
                        })
                        .map((mention) => {
                            const id = mention.id_mention ?? mention.idMention
                            const nom = mention.nom_mention ?? mention.nomMention
                            const abrev = mention.abbreviation ?? 'N/A'
                            return (
                            <SelectItem key={id} value={String(id)}>
                                {nom} ({abrev})
                            </SelectItem>
                            )
                        })

                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="niveau">Niveau *</Label>
              <Select
                value={formData.niveau_parcours}
                onValueChange={(value) => setFormData({ ...formData, niveau_parcours: value as NiveauEnum })}
              >
                <SelectTrigger id="niveau">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {niveauxOptions.map((niveau) => (
                    <SelectItem key={niveau} value={niveau}>
                      {niveau}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="formation">Formation *</Label>
              <Select
                value={formData.formation_type}
                onValueChange={(value) => setFormData({ ...formData, formation_type: value as FormationEnum })}
              >
                <SelectTrigger id="formation">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {formationOptions.map((formation) => (
                    <SelectItem key={formation} value={formation}>
                      {formation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description_parcours}
              onChange={(e) => setFormData({ ...formData, description_parcours: e.target.value })}
              placeholder="Description du parcours..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={onSubmit} 
            className="bg-university-primary hover:bg-university-primary/90"
            disabled={isLoading || !!error}
          >
            {mode === "add" ? "Ajouter" : "Mettre à jour"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}