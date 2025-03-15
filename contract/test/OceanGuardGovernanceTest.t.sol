// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/OceanGuardGovernance.sol";
import "../src/MockERC20.sol";

contract OceanGuardGovernanceTest is Test {
    OceanGuardGovernance governance;
    MockERC20 oceanGuardToken;
    
    address owner;
    address user1;
    address user2;
    address user3;
    
    // Test constants
    uint256 constant STAKE_AMOUNT = 1000 ether;
    uint256 constant MIN_VOTING_DELAY = 1 days;
    uint256 constant PROPOSAL_DURATION = 7 days;
    
    function setUp() public {
        // Deploy mock token
        oceanGuardToken = new MockERC20("OceanGuard", "OG", 18);
        
        // Setup accounts
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);
        user3 = address(0x3);
        
        // Mint tokens to test accounts
        oceanGuardToken.mint(owner, 10000 ether);
        oceanGuardToken.mint(user1, 10000 ether);
        oceanGuardToken.mint(user2, 10000 ether);
        oceanGuardToken.mint(user3, 10000 ether);
        
        // Deploy governance contract
        governance = new OceanGuardGovernance(address(oceanGuardToken));
        
        // Approve governance contract to spend tokens
        oceanGuardToken.approve(address(governance), type(uint256).max);
        vm.prank(user1);
        oceanGuardToken.approve(address(governance), type(uint256).max);
        vm.prank(user2);
        oceanGuardToken.approve(address(governance), type(uint256).max);
        vm.prank(user3);
        oceanGuardToken.approve(address(governance), type(uint256).max);
    }
    
    function testConstructor() public {
        assertEq(address(governance.oceanGuardToken()), address(oceanGuardToken));
    }
    
    function testStakeTokens() public {
        governance.stakeTokens(STAKE_AMOUNT);
        assertEq(governance.getStakedBalance(owner), STAKE_AMOUNT);
        assertEq(governance.totalStaked(), STAKE_AMOUNT);
        assertEq(oceanGuardToken.balanceOf(address(governance)), STAKE_AMOUNT);
    }
    
    function testUnstakeTokens() public {
        governance.stakeTokens(STAKE_AMOUNT);
        uint256 initialBalance = oceanGuardToken.balanceOf(owner);
        
        governance.unstakeTokens(STAKE_AMOUNT);
        assertEq(governance.getStakedBalance(owner), 0);
        assertEq(governance.totalStaked(), 0);
        assertEq(oceanGuardToken.balanceOf(owner), initialBalance);
    }
    
    function testCreateProposal() public {
        // Stake tokens to be able to create a proposal
        governance.stakeTokens(STAKE_AMOUNT);
        
        string memory title = "Test Proposal";
        string memory description = "This is a test proposal";
        
        governance.createProposal(
            title,
            description,
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        OceanGuardGovernance.ProposalSummary memory proposal = governance.getProposal(0);
        assertEq(proposal.title, title);
        assertEq(proposal.description, description);
        assertEq(uint(proposal.category), uint(OceanGuardGovernance.ProposalCategory.Research));
        assertEq(uint(proposal.status), uint(OceanGuardGovernance.ProposalStatus.Active));
    }
    
    function testCastVote() public {
        // Setup: stake tokens and create proposal
        governance.stakeTokens(STAKE_AMOUNT);
        vm.prank(user1);
        governance.stakeTokens(STAKE_AMOUNT);
        
        governance.createProposal(
            "Test Proposal",
            "This is a test proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Warp time to start of voting period
        vm.warp(block.timestamp + MIN_VOTING_DELAY);
        
        // Cast vote
        vm.prank(user1);
        governance.castVote(0, OceanGuardGovernance.VoteType.For);
        
        // Verify vote was recorded
        (bool hasVoted, OceanGuardGovernance.VoteType voteType, uint256 weight) = governance.getVoteInfo(0, user1);
        assertTrue(hasVoted);
        assertEq(uint(voteType), uint(OceanGuardGovernance.VoteType.For));
        assertEq(weight, STAKE_AMOUNT);
        
        // Verify proposal vote count
        OceanGuardGovernance.ProposalSummary memory proposal = governance.getProposal(0);
        assertEq(proposal.forVotes, STAKE_AMOUNT);
    }
    
    function testFinalizeProposal() public {
        // Setup: stake tokens and create proposal
        governance.stakeTokens(STAKE_AMOUNT);
        vm.prank(user1);
        governance.stakeTokens(STAKE_AMOUNT);
        vm.prank(user2);
        governance.stakeTokens(STAKE_AMOUNT);
        
        governance.createProposal(
            "Test Proposal",
            "This is a test proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Warp time to start of voting period
        vm.warp(block.timestamp + MIN_VOTING_DELAY);
        
        // Cast votes
        vm.prank(user1);
        governance.castVote(0, OceanGuardGovernance.VoteType.For);
        vm.prank(user2);
        governance.castVote(0, OceanGuardGovernance.VoteType.Against);
        
        // Warp time to end of voting period
        vm.warp(block.timestamp + PROPOSAL_DURATION);
        
        // Finalize proposal
        governance.finalizeProposal(0);
        
        // Verify proposal status
        OceanGuardGovernance.ProposalSummary memory proposal = governance.getProposal(0);
        assertEq(uint(proposal.status), uint(OceanGuardGovernance.ProposalStatus.Failed));
    }
    
    function testProposalPassedAndExecuted() public {
        // Setup a mock contract to execute
        MockExecutableTarget target = new MockExecutableTarget();
        
        // Setup: stake tokens and create executable proposal
        governance.stakeTokens(STAKE_AMOUNT);
        vm.prank(user1);
        governance.stakeTokens(STAKE_AMOUNT);
        vm.prank(user2);
        governance.stakeTokens(STAKE_AMOUNT);
        
        // Create an executable proposal
        bytes memory callData = abi.encodeWithSignature("execute(uint256)", 42);
        governance.createProposal(
            "Executable Proposal",
            "This proposal will execute a function",
            OceanGuardGovernance.ProposalCategory.Protocol,
            callData,
            address(target)
        );
        
        // Warp time to start of voting period
        vm.warp(block.timestamp + MIN_VOTING_DELAY);
        
        // Cast votes - ensure proposal passes
        governance.castVote(0, OceanGuardGovernance.VoteType.For);
        vm.prank(user1);
        governance.castVote(0, OceanGuardGovernance.VoteType.For);
        
        // Warp time to end of voting period
        vm.warp(block.timestamp + PROPOSAL_DURATION);
        
        // Finalize proposal
        governance.finalizeProposal(0);
        
        // Verify proposal status
        OceanGuardGovernance.ProposalSummary memory proposal = governance.getProposal(0);
        assertEq(uint(proposal.status), uint(OceanGuardGovernance.ProposalStatus.Passed));
        
        // Execute the proposal
        governance.executeProposal(0);
        
        // Verify proposal was executed
        proposal = governance.getProposal(0);
        assertTrue(proposal.executed);
        
        // Verify target was called with correct parameters
        assertEq(target.lastValue(), 42);
        assertTrue(target.wasCalled());
    }
    
    function testDelegation() public {
        // Setup: stake tokens
        governance.stakeTokens(STAKE_AMOUNT);
        vm.prank(user1);
        governance.stakeTokens(STAKE_AMOUNT);
        
        // User1 delegates to owner
        vm.prank(user1);
        governance.delegate(owner);
        
        // Verify delegation
        assertEq(governance.getUserDelegate(user1), owner);
        
        // Check voting power
        uint256 ownerVotingPower = governance.getVotingPower(owner);
        assertEq(ownerVotingPower, STAKE_AMOUNT * 2);
        
        // User1 should have no voting power when delegated
        vm.prank(user1);
        uint256 user1VotingPower = governance.getVotingPower(user1);
        assertEq(user1VotingPower, 0);
    }
    
    function testUndelegation() public {
        // Setup: stake tokens and delegate
        governance.stakeTokens(STAKE_AMOUNT);
        vm.prank(user1);
        governance.stakeTokens(STAKE_AMOUNT);
        
        vm.prank(user1);
        governance.delegate(owner);
        
        // Undelegate
        vm.prank(user1);
        governance.undelegate();
        
        // Verify undelegation
        assertEq(governance.getUserDelegate(user1), address(0));
        
        // Check voting power is restored
        vm.prank(user1);
        uint256 user1VotingPower = governance.getVotingPower(user1);
        assertEq(user1VotingPower, STAKE_AMOUNT);
    }
    
    function testGovernancePause() public {
        // Pause governance
        governance.emergencyPauseGovernance();
        assertTrue(governance.governancePaused());
        
        // Try to create proposal when paused
        governance.stakeTokens(STAKE_AMOUNT);
        vm.expectRevert("Governance is paused");
        governance.createProposal(
            "Test Proposal",
            "This is a test proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Resume governance
        governance.resumeGovernance();
        assertFalse(governance.governancePaused());
        
        // Now should be able to create proposal
        governance.createProposal(
            "Test Proposal",
            "This is a test proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
    }
    
    function testCannotVoteAfterVotingPeriod() public {
        // Setup: stake tokens and create proposal
        governance.stakeTokens(STAKE_AMOUNT);
        vm.prank(user1);
        governance.stakeTokens(STAKE_AMOUNT);
        
        governance.createProposal(
            "Test Proposal",
            "This is a test proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Warp time to end of voting period
        vm.warp(block.timestamp + MIN_VOTING_DELAY + PROPOSAL_DURATION + 1);
        
        // Try to cast vote
        vm.prank(user1);
        vm.expectRevert("Voting has ended");
        governance.castVote(0, OceanGuardGovernance.VoteType.For);
    }
    
    function testGetProposalsByCategory() public {
        // Setup: stake tokens and create proposals
        governance.stakeTokens(STAKE_AMOUNT);
        
        governance.createProposal(
            "Research Proposal 1",
            "This is a research proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        governance.createProposal(
            "Protocol Proposal",
            "This is a protocol proposal",
            OceanGuardGovernance.ProposalCategory.Protocol,
            new bytes(0),
            address(0)
        );
        
        governance.createProposal(
            "Research Proposal 2",
            "This is another research proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Get proposals by category
        uint256[] memory researchProposals = governance.getProposalsByCategory(OceanGuardGovernance.ProposalCategory.Research);
        
        // Verify correct proposals returned
        assertEq(researchProposals.length, 2);
        assertEq(researchProposals[0], 0);
        assertEq(researchProposals[1], 2);
    }
    
    function testGetProposalsByStatus() public {
        // Setup: stake tokens and create proposals
        governance.stakeTokens(STAKE_AMOUNT);
        
        // Create three proposals
        governance.createProposal(
            "Proposal 1",
            "This is the first proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        governance.createProposal(
            "Proposal 2",
            "This is the second proposal",
            OceanGuardGovernance.ProposalCategory.Protocol,
            new bytes(0),
            address(0)
        );
        
        governance.createProposal(
            "Proposal 3",
            "This is the third proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Cancel one proposal
        governance.cancelProposal(1);
        
        // Warp time to end of voting period for another proposal and finalize it
        vm.warp(block.timestamp + MIN_VOTING_DELAY + PROPOSAL_DURATION);
        governance.finalizeProposal(2);
        
        // Get active proposals
        uint256[] memory activeProposals = governance.getProposalsByStatus(OceanGuardGovernance.ProposalStatus.Active);
        
        // Verify correct proposals returned
        assertEq(activeProposals.length, 1);
        assertEq(activeProposals[0], 0);
        
        // Get canceled proposals
        uint256[] memory canceledProposals = governance.getProposalsByStatus(OceanGuardGovernance.ProposalStatus.Canceled);
        
        assertEq(canceledProposals.length, 1);
        assertEq(canceledProposals[0], 1);
        
        // Get failed proposals
        uint256[] memory failedProposals = governance.getProposalsByStatus(OceanGuardGovernance.ProposalStatus.Failed);
        
        // Verify correct proposals returned
        assertEq(failedProposals.length, 1);
        assertEq(failedProposals[0], 2);
    }
    
    function testProposalCount() public {
        // Initially there should be no proposals
        assertEq(governance.getProposalCount(), 0);
        
        // Setup: stake tokens and create proposals
        governance.stakeTokens(STAKE_AMOUNT);
        
        // Create three proposals
        governance.createProposal(
            "Proposal 1",
            "This is the first proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        governance.createProposal(
            "Proposal 2",
            "This is the second proposal",
            OceanGuardGovernance.ProposalCategory.Protocol,
            new bytes(0),
            address(0)
        );
        
        governance.createProposal(
            "Proposal 3",
            "This is the third proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Verify the proposal count
        assertEq(governance.getProposalCount(), 3);
    }
    
    function testGetActiveProposals() public {
        // Setup: stake tokens and create proposals
        governance.stakeTokens(STAKE_AMOUNT);
        
        // Create three proposals
        governance.createProposal(
            "Proposal 1",
            "This is the first proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        governance.createProposal(
            "Proposal 2",
            "This is the second proposal",
            OceanGuardGovernance.ProposalCategory.Protocol,
            new bytes(0),
            address(0)
        );
        
        governance.createProposal(
            "Proposal 3",
            "This is the third proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Cancel one proposal
        governance.cancelProposal(1);
        
        // Get active proposals
        uint256[] memory activeProposals = governance.getActiveProposals();
        
        // Verify correct proposals returned (proposals 0 and 2 should be active)
        assertEq(activeProposals.length, 2);
        assertEq(activeProposals[0], 0);
        assertEq(activeProposals[1], 2);
    }
    
    function testCannotUnstakeWithActiveVotes() public {
        // Setup: stake tokens and create proposal
        governance.stakeTokens(STAKE_AMOUNT);
        
        governance.createProposal(
            "Test Proposal",
            "This is a test proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Warp time to start of voting period
        vm.warp(block.timestamp + MIN_VOTING_DELAY);
        
        // Cast vote
        governance.castVote(0, OceanGuardGovernance.VoteType.For);
        
        // Try to unstake during active vote period
        vm.expectRevert("Cannot unstake during active votes");
        governance.unstakeTokens(STAKE_AMOUNT);
        
        // Warp time to end of voting period
        vm.warp(block.timestamp + PROPOSAL_DURATION);
        
        // Finalize proposal
        governance.finalizeProposal(0);
        
        // Now should be able to unstake
        governance.unstakeTokens(STAKE_AMOUNT);
        assertEq(governance.getStakedBalance(owner), 0);
    }
    
    function testCannotDelegateToSelf() public {
        // Setup: stake tokens
        governance.stakeTokens(STAKE_AMOUNT);
        
        // Try to delegate to self
        vm.expectRevert("Cannot delegate to self");
        governance.delegate(owner);
    }
    
    function testCannotDelegateToZeroAddress() public {
        // Setup: stake tokens
        governance.stakeTokens(STAKE_AMOUNT);
        
        // Try to delegate to zero address
        vm.expectRevert("Cannot delegate to zero address");
        governance.delegate(address(0));
    }
    
    function testCannotUndelegateWhenNotDelegated() public {
        // Setup: stake tokens
        governance.stakeTokens(STAKE_AMOUNT);
        
        // Try to undelegate when not delegated
        vm.expectRevert("Not delegated");
        governance.undelegate();
    }
    
    function testCancelProposal() public {
        // Setup: stake tokens and create proposal
        governance.stakeTokens(STAKE_AMOUNT);
        
        governance.createProposal(
            "Test Proposal",
            "This is a test proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Cancel proposal
        governance.cancelProposal(0);
        
        // Verify proposal status
        OceanGuardGovernance.ProposalSummary memory proposal = governance.getProposal(0);
        assertEq(uint(proposal.status), uint(OceanGuardGovernance.ProposalStatus.Canceled));
    }
    
    function testCannotCancelOtherUsersProposal() public {
        // Setup: stake tokens and create proposal with user1
        vm.prank(user1);
        governance.stakeTokens(STAKE_AMOUNT);
        
        vm.prank(user1);
        governance.createProposal(
            "Test Proposal",
            "This is a test proposal",
            OceanGuardGovernance.ProposalCategory.Research,
            new bytes(0),
            address(0)
        );
        
        // Try to cancel user1's proposal as user2
        vm.prank(user2);
        vm.expectRevert("Not authorized");
        governance.cancelProposal(0);
        
        // Owner should be able to cancel any proposal
        governance.cancelProposal(0);
        
        // Verify proposal status
        OceanGuardGovernance.ProposalSummary memory proposal = governance.getProposal(0);
        assertEq(uint(proposal.status), uint(OceanGuardGovernance.ProposalStatus.Canceled));
    }
    
    function testCannotExecuteFailedProposal() public {
        // Setup a mock contract to execute
        MockExecutableTarget target = new MockExecutableTarget();
        
        // Setup: stake tokens and create executable proposal
        governance.stakeTokens(STAKE_AMOUNT);
        vm.prank(user1);
        governance.stakeTokens(STAKE_AMOUNT);
        
        // Create an executable proposal
        bytes memory callData = abi.encodeWithSignature("execute(uint256)", 42);
        governance.createProposal(
            "Executable Proposal",
            "This proposal will execute a function",
            OceanGuardGovernance.ProposalCategory.Protocol,
            callData,
            address(target)
        );
        
        // Warp time to start of voting period
        vm.warp(block.timestamp + MIN_VOTING_DELAY);
        
        // Cast votes to make it fail
        governance.castVote(0, OceanGuardGovernance.VoteType.Against);
        vm.prank(user1);
        governance.castVote(0, OceanGuardGovernance.VoteType.Against);
        
        // Warp time to end of voting period
        vm.warp(block.timestamp + PROPOSAL_DURATION);
        
        // Finalize proposal
        governance.finalizeProposal(0);
        
        // Verify proposal status
        OceanGuardGovernance.ProposalSummary memory proposal = governance.getProposal(0);
        assertEq(uint(proposal.status), uint(OceanGuardGovernance.ProposalStatus.Failed));
        
        // Try to execute failed proposal
        vm.expectRevert("Proposal not passed");
        governance.executeProposal(0);
    }
    
    function testCannotExecuteAlreadyExecutedProposal() public {
        // Setup a mock contract to execute
        MockExecutableTarget target = new MockExecutableTarget();
        
        // Setup: stake tokens and create executable proposal
        governance.stakeTokens(STAKE_AMOUNT);
        vm.prank(user1);
        governance.stakeTokens(STAKE_AMOUNT);
        
        // Create an executable proposal
        bytes memory callData = abi.encodeWithSignature("execute(uint256)", 42);
        governance.createProposal(
            "Executable Proposal",
            "This proposal will execute a function",
            OceanGuardGovernance.ProposalCategory.Protocol,
            callData,
            address(target)
        );
        
        // Warp time to start of voting period
        vm.warp(block.timestamp + MIN_VOTING_DELAY);
        
        // Cast votes to make it pass
        governance.castVote(0, OceanGuardGovernance.VoteType.For);
        vm.prank(user1);
        governance.castVote(0, OceanGuardGovernance.VoteType.For);
        
        // Warp time to end of voting period
        vm.warp(block.timestamp + PROPOSAL_DURATION);
        
        // Finalize proposal
        governance.finalizeProposal(0);
        
        // Execute proposal
        governance.executeProposal(0);
        
        // Try to execute again
        vm.expectRevert("Proposal already executed");
        governance.executeProposal(0);
    }
}

// Mock contract for testing proposal execution
contract MockExecutableTarget {
    uint256 public lastValue;
    bool public wasCalled;
    
    function execute(uint256 value) external {
        lastValue = value;
        wasCalled = true;
    }
}