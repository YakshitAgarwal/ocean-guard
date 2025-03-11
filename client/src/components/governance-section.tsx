"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, FileText, Shield, Users, Vote } from 'lucide-react';

export default function GovernanceSection() {
  const [activeProposal, setActiveProposal] = useState(null);
  
  const proposals = [
    {
      id: 1,
      title: "Expand Coral Reef Monitoring Network",
      description: "Proposal to allocate 500,000 tokens to expand the AI monitoring system for coral reefs in the South Pacific.",
      status: "Active",
      votes: { for: 62, against: 18, abstain: 20 },
      endTime: "2 days",
      creator: "0x7Fc...A3b2",
      category: "Infrastructure"
    },
    {
      id: 2,
      title: "Increase Validator Rewards",
      description: "Increase the reward allocation for validators who verify conservation actions from 2% to 3% of tokens.",
      status: "Active",
      votes: { for: 45, against: 40, abstain: 15 },
      endTime: "4 days",
      creator: "0x3Ae...F7c1",
      category: "Tokenomics"
    },
    {
      id: 3,
      title: "Partnership with Ocean Cleanup Foundation",
      description: "Establish a formal partnership with the Ocean Cleanup Foundation to integrate their data into our platform.",
      status: "Passed",
      votes: { for: 78, against: 12, abstain: 10 },
      endTime: "Ended",
      creator: "0x9Bd...E4a5",
      category: "Partnership"
    }
  ];

  return (
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
            
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
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
              Active Proposals
            </CardTitle>
            <CardDescription className="text-slate-400">
              Vote on current proposals or view past decisions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <Card key={proposal.id} className="bg-slate-800/50 border-slate-700">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={
                          proposal.status === "Active" 
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                            : "bg-green-500/10 text-green-400 border-green-500/20"
                        }
                      >
                        {proposal.status}
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                        {proposal.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{proposal.title}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {proposal.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="h-4 w-4" />
                        {proposal.endTime}
                      </div>
                      <div className="text-sm text-slate-400">
                        Created by {proposal.creator}
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>For</span>
                          <span>{proposal.votes.for}%</span>
                        </div>
                        <Progress value={proposal.votes.for} className="h-2 bg-slate-700" indicatorClassName="bg-green-500" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Against</span>
                          <span>{proposal.votes.against}%</span>
                        </div>
                        <Progress value={proposal.votes.against} className="h-2 bg-slate-700" indicatorClassName="bg-red-500" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Abstain</span>
                          <span>{proposal.votes.abstain}%</span>
                        </div>
                        <Progress value={proposal.votes.abstain} className="h-2 bg-slate-700" indicatorClassName="bg-yellow-500" />
                      </div>
                    </div>
                  </CardContent>
                  {proposal.status === "Active" && (
                    <CardFooter className="p-4 pt-0">
                      <div className="flex w-full gap-2">
                        <Button variant="outline" className="flex-1 border-green-500/20 text-green-400 hover:bg-green-500/10">
                          Vote For
                        </Button>
                        <Button variant="outline" className="flex-1 border-red-500/20 text-red-400 hover:bg-red-500/10">
                          Vote Against
                        </Button>
                        <Button variant="outline" className="flex-1 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10">
                          Abstain
                        </Button>
                      </div>
                    </CardFooter>
                  )}
                </Card>
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
  );
}
