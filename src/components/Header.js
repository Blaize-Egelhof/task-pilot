import React, { useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import styles from '../css/Header.Module.css';
import profilepic from '../assets/defaultprofilepic/p5-default-profile-pic.jpg';
import { NavLink, useHistory } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import axios from 'axios';

export default function Header() {
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  const handleSignOut = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/logout/");
      setCurrentUser(null);
      history.push("/");
    } catch (err) {
      console.error("Axios error: ", err.response?.data);
      setErrors(err.response?.data);
    }
  };

  const loggedOutIcons = ('');
  const loggedInIcons = (
    <>
      <div className={styles.sidebar}>
        <Nav className={styles.navStyling}>
          <NavLink to={`/related-tasks/${currentUser?.id}`} className={styles.NavLink} activeClassName={styles.Active}>
            <Button variant="outline-light" className="mb-2 ms-1 me-1">Home</Button>
          </NavLink>
          <NavLink to={`/inbox/${currentUser?.id}`} className={styles.NavLink} activeClassName={styles.Active}>
            <Button variant="outline-light" className="mb-2 ms-1 me-1">Inbox</Button>
          </NavLink>
          <Button
            variant="outline-light"
            className={`mb-2 ms-1 me-1 ${styles.signOutButton} ${styles.signOutButtonPositioning}`}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Nav>
      </div>
    </>
  );

  const userIconLoggedIn = (
    <>
      <Nav>
        <NavLink to={`/user-profile/${currentUser?.id}`} className="nav-link">
          <div className={`me-2 ${styles.circularButton}`}>
            <img className={styles.circularButtonImg} src={profilepic} alt="User Profile Pic" />
          </div>
        </NavLink>
      </Nav>
    </>
  );

  const userIconLoggedOut = ('');

  return (
    <>
      <Navbar fixed="top" className={styles.headerHorizontal}>
        <div className="me-auto">
          <p className={`${styles.whiteText} ${styles.headerSize} me-2`}>Task Pilot</p>
        </div>
        {currentUser ? userIconLoggedIn : userIconLoggedOut}
      </Navbar>
      {currentUser ? loggedInIcons : loggedOutIcons}
    </>
  );
}
