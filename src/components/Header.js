import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap';
import styles from '../css/Header.Module.css';

export default function Header() {
  return (
    <>
      <Navbar fixed="top" bg="dark" variant="dark" className={styles.headerHorizontal}>
        <Nav className="me-auto">
          <Button variant="outline-light" className="me-2">Top Left Button</Button>
        </Nav>
        <Nav>
          <Button variant="outline-light" className="me-2">Top Right Button</Button>
        </Nav>
      </Navbar>
      <div className={styles.sidebar}>
        <Nav className="flex-column">
          <Button variant="outline-light" className="mb-2 ms-1 me-1">Home</Button>
          <Button variant="outline-light" className="mb-2 ms-1 me-1">Inbox</Button>
          <Button variant="outline-light" className={`mb-2 ms-1 me-1 ${styles.signOutButton}`}>SignOut</Button>
        </Nav>
      </div>
    </>
  );
}
