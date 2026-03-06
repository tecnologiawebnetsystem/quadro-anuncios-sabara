import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "primary" | "accent"
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <Card className={cn(
      "border-border bg-card",
      variant === "primary" && "border-primary/30 bg-primary/5",
      variant === "accent" && "border-accent/30 bg-accent/5"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {description && (
              <span className="text-xs text-muted-foreground">{description}</span>
            )}
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}% em relacao ao mes anterior
              </span>
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
}
