import { LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

export interface StatItem {
  title: string
  value: string
  icon: ForwardRefExoticComponent<LucideProps & RefAttributes<SVGSVGElement>>
  color: string
  change?: string
}

export interface StatDb {
  title: string;       
  value: string;       
  change?: string;      
}