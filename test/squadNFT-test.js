const { expect } = require("chai");

describe("NFT", function () {

  let SquadNFT, squadNFT, owner, usr1;
  const validSquad = "0x0102000102111111";
  const notValidSquad = "0x0302000102111111";
  const validPrice = "5.0";
  const notValidPrice = "2.0";

  beforeEach(async () => {
    SquadNFT = await ethers.getContractFactory("SquadNFT");
    squadNFT = await SquadNFT.deploy();
    await squadNFT.deployed();
    [owner, usr1] = await ethers.getSigners();
  })

  describe('Minting', () => {
    it("Should mint if price is enough and squad is valid", async function () {

      let squadNFTasUsr1 = squadNFT.connect(usr1);
      await squadNFTasUsr1.registerSquad(validSquad, {
        value: ethers.utils.parseEther(validPrice)
      })

      expect(await squadNFT.balanceOf(usr1.address)).to.equal(1);
    });

    it("Should mint for free if sender is the contract owner and squad is valid", async function () {

      await squadNFT.registerSquad(validSquad);
      expect(await squadNFT.balanceOf(owner.address)).to.equal(1);
    });

    it("Should not mint if price not is enough", async function () {

      let squadNFTasUsr1 = squadNFT.connect(usr1);

      await expect(squadNFTasUsr1.registerSquad(validSquad, {
        value: ethers.utils.parseEther(notValidPrice)
      })).to.be.revertedWith("Error: Price not enough");
    });

    it("Should not mint if squad is not valid", async function () {

      let squadNFTasUsr1 = squadNFT.connect(usr1);

      await expect(squadNFTasUsr1.registerSquad(notValidSquad, {
        value: ethers.utils.parseEther(validPrice)
      })).to.be.revertedWith("Error: Squad not valid");
    });
  });
});