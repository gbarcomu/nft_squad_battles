import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Menu } from '../Menu';
import { MintSquad } from '../MintSquad';
import { DisplayUserSquad } from '../DisplayUserSquad';

export default function CreateSquad() {
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
              <Image src="/img/blacksmith.png" fluid />
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <MintSquad />
          </Row>
        </Col>
        <Col></Col>
      </Row>
    </div>
  );
}