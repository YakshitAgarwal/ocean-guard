"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, CheckCircle, Clock, FileText, Globe, Shield, Users, Vote } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { 
  useAccount, 
  useTokenBalance, 
  useStakedBalance, 
  useVotingPower, 
  useTotalStaked,
  useActiveProposals, 
  useProposalsByStatus,
  useCastVote,
  useStakeTokens,
  useUnstakeTokens,
  useCreateProposal,
  ProposalCategory
} from "@/lib/governance"
import { toast } from "@/hooks/use-toast"

export default function GovernancePage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("active");
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);
  const [isUnstakeDialogOpen, setIsUnstakeDialogOpen] = useState(false);
  const [isCreateProposalDialogOpen, setIsCreateProposalDialogOpen] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    category: "Infrastructure"
  });

  // Contract hooks
  const { balance: tokenBalance } = useTokenBalance(address);
  const { stakedBalance } = useStakedBalance(address);
  const { votingPower } = useVotingPower(address);
  const { totalStaked } = useTotalStaked();
  const { proposals: activeProposals, loading: activeProposalsLoading } = useActiveProposals();
  const { proposals: passedProposals, loading: passedProposalsLoading } = useProposalsByStatus("Passed");
  const { proposals: failedProposals, loading: failedProposalsLoading } = useProposalsByStatus("Failed");
  const { castVote, isLoading: isVoting, isSuccess: isVoteSuccess, isError: isVoteError } = useCastVote();
  const { stakeTokens, isLoading: isStaking, isSuccess: isStakeSuccess, isError: isStakeError } = useStakeTokens();
  const { unstakeTokens, isLoading: isUnstaking, isSuccess: isUnstakeSuccess, isError: isUnstakeError } = useUnstakeTokens();
  const { createProposal, isLoading: isCreatingProposal, isSuccess: isCreateSuccess, isError: isCreateError } = useCreateProposal();

  // Combine passed and failed proposals for the "past" tab
  const pastProposals = [...passedProposals, ...failedProposals];
  const isPastProposalsLoading = passedProposalsLoading || failedProposalsLoading;

  // Handle voting
  const handleVote = async (proposalId, voteType) => {
    if (!isConnected) return;
    
    try {
      await castVote(proposalId, voteType);
      toast({
        title: "Vote cast successfully",
        description: `You voted ${voteType} on proposal #${proposalId}`,
      });
    } catch (error) {
      toast({
        title: "Failed to cast vote",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle staking
  const handleStake = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to stake",
        variant: "destructive",
      });
      return;
    }

    try {
      await stakeTokens(stakeAmount);
      toast({
        title: "Tokens staked successfully",
        description: `You staked ${stakeAmount} OCEAN tokens`,
      });
      setStakeAmount("");
      setIsStakeDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to stake tokens",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle unstaking
  const handleUnstake = async () => {
    if (!unstakeAmount || parseFloat(unstakeAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to unstake",
        variant: "destructive",
      });
      return;
    }

    try {
      await unstakeTokens(unstakeAmount);
      toast({
        title: "Tokens unstaked successfully",
        description: `You unstaked ${unstakeAmount} OCEAN tokens`,
      });
      setUnstakeAmount("");
      setIsUnstakeDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to unstake tokens",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle proposal creation
  const handleCreateProposal = async () => {
    if (!newProposal.title || !newProposal.description || !newProposal.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createProposal(
        newProposal.title,
        newProposal.description,
        newProposal.category
      );
      toast({
        title: "Proposal created successfully",
        description: "Your proposal has been submitted to the DAO",
      });
      setNewProposal({
        title: "",
        description: "",
        category: "Infrastructure"
      });
      setIsCreateProposalDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to create proposal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Effect hooks for success/error states
  useEffect(() => {
    if (isVoteSuccess) {
      toast({
        title: "Vote cast successfully",
        description: "Your vote has been recorded",
      });
    }
  }, [isVoteSuccess]);

  useEffect(() => {
    if (isStakeSuccess) {
      toast({
        title: "Tokens staked successfully",
        description: "Your tokens have been staked",
      });
    }
  }, [isStakeSuccess]);

  useEffect(() => {
    if (isUnstakeSuccess) {
      toast({
        title: "Tokens unstaked successfully",
        description: "Your tokens have been unstaked",
      });
    }
  }, [isUnstakeSuccess]);

  useEffect(() => {
    if (isCreateSuccess) {
      toast({
        title: "Proposal created successfully",
        description: "Your proposal has been submitted",
      });
    }
  }, [isCreateSuccess]);

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
              <Dialog open={isCreateProposalDialogOpen} onOpenChange={setIsCreateProposalDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600">Create Proposal</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-slate-700">
                  <DialogHeader>
                    <DialogTitle>Create New Proposal</DialogTitle>
                    <DialogDescription className="text-slate-400">
                      Submit a new proposal to the OceanGuard DAO for voting.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter proposal title"
                        className="bg-slate-800 border-slate-700"
                        value={newProposal.title}
                        onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newProposal.category} 
                        onValueChange={(value) => setNewProposal({ ...newProposal, category: value })}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          {Object.keys(ProposalCategory).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your proposal in detail"
                        className="bg-slate-800 border-slate-700 min-h-[100px]"
                        value={newProposal.description}
                        onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateProposalDialogOpen(false)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateProposal} 
                      className="bg-blue-500 hover:bg-blue-600"
                      disabled={isCreatingProposal}
                    >
                      {isCreatingProposal ? "Creating..." : "Submit Proposal"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : (
              <Button className="bg-blue-500 hover:bg-blue-600" disabled>
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
                  <div className="text-3xl font-bold text-blue-400">{parseFloat(tokenBalance).toFixed(2)} OCEAN</div>
                  <div className="text-sm text-slate-400">Voting Power: {parseFloat(votingPower).toFixed(2)} votes</div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isStakeDialogOpen} onOpenChange={setIsStakeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10">
                        Stake Tokens
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-slate-700">
                      <DialogHeader>
                        <DialogTitle>Stake OCEAN Tokens</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Stake your OCEAN tokens to gain voting power in the DAO.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="stake-amount">Amount to Stake</Label>
                          <Input
                            id="stake-amount"
                            type="number"
                            placeholder="Enter amount"
                            className="bg-slate-800 border-slate-700"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                          />
                          <div className="text-xs text-slate-400">
                            Available: {parseFloat(tokenBalance).toFixed(2)} OCEAN
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsStakeDialogOpen(false)}
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleStake} 
                          className="bg-blue-500 hover:bg-blue-600"
                          disabled={isStaking || !stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > parseFloat(tokenBalance)}
                        >
                          {isStaking ? "Staking..." : "Stake Tokens"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isUnstakeDialogOpen} onOpenChange={setIsUnstakeDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-green-500/20 text-green-400 hover:bg-green-500/10">
                        Unstake Tokens
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-slate-700">
                      <DialogHeader>
                        <DialogTitle>Unstake OCEAN Tokens</DialogTitle>
                        <DialogDescription className="text-slate-400">
                          Unstake your OCEAN tokens to withdraw them from the DAO.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="unstake-amount">Amount to Unstake</Label>
                          <Input
                            id="unstake-amount"
                            type="number"
                            placeholder="Enter amount"
                            className="bg-slate-800 border-slate-700"
                            value={unstakeAmount}
                            onChange={(e) => setUnstakeAmount(e.target.value)}
                          />
                          <div className="text-xs text-slate-400">
                            Staked: {parseFloat(stakedBalance).toFixed(2)} OCEAN
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsUnstakeDialogOpen(false)}
                          className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleUnstake} 
                          className="bg-green-500 hover:bg-green-600"
                          disabled={isUnstaking || !unstakeAmount || parseFloat(unstakeAmount) <= 0 || parseFloat(unstakeAmount) > parseFloat(stakedBalance)}
                        >
                          {isUnstaking ? "Unstaking..." : "Unstake Tokens"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
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
                    <div className="text-sm font-medium">{parseFloat(totalStaked).toFixed(2)} Tokens</div>
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
                      <span className="text-sm font-medium">{activeProposals.length + pastProposals.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm">Proposals Passed</span>
                      </div>
                      <span className="text-sm font-medium">{passedProposals.length}</span>
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
                      <span className="text-sm font-medium">{parseFloat(votingPower).toFixed(2)} votes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Staked Balance</span>
                      </div>
                      <span className="text-sm font-medium">{parseFloat(stakedBalance).toFixed(2)} OCEAN</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Delegated To You</span>
                      </div>
                      <span className="text-sm font-medium">0 votes</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => setIsCreateProposalDialogOpen(true)}
                  disabled={!isConnected || parseFloat(votingPower) <= 0}
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

                <div className="space-y-4">
                  {activeTab === "active" && (
                    activeProposalsLoading ? (
                      <div className="text-center py-12">
                        <div className="text-xl font-medium mb-2">Loading proposals...</div>
                      </div>
                    ) : activeProposals.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-xl font-medium mb-2">No active proposals</div>
                        <p className="text-slate-400 mb-6">There are currently no active proposals to vote on.</p>
                      </div>
                    ) : (
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
                              <div className="text-sm text-slate-400">Created by {proposal.creator.substring(0, 6)}...{proposal.creator.substring(proposal.creator.length - 4)}</div>
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
                                onClick={() => handleVote(proposal.id, "For")}
                                disabled={!isConnected || isVoting || parseFloat(votingPower) <= 0}
                              >
                                {isVoting ? "Voting..." : "Vote For"}
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10"
                                onClick={() => handleVote(proposal.id, "Against")}
                                disabled={!isConnected || isVoting || parseFloat(votingPower) <= 0}
                              >
                                {isVoting ? "Voting..." : "Vote Against"}
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                                onClick={() => handleVote(proposal.id, "Abstain")}
                                disabled={!isConnected || isVoting || parseFloat(votingPower) <= 0}
                              >
                                {isVoting ? "Voting..." : "Abstain"}
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))
                    )
                  )}

                  {activeTab === "past" && (
                    isPastProposalsLoading ? (
                      <div className="text-center py-12">
                        <div className="text-xl font-medium mb-2">Loading proposals...</div>
                      </div>
                    ) : pastProposals.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-xl font-medium mb-2">No past proposals</div>
                        <p className="text-slate-400 mb-6">There are no completed proposals to display yet.</p>
                      </div>
                    ) : (
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
                              <div className="text-sm text-slate-400">Created by {proposal.creator.substring(0, 6)}...{proposal.creator.substring(proposal.creator.length - 4)}</div>
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
                      ))
                    )
                  )}

                  {activeTab === "my" &&
                    (!isConnected ? (
                      <div className="text-center py-12">
                        <div className="text-xl font-medium mb-2">Connect your wallet</div>
                        <p className="text-slate-400 mb-6">Connect your wallet to view your votes.</p>
                        <Button className="bg-blue-500 hover:bg-blue-600">
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
              </Tabs>
              <CardFooter className="px-6 py-4">
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                  View All Proposals
                </Button>
              </CardFooter>
            </CardContent>
          </Card>
        </div>
        {/* Footer */}
      </div>
    </div>
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
