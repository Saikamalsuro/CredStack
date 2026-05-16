"use client"

import { motion } from "framer-motion"
import { 
  CreditCard, 
  TrendingUp, 
  Gift, 
  Plane, 
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  MoreHorizontal,
  IndianRupee
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, History, AlertCircle } from "lucide-react"
import type { CardChangeRow } from "@/lib/db/card-changelog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CreditCardVisual } from "@/components/cards/credit-card-visual"
import type { CreditCard as CreditCardType } from "@/lib/data/cards"
import Link from "next/link"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from "recharts"

export interface DashboardSpendingPoint {
  month: string
  spending: number
  rewards: number
}

export interface DashboardCategoryShare {
  name: string
  value: number
  color: string
}

export interface DashboardTransaction {
  id: string | number
  merchant: string
  category: string
  amount: number
  date: string
  cardName: string
}

export interface DashboardUpcomingPayment {
  cardName: string
  dueDate: string
  amount: number
  minDue: number
}

export interface DashboardStatTotals {
  totalSpending: number
  totalRewards: number
  activeCards: number
  loungeVisits: number
}

interface DashboardClientProps {
  userCards: CreditCardType[]
  spendingData: DashboardSpendingPoint[]
  categorySpending: DashboardCategoryShare[]
  recentTransactions: DashboardTransaction[]
  upcomingPayments: DashboardUpcomingPayment[]
  recentChanges?: CardChangeRow[]
  totals: DashboardStatTotals
}

export function DashboardClient({
  userCards,
  spendingData,
  categorySpending,
  recentTransactions,
  upcomingPayments,
  recentChanges = [],
  totals,
}: DashboardClientProps) {
  const stats = [
    {
      title: "Total Spending",
      value: `₹${totals.totalSpending.toLocaleString()}`,
      change: "",
      trend: "neutral" as const,
      icon: IndianRupee,
      color: "text-primary",
    },
    {
      title: "Total Rewards",
      value: `₹${totals.totalRewards.toLocaleString()}`,
      change: "",
      trend: "neutral" as const,
      icon: Gift,
      color: "text-success",
    },
    {
      title: "Active Cards",
      value: String(totals.activeCards),
      change: "",
      trend: "neutral" as const,
      icon: CreditCard,
      color: "text-accent",
    },
    {
      title: "Lounge Visits",
      value: String(totals.loungeVisits),
      change: "",
      trend: "neutral" as const,
      icon: Plane,
      color: "text-primary",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Dashboard
              </h1>
              <p className="mt-1 text-muted-foreground">
                Track your cards, spending, and rewards
              </p>
            </div>
            <Button asChild>
              <Link href="/cards">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Card
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-primary/10`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    {stat.trend !== "neutral" && (
                      <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="gap-1">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3" />
                        )}
                        {stat.change}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-4 text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Spending chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Spending Overview</CardTitle>
                  <CardDescription>Your monthly spending and rewards earned</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={spendingData}>
                        <defs>
                          <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="rewardsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `₹${value / 1000}k`} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                          formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="spending" 
                          stroke="hsl(var(--primary))" 
                          fillOpacity={1} 
                          fill="url(#spendingGradient)" 
                          name="Spending"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Category breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>How your spending is distributed</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categorySpending}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categorySpending.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: 'hsl(var(--card))', 
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value}%`, '']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      {categorySpending.map((category) => (
                        <div key={category.name} className="flex items-center gap-3">
                          <div 
                            className="w-3 h-3 rounded-full shrink-0" 
                            style={{ backgroundColor: category.color }} 
                          />
                          <span className="flex-1 text-sm text-foreground">{category.name}</span>
                          <span className="font-medium text-foreground">{category.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your latest card activity</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {transaction.merchant.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{transaction.merchant}</p>
                            <p className="text-xs text-muted-foreground">
                              {transaction.cardName} • {transaction.date}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            -₹{transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">{transaction.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* My Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>My Cards</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/cards">Manage</Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userCards.map((card) => (
                    <div key={card.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <div className={`w-16 h-10 rounded bg-gradient-to-br ${card.cardColor} shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{card.name}</p>
                        <p className="text-xs text-muted-foreground">{card.issuer}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/cards/${card.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Set as Primary</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Payments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Payments</CardTitle>
                  <CardDescription>Due dates for your cards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingPayments.map((payment) => (
                    <div key={payment.cardName} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-foreground">{payment.cardName}</span>
                        <Badge variant="outline">{payment.dueDate}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Due</span>
                        <span className="font-semibold text-foreground">₹{payment.amount.toLocaleString()}</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/compare">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-xs">Compare</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/advisor">
                      <Gift className="h-5 w-5" />
                      <span className="text-xs">AI Advisor</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/analyzer">
                      <CreditCard className="h-5 w-5" />
                      <span className="text-xs">Analyzer</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/cards">
                      <PlusCircle className="h-5 w-5" />
                      <span className="text-xs">Add Card</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/dashboard/tax-export">
                      <FileText className="h-5 w-5" />
                      <span className="text-xs">Tax Export</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/dashboard/cards">
                      <CreditCard className="h-5 w-5" />
                      <span className="text-xs">My Cards</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
                    <Link href="/dashboard/lounges">
                      <Plane className="h-5 w-5" />
                      <span className="text-xs">Lounges</span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {recentChanges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="bg-amber-500/5 border-amber-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Changes on your cards
                    </CardTitle>
                    <CardDescription>Recent issuer announcements affecting cards in your portfolio</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {recentChanges.map((c, i) => (
                      <Link
                        key={`${c.cardSlug}-${c.date}-${i}`}
                        href={`/cards/${c.cardSlug}/changes`}
                        className="block p-3 rounded-md border hover:bg-muted/40 transition-colors"
                      >
                        <p className="font-medium text-foreground truncate">{c.summary}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.cardName} • {new Date(c.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </Link>
                    ))}
                    <Button asChild variant="ghost" size="sm" className="w-full">
                      <Link href="/dashboard/cards">
                        <History className="h-3 w-3 mr-2" />
                        Manage portfolio
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
