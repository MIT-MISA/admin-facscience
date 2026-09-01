import { createContext, useContext, useState, type ReactNode } from "react"

// Types
export type Mention = {
  id: number
  nom: string
}

export type Parcours = {
  id: number
  nom_parcours: string
  niveau_parcours: string
  id_mention: number
}

export type Specialite = {
  id: number
  id_parcours: number
  nom: string
  description?: string
}

// 🔹 Mock mentions
const mockMentions: Mention[] = [
  { id: 1, nom: "Sciences et Technologies" },
  { id: 2, nom: "Sciences Sociales" },
]

// 🔹 Mock parcours
const mockParcours: Parcours[] = [
  { id: 1, nom_parcours: "Informatique", niveau_parcours: "Licence 3", id_mention: 1 },
  { id: 2, nom_parcours: "Mathématiques", niveau_parcours: "Master 1", id_mention: 1 },
  { id: 3, nom_parcours: "Sociologie", niveau_parcours: "Licence 2", id_mention: 2 },
]

// 🔹 Mock spécialités
const mockSpecialites: Specialite[] = [
  { id: 1, id_parcours: 1, nom: "Développement Web", description: "Front-end et Back-end" },
  { id: 2, id_parcours: 1, nom: "Intelligence Artificielle", description: "ML, Deep Learning, Data Science" },
  { id: 3, id_parcours: 2, nom: "Analyse Numérique", description: "Optimisation et statistiques appliquées" },
]

// Contexte
type UniversityContextType = {
  mentions: Mention[]
  parcours: Parcours[]
  specialites: Specialite[]
  addSpecialite: (s: Omit<Specialite, "id">) => void
  updateSpecialite: (id: number, s: Omit<Specialite, "id">) => void
  deleteSpecialite: (id: number) => void
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined)

export function UniversityProvider({ children }: { children: ReactNode }) {
  const [mentions] = useState<Mention[]>(mockMentions)
  const [parcours] = useState<Parcours[]>(mockParcours)
  const [specialites, setSpecialites] = useState<Specialite[]>(mockSpecialites)

  const addSpecialite = (s: Omit<Specialite, "id">) => {
    const newSpecialite: Specialite = { id: Date.now(), ...s }
    setSpecialites((prev) => [...prev, newSpecialite])
  }

  const updateSpecialite = (id: number, s: Omit<Specialite, "id">) => {
    setSpecialites((prev) => prev.map((sp) => (sp.id === id ? { id, ...s } : sp)))
  }

  const deleteSpecialite = (id: number) => {
    setSpecialites((prev) => prev.filter((sp) => sp.id !== id))
  }

  return (
    <UniversityContext.Provider value={{ mentions, parcours, specialites, addSpecialite, updateSpecialite, deleteSpecialite }}>
      {children}
    </UniversityContext.Provider>
  )
}

export function useUniversity() {
  const ctx = useContext(UniversityContext)
  if (!ctx) throw new Error("useUniversity doit être utilisé dans UniversityProvider")
  return ctx
}
