"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, BookOpen } from "lucide-react"
import { FormationEnum, NiveauEnum } from "@/services/types/parcours"
import { useMention } from "@/hooks/useMention"
import { useParcours } from "@/hooks/useParcours"
import { useParcoursFilters } from "./hooks/useParcoursFilters"
import { useParcoursForm } from "./hooks/useParcoursForm"
import { ParcoursFilters } from "./parcours/ParcoursFilters"
import { ParcoursFormDialog } from "./parcours/ParcoursFormDialog"
import { ParcoursGroupedView } from "./parcours/ParcoursGroupedView"
import { ParcoursTableView } from "./parcours/ParcoursTableView"

export function ParcoursManagement() {
  const { parcours, createParcours, updateParcours, removeParcours } = useParcours()
  const { mentions } = useMention()

  const mappedParcours = useMemo(() => parcours.map(p => ({
    id_parcours: p.idParcours,
    nom_parcours: p.nomParcours,
    id_mention: p.idMention,
    niveau_parcours: p.niveauParcours,
    formation_type: p.formation,
    description_parcours: p.descriptionParcours,
  })), [parcours])

  const {
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
  } = useParcoursFilters(mappedParcours, mentions)

  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleUpdate,
    handleDelete,
  } = useParcoursForm({ createParcours, updateParcours, removeParcours })

  const niveauxOptions = Object.values(NiveauEnum)
  const formationOptions = Object.values(FormationEnum)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Parcours</h1>
          <p className="text-muted-foreground">Gérer les parcours académiques par mention</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-university-primary">{parcours.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-university-primary" />
              Liste des Parcours
            </CardTitle>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="flex justify-between rounded-full w-10 h-10 md:w-fit md:rounded-md items-center bg-university-primary hover:bg-university-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              <div className="hidden md:block">Ajouter un Parcours</div>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ParcoursFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedMention={selectedMention}
            setSelectedMention={setSelectedMention}
            selectedNiveau={selectedNiveau}
            setSelectedNiveau={setSelectedNiveau}
            selectedFormation={selectedFormation}
            setSelectedFormation={setSelectedFormation}
            mentions={mentions}
            niveauxOptions={niveauxOptions}
            formationOptions={formationOptions}
          />

          <Tabs defaultValue="grouped" className="w-full">
            <TabsList className="hidden md:grid w-full grid-cols-2">
              <TabsTrigger value="grouped">Vue par Mention</TabsTrigger>
              <TabsTrigger value="table">Vue Tableau</TabsTrigger>
            </TabsList>

            <TabsContent value="grouped" className="space-y-4">
              <ParcoursGroupedView
                groupedParcours={groupedParcours}
                onEdit={handleEdit}
                onDelete={handleDelete}
                hasFilters={hasFilters}
              />
            </TabsContent>

            <TabsContent value="table">
              <ParcoursTableView
                parcours={filteredParcours}
                mentions={mentions}
                onEdit={handleEdit}
                onDelete={handleDelete}
                hasFilters={hasFilters}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <ParcoursFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        mode="add"
        formData={formData}
        setFormData={setFormData}
        niveauxOptions={niveauxOptions}
        formationOptions={formationOptions}
        onSubmit={handleAdd}
      />

      <ParcoursFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        mode="edit"
        formData={formData}
        setFormData={setFormData}
        niveauxOptions={niveauxOptions}
        formationOptions={formationOptions}
        onSubmit={handleUpdate}
      />
    </div>
  )
}