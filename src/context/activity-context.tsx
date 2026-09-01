// src/contexts/ActivityContext.tsx
import { createContext, useContext, useState, ReactNode } from "react"
import { ActivityItem } from "@/services/types/activity"
import { recentActivities } from "@/services/mocked-data"
 
interface ActivityContextType {
  activities: ActivityItem[]
  addActivity: (activity: ActivityItem) => void
  getRecentActivity: (count?: number) => ActivityItem[]
}

export const ActivityContext = createContext<ActivityContextType | undefined>(undefined)

export const ActivityProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<ActivityItem[]>(recentActivities)

  const addActivity = (activity: ActivityItem) => {
    setActivities((prev) => [...prev, activity])
  }

  const getRecentActivity = (count: number = 5) => {
    return activities.slice(-count)
  }

  return (
    <ActivityContext.Provider value={{ activities, addActivity, getRecentActivity }}>
      {children}
    </ActivityContext.Provider>
  )
}

export const useActivity = () => {
  const context = useContext(ActivityContext)
  if (!context) throw new Error("useActivity must be used within an ActivityProvider")
  return context
}
