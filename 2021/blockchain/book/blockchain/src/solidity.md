# Solidity

Solidity is an object-oriented, high-level language for implementing **smart contracts**. 
- Smart contracts are programs which govern the behavior of accounts within the **Ethereum** state.
- The objectives of smart contracts are the **reduction of need** in
    - trusted intermediatories,
    - arbitrations
    - enforcement costs
    - fraud losses
    - reduction of malicious and accidental exceptions

- A contract in the sense of Solidity is a collection of code (its functions) and data (its state) that resides at a specific address on the Ethereum blockchain

```java

// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

// sets the value of a variable and exposes it for other contracts to access. 
contract SimpleStorage {
    uint storedData; // unsigned integer of 256 bit

    // does not  impose access restriction
    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
```

```java
// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

contract Coin {
    // The keyword "public" makes variables
    // accessible from other contracts
    address public minter;
    mapping (address => uint) public balances;

    // Events allow clients to react to specific
    // contract changes you declare
    event Sent(address from, address to, uint amount);

    // Constructor code is only run when the contract
    // is created
    constructor() {
        minter = msg.sender;
    }

    // Sends an amount of newly created coins to an address
    // Can only be called by the contract creator
    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
        balances[receiver] += amount;
    }

    // Errors allow you to provide information about
    // why an operation failed. They are returned
    // to the caller of the function.
    error InsufficientBalance(uint requested, uint available);

    // Sends an amount of existing coins
    // from any caller to an address
    function send(address receiver, uint amount) public {
        if (amount > balances[msg.sender])
            revert InsufficientBalance({
                requested: amount,
                available: balances[msg.sender]
            });

        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }
}
```

## References
[Solidity](https://docs.soliditylang.org/en/v0.8.11/)

