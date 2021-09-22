// SPDX-License-Identifier: MIT
pragma solidity ^0.8.5;

contract Migrations {
  address public owner;
  uint public last_completed_migration;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    if (msg.sender == owner) 
    _;
  }

  function setCompleted(uint completed) public onlyOwner {
    last_completed_migration = completed;
  }
}
