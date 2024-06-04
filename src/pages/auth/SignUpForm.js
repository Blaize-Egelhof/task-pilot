import React from "react";
import { Link } from "react-router-dom";
import styles from "../../css/SignInUpForm.Module.css";
import appStyles from "../../App.Module.css";

import { Form, Button, Image, Col, Row, Container } from "react-bootstrap";

const SignUpForm = () => {
  return (
    <Row className={`${styles.Row} mt-auto mb-auto`}>
      <Col className={styles.FormStyling}>
        <Container className={` p-4 `}>
          <h1 className={styles.Header}>SIGN UP</h1>
          <Form >
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className='d-none'>Username</Form.Label>
              <Form.Control className={styles.Input} type="text" placeholder="Enter Username" name='username' />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password1">
              <Form.Label className='d-none'>Password</Form.Label>
              <Form.Control className={styles.Input} type="password" placeholder="Password" name='password1' />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password2">
              <Form.Label className='d-none'>Confirm Password</Form.Label>
              <Form.Control className={styles.Input} type="password" placeholder="Confirm Password" name='password2' />
            </Form.Group>

            <Button variant="primary" type="submit" className={styles.Button}>
              Sign Up!
            </Button>

        </Form>
        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signin">
            <span className={styles.Text}>Already have an account?</span> <span>Sign in</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2${styles.ImageStyling}`}
      >
        <Image
          className={`img-fluid` }
          src={
            "https://res.cloudinary.com/drdelhvyt/image/upload/v1717505097/r6s38lpbdoo8hepa9nen.webp"
          }
        />
      </Col>
    </Row>
  );
};

export default SignUpForm;