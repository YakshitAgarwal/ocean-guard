// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IOceanGuard {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract OceanGuardGovernance is Ownable, ReentrancyGuard {
    using SafeERC20 for IOceanGuard;

    // Proposal categories
    enum ProposalCategory { 
        Infrastructure, 
        Tokenomics, 
        Partnership, 
        Protocol, 
        Research, 
        Other 
    }
    
    // Proposal status
    enum ProposalStatus { 
        Active, 
        Passed, 
        Failed, 
        Canceled 
    }
    
    // Vote options
    enum VoteType { 
        For, 
        Against, 
        Abstain 
    }
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        address creator;
        string title;
        string description;
        ProposalCategory category;
        ProposalStatus status;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        mapping(address => VoteInfo) votes;
        bool executed;
        bytes executionData;
        address targetContract;
    }
    
    // Vote information
    struct VoteInfo {
        bool hasVoted;
        VoteType voteType;
        uint256 weight;
    }
    
    // Proposal summary (for external view functions)
    struct ProposalSummary {
        uint256 id;
        address creator;
        string title;
        string description;
        ProposalCategory category;
        ProposalStatus status;
        uint256 startTime;
        uint256 endTime;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        bool executed;
        address targetContract;
    }
    
    // Constants
    uint256 public constant PROPOSAL_DURATION = 7 days;
    uint256 public constant MIN_VOTING_DELAY = 1 days;
    uint256 public constant MIN_VOTING_PERIOD = 3 days;
    uint256 public constant VOTE_THRESHOLD_PERCENTAGE = 10; // 10% of total staked tokens required for proposal to pass
    uint256 public constant QUORUM_PERCENTAGE = 20; // 20% of total staked tokens must vote for a valid result
    
    // State variables
    IOceanGuard public oceanGuardToken;
    uint256 private _proposalIdCounter;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => address) public delegates;
    mapping(address => uint256) public stakedBalances;
    uint256 public totalStaked;
    
    // Events
    event ProposalCreated(
        uint256 indexed proposalId, 
        address indexed creator, 
        string title, 
        ProposalCategory category,
        uint256 startTime,
        uint256 endTime
    );
    
    event ProposalCanceled(uint256 indexed proposalId);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalStatusChanged(uint256 indexed proposalId, ProposalStatus newStatus);
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        VoteType voteType,
        uint256 weight
    );
    
    event TokensStaked(address indexed user, uint256 amount);
    event TokensUnstaked(address indexed user, uint256 amount);
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    
    /**
     * @dev Constructor to initialize the governance contract
     * @param _oceanGuardToken Address of the OceanGuard token
     */
    constructor(address _oceanGuardToken) Ownable(msg.sender) {
        require(_oceanGuardToken != address(0), "Invalid token address");
        oceanGuardToken = IOceanGuard(_oceanGuardToken);
    }
    
    /**
     * @dev Creates a new governance proposal
     * @param _title Title of the proposal
     * @param _description Detailed description of the proposal
     * @param _category Category of the proposal
     * @param _executionData Optional execution data for the proposal (if executable)
     * @param _targetContract Optional target contract to execute against
     */
    function createProposal(
        string memory _title,
        string memory _description,
        ProposalCategory _category,
        bytes memory _executionData,
        address _targetContract
    ) external whenNotPaused {
        uint256 userVotingPower = getVotingPower(msg.sender);
        require(userVotingPower > 0, "Must have staked tokens to create proposal");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        // Check if target and data are both set or both empty
        bool isExecutable = _targetContract != address(0) && _executionData.length > 0;
        if (_targetContract != address(0)) {
            require(_executionData.length > 0, "Execution data required with target");
        }
        if (_executionData.length > 0) {
            require(_targetContract != address(0), "Target required with execution data");
        }
        
        uint256 proposalId = _proposalIdCounter;
        _proposalIdCounter++;
        
        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.creator = msg.sender;
        proposal.title = _title;
        proposal.description = _description;
        proposal.category = _category;
        proposal.status = ProposalStatus.Active;
        proposal.startTime = block.timestamp + MIN_VOTING_DELAY;
        proposal.endTime = proposal.startTime + PROPOSAL_DURATION;
        proposal.executed = false;
        proposal.executionData = _executionData;
        proposal.targetContract = _targetContract;
        
        emit ProposalCreated(
            proposalId, 
            msg.sender, 
            _title, 
            _category,
            proposal.startTime,
            proposal.endTime
        );
    }
    
    /**
     * @dev Cast vote on a proposal
     * @param _proposalId ID of the proposal
     * @param _voteType Type of vote (For, Against, Abstain)
     */
    function castVote(uint256 _proposalId, VoteType _voteType) external nonReentrant whenNotPaused {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id == _proposalId, "Proposal does not exist");
        require(block.timestamp >= proposal.startTime, "Voting has not started");
        require(block.timestamp <= proposal.endTime, "Voting has ended");
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(!proposal.votes[msg.sender].hasVoted, "Already voted");
        
        uint256 votingPower = getVotingPower(msg.sender);
        require(votingPower > 0, "No voting power");
        
        proposal.votes[msg.sender].hasVoted = true;
        proposal.votes[msg.sender].voteType = _voteType;
        proposal.votes[msg.sender].weight = votingPower;
        
        if (_voteType == VoteType.For) {
            proposal.forVotes += votingPower;
        } else if (_voteType == VoteType.Against) {
            proposal.againstVotes += votingPower;
        } else {
            proposal.abstainVotes += votingPower;
        }
        
        emit VoteCast(_proposalId, msg.sender, _voteType, votingPower);
    }
    
    /**
     * @dev Finalize the proposal after voting period ends
     * @param _proposalId ID of the proposal
     */
    function finalizeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id == _proposalId, "Proposal does not exist");
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        
        // Check if quorum is reached
        if (totalVotes * 100 < totalStaked * QUORUM_PERCENTAGE) {
            proposal.status = ProposalStatus.Failed;
            emit ProposalStatusChanged(_proposalId, ProposalStatus.Failed);
            return;
        }
        
        // Check if proposal passed
        if (proposal.forVotes * 100 > totalVotes * VOTE_THRESHOLD_PERCENTAGE && 
            proposal.forVotes > proposal.againstVotes) {
            proposal.status = ProposalStatus.Passed;
            emit ProposalStatusChanged(_proposalId, ProposalStatus.Passed);
        } else {
            proposal.status = ProposalStatus.Failed;
            emit ProposalStatusChanged(_proposalId, ProposalStatus.Failed);
        }
    }
    
    /**
     * @dev Execute a passed proposal if it has execution data
     * @param _proposalId ID of the proposal
     */
    function executeProposal(uint256 _proposalId) external nonReentrant whenNotPaused {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id == _proposalId, "Proposal does not exist");
        require(proposal.status == ProposalStatus.Passed, "Proposal not passed");
        require(!proposal.executed, "Proposal already executed");
        require(proposal.targetContract != address(0), "No target contract");
        require(proposal.executionData.length > 0, "No execution data");
        
        proposal.executed = true;
        
        // Execute the proposal
        (bool success, ) = proposal.targetContract.call(proposal.executionData);
        require(success, "Proposal execution failed");
        
        emit ProposalExecuted(_proposalId);
    }
    
    /**
     * @dev Cancel a proposal (only creator or admin can cancel)
     * @param _proposalId ID of the proposal
     */
    function cancelProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id == _proposalId, "Proposal does not exist");
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(msg.sender == proposal.creator || msg.sender == owner(), "Not authorized");
        
        proposal.status = ProposalStatus.Canceled;
        emit ProposalCanceled(_proposalId);
        emit ProposalStatusChanged(_proposalId, ProposalStatus.Canceled);
    }
    
    /**
     * @dev Stake tokens to gain voting power
     * @param _amount Amount of tokens to stake
     */
    function stakeTokens(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        
        oceanGuardToken.transferFrom(msg.sender, address(this), _amount);
        
        stakedBalances[msg.sender] += _amount;
        totalStaked += _amount;
        
        emit TokensStaked(msg.sender, _amount);
    }
    
    /**
     * @dev Unstake tokens
     * @param _amount Amount of tokens to unstake
     */
    function unstakeTokens(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(stakedBalances[msg.sender] >= _amount, "Insufficient staked balance");
        
        // Check if user has active votes
        for (uint256 i = 0; i < _proposalIdCounter; i++) {
            if (proposals[i].status == ProposalStatus.Active && 
                proposals[i].votes[msg.sender].hasVoted && 
                block.timestamp <= proposals[i].endTime) {
                revert("Cannot unstake during active votes");
            }
        }
        
        stakedBalances[msg.sender] -= _amount;
        totalStaked -= _amount;
        
        oceanGuardToken.transfer(msg.sender, _amount);
        
        emit TokensUnstaked(msg.sender, _amount);
    }
    
    /**
     * @dev Delegate voting power to another address
     * @param _delegatee Address to delegate to
     */
    function delegate(address _delegatee) external {
        require(_delegatee != address(0), "Cannot delegate to zero address");
        require(_delegatee != msg.sender, "Cannot delegate to self");
        
        address currentDelegate = delegates[msg.sender];
        delegates[msg.sender] = _delegatee;
        
        emit DelegateChanged(msg.sender, currentDelegate, _delegatee);
    }
    
    /**
     * @dev Remove delegation
     */
    function undelegate() external {
        address currentDelegate = delegates[msg.sender];
        require(currentDelegate != address(0), "Not delegated");
        
        delete delegates[msg.sender];
        
        emit DelegateChanged(msg.sender, currentDelegate, address(0));
    }
    
    /**
     * @dev Get the voting power of an address
     * @param _account Address to get voting power for
     * @return Voting power
     */
    function getVotingPower(address _account) public view returns (uint256) {
        uint256 ownPower = stakedBalances[_account];
        
        // Add power from delegations (if any accounts delegated to this account)
        for (uint256 i = 0; i < _proposalIdCounter; i++) {
            address delegator = address(uint160(i)); // This is for demo - in production you'd maintain a list of delegators
            if (delegates[delegator] == _account) {
                ownPower += stakedBalances[delegator];
            }
        }
        
        // If account delegated to someone else, return 0
        if (delegates[_account] != address(0)) {
            return 0;
        }
        
        return ownPower;
    }
    
    /**
     * @dev Get proposal details
     * @param _proposalId ID of the proposal
     * @return ProposalSummary with proposal details
     */
    function getProposal(uint256 _proposalId) external view returns (ProposalSummary memory) {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id == _proposalId, "Proposal does not exist");
        
        return ProposalSummary({
            id: proposal.id,
            creator: proposal.creator,
            title: proposal.title,
            description: proposal.description,
            category: proposal.category,
            status: proposal.status,
            startTime: proposal.startTime,
            endTime: proposal.endTime,
            forVotes: proposal.forVotes,
            againstVotes: proposal.againstVotes,
            abstainVotes: proposal.abstainVotes,
            executed: proposal.executed,
            targetContract: proposal.targetContract
        });
    }
    
    /**
     * @dev Get vote details for a user on a specific proposal
     * @param _proposalId ID of the proposal
     * @param _voter Address of the voter
     * @return hasVoted Whether the user has voted
     * @return voteType Type of vote cast
     * @return weight Voting weight used
     */
    function getVoteInfo(uint256 _proposalId, address _voter) 
        external 
        view 
        returns (bool hasVoted, VoteType voteType, uint256 weight) 
    {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.id == _proposalId, "Proposal does not exist");
        
        VoteInfo storage voteInfo = proposal.votes[_voter];
        return (voteInfo.hasVoted, voteInfo.voteType, voteInfo.weight);
    }
    
    /**
     * @dev Get all active proposals
     * @return Array of active proposal IDs
     */
    function getActiveProposals() external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count active proposals
        for (uint256 i = 0; i < _proposalIdCounter; i++) {
            if (proposals[i].status == ProposalStatus.Active) {
                count++;
            }
        }
        
        // Create array of active proposal IDs
        uint256[] memory activeProposals = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _proposalIdCounter; i++) {
            if (proposals[i].status == ProposalStatus.Active) {
                activeProposals[index] = i;
                index++;
            }
        }
        
        return activeProposals;
    }
    
    /**
     * @dev Get proposals by status
     * @param _status Status to filter by
     * @return Array of proposal IDs with the specified status
     */
    function getProposalsByStatus(ProposalStatus _status) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count proposals with the specified status
        for (uint256 i = 0; i < _proposalIdCounter; i++) {
            if (proposals[i].status == _status) {
                count++;
            }
        }
        
        // Create array of proposal IDs with the specified status
        uint256[] memory filteredProposals = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _proposalIdCounter; i++) {
            if (proposals[i].status == _status) {
                filteredProposals[index] = i;
                index++;
            }
        }
        
        return filteredProposals;
    }
    
    /**
     * @dev Get proposals by category
     * @param _category Category to filter by
     * @return Array of proposal IDs with the specified category
     */
    function getProposalsByCategory(ProposalCategory _category) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count proposals with the specified category
        for (uint256 i = 0; i < _proposalIdCounter; i++) {
            if (proposals[i].category == _category) {
                count++;
            }
        }
        
        // Create array of proposal IDs with the specified category
        uint256[] memory filteredProposals = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < _proposalIdCounter; i++) {
            if (proposals[i].category == _category) {
                filteredProposals[index] = i;
                index++;
            }
        }
        
        return filteredProposals;
    }
    
    /**
     * @dev Get total number of proposals
     * @return Total number of proposals
     */
    function getProposalCount() external view returns (uint256) {
        return _proposalIdCounter;
    }
    
    /**
     * @dev Update governance parameters (only owner)
     * @param _newVotingDelay New minimum voting delay in seconds
     * @param _newVotingPeriod New minimum voting period in seconds
     * @param _newVoteThreshold New vote threshold percentage
     * @param _newQuorum New quorum percentage
     */
    function updateGovernanceParameters(
        uint256 _newVotingDelay,
        uint256 _newVotingPeriod,
        uint256 _newVoteThreshold,
        uint256 _newQuorum
    ) external onlyOwner {
        require(_newVotingDelay >= 1 hours, "Voting delay too short");
        require(_newVotingPeriod >= 1 days, "Voting period too short");
        require(_newVoteThreshold > 0 && _newVoteThreshold <= 100, "Invalid vote threshold");
        require(_newQuorum > 0 && _newQuorum <= 100, "Invalid quorum");
        
        // Update parameters - Note: Since these are constants in the contract
        // we would need to modify the contract structure to allow these to be changed
        // This is left as a placeholder for future implementation
        
        // Emit events for parameter changes
        emit VotingDelayChanged(_newVotingDelay);
        emit VotingPeriodChanged(_newVotingPeriod);
        emit VoteThresholdChanged(_newVoteThreshold);
        emit QuorumChanged(_newQuorum);
    }
    
    /**
     * @dev Emergency function to pause all governance (only owner)
     */
    function emergencyPauseGovernance() external onlyOwner {
        governancePaused = true;
        emit GovernancePaused(msg.sender);
    }
    
    /**
     * @dev Resume governance after pause (only owner)
     */
    function resumeGovernance() external onlyOwner {
        governancePaused = false;
        emit GovernanceResumed(msg.sender);
    }
    
    /**
     * @dev Withdraw ERC20 tokens sent to this contract by mistake (only owner)
     * @param _token Address of the token to withdraw
     * @param _amount Amount to withdraw
     * @param _recipient Recipient of the tokens
     */
    function withdrawERC20(address _token, uint256 _amount, address _recipient) external onlyOwner {
        require(_token != address(oceanGuardToken), "Cannot withdraw governance token");
        require(_recipient != address(0), "Cannot withdraw to zero address");
        
        SafeERC20.safeTransfer(IERC20(_token), _recipient, _amount);
        emit ERC20Withdrawn(_token, _amount, _recipient);
    }
    
    // Additional state variables needed for functions added above
    bool public governancePaused;
    
    // Additional events needed for functions added above
    event VotingDelayChanged(uint256 newVotingDelay);
    event VotingPeriodChanged(uint256 newVotingPeriod);
    event VoteThresholdChanged(uint256 newVoteThreshold);
    event QuorumChanged(uint256 newQuorum);
    event GovernancePaused(address pauser);
    event GovernanceResumed(address resumer);
    event ERC20Withdrawn(address token, uint256 amount, address recipient);
    
    // Modifiers
    modifier whenNotPaused() {
        require(!governancePaused, "Governance is paused");
        _;
    }
    
    /**
     * @dev Get user staked balance
     * @param _user Address of the user
     * @return Staked balance
     */
    function getStakedBalance(address _user) external view returns (uint256) {
        return stakedBalances[_user];
    }
    
    /**
     * @dev Get user delegate
     * @param _user Address of the user
     * @return Delegate address
     */
    function getUserDelegate(address _user) external view returns (address) {
        return delegates[_user];
    }
}