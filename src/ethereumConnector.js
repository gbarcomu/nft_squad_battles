import { ethers } from 'ethers'
import SquadNFT from './artifacts/contracts/SquadNFT.sol/SquadNFT.json'

const mintPrice = "5.0"

export async function loadEthereumAccount() {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    return account;
}

export async function mintSquad(byteSquad) {

    await loadEthereumAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftSquadAddress, SquadNFT.abi, signer);

    try {
        const transaction = await contract.registerSquad(byteSquad, {
            value: ethers.utils.parseEther(mintPrice)
        });
        await transaction.wait();
        console.log(`Squad successfully registered`);
    }
    catch (err) {
        console.error(err);
    }
}

export async function fetchSquad() {
    const account = await loadEthereumAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(nftSquadAddress, SquadNFT.abi, provider);
    try {
        const userNFTs = await contract.balanceOf(account);
        console.log(parseInt(userNFTs));
        if (userNFTs >= 1) {
            const data = await contract.getSquadComposition(account);
            return data;
        }
        else{
            return null;
        }
    } catch (err) {
        console.log(err)
    }

}

export const nftSquadAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
export const dungeonAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";