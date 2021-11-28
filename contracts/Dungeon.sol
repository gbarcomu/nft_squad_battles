// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./QuestExecution.sol";
import "./SquadNFT.sol";

contract Dungeon is QuestExecution{

    enum  Stage {
        NotStarted,
        Outstanding,
        Completed
    }

    SquadNFT squadNFT;

    bytes32 private dungeonSquadCommitment;
    bytes4 private playerSelectedSquad;
    uint32 private nonce;
    Stage private questStage;

    event IsPlayerWinner(bool);

    constructor(address squadNFTAddress) {
        questStage = Stage.NotStarted;
        nonce = 0;
        squadNFT = SquadNFT(squadNFTAddress);
    }

    function createQuest(bytes32 newDungeonSquadCommitment) public notStartedQuest{
        dungeonSquadCommitment = newDungeonSquadCommitment;
        questStage = Stage.Outstanding;
    }

    function playQuest(uint8 squadUnit1, uint8 squadUnit2, uint8 squadUnit3) public 
        correctUnitSelection(squadUnit1, squadUnit2, squadUnit3)
        outstandingQuest {
        bytes8 wholeSquad = squadNFT.getSquadComposition(msg.sender);
        playerSelectedSquad = (concatBytes( wholeSquad[squadUnit1], wholeSquad[squadUnit2], wholeSquad[squadUnit3]));
        questStage = Stage.Completed;
    }

    function concatBytes( bytes1 _a, bytes1 _b, bytes1 _c ) private pure returns (bytes4) {
        return (bytes4(_a) | (bytes4(_b) >> 8) | (bytes4(_c) >> 16));
    }

    function resolveQuest(bytes4 dungeonSquad) public
        checkCommitment(dungeonSquad) completedQuest{
        bool playerWins = executeQuest(playerSelectedSquad, dungeonSquad);
        emit IsPlayerWinner(playerWins);
        nonce++;
        questStage = Stage.NotStarted;
    }

    function getNonce() public view returns(uint32) {
        return nonce;
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

    modifier correctUnitSelection(uint8 squadUnit1, uint8 squadUnit2, uint8 squadUnit3) {
        require(squadUnit1 < 5 && squadUnit2 < 5 && squadUnit3 < 5
        , "Error, unit number out of bounds, should be lower than 5");
        require(squadUnit1 != squadUnit2 && squadUnit1 != squadUnit3 && squadUnit2 != squadUnit3
        , "Error, selected the same unit twice");
        _;
   }

   modifier checkCommitment(bytes4 dungeonSquad) {
        bytes4 bytesNonce = bytes4(abi.encodePacked(nonce));
        bytes32 solvingCommitment = keccak256(abi.encodePacked(msg.sender, dungeonSquad, bytesNonce));
        require (solvingCommitment == dungeonSquadCommitment
        , "Error, quest squad is different from the commited");
        _;
   }

}