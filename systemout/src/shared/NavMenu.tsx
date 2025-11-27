import React from "react";
import { Nav, Navbar } from "react-bootstrap";

const NavMenu: React.FC = () => {
  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="border-bottom box-shadow mb-3 py-3">
    <Navbar.Brand className='nav' href="/">SystemOut</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Denne toggler menyen */}
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
        <Nav.Link className='navText' href="/">Home</Nav.Link>
        <Nav.Link className='navText' href="/explore">Explore</Nav.Link>
        <Nav.Link className='navText' href="/upload">Upload</Nav.Link>
        <Nav.Link className='navText' href="/images">Images</Nav.Link>
        <Nav.Link className='navText' href="/notes">Notes</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  );
};

export default NavMenu;