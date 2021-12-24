

export async function loadEthereumAccount() {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    return account;
}

export const nftSquadAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
export const dungeonAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";