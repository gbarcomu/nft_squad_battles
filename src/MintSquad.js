import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

import SquadNFT from './artifacts/contracts/SquadNFT.sol/SquadNFT.json'

import { useState } from 'react';
import { ethers } from 'ethers'

import { nftSquadAddress, loadEthereumAccount } from './ethereumConnector.js';


function MintSquad() {
  //const nftSquadAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  const [selectedSquad, setSelectedSquad] = useState(["0", "0", "0", "0", "0"])

  async function handleSubmit(event) {

    event.preventDefault();

    if (typeof window.ethereum !== 'undefined') {
      await loadEthereumAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(nftSquadAddress, SquadNFT.abi, signer);

      const byteSquad = (`0x${selectedSquad.map(e => `0${e}`).join("")}000000`);
      console.log(byteSquad)

      try {
        const transaction = await contract.registerSquad(byteSquad);
        await transaction.wait();
        console.log(`Squad successfully registered`);
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

  return (
    <Container>
      <p>Select your squad composition:</p>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Form.Label>
            Member 1:
      <Form.Select onChange={e => setSelectedSquad(handleSelection(0, e.target.value, selectedSquad))}>
              <option value="0">Swordsman</option>
              <option value="1">Lancer</option>
              <option value="2">Knight</option>
            </Form.Select>
          </Form.Label>
        </Row>
        <Row>
          <Form.Label>
            Member 2:
      <Form.Select onChange={e => setSelectedSquad(handleSelection(1, e.target.value, selectedSquad))}>
              <option value="0">Swordsman</option>
              <option value="1">Lancer</option>
              <option value="2">Knight</option>
            </Form.Select>
          </Form.Label>
        </Row>
        <Row>
          <Form.Label>
            Member 3:
      <Form.Select onChange={e => setSelectedSquad(handleSelection(2, e.target.value, selectedSquad))}>
              <option value="0">Swordsman</option>
              <option value="1">Lancer</option>
              <option value="2">Knight</option>
            </Form.Select>
          </Form.Label>
        </Row>
        <Row>
          <Form.Label>
            Member 4:
      <Form.Select onChange={e => setSelectedSquad(handleSelection(3, e.target.value, selectedSquad))}>
              <option value="0">Swordsman</option>
              <option value="1">Lancer</option>
              <option value="2">Knight</option>
            </Form.Select>
          </Form.Label>
        </Row>
        <Row>
          <Form.Label>
            Member 5:
      <Form.Select onChange={e => setSelectedSquad(handleSelection(4, e.target.value, selectedSquad))}>
              <option value="0">Swordsman</option>
              <option value="1">Lancer</option>
              <option value="2">Knight</option>
            </Form.Select>
          </Form.Label>
        </Row>
        <div className="d-grid gap-2">
          <Button variant="dark" type="submit">Submit</Button>
        </div>
      </Form>
    </Container>
  )
}

export { MintSquad }