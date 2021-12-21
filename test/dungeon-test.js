const { expect } = require("chai");

describe("Dungeon", function () {

  let SquadNFT, squadNFT, owner, usr1, Dungeon, dungeon;
  const validSquad = "0x0102000102111111";
  const validPrice = "5.0";

  const byteEnemySquad = "00010200";
  const nonce = "00000000";
  const blindingFactor = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const wrongFactor = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdee";

  beforeEach(async () => {
    SquadNFT = await ethers.getContractFactory("SquadNFT");
    squadNFT = await SquadNFT.deploy();
    await squadNFT.deployed();
    await squadNFT.registerSquad(validSquad, {
      value: ethers.utils.parseEther(validPrice)
    });

    Dungeon = await ethers.getContractFactory("Dungeon");
    dungeon = await Dungeon.deploy(squadNFT.address);
    await dungeon.deployed();
    [owner, usr1] = await ethers.getSigners();
  })

  describe('Quest', () => {
    it("Should state be outstanding if quest is created", async function () {
      const commitment = ethers.utils.keccak256(`${owner.address}${byteEnemySquad}${nonce}${blindingFactor}`);
      await dungeon.createQuest(commitment);

      expect(await dungeon.getQuestStage()).to.equal(1);
    });

    it("Should state be completed if quest is played", async function () {

      const commitment = ethers.utils.keccak256(`${owner.address}${byteEnemySquad}${nonce}${blindingFactor}`);
      await dungeon.createQuest(commitment);
      await dungeon.playQuest(0,1,2);

      expect(await dungeon.getQuestStage()).to.equal(2);
    });

    it("Should state be not started if quest is resolved", async function () {

      const commitment = ethers.utils.keccak256(`${owner.address}${byteEnemySquad}${nonce}${blindingFactor}`);
      await dungeon.createQuest(commitment);
      await dungeon.playQuest(0,1,2);
      await dungeon.resolveQuest(`0x${byteEnemySquad}`, `0x${blindingFactor}`);
      
      expect(await dungeon.getQuestStage()).to.equal(0);
    });

    it("Should quest not be resolved if commitment is wrong", async function () {

      const commitment = ethers.utils.keccak256(`${owner.address}${byteEnemySquad}${nonce}${blindingFactor}`);
      await dungeon.createQuest(commitment);
      await dungeon.playQuest(0,1,2);
      await expect(dungeon.resolveQuest(`0x${byteEnemySquad}`, `0x${wrongFactor}`))
      .to.be.revertedWith("Error, quest squad is different from the commited");
    });

  });
});