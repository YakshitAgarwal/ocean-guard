// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/OceanGuardGovernance.sol";
// No need to import the token contract if you're just using its address

contract DeployOceanGuardGovernance is Script {
    function run() public {
        // Retrieve private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Get the OceanGuardToken address from environment variable
        address oceanGuardToken = vm.envAddress("OCEAN_GUARD_TOKEN_ADDRESS");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the OceanGuardGovernance contract with the existing token address
        OceanGuardGovernance governance = new OceanGuardGovernance(oceanGuardToken);
        console.log("OceanGuardGovernance deployed at:", address(governance));
        
        // Stop broadcasting transactions
        vm.stopBroadcast();
        
        // Log deployment information
        console.log("Deployment completed successfully");
        console.log("OceanGuard Token: ", oceanGuardToken);
        console.log("OceanGuardGovernance: ", address(governance));
    }
}