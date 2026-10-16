"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChefHat, Menu } from "lucide-react"
import { useState } from "react"
import { navGroups, navItems } from "@/lib/nav-config"
import { cn } from "@/lib/utils"

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 py-5">
        <ChefHat className="h-6 w-6 text-sidebar-primary" />
        <div>
          <p className="text-sm font-semibold text-white">BachLong Restaurant</p>
          <p className="text-xs text-sidebar-foreground/70">ERP nhà hàng</p>
        </div>
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group}>
            <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/50">
              {group}
            </p>
            <div className="space-y-0.5">
              {navItems
                .filter((item) => item.group === group)
                .map((item) => {
                  const active = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const current = navItems.find((item) => pathname.startsWith(item.href))

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border md:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarContent />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="w-64">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:px-6">
          <button
            className="rounded-md p-2 hover:bg-muted md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Mở menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold">{current?.label ?? "BachLong Restaurant ERP"}</h1>
            {current?.description && (
              <p className="text-xs text-muted-foreground">{current.description}</p>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
