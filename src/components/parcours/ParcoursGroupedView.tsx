import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"
import { Parcours } from "@/services/types/parcours"
import { Mention } from "@/services/types/mention"
import { ParcoursCard } from "./ParcoursCard"

interface GroupedParcoursData {
  mention: Mention
  parcours: Parcours[]
}

interface ParcoursGroupedViewProps {
  groupedParcours: GroupedParcoursData[]
  onEdit: (parcours: Parcours) => void
  onDelete: (id: number) => void
  hasFilters: boolean
}

export function ParcoursGroupedView({
  groupedParcours,
  onEdit,
  onDelete,
  hasFilters,
}: ParcoursGroupedViewProps) {
  if (groupedParcours.length === 0) {
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
    <div className="space-y-4">
      {groupedParcours.map(({ mention, parcours: mentionParcours }) => (
        <Card key={mention.id_mention}>
          <CardHeader>
            <CardTitle className="text-lg text-university-primary">
              {mention.nom_mention} ({mention.abbreviation})
              <Badge variant="outline" className="ml-2">
                {mentionParcours.length} parcours
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            <div className="space-y-4">
              {mentionParcours.map((p) => (
                <ParcoursCard key={p.id_parcours} parcours={p} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}