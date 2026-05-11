"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  Upload,
  FileText,
  AlertTriangle,
  TrendingUp,
  Shield,
  Percent,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

interface InsightItem {
  type: "optimization" | "warning"
  title: string
  description: string
  impact: string
  priority: "high" | "medium" | "low"
}

interface CategoryBreakdownItem {
  category: string
  spend: number
  rewards: number
  card: string
  efficiency: number
}

interface RiskFactor {
  factor: string
  status: string
  value: string
  description: string
}

interface AnalysisShape {
  overallScore: number
  spendingEfficiency: number
  rewardsOptimization: number
  riskScore: number
  monthlySpend: number
  monthlyRewards: number
  potentialSavings: number
  insights: InsightItem[]
  categoryBreakdown: CategoryBreakdownItem[]
  riskFactors: RiskFactor[]
}

const POLL_INTERVAL = 4000
const MAX_POLLS = 45 // ~3 minutes

export default function AnalyzerPage() {
  const [analysis, setAnalysis] = useState<AnalysisShape | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusLabel, setStatusLabel] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDemo = async () => {
    setIsLoading(true)
    setError(null)
    setStatusLabel("Loading demo data...")
    try {
      const res = await fetch("/api/analyzer/demo")
      if (!res.ok) throw new Error("Demo unavailable")
      const data = (await res.json()) as AnalysisShape
      setAnalysis(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (file: File) => {
    setIsLoading(true)
    setError(null)
    setStatusLabel("Uploading statement...")
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/analyzer/upload", { method: "POST", body: formData })
      if (res.status === 401) {
        setError("Sign in to upload your statement, or use Demo Data instead.")
        setIsLoading(false)
        return
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? "Upload failed")
      }
      const { runId } = (await res.json()) as { runId: string }
      setStatusLabel("Parsing PDF...")
      await pollStatus(runId)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setIsLoading(false)
    }
  }

  const pollStatus = async (runId: string) => {
    for (let i = 0; i < MAX_POLLS; i++) {
      const res = await fetch(`/api/analyzer/status?runId=${runId}`)
      if (!res.ok) {
        setError("Status check failed")
        setIsLoading(false)
        return
      }
      const body = await res.json()
      if (body.status === "ready") {
        setAnalysis(body as AnalysisShape)
        setIsLoading(false)
        return
      }
      if (body.status === "failed") {
        setError("Statement parsing failed")
        setIsLoading(false)
        return
      }
      const labels: Record<string, string> = {
        queued: "Queued for processing...",
        parsing: "Extracting text from PDF...",
        classifying: "Classifying transactions...",
      }
      setStatusLabel(labels[body.status] ?? "Working...")
      await new Promise((r) => setTimeout(r, POLL_INTERVAL))
    }
    setError("Timed out waiting for results")
    setIsLoading(false)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const triggerFile = () => fileInputRef.current?.click()

  const reset = () => {
    setAnalysis(null)
    setError(null)
    setIsLoading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <BarChart3 className="h-3 w-3 mr-1" />
              Spend Analyzer
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Analyze Your Spending
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
              Get detailed insights into your credit card usage, optimize rewards,
              and discover ways to maximize your benefits.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {!analysis ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Upload Your Statement</CardTitle>
                <CardDescription>
                  Upload your credit card statement or connect your account for analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={onFileChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={triggerFile}
                  disabled={isLoading}
                  className="w-full border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium text-foreground">
                    Drop your statement here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse (PDF up to 10 MB)
                  </p>
                </button>

                {error && (
                  <div className="text-sm bg-destructive/10 text-destructive rounded-md p-3 border border-destructive/20">
                    {error}
                  </div>
                )}

                {isLoading && statusLabel && (
                  <div className="text-sm bg-muted/50 text-muted-foreground rounded-md p-3 border border-border text-center">
                    {statusLabel}
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  onClick={handleDemo}
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Use Demo Data
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Try out the analyzer with sample data to see how it works
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="var(--muted)"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="var(--primary)"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${analysis.overallScore * 2.51} 251`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-foreground">{analysis.overallScore}</span>
                      </div>
                    </div>
                    <p className="font-medium text-foreground">Overall Score</p>
                    <p className="text-sm text-muted-foreground">Good</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">₹{analysis.monthlyRewards.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Monthly Rewards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      +₹{analysis.potentialSavings}
                    </Badge>
                    <span className="text-muted-foreground">potential savings</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Percent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{analysis.rewardsOptimization}%</p>
                      <p className="text-sm text-muted-foreground">Rewards Efficiency</p>
                    </div>
                  </div>
                  <Progress value={analysis.rewardsOptimization} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Shield className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">Low</p>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                    </div>
                  </div>
                  <Progress value={100 - analysis.riskScore} className="h-2" />
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="insights" className="space-y-6">
              <TabsList>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="breakdown">Spending Breakdown</TabsTrigger>
                <TabsTrigger value="health">Card Health</TabsTrigger>
              </TabsList>

              <TabsContent value="insights" className="space-y-4">
                {analysis.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-2 rounded-lg shrink-0 ${
                            insight.type === "warning"
                              ? "bg-warning/10"
                              : "bg-success/10"
                          }`}>
                            {insight.type === "warning" ? (
                              <AlertTriangle className="h-5 w-5 text-warning" />
                            ) : (
                              <TrendingUp className="h-5 w-5 text-success" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{insight.title}</h3>
                              <Badge variant={
                                insight.priority === "high" ? "default" :
                                insight.priority === "medium" ? "secondary" : "outline"
                              }>
                                {insight.priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-semibold text-success">{insight.impact}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="breakdown">
                <Card>
                  <CardHeader>
                    <CardTitle>Spending by Category</CardTitle>
                    <CardDescription>How you are spending across different categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {analysis.categoryBreakdown.map((cat, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-foreground">{cat.category}</span>
                              <Badge variant="outline" className="text-xs">{cat.card}</Badge>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">₹{cat.spend.toLocaleString()}</p>
                              <p className="text-xs text-success">+₹{cat.rewards} rewards</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={cat.efficiency} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground w-12">{cat.efficiency}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="health">
                <Card>
                  <CardHeader>
                    <CardTitle>Credit Card Health Check</CardTitle>
                    <CardDescription>Key factors affecting your credit health</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {analysis.riskFactors.map((factor, index) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">{factor.factor}</span>
                            <Badge variant={
                              factor.status === "excellent" ? "default" :
                              factor.status === "good" ? "secondary" : "destructive"
                            }>
                              {factor.status}
                            </Badge>
                          </div>
                          <p className="text-2xl font-bold text-foreground">{factor.value}</p>
                          <p className="text-sm text-muted-foreground mt-1">{factor.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={reset}>
                Analyze Another Statement
              </Button>
              <Button asChild>
                <Link href="/advisor">
                  Get Card Recommendations
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
