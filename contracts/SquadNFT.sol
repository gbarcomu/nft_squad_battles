// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract SquadNFT is ERC721Enumerable {

    constructor() ERC721("SquadNFT", "SQD") {
        tokenCounter = 0;
    }

    uint32 private tokenCounter;
    mapping (uint32 => bytes8) tokenToSquad;

    function registerSquad(bytes8 squadComposition) public validSquad(squadComposition){
        _mint(msg.sender, tokenCounter);
        tokenToSquad[tokenCounter] = squadComposition;
        tokenCounter++;
    }

    function getSquadComposition() public view returns (bytes8) {
        return tokenToSquad[uint32(tokenByIndex(0))];
    }

    function getSquadMember(uint8 position) public view returns (bytes1) {
        return tokenToSquad[uint32(tokenByIndex(0))][position];
    }

    modifier validSquad(bytes8 squadComposition) {
        for(uint8 i = 0; i < 5; i++) {
            require(uint8(squadComposition[i]) <= 2);
        }  
        _;
   }
}