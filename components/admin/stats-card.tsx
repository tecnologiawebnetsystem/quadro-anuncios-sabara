"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  href?: string
  badge?: {
    label: string
    value: string | number
  }
  variant?: "default" | "primary" | "accent"
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  href,
  badge,
  variant = "default",
}: StatsCardProps) {
  const cardContent = (
    <Card className={cn(
      "border-border bg-card transition-all duration-200 h-full",
      href && "cursor-pointer hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10",
      variant === "primary" && "border-primary/30 bg-primary/5",
      variant === "accent" && "border-accent/30 bg-accent/5"
    )}>
      <CardContent className="p-6 h-full">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {title}
              </span>
              {badge && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {badge.label}: {badge.value}
                </Badge>
              )}
            </div>
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              variant === "default" && "bg-secondary",
              variant === "primary" && "bg-primary",
              variant === "accent" && "bg-accent"
            )}
          >
            <Icon
              className={cn(
                "h-6 w-6",
                variant === "default" && "text-foreground",
                variant === "primary" && "text-primary-foreground",
                variant === "accent" && "text-accent-foreground"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    )
  }

  return <div className="block h-full">{cardContent}</div>
}
