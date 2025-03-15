// lib/contract.js
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { parseEther, formatEther } from 'viem'; // keeping viem for ether formatting

// OceanGuard Token ABI - simplified for basic functionality
const tokenAbi = [{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"allowance","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"spender","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"approve","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"buyCarbonCredit","inputs":[{"name":"creditId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"payable"},{"type":"function","name":"calculateTokenAmount","inputs":[{"name":"projectType","type":"uint8","internalType":"enum OceanGuard.ProjectType"},{"name":"impactMetric","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"carbonCredits","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"owner","type":"address","internalType":"address"},{"name":"amount","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"},{"name":"forSale","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"carbonSequestrationRate","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"createCarbonCredit","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"},{"name":"amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createProject","inputs":[{"name":"metadata","type":"string","internalType":"string"},{"name":"projectType","type":"uint8","internalType":"enum OceanGuard.ProjectType"},{"name":"impactMetric","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"decimals","inputs":[],"outputs":[{"name":"","type":"uint8","internalType":"uint8"}],"stateMutability":"view"},{"type":"function","name":"getAvailableCredits","inputs":[],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"getProjectsByCreator","inputs":[{"name":"creator","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"issueTokens","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"listCarbonCredit","inputs":[{"name":"creditId","type":"uint256","internalType":"uint256"},{"name":"price","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"nextCreditId","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"nextProjectId","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"plasticRemovalRate","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"projects","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"creator","type":"address","internalType":"address"},{"name":"metadata","type":"string","internalType":"string"},{"name":"projectType","type":"uint8","internalType":"enum OceanGuard.ProjectType"},{"name":"impactMetric","type":"uint256","internalType":"uint256"},{"name":"isValidated","type":"bool","internalType":"bool"},{"name":"tokensIssued","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"reefRestorationRate","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setValidator","inputs":[{"name":"validator","type":"address","internalType":"address"},{"name":"status","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"transfer","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"transferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"nonpayable"},{"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateConversionRates","inputs":[{"name":"newPlasticRate","type":"uint256","internalType":"uint256"},{"name":"newReefRate","type":"uint256","internalType":"uint256"},{"name":"newCarbonRate","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"validateProject","inputs":[{"name":"projectId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"validators","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"event","name":"Approval","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"spender","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"CarbonCreditCreated","inputs":[{"name":"creditId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"CarbonCreditListed","inputs":[{"name":"creditId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"price","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"CarbonCreditSold","inputs":[{"name":"creditId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"seller","type":"address","indexed":true,"internalType":"address"},{"name":"buyer","type":"address","indexed":true,"internalType":"address"},{"name":"price","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ConversionRatesUpdated","inputs":[{"name":"plasticRate","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"reefRate","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"carbonRate","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ProjectCreated","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"creator","type":"address","indexed":true,"internalType":"address"},{"name":"projectType","type":"uint8","indexed":false,"internalType":"enum OceanGuard.ProjectType"}],"anonymous":false},{"type":"event","name":"ProjectValidated","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"validator","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"TokensIssued","inputs":[{"name":"projectId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"recipient","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"ERC20InsufficientAllowance","inputs":[{"name":"spender","type":"address","internalType":"address"},{"name":"allowance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC20InsufficientBalance","inputs":[{"name":"sender","type":"address","internalType":"address"},{"name":"balance","type":"uint256","internalType":"uint256"},{"name":"needed","type":"uint256","internalType":"uint256"}]},{"type":"error","name":"ERC20InvalidApprover","inputs":[{"name":"approver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidReceiver","inputs":[{"name":"receiver","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidSender","inputs":[{"name":"sender","type":"address","internalType":"address"}]},{"type":"error","name":"ERC20InvalidSpender","inputs":[{"name":"spender","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]}]

// OceanGuardGovernance ABI based on your contract
const governanceAbi = [{"type":"constructor","inputs":[{"name":"_oceanGuardToken","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},{"type":"function","name":"MIN_VOTING_DELAY","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"MIN_VOTING_PERIOD","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"PROPOSAL_DURATION","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"QUORUM_PERCENTAGE","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"VOTE_THRESHOLD_PERCENTAGE","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"cancelProposal","inputs":[{"name":"_proposalId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"castVote","inputs":[{"name":"_proposalId","type":"uint256","internalType":"uint256"},{"name":"_voteType","type":"uint8","internalType":"enum OceanGuardGovernance.VoteType"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createProposal","inputs":[{"name":"_title","type":"string","internalType":"string"},{"name":"_description","type":"string","internalType":"string"},{"name":"_category","type":"uint8","internalType":"enum OceanGuardGovernance.ProposalCategory"},{"name":"_executionData","type":"bytes","internalType":"bytes"},{"name":"_targetContract","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"delegate","inputs":[{"name":"_delegatee","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"delegates","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"emergencyPauseGovernance","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"executeProposal","inputs":[{"name":"_proposalId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"finalizeProposal","inputs":[{"name":"_proposalId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getActiveProposals","inputs":[],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"getProposal","inputs":[{"name":"_proposalId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple","internalType":"struct OceanGuardGovernance.ProposalSummary","components":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"creator","type":"address","internalType":"address"},{"name":"title","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"category","type":"uint8","internalType":"enum OceanGuardGovernance.ProposalCategory"},{"name":"status","type":"uint8","internalType":"enum OceanGuardGovernance.ProposalStatus"},{"name":"startTime","type":"uint256","internalType":"uint256"},{"name":"endTime","type":"uint256","internalType":"uint256"},{"name":"forVotes","type":"uint256","internalType":"uint256"},{"name":"againstVotes","type":"uint256","internalType":"uint256"},{"name":"abstainVotes","type":"uint256","internalType":"uint256"},{"name":"executed","type":"bool","internalType":"bool"},{"name":"targetContract","type":"address","internalType":"address"}]}],"stateMutability":"view"},{"type":"function","name":"getProposalCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getProposalsByCategory","inputs":[{"name":"_category","type":"uint8","internalType":"enum OceanGuardGovernance.ProposalCategory"}],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"getProposalsByStatus","inputs":[{"name":"_status","type":"uint8","internalType":"enum OceanGuardGovernance.ProposalStatus"}],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"getStakedBalance","inputs":[{"name":"_user","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getUserDelegate","inputs":[{"name":"_user","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getVoteInfo","inputs":[{"name":"_proposalId","type":"uint256","internalType":"uint256"},{"name":"_voter","type":"address","internalType":"address"}],"outputs":[{"name":"hasVoted","type":"bool","internalType":"bool"},{"name":"voteType","type":"uint8","internalType":"enum OceanGuardGovernance.VoteType"},{"name":"weight","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getVotingPower","inputs":[{"name":"_account","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"governancePaused","inputs":[],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"oceanGuardToken","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IOceanGuard"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"proposals","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"id","type":"uint256","internalType":"uint256"},{"name":"creator","type":"address","internalType":"address"},{"name":"title","type":"string","internalType":"string"},{"name":"description","type":"string","internalType":"string"},{"name":"category","type":"uint8","internalType":"enum OceanGuardGovernance.ProposalCategory"},{"name":"status","type":"uint8","internalType":"enum OceanGuardGovernance.ProposalStatus"},{"name":"startTime","type":"uint256","internalType":"uint256"},{"name":"endTime","type":"uint256","internalType":"uint256"},{"name":"forVotes","type":"uint256","internalType":"uint256"},{"name":"againstVotes","type":"uint256","internalType":"uint256"},{"name":"abstainVotes","type":"uint256","internalType":"uint256"},{"name":"executed","type":"bool","internalType":"bool"},{"name":"executionData","type":"bytes","internalType":"bytes"},{"name":"targetContract","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"resumeGovernance","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"stakeTokens","inputs":[{"name":"_amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"stakedBalances","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"totalStaked","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"undelegate","inputs":[],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"unstakeTokens","inputs":[{"name":"_amount","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateGovernanceParameters","inputs":[{"name":"_newVotingDelay","type":"uint256","internalType":"uint256"},{"name":"_newVotingPeriod","type":"uint256","internalType":"uint256"},{"name":"_newVoteThreshold","type":"uint256","internalType":"uint256"},{"name":"_newQuorum","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"withdrawERC20","inputs":[{"name":"_token","type":"address","internalType":"address"},{"name":"_amount","type":"uint256","internalType":"uint256"},{"name":"_recipient","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"DelegateChanged","inputs":[{"name":"delegator","type":"address","indexed":true,"internalType":"address"},{"name":"fromDelegate","type":"address","indexed":true,"internalType":"address"},{"name":"toDelegate","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ERC20Withdrawn","inputs":[{"name":"token","type":"address","indexed":false,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"recipient","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"GovernancePaused","inputs":[{"name":"pauser","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"GovernanceResumed","inputs":[{"name":"resumer","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ProposalCanceled","inputs":[{"name":"proposalId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ProposalCreated","inputs":[{"name":"proposalId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"creator","type":"address","indexed":true,"internalType":"address"},{"name":"title","type":"string","indexed":false,"internalType":"string"},{"name":"category","type":"uint8","indexed":false,"internalType":"enum OceanGuardGovernance.ProposalCategory"},{"name":"startTime","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"endTime","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ProposalExecuted","inputs":[{"name":"proposalId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ProposalStatusChanged","inputs":[{"name":"proposalId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"newStatus","type":"uint8","indexed":false,"internalType":"enum OceanGuardGovernance.ProposalStatus"}],"anonymous":false},{"type":"event","name":"QuorumChanged","inputs":[{"name":"newQuorum","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TokensStaked","inputs":[{"name":"user","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"TokensUnstaked","inputs":[{"name":"user","type":"address","indexed":true,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"VoteCast","inputs":[{"name":"proposalId","type":"uint256","indexed":true,"internalType":"uint256"},{"name":"voter","type":"address","indexed":true,"internalType":"address"},{"name":"voteType","type":"uint8","indexed":false,"internalType":"enum OceanGuardGovernance.VoteType"},{"name":"weight","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"VoteThresholdChanged","inputs":[{"name":"newVoteThreshold","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"VotingDelayChanged","inputs":[{"name":"newVotingDelay","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"VotingPeriodChanged","inputs":[{"name":"newVotingPeriod","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},{"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]},{"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]},{"type":"error","name":"SafeERC20FailedOperation","inputs":[{"name":"token","type":"address","internalType":"address"}]}]

// Contract addresses
const GOVERNANCE_CONTRACT = '0x2CD44dad8b8f471E96c3433D4c12b2cc8D79aa6B';
// You'll need to provide the token contract address
const TOKEN_CONTRACT = '0xD74a7CDaE05152497D06a139C867FaD088123879'; // Replace with your actual token contract address

// Enum mapping
export const ProposalCategory = {
  Infrastructure: 0,
  Tokenomics: 1,
  Partnership: 2,
  Protocol: 3,
  Research: 4,
  Other: 5
};

export const ProposalStatus = {
  Active: 0,
  Passed: 1,
  Failed: 2,
  Canceled: 3
};

export const VoteType = {
  For: 0,
  Against: 1,
  Abstain: 2
};

// Utility function to get provider and signer
const getEthersProvider = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

const getSigner = async () => {
  const provider = getEthersProvider();
  if (!provider) return null;
  
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
};

// Convert contract data to UI format
export const formatProposal = (proposal) => {
  const statusMap = ['Active', 'Passed', 'Failed', 'Canceled'];
  const categoryMap = ['Infrastructure', 'Tokenomics', 'Partnership', 'Protocol', 'Research', 'Other'];
  
  const endTimeString = new Date(Number(proposal.endTime) * 1000) > new Date() 
    ? `${Math.ceil((Number(proposal.endTime) * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days` 
    : 'Ended';
  
  const totalVotes = Number(proposal.forVotes) + Number(proposal.againstVotes) + Number(proposal.abstainVotes);
  
  return {
    id: Number(proposal.id),
    title: proposal.title,
    description: proposal.description,
    status: statusMap[proposal.status],
    category: categoryMap[proposal.category],
    creator: proposal.creator,
    endTime: endTimeString,
    votes: {
      for: totalVotes > 0 ? Math.round((Number(proposal.forVotes) / totalVotes) * 100) : 0,
      against: totalVotes > 0 ? Math.round((Number(proposal.againstVotes) / totalVotes) * 100) : 0,
      abstain: totalVotes > 0 ? Math.round((Number(proposal.abstainVotes) / totalVotes) * 100) : 0
    },
    startTime: new Date(Number(proposal.startTime) * 1000).toLocaleString(),
    executed: proposal.executed,
    targetContract: proposal.targetContract,
    rawData: proposal
  };
};

// Custom hook for account management
export function useAccount() {
  const [address, setAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const provider = getEthersProvider();
      if (!provider) return;
      
      const accounts = await provider.listAccounts();
      if (accounts && accounts.length > 0) {
        setAddress(accounts[0]);
        setIsConnected(true);
      }
    };
    
    checkConnection();
    
    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress(null);
          setIsConnected(false);
        }
      });
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connect = async () => {
    try {
      const signer = await getSigner();
      if (signer) {
        const address = await signer.getAddress();
        setAddress(address);
        setIsConnected(true);
        return true;
      }
    } catch (error) {
      console.error("Failed to connect:", error);
    }
    return false;
  };

  return { address, isConnected, connect };
}

// Hook to fetch token balance
export function useTokenBalance(address) {
  const [balance, setBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;
      
      setIsLoading(true);
      try {
        const provider = getEthersProvider();
        if (!provider) throw new Error("No provider available");
        
        const tokenContract = new ethers.Contract(TOKEN_CONTRACT, tokenAbi, provider);
        const balanceResult = await tokenContract.balanceOf(address);
        
        setBalance(formatEther(balanceResult.toString()));
        setError(null);
      } catch (err) {
        console.error("Error fetching token balance:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
    
    // Set up an interval to refresh the balance periodically
    const intervalId = setInterval(fetchBalance, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [address]);

  return { balance, isLoading, error };
}

// Hook to fetch staked balance
export function useStakedBalance(address) {
  const [stakedBalance, setStakedBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStakedBalance = async () => {
      if (!address) return;
      
      setIsLoading(true);
      try {
        const provider = getEthersProvider();
        if (!provider) throw new Error("No provider available");
        
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, provider);
        const balanceResult = await governanceContract.getStakedBalance(address);
        
        setStakedBalance(formatEther(balanceResult.toString()));
        setError(null);
      } catch (err) {
        console.error("Error fetching staked balance:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStakedBalance();
    
    // Set up an interval to refresh the balance periodically
    const intervalId = setInterval(fetchStakedBalance, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [address]);

  return { stakedBalance, isLoading, error };
}

// Hook to fetch total staked
export function useTotalStaked() {
  const [totalStaked, setTotalStaked] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalStaked = async () => {
      setIsLoading(true);
      try {
        const provider = getEthersProvider();
        if (!provider) throw new Error("No provider available");
        
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, provider);
        const result = await governanceContract.totalStaked();
        
        setTotalStaked(formatEther(result.toString()));
        setError(null);
      } catch (err) {
        console.error("Error fetching total staked:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTotalStaked();
    
    // Set up an interval to refresh periodically
    const intervalId = setInterval(fetchTotalStaked, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  return { totalStaked, isLoading, error };
}

// Hook to fetch voting power
export function useVotingPower(address) {
  const [votingPower, setVotingPower] = useState('0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVotingPower = async () => {
      if (!address) return;
      
      setIsLoading(true);
      try {
        const provider = getEthersProvider();
        if (!provider) throw new Error("No provider available");
        
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, provider);
        const result = await governanceContract.getVotingPower(address);
        
        setVotingPower(formatEther(result.toString()));
        setError(null);
      } catch (err) {
        console.error("Error fetching voting power:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVotingPower();
    
    // Set up an interval to refresh periodically
    const intervalId = setInterval(fetchVotingPower, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [address]);

  return { votingPower, isLoading, error };
}

// Hook to fetch active proposals
export function useActiveProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActiveProposals = async () => {
      setLoading(true);
      try {
        const provider = getEthersProvider();
        if (!provider) throw new Error("No provider available");
        
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, provider);
        const proposalIds = await governanceContract.getActiveProposals();
        
        if (proposalIds && proposalIds.length > 0) {
          const fetchedProposals = await Promise.all(
            proposalIds.map(async (id) => {
              const proposal = await fetchProposal(Number(id));
              return proposal;
            })
          );
          setProposals(fetchedProposals);
          setError(null);
        } else {
          setProposals([]);
        }
      } catch (err) {
        console.error("Error fetching active proposals:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveProposals();
    
    // Set up an interval to refresh periodically
    const intervalId = setInterval(fetchActiveProposals, 60000); // every minute
    
    return () => clearInterval(intervalId);
  }, []);

  return { proposals, loading, error };
}

// Hook to fetch proposals by status
export function useProposalsByStatus(status) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusCode = ProposalStatus[status];

  useEffect(() => {
    const fetchProposalsByStatus = async () => {
      setLoading(true);
      try {
        const provider = getEthersProvider();
        if (!provider) throw new Error("No provider available");
        
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, provider);
        const proposalIds = await governanceContract.getProposalsByStatus(statusCode);
        
        if (proposalIds && proposalIds.length > 0) {
          const fetchedProposals = await Promise.all(
            proposalIds.map(async (id) => {
              const proposal = await fetchProposal(Number(id));
              return proposal;
            })
          );
          setProposals(fetchedProposals);
          setError(null);
        } else {
          setProposals([]);
        }
      } catch (err) {
        console.error(`Error fetching ${status} proposals:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProposalsByStatus();
    
    // Set up an interval to refresh periodically
    const intervalId = setInterval(fetchProposalsByStatus, 60000); // every minute
    
    return () => clearInterval(intervalId);
  }, [status, statusCode]);

  return { proposals, loading, error };
}

// Function to fetch a single proposal
export async function fetchProposal(proposalId) {
    try {
      // First try to fetch from API
      const result = await fetch(`/api/proposal/${proposalId}`);
      const data = await result.json();
      return formatProposal(data);
    } catch (apiError) {
      console.error("Error fetching proposal from API:", apiError);
      
      // Fallback to direct contract call if API fails
      try {
        const provider = getEthersProvider();
        if (!provider) throw new Error("No provider available");
        
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, provider);
        const rawProposal = await governanceContract.getProposal(proposalId);
        
        // Convert from array to object
        const proposalObj = {
          id: rawProposal[0],
          creator: rawProposal[1],
          title: rawProposal[2],
          description: rawProposal[3],
          category: rawProposal[4],
          status: rawProposal[5],
          startTime: rawProposal[6],
          endTime: rawProposal[7],
          forVotes: rawProposal[8],
          againstVotes: rawProposal[9],
          abstainVotes: rawProposal[10],
          executed: rawProposal[11],
          targetContract: rawProposal[12]
        };
        
        return formatProposal(proposalObj);
      } catch (contractError) {
        console.error("Error fetching proposal from contract:", contractError);
        throw contractError;
      }
    }
  }
  
  // Hook to create a proposal
  export function useCreateProposal() {
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);
  
    const createProposal = useCallback(async (title, description, category, executionData = '0x', targetContract = '0x0000000000000000000000000000000000000000') => {
      if (!address) {
        setError("Wallet not connected");
        setIsError(true);
        return;
      }
      
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);
      
      try {
        const signer = await getSigner();
        if (!signer) throw new Error("Failed to get signer");
        
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, signer);
        
        const tx = await governanceContract.createProposal(
          title, 
          description, 
          ProposalCategory[category], 
          executionData, 
          targetContract
        );
        
        setTxHash(tx.hash);
        
        // Wait for transaction to be mined
        await tx.wait();
        
        setIsSuccess(true);
      } catch (err) {
        console.error("Error creating proposal:", err);
        setError(err.message);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, [address]);
  
    return { createProposal, isLoading, isSuccess, isError, error, txHash };
  }
  
  // Hook to cast a vote
  export function useCastVote() {
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);
  
    const castVote = useCallback(async (proposalId, voteType) => {
      if (!address) {
        setError("Wallet not connected");
        setIsError(true);
        return;
      }
      
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);
      
      try {
        const signer = await getSigner();
        if (!signer) throw new Error("Failed to get signer");
        
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, signer);
        
        const tx = await governanceContract.castVote(
          proposalId,
          VoteType[voteType]
        );
        
        setTxHash(tx.hash);
        
        // Wait for transaction to be mined
        await tx.wait();
        
        setIsSuccess(true);
      } catch (err) {
        console.error("Error casting vote:", err);
        setError(err.message);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, [address]);
  
    return { castVote, isLoading, isSuccess, isError, error, txHash };
  }
  
  // Hook to stake tokens
  export function useStakeTokens() {
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);
  
    const stakeTokens = useCallback(async (amount) => {
      if (!address) {
        setError("Wallet not connected");
        setIsError(true);
        return;
      }
      
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);
      
      try {
        const signer = await getSigner();
        if (!signer) throw new Error("Failed to get signer");
        
        const amountWei = parseEther(amount);
        
        // First approve the tokens
        setIsApproving(true);
        const tokenContract = new ethers.Contract(TOKEN_CONTRACT, tokenAbi, signer);
        
        const approveTx = await tokenContract.approve(GOVERNANCE_CONTRACT, amountWei);
        await approveTx.wait();
        setIsApproving(false);
        
        // Then stake the tokens
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, signer);
        
        const stakeTx = await governanceContract.stakeTokens(amountWei);
        setTxHash(stakeTx.hash);
        
        // Wait for transaction to be mined
        await stakeTx.wait();
        
        setIsSuccess(true);
      } catch (err) {
        console.error("Error staking tokens:", err);
        setError(err.message);
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsApproving(false);
      }
    }, [address]);
  
    return { stakeTokens, isLoading, isApproving, isSuccess, isError, error, txHash };
  }
  
  // Hook to unstake tokens
  export function useUnstakeTokens() {
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState(null);
    const [txHash, setTxHash] = useState(null);
  
    const unstakeTokens = useCallback(async (amount) => {
      if (!address) {
        setError("Wallet not connected");
        setIsError(true);
        return;
      }
      
      setIsLoading(true);
      setIsSuccess(false);
      setIsError(false);
      setError(null);
      
      try {
        const signer = await getSigner();
        if (!signer) throw new Error("Failed to get signer");
        
        const amountWei = parseEther(amount);
        const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, signer);
        
        const tx = await governanceContract.unstakeTokens(amountWei);
        setTxHash(tx.hash);
        
        // Wait for transaction to be mined
        await tx.wait();
        
        setIsSuccess(true);
      } catch (err) {
        console.error("Error unstaking tokens:", err);
        setError(err.message);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }, [address]);
  
    return { unstakeTokens, isLoading, isSuccess, isError, error, txHash };
  }
  
  // Hook to check if user has voted on a proposal
  export function useHasVoted(proposalId, address) {
    const [voteInfo, setVoteInfo] = useState({
      hasVoted: false,
      voteType: null,
      weight: '0'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchVoteInfo = async () => {
        if (!address || proposalId === undefined) return;
        
        setIsLoading(true);
        try {
          const provider = getEthersProvider();
          if (!provider) throw new Error("No provider available");
          
          const governanceContract = new ethers.Contract(GOVERNANCE_CONTRACT, governanceAbi, provider);
          const result = await governanceContract.getVoteInfo(proposalId, address);
          
          setVoteInfo({
            hasVoted: result[0],
            voteType: result[1] !== undefined ? ['For', 'Against', 'Abstain'][result[1]] : null,
            weight: result[2] ? formatEther(result[2].toString()) : '0'
          });
          setError(null);
        } catch (err) {
          console.error("Error fetching vote info:", err);
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchVoteInfo();
    }, [proposalId, address]);
  
    return { ...voteInfo, isLoading, error };
  }