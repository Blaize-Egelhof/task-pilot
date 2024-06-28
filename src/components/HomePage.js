import React, { useState } from 'react';
import { Col, Container, Row, ToggleButton, ToggleButtonGroup} from 'react-bootstrap';
import styles from '../css/Home-Page.Module.css';
import TaskList from './TaskList';

function HomePage() {
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
    {/* TaskList component to display tasks based on selected category , parameter value is passed from onChange function*/}
      <TaskList valuefromhomepage={value} />
    </Container>
  );
}

export default HomePage;
