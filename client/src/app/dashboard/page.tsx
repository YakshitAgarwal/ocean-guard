"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount } from "wagmi"
import { ArrowLeft, AreaChart, BarChart, Download, Filter, Globe, Search, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchDashboardData } from "@/lib/actions"
import { OceanHealthChart } from "@/components/charts/ocean-health-chart"
import { PlasticReductionChart } from "@/components/charts/plastic-reduction-chart"
import { CarbonCreditsChart } from "@/components/charts/carbon-credits-chart"
import { TemperatureAnomaliesChart } from "@/components/charts/temperature-anomalies-chart"
import { ConservationHotspotsChart } from "@/components/charts/conservation-hotspots-chart"
import { CoralReefHealthChart } from "@/components/charts/coral-reef-health-chart"
import { CoralHealthPredictionChart } from "@/components/charts/coral-health-prediction-chart"
import { PlasticAccumulationChart } from "@/components/charts/plastic-accumulation-chart"
import { CarbonSequestrationChart } from "@/components/charts/carbon-sequestration-chart"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useTokenBalance, useConversionRates } from "@/lib/contract"

export default function DashboardPage() {
//   const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("1y")

  const tokenBalance = useTokenBalance(address)
  const conversionRates = useConversionRates()

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData(timeRange)
        setDashboardData(data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [timeRange])

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-950 to-blue-950 text-white">
      {/* Navigation */}
      <header className="container z-10 mx-auto flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Globe className="h-8 w-8 text-blue-400" />
          <span className="text-xl font-bold">OceanGuard</span>
        </div>
        <nav className="hidden md:block">
          <ul className="flex gap-8">
            <li>
              <Link href="/" className="text-blue-200 hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-white font-medium transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/marketplace" className="text-blue-200 hover:text-white transition-colors">
                Marketplace
              </Link>
            </li>
            <li>
              <Link href="/governance" className="text-blue-200 hover:text-white transition-colors">
                Governance
              </Link>
            </li>
          </ul>
        </nav>
        <ConnectButton />
      </header>

      {/* Dashboard Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-blue-300 hover:text-blue-200 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Home</span>
              </Link>
              <h1 className="text-3xl font-bold">Ocean Health Dashboard</h1>
            </div>
            <p className="text-blue-200 max-w-2xl">
              Monitor real-time ocean health metrics, predict future trends, and track conservation efforts with our
              AI-powered analytics.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-blue-700 bg-blue-900/30 text-blue-200">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="border-blue-700 bg-blue-900/30 text-blue-200">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* User Token Balance */}
        {isConnected && (
          <Card className="bg-slate-800/50 border-slate-700 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="text-sm text-slate-400">Your OCEAN Token Balance</div>
                  <div className="text-3xl font-bold text-blue-400">{tokenBalance} OCEAN</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-900/50 p-3 rounded-md">
                    <div className="text-slate-400">Plastic Removal Rate</div>
                    <div className="font-medium">{conversionRates.plasticRemovalRate} OCEAN/kg</div>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-md">
                    <div className="text-slate-400">Reef Restoration Rate</div>
                    <div className="font-medium">{conversionRates.reefRestorationRate} OCEAN/m²</div>
                  </div>
                  <div className="bg-slate-900/50 p-3 rounded-md">
                    <div className="text-slate-400">Carbon Sequestration Rate</div>
                    <div className="font-medium">{conversionRates.carbonSequestrationRate} OCEAN/ton</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Time Range Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search metrics..."
              className="h-10 rounded-md border border-slate-700 bg-slate-800/50 pl-10 pr-4 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`border-slate-700 ${timeRange === "1m" ? "bg-blue-600 text-white" : "bg-slate-800/50 text-slate-300"}`}
              onClick={() => setTimeRange("1m")}
            >
              1M
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`border-slate-700 ${timeRange === "3m" ? "bg-blue-600 text-white" : "bg-slate-800/50 text-slate-300"}`}
              onClick={() => setTimeRange("3m")}
            >
              3M
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`border-slate-700 ${timeRange === "6m" ? "bg-blue-600 text-white" : "bg-slate-800/50 text-slate-300"}`}
              onClick={() => setTimeRange("6m")}
            >
              6M
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`border-slate-700 ${timeRange === "1y" ? "bg-blue-600 text-white" : "bg-slate-800/50 text-slate-300"}`}
              onClick={() => setTimeRange("1y")}
            >
              1Y
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`border-slate-700 ${timeRange === "all" ? "bg-blue-600 text-white" : "bg-slate-800/50 text-slate-300"}`}
              onClick={() => setTimeRange("all")}
            >
              All
            </Button>
            <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800/50 text-slate-300">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-1 backdrop-blur-sm shadow-xl shadow-blue-500/5">
          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm text-slate-400">Ocean Health Dashboard</div>
            <div className="flex items-center gap-2">
              <button className="rounded-md p-1 hover:bg-slate-800">
                <AreaChart className="h-4 w-4 text-slate-400" />
              </button>
              <button className="rounded-md p-1 hover:bg-slate-800">
                <BarChart className="h-4 w-4 text-slate-400" />
              </button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="p-4" onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-slate-800/50">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="coral">Coral Health</TabsTrigger>
              <TabsTrigger value="plastic">Plastic Pollution</TabsTrigger>
              <TabsTrigger value="carbon">Carbon Sequestration</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="biodiversity">Biodiversity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-sm text-slate-400">Global Ocean Health Index</div>
                    {loading ? (
                      <>
                        <Skeleton className="mt-2 h-8 w-24" />
                        <Skeleton className="mt-1 h-4 w-32" />
                        <Skeleton className="mt-4 h-24 w-full" />
                      </>
                    ) : (
                      <>
                        <div className="mt-2 text-3xl font-bold text-blue-400">
                          {dashboardData?.oceanHealthIndex.current}
                        </div>
                        <div
                          className={`mt-1 text-xs ${dashboardData?.oceanHealthIndex.change >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {dashboardData?.oceanHealthIndex.change >= 0 ? "+" : ""}
                          {dashboardData?.oceanHealthIndex.change}% from last year
                        </div>
                        <div className="mt-4 h-24 w-full">
                          <OceanHealthChart data={dashboardData?.oceanHealthIndex.history} />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-sm text-slate-400">Plastic Reduction</div>
                    {loading ? (
                      <>
                        <Skeleton className="mt-2 h-8 w-24" />
                        <Skeleton className="mt-1 h-4 w-32" />
                        <Skeleton className="mt-4 h-24 w-full" />
                      </>
                    ) : (
                      <>
                        <div className="mt-2 text-3xl font-bold text-purple-400">
                          {dashboardData?.plasticReduction.current}
                        </div>
                        <div className="mt-1 text-xs text-green-400">Tons removed this year</div>
                        <div className="mt-4 h-24 w-full">
                          <PlasticReductionChart data={dashboardData?.plasticReduction.history} />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-sm text-slate-400">Carbon Credits Issued</div>
                    {loading ? (
                      <>
                        <Skeleton className="mt-2 h-8 w-24" />
                        <Skeleton className="mt-1 h-4 w-32" />
                        <Skeleton className="mt-4 h-24 w-full" />
                      </>
                    ) : (
                      <>
                        <div className="mt-2 text-3xl font-bold text-teal-400">
                          {dashboardData?.carbonCredits.current}
                        </div>
                        <div
                          className={`mt-1 text-xs ${dashboardData?.carbonCredits.change >= 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          {dashboardData?.carbonCredits.change >= 0 ? "+" : ""}
                          {dashboardData?.carbonCredits.change}% this quarter
                        </div>
                        <div className="mt-4 h-24 w-full">
                          <CarbonCreditsChart data={dashboardData?.carbonCredits.history} />
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="text-sm text-slate-400">Global Ocean Temperature Anomalies</div>
                  {loading ? (
                    <Skeleton className="mt-6 h-64 w-full" />
                  ) : (
                    <div className="mt-6 h-64 w-full">
                      <TemperatureAnomaliesChart data={dashboardData?.temperatureAnomalies} />
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-sm text-slate-400">Conservation Hotspots</div>
                    {loading ? (
                      <Skeleton className="mt-6 h-64 w-full" />
                    ) : (
                      <div className="mt-6 h-64 w-full">
                        <ConservationHotspotsChart data={dashboardData?.conservationHotspots} />
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="text-sm text-slate-400">Coral Reef Health by Region</div>
                    {loading ? (
                      <Skeleton className="mt-6 h-64 w-full" />
                    ) : (
                      <div className="mt-6 h-64 w-full">
                        <CoralReefHealthChart data={dashboardData?.coralReefHealth} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="coral" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="text-sm text-slate-400">Coral Reef Health Prediction</div>
                  {loading ? (
                    <Skeleton className="mt-6 h-96 w-full" />
                  ) : (
                    <div className="mt-6 h-96 w-full">
                      <CoralHealthPredictionChart data={dashboardData?.coralHealthPrediction} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plastic" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="text-sm text-slate-400">Plastic Accumulation Zones</div>
                  {loading ? (
                    <Skeleton className="mt-6 h-96 w-full" />
                  ) : (
                    <div className="mt-6 h-96 w-full">
                      <PlasticAccumulationChart data={dashboardData?.plasticAccumulation} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="carbon" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="text-sm text-slate-400">Carbon Sequestration Capacity</div>
                  {loading ? (
                    <Skeleton className="mt-6 h-96 w-full" />
                  ) : (
                    <div className="mt-6 h-96 w-full">
                      <CarbonSequestrationChart data={dashboardData?.carbonSequestration} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="temperature" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="text-sm text-slate-400">Ocean Temperature Trends</div>
                  {loading ? (
                    <Skeleton className="mt-6 h-96 w-full" />
                  ) : (
                    <div className="mt-6 h-96 w-full">
                      {/* Temperature chart would go here */}
                      <div className="flex items-center justify-center h-full text-slate-400">
                        Temperature data visualization
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="biodiversity" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="text-sm text-slate-400">Marine Biodiversity Index</div>
                  {loading ? (
                    <Skeleton className="mt-6 h-96 w-full" />
                  ) : (
                    <div className="mt-6 h-96 w-full">
                      {/* Biodiversity chart would go here */}
                      <div className="flex items-center justify-center h-full text-slate-400">
                        Biodiversity data visualization
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Globe className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold">OceanGuard</span>
            </div>
            <div className="text-sm text-blue-200">© {new Date().getFullYear()} OceanGuard. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

