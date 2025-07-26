// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ActionVerifier {
    mapping(bytes32 => bool) public verifiedActions;
    
    function verifyAction(
        bytes memory _proof,
        string memory _location
    ) external returns (bool) {
        bytes32 actionHash = keccak256(abi.encodePacked(_proof, _location));
        verifiedActions[actionHash] = true;
        return true;
    }
}