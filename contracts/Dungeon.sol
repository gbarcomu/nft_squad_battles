// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./QuestExecution.sol";
import "./SquadNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dungeon is QuestExecution, Ownable {
    enum Stage {
        NotStarted,
        Outstanding,
        Completed
    }

    SquadNFT squadNFT;

    bytes32 private dungeonSquadCommitment;
    bytes4 private playerSelectedSquad;
    uint32 private nonce;
    Stage private questStage;

    uint256 private betPrice = 5.5 ether;
    uint256 private fee = 0.5 ether;
    uint256 private prize = 10 ether;
    uint256 private timeToResolveQuest = 1 days;

    address payable playerAddress;

    uint256 private questPlayedTimestamp;

    // function releaseAfterSixMonths() public {
    // require(block.timestamp >= DEPLOYED_TIME + 180 days);
    // }

    event IsPlayerWinner(bool);

    constructor(address squadNFTAddress) {
        questStage = Stage.NotStarted;
        nonce = 0;
        squadNFT = SquadNFT(squadNFTAddress);
    }

    function getQuestStage() public view returns (Stage) {
        return questStage;
    }

    function createQuest(bytes32 newDungeonSquadCommitment)
        public
        payable
        notStartedQuest
    {
        require(msg.value == betPrice, "Error: Price not correct");
        payable(owner()).transfer(fee);
        dungeonSquadCommitment = newDungeonSquadCommitment;
        questStage = Stage.Outstanding;
    }

    function playQuest(
        uint8 squadUnit1,
        uint8 squadUnit2,
        uint8 squadUnit3
    )
        public
        payable
        correctUnitSelection(squadUnit1, squadUnit2, squadUnit3)
        outstandingQuest
    {
        require(msg.value == betPrice, "Error: Price not correct");
        payable(owner()).transfer(fee);
        playerAddress = payable(msg.sender);

        bytes8 wholeSquad = squadNFT.getSquadComposition(msg.sender);
        playerSelectedSquad = (
            concatBytes(
                wholeSquad[squadUnit1],
                wholeSquad[squadUnit2],
                wholeSquad[squadUnit3]
            )
        );
        questStage = Stage.Completed;
        questPlayedTimestamp = block.timestamp;
    }

    function concatBytes(
        bytes1 _a,
        bytes1 _b,
        bytes1 _c
    ) private pure returns (bytes4) {
        return (bytes4(_a) | (bytes4(_b) >> 8) | (bytes4(_c) >> 16));
    }

    function resolveQuest(bytes4 dungeonSquad, bytes32 blindingFactor)
        public
        checkCommitment(dungeonSquad, blindingFactor)
        completedQuest
    {
        bool playerWins = executeQuest(playerSelectedSquad, dungeonSquad);
        emit IsPlayerWinner(playerWins);
        nonce++;

        if (playerWins) {
            playerAddress.transfer(prize);
        } else {
            payable(msg.sender).transfer(prize);
        }

        questStage = Stage.NotStarted;
    }

    function getNonce() public view returns (uint32) {
        return nonce;
    }

    function getRemainingTime() public view completedQuest returns (uint256) {
        return questPlayedTimestamp + timeToResolveQuest - block.timestamp;
    }

    function terminateQuestForInactivity() public completedQuest {
        require(
            questPlayedTimestamp + timeToResolveQuest <= block.timestamp,
            "Error: Quest can't be terminated yet"
        );
        playerAddress.transfer(prize);
        questStage = Stage.NotStarted;
    }

    modifier notStartedQuest() {
        require(questStage == Stage.NotStarted);
        _;
    }

    modifier outstandingQuest() {
        require(questStage == Stage.Outstanding);
        _;
    }

    modifier completedQuest() {
        require(questStage == Stage.Completed);
        _;
    }

    modifier correctUnitSelection(
        uint8 squadUnit1,
        uint8 squadUnit2,
        uint8 squadUnit3
    ) {
        require(
            squadUnit1 < 5 && squadUnit2 < 5 && squadUnit3 < 5,
            "Error, unit number out of bounds, should be lower than 5"
        );
        require(
            squadUnit1 != squadUnit2 &&
                squadUnit1 != squadUnit3 &&
                squadUnit2 != squadUnit3,
            "Error, selected the same unit twice"
        );
        _;
    }

    modifier checkCommitment(bytes4 dungeonSquad, bytes32 blindingFactor) {
        bytes4 bytesNonce = bytes4(abi.encodePacked(nonce));
        bytes32 solvingCommitment = keccak256(
            abi.encodePacked(
                msg.sender,
                dungeonSquad,
                bytesNonce,
                blindingFactor
            )
        );
        require(
            solvingCommitment == dungeonSquadCommitment,
            "Error, quest squad is different from the commited"
        );
        _;
    }
}
