"use client"

import type React from "react"

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
import { useToast } from "@/hooks/use-toast"
import { OCEAN_GUARD_ADDRESS, OCEAN_GUARD_ABI, type CarbonCredit } from "@/lib/contract"

interface ListCreditDialogProps {
  credit: CarbonCredit
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function ListCreditDialog({ credit, onSuccess, trigger }: ListCreditDialogProps) {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { toast } = useToast()

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [price, setPrice] = useState("")

  const handleSubmit = async () => {
    if (!isConnected) {
      open()
      return
    }

    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      toast({
        title: "Invalid price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (!walletClient || !publicClient) {
        throw new Error("Wallet not connected")
      }

      // Convert price to wei
      const priceInWei = ethers.utils.parseEther(price)

      // Create transaction
      const { request } = await publicClient.simulateContract({
        address: OCEAN_GUARD_ADDRESS as `0x${string}`,
        abi: OCEAN_GUARD_ABI,
        functionName: "listCarbonCredit",
        args: [credit.id, priceInWei],
        account: address,
      })

      const hash = await walletClient.writeContract(request)

      toast({
        title: "Credit listed!",
        description: `Your carbon credit is now available for sale at ${price} ETH.`,
      })

      setIsOpen(false)
      setPrice("")

      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      console.error("Error listing credit:", error)
      toast({
        title: "Error listing credit",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            List
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-slate-900 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>List Carbon Credit</DialogTitle>
          <DialogDescription className="text-slate-400">
            Set a price to list your carbon credit for sale.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="bg-slate-800/50 p-3 rounded-md border border-slate-700">
            <div className="text-sm text-slate-400">Credit Amount</div>
            <div className="text-xl font-bold text-white">{credit.amount} tons CO₂</div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price (ETH)</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price in ETH"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} className="border-slate-700 text-slate-300">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="bg-blue-500 hover:bg-blue-600">
            {isLoading ? "Listing..." : "List for Sale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

