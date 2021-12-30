import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Badge from 'react-bootstrap/Badge';
import { Menu } from '../Menu';
import { DisplayUserSquad } from '../DisplayUserSquad';
import { fetchQuestStage, playQuest } from '../ethereumConnector';
import { useState, useEffect } from 'react';

export default function PlayQuest() {

  const [questStage, setQuestStage] = useState();

  useEffect(() => {
    try {
      fetchQuestStage().then(data => {
        if (parseInt(data) === 1) {
          setQuestStage(<Button variant="dark" onClick={handleShow}>Play ongoing quest!</Button>);
        }
        else {
          setQuestStage(<p>There isn't any quest outstanding, wait until there is one or create it if this is possible!</p>);
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

  const [selectedFightSquad, setSelectedFightSquad] = useState(["0", "1", "2"])

  async function handleSubmitEnemies(event) {

    event.preventDefault();

    await playQuest(selectedFightSquad[0], selectedFightSquad[1], selectedFightSquad[2]);
    setShow(false);

  }

  const [disableSubmitIfRepeated, setDisableSubmitIfRepeated] = useState(false);

  function handleSelection(pos, val, sqd) {
    console.log(val);
    sqd[pos] = val;
    setDisableSubmitIfRepeated(sqd[0] === sqd[1] || sqd[1] === sqd[2] || sqd[2] === sqd[0]);
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
              <Image src="/img/cross-swords.png" fluid />
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
          <Modal.Title>Select your fighters for playing the quest!</Modal.Title>
        </Modal.Header>


        <Form onSubmit={handleSubmitEnemies}>
          <Modal.Body>

          <Badge bg="warning">You can't set the same unit in more than one slot</Badge>

            <Row>
              <Col>
                <Form.Label>
                  Slot 1:
                <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(0, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="0"
                    label="first unit"
                    name="slot1"
                    id="slot1unit1"
                    defaultChecked
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(0, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="1"
                    label="second unit"
                    name="slot1"
                    id="slot1unit2"
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(0, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="2"
                    label="third unit"
                    name="slot1"
                    id="slot1unit3"
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(0, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="3"
                    label="fourth unit"
                    name="slot1"
                    id="slot1unit4"
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(0, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="4"
                    label="fifth unit"
                    name="slot1"
                    id="slot1unit5"
                  />
                </Form.Label>
              </Col>

              <Col>
                <Form.Label>
                  Slot 2:
                <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(1, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="0"
                    label="first unit"
                    name="slot2"
                    id="slot2unit1"
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(1, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="1"
                    label="second unit"
                    name="slot2"
                    id="slot2unit2"
                    defaultChecked
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(1, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="2"
                    label="third unit"
                    name="slot2"
                    id="slot2unit3"
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(1, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="3"
                    label="fourth unit"
                    name="slot2"
                    id="slot2unit4"
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(1, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="4"
                    label="fifth unit"
                    name="slot2"
                    id="slot2unit5"
                  />
                </Form.Label>
              </Col>

              <Col>
                <Form.Label>
                  Slot 1:
                <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(2, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="0"
                    label="first unit"
                    name="slot3"
                    id="slot3unit1"
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(2, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="1"
                    label="second unit"
                    name="slot3"
                    id="slot3unit2"
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(2, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="2"
                    label="third unit"
                    name="slot3"
                    id="slot3unit3"
                    defaultChecked
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(2, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="3"
                    label="fourth unit"
                    name="slot3"
                    id="slot3unit4"
                  />
                  <Form.Check
                    onChange={e => setSelectedFightSquad(handleSelection(2, e.target.value, selectedFightSquad))}
                    type="radio"
                    value="4"
                    label="fifth unit"
                    name="slot3"
                    id="slot3unit5"
                  />
                </Form.Label>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="dark" type="submit" disabled={disableSubmitIfRepeated}>Play quest!</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}