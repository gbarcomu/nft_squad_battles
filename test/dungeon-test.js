const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Dungeon", function () {

  let SquadNFT, squadNFT, owner, usr1, Dungeon, dungeon;
  const validSquad = "0x0001010202111111";
  const validMintPrice = "5.0";
  const validDungeonPrice = "5.5";
  const questFee = "1.0";
  const questPrize = "4.5";

  const byteEnemySquad = "00010200";
  const nonce = "00000000";
  const blindingFactor = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const wrongFactor = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdee";

  beforeEach(async () => {
    SquadNFT = await ethers.getContractFactory("SquadNFT");
    squadNFT = await SquadNFT.deploy();
    await squadNFT.deployed();
    await squadNFT.registerSquad(validSquad, {
      value: ethers.utils.parseEther(validMintPrice)
    });

    Dungeon = await ethers.getContractFactory("Dungeon");
    dungeon = await Dungeon.deploy(squadNFT.address);
    await dungeon.deployed();
    [owner, usr1, usr2] = await ethers.getSigners();
  })

  describe('Quest', () => {
    it("Should state be outstanding if quest is created", async function () {
      const commitment = ethers.utils.keccak256(`${owner.address}${byteEnemySquad}${nonce}${blindingFactor}`);
      await dungeon.createQuest(commitment, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });

      expect(await dungeon.getQuestStage()).to.equal(1);
    });

    it("Should state be completed if quest is played", async function () {

      const commitment = ethers.utils.keccak256(`${owner.address}${byteEnemySquad}${nonce}${blindingFactor}`);
      await dungeon.createQuest(commitment, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });
      await dungeon.playQuest(0, 1, 2, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });

      expect(await dungeon.getQuestStage()).to.equal(2);
    });

    it("Should state be not started if quest is resolved", async function () {

      const commitment = ethers.utils.keccak256(`${owner.address}${byteEnemySquad}${nonce}${blindingFactor}`);
      await dungeon.createQuest(commitment, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });
      await dungeon.playQuest(0, 1, 2, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });
      await dungeon.resolveQuest(`0x${byteEnemySquad}`, `0x${blindingFactor}`);

      expect(await dungeon.getQuestStage()).to.equal(0);
    });

    it("Should quest not be resolved if commitment is wrong", async function () {

      const commitment = ethers.utils.keccak256(`${owner.address}${byteEnemySquad}${nonce}${blindingFactor}`);
      await dungeon.createQuest(commitment, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });
      await dungeon.playQuest(0, 1, 2, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });
      await expect(dungeon.resolveQuest(`0x${byteEnemySquad}`, `0x${wrongFactor}`))
        .to.be.revertedWith("Error, quest squad is different from the commited");
    });

  });

  // For now this remains as a manual check
  describe('Quest Execution', () => {

    it("Quest Execution", async function () {

      const enemySquad1 = "00000000";

      const commitment = ethers.utils.keccak256(`${owner.address}${enemySquad1}${nonce}${blindingFactor}`);
      await dungeon.createQuest(commitment, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });
      await dungeon.playQuest(0, 1, 3, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });

      const tx = await dungeon.resolveQuest(`0x${enemySquad1}`, `0x${blindingFactor}`);
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);

      console.log(`Player Squad: 0 Swordsman, 1 Lancer, 2 Knight`);
      console.log(`Enemy Squad: 0 Swordsman, 1 Swordsman, 1 Swordsman`);

      const rand1 = parseInt(receipt.logs[0].data.slice(64, 66), 16);
      const rand2 = parseInt(receipt.logs[0].data.slice(128, 130), 16);
      const rand3 = parseInt(receipt.logs[0].data.slice(192, 194), 16);
      const winner1 = receipt.logs[1].data.slice(64, 66);
      const winner2 = receipt.logs[1].data.slice(128, 130);
      const winner3 = receipt.logs[1].data.slice(192, 194);

      console.log(`Numbers: ${rand1}, ${rand2}, ${rand3}`);
      console.log(`Winner: ${winner1}, ${winner2}, ${winner3}`);
    });

  });

  describe('Quest Economics', () => {

    it("Should balances be correctly updated after a quest is played", async function () {

      const dungeonAsUsr1GameMaster = dungeon.connect(usr1);
      const dungeonAsUsr2Player = dungeon.connect(usr2);
      const squadNFTAsUsr2Player = squadNFT.connect(usr2);
      await squadNFTAsUsr2Player.registerSquad(validSquad, {
        value: ethers.utils.parseEther(validMintPrice)
      });

      const provider = waffle.provider;
      const balanceUsr1GameMasterPrev = ethers.utils.formatEther(await provider.getBalance(usr1.address));
      const balanceUsr2PlayerPrev = ethers.utils.formatEther(await provider.getBalance(usr2.address));
      const balanceOwnerPrev = ethers.utils.formatEther(await provider.getBalance(owner.address));

      const commitment = ethers.utils.keccak256(`${usr1.address}${byteEnemySquad}${nonce}${blindingFactor}`);
      await dungeonAsUsr1GameMaster.createQuest(commitment, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });
      await dungeonAsUsr2Player.playQuest(0, 1, 3, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });
      const tx = await dungeonAsUsr1GameMaster.resolveQuest(`0x${byteEnemySquad}`, `0x${blindingFactor}`);
      const receipt = await ethers.provider.getTransactionReceipt(tx.hash);

      const rand1 = receipt.logs[2].data.slice(-1) === "1";

      const balanceUsr1GameMasterPost = ethers.utils.formatEther(await provider.getBalance(usr1.address));
      const balanceUsr2PlayerPost = ethers.utils.formatEther(await provider.getBalance(usr2.address));
      const balanceOwnerPost = ethers.utils.formatEther(await provider.getBalance(owner.address));

      const balanceUsr1GameMasterExpected = parseFloat(balanceUsr1GameMasterPrev) + (!rand1 ? parseFloat(questPrize) : -parseFloat(validDungeonPrice));
      const balanceUsr2PlayerExpected = parseFloat(balanceUsr2PlayerPrev) + (rand1 ? parseFloat(questPrize) : -parseFloat(validDungeonPrice));

      expect(parseFloat(balanceOwnerPost)).to.equal(parseFloat(balanceOwnerPrev) + parseFloat(questFee));
      expect(parseFloat(balanceUsr2PlayerPost).toFixed(1)).to.equal(balanceUsr2PlayerExpected.toFixed(1));
      expect(parseFloat(balanceUsr1GameMasterPost).toFixed(1)).to.equal(balanceUsr1GameMasterExpected.toFixed(1));

    });

  });

  describe('Quest Time', () => {

    it("Shouldn't quest be terminated before the time has passed", async function () {

      const dungeonAsUsr1GameMaster = dungeon.connect(usr1);
      const dungeonAsUsr2Player = dungeon.connect(usr2);
      const squadNFTAsUsr2Player = squadNFT.connect(usr2);
      await squadNFTAsUsr2Player.registerSquad(validSquad, {
        value: ethers.utils.parseEther(validMintPrice)
      });

      const commitment = ethers.utils.keccak256(`${usr1.address}${byteEnemySquad}${nonce}${blindingFactor}`);
      await dungeonAsUsr1GameMaster.createQuest(commitment, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });
      await dungeonAsUsr2Player.playQuest(0, 1, 3, {
        value: ethers.utils.parseEther(validDungeonPrice)
      });

      await expect(dungeon.terminateQuestForInactivity())
        .to.be.revertedWith("Error: Quest can't be terminated yet");

    });
  });
});
