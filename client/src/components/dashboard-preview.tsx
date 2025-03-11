"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart, LineChart, PieChart } from 'lucide-react';

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("overview");

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

      <Tabs defaultValue="overview" className="p-4">
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
                <div className="mt-2 text-3xl font-bold text-blue-400">72.4</div>
                <div className="mt-1 text-xs text-green-400">+2.1% from last year</div>
                <div className="mt-4 h-24 w-full bg-[url('/placeholder.svg?height=100&width=300')] bg-contain bg-no-repeat"></div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400">Plastic Reduction</div>
                <div className="mt-2 text-3xl font-bold text-purple-400">1.2M</div>
                <div className="mt-1 text-xs text-green-400">Tons removed this year</div>
                <div className="mt-4 h-24 w-full bg-[url('/placeholder.svg?height=100&width=300')] bg-contain bg-no-repeat"></div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400">Carbon Credits Issued</div>
                <div className="mt-2 text-3xl font-bold text-teal-400">845K</div>
                <div className="mt-1 text-xs text-green-400">+12.5% this quarter</div>
                <div className="mt-4 h-24 w-full bg-[url('/placeholder.svg?height=100&width=300')] bg-contain bg-no-repeat"></div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-sm text-slate-400">Global Ocean Temperature Anomalies</div>
              <div className="mt-6 h-64 w-full bg-[url('/placeholder.svg?height=300&width=1200')] bg-contain bg-no-repeat"></div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400">Conservation Hotspots</div>
                <div className="mt-6 h-64 w-full bg-[url('/placeholder.svg?height=300&width=600')] bg-contain bg-no-repeat"></div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400">Coral Reef Health by Region</div>
                <div className="mt-6 h-64 w-full bg-[url('/placeholder.svg?height=300&width=600')] bg-contain bg-no-repeat"></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="coral" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-sm text-slate-400">Coral Reef Health Prediction</div>
              <div className="mt-6 h-96 w-full bg-[url('/placeholder.svg?height=400&width=1200')] bg-contain bg-no-repeat"></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plastic" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-sm text-slate-400">Plastic Accumulation Zones</div>
              <div className="mt-6 h-96 w-full bg-[url('/placeholder.svg?height=400&width=1200')] bg-contain bg-no-repeat"></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carbon" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="text-sm text-slate-400">Carbon Sequestration Capacity</div>
              <div className="mt-6 h-96 w-full bg-[url('/placeholder.svg?height=400&width=1200')] bg-contain bg-no-repeat"></div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
