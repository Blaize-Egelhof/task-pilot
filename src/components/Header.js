import React, { useContext } from 'react'
import { Navbar, Nav, Button } from 'react-bootstrap';
import styles from '../css/Header.Module.css';
import profilepic from '../assets/defaultprofilepic/p5-default-profile-pic.jpg'
import {NavLink} from 'react-router-dom'
import { CurrentUserContext } from '../App';

export default function Header() {
  const currentUser = useContext(CurrentUserContext)
  const loggedOutIcons= <>{currentUser?.username}</>
  const loggedInIcons =( <>
        <div className={styles.sidebar}>
        <Nav className={styles.navStyling} >
          <NavLink to="/related-tasks/${currentUser.id}`" className={styles.NavLink} activeClassName={styles.Active} >
            <Button variant="outline-light" className="mb-2 ms-1 me-1">Home</Button>
          </NavLink>
          <NavLink to="/inbox/${currentUser.id}`" className={styles.NavLink} activeClassName={styles.Active}>
          <Button variant="outline-light" className="mb-2 ms-1 me-1">Inbox</Button>
          </NavLink>
          <Button variant="outline-light" className={`mb-2 ms-1 me-1 ${styles.signOutButton} ${styles.signOutButtonPositioning}`}>SignOut</Button>
        </Nav>
      </div>
  </>)

  const userIconLoggedIn = (<>
          <Nav>
          <NavLink to="/user-profile/${currentUser.id}`" className="nav-link">
            <div className={`me-2 ${styles.circularButton}`}>
              <img className={styles.circularButtonImg} src={profilepic} alt="User Profile Pic" />
            </div>
          </NavLink>
        </Nav>
  </>)
  const userIconLoggedOut = ('')

  return (
    <>
      <Navbar fixed="top" className={styles.headerHorizontal}>
        <div className="me-auto">
          <p className={`${styles.whiteText} ${styles.headerSize} me-2`}>Task Pilot</p>
        </div>
      {currentUser? userIconLoggedIn : userIconLoggedOut}
      </Navbar>
      {currentUser? loggedInIcons : loggedOutIcons}
    </>
  );
}
