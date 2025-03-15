// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/OceanGuard.sol";

contract OceanGuardTest is Test {
    OceanGuard oceanGuard;
    address owner;
    address validator;
    address user1;
    address user2;
    
    // Events to test against
    event ProjectCreated(uint256 indexed projectId, address indexed creator, OceanGuard.ProjectType projectType);
    event ProjectValidated(uint256 indexed projectId, address indexed validator);
    event TokensIssued(uint256 indexed projectId, address indexed recipient, uint256 amount);
    event CarbonCreditCreated(uint256 indexed creditId, address indexed owner, uint256 amount);
    event CarbonCreditListed(uint256 indexed creditId, uint256 price);
    event CarbonCreditSold(uint256 indexed creditId, address indexed seller, address indexed buyer, uint256 price);
    event ConversionRatesUpdated(uint256 plasticRate, uint256 reefRate, uint256 carbonRate);
    
    function setUp() public {
        owner = address(this);
        validator = makeAddr("validator");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        
        // Deploy contract
        oceanGuard = new OceanGuard();
        
        // Set validator
        oceanGuard.setValidator(validator, true);
        
        // Give ETH to users for transactions
        vm.deal(user1, 10 ether);
        vm.deal(user2, 10 ether);
    }
    
    // Test deployment and initial state
    function testInitialState() public {
        assertEq(oceanGuard.name(), "OceanGuard Token");
        assertEq(oceanGuard.symbol(), "OCEAN");
        assertEq(oceanGuard.nextProjectId(), 1);
        assertEq(oceanGuard.nextCreditId(), 1);
        assertEq(oceanGuard.plasticRemovalRate(), 10);
        assertEq(oceanGuard.reefRestorationRate(), 50);
        assertEq(oceanGuard.carbonSequestrationRate(), 100);
    }
    
    // Test setting a validator
    function testSetValidator() public {
        address newValidator = makeAddr("newValidator");
        
        // Set validator
        oceanGuard.setValidator(newValidator, true);
        assertTrue(oceanGuard.validators(newValidator));
        
        // Remove validator
        oceanGuard.setValidator(newValidator, false);
        assertFalse(oceanGuard.validators(newValidator));
    }
    
    // Test validator authorization
    function testSetValidatorUnauthorized() public {
        vm.prank(user1);
        vm.expectRevert();
        oceanGuard.setValidator(user2, true);
    }
    
    // Test updating conversion rates
    function testUpdateConversionRates() public {
        vm.expectEmit(true, true, true, true);
        emit ConversionRatesUpdated(20, 60, 120);
        
        oceanGuard.updateConversionRates(20, 60, 120);
        
        assertEq(oceanGuard.plasticRemovalRate(), 20);
        assertEq(oceanGuard.reefRestorationRate(), 60);
        assertEq(oceanGuard.carbonSequestrationRate(), 120);
    }
    
    // Test updating conversion rates with invalid values
    function testUpdateConversionRatesInvalid() public {
        vm.expectRevert("Rates must be positive");
        oceanGuard.updateConversionRates(0, 60, 120);
        
        vm.expectRevert("Rates must be positive");
        oceanGuard.updateConversionRates(20, 0, 120);
        
        vm.expectRevert("Rates must be positive");
        oceanGuard.updateConversionRates(20, 60, 0);
    }
    
    // Test creating a project
    function testCreateProject() public {
        vm.prank(user1);
        
        vm.expectEmit(true, true, true, true);
        emit ProjectCreated(1, user1, OceanGuard.ProjectType.PLASTIC_REMOVAL);
        
        oceanGuard.createProject(
            "ipfs://QmExample", 
            OceanGuard.ProjectType.PLASTIC_REMOVAL, 
            1000
        );
        
        // Check project data
        (
            uint256 id, 
            address creator, 
            string memory metadata, 
            OceanGuard.ProjectType projectType, 
            uint256 impactMetric, 
            bool isValidated, 
            bool tokensIssued
        ) = oceanGuard.projects(1);
        
        assertEq(id, 1);
        assertEq(creator, user1);
        assertEq(metadata, "ipfs://QmExample");
        assertEq(uint(projectType), uint(OceanGuard.ProjectType.PLASTIC_REMOVAL));
        assertEq(impactMetric, 1000);
        assertFalse(isValidated);
        assertFalse(tokensIssued);
        
        // Check next project ID
        assertEq(oceanGuard.nextProjectId(), 2);
    }
    
    // Test project validation by validator
    function testValidateProject() public {
        // Create project first
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmExample", 
            OceanGuard.ProjectType.PLASTIC_REMOVAL, 
            1000
        );
        
        // Validate project
        vm.prank(validator);
        
        vm.expectEmit(true, true, true, true);
        emit ProjectValidated(1, validator);
        
        oceanGuard.validateProject(1);
        
        // Check project is now validated
        (,,,,, bool isValidated,) = oceanGuard.projects(1);
        assertTrue(isValidated);
    }
    
    // Test unauthorized project validation
    function testValidateProjectUnauthorized() public {
        // Create project first
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmExample", 
            OceanGuard.ProjectType.PLASTIC_REMOVAL, 
            1000
        );
        
        // Try to validate as non-validator
        vm.prank(user2);
        vm.expectRevert("Not authorized as validator");
        oceanGuard.validateProject(1);
    }
    
    // Test token issuance
    function testIssueTokens() public {
        // Create project
        vm.startPrank(user1);
        oceanGuard.createProject(
            "ipfs://QmExample", 
            OceanGuard.ProjectType.PLASTIC_REMOVAL, 
            1000
        );
        vm.stopPrank();
        
        // Validate project
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Issue tokens
        vm.prank(user1);
        
        vm.expectEmit(true, true, true, true);
        emit TokensIssued(1, user1, 10000); // 1000 kg * 10 tokens/kg = 10000 tokens
        
        oceanGuard.issueTokens(1);
        
        // Check tokens were issued to user1
        assertEq(oceanGuard.balanceOf(user1), 10000);
        
        // Check project state
        (,,,,,, bool tokensIssued) = oceanGuard.projects(1);
        assertTrue(tokensIssued);
    }
    
    // Test trying to issue tokens twice
    function testIssueTokensTwice() public {
        // Create and validate project
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmExample", 
            OceanGuard.ProjectType.PLASTIC_REMOVAL, 
            1000
        );
        
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Issue tokens first time
        vm.prank(user1);
        oceanGuard.issueTokens(1);
        
        // Try to issue tokens again
        vm.prank(user1);
        vm.expectRevert("Tokens already issued");
        oceanGuard.issueTokens(1);
    }
    
    // Test creating carbon credits
    function testCreateCarbonCredit() public {
        // Create carbon sequestration project
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmCarbonSequestration", 
            OceanGuard.ProjectType.CARBON_SEQUESTRATION, 
            100
        );
        
        // Validate project
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Create carbon credit
        vm.prank(user1);
        
        vm.expectEmit(true, true, true, true);
        emit CarbonCreditCreated(1, user1, 50);
        
        oceanGuard.createCarbonCredit(1, 50);
        
        // Check carbon credit data
        (uint256 id, address owner, uint256 amount, uint256 price, bool forSale) = oceanGuard.carbonCredits(1);
        
        assertEq(id, 1);
        assertEq(owner, user1);
        assertEq(amount, 50);
        assertEq(price, 0);
        assertFalse(forSale);
        
        // Check next credit ID
        assertEq(oceanGuard.nextCreditId(), 2);
    }
    
    // Test listing carbon credit for sale
    function testListCarbonCredit() public {
        // Create and validate project
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmCarbonSequestration", 
            OceanGuard.ProjectType.CARBON_SEQUESTRATION, 
            100
        );
        
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Create carbon credit
        vm.prank(user1);
        oceanGuard.createCarbonCredit(1, 50);
        
        // List carbon credit
        vm.prank(user1);
        
        vm.expectEmit(true, true, true, true);
        emit CarbonCreditListed(1, 1 ether);
        
        oceanGuard.listCarbonCredit(1, 1 ether);
        
        // Check carbon credit data
        (,,,uint256 price, bool forSale) = oceanGuard.carbonCredits(1);
        
        assertEq(price, 1 ether);
        assertTrue(forSale);
    }
    
    // Test unauthorized listing
    function testListCarbonCreditUnauthorized() public {
        // Create and validate project
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmCarbonSequestration", 
            OceanGuard.ProjectType.CARBON_SEQUESTRATION, 
            100
        );
        
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Create carbon credit
        vm.prank(user1);
        oceanGuard.createCarbonCredit(1, 50);
        
        // Try to list as non-owner
        vm.prank(user2);
        vm.expectRevert("Not the owner");
        oceanGuard.listCarbonCredit(1, 1 ether);
    }
    
    // Test buying carbon credit
    function testBuyCarbonCredit() public {
        // Create and validate project
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmCarbonSequestration", 
            OceanGuard.ProjectType.CARBON_SEQUESTRATION, 
            100
        );
        
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Create and list carbon credit
        vm.startPrank(user1);
        oceanGuard.createCarbonCredit(1, 50);
        oceanGuard.listCarbonCredit(1, 1 ether);
        vm.stopPrank();
        
        // Record initial balances
        uint256 user1InitialBalance = user1.balance;
        uint256 user2InitialBalance = user2.balance;
        
        // Buy carbon credit
        vm.prank(user2);
        
        vm.expectEmit(true, true, true, true);
        emit CarbonCreditSold(1, user1, user2, 1 ether);
        
        oceanGuard.buyCarbonCredit{value: 1 ether}(1);
        
        // Check carbon credit data
        (,address owner,,uint256 price, bool forSale) = oceanGuard.carbonCredits(1);
        
        assertEq(owner, user2);
        assertEq(price, 0);
        assertFalse(forSale);
        
        // Check ETH balances
        assertEq(user1.balance, user1InitialBalance + 1 ether);
        assertEq(user2.balance, user2InitialBalance - 1 ether);
    }
    
    // Test buying with refund (paying more than price)
    function testBuyCarbonCreditWithRefund() public {
        // Create and validate project
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmCarbonSequestration", 
            OceanGuard.ProjectType.CARBON_SEQUESTRATION, 
            100
        );
        
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Create and list carbon credit
        vm.startPrank(user1);
        oceanGuard.createCarbonCredit(1, 50);
        oceanGuard.listCarbonCredit(1, 1 ether);
        vm.stopPrank();
        
        // Record initial balances
        uint256 user1InitialBalance = user1.balance;
        uint256 user2InitialBalance = user2.balance;
        
        // Buy carbon credit with extra ETH
        vm.prank(user2);
        oceanGuard.buyCarbonCredit{value: 1.5 ether}(1);
        
        // Check balances (user2 should have been refunded 0.5 ETH)
        assertEq(user1.balance, user1InitialBalance + 1 ether);
        assertEq(user2.balance, user2InitialBalance - 1 ether); // Only 1 ETH spent, not 1.5
    }
    
    // Test insufficient payment
    function testBuyCarbonCreditInsufficientPayment() public {
        // Create and validate project
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmCarbonSequestration", 
            OceanGuard.ProjectType.CARBON_SEQUESTRATION, 
            100
        );
        
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Create and list carbon credit
        vm.startPrank(user1);
        oceanGuard.createCarbonCredit(1, 50);
        oceanGuard.listCarbonCredit(1, 1 ether);
        vm.stopPrank();
        
        // Try to buy with insufficient payment
        vm.prank(user2);
        vm.expectRevert("Insufficient payment");
        oceanGuard.buyCarbonCredit{value: 0.5 ether}(1);
    }
    
    // Test buying a carbon credit that doesn't exist
    function testBuyNonExistentCarbonCredit() public {
        vm.prank(user2);
        vm.expectRevert("Credit does not exist");
        oceanGuard.buyCarbonCredit{value: 1 ether}(999);
    }
    
    // Test buying a carbon credit that's not for sale
    function testBuyCarbonCreditNotForSale() public {
        // Create and validate project
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmCarbonSequestration", 
            OceanGuard.ProjectType.CARBON_SEQUESTRATION, 
            100
        );
        
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Create carbon credit but don't list it
        vm.prank(user1);
        oceanGuard.createCarbonCredit(1, 50);
        
        // Try to buy unlisted carbon credit
        vm.prank(user2);
        vm.expectRevert("Not for sale");
        oceanGuard.buyCarbonCredit{value: 1 ether}(1);
    }
    
    // Test token calculation
    function testCalculateTokenAmount() public {
        // Plastic removal project
        uint256 plasticTokens = oceanGuard.calculateTokenAmount(
            OceanGuard.ProjectType.PLASTIC_REMOVAL, 
            1000
        );
        assertEq(plasticTokens, 10000); // 1000 kg * 10 tokens/kg = 10000
        
        // Reef restoration project
        uint256 reefTokens = oceanGuard.calculateTokenAmount(
            OceanGuard.ProjectType.REEF_RESTORATION, 
            200
        );
        assertEq(reefTokens, 10000); // 200 m² * 50 tokens/m² = 10000
        
        // Carbon sequestration project
        uint256 carbonTokens = oceanGuard.calculateTokenAmount(
            OceanGuard.ProjectType.CARBON_SEQUESTRATION, 
            50
        );
        assertEq(carbonTokens, 5000); // 50 tons * 100 tokens/ton = 5000
    }
    
    // Test getAvailableCredits function
    function testGetAvailableCredits() public {
        // Create multiple credits
        _createAndListCarbonCredits();
        
        // Get available credits
        uint256[] memory availableCredits = oceanGuard.getAvailableCredits();
        
        // Should be 2 credits available
        assertEq(availableCredits.length, 2);
        assertEq(availableCredits[0], 1); // First credit ID
        assertEq(availableCredits[1], 3); // Third credit ID
    }
    
    // Test getProjectsByCreator function
    function testGetProjectsByCreator() public {
        // Create projects for user1
        vm.startPrank(user1);
        oceanGuard.createProject("Project 1", OceanGuard.ProjectType.PLASTIC_REMOVAL, 100);
        oceanGuard.createProject("Project 2", OceanGuard.ProjectType.REEF_RESTORATION, 100);
        vm.stopPrank();
        
        // Create a project for user2
        vm.prank(user2);
        oceanGuard.createProject("Project 3", OceanGuard.ProjectType.CARBON_SEQUESTRATION, 100);
        
        // Get projects by user1
        uint256[] memory user1Projects = oceanGuard.getProjectsByCreator(user1);
        
        // Should have 2 projects
        assertEq(user1Projects.length, 2);
        assertEq(user1Projects[0], 1); // First project ID
        assertEq(user1Projects[1], 2); // Second project ID
        
        // Get projects by user2
        uint256[] memory user2Projects = oceanGuard.getProjectsByCreator(user2);
        
        // Should have 1 project
        assertEq(user2Projects.length, 1);
        assertEq(user2Projects[0], 3); // Third project ID
    }
    
    // Test creating a carbon credit with too high amount
    function testCreateCarbonCreditExceedingImpact() public {
        // Create and validate project
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmCarbonSequestration", 
            OceanGuard.ProjectType.CARBON_SEQUESTRATION, 
            100
        );
        
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Try to create a carbon credit with amount > impactMetric
        vm.prank(user1);
        vm.expectRevert("Amount exceeds project impact");
        oceanGuard.createCarbonCredit(1, 101);
    }
    
    // Test creating a carbon credit for a non-carbon project
    function testCreateCarbonCreditForNonCarbonProject() public {
        // Create and validate plastic removal project
        vm.prank(user1);
        oceanGuard.createProject(
            "ipfs://QmPlasticRemoval", 
            OceanGuard.ProjectType.PLASTIC_REMOVAL, 
            1000
        );
        
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Try to create a carbon credit for a plastic removal project
        vm.prank(user1);
        vm.expectRevert("Not a carbon project");
        oceanGuard.createCarbonCredit(1, 50);
    }
    
    // Test failed payment case (this would require a malicious receiver)
    function testBuyCarbonCreditPaymentFailure() public {
        // To properly test this, we would need to create a malicious contract that
        // rejects ETH transfers, which is beyond the scope of this basic test suite
        // but would be important for a full security audit
    }
    
    // Test gas limits with large array returns
    function testGasLimitsWithLargeArrays() public {
        // Create many projects for stress testing
        for (uint256 i = 0; i < 50; i++) {
            vm.prank(user1);
            oceanGuard.createProject(
                "Project",
                OceanGuard.ProjectType.PLASTIC_REMOVAL,
                100
            );
        }
        
        // This should handle 50 projects without issues
        uint256[] memory projects = oceanGuard.getProjectsByCreator(user1);
        assertEq(projects.length, 50);
        
        // Note: In a real-world scenario, with hundreds or thousands of projects,
        // we'd need pagination or other solutions to avoid hitting block gas limits
    }
    
    // Test creating a project with extremely large impact metrics
    function testCreateProjectWithLargeImpactMetric() public {
        // Create a project with a very large impact metric
        // This tests for potential overflow when calculating token amounts
        vm.prank(user1);
        oceanGuard.createProject(
            "Large Project",
            OceanGuard.ProjectType.PLASTIC_REMOVAL,
            type(uint128).max // Very large number, but not so large it will overflow when multiplied
        );
        
        // Validate the project
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Get the token amount that would be issued
        uint256 tokenAmount = oceanGuard.calculateTokenAmount(
            OceanGuard.ProjectType.PLASTIC_REMOVAL,
            type(uint128).max
        );
        
        // This would revert if an overflow occurred in Solidity 0.8+
        // We're just checking that the calculation completes
        assertGt(tokenAmount, 0);
    }
    
    // Helper function to create and list multiple carbon credits
    function _createAndListCarbonCredits() internal {
        // Create and validate a carbon project
        vm.prank(user1);
        oceanGuard.createProject(
            "Carbon Project",
            OceanGuard.ProjectType.CARBON_SEQUESTRATION,
            300
        );
        
        vm.prank(validator);
        oceanGuard.validateProject(1);
        
        // Create three carbon credits
        vm.startPrank(user1);
        
        // Credit 1 - List for sale
        oceanGuard.createCarbonCredit(1, 100);
        oceanGuard.listCarbonCredit(1, 1 ether);
        
        // Credit 2 - Don't list for sale
        oceanGuard.createCarbonCredit(1, 100);
        
        // Credit 3 - List for sale
        oceanGuard.createCarbonCredit(1, 100);
        oceanGuard.listCarbonCredit(3, 2 ether);
        
        vm.stopPrank();
    }
}