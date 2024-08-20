import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../css/SignInUpForm.module.css";
import appStyles from "../../App.module.css";
import axios from 'axios';
import { Form, Button, Image, Col, Row, Container, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useRedirect } from "../../hooks/useRedirect";

/**
 * Component for rendering the Sign Up form.
 */
const SignUpForm = () => {
  useRedirect('loggedIn')
  const [signUpData, setSignUpData] = useState({
    username: '',
    password1: '',
    password2: '',
  });

  const { username, password1, password2 } = signUpData;

  const [errors, setErrors] = useState({});

  const history = useHistory();

    /**
   * Handles input change in the form fields.
   * @param {Object} event - The event object.
   */
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

    /**
   * Handles form submission.
   * @param {Object} event - The event object.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("dj-rest-auth/registration/", signUpData);
      history.push("/sign-in" , {successMessage: "Account Created Successfully"});
    } catch (err) {
      setErrors(err.response?.data); 
    }
  };

  useEffect(() => {
    // Add background class to body
    document.body.classList.add(styles.backgroundImage1);
  
    // Clean up the background class on component unmount
    return () => {
      document.body.classList.remove(styles.backgroundImage1);
    };
  }, []);

  return (
    <Row className={`${styles.Row} mt-auto mb-auto ${styles.CustomBackGround1}`}>
      <Col className={styles.FormStyling}>
        <Container className={`p-4`}>
          <h1 className={`${styles.Header} ${styles.HeaderForSignUp}`}>SIGN UP</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className='d-none'>Username</Form.Label>
              <Form.Control
                className={styles.Input}
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.username?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Form.Group className="mb-3" controlId="password1">
              <Form.Label className='d-none'>Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Password"
                name="password1"
                value={password1}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password1?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Form.Group className="mb-3" controlId="password2">
              <Form.Label className='d-none'>Confirm Password</Form.Label>
              <Form.Control
                className={styles.Input}
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
            </Form.Group>
            {errors.password2?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Button variant="primary" type="submit" className={styles.Button}>
              Sign Up!
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/sign-in">
            <span className={styles.Text}>Already have an account?</span> <span>Sign in</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.ImageStyling}`} 
      >
        <Image
          className="img-fluid"
          src="https://res.cloudinary.com/drdelhvyt/image/upload/v1719479514/e29new6zjeuxhheml4po.png"
        />
      </Col>
    </Row>
  );
};

export default SignUpForm;
