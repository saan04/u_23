// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IWormholeReceiver.sol";
import "./IWormholeRelayer.sol";
import "./IWETH.sol";
import "./IWormhole.sol";
import "./ITokenBridge.sol";
import "./IERC20.sol";

contract Banking {
    mapping (address => uint256) public balances;
    address payable owner;
    IWormhole public wormhole;

    event GiftSent(address indexed sender, address indexed receiver, uint256 amount);

    // Wormhole and TokenBridge contract addresses
    ITokenBridge public tokenBridge;

    constructor(address _wormhole, address _tokenBridge) {
        owner = payable(msg.sender);
        wormhole = IWormhole(_wormhole);
        tokenBridge = ITokenBridge(_tokenBridge);
    }
    function receiveGift() public payable {
        require(msg.value > 0, "Thank you for the amount that is definitely not null");
        balances [msg.sender] += msg.value;
    }
    function withdrawAmount(uint256 amount) public {
        require(msg.sender == owner, "Only the owner can withdraw funds.");
        require(amount <= balances [msg.sender], "You haven't received enough money!");
        require(amount > 0, "Withdrawal amount must be greater than 0.");
        payable (msg.sender).transfer (amount);
        balances [msg.sender] -= amount;
    }
    function transfer (address payable recipient, uint256 amount) public {
        require(amount <= balances [msg.sender], "You do not have enough to give others...Wait for more funding!");
        require(amount > 0, "Transfer amount must be greater than 0; Don't be a cheapskate");
        balances [msg.sender] -= amount;
        balances [recipient] += amount;
        emit GiftSent(msg.sender, recipient, amount);
    }

    function getBalance (address payable user) public view returns (uint256) {
        return balances [user];
     } 
     
     function grantAccess (address payable user) public {
        require(msg.sender == owner, "Only the owner can grant access.");
        owner = user;
    }
    
    function revokeAccess (address payable user) public {
        require(msg.sender == owner, "Only the owner can revoke access.");
        require(user != owner, "Cannot revoke access for the current owner.");
        owner = payable (msg.sender);
    }

    function sendTokensToChain(address token, uint256 amount, uint16 targetChain, address targetAddress) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;

    // Convert Ethereum address to Wormhole format
        bytes32 wormholeTargetAddress = bytes32(uint256(uint160(targetAddress)) << 96);

    // Approve the tokenBridge to move the tokens
        IERC20(token).approve(address(tokenBridge), amount);

    // Transfer the tokens to the target chain with additional parameters
        tokenBridge.transferTokens(token, amount, targetChain, wormholeTargetAddress, 0, 0);
}

    // Function to claim tokens sent from another chain
    function claimTokensFromChain(bytes memory vaa) public {
         wormhole.submitVAA(vaa);
     }
}