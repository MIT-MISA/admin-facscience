"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Search, Edit, Trash2, FlaskConical, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DescriptionItem, Laboratory } from "@/services/types/labo"
import { useLabo } from "@/hooks/useLabo"

export function LabManagement() {
  
  const { mentions, persons, laboratories, createLaboratory, updateLabos, removeLabos } = useLabo();
      
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMention, setSelectedMention] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingLab, setEditingLab] = useState<Laboratory | null>(null)
  const [formData, setFormData] = useState({
    nomLabo: "",
    mentionRattachement: "",
    responsable: "",
    description: [
      { cle: "", valeur: "" },
      { cle: "", valeur: "" },
    ] as DescriptionItem[],
  })
  const { toast } = useToast()

  // Debug des données
  useEffect(() => {
    console.log('🔍 Mentions dans le composant:', mentions);
    console.log('🔍 Laboratoires dans le composant:', laboratories);
  }, [mentions, laboratories]);

  // Fonction pour transformer les descriptions en string formatée
  const formatDescriptionToString = (descriptions: DescriptionItem[]): string => {
    return descriptions
      .filter(item => item.cle?.trim() && item.valeur?.trim())
      .map(item => `${item.cle}: ${item.valeur}`)
      .join('; ');
  };

  // Fonction pour parser la string en tableau de descriptions
  const parseDescriptionToArray = (description: string | null | undefined): DescriptionItem[] => {
    if (!description || typeof description !== 'string') {
      return [{ cle: "", valeur: "" }, { cle: "", valeur: "" }];
    }
    
    const items = description.split(';')
      .map(item => {
        const [cle, ...valeurParts] = item.split(':');
        return {
          cle: cle?.trim() || '',
          valeur: valeurParts.join(':').trim() || ''
        };
      })
      .filter(item => item.cle || item.valeur);
    
    return items.length > 0 ? items : [{ cle: "", valeur: "" }, { cle: "", valeur: "" }];
  };

  // Adapter les données pour le backend
  const adaptLabForBackend = (frontendData: any) => {
    return {
      nomLabo: frontendData.nomLabo,
      mentionRattachement: frontendData.mentionRattachement ? parseInt(frontendData.mentionRattachement) : null,
      description: formatDescriptionToString(frontendData.description),
      abbreviation: "",
      ecoleDoctoraleRattachement: null
    };
  };

  // CORRECTION : Fonction ultra-sécurisée pour la recherche
  const getMentionNameForSearch = (mentionId: string | number | null | undefined): string => {
    try {
      if (mentionId == null || mentionId === undefined || mentionId === '') return "";
      
      const mentionIdStr = String(mentionId);
      const mention = Array.isArray(mentions) 
        ? mentions.find((m) => m?.id_mention?.toString() === mentionIdStr)
        : null;
      
      return mention?.nom_mention?.toLowerCase?.() || "";
    } catch (error) {
      console.error('Erreur dans getMentionNameForSearch:', error);
      return "";
    }
  };

  // CORRECTION : Filtrage sécurisé
  const filteredLaboratories = (laboratories || []).filter((lab) => {
    if (!lab || typeof lab !== 'object') return false;
    
    try {
      const labName = lab.nomLabo?.toLowerCase?.() || "";
      const mentionName = getMentionNameForSearch(lab.mentionRattachement);
      
      const matchesSearch =
        labName.includes(searchTerm.toLowerCase()) ||
        mentionName.includes(searchTerm.toLowerCase());

      const labMentionStr = lab.mentionRattachement?.toString?.() || "";
      const matchesMention = selectedMention === "all" || labMentionStr === selectedMention;

      return matchesSearch && matchesMention;
    } catch (error) {
      console.error('Erreur lors du filtrage du lab:', lab, error);
      return false;
    }
  });

  const resetForm = () => {
    setFormData({
      nomLabo: "",
      mentionRattachement: "",
      responsable: "",
      description: [
        { cle: "", valeur: "" },
        { cle: "", valeur: "" },
      ],
    })
  }

  const addDescriptionField = () => {
    const newField: DescriptionItem = {
      cle: "",
      valeur: "",
    };
    setFormData({
      ...formData,
      description: [...formData.description, newField],
    });
  };

  const removeDescriptionField = (index: number) => {
    if (formData.description.length <= 2) {
      toast({
        title: "Attention",
        description: "Au moins 2 champs de description sont requis",
        variant: "destructive",
      })
      return
    }
    
    setFormData({
      ...formData,
      description: formData.description.filter((_, i) => i !== index),
    })
  }

  const handleAdd = async () => {
    try {
      if (!formData.nomLabo || !formData.mentionRattachement) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        });
        return;
      }

      const backendData = adaptLabForBackend(formData);
      await createLaboratory(backendData);
      setIsAddDialogOpen(false);
      resetForm();

      toast({
        title: "Succès",
        description: "Laboratoire ajouté avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du laboratoire:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le laboratoire. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (lab: Laboratory) => {
    setEditingLab(lab)
    setFormData({
      nomLabo: lab.nomLabo || "",
      mentionRattachement: lab.mentionRattachement?.toString() || "",
      responsable: "",
      description: parseDescriptionToArray(lab.description as string)
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!formData.nomLabo || !formData.mentionRattachement || !editingLab) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const backendData = adaptLabForBackend(formData);

    try {
      await updateLabos(editingLab.idLabo!, backendData);
      setIsEditDialogOpen(false);
      setEditingLab(null);
      resetForm();

      toast({
        title: "Succès",
        description: "Laboratoire mis à jour avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le laboratoire",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (idLabo: number) => {
    try {
      await removeLabos(idLabo);
      toast({
        title: "Succès",
        description: "Laboratoire supprimé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le laboratoire",
        variant: "destructive",
      });
    }
  };

  // CORRECTION : Fonction ultra-sécurisée pour obtenir le nom de la mention
  const getMentionName = (mentionId: string | number | null | undefined) => {
    try {
      if (mentionId == null || mentionId === undefined || mentionId === '') return "Non spécifiée";
      
      const mentionIdStr = String(mentionId);
      const mention = Array.isArray(mentions) 
        ? mentions.find((m) => m?.id_mention?.toString() === mentionIdStr)
        : null;
      
      if (!mention) return "Inconnue";
      
      const nom = mention.nom_mention || "Sans nom";
      const abbreviation = mention.abbreviation || "";
      
      return abbreviation ? `${nom} (${abbreviation})` : nom;
    } catch (error) {
      console.error('Erreur dans getMentionName:', error);
      return "Erreur";
    }
  };

  // CORRECTION : Rendu sécurisé des mentions dans le select
  const safeMentions = Array.isArray(mentions) ? mentions : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Gestion des Laboratoires</h1>
          <p className="text-muted-foreground">Gérer les laboratoires de recherche de l'université</p>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-university-primary">{(laboratories || []).length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-university-primary" />
              Liste des Laboratoires
            </CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-university-primary rounded-full w-10 h-10 sm:w-fit sm:rounded-lg hover:bg-university-primary/90">
                  <Plus className="h-4 w-4" />
                  <div className="hidden sm:block">Ajouter un Laboratoire</div>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter un Nouveau Laboratoire</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour créer un nouveau laboratoire de recherche.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nom">Nom du laboratoire *</Label>
                    <Input
                      id="nom"
                      value={formData.nomLabo}
                      onChange={(e) => setFormData({ ...formData, nomLabo: e.target.value })}
                      placeholder="Ex: Laboratoire de Recherche en Intelligence Artificielle"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mention">Mention de rattachement *</Label>
                    <Select
                      value={formData.mentionRattachement}
                      onValueChange={(value) => setFormData({ ...formData, mentionRattachement: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une mention" />
                      </SelectTrigger>
                      <SelectContent>
                        {safeMentions.map((mention) => (
                          <SelectItem 
                            key={mention.id_mention} 
                            value={mention.id_mention?.toString() || "default-value"}
                          >
                            {mention.nom_mention} ({mention.abbreviation})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label>Description (Clé-Valeur)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addDescriptionField}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                    {formData.description.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Clé"
                          value={item.cle}
                          onChange={(e) => {
                            const updated = [...formData.description];
                            updated[index] = { ...updated[index], cle: e.target.value };
                            setFormData({ ...formData, description: updated });
                          }}
                        />
                        <Input
                          placeholder="Valeur"
                          value={item.valeur}
                          onChange={(e) => {
                            const updated = [...formData.description];
                            updated[index] = { ...updated[index], valeur: e.target.value };
                            setFormData({ ...formData, description: updated });
                          }}
                        />
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => removeDescriptionField(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
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
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un laboratoire..."
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
                {safeMentions.map((mention) => (
                  <SelectItem 
                    key={mention.id_mention} 
                    value={mention.id_mention?.toString() || "default-value"}
                  >
                    {mention.nom_mention}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredLaboratories.length === 0 ? (
              <div className="text-center py-8">
                <FlaskConical className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || selectedMention !== "all"
                    ? "Aucun laboratoire trouvé pour les filtres sélectionnés"
                    : "Aucun laboratoire disponible"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredLaboratories.map((lab) => (
                  <Card key={lab.idLabo} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-university-primary mb-2">
                            {lab.nomLabo || "Nom non spécifié"}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FlaskConical className="h-4 w-4" />
                              <span>{getMentionName(lab.mentionRattachement)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(lab)}>
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
                                  Êtes-vous sûr de vouloir supprimer le laboratoire "{lab.nomLabo}" ? Cette action est
                                  irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(lab.idLabo!)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {lab.description && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm text-foreground">Informations détaillées</h4>
                          <div className="grid gap-2">
                            {parseDescriptionToArray(lab.description as string).map((desc, index) => (
                              desc.cle && desc.valeur && (
                                <div key={index} className="flex gap-3 text-sm">
                                  <span className="font-medium text-university-primary min-w-[100px]">
                                    {desc.cle}:
                                  </span>
                                  <span className="text-muted-foreground flex-1">{desc.valeur}</span>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Le reste du code du dialog d'édition reste inchangé */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le Laboratoire</DialogTitle>
            <DialogDescription>Modifiez les informations du laboratoire sélectionné.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nom">Nom du laboratoire *</Label>
              <Input
                id="edit-nom"
                value={formData.nomLabo}
                onChange={(e) => setFormData({ ...formData, nomLabo: e.target.value })}
                placeholder="Ex: Laboratoire de Recherche en Intelligence Artificielle"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-mention">Mention de rattachement *</Label>
              <Select
                value={formData.mentionRattachement}
                onValueChange={(value) => setFormData({ ...formData, mentionRattachement: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une mention" />
                </SelectTrigger>
                <SelectContent>
                  {safeMentions.map((mention) => (
                    <SelectItem 
                      key={mention.id_mention} 
                      value={mention.id_mention?.toString() || "default-value"}
                    >
                      {mention.nom_mention} ({mention.abbreviation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Description (Clé-Valeur)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDescriptionField}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {formData.description.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Clé (ex: Mission)"
                        value={item.cle}
                        onChange={(e) => {
                          const updated = [...formData.description];
                          updated[index] = { ...updated[index], cle: e.target.value };
                          setFormData({ ...formData, description: updated });
                        }}
                      />
                      <Input
                        placeholder="Valeur (ex: Recherche en IA)"
                        value={item.valeur}
                        onChange={(e) => {
                          const updated = [...formData.description];
                          updated[index] = { ...updated[index], valeur: e.target.value };
                          setFormData({ ...formData, description: updated });
                        }}
                      />
                    </div>
                    {formData.description.length > 2 && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeDescriptionField(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
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
    </div>
  )
}