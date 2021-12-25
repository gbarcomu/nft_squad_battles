import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { useState } from 'react';
import { mintSquad } from './ethereumConnector.js';

function MintSquad() {

  const [selectedSquad, setSelectedSquad] = useState(["0", "0", "0", "0", "0"])

  async function handleSubmit(event) {

    event.preventDefault();

    const byteSquad = (`0x${selectedSquad.map(e => `0${e}`).join("")}000000`);

    try {
      mintSquad(byteSquad);
    }
    catch (err) {
      console.error(err);
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