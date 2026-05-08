import React from 'react'
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-700 group-[.toaster]:border-slate-100 group-[.toaster]:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-[.toaster]:rounded-[16px] group-[.toaster]:font-sans",
          description: "group-[.toast]:text-slate-500 text-[11px]",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 rounded-lg font-bold",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 rounded-lg",
          success: "group-[.toaster]:bg-emerald-50 group-[.toaster]:border-emerald-100 group-[.toaster]:text-emerald-700",
          error: "group-[.toaster]:bg-rose-50 group-[.toaster]:border-rose-100 group-[.toaster]:text-rose-700",
          warning: "group-[.toaster]:bg-amber-50 group-[.toaster]:border-amber-100 group-[.toaster]:text-amber-700",
          info: "group-[.toaster]:bg-blue-50 group-[.toaster]:border-blue-100 group-[.toaster]:text-blue-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
