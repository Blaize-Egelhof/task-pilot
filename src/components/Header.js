import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import styles from '../css/Header.Module.css';
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
      const {data} = await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null); // Update state to null
      console.log(currentUser)
      // history.push("/sign-in");
    } catch (err) {
      console.error("Axios error: ", err.response?.data);
      setErrors(err.response?.data);
      console.log(errors)
    }
  };

  // useEffect(() => {
  //   console.log("Current User after setting to null:", currentUser);
  // }, [currentUser]);  // useEffect with dependency on currentUser

  const loggedOutIcons = (''); // Placeholder for logged out icons
  const loggedInIcons = (
    <>
      <div className={styles.sidebar}>
        <Nav className={styles.navStyling}>
          <NavLink to={'/home-page'} className={styles.NavLink} activeClassName={styles.Active}>
            <Button variant="dark" className="mb-2 ms-1 me-1">Home</Button>
          </NavLink>
          <NavLink to={`/create-task/`} className={styles.NavLink} activeClassName={styles.Active}>
            <Button variant="dark" className="mb-2 ms-1 me-1">Create</Button>
          </NavLink>
          <Button
            variant="dark"
            className={`mb-2 ms-1 me-1 ${styles.signOutButtonPositioning}`}
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
        <NavLink to={`/user-profile/${currentUser?.pk}`} className="nav-link">
          <div className={`me-2 ${styles.circularButton}`}>
            <img 
              className={styles.circularButtonImg} 
              src={currentUser?.profile_image}
              alt="User Profile Pic" 
            />
          </div>
        </NavLink>
      </Nav>
    </>
  );

  const userIconLoggedOut = (''); // Placeholder for logged out user icon

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
