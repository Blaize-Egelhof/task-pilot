import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import styles from "../../css/SignInUpForm.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import {useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

/**
 * Component for rendering the Sign In form.
 */
function SignInForm() {

  useEffect(() => {
    // Add background class to body
    document.body.classList.add(styles.backgroundImage);
  
    // Clean up the background class on component unmount
    return () => {
      document.body.classList.remove(styles.backgroundImage);
    };
  }, []);

  const location = useLocation();
  const [showAlert, setShowAlert] = useState(false);
  const successMessage = location.state?.successMessage;
  // Custom hook to set the current user in context
  const setCurrentUser = useSetCurrentUser();
  // History hook to redirect users to home page upon succesful sign In
  const history = useHistory();
  // State to manage form input data and errors
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  // State to store validation errors
  const [errors, setErrors] = useState({});
  // Destructured signInData to variables in order to update using Onchange function 
  const { username, password } = signInData;
     /**
   * Handles input change in the form fields.
   * @param {Object} event - The event object.
   */
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };
    /**
   * Handles form submission.
   * @param {Object} event - The event object.
   */
    const formSubmit = async (event) => {
      event.preventDefault();
      try {
        // Clear any old tokens before attempting login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
  
        const { data } = await axios.post("/dj-rest-auth/login/", signInData);
  
        // Save tokens in local storage
        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);
  
        // Set current user context
        setCurrentUser(data.user);
  
        history.push("/home-page", { successMessage: `Logged In Successfully! Welcome ${data.user.username}` });
      } catch (err) {
        setErrors(err.response?.data);
      }
    };
  useEffect(() => {
    // If there's a success message, show the alert
    if (successMessage) {
      setShowAlert(true);
      // Automatically hide the alert after 5 seconds
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      // Clean up timer
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

    /**
   * Handles the dismissal of the success alert.
   */
  const handleDismiss = () => {
    // Manually dismiss the alert
    setShowAlert(false);
  };

  return (
    <Row className={`${styles.Row} ${styles.CustomBackGround}`}>
      <Col className=" p-0 p-md-2" md={6}>
      {showAlert && (
      <Alert className='mt-1' variant="success">
        <p>{successMessage}</p>
        <div className="d-flex justify-content-end">
        <Button onClose={handleDismiss} variant="outline-success">
          Close me
        </Button>
        </div>
      </Alert>
    )}
        <Container className={`p-4`}>
          <h1 className={styles.Header}>SIGN IN</h1>
          <Form onSubmit={formSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                className={styles.Input}
                name="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {/* Display username errors if any */}
            {errors.username?.map((message, idx) => (
              <Alert key={idx} className='text-center mt-2' variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="d-none">Password</Form.Label>
              <Form.Control
                className={styles.Input}
                name="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
            </Form.Group>
            {/* Display password errors if any */}
            {errors.password?.map((message, idx) => (
              <Alert className='text-center mt-2' key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Button className={styles.Button} variant="primary" type="submit">
              Sign In
            </Button>
            {/* Display none field errors if any */}
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning mt-2" className='text-center'>
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
        <Container className="mt-3">
          <Link className={styles.Link} to="/sign-up">
            <span className={styles.Text}>Don't have an account?</span>{" "}
            <span className={styles.Link}>Sign up now!</span>
          </Link>
        </Container>
      </Col>
      {/* Column for the image (hidden on smaller screens) */}
      <Col md={6} className={`my-auto d-none d-md-block p-2 ${styles.ImageStyling}`}>
        <Image
          className={`${styles.ImageFluid}`}
          src={
            "https://res.cloudinary.com/drdelhvyt/image/upload/v1719412330/testthisnow_aqzf8n.webp"
          }
        />
      </Col>
    </Row>
  )
}

export default SignInForm;
