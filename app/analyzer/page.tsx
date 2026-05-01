"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  BarChart3, 
  Upload, 
  FileText, 
  Check, 
  AlertTriangle,
  TrendingUp,
  Shield,
  Percent,
  CreditCard,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

// Mock analysis results
const mockAnalysis = {
  overallScore: 78,
  spendingEfficiency: 82,
  rewardsOptimization: 65,
  riskScore: 15,
  monthlySpend: 85000,
  monthlyRewards: 2125,
  potentialSavings: 850,
  insights: [
    {
      type: "optimization",
      title: "Switch shopping spend to your Amazon card",
      description: "You could earn 3% more cashback by using your Amazon Pay card for online shopping instead of HDFC Millennia.",
      impact: "+₹450/month",
      priority: "high"
    },
    {
      type: "optimization",
      title: "Maximize travel rewards",
      description: "Your Axis Magnus earns 12x points on travel. Book flights directly through airline websites to maximize rewards.",
      impact: "+₹200/month",
      priority: "medium"
    },
    {
      type: "warning",
      title: "Underutilized lounge benefits",
      description: "You have 16 unused lounge visits this quarter. Consider using them before they expire.",
      impact: "₹8,000 value",
      priority: "medium"
    },
    {
      type: "optimization",
      title: "Fuel surcharge savings",
      description: "Use your HDFC card for fuel purchases to save on surcharge fees.",
      impact: "+₹150/month",
      priority: "low"
    }
  ],
  categoryBreakdown: [
    { category: "Shopping", spend: 32000, rewards: 960, card: "Amazon Pay ICICI", efficiency: 92 },
    { category: "Travel", spend: 18000, rewards: 540, card: "Axis Magnus", efficiency: 85 },
    { category: "Dining", spend: 15000, rewards: 300, card: "HDFC Millennia", efficiency: 70 },
    { category: "Fuel", spend: 8000, rewards: 160, card: "HDFC Millennia", efficiency: 75 },
    { category: "Bills", spend: 12000, rewards: 120, card: "Various", efficiency: 45 },
  ],
  riskFactors: [
    { factor: "Credit Utilization", status: "good", value: "23%", description: "Below 30% is ideal" },
    { factor: "Payment History", status: "excellent", value: "100%", description: "Always paid on time" },
    { factor: "Number of Cards", status: "good", value: "4 cards", description: "Manageable number" },
    { factor: "Total Credit Limit", status: "good", value: "₹12L", description: "Healthy limit" },
  ]
}

export default function AnalyzerPage() {
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    setIsLoading(false)
    setIsAnalyzed(true)
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
        {!isAnalyzed ? (
          // Upload section
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
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium text-foreground">
                    Drop your statement here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse (PDF, CSV supported)
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button 
                  onClick={handleAnalyze} 
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
          // Analysis results
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Score cards */}
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
                          stroke="hsl(var(--muted))"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="hsl(var(--primary))"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${mockAnalysis.overallScore * 2.51} 251`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-foreground">{mockAnalysis.overallScore}</span>
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
                      <p className="text-2xl font-bold text-foreground">₹{mockAnalysis.monthlyRewards.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Monthly Rewards</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      +₹{mockAnalysis.potentialSavings}
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
                      <p className="text-2xl font-bold text-foreground">{mockAnalysis.rewardsOptimization}%</p>
                      <p className="text-sm text-muted-foreground">Rewards Efficiency</p>
                    </div>
                  </div>
                  <Progress value={mockAnalysis.rewardsOptimization} className="h-2" />
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
                  <Progress value={100 - mockAnalysis.riskScore} className="h-2" />
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
                {mockAnalysis.insights.map((insight, index) => (
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
                      {mockAnalysis.categoryBreakdown.map((cat, index) => (
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
                      {mockAnalysis.riskFactors.map((factor, index) => (
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => setIsAnalyzed(false)}>
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
