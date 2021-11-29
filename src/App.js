import './App.css';
import { useState } from 'react';
import { ethers } from 'ethers'

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';

import SquadNFT from './artifacts/contracts/SquadNFT.sol/SquadNFT.json'
import Dungeon from './artifacts/contracts/Dungeon.sol/Dungeon.json'

const nftSquadAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const dungeonAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

function App() {

  const [selectedSquad, setSelectedSquad] = useState(["0", "0", "0", "0", "0"])

  const [squadFromSC, setSquadFromSC] = useState(<Button variant="dark" onClick={fetchSquad}>Load Squad</Button>)

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const [userAddress, setUserAddress] = useState(<Button variant="dark" onClick={loadAddress}>Load Address</Button>);


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

  async function loadAddress() {
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setUserAddress(<Col><p>{account}</p></Col>);
  }

  function composeSquad(bytesSquad) {

    const characters = [<Col><div><img src="/img/swordsman.png" style={{ width: "100%" }} alt="" /></div></Col>,
    <Col><div><img src="/img/lancer.png" style={{ width: "100%" }} alt="" /></div></Col>,
    <Col><div><img src="/img/knight.png" style={{ width: "100%" }} alt="" /></div></Col>];

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

  /********************* Modal  *******************/

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedEnemySquad, setSelectedEnemySquad] = useState(["0", "0", "0"])

  async function handleSubmitEnemies(event) {

    event.preventDefault();
    const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const byteEnemySquad = (`${selectedEnemySquad.map(e => `0${e}`).join("")}00`);

    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(dungeonAddress, Dungeon.abi, signer);

      try {
        const nonceInt = await contract.getNonce(); // parse
        let nonce = nonceInt.toString();
        while (nonce.length < 6) {
          nonce = `0${nonce}`;
        }
        const commitment = ethers.utils.keccak256(`${account}${byteEnemySquad}${nonce}`);

        const transaction = await contract.createQuest(commitment);
        await transaction.wait();
        console.log(`Quest successfully created`);
        setShow(false);
        setShowAlert(<Alert variant="success" onClose={() => setShowAlert()} dismissible>Quest created! Quest commitment: {commitment}</Alert>);        
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  const [showAlert, setShowAlert] = useState(false);

  /****************************************/

  return (
    <div className="App">
      {showAlert}
      <Container>
        <Row>
          <Col>
            <Row>
              {squadFromSC}
            </Row>
          </Col>
          <Col md={{ span: 4, offset: 4 }}>
            {userAddress}
          </Col>
        </Row>
        <Row>
          <Col>
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
          </Col>

          <Col>
            <Image src="/img/old-map.png" />
            <div className="d-grid gap-2">
            <Button variant="dark" onClick={handleShow}>Create new quest!</Button>
            </div>
          </Col>

        </Row>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Set the enemy soldiers for the quest!</Modal.Title>
        </Modal.Header>


        <Form onSubmit={handleSubmitEnemies}>
          <Modal.Body>
            <Row>
              <Form.Label>
                Enemy 1:
            <Form.Select onChange={e => setSelectedEnemySquad(handleSelection(0, e.target.value, selectedEnemySquad))}>
                  <option value="0">Swordsman</option>
                  <option value="1">Lancer</option>
                  <option value="2">Knight</option>
                </Form.Select>
              </Form.Label>
            </Row>
            <Row>
              <Form.Label>
                Enemy 2:
            <Form.Select onChange={e => setSelectedEnemySquad(handleSelection(1, e.target.value, selectedEnemySquad))}>
                  <option value="0">Swordsman</option>
                  <option value="1">Lancer</option>
                  <option value="2">Knight</option>
                </Form.Select>
              </Form.Label>
            </Row>
            <Row>
              <Form.Label>
                Enemy 3:
            <Form.Select onChange={e => setSelectedEnemySquad(handleSelection(2, e.target.value, selectedEnemySquad))}>
                  <option value="0">Swordsman</option>
                  <option value="1">Lancer</option>
                  <option value="2">Knight</option>
                </Form.Select>
              </Form.Label>
            </Row>


          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="dark" type="submit">Launch quest!</Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </div>
  );
}

export default App;
