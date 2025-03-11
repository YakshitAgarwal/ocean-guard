"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, BarChart } from "lucide-react"
import { fetchDashboardData } from "@/lib/actions"
import { OceanHealthChart } from "./charts/ocean-health-chart"
import { PlasticReductionChart } from "./charts/plastic-reduction-chart"
import { CarbonCreditsChart } from "./charts/carbon-credits-chart"
import { TemperatureAnomaliesChart } from "./charts/temperature-anomalies-chart"
import { ConservationHotspotsChart } from "./charts/conservation-hotspots-chart"
import { CoralReefHealthChart } from "./charts/coral-reef-health-chart"
import { CoralHealthPredictionChart } from "./charts/coral-health-prediction-chart"
import { PlasticAccumulationChart } from "./charts/plastic-accumulation-chart"
import { CarbonSequestrationChart } from "./charts/carbon-sequestration-chart"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
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
                    <div className="mt-2 text-3xl font-bold text-teal-400">{dashboardData?.carbonCredits.current}</div>
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
      </Tabs>
    </div>
  )
}

