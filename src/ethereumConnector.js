import { ethers } from 'ethers'
import SquadNFT from './artifacts/contracts/SquadNFT.sol/SquadNFT.json'
import Dungeon from './artifacts/contracts/Dungeon.sol/Dungeon.json'
import { toHexString, exportToJson } from './utils'

const mintPrice = "5.0";
const questPrice = "5.5";

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
        else {
            return null;
        }
    } catch (err) {
        console.log(err)
    }

}

export async function fetchQuestStage() {
    await loadEthereumAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(dungeonAddress, Dungeon.abi, provider);
    try {
        const stage = await contract.getQuestStage();
        return stage;
    } catch (err) {
        console.log(err)
    }

}

export async function startQuest(byteEnemySquad) {
    const account = await loadEthereumAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(dungeonAddress, Dungeon.abi, signer);
    try {
        const nonceInt = await contract.getNonce(); // parse
        let nonce = nonceInt.toString();
        while (nonce.length < 6) {
            nonce = `0${nonce}`;
        }
        const blindingFactor = toHexString(ethers.utils.randomBytes(32));
        console.log(`Blinding factor2: ${blindingFactor}`);
        const commitment = await ethers.utils.keccak256(`${account}${byteEnemySquad}${nonce}${blindingFactor}`);

        const transaction = await contract.createQuest(commitment, {
            value: ethers.utils.parseEther(questPrice)
        });
        await transaction.wait();
        exportToJson({
            byteEnemySquad,
            blindingFactor
        });

    } catch (err) {
        console.log(err)
    }
}

export async function playQuest(unit1, unit2, unit3) {
    await loadEthereumAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(dungeonAddress, Dungeon.abi, signer);
    try {
        const transaction = await contract.playQuest(unit1, unit2, unit3, {
            value: ethers.utils.parseEther(questPrice)
        });
        await transaction.wait();

    } catch (err) {
        console.log(err)
    }
}

export async function resolveQuest(dungeonSquad, blindingFactor) {
    await loadEthereumAccount();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(dungeonAddress, Dungeon.abi, signer);
    try {
        const transaction = await contract.resolveQuest(`0x${dungeonSquad}`, `0x${blindingFactor}`);
        await transaction.wait();
        return true;

    } catch (err) {
        console.log(err)
        return false;
    }
}

export const nftSquadAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
export const dungeonAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";