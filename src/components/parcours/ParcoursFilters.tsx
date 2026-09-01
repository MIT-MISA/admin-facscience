import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { FormationEnum, NiveauEnum } from "@/services/types/parcours"
import { Mention } from "@/services/types/mention"

interface ParcoursFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedMention: string
  setSelectedMention: (value: string) => void
  selectedNiveau: string
  setSelectedNiveau: (value: string) => void
  selectedFormation: string
  setSelectedFormation: (value: string) => void
  mentions: Mention[]
  niveauxOptions: NiveauEnum[]
  formationOptions: FormationEnum[]
}

export function ParcoursFilters({
  searchTerm,
  setSearchTerm,
  selectedMention,
  setSelectedMention,
  selectedNiveau,
  setSelectedNiveau,
  selectedFormation,
  setSelectedFormation,
  mentions,
  niveauxOptions,
  formationOptions,
}: ParcoursFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher un parcours..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedMention} onValueChange={setSelectedMention}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Toutes mentions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes mentions</SelectItem>
          {mentions
            .filter((mention) => mention.id_mention !== undefined && mention.id_mention !== null)
            .map((mention) => (
              <SelectItem key={mention.id_mention} value={String(mention.id_mention)}>
                {mention.nom_mention} {mention.abbreviation}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <Select value={selectedNiveau} onValueChange={setSelectedNiveau}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Niveau" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous niveaux</SelectItem>
          {niveauxOptions.map((niveau) => (
            <SelectItem key={niveau} value={niveau}>
              {niveau}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedFormation} onValueChange={setSelectedFormation}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Formation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes formations</SelectItem>
          {formationOptions.map((formation) => (
            <SelectItem key={formation} value={formation}>
              {formation}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}