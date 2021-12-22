// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SquadNFT is ERC721Enumerable, Ownable {
    constructor() ERC721("SquadNFT", "SQD") {
        tokenCounter = 0;
    }

    uint256 private mintPrice = 5 ether;

    uint32 private tokenCounter;
    mapping(uint32 => bytes8) tokenToSquad;

    function registerSquad(bytes8 squadComposition)
        public
        payable
        validSquad(squadComposition)
    {
        if (msg.sender != owner()) {
            require(msg.value == mintPrice, "Error: Price not enough");
            payable(owner()).transfer(mintPrice);
        }

        _safeMint(msg.sender, tokenCounter);
        tokenToSquad[tokenCounter] = squadComposition;
        tokenCounter++;
    }

    function getSquadComposition(address player)
        public
        view
        registeredSquad(player)
        returns (bytes8)
    {
        return tokenToSquad[uint32(tokenOfOwnerByIndex(player, 0))];
    }

    modifier validSquad(bytes8 squadComposition) {
        for (uint8 i = 0; i < 5; i++) {
            require(uint8(squadComposition[i]) <= 2, "Error: Squad not valid");
        }
        _;
    }

    modifier registeredSquad(address player) {
        require(balanceOf(player) > 0, "Error: register a squad first");
        _;
    }
}
