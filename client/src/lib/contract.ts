import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

// OceanGuard contract ABI
export const OCEAN_GUARD_ABI = [{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"allowance","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"approve","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"buyCarbonCredit","inputs":[{"name":"creditId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"calculateTokenAmount","inputs":[{"name":"projectType","type":"uint8","internalType":"enum OceanGuard.ProjectType"},{"name":"impactMetric","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"carbonCredits","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"owner","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"},{"name":"forSale","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"carbonSequestrationRate","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"createCarbonCredit","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createProject","inputs":[{"name":"metadata","type":"string","internalType":"string"},{"name":"projectType","type":"uint8","internalType":"enum OceanGuard.ProjectType"},{"name":"impactMetric","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"decimals","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"getAvailableCredits","inputs":[],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"getProjectsByCreator","inputs":[{"name":"creator","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"issueTokens","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"listCarbonCredit","inputs":[{"name":"creditId","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"nextCreditId","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"nextProjectId","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"plasticRemovalRate","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"projects","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"creator","type":"address","internalType":"address"},{"name":"metadata","type":"string","internalType":"string"},{"name":"projectType","type":"uint8","internalType":"enum OceanGuard.ProjectType"},{"name":"impactMetric","type":"uint256","internalType":"uint256"},{"name":"isValidated","type":"bool","internalType":"bool"},{"name":"tokensIssued","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"reefRestorationRate","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setValidator","inputs":[{"name":"validator","type":"address","internalType":"address"},{"name":"status","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"transfer","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"transferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateConversionRates","inputs":[{"name":"newPlasticRate","type":"uint256","internalType":"uint256"},{"name":"newReefRate","type":"uint256","internalType":"uint256"},{"name":"newCarbonRate","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"validateProject","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"validators","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"event","name":"Approval","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"spender","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"CarbonCreditCreated","inputs":[{"name":"creditId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"CarbonCreditListed","inputs":[{"name":"creditId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"price","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"CarbonCreditSold","inputs":[{"name":"creditId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"seller","type":"address","indexed":true,"internalType":"address"},{"name":"buyer","type":"address","indexed":true,"internalType":"address"},{"name":"price","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ConversionRatesUpdated","inputs":[{"name":"plasticRate","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"reefRate","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"carbonRate","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ProjectCreated","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"creator","type":"address","indexed":true,"internalType":"address"},{"name":"projectType","type":"uint8","indexed":false,"internalType":"enum OceanGuard.ProjectType"}],"anonymous":false},{"type":"event","name":"ProjectValidated","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"validator","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"TokensIssued","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"recipient","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"ERC20InsufficientAllowance","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"allowance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC20InsufficientBalance","inputs":[{"name":"sender","type":"address","internalType":"address"},{"name":"balance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC20InvalidApprover","inputs":[{"name":"approver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidReceiver","inputs":[{"name":"receiver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidSender","inputs":[{"name":"sender","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidSpender","inputs":[{"name":"spender","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]}];
export const OCEAN_GUARD_ADDRESS = "0xD74a7CDaE05152497D06a139C867FaD088123879";

export enum ProjectType {
  PLASTIC_REMOVAL = 0,
  REEF_RESTORATION = 1,
  CARBON_SEQUESTRATION = 2
}

export interface Project {
  id: number;
  creator: string;
  metadata: string;
  projectType: ProjectType;
  impactMetric: number;
  isValidated: boolean;
  tokensIssued: boolean;
}

export interface CarbonCredit {
  id: number;
  owner: string;
  amount: number;
  price: string;
  priceInEth: string;
  forSale: boolean;
}

// Hook to get contract instance
export function useOceanGuardContract(provider?: ethers.providers.Web3Provider) {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  
  useEffect(() => {
    if (!provider) return;
    
    const signer = provider.getSigner();
    const oceanGuardContract = new ethers.Contract(
      OCEAN_GUARD_ADDRESS,
      OCEAN_GUARD_ABI,
      signer
    );
    
    setContract(oceanGuardContract);
  }, []);
  
  return contract;
}

// Hook to get user's token balance
export function useTokenBalance(address?: string, provider?: ethers.providers.Web3Provider) {
  const [balance, setBalance] = useState<string>("0");
  const contract = useOceanGuardContract(provider);
  
  useEffect(() => {
    if (!contract || !address) return;
    
    const getBalance = async () => {
      try {
        const balance = await contract.balanceOf(address);
        setBalance(ethers.utils.formatUnits(balance, 18));
      } catch (error) {
        console.error("Error fetching token balance:", error);
      }
    };
    
    getBalance();
    
    // Set up event listener for transfers
    const filter = contract.filters.Transfer(null, address);
    contract.on(filter, getBalance);
    
    return () => {
      contract.removeAllListeners(filter);
    };
  }, [contract, address]);
  
  return balance;
}

// Hook to get conversion rates
export function useConversionRates(provider?: ethers.providers.Web3Provider) {
  const [rates, setRates] = useState({
    plasticRemovalRate: 0,
    reefRestorationRate: 0,
    carbonSequestrationRate: 0
  });
  
  const contract = useOceanGuardContract(provider);
  
  useEffect(() => {
    if (!contract) return;
    
    const getRates = async () => {
      try {
        const plasticRate = await contract.plasticRemovalRate();
        const reefRate = await contract.reefRestorationRate();
        const carbonRate = await contract.carbonSequestrationRate();
        
        setRates({
          plasticRemovalRate: plasticRate.toNumber(),
          reefRestorationRate: reefRate.toNumber(),
          carbonSequestrationRate: carbonRate.toNumber()
        });
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    };
    
    getRates();
    
    // Set up event listener for rate updates
    const filter = contract.filters.ConversionRatesUpdated();
    contract.on(filter, getRates);
    
    return () => {
      contract.removeAllListeners(filter);
    };
  }, [contract]);
  
  return rates;
}

// Hook to get user's projects
export function useUserProjects(address?: string, provider?: ethers.providers.Web3Provider) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  
  const contract = useOceanGuardContract(provider);
  
  useEffect(() => {
    if (!contract || !address) {
      setLoading(false);
      return;
    }
    
    const getProjects = async () => {
      try {
        setLoading(true);
        const projectIds = await contract.getProjectsByCreator(address);
        
        const projectPromises = projectIds.map(async (id: number) => {
          const project = await contract.projects(id);
          return {
            id: project.id.toNumber(),
            creator: project.creator,
            metadata: project.metadata,
            projectType: project.projectType,
            impactMetric: project.impactMetric.toNumber(),
            isValidated: project.isValidated,
            tokensIssued: project.tokensIssued
          };
        });
        
        const projectsData = await Promise.all(projectPromises);
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching user projects:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getProjects();
    
    // Set up event listener for new projects
    const filterCreated = contract.filters.ProjectCreated(null, address);
    const filterValidated = contract.filters.ProjectValidated();
    const filterTokensIssued = contract.filters.TokensIssued(null, address);
    
    contract.on(filterCreated, getProjects);
    contract.on(filterValidated, getProjects);
    contract.on(filterTokensIssued, getProjects);
    
    return () => {
      contract.removeAllListeners(filterCreated);
      contract.removeAllListeners(filterValidated);
      contract.removeAllListeners(filterTokensIssued);
    };
  }, [contract, address]);
  
  return { projects, loading };
}

// Hook to get available carbon credits
export function useAvailableCarbonCredits(provider?: ethers.providers.Web3Provider) {
  const [credits, setCredits] = useState<CarbonCredit[]>([]);
  const [loading, setLoading] = useState(true);
  
  const contract = useOceanGuardContract(provider);
  
  useEffect(() => {
    if (!contract) {
      setLoading(false);
      return;
    }
    
    const getCredits = async () => {
      try {
        setLoading(true);
        const creditIds = await contract.getAvailableCredits();
        
        const creditPromises = creditIds.map(async (id: number) => {
          const credit = await contract.carbonCredits(id);
          return {
            id: credit.id.toNumber(),
            owner: credit.owner,
            amount: credit.amount.toNumber(),
            price: credit.price.toString(),
            priceInEth: ethers.utils.formatEther(credit.price),
            forSale: credit.forSale
          };
        });
        
        const creditsData = await Promise.all(creditPromises);
        setCredits(creditsData);
      } catch (error) {
        console.error("Error fetching available carbon credits:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getCredits();
    
    // Set up event listeners for credit changes
    const filterCreated = contract.filters.CarbonCreditCreated();
    const filterListed = contract.filters.CarbonCreditListed();
    const filterSold = contract.filters.CarbonCreditSold();
    
    contract.on(filterCreated, getCredits);
    contract.on(filterListed, getCredits);
    contract.on(filterSold, getCredits);
    
    return () => {
      contract.removeAllListeners(filterCreated);
      contract.removeAllListeners(filterListed);
      contract.removeAllListeners(filterSold);
    };
  }, [contract]);
  
  return { credits, loading };
}

// Function to create a new project
export async function createProject(
  contract: ethers.Contract,
  metadata: string,
  projectType: ProjectType,
  impactMetric: number
) {
  if (!contract) throw new Error("Contract not initialized");
  
  try {
    const tx = await contract.createProject(metadata, projectType, impactMetric);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

// Function to validate a project
export async function validateProject(contract: ethers.Contract, projectId: number) {
  if (!contract) throw new Error("Contract not initialized");
  
  try {
    const tx = await contract.validateProject(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error validating project:", error);
    throw error;
  }
}

// Function to issue tokens for a project
export async function issueTokens(contract: ethers.Contract, projectId: number) {
  if (!contract) throw new Error("Contract not initialized");
  
  try {
    const tx = await contract.issueTokens(projectId);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error issuing tokens:", error);
    throw error;
  }
}

// Function to create a carbon credit
export async function createCarbonCredit(
  contract: ethers.Contract,
  projectId: number,
  amount: number
) {
  if (!contract) throw new Error("Contract not initialized");
  
  try {
    const tx = await contract.createCarbonCredit(projectId, amount);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error creating carbon credit:", error);
    throw error;
  }
}

// Function to list a carbon credit for sale
export async function listCarbonCredit(
  contract: ethers.Contract,
  creditId: number,
  price: string
) {
  if (!contract) throw new Error("Contract not initialized");
  
  try {
    const priceInWei = ethers.utils.parseEther(price);
    const tx = await contract.listCarbonCredit(creditId, priceInWei);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error listing carbon credit:", error);
    throw error;
  }
}

// Function to buy a carbon credit
export async function buyCarbonCredit(
  contract: ethers.Contract,
  creditId: number,
  price: string
) {
  if (!contract) throw new Error("Contract not initialized");
  
  try {
    const priceInWei = ethers.utils.parseEther(price);
    const tx = await contract.buyCarbonCredit(creditId, { value: priceInWei });
    await tx.wait();
    return tx;
  } catch (error) {
    console.error("Error buying carbon credit:", error);
    throw error;
  }
}

// Function to check if an address is a validator
export async function isValidator(contract: ethers.Contract, address: string) {
  if (!contract) return false;
  
  try {
    return await contract.validators(address);
  } catch (error) {
    console.error("Error checking validator status:", error);
    return false;
  }
}

// Function to calculate token amount for a project
export async function calculateTokenAmount(
  contract: ethers.Contract,
  projectType: ProjectType,
  impactMetric: number
) {
  if (!contract) return "0";
  
  try {
    const amount = await contract.calculateTokenAmount(projectType, impactMetric);
    return ethers.utils.formatUnits(amount, 18);
  } catch (error) {
    console.error("Error calculating token amount:", error);
    return "0";
  }
}
