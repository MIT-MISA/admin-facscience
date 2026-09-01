"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Globe, Mail, MapPin, Clock, Users } from "lucide-react"

interface GlobalInfo {
  id: string
  category: string
  key: string
  value: string
  description?: string
  isActive: boolean
  lastUpdated: string
}

const mockGlobalInfo: GlobalInfo[] = [
  {
    id: "1",
    category: "Contact",
    key: "email_principal",
    value: "contact@universite.edu",
    description: "Email principal de l'université",
    isActive: true,
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    category: "Contact",
    key: "telephone",
    value: "+33 1 23 45 67 89",
    description: "Numéro de téléphone principal",
    isActive: true,
    lastUpdated: "2024-01-10",
  },
  {
    id: "3",
    category: "Adresse",
    key: "adresse_complete",
    value: "123 Avenue de l'Université, 75001 Paris, France",
    description: "Adresse complète de l'université",
    isActive: true,
    lastUpdated: "2024-01-05",
  },
  {
    id: "4",
    category: "Horaires",
    key: "horaires_ouverture",
    value: "Lundi-Vendredi: 8h00-18h00, Samedi: 9h00-12h00",
    description: "Horaires d'ouverture des services",
    isActive: true,
    lastUpdated: "2024-01-12",
  },
  {
    id: "5",
    category: "Social",
    key: "site_web",
    value: "https://www.universite.edu",
    description: "Site web officiel",
    isActive: true,
    lastUpdated: "2024-01-08",
  },
  {
    id: "6",
    category: "Statistiques",
    key: "nombre_etudiants",
    value: "15000",
    description: "Nombre total d'étudiants",
    isActive: true,
    lastUpdated: "2024-01-20",
  },
]

const categories = ["Contact", "Adresse", "Horaires", "Social", "Statistiques", "Général"]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Contact":
      return <Mail className="h-4 w-4" />
    case "Adresse":
      return <MapPin className="h-4 w-4" />
    case "Horaires":
      return <Clock className="h-4 w-4" />
    case "Social":
      return <Globe className="h-4 w-4" />
    case "Statistiques":
      return <Users className="h-4 w-4" />
    default:
      return <Globe className="h-4 w-4" />
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Contact":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "Adresse":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "Horaires":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "Social":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    case "Statistiques":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
  }
}

export function GlobalInfoManagement() {
  const [globalInfos, setGlobalInfos] = useState<GlobalInfo[]>(mockGlobalInfo)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingInfo, setEditingInfo] = useState<GlobalInfo | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    key: "",
    value: "",
    description: "",
    isActive: true,
  })

  const filteredInfos = globalInfos.filter((info) => {
    const matchesSearch =
      info.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      info.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || info.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingInfo) {
      setGlobalInfos((prev) =>
        prev.map((info) =>
          info.id === editingInfo.id
            ? { ...info, ...formData, lastUpdated: new Date().toISOString().split("T")[0] }
            : info,
        ),
      )
    } else {
      const newInfo: GlobalInfo = {
        id: Date.now().toString(),
        ...formData,
        lastUpdated: new Date().toISOString().split("T")[0],
      }
      setGlobalInfos((prev) => [...prev, newInfo])
    }

    // Reset form
    setFormData({
      category: "",
      key: "",
      value: "",
      description: "",
      isActive: true,
    })
    setEditingInfo(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (info: GlobalInfo) => {
    setEditingInfo(info)
    setFormData({
      category: info.category,
      key: info.key,
      value: info.value,
      description: info.description || "",
      isActive: info.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setGlobalInfos((prev) => prev.filter((info) => info.id !== id))
  }

  const toggleStatus = (id: string) => {
    setGlobalInfos((prev) => prev.map((info) => (info.id === id ? { ...info, isActive: !info.isActive } : info)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Informations Globales</h1>
        <p className="text-muted-foreground">Gérer les informations générales du site universitaire</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher une information..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingInfo(null)
                setFormData({
                  category: "",
                  key: "",
                  value: "",
                  description: "",
                  isActive: true,
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une information
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingInfo ? "Modifier l'information" : "Ajouter une information"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="key">Clé</Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => setFormData((prev) => ({ ...prev, key: e.target.value }))}
                  placeholder="ex: email_principal"
                  required
                />
              </div>
              <div>
                <Label htmlFor="value">Valeur</Label>
                <Textarea
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                  placeholder="Valeur de l'information"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optionnel)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de l'information"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">{editingInfo ? "Modifier" : "Ajouter"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInfos.map((info) => (
          <Card key={info.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(info.category)}
                  <Badge className={getCategoryColor(info.category)}>{info.category}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatus(info.id)}
                    className={info.isActive ? "text-green-600" : "text-red-600"}
                  >
                    {info.isActive ? "Actif" : "Inactif"}
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{info.key}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Valeur:</p>
                  <p className="text-sm break-words">{info.value}</p>
                </div>
                {info.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Description:</p>
                    <p className="text-xs text-muted-foreground">{info.description}</p>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Modifié: {info.lastUpdated}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(info)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(info.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInfos.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune information trouvée</p>
        </div>
      )}
    </div>
  )
}
