"use client"

import { Routes, Route } from "react-router-dom"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { MentionManagement } from "@/components/mention-management"
import { ParcoursManagement } from "@/components/parcours-management"
import { NewsManagement } from "@/components/news-management"
import { LabManagement } from "@/components/lab-management"
import { PeopleManagement } from "@/components/people-management"
import { GlobalInfoManagement } from "@/components/global-info-management"
import { SpecialityManagement } from "./speciality-management"
import { UniversityProvider } from "@/contexts/speciality-context"

export function UniversityAdminApp() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isMobileOpen={isMobileSidebarOpen} onMobileToggle={setIsMobileSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMobileMenuToggle={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mentions" element={<MentionManagement />} />
            <Route path="/parcours" element={<ParcoursManagement />} />
            <Route path="/news" element={<NewsManagement />} />
            <Route path="/speciality" element={
              <UniversityProvider>
                <div className="p-6">
                  <SpecialityManagement />
                </div>
              </UniversityProvider>
              
              } />
            <Route path="/labs" element={<LabManagement />} />
            <Route path="/people" element={<PeopleManagement />} />
            <Route path="/global-info" element={<GlobalInfoManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
