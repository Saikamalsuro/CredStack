"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Menu,
  Home as HomeIcon,
  CreditCard,
  GitCompare,
  LayoutDashboard,
  Sparkles,
  BarChart3,
  Trophy,
  ShieldCheck,
  Tag,
  Clock,
  ScrollText,
  Calculator,
  FileText,
  Phone,
  AlertOctagon,
  Coins,
  Smartphone,
  Landmark,
  GraduationCap,
  Plane,
  Heart,
  Bookmark,
  ClipboardList,
  Gift,
  Lock,
} from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarLink {
  href: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description?: string
}

const PRIMARY: SidebarLink[] = [
  { href: "/", name: "Home", icon: HomeIcon },
  { href: "/cards", name: "Cards", icon: CreditCard },
  { href: "/dashboard", name: "Dashboard", icon: LayoutDashboard, description: "Sign in required" },
  { href: "/dashboard/cards", name: "My Cards", icon: CreditCard, description: "Cards in your portfolio" },
  { href: "/dashboard/lounges", name: "Lounge Tracker", icon: Plane, description: "Visits vs annual quota" },
  { href: "/dashboard/health-score", name: "Health Score", icon: Heart, description: "Your card health 0-100" },
  { href: "/dashboard/wishlist", name: "Wishlist", icon: Bookmark, description: "Cards saved for later" },
  { href: "/dashboard/applications", name: "Applications", icon: ClipboardList, description: "Track in-flight applications" },
  { href: "/dashboard/referrals", name: "Referrals", icon: Gift, description: "Pending referral bonuses" },
  { href: "/dashboard/tax-export", name: "Tax Export", icon: FileText, description: "Annual ITR summary" },
  { href: "/dashboard/privacy", name: "Privacy & Data", icon: Lock, description: "Export or delete your data" },
]

const TOOLS: SidebarLink[] = [
  { href: "/compare", name: "Compare", icon: GitCompare, description: "Side-by-side card analysis" },
  { href: "/advisor", name: "AI Advisor", icon: Sparkles, description: "Personalized recommendations" },
  { href: "/analyzer", name: "Analyzer", icon: BarChart3, description: "Statement insights" },
  { href: "/optimizer", name: "Optimizer", icon: Trophy, description: "Best card per transaction" },
  { href: "/eligibility", name: "Eligibility", icon: ShieldCheck, description: "Pre-check qualification" },
]

const RESOURCES: SidebarLink[] = [
  { href: "/offers", name: "Offers", icon: Tag, description: "Live merchant offers" },
  { href: "/rewards/expiry", name: "Reward Expiry", icon: Clock, description: "Track expiring rewards" },
  { href: "/methodology", name: "Methodology", icon: ScrollText, description: "How we score cards" },
]

const CALCULATORS: SidebarLink[] = [
  { href: "/tools/interest-calculator", name: "Interest Calculator", icon: Calculator, description: "Carry-balance simulator" },
  { href: "/tools/emi-calculator", name: "EMI Calculator", icon: Calculator, description: "No-cost vs interest EMI" },
  { href: "/tools/points-converter", name: "Points Converter", icon: Coins, description: "Best reward redemption" },
]

const LEARN: SidebarLink[] = [
  { href: "/learn/first-credit-card", name: "First Card Guide", icon: GraduationCap, description: "Beginner playbook" },
]

const SAFETY: SidebarLink[] = [
  { href: "/apply/documents", name: "Documents Required", icon: FileText, description: "KYC checklist by profile" },
  { href: "/safety/helplines", name: "Helplines", icon: Phone, description: "Bank customer support" },
  { href: "/safety/fraud-guide", name: "Fraud Response", icon: AlertOctagon, description: "What to do if compromised" },
  { href: "/safety/virtual-cards", name: "Virtual Cards", icon: Smartphone, description: "Tokenization support per bank" },
  { href: "/safety/rbi-updates", name: "RBI Updates", icon: Landmark, description: "Regulatory changes that affect you" },
]

function Section({
  title,
  links,
  pathname,
  onClose,
}: {
  title: string
  links: SidebarLink[]
  pathname: string
  onClose: () => void
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      {links.map((l) => {
        const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href))
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onClose}
            className={cn(
              "flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            <l.icon className="h-4 w-4 mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium leading-tight">{l.name}</p>
              {l.description && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{l.description}</p>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export function AppSidebar() {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-6 overflow-y-auto">
        <SheetHeader className="text-left mb-6 p-0">
          <SheetTitle className="font-display text-xl">CredStack</SheetTitle>
          <SheetDescription>All features at a glance</SheetDescription>
        </SheetHeader>
        <nav className="space-y-6">
          <Section title="Main" links={PRIMARY} pathname={pathname} onClose={close} />
          <Section title="Tools" links={TOOLS} pathname={pathname} onClose={close} />
          <Section title="Calculators" links={CALCULATORS} pathname={pathname} onClose={close} />
          <Section title="Learn" links={LEARN} pathname={pathname} onClose={close} />
          <Section title="Resources" links={RESOURCES} pathname={pathname} onClose={close} />
          <Section title="Safety" links={SAFETY} pathname={pathname} onClose={close} />
        </nav>
      </SheetContent>
    </Sheet>
  )
}
