"use client"

import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface AutoSaveIndicatorProps {
  status: "idle" | "saving" | "saved" | "error"
  className?: string
}

export function AutoSaveIndicator({ status, className = "" }: AutoSaveIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "saving":
        return {
          icon: Clock,
          text: "Auto-saving...",
          className: "text-blue-600",
        }
      case "saved":
        return {
          icon: CheckCircle,
          text: "Auto-saved",
          className: "text-green-600",
        }
      case "error":
        return {
          icon: AlertCircle,
          text: "Save failed",
          className: "text-red-600",
        }
      default:
        return null
    }
  }

  const config = getStatusConfig()

  if (!config) return null

  const Icon = config.icon

  return (
    <div className={`flex items-center gap-1 text-sm ${config.className} ${className}`}>
      <Icon className={`h-3 w-3 ${status === "saving" ? "animate-pulse" : ""}`} />
      <span>{config.text}</span>
    </div>
  )
}
