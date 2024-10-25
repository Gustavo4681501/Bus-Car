import React, { useContext, useState } from 'react';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { SessionContext } from '../Auth/Authentication/SessionContext'; // Importar el contexto
import User from '../Auth/Authentication/User';
import Logout from '../Auth/Authentication/Logout';

function BuscarNavbar() {
  const { currUser, setCurrUser } = useContext(SessionContext); // Acceder al contexto
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar collapseOnSelect expand="lg" className="bg-primary mb-2">
        <Container>
          <Navbar.Brand href="/">Bus-Car</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/create-route">Crear Ruta</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
              <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              {currUser ? (
                <Logout setCurrUser={setCurrUser} />
              ) : (
                <Button variant="outline-light" onClick={() => setShowModal(true)}>Iniciar Sesión</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Autenticación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <User setShowModal={setShowModal} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default BuscarNavbar;
