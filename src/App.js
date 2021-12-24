import { Outlet, Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import { Menu } from './Menu';
import { MintSquad } from './MintSquad';

export default function App() {
  return (
    <div>
      <Menu/>
      <MintSquad/>
      <Outlet />
    </div>
  );
}