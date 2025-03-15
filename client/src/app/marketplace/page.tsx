"use client"

import Link from "next/link"
import { useState } from "react"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { ethers } from "ethers"
import { ArrowLeft, Filter, Globe, Search, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import {
  useOceanGuardContract,
  useTokenBalance,
  useUserProjects,
  useAvailableCarbonCredits,
  ProjectType,
  createCarbonCredit,
} from "@/lib/contract"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { BuyCreditDialog } from "@/components/buy-credit-dialog"

export default function MarketplacePage() {
//   const { open } = useWeb3Modal()
const open = () => {}
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const [activeTab, setActiveTab] = useState("buy")
  const [sortBy, setSortBy] = useState("price")
  const [filterBy, setFilterBy] = useState("all")

  const tokenBalance = useTokenBalance(address)
  const { projects, loading: projectsLoading } = useUserProjects(
    address,
    walletClient ? new ethers.providers.Web3Provider(walletClient as any) : undefined,
  )
  const { credits, loading: creditsLoading } = useAvailableCarbonCredits(
    walletClient ? new ethers.providers.Web3Provider(walletClient as any) : undefined,
  )

  const contract = useOceanGuardContract(
    walletClient ? new ethers.providers.Web3Provider(walletClient as any) : undefined,
  )

  // Filter and sort credits
  const filteredCredits = credits.filter((credit) => {
    if (filterBy === "all") return true
    if (filterBy === "high-impact" && credit.amount >= 100) return true
    if (filterBy === "low-price" && Number.parseFloat(credit.priceInEth) < 0.04) return true
    return false
  })

  const sortedCredits = [...filteredCredits].sort((a, b) => {
    if (sortBy === "price") return Number.parseFloat(a.priceInEth) - Number.parseFloat(b.priceInEth)
    if (sortBy === "amount") return b.amount - a.amount
    return 0
  })
  console.log(projects);
  
  // Get carbon sequestration projects
  const carbonProjects = projects.filter(
    (project) => project.projectType === ProjectType.CARBON_SEQUESTRATION && project.isValidated,
  )

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
              <Link href="/dashboard" className="text-blue-200 hover:text-white transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/marketplace" className="text-white font-medium transition-colors">
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

      {/* Marketplace Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-blue-300 hover:text-blue-200 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Home</span>
              </Link>
              <h1 className="text-3xl font-bold">Carbon Credit Marketplace</h1>
            </div>
            <p className="text-blue-200 max-w-2xl">
              Trade verified carbon credits from ocean conservation projects, supporting sustainable initiatives while
              offsetting your carbon footprint.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isConnected ? (
              <CreateProjectDialog />
            ) : (
              <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => open()}>
                Connect Wallet
              </Button>
            )}
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
              </div>
            </CardContent>
          </Card>
        )}

        {/* Marketplace Content */}
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

          <Tabs defaultValue="buy" className="p-4" onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-slate-800/50">
              <TabsTrigger value="buy">Buy Credits</TabsTrigger>
              <TabsTrigger value="sell">Sell Credits</TabsTrigger>
              <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
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
                  <div className="relative">
                    <select
                      className="h-10 appearance-none rounded-md border border-slate-700 bg-slate-800 pl-3 pr-10 text-sm text-white focus:border-blue-500 focus:outline-none"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="price">Sort by Price</option>
                      <option value="amount">Sort by Amount</option>
                    </select>
                    <SortAsc className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      className="h-10 appearance-none rounded-md border border-slate-700 bg-slate-800 pl-3 pr-10 text-sm text-white focus:border-blue-500 focus:outline-none"
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                    >
                      <option value="all">All Credits</option>
                      <option value="high-impact">High Impact (100+ tons)</option>
                      <option value="low-price">Low Price (&lt;0.04 ETH)</option>
                    </select>
                    <Filter className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {creditsLoading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-slate-800/50 border-slate-700 overflow-hidden">
                      <Skeleton className="h-40 w-full" />
                      <CardHeader className="p-4">
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-16" />
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Skeleton className="h-10 w-full" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : sortedCredits.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {sortedCredits.map((credit) => (
                    <Card key={credit.id} className="bg-slate-800/50 border-slate-700 overflow-hidden">
                      <div
                        className="h-40 w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(/placeholder.svg?height=200&width=300)` }}
                      ></div>
                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                            {credit.amount > 100 ? "High Impact" : "Medium Impact"}
                          </Badge>
                          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                            Verified
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">Carbon Credit #{credit.id}</CardTitle>
                        <CardDescription className="text-slate-400">Carbon Sequestration</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-slate-400">Price</div>
                            <div className="text-xl font-bold text-white">{credit.priceInEth} ETH</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-slate-400">Amount</div>
                            <div className="text-xl font-bold text-white">{credit.amount} tons</div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <BuyCreditDialog credit={credit} />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-xl font-medium mb-2">No carbon credits available</div>
                  <p className="text-slate-400 mb-6">There are currently no carbon credits listed for sale.</p>
                  {isConnected && <CreateProjectDialog />}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sell" className="space-y-4">
              {!isConnected ? (
                <div className="text-center py-12">
                  <div className="text-xl font-medium mb-2">Connect your wallet</div>
                  <p className="text-slate-400 mb-6">Connect your wallet to create and sell carbon credits.</p>
                  <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => open()}>
                    Connect Wallet
                  </Button>
                </div>
              ) : carbonProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-xl font-medium mb-2">No carbon sequestration projects</div>
                  <p className="text-slate-400 mb-6">
                    Create a carbon sequestration project to generate carbon credits.
                  </p>
                  <CreateProjectDialog />
                </div>
              ) : (
                <Card className="bg-slate-800/50 border-slate-700 p-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">Create Carbon Credits</h3>
                    <p className="text-slate-400 mb-6">Generate carbon credits from your validated projects</p>

                    <div className="space-y-4 max-w-md mx-auto">
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium">Your Carbon Sequestration Projects</h4>
                        {carbonProjects.map((project) => (
                          <div key={project.id} className="bg-slate-900/50 p-4 rounded-md border border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-medium">Project #{project.id}</div>
                                <div className="text-sm text-slate-400">
                                  {JSON.parse(project.metadata).name || "Carbon Sequestration Project"}
                                </div>
                              </div>
                              <Badge className="bg-green-500/20 text-green-400">Validated</Badge>
                            </div>
                            <div className="text-sm mb-2">
                              <span className="text-slate-400">Impact: </span>
                              <span className="font-medium">{project.impactMetric} tons CO₂</span>
                            </div>
                            <div className="flex justify-end mt-4">
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600"
                                onClick={async () => {
                                  if (!contract) return
                                  try {
                                    await createCarbonCredit(contract, project.id, project.impactMetric)
                                  } catch (error) {
                                    console.error("Error creating carbon credit:", error)
                                  }
                                }}
                              >
                                Generate Credits
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              {!isConnected ? (
                <div className="text-center py-12">
                  <div className="text-xl font-medium mb-2">Connect your wallet</div>
                  <p className="text-slate-400 mb-6">Connect your wallet to view your portfolio.</p>
                  <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => open()}>
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <div className="text-sm text-slate-400">Total Credits Owned</div>
                        <div className="mt-2 text-3xl font-bold text-blue-400">{tokenBalance} OCEAN</div>
                        <div className="mt-1 text-xs text-green-400">Earn more by creating conservation projects</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <div className="text-sm text-slate-400">Projects Created</div>
                        <div className="mt-2 text-3xl font-bold text-purple-400">{projects.length}</div>
                        <div className="mt-1 text-xs text-blue-400">
                          {projects.filter((p) => p.isValidated).length} validated
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardContent className="p-6">
                        <div className="text-sm text-slate-400">Carbon Impact</div>
                        <div className="mt-2 text-3xl font-bold text-teal-400">
                          {projects
                            .filter((p) => p.projectType === ProjectType.CARBON_SEQUESTRATION)
                            .reduce((sum, p) => sum + p.impactMetric, 0)}{" "}
                          tons
                        </div>
                        <div className="mt-1 text-xs text-green-400">CO₂ sequestered</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle>My Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {projectsLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                          ))}
                        </div>
                      ) : projects.length > 0 ? (
                        <div className="relative overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="text-xs uppercase text-slate-400">
                              <tr>
                                <th scope="col" className="px-6 py-3">
                                  ID
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Project
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Type
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Impact
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Status
                                </th>
                                <th scope="col" className="px-6 py-3">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {projects.map((project) => {
                                const metadata = JSON.parse(project.metadata)
                                const projectType =
                                  project.projectType === ProjectType.PLASTIC_REMOVAL
                                    ? "Plastic Removal"
                                    : project.projectType === ProjectType.REEF_RESTORATION
                                      ? "Reef Restoration"
                                      : "Carbon Sequestration"
                                const impactUnit =
                                  project.projectType === ProjectType.PLASTIC_REMOVAL
                                    ? "kg"
                                    : project.projectType === ProjectType.REEF_RESTORATION
                                      ? "m²"
                                      : "tons"

                                return (
                                  <tr key={project.id} className="border-b border-slate-700">
                                    <td className="px-6 py-4">{project.id}</td>
                                    <td className="px-6 py-4">{metadata.name || `Project #${project.id}`}</td>
                                    <td className="px-6 py-4">{projectType}</td>
                                    <td className="px-6 py-4">
                                      {project.impactMetric} {impactUnit}
                                    </td>
                                    <td className="px-6 py-4">
                                      {project.isValidated ? (
                                        <Badge className="bg-green-500/20 text-green-400">Validated</Badge>
                                      ) : (
                                        <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>
                                      )}
                                    </td>
                                    <td className="px-6 py-4">
                                      {project.isValidated && !project.tokensIssued && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={async () => {
                                            if (!contract) return
                                            try {
                                              await contract.issueTokens(project.id)
                                            } catch (error) {
                                              console.error("Error issuing tokens:", error)
                                            }
                                          }}
                                        >
                                          Claim Tokens
                                        </Button>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-400 mb-4">You haven't created any projects yet.</p>
                          <CreateProjectDialog />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  {!isConnected ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400 mb-4">Connect your wallet to view your transaction history.</p>
                      <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => open()}>
                        Connect Wallet
                      </Button>
                    </div>
                  ) : (
                    <div className="relative overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="text-xs uppercase text-slate-400">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Transaction
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Project/Credit
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Price (ETH)
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-700">
                            <td className="px-6 py-4">Project Created</td>
                            <td className="px-6 py-4">Pacific Ocean Cleanup</td>
                            <td className="px-6 py-4">-</td>
                            <td className="px-6 py-4">-</td>
                            <td className="px-6 py-4">2024-03-15</td>
                            <td className="px-6 py-4">
                              <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-700">
                            <td className="px-6 py-4">Tokens Issued</td>
                            <td className="px-6 py-4">Pacific Ocean Cleanup</td>
                            <td className="px-6 py-4">5,000 OCEAN</td>
                            <td className="px-6 py-4">-</td>
                            <td className="px-6 py-4">2024-03-15</td>
                            <td className="px-6 py-4">
                              <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
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

