// script/DeployOceanGuard.s.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/OceanGuard.sol";

contract DeployOceanGuard is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        OceanGuard oceanGuard = new OceanGuard();
        
        vm.stopBroadcast();
        
        console.log("OceanGuard deployed at:", address(oceanGuard));
    }
}