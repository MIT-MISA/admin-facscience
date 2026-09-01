"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, Users, Mail, Phone, User, UserIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BasePerson, COFAC, doyenEtVice, PAT, Person, PersonType, Professeur } from "@/services/types/person"
// import { createOptions, getSelectOptions } from "@/services/api/option.api"
import { options } from "@/services/types/option"
import { usePeople } from "@/hooks/usePeople"
import { useImageFallback } from "@/hooks/usePerson"


const typeSpecificFields: Record<PersonType, (formData: any) => Partial<Person>> = {
  pat: (fd) => ({
    postAffectation: fd.postAffectation,
    grade: fd.grade,
    fonction: fd.fonction,
  }),
  professeur: (fd) => ({
    titre: fd.titre,
  }),
  cofac: (fd) => ({
    appartenance: fd.appartenance,
  }),
  doyen_et_vice: (fd) => ({
    responsabilite: fd.responsabilite,
  }),
};

export function PeopleManagement() {


  const [activeTab, setActiveTab] = useState<PersonType>("pat")
  const { people, allPeople, selectOptions, createOpt, createNewPerson, updatePersons, removePerson } = usePeople(activeTab);
  const [addOptionType, setAddOptionType] = useState<keyof options>("postAffectations")

  const { error, handleError, src } = useImageFallback()

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddOptionDialogOpen, setIsAddOptionDialogOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)
  const [newOptionValue, setNewOptionValue] = useState("")
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    email: "",
    tel: "",
    type: "pat" as PersonType,
    postAffectation: "",
    grade: "",
    fonction: "",
    titre: "",
    appartenance: "",
    responsabilite: "",
  })
  const { toast } = useToast()



  const filteredPeople = people.filter((person) => {
    const matchesSearch =
      person.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = person.type === activeTab
    return matchesSearch && matchesTab
  })

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      sexe: "",
      email: "",
      tel: "",
      type: activeTab,
      postAffectation: "",
      grade: "",
      fonction: "",
      titre: "",
      appartenance: "",
      responsabilite: "",
    })
  }

  const handleAddOption = async () => {
    if (!newOptionValue.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une valeur",
        variant: "destructive",
      });
      return;
    }

    await createOpt(addOptionType, { nom: newOptionValue.trim() });

    setNewOptionValue("");
    setIsAddOptionDialogOpen(false);
    toast({
      title: "Succès",
      description: "Option ajoutée avec succès",
    });
  };

  const openAddOptionDialog = (optionType: keyof options) => {
    setAddOptionType(optionType)
    setIsAddOptionDialogOpen(true)
  }

  const handleAdd = async () => {
    if (!formData.nom || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Champs communs
    const basePerson: Omit<Person, "id"> = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      tel: formData.tel,
      type: formData.type,
      dateInsertion: new Date().toISOString().split("T")[0],
      sexe: formData.sexe as "F" | "M",
    };

    // Ajouter les champs spécifiques dynamiquement
    const personData: Omit<Person, "id"> = {
      ...basePerson,
      ...typeSpecificFields[formData.type](formData),
    };

    // Appel API générique
    await createNewPerson(personData);

    // Mettre à jour l'état
    setIsAddDialogOpen(false);
    resetForm();

    toast({
      title: "Succès",
      description: "Personne ajoutée avec succès",
    });
  };


  const handleEdit = (person: Person) => {
    setEditingPerson(person)

    switch (person.type) {
      case "pat":
        setFormData({
          nom: person.nom,
          prenom: person.prenom,
          sexe: person.sexe,
          email: person.email,
          tel: person.tel,
          type: person.type,
          postAffectation: person.postAffectation,
          grade: person.grade,
          fonction: person.fonction,
          titre: "",
          appartenance: "",
          responsabilite: "",
        })
        break

      case "professeur":
        setFormData({
          nom: person.nom,
          prenom: person.prenom,
          sexe: person.sexe,
          email: person.email,
          tel: person.tel,
          type: person.type,
          titre: person.titre,
          postAffectation: "",
          grade: "",
          fonction: "",
          appartenance: "",
          responsabilite: "",
        })
        break

      case "cofac":
        setFormData({
          nom: person.nom,
          prenom: person.prenom,
          sexe: person.sexe,
          email: person.email,
          tel: person.tel,
          type: person.type,
          appartenance: person.appartenance,
          postAffectation: "",
          grade: "",
          fonction: "",
          titre: "",
          responsabilite: "",
        })
        break

      case "doyen_et_vice":
        setFormData({
          nom: person.nom,
          prenom: person.prenom,
          sexe: person.sexe,
          email: person.email,
          tel: person.tel,
          type: person.type,
          responsabilite: person.responsabilite,
          postAffectation: "",
          grade: "",
          fonction: "",
          titre: "",
          appartenance: "",
        })
        break
    }

    setIsEditDialogOpen(true)
  }


  const handleUpdate = async () => {
    if (!formData.nom || !formData.prenom || !formData.email || !editingPerson) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      // Construire l'objet à envoyer à l'API
      const personToUpdate: BasePerson & { type: string } = {
        ...editingPerson, // inclut id, date_insertion, sexe, etc.
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        tel: formData.tel,
        type: formData.type,
        ...(formData.type === "pat" && {
          postAffectation: formData.postAffectation,
          grade: formData.grade,
          fonction: formData.fonction,
        }),
        ...(formData.type === "professeur" && {
          titre: formData.titre,
        }),
        ...(formData.type === "cofac" && {
          appartenance: formData.appartenance,
        }),
        ...(formData.type === "doyen_et_vice" && {
          responsabilite: formData.responsabilite,
        }),
      };

      // Appel API pour mettre à jour
      await updatePersons(personToUpdate);



      setIsEditDialogOpen(false);
      setEditingPerson(null);
      resetForm();

      toast({
        title: "Succès",
        description: "Personne mise à jour avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour la personne",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (person: Person) => {
    try {
      // Appel à l'API pour supprimer la personne
      await removePerson(person);


      toast({
        title: "Succès",
        description: `Personne "${person.prenom} ${person.nom}" supprimée avec succès`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la personne. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const getPersonTypeBadge = (type: PersonType) => {
    const colors = {
      pat: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      professeur: "bg-university-primary/10 text-university-primary",
      cofac: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      doyen_et_vice: "bg-university-secondary/10 text-university-secondary",
    }
    return <Badge className={colors[type]}>{type}</Badge>
  }

  const getSpecificInfo = (person: Person) => {
    switch (person.type) {
      case "pat":
        return (
          <div className="text-xs text-muted-foreground space-y-1">
            {person.postAffectation && <div>Poste: {person.postAffectation}</div>}
            {person.grade && <div>Grade: {person.grade}</div>}
            {person.fonction && <div>Fonction: {person.fonction}</div>}
          </div>
        )
      case "professeur":
        return <div className="text-xs text-muted-foreground">{person.titre && <div>Titre: {person.titre}</div>}</div>
      case "cofac":
        return (
          <div className="text-xs text-muted-foreground">
            {person.appartenance && <div>Appartenance: {person.appartenance}</div>}
          </div>
        )
      case "doyen_et_vice":
        return (
          <div className="text-xs text-muted-foreground">
            {person.responsabilite && <div>Responsabilité: {person.responsabilite}</div>}
          </div>
        )
      default:
        return null
    }
  }

  const renderSpecificFields = (isEdit = false) => {
    const prefix = isEdit ? "edit-" : ""

    switch (formData.type) {
      case "pat":
        return (
          <>
            <div className="grid gap-2">
              <Label htmlFor={`${prefix}post`}>Post d'affectation</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.postAffectation}
                  onValueChange={(value) => setFormData({ ...formData, postAffectation: value })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Sélectionner un poste" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectOptions.postAffectations.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openAddOptionDialog("postAffectations")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`${prefix}grade`}>Grade</Label>
                <div className="flex gap-2">
                  <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sélectionner un grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectOptions.grades.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="sm" onClick={() => openAddOptionDialog("grades")}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`${prefix}fonction`}>Fonction</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.fonction}
                    onValueChange={(value) => setFormData({ ...formData, fonction: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Sélectionner une fonction" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectOptions.fonctions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="sm" onClick={() => openAddOptionDialog("fonctions")}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )
      case "professeur":
        return (
          <div className="grid gap-2">
            <Label htmlFor={`${prefix}titre`}>Titre</Label>
            <div className="flex gap-2">
              <Select value={formData.titre} onValueChange={(value) => setFormData({ ...formData, titre: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionner un titre" />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.titres.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="sm" onClick={() => openAddOptionDialog("titres")}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      case "cofac":
        return (
          <div className="grid gap-2">
            <Label htmlFor={`${prefix}appartenance`}>Appartenance</Label>
            <div className="flex gap-2">
              <Select
                value={formData.appartenance}
                onValueChange={(value) => setFormData({ ...formData, appartenance: value })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionner une appartenance" />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.appartenances.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="sm" onClick={() => openAddOptionDialog("appartenances")}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      case "doyen_et_vice":
        return (
          <div className="grid gap-2">
            <Label htmlFor={`${prefix}responsabilite`}>Responsabilité</Label>
            <div className="flex gap-2">
              <Select
                value={formData.responsabilite}
                onValueChange={(value) => setFormData({ ...formData, responsabilite: value })}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionner une responsabilité" />
                </SelectTrigger>
                <SelectContent>
                  {selectOptions.responsabilites.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="sm" onClick={() => openAddOptionDialog("responsabilites")}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const getTabCounts = () => {
    return {
      pat: allPeople.filter((p) => p.type === "pat").length,
      professeur: allPeople.filter((p) => p.type === "professeur").length,
      cofac: allPeople.filter((p) => p.type === "cofac").length,
      doyen_et_vice: allPeople.filter((p) => p.type === "doyen_et_vice").length,
    }
  }

  const tabCounts = getTabCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Personnes</h1>
          <p className="text-muted-foreground">Gérer le personnel universitaire par catégorie</p>
        </div>
        <div className="hidden md:flex  items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-university-primary">{allPeople.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          {/* <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {people.filter((p) => p.statut === "active").length}
            </div>
            <div className="text-xs text-muted-foreground">Actifs</div>
          </div> */}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-university-primary" />
              Personnel Universitaire
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-university-primary rounded-full w-10 h-10 sm:w-fit sm:rounded-lg hover:bg-university-primary/90"
                  onClick={() => setFormData({ ...formData, type: activeTab })}
                >
                  <Plus className="h-4 w-4" />
                  <div className="hidden sm:block">Ajouter {activeTab}</div>

                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Ajouter une Nouvelle Personne</DialogTitle>
                  <DialogDescription>Remplissez les informations pour ajouter une personne.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                        placeholder="Nom de famille"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                        placeholder="Prénom"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@univ.ma"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="tel">Téléphone</Label>
                    <Input
                      id="tel"
                      value={formData.tel}
                      onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                      placeholder="+212 6 12 34 56 78"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: PersonType) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pat">PAT</SelectItem>
                        <SelectItem value="professeur">Professeur</SelectItem>
                        <SelectItem value="cofac">COFAC</SelectItem>
                        <SelectItem value="doyen_et_vice">Doyen et Vice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {renderSpecificFields()}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleAdd} className="bg-university-primary hover:bg-university-primary/90">
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Barre de recherche */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher une personne..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as PersonType)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pat" className="flex items-center gap-2">
                PAT
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.pat}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="professeur" className="flex items-center gap-2">
                Professeur
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.professeur}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="cofac" className="flex items-center gap-2">
                COFAC
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.cofac}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="doyen_et_vice" className="flex items-center gap-2">
                Decanat
                <Badge variant="secondary" className="text-xs">
                  {tabCounts.doyen_et_vice}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {(["pat", "professeur", "cofac", "doyen_et_vice"] as PersonType[]).map((tabType) => (
              <TabsContent key={tabType} value={tabType} className="space-y-4">
                {/* Aucun résultat */}
                {filteredPeople.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? `Aucune personne trouvée pour "${searchTerm}"`
                        : `Aucune personne de type ${tabType} disponible`}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>

                          <TableHead>Nom</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Informations spécifiques</TableHead>
                          <TableHead>Date création</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPeople.map((person) => (
                          <TableRow key={person.id}>

                            <TableCell>
                              <div className="flex items-center">
                                {!error ? (
                                  <img
                                    src={src(`/images/${person.id}.jpg`)}
                                    alt={`${person.prenom} ${person.nom}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                    onError={handleError}
                                  />
                                ) : (
                                  <UserIcon className="w-10 h-10 text-gray-400" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {person.prenom} {person.nom}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-sm">
                                  <Mail className="h-3 w-3" />
                                  <span>{person.email}</span>
                                </div>
                                {person.tel && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3" />
                                    <span>{person.tel}</span>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getPersonTypeBadge(person.type)}</TableCell>
                            <TableCell>{getSpecificInfo(person)}</TableCell>
                            <TableCell>{new Date(person.dateInsertion).toLocaleDateString("fr-FR")}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEdit(person)}>
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
                                        Êtes-vous sûr de vouloir supprimer "{person.prenom} {person.nom}" ? Cette action
                                        est irréversible.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(person)}
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
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier la Personne</DialogTitle>
            <DialogDescription>Modifiez les informations de la personne sélectionnée.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-nom">Nom *</Label>
                <Input
                  id="edit-nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Nom de famille"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-prenom">Prénom *</Label>
                <Input
                  id="edit-prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  placeholder="Prénom"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@univ.ma"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-tel">Téléphone</Label>
              <Input
                id="edit-tel"
                value={formData.tel}
                onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                placeholder="+212 6 12 34 56 78"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: PersonType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pat">PAT</SelectItem>
                  <SelectItem value="professeur">Professeur</SelectItem>
                  <SelectItem value="cofac">COFAC</SelectItem>
                  <SelectItem value="doyen_et_vice">Tête de la Fac</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderSpecificFields(true)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate} className="bg-university-primary hover:bg-university-primary/90">
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddOptionDialogOpen} onOpenChange={setIsAddOptionDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Ajouter une Option</DialogTitle>
            <DialogDescription>Ajoutez une nouvelle option à la liste de sélection.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-option">Nouvelle valeur</Label>
              <Input
                id="new-option"
                value={newOptionValue}
                onChange={(e) => setNewOptionValue(e.target.value)}
                placeholder="Saisir la nouvelle valeur"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOptionDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddOption} className="bg-university-primary hover:bg-university-primary/90">
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
