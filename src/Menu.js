import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

import { loadEthereumAccount } from './ethereumConnector.js';


function Menu() {

    const [userAddress, setUserAddress] = useState(<Button variant="light" onClick={loadAddress}>Load Address</Button>);

    async function loadAddress() {
        const account = await loadEthereumAccount();
        setUserAddress(<Navbar.Text>{account}</Navbar.Text>);
      }

    return (
        <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">SquadNFT</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/createsquad">Create Squad</Nav.Link>
            <Nav.Link as={Link} to="/playquest">Play Quest</Nav.Link>
            <Nav.Link as={Link} to="/createquest">Game Master</Nav.Link>
          </Nav>
          <Nav>
          {userAddress}
          </Nav>
        </Container>
      </Navbar>
    )
}

export { Menu }