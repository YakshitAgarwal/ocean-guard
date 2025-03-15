"use client"

import Link from "next/link"
import { useState } from "react"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount } from "wagmi"
import { ArrowLeft, CheckCircle, Clock, FileText, Globe, Shield, Users, Vote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useTokenBalance } from "@/lib/contract"

export default function GovernancePage() {
//   const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState("active")
  const [activeProposal, setActiveProposal] = useState(null)

  const tokenBalance = useTokenBalance(address)

  const proposals = [
    {
      id: 1,
      title: "Expand Coral Reef Monitoring Network",
      description:
        "Proposal to allocate 500,000 tokens to expand the AI monitoring system for coral reefs in the South Pacific.",
      status: "Active",
      votes: { for: 62, against: 18, abstain: 20 },
      endTime: "2 days",
      creator: "0x7Fc...A3b2",
      category: "Infrastructure",
    },
    {
      id: 2,
      title: "Increase Validator Rewards",
      description:
        "Increase the reward allocation for validators who verify conservation actions from 2% to 3% of tokens.",
      status: "Active",
      votes: { for: 45, against: 40, abstain: 15 },
      endTime: "4 days",
      creator: "0x3Ae...F7c1",
      category: "Tokenomics",
    },
    {
      id: 3,
      title: "Partnership with Ocean Cleanup Foundation",
      description:
        "Establish a formal partnership with the Ocean Cleanup Foundation to integrate their data into our platform.",
      status: "Passed",
      votes: { for: 78, against: 12, abstain: 10 },
      endTime: "Ended",
      creator: "0x9Bd...E4a5",
      category: "Partnership",
    },
    {
      id: 4,
      title: "Implement Carbon Credit Verification Protocol",
      description:
        "Implement a new verification protocol for carbon credits to ensure higher quality and transparency.",
      status: "Active",
      votes: { for: 55, against: 25, abstain: 20 },
      endTime: "5 days",
      creator: "0x2Df...B8c3",
      category: "Protocol",
    },
    {
      id: 5,
      title: "Fund Marine Research Initiative",
      description:
        "Allocate 250,000 tokens to fund research on marine biodiversity and its impact on carbon sequestration.",
      status: "Active",
      votes: { for: 70, against: 15, abstain: 15 },
      endTime: "3 days",
      creator: "0x5Ea...D1f7",
      category: "Research",
    },
    {
      id: 6,
      title: "Reduce Transaction Fees",
      description: "Reduce transaction fees on the marketplace from 1% to 0.5% to encourage more trading activity.",
      status: "Failed",
      votes: { for: 35, against: 60, abstain: 5 },
      endTime: "Ended",
      creator: "0x8Cb...G2e9",
      category: "Tokenomics",
    },
  ]

  const pastProposals = proposals.filter((p) => p.status === "Passed" || p.status === "Failed")
  const activeProposals = proposals.filter((p) => p.status === "Active")

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
              <Link href="/marketplace" className="text-blue-200 hover:text-white transition-colors">
                Marketplace
              </Link>
            </li>
            <li>
              <Link href="/governance" className="text-white font-medium transition-colors">
                Governance
              </Link>
            </li>
          </ul>
        </nav>
        <ConnectButton />
      </header>

      {/* Governance Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-blue-300 hover:text-blue-200 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Home</span>
              </Link>
              <h1 className="text-3xl font-bold">Decentralized Governance</h1>
            </div>
            <p className="text-blue-200 max-w-2xl">
              Participate in the decentralized governance of OceanGuard. Vote on proposals, delegate your voting power,
              and help shape the future of ocean conservation.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isConnected ? (
              <Button className="bg-blue-500 hover:bg-blue-600">Create Proposal</Button>
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
                  <div className="text-sm text-slate-400">Voting Power: {tokenBalance} votes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Governance Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="bg-slate-900/50 border-slate-800 text-white backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  DAO Overview
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Decentralized governance for ocean conservation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-slate-400">Total Staked</div>
                    <div className="text-sm font-medium">12.5M Tokens</div>
                  </div>
                  <Progress value={65} className="h-2 bg-slate-700" />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm text-slate-400">Participation Rate</div>
                    <div className="text-sm font-medium">42%</div>
                  </div>
                  <Progress value={42} className="h-2 bg-slate-700" />
                </div>

                <div className="rounded-lg bg-slate-800/50 p-4">
                  <h4 className="mb-3 text-sm font-medium text-slate-300">Governance Stats</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <span className="text-sm">Total Proposals</span>
                      </div>
                      <span className="text-sm font-medium">42</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm">Proposals Passed</span>
                      </div>
                      <span className="text-sm font-medium">28</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">Active Validators</span>
                      </div>
                      <span className="text-sm font-medium">156</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-800/50 p-4">
                  <h4 className="mb-3 text-sm font-medium text-slate-300">Your Governance Power</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Voting Power</span>
                      </div>
                      <span className="text-sm font-medium">{tokenBalance || "0"} votes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Delegated To You</span>
                      </div>
                      <span className="text-sm font-medium">0 votes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Proposals Voted</span>
                      </div>
                      <span className="text-sm font-medium">0</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => !isConnected && open()}
                  disabled={!isConnected}
                >
                  Create Proposal
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-800 text-white backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Vote className="h-5 w-5 text-blue-400" />
                  Proposals
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Vote on current proposals or view past decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active" className="mb-6" onValueChange={setActiveTab}>
                  <TabsList className="bg-slate-800/50">
                    <TabsTrigger value="active">Active Proposals</TabsTrigger>
                    <TabsTrigger value="past">Past Proposals</TabsTrigger>
                    <TabsTrigger value="my">My Votes</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-4">
                  {activeTab === "active" &&
                    activeProposals.map((proposal) => (
                      <Card key={proposal.id} className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                              {proposal.status}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                              {proposal.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          <CardDescription className="text-slate-400">{proposal.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Clock className="h-4 w-4" />
                              {proposal.endTime}
                            </div>
                            <div className="text-sm text-slate-400">Created by {proposal.creator}</div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span>For</span>
                                <span>{proposal.votes.for}%</span>
                              </div>
                              <Progress
                                value={proposal.votes.for}
                                className="h-2 bg-slate-700"
                                indicatorClassName="bg-green-500"
                              />
                            </div>
                            <div>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span>Against</span>
                                <span>{proposal.votes.against}%</span>
                              </div>
                              <Progress
                                value={proposal.votes.against}
                                className="h-2 bg-slate-700"
                                indicatorClassName="bg-red-500"
                              />
                            </div>
                            <div>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span>Abstain</span>
                                <span>{proposal.votes.abstain}%</span>
                              </div>
                              <Progress
                                value={proposal.votes.abstain}
                                className="h-2 bg-slate-700"
                                indicatorClassName="bg-yellow-500"
                              />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <div className="flex w-full gap-2">
                            <Button
                              variant="outline"
                              className="flex-1 border-green-500/20 text-green-400 hover:bg-green-500/10"
                              onClick={() => !isConnected && open()}
                              disabled={!isConnected}
                            >
                              Vote For
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10"
                              onClick={() => !isConnected && open()}
                              disabled={!isConnected}
                            >
                              Vote Against
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                              onClick={() => !isConnected && open()}
                              disabled={!isConnected}
                            >
                              Abstain
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}

                  {activeTab === "past" &&
                    pastProposals.map((proposal) => (
                      <Card key={proposal.id} className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="p-4">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={
                                proposal.status === "Passed"
                                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                              }
                            >
                              {proposal.status}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                              {proposal.category}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{proposal.title}</CardTitle>
                          <CardDescription className="text-slate-400">{proposal.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                              <Clock className="h-4 w-4" />
                              {proposal.endTime}
                            </div>
                            <div className="text-sm text-slate-400">Created by {proposal.creator}</div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span>For</span>
                                <span>{proposal.votes.for}%</span>
                              </div>
                              <Progress
                                value={proposal.votes.for}
                                className="h-2 bg-slate-700"
                                indicatorClassName="bg-green-500"
                              />
                            </div>
                            <div>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span>Against</span>
                                <span>{proposal.votes.against}%</span>
                              </div>
                              <Progress
                                value={proposal.votes.against}
                                className="h-2 bg-slate-700"
                                indicatorClassName="bg-red-500"
                              />
                            </div>
                            <div>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span>Abstain</span>
                                <span>{proposal.votes.abstain}%</span>
                              </div>
                              <Progress
                                value={proposal.votes.abstain}
                                className="h-2 bg-slate-700"
                                indicatorClassName="bg-yellow-500"
                              />
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            variant="outline"
                            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}

                  {activeTab === "my" &&
                    (!isConnected ? (
                      <div className="text-center py-12">
                        <div className="text-xl font-medium mb-2">Connect your wallet</div>
                        <p className="text-slate-400 mb-6">Connect your wallet to view your votes.</p>
                        <Button className="bg-blue-500 hover:bg-blue-600" onClick={() => open()}>
                          Connect Wallet
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-xl font-medium mb-2">No votes yet</div>
                        <p className="text-slate-400 mb-6">You haven't voted on any proposals yet.</p>
                        <Button
                          variant="outline"
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                          onClick={() => setActiveTab("active")}
                        >
                          View Active Proposals
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4">
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                  View All Proposals
                </Button>
              </CardFooter>
            </Card>
          </div>
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

