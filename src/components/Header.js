import React from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap';
import styles from '../css/Header.Module.css';
import profilepic from '../assets/defaultprofilepic/p5-default-profile-pic.jpg'
import {NavLink} from 'react-router-dom'

export default function Header() {
  return (
    <>
      <Navbar fixed="top" bg="dark" variant="dark" className={styles.headerHorizontal}>
        <div className="me-auto">
          <p className={`${styles.whiteText} ${styles.headerSize} me-2`}>Task Pilot</p>
        </div>
        <Nav>
          <NavLink to="/user-profile/${userID}`" className="nav-link">
            <div className={`me-2 ${styles.circularButton}`}>
              <img className={styles.circularButtonImg} src={profilepic} alt="User Profile Pic" />
            </div>
          </NavLink>
        </Nav>
      </Navbar>
      <div className={styles.sidebar}>
        <Nav className={styles.navStyling} >
          <NavLink to="/related-tasks/${userID}`" className={styles.NavLink} activeClassName={styles.Active} >
            <Button variant="outline-light" className="mb-2 ms-1 me-1">Home</Button>
          </NavLink>
          <NavLink to="/inbox/${userID}`" className={styles.NavLink} activeClassName={styles.Active}>
          <Button variant="outline-light" className="mb-2 ms-1 me-1">Inbox</Button>
          </NavLink>
          <Button variant="outline-light" className={`mb-2 ms-1 me-1 ${styles.signOutButton} ${styles.signOutButtonPositioning}`}>SignOut</Button>
        </Nav>
      </div>
    </>
  );
}
