// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

// pragma solidity 0.5.16;

contract SimpleStorage {
    string ipfsHash;

    function set(string memory hash) public {
        ipfsHash = hash;
    }

    function get() public view returns (string memory) {
        return ipfsHash;
    }
}
