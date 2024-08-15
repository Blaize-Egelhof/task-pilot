import React, { useState } from 'react';
import { Navbar, Nav, Button, Modal, Alert } from 'react-bootstrap';
import styles from '../css/Header.module.css';
import { NavLink } from 'react-router-dom';
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';
import axios from 'axios';
import { removeTokenTimestamp } from '../utils/utils';

/**
 * Header component for the application.
 * 
 * Renders navigation, user icons, and handles sign-out functionality.
 */
export default function Header() {
  // State to manage errors (currently unused in this component)
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false); // State to manage modal visibility
  // variable to hold currently signed in user data
  const currentUser = useCurrentUser(); // Corrected to use useCurrentUser
  // variable to modify currentUser variable if a logout succeeds
  const setCurrentUser = useSetCurrentUser(); // Correctly getting the setter function

  /**
   * Handles the sign-out process.
   * - Sends a POST request to log the user out.
   * - Updates currentUser context to null upon successful sign-out.
   * - Sets errors state if there's an error response.
   * - Closes the modal after sign-out.
   */ 
  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      // localStorage.removeItem('accessToken');
      // localStorage.removeItem('refreshToken');
      // set currentUser variable to null if sign out works
      setCurrentUser(null);
      removeTokenTimestamp();
    } catch (err) {
      // set errors if found 
      setErrors(err.response?.data);
    }
    setShowModal(false); // Close the modal after sign-out
  };

  const handleShowModal = () => setShowModal(true); // Show the modal
  const handleCloseModal = () => setShowModal(false); // Close the modal

  const loggedOutIcons = (''); // Placeholder for logged out icons
  //variable to hold icons if a user signs in
  const loggedInIcons = (
    <>
      <div className={styles.sidebar}>
        <Nav className={`${styles.navStyling}`}>
          <NavLink to={'/home-page'} className={styles.NavLink} activeClassName={styles.Active}>
            <Button variant="dark" className={`mb-2 ms-1 me-1`}>Home</Button>
          </NavLink>
          <NavLink to={`/create-task/`} className={styles.NavLink} activeClassName={styles.Active}>
            <Button variant="dark" className="mb-2 ms-1 me-1">Create</Button>
          </NavLink>
          <Button
            variant="dark"
            className={`${styles.signOutButtonPositioning}`}
            onClick={handleShowModal} // Show modal on click
          >
            Sign Out
          </Button>
        </Nav>
      </div>
    </>
  );

  /**
   * JSX for user profile icon and link when user is logged in.
   */
  const userIconLoggedIn = (
    <>
      <Nav>
      {errors && (
        <Alert className='d-none' variant="warning">
          {errors.message}
        </Alert>
      )}
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

  /**
   * Renders the header component.
   * - Conditionally renders different sections based on user sign-in status.
   */
  return (
    <>
      <Navbar fixed="top" className={styles.headerHorizontal}>
        <div className={`${currentUser ? 'me-auto' : 'mx-auto'} text-center`}>
          <p className={`${styles.whiteText} ${styles.headerSize} me-2`}>Task Pilot</p>
        </div>
        {currentUser ? userIconLoggedIn : userIconLoggedOut}
      </Navbar>
      {currentUser ? loggedInIcons : loggedOutIcons}

      {/* Bootstrap Modal for logout confirmation */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSignOut}>
            Yes, Log Out
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
