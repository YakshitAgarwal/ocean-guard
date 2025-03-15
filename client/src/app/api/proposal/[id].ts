// pages/api/proposal/[id].js
import { ethers } from 'ethers';

const governanceAbi = [
  'function getProposal(uint256 _proposalId) external view returns (uint256 id, address creator, string title, string description, uint8 category, uint8 status, uint256 startTime, uint256 endTime, uint256 forVotes, uint256 againstVotes, uint256 abstainVotes, bool executed, address targetContract)'
];

const GOVERNANCE_CONTRACT = '0x2CD44dad8b8f471E96c3433D4c12b2cc8D79aa6B';
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "https://eth-mainnet.g.alchemy.com/v2/your-api-key";

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, provider);
    
    const proposal = await contract.getProposal(id);
    
    // Convert to a regular object that can be serialized
    const formattedProposal = {
      id: Number(proposal[0]),
      creator: proposal[1],
      title: proposal[2],
      description: proposal[3],
      category: Number(proposal[4]),
      status: Number(proposal[5]),
      startTime: Number(proposal[6]),
      endTime: Number(proposal[7]),
      forVotes: proposal[8].toString(),
      againstVotes: proposal[9].toString(),
      abstainVotes: proposal[10].toString(),
      executed: proposal[11],
      targetContract: proposal[12]
    };
    
    res.status(200).json(formattedProposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    res.status(500).json({ error: 'Failed to fetch proposal' });
  }
}