import { useState, useEffect } from "react"
import { StatItem } from "@/services/types/stat"
import { Actualite } from "@/services/types/event"
import { BookOpen, FlaskConical, GraduationCap, Newspaper, TrendingUp, Users } from "lucide-react"
import { ActivityItem } from "@/services/types/activity"
import { useActivity } from "@/context/activity-context"
import { getStatistics } from "@/services/api/stat.api"
import { getActualites, getClosestEvent } from "@/services/api/event.api"

export const statConfig: Record<string, { icon: any; color: string }> = {
  Mentions: { icon: GraduationCap, color: "text-university-primary" },
  Parcours: { icon: BookOpen, color: "text-university-secondary" },
  Actualités: { icon: Newspaper, color: "text-blue-600" },
  Laboratoires: { icon: FlaskConical, color: "text-green-600" },
  Personnes: { icon: Users, color: "text-purple-600" },
  Activité: { icon: TrendingUp, color: "text-orange-600" },
}

export function useDashboard() {
  const [stats, setStats] = useState<StatItem[]>([])
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Actualite[]>([])
  const [loading, setLoading] = useState(true)
  const { getRecentActivity } = useActivity()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Récupérer les statistiques
        const statistics = await getStatistics()
        const statsMapped: StatItem[] = statistics.map((stat) => ({
          ...stat,
          ...statConfig[stat.title],
        }))
        setStats(statsMapped)

        // Récupérer les activités récentes depuis le contexte
        setRecentActivities(getRecentActivity(5))

        // Récupérer les événements à venir
        const events = await getClosestEvent()
        setUpcomingEvents(events)

      } catch (error) {
        console.error("Erreur dans useDashboard:", error)
        
        // Données de fallback en cas d'erreur
        setStats([
          { title: "Mentions", value: 0, change: "+0%", ...statConfig.Mentions },
          { title: "Parcours", value: 0, change: "+0%", ...statConfig.Parcours },
          { title: "Actualités", value: 0, change: "+0%", ...statConfig.Actualités },
          { title: "Laboratoires", value: 0, change: "+0%", ...statConfig.Laboratoires },
          { title: "Personnes", value: 0, change: "+0%", ...statConfig.Personnes },
        ])
        setUpcomingEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [getRecentActivity])

  return { 
    stats, 
    recentActivities, 
    upcomingEvents, 
    loading 
  }
}