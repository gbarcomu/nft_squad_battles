import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'

import SquadNFT from './artifacts/contracts/SquadNFT.sol/SquadNFT.json'

const nftSquadAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

function App() {

  const [selectedSquad, setSelectedSquad] = useState(["0", "0", "0", "0", "0"])

  const [squadFromSC, setSquadFromSC] = useState("no squad loaded")

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  async function fetchSquad() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      console.log({ provider })
      const contract = new ethers.Contract(nftSquadAddress, SquadNFT.abi, provider)
      try {
        const data = await contract.getSquadComposition(account)
        setSquadFromSC(composeSquad(data));
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  function composeSquad(bytesSquad) {

    const characters = [<div><img src="/img/swordsman.png" style={{ width: "80%" }} alt="" /></div>,
    <div><img src="/img/lancer.png" style={{ width: "80%" }} alt="" /></div>,
    <div><img src="/img/knight.png" style={{ width: "80%" }} alt="" /></div>];

    const imgSquad = bytesSquad.split("").slice(2, 12).map((e, i) => {
      if (i % 2 !== 0) {
        return characters[e]
      }
      else {
        return ''
      }
    })
    return imgSquad
  }

  async function handleSubmit(event) {

    event.preventDefault();

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftSquadAddress, SquadNFT.abi, signer);

      const byteSquad = (`0x${selectedSquad.map(e => `0${e}`).join("")}000000`);
      console.log(byteSquad)

      try {
        const transaction = await contract.registerSquad(byteSquad);
        await transaction.wait();
        console.log(`Squad succesfully registered`);
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  function handleSelection(pos, val, sqd) {
    sqd[pos] = val
    return sqd;
  }

  async function signPayment() {
    //const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc";
    const dungeonSquad = "00010200";
    const nonce = "00000000";
    console.log(account);
    console.log(ethers.utils.keccak256(`${account}${dungeonSquad}${nonce}`));
  }

  return (
    <div className="App">
      <header className="App-header">

        <button onClick={fetchSquad}>Fetch Squad</button>
        <div class="topContainer">
          {squadFromSC}
        </div>

        <p>Select your squad composition:</p>
        <form onSubmit={handleSubmit}>
          <label>
            Member 1:
            <select onChange={e => setSelectedSquad(handleSelection(0, e.target.value, selectedSquad))}>
              <option value="0">Swordsman</option>
              <option value="1">Lancer</option>
              <option value="2">Knight</option>
            </select>
          </label>

          <label>
            Member 2:
            <select onChange={e => setSelectedSquad(handleSelection(1, e.target.value, selectedSquad))}>
              <option value="0">Swordsman</option>
              <option value="1">Lancer</option>
              <option value="2">Knight</option>
            </select>
          </label>

          <label>
            Member 3:
            <select onChange={e => setSelectedSquad(handleSelection(2, e.target.value, selectedSquad))}>
              <option value="0">Swordsman</option>
              <option value="1">Lancer</option>
              <option value="2">Knight</option>
            </select>
          </label>

          <label>
            Member 4:
            <select onChange={e => setSelectedSquad(handleSelection(3, e.target.value, selectedSquad))}>
              <option value="0">Swordsman</option>
              <option value="1">Lancer</option>
              <option value="2">Knight</option>
            </select>
          </label>

          <label>
            Member 5:
            <select onChange={e => setSelectedSquad(handleSelection(4, e.target.value, selectedSquad))}>
              <option value="0">Swordsman</option>
              <option value="1">Lancer</option>
              <option value="2">Knight</option>
            </select>
          </label>

          <input type="submit" value="Submit" />
        </form>

        <button onClick={signPayment}>Commit</button>


      </header>

    </div>
  );
}

export default App;
