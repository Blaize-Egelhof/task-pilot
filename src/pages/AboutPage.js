import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import styles from '../css/AboutPage.module.css'; // Ensure you have some CSS to style the AboutPage

function AboutPage() {
  // Hook for programmatic navigation
  const history = useHistory();

  // Function to handle button click, navigate to login page
  const handleButtonClick = () => {
    history.push('/sign-in'); // Update this to your login route
  };

  useEffect(() => {
    // Add background class to body
    document.body.classList.add(styles.backgroundImage);

    // Clean up the background class on component unmount
    return () => {
      document.body.classList.remove(styles.backgroundImage);
    };
  }, []);

  return (
    <Container className={`text-center ${styles.aboutContainer}`}>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1 className={`${styles.header} my-4`}>Welcome to Task Pilot</h1>
          <p className={`${styles.description} my-3`}>
            Task Pilot is your ultimate task management tool, designed to help you keep track of your tasks, set priorities, and ensure timely completion. With intuitive features and a user-friendly interface, Task Pilot makes it easier for you to organize your workflow, collaborate with team members, and stay on top of your responsibilities. Whether you're managing personal projects or professional assignments, Task Pilot is here to help you achieve your goals efficiently.
          </p>
          <Button className={`mt-4 ${styles.button}`} variant="primary" onClick={handleButtonClick}>
            Sign In / Log In
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default AboutPage;
