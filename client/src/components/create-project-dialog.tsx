"use client"

import { useState } from "react"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { ethers } from "ethers"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  OCEAN_GUARD_ADDRESS,
  OCEAN_GUARD_ABI,
  ProjectType,
  useOceanGuardContract,
  calculateTokenAmount,
} from "@/lib/contract"

export function CreateProjectDialog() {
//   const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [projectType, setProjectType] = useState<string>(ProjectType.PLASTIC_REMOVAL.toString())
  const [impactMetric, setImpactMetric] = useState("")
  const [estimatedTokens, setEstimatedTokens] = useState("0")

  const contract = useOceanGuardContract(
    walletClient ? new ethers.providers.Web3Provider(walletClient as any) : undefined,
  )

  const handleImpactChange = async (value: string) => {
    setImpactMetric(value)

    if (contract && value && !isNaN(Number(value))) {
      try {
        const tokens = await calculateTokenAmount(contract, Number(projectType) as ProjectType, Number(value))
        setEstimatedTokens(tokens)
      } catch (error) {
        console.error("Error calculating tokens:", error)
      }
    } else {
      setEstimatedTokens("0")
    }
  }

  const handleSubmit = async () => {
    if (!isConnected) {
    //   open()
      return
    }

    if (!projectName || !projectDescription || !projectType || !impactMetric) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (!walletClient || !publicClient) {
        throw new Error("Wallet not connected")
      }

      // Create metadata JSON
      const metadata = JSON.stringify({
        name: projectName,
        description: projectDescription,
        createdAt: new Date().toISOString(),
      })

      // Create transaction
      const { request } = await publicClient.simulateContract({
        address: OCEAN_GUARD_ADDRESS as `0x${string}`,
        abi: OCEAN_GUARD_ABI,
        functionName: "createProject",
        args: [metadata, Number(projectType), Number(impactMetric)],
        account: address,
      })

      const hash = await walletClient.writeContract(request)

      toast({
        title: "Project created!",
        description: "Your conservation project has been submitted for validation.",
      })

      setIsOpen(false)
      resetForm()
    } catch (error: any) {
      console.error("Error creating project:", error)
      toast({
        title: "Error creating project",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setProjectName("")
    setProjectDescription("")
    setProjectType(ProjectType.PLASTIC_REMOVAL.toString())
    setImpactMetric("")
    setEstimatedTokens("0")
  }

  const getImpactLabel = () => {
    switch (Number(projectType)) {
      case ProjectType.PLASTIC_REMOVAL:
        return "Plastic Removed (kg)"
      case ProjectType.REEF_RESTORATION:
        return "Reef Area Restored (m²)"
      case ProjectType.CARBON_SEQUESTRATION:
        return "Carbon Sequestered (tons)"
      default:
        return "Impact Metric"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600">Create Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Create Conservation Project</DialogTitle>
          <DialogDescription className="text-slate-400">
            Submit your ocean conservation project to earn OCEAN tokens upon validation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="e.g., Pacific Ocean Cleanup Initiative"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Project Description</Label>
            <Textarea
              id="project-description"
              placeholder="Describe your conservation project and its impact..."
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-type">Project Type</Label>
            <Select value={projectType} onValueChange={setProjectType}>
              <SelectTrigger id="project-type" className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select project type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value={ProjectType.PLASTIC_REMOVAL.toString()}>Plastic Removal</SelectItem>
                <SelectItem value={ProjectType.REEF_RESTORATION.toString()}>Reef Restoration</SelectItem>
                <SelectItem value={ProjectType.CARBON_SEQUESTRATION.toString()}>Carbon Sequestration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="impact-metric">{getImpactLabel()}</Label>
            <Input
              id="impact-metric"
              type="number"
              placeholder="Enter amount"
              value={impactMetric}
              onChange={(e) => handleImpactChange(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700">
            <div className="text-sm text-slate-400">Estimated tokens to be earned:</div>
            <div className="text-xl font-bold text-blue-400">{estimatedTokens} OCEAN</div>
            <div className="text-xs text-slate-500 mt-1">Tokens will be issued after project validation</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="border-slate-700 text-slate-300">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
            {isLoading ? "Creating..." : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

