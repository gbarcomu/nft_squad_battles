import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Menu } from '../Menu';
import { DisplayUserSquad } from '../DisplayUserSquad';
import { fetchQuestStage, startQuest } from '../ethereumConnector';
import { useState, useEffect } from 'react';

export default function CreateQuest() {

  const [questStage, setQuestStage] = useState();

  useEffect(() => {
    try {
      fetchQuestStage().then(data => {
        if (parseInt(data) === 0) {
          setQuestStage(<Button variant="dark" onClick={handleShow}>Create new quest!</Button>);
        }
        else {
          setQuestStage(<p>Ongoing quest!</p>);
        }
      });
    }
    catch (err) {
      console.error(err);
    }

  }, []);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [selectedEnemySquad, setSelectedEnemySquad] = useState(["0", "0", "0"])

  async function handleSubmitEnemies(event) {

    event.preventDefault();
    const byteEnemySquad = (`${selectedEnemySquad.map(e => `0${e}`).join("")}00`);

    await startQuest(byteEnemySquad);
    setShow(false);

  }

  function handleSelection(pos, val, sqd) {
    sqd[pos] = val
    return sqd;
  }

  return (
    <div>
      <Menu />
      <Row>
        <Col>
          <DisplayUserSquad />
        </Col>
        <Col xs={8}>
          <Row>
            <Col></Col>
            <Col xs={3}>
              <Image src="/img/old-map.png" fluid />
            </Col>
            <Col></Col>
          </Row>
          <Row>
            {questStage}
          </Row>
        </Col>
        <Col></Col>
      </Row>

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