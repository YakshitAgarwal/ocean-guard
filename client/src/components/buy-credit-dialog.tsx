"use client"

import { useState } from "react"
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { 
  OCEAN_GUARD_ADDRESS, 
  OCEAN_GUARD_ABI,
  CarbonCredit
} from "@/lib/contract"

interface BuyCreditDialogProps {
  credit: CarbonCredit;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function BuyCreditDialog({ credit, onSuccess, trigger }: BuyCreditDialogProps) {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { toast } = useToast()
  
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async () => {
    if (!isConnected) {
      open()
      return
    }
    
    setIsLoading(true)
    
    try {
      if (!walletClient || !publicClient) {
        throw new Error("Wallet not connected")
      }
      
      // Create transaction
      const { request } = await publicClient.simulateContract({
        address: OCEAN_GUARD_ADDRESS as `0x${string}`,
        abi: OCEAN_GUARD_ABI,
        functionName: 'buyCarbonCredit',
        args: [credit.id],
        account: address,
        value: BigInt(credit.price)
      })
      
      const hash = await walletClient.writeContract(request)
      
      toast({
        title: "Credit purchased!",
        description: `You have successfully purchased ${credit.amount} tons of carbon credits.`,
      })
      
      setIsOpen(false)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Error buying credit:", error)
      toast({
        title: "Error purchasing credit",
        description: error.message || "An unknown error occurred",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button className="w-full bg-blue-500 hover:bg-blue-600">Buy Credits</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Buy Carbon Credit</DialogTitle>
          <DialogDescription className="text-slate-400">
            Confirm your purchase of carbon credits.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700">
            <div className="text-sm text-slate-400">Credit Amount</div>
            <div className="text-xl font-bold text-white">{credit.amount} tons CO₂</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700">
            <div className="text-sm text-slate-400">Price</div>
            <div className="text-xl font-bold text-white">{credit.priceInEth} ETH</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700">
            <div className="text-sm text-slate-400">Seller</div>
            <div className="text-sm font-medium text-white truncate">{credit.owner}</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="border-slate-700 text-slate-300">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
            {isLoading ? "Processing..." : "Confirm Purchase"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
