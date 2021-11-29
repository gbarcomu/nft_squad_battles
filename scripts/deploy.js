// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  const SquadNFT = await hre.ethers.getContractFactory("SquadNFT");
  const squadNFT = await SquadNFT.deploy();

  const Dungeon = await hre.ethers.getContractFactory("Dungeon");

  await squadNFT.deployed();

  console.log("SquadNFT deployed to:", squadNFT.address);

  const dungeon = await Dungeon.deploy(squadNFT.address);
  await dungeon.deployed();

  console.log("Dungeon deployed to:", dungeon.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
