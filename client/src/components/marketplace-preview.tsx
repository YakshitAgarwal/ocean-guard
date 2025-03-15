"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Filter, Search, SortAsc } from 'lucide-react';

export default function MarketplacePreview() {
  const [activeTab, setActiveTab] = useState("buy");

  const projects = [
    {
      id: 1,
      name: "Great Barrier Reef Restoration",
      location: "Australia",
      price: "0.045",
      volume: "125K",
      impact: "High",
      verified: true,
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 2,
      name: "Pacific Ocean Plastic Cleanup",
      location: "Pacific",
      price: "0.032",
      volume: "250K",
      impact: "Very High",
      verified: true,
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 3,
      name: "Mangrove Reforestation Project",
      location: "Indonesia",
      price: "0.028",
      volume: "180K",
      impact: "Medium",
      verified: true,
      image: "/placeholder.svg?height=200&width=300"
    },
    {
      id: 4,
      name: "Coral Nursery Development",
      location: "Caribbean",
      price: "0.039",
      volume: "95K",
      impact: "High",
      verified: false,
      image: "/placeholder.svg?height=200&width=300"
    }
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-1 backdrop-blur-sm shadow-xl shadow-blue-500/5">
      <div className="flex items-center justify-between border-b border-slate-800 p-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm text-slate-400">Carbon Credit Marketplace</div>
        <div className="flex items-center gap-2">
          <button className="rounded-md p-1 hover:bg-slate-800">
            <Search className="h-4 w-4 text-slate-400" />
          </button>
          <button className="rounded-md p-1 hover:bg-slate-800">
            <Filter className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      <Tabs defaultValue="buy" className="p-4">
        <TabsList className="mb-6 bg-slate-800/50">
          <TabsTrigger value="buy">Buy Credits</TabsTrigger>
          <TabsTrigger value="sell">Sell Credits</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="h-10 rounded-md border border-slate-700 bg-slate-800 pl-10 pr-4 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-slate-300">
                <SortAsc className="mr-2 h-4 w-4" />
                Sort by
              </Button>
              <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-slate-300">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {projects.map((project) => (
              <Card key={project.id} className="bg-slate-800/50 border-slate-700 overflow-hidden">
                <div className="h-40 w-full bg-cover bg-center" style={{ backgroundImage: `url(${project.image})` }}></div>
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {project.impact} Impact
                    </Badge>
                    {project.verified && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="text-slate-400">{project.location}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-400">Price</div>
                      <div className="text-xl font-bold text-white">{project.price} ETH</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Volume</div>
                      <div className="text-xl font-bold text-white">{project.volume}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">Buy Credits</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700 p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">List Your Carbon Credits</h3>
              <p className="text-slate-400 mb-6">Create a listing for your verified carbon credits</p>
              
              <div className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2 text-left">
                  <label className="text-sm text-slate-400">Project Type</label>
                  <select className="w-full h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-white focus:border-blue-500 focus:outline-none">
                    <option>Coral Reef Restoration</option>
                    <option>Plastic Cleanup</option>
                    <option>Mangrove Reforestation</option>
                    <option>Ocean Conservation</option>
                  </select>
                </div>
                
                <div className="space-y-2 text-left">
                  <label className="text-sm text-slate-400">Credit Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="w-full h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div className="space-y-2 text-left">
                  <label className="text-sm text-slate-400">Price per Credit (ETH)</label>
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    className="w-full h-10 rounded-md border border-slate-700 bg-slate-800 px-3 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div className="space-y-2 text-left">
                  <label className="text-sm text-slate-400">Verification Documents</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg border-slate-600 hover:border-blue-500 cursor-pointer bg-slate-800/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="mb-2 text-sm text-slate-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-slate-500">PDF, PNG, JPG (MAX. 10MB)</p>
                      </div>
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>
                
                <Button className="w-full bg-blue-500 hover:bg-blue-600 mt-4">
                  List Credits
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400">Total Credits Owned</div>
                <div className="mt-2 text-3xl font-bold text-blue-400">12,450</div>
                <div className="mt-1 text-xs text-green-400">+1,250 this month</div>
                <div className="mt-4 h-24 w-full bg-[url('/placeholder.svg?height=100&width=300')] bg-contain bg-no-repeat"></div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400">Credits Listed</div>
                <div className="mt-2 text-3xl font-bold text-purple-400">5,280</div>
                <div className="mt-1 text-xs text-yellow-400">42% of portfolio</div>
                <div className="mt-4 h-24 w-full bg-[url('/placeholder.svg?height=100&width=300')] bg-contain bg-no-repeat"></div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="text-sm text-slate-400">Portfolio Value</div>
                <div className="mt-2 text-3xl font-bold text-teal-400">458.2 ETH</div>
                <div className="mt-1 text-xs text-green-400">+12.5% this quarter</div>
                <div className="mt-4 h-24 w-full bg-[url('/placeholder.svg?height=100&width=300')] bg-contain bg-no-repeat"></div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle>My Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Project</th>
                      <th scope="col" className="px-6 py-3">Amount</th>
                      <th scope="col" className="px-6 py-3">Acquisition Date</th>
                      <th scope="col" className="px-6 py-3">Value (ETH)</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700">
                      <td className="px-6 py-4">Great Barrier Reef Restoration</td>
                      <td className="px-6 py-4">5,200</td>
                      <td className="px-6 py-4">2023-09-15</td>
                      <td className="px-6 py-4">234.0</td>
                      <td className="px-6 py-4"><Badge className="bg-green-500/20 text-green-400">Held</Badge></td>
                      <td className="px-6 py-4"><Button size="sm" variant="outline">List</Button></td>
                    </tr>
                    <tr className="border-b border-slate-700">
                      <td className="px-6 py-4">Pacific Ocean Plastic Cleanup</td>
                      <td className="px-6 py-4">3,800</td>
                      <td className="px-6 py-4">2023-11-22</td>
                      <td className="px-6 py-4">121.6</td>
                      <td className="px-6 py-4"><Badge className="bg-blue-500/20 text-blue-400">Listed</Badge></td>
                      <td className="px-6 py-4"><Button size="sm" variant="outline">Delist</Button></td>
                    </tr>
                    <tr className="border-b border-slate-700">
                      <td className="px-6 py-4">Mangrove Reforestation Project</td>
                      <td className="px-6 py-4">3,450</td>
                      <td className="px-6 py-4">2024-01-08</td>
                      <td className="px-6 py-4">96.6</td>
                      <td className="px-6 py-4"><Badge className="bg-green-500/20 text-green-400">Held</Badge></td>
                      <td className="px-6 py-4"><Button size="sm" variant="outline">List</Button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
