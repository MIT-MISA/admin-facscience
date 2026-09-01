import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { LayoutDashboard, GraduationCap, BookOpen, Newspaper, FlaskConical, Users, Settings, Layers, LogOut } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/auth-context"

interface SidebarProps {
  isMobileOpen?: boolean
  onMobileToggle?: (open: boolean) => void
}

const navigationItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/mentions", label: "Gestion Mentions", icon: GraduationCap },
  { path: "/parcours", label: "Gestion Parcours", icon: BookOpen },
  { path: "/news", label: "Actualités", icon: Newspaper },
  { path: "/speciality", label: "Spécialités", icon: Layers },
  { path: "/labs", label: "Laboratoires", icon: FlaskConical },
  { path: "/people", label: "Personnes", icon: Users },
  { path: "/global-info", label: "Infos Globales", icon: Settings },
]

function SidebarContent({ onNavigate }: { onNavigate: (path: string) => void }) {
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    onNavigate('/login')
  }

  return (
    <>
      <div className="p-4 md:p-6 border-b border-border">
        <h1 className="text-lg md:text-xl font-bold text-university-primary truncate">
          Admin Universitaire
        </h1>
        {user && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate mt-1">
            {user.identifiant} • {user.role}
          </p>
        )}
      </div>

      <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path || (location.pathname === "/" && item.path === "/dashboard")

          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 md:gap-3 h-10 md:h-11 text-sm md:text-base",
                isActive && "bg-university-primary text-white hover:bg-university-primary/90",
              )}
              onClick={() => onNavigate(item.path)}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          )
        })}
        
        {/* Bouton de déconnexion */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 md:gap-3 h-10 md:h-11 text-sm md:text-base text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Déconnexion</span>
        </Button>
      </nav>
    </>
  )
}

export function Sidebar({ isMobileOpen, onMobileToggle }: SidebarProps) {
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
    onMobileToggle?.(false)
  }

  return (
    <>
      <div className="hidden md:flex w-64 bg-card border-r border-border flex-col">
        <SidebarContent onNavigate={handleNavigate} />
      </div>

      <Sheet open={isMobileOpen} onOpenChange={onMobileToggle}>
        <SheetContent side="left" className="w-64 p-0 bg-card">
          <div className="flex flex-col h-full">
            <SidebarContent onNavigate={handleNavigate} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}