// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract OceanGuard is ERC20, Ownable, ReentrancyGuard {
    enum ProjectType { PLASTIC_REMOVAL, REEF_RESTORATION, CARBON_SEQUESTRATION }

    struct ConservationProject {
        uint256 id;
        address creator;
        string metadata;
        ProjectType projectType;
        uint256 impactMetric; // kg plastic, m² reef, or tons CO2
        bool isValidated;
        bool tokensIssued;
    }

    struct CarbonCredit {
        uint256 id;
        address owner;
        uint256 amount; // tons of CO2
        uint256 price; // in wei
        bool forSale;
    }
    
    // State variables
    uint256 public nextProjectId = 1;
    uint256 public nextCreditId = 1;
    
    // Token conversion rates
    uint256 public plasticRemovalRate = 10; // tokens per kg
    uint256 public reefRestorationRate = 50; // tokens per m²
    uint256 public carbonSequestrationRate = 100; // tokens per ton
    
    // Authorized addresses
    mapping(address => bool) public validators;
    
    // Project and credit storage
    mapping(uint256 => ConservationProject) public projects;
    mapping(uint256 => CarbonCredit) public carbonCredits;
    
    // Events
    event ProjectCreated(uint256 indexed projectId, address indexed creator, ProjectType projectType);
    event ProjectValidated(uint256 indexed projectId, address indexed validator);
    event TokensIssued(uint256 indexed projectId, address indexed recipient, uint256 amount);
    event CarbonCreditCreated(uint256 indexed creditId, address indexed owner, uint256 amount);
    event CarbonCreditListed(uint256 indexed creditId, uint256 price);
    event CarbonCreditSold(uint256 indexed creditId, address indexed seller, address indexed buyer, uint256 price);
    event ConversionRatesUpdated(uint256 plasticRate, uint256 reefRate, uint256 carbonRate);
    
    constructor() ERC20("OceanGuard Token", "OCEAN") Ownable(msg.sender) {}
    
    modifier onlyValidator() {
        require(validators[msg.sender], "Not authorized as validator");
        _;
    }
    
    function setValidator(address validator, bool status) external onlyOwner {
        validators[validator] = status;
    }
    
    function updateConversionRates(
        uint256 newPlasticRate,
        uint256 newReefRate,
        uint256 newCarbonRate
    ) external onlyOwner {
        require(newPlasticRate > 0 && newReefRate > 0 && newCarbonRate > 0, "Rates must be positive");
        
        plasticRemovalRate = newPlasticRate;
        reefRestorationRate = newReefRate;
        carbonSequestrationRate = newCarbonRate;
        
        emit ConversionRatesUpdated(newPlasticRate, newReefRate, newCarbonRate);
    }
    
    function createProject(
        string memory metadata,
        ProjectType projectType,
        uint256 impactMetric
    ) external {
        uint256 projectId = nextProjectId;
        nextProjectId++;
        
        projects[projectId] = ConservationProject({
            id: projectId,
            creator: msg.sender,
            metadata: metadata,
            projectType: projectType,
            impactMetric: impactMetric,
            isValidated: false,
            tokensIssued: false
        });
        
        emit ProjectCreated(projectId, msg.sender, projectType);
    }
    
    function validateProject(uint256 projectId) external onlyValidator {
        ConservationProject storage project = projects[projectId];
        require(project.id == projectId, "Project does not exist");
        require(!project.isValidated, "Project already validated");
        
        project.isValidated = true;
        emit ProjectValidated(projectId, msg.sender);
    }
    
    function issueTokens(uint256 projectId) external nonReentrant {
        ConservationProject storage project = projects[projectId];
        
        require(project.id == projectId, "Project does not exist");
        require(project.creator == msg.sender, "Only creator can claim tokens");
        require(project.isValidated, "Project not validated");
        require(!project.tokensIssued, "Tokens already issued");
        
        uint256 tokenAmount = calculateTokenAmount(project.projectType, project.impactMetric);
        project.tokensIssued = true;
        
        _mint(msg.sender, tokenAmount);
        emit TokensIssued(projectId, msg.sender, tokenAmount);
    }
    
    function createCarbonCredit(uint256 projectId, uint256 amount) external {
        ConservationProject storage project = projects[projectId];
        
        require(project.id == projectId, "Project does not exist");
        require(project.creator == msg.sender, "Only creator can create credits");
        require(project.isValidated, "Project not validated");
        require(project.projectType == ProjectType.CARBON_SEQUESTRATION, "Not a carbon project");
        require(amount <= project.impactMetric, "Amount exceeds project impact");
        
        uint256 creditId = nextCreditId;
        nextCreditId++;
        
        carbonCredits[creditId] = CarbonCredit({
            id: creditId,
            owner: msg.sender,
            amount: amount,
            price: 0,
            forSale: false
        });
        
        emit CarbonCreditCreated(creditId, msg.sender, amount);
    }

    function listCarbonCredit(uint256 creditId, uint256 price) external {
        CarbonCredit storage credit = carbonCredits[creditId];
        
        require(credit.id == creditId, "Credit does not exist");
        require(credit.owner == msg.sender, "Not the owner");
        require(price > 0, "Price must be positive");
        
        credit.price = price;
        credit.forSale = true;
        
        emit CarbonCreditListed(creditId, price);
    }
    
    function buyCarbonCredit(uint256 creditId) external payable nonReentrant {
        CarbonCredit storage credit = carbonCredits[creditId];
        
        require(credit.id == creditId, "Credit does not exist");
        require(credit.forSale, "Not for sale");
        require(msg.value >= credit.price, "Insufficient payment");
        
        address seller = credit.owner;
        uint256 price = credit.price;
        
        credit.owner = msg.sender;
        credit.forSale = false;
        credit.price = 0;

        (bool sent,) = payable(seller).call{value: price}("");
        require(sent, "Payment failed");
        
        if (msg.value > price) {
            (bool refunded,) = payable(msg.sender).call{value: msg.value - price}("");
            require(refunded, "Refund failed");
        }
        
        emit CarbonCreditSold(creditId, seller, msg.sender, price);
    }
    
    function calculateTokenAmount(ProjectType projectType, uint256 impactMetric) public view returns (uint256) {
        if (projectType == ProjectType.PLASTIC_REMOVAL) {
            return impactMetric * plasticRemovalRate;
        } else if (projectType == ProjectType.REEF_RESTORATION) {
            return impactMetric * reefRestorationRate;
        } else {
            return impactMetric * carbonSequestrationRate;
        }
    }
    
    function getAvailableCredits() external view returns (uint256[] memory) {
        uint256 count = 0;

        for (uint256 i = 1; i < nextCreditId; i++) {
            if (carbonCredits[i].forSale) {
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        uint256 index = 0; 

        for (uint256 i = 1; i < nextCreditId; i++) {
            if (carbonCredits[i].forSale) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }

    function getProjectsByCreator(address creator) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        for (uint256 i = 1; i < nextProjectId; i++) {
            if (projects[i].creator == creator) {
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i < nextProjectId; i++) {
            if (projects[i].creator == creator) {
                result[index] = i;
                index++;
            }
        }
        
        return result;
    }
}