"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Users, Settings, HelpCircle } from "lucide-react"
import Link from "next/link"

interface QuickCard {
  id: string
  title: string
  icon: React.ElementType
  href: string
  color: "primary" | "accent" | "default"
}

const quickCards: QuickCard[] = [
  {
    id: "1",
    title: "Card 1",
    icon: FileText,
    href: "#",
    color: "primary",
  },
  {
    id: "2",
    title: "Card 2",
    icon: Calendar,
    href: "#",
    color: "accent",
  },
  {
    id: "3",
    title: "Card 3",
    icon: Users,
    href: "#",
    color: "default",
  },
  {
    id: "4",
    title: "Card 4",
    icon: Settings,
    href: "#",
    color: "primary",
  },
  {
    id: "5",
    title: "Card 5",
    icon: HelpCircle,
    href: "#",
    color: "accent",
  },
]

const colorStyles = {
  primary: "border-primary/30 hover:border-primary/60 hover:bg-primary/10",
  accent: "border-accent/30 hover:border-accent/60 hover:bg-accent/10",
  default: "border-border hover:border-muted-foreground/40 hover:bg-secondary/50",
}

const iconColors = {
  primary: "text-primary",
  accent: "text-accent",
  default: "text-muted-foreground",
}

export function QuickAccessCards() {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Acesso Rápido</h2>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {quickCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.id} href={card.href}>
              <Card
                className={`cursor-pointer border bg-card transition-all duration-200 ${colorStyles[card.color]}`}
              >
                <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
                  <Icon className={`h-8 w-8 ${iconColors[card.color]}`} />
                  <span className="text-sm font-medium text-foreground text-center">
                    {card.title}
                  </span>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
