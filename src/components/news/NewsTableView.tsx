import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit } from "lucide-react"
import { Actualite } from "@/services/types/event"
import { DeleteNewsDialog } from "./DeleteNewsDialog"

interface NewsTableViewProps {
  news: Actualite[]
  onEdit: (news: Actualite) => void
  onDelete: (id: number) => void
  getStatusBadge: (status: "draft" | "published" | "archived") => React.ReactNode
}

export function NewsTableView({ news, onEdit, onDelete, getStatusBadge }: NewsTableViewProps) {
  return (
    <div className="hidden lg:block rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-center">Lieu</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="hidden xl:flex items-center">Médias</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {news.map((n) => (
            <TableRow key={n.idActualite}>
              <TableCell>
                <div>
                  <div className="font-medium">{n.titre}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">{n.description}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{n.dateCommencement ? new Date(n.dateCommencement).toLocaleDateString("fr-FR") : "-"}</div>
                  {n.dateFin && (
                    <div className="text-muted-foreground">→ {new Date(n.dateFin).toLocaleDateString("fr-FR")}</div>
                  )}
                </div>
              </TableCell>
              <TableCell>{n.lieu || "-"}</TableCell>
              <TableCell>{getStatusBadge(n.statut as "draft" | "published" | "archived")}</TableCell>
              <TableCell>
                <Badge variant="outline">{n.medias.length}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(n)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <DeleteNewsDialog newsTitle={n.titre} onConfirm={() => onDelete(n.idActualite!)} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}