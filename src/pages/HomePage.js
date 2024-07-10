import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Row, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';
import styles from '../css/Home-Page.module.css';
import TaskList from '../components/TaskList';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

function HomePage() {
  const location = useLocation();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const successMessage = location.state?.successMessage;
  const deleteMessage = location.state?.deleteMessage;
  const [value, setValue] = useState(1); // State to manage the selected toggle button value
  const [headerText, setHeaderText] = useState('All Tasks'); // State to manage the header text based on selected value from toggle button
  // Function to handle change to header depending on selected button as well as passing 'value' state to the tasklist component as a parameter value
  const handleChange = (val) => {
    setValue(val);
    // Determine header text based on the selected value
    let newHeaderText = 'All Tasks';
    if (val === 2) {
      newHeaderText = 'Owned Tasks';
    } else if (val === 3) {
      newHeaderText = 'Joined Tasks';
    } else if (val === 4) {
      newHeaderText = 'Closed Tasks';
    }
    setHeaderText(newHeaderText);// Update the header text state
  };
  
  useEffect(() => {
    // If there's a success message, show the success alert
    if (successMessage) {
      setShowSuccessAlert(true);
      // Automatically hide the success alert after 5 seconds
      const successTimer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);

      // Clean up timer
      return () => clearTimeout(successTimer);
    }

    // If there's a delete message, show the delete alert
    if (deleteMessage) {
      setShowDeleteAlert(true);
      // Automatically hide the delete alert after 5 seconds
      const deleteTimer = setTimeout(() => {
        setShowDeleteAlert(false);
      }, 5000);

      // Clean up timer
      return () => clearTimeout(deleteTimer);
    }
  }, [successMessage, deleteMessage]);

  const handleDismiss = () => {
    // Manually dismiss the alert
    setShowSuccessAlert(false);
    setShowDeleteAlert(false);
  };

  return (
    <Container className={styles.MainContainer}>
      <Container>
        <Row className="justify-content-center">
          <Col xs="auto">
            <h2 className="text-center" name='header-text'>{headerText}</h2>
          </Col>
        </Row>
      </Container>
    {/* Container for toggle buttons */}
    <Container className={styles.CreateSpace}>
      <Row className="justify-content-center">
        <Col xs="auto">
          <ToggleButtonGroup className={`${styles.WrapButtons}`} type="radio" name="tasks" value={value} onChange={handleChange}>
            {/* Toggle button which filters and bring ALL related tasks */}
            <ToggleButton id="tbg-btn-1" className={`mt-1 ms-1 custom-toggle-button`} value={1}>
              All Tasks
            </ToggleButton>
            {/* Toggle button which filters tasks by if the current user requesting owns the tasks */}
            <ToggleButton id="tbg-btn-2" className={`mt-1 ms-1 custom-toggle-button`} value={2}>
              Owned Tasks
            </ToggleButton>
            {/* Toggle button which filters and bring related tasks which the current user requesting is the member of */}
            <ToggleButton id="tbg-btn-3" className={`mt-1 ms-1 custom-toggle-button`} value={3}>
              Joined Tasks
            </ToggleButton>
            {/* Toggle button which filters all tasks either owned by the current user or is a member of the task by state of 'done' */}
            <ToggleButton id="tbg-btn-4" className={`mt-1 ms-1 custom-toggle-button`} value={4}>
              Closed Tasks
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>
    </Container>
    {/* Display success message if there is one */}
    {showSuccessAlert && (
        <Alert className='mt-1 text-center' variant="success" onClose={handleDismiss}>
          <p>{successMessage}</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-success" onClick={handleDismiss}>
              Close
            </Button>
          </div>
        </Alert>
      )}
      {/* Display delete message if there is one */}
      {showDeleteAlert && (
        <Alert className='mt-1 text-center' variant="danger" onClose={handleDismiss}>
          <p>{deleteMessage}</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={handleDismiss}>
              Close
            </Button>
          </div>
        </Alert>
      )}
    {/* TaskList component to display tasks based on selected category , parameter value is passed from onChange function*/}
      <TaskList valuefromhomepage={value} />
    </Container>
  );
}

export default HomePage;
