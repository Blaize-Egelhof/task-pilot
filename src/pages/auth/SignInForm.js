import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import styles from "../../css/SignInUpForm.Module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";

function SignInForm() {
  // Custom hook to set the current user in context
  const setCurrentUser = useSetCurrentUser(); 
  // State to manage form input data and errors
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  // State to store validation errors
  const [errors, setErrors] = useState({});
  // Destructured signInData to variables in order to update using Onchange function 
  const { username, password } = signInData;
   // Function to handle input changes in the form fields
  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };
  // Function to handle form submission
  const formSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send POST request to login endpoint
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      // Set current user in context after successful login
      setCurrentUser(data.user);
    } catch (err) {
      // Set errors from server response if any
      setErrors(err.response?.data);
    }
  };

  return (
    <Row className={`${styles.Row} ${styles.CustomBackGround}`}>
      <Col className="my-auto p-0 p-md-2" md={6}>
        <Container className={`p-4`}>
          <h1 className={styles.Header}>SIGN IN</h1>
          <Form onSubmit={formSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className="d-none">Username</Form.Label>
              <Form.Control
                className={styles.Input}
                name="username"
                type="text"
                placeholder="Enter Username"
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
