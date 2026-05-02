import { NextResponse } from 'next/server'

const demo = {
  overallScore: 78,
  spendingEfficiency: 82,
  rewardsOptimization: 65,
  riskScore: 15,
  monthlySpend: 85000,
  monthlyRewards: 2125,
  potentialSavings: 850,
  insights: [
    {
      type: 'optimization',
      title: 'Switch shopping spend to your Amazon card',
      description: 'You could earn 3% more cashback by using your Amazon Pay card for online shopping instead of HDFC Millennia.',
      impact: '+₹450/month',
      priority: 'high',
    },
    {
      type: 'optimization',
      title: 'Maximize travel rewards',
      description: 'Your Axis Magnus earns 12x points on travel. Book flights directly through airline websites to maximize rewards.',
      impact: '+₹200/month',
      priority: 'medium',
    },
    {
      type: 'warning',
      title: 'Underutilized lounge benefits',
      description: 'You have 16 unused lounge visits this quarter. Consider using them before they expire.',
      impact: '₹8,000 value',
      priority: 'medium',
    },
    {
      type: 'optimization',
      title: 'Fuel surcharge savings',
      description: 'Use your HDFC card for fuel purchases to save on surcharge fees.',
      impact: '+₹150/month',
      priority: 'low',
    },
  ],
  categoryBreakdown: [
    { category: 'Shopping', spend: 32000, rewards: 960, card: 'Amazon Pay ICICI', efficiency: 92 },
    { category: 'Travel', spend: 18000, rewards: 540, card: 'Axis Magnus', efficiency: 85 },
    { category: 'Dining', spend: 15000, rewards: 300, card: 'HDFC Millennia', efficiency: 70 },
    { category: 'Fuel', spend: 8000, rewards: 160, card: 'HDFC Millennia', efficiency: 75 },
    { category: 'Bills', spend: 12000, rewards: 120, card: 'Various', efficiency: 45 },
  ],
  riskFactors: [
    { factor: 'Credit Utilization', status: 'good', value: '23%', description: 'Below 30% is ideal' },
    { factor: 'Payment History', status: 'excellent', value: '100%', description: 'Always paid on time' },
    { factor: 'Number of Cards', status: 'good', value: '4 cards', description: 'Manageable number' },
    { factor: 'Total Credit Limit', status: 'good', value: '₹12L', description: 'Healthy limit' },
  ],
}

export async function GET() {
  return NextResponse.json({ status: 'ready', ...demo })
}
