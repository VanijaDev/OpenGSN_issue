// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.6;

import "@opengsn/contracts/src/BaseRelayRecipient.sol";


contract TestSC is BaseRelayRecipient {
    uint256 public valueVVV;
    
    constructor(address _forwarder) {
        trustedForwarder = _forwarder;
    }
    
    function versionRecipient() external override virtual view returns (string memory) {
        return "1";
    }
    
    
    function updateValueVVV(uint256 _val) external {
        valueVVV = _val;
    }
}