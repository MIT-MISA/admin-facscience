import { useMemo, useState } from "react"
import { Parcours } from "@/services/types/parcours"
import { Mention } from "@/services/types/mention"


export function useParcoursFilters(parcours: Parcours[], mentions: Mention[]) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMention, setSelectedMention] = useState<string>("all")
  const [selectedNiveau, setSelectedNiveau] = useState<string>("all")
  const [selectedFormation, setSelectedFormation] = useState<string>("all")

  const filteredParcours = useMemo(() => {
    return parcours.filter((p: Parcours) => {
      const parcoursName = p.nom_parcours ?? ""
      const mentionName = mentions.find(m => m.id_mention === p.id_mention)?.nom_mention ?? ""

      const matchesSearch =
        parcoursName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentionName.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesMention = selectedMention === "all" || p.id_mention?.toString() === selectedMention
      const matchesNiveau = selectedNiveau === "all" || p.niveau_parcours === selectedNiveau
      const matchesFormation = selectedFormation === "all" || p.formation_type === selectedFormation

      return matchesSearch && matchesMention && matchesNiveau && matchesFormation
    })
  }, [parcours, searchTerm, selectedMention, selectedNiveau, selectedFormation, mentions])

  const normalizedMentions = useMemo(() =>
    mentions.map(m => ({
      id_mention: m.idMention ?? m.id_mention,
      nom_mention: m.nomMention ?? m.nom_mention,
      abbreviation: m.abbreviation ?? m.abbreviation ?? "",
    })),
  [mentions])

  const groupedParcours = useMemo(() => {
    if (!normalizedMentions.length) return []

    const grouped: { [key: number]: { mention: any; parcours: Parcours[] } } = {}

    filteredParcours.forEach((p) => {
      const mention = normalizedMentions.find((m) => m.id_mention === p.id_mention)
      if (!mention) return

      if (!grouped[mention.id_mention]) {
        grouped[mention.id_mention] = { mention, parcours: [] }
      }
      grouped[mention.id_mention].parcours.push(p)
    })

    return Object.values(grouped)
  }, [filteredParcours, normalizedMentions])

  const hasFilters = searchTerm !== "" || selectedMention !== "all" || selectedNiveau !== "all" || selectedFormation !== "all"

  return {
    searchTerm,
    setSearchTerm,
    selectedMention,
    setSelectedMention,
    selectedNiveau,
    setSelectedNiveau,
    selectedFormation,
    setSelectedFormation,
    filteredParcours,
    groupedParcours,
    hasFilters,
  }
}