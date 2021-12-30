import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Menu } from '../Menu';
import { DisplayUserSquad } from '../DisplayUserSquad';
import { fetchQuestStage, startQuest, resolveQuest } from '../ethereumConnector';
import { useState, useEffect } from 'react';

export default function CreateQuest() {

  const [questStage, setQuestStage] = useState();

  useEffect(() => {
    try {
      fetchQuestStage().then(data => {
        if (parseInt(data) === 0) {
          setQuestStage(<div className="d-grid gap-2"><Button variant="dark" onClick={handleShow}>Create new quest!</Button>
            <Button variant="dark" disabled>Resolve quest!</Button></div>);
        }
        else if (parseInt(data) === 1) {
          setQuestStage(<div className="d-grid gap-2"><Button variant="dark" disabled>Create new quest!</Button>
            <Button variant="dark" disabled>Resolve quest!</Button>
            <h5>There is a quest outstanding, wait until someone plays it, or play it yourself!</h5></div>);
        }
        else {
          setQuestStage(<div className="d-grid gap-2"><Button variant="dark" disabled>Create new quest!</Button>
            <Button variant="dark" onClick={handleShow2}>Resolve quest!</Button></div>);
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

  /*********** Second modal */

  const [show2, setShow2] = useState(false);

  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [files, setFiles] = useState("");

  function handleChange(e) {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      console.log("e.target.result", e.target.result);
      const resolveData = JSON.parse(e.target.result);
      setFiles(resolveData);
    };
  }

  function handleSubmitCommitment(event) {
    event.preventDefault();
    if (files.byteEnemySquad !== undefined && files.blindingFactor !== undefined) {
      console.log(files.byteEnemySquad, files.blindingFactor)
      resolveQuest(files.byteEnemySquad, files.blindingFactor);
    }
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
            <Button variant="secondary" onClick={handleClose2}>Close</Button>
            <Button variant="dark" type="submit">Launch quest!</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Upload the quest data to resolve it!</Modal.Title>
        </Modal.Header>


        <Form onSubmit={handleSubmitCommitment}>
          <Modal.Body>

            <Form.Label>File</Form.Label>
            <Form.Control
              type="file"
              required
              name="file"
              onChange={handleChange}
            />

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose2}>Close</Button>
            <Button variant="dark" type="submit">Resolve quest!</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}