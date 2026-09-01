"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar, Loader2 } from "lucide-react"
import { useDashboard } from "@/hooks/use-dashboard"

export function Dashboard() {
  const { stats, recentActivities, upcomingEvents, loading } = useDashboard();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-university-primary" />
        <span className="ml-2 text-lg">Chargement des données...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenue dans votre système d'administration universitaire</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
          <p className="text-sm font-medium text-foreground">{new Date().toLocaleString('fr-FR')}</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activités Récentes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-university-primary flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activités Récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Aucune activité récente</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                          ? "bg-yellow-500"
                          : activity.status === "info"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Événements à Venir */}
        <Card>
          <CardHeader>
            <CardTitle className="text-university-primary flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Événements à Venir
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun événement à venir</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="p-3 rounded-lg border border-border">
                    <h4 className="text-sm font-medium text-foreground mb-1">{event.titre}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{event.dateCommencement?.toLocaleDateString('fr-FR')}</span>
                      {event.dateFin && (
                        <>
                          <span>•</span>
                          <span>{event.dateFin.toLocaleDateString('fr-FR')}</span>
                        </>
                      )}
                    </div>
                    {event.categorie && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {event.categorie}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}