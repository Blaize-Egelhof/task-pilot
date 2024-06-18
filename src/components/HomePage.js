import React, { useState } from 'react'
import { Col, Container, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import styles from '../css/Home-Page.Module.css'
import TaskList from './TaskList'

function HomePage() {
  const [value, setValue] = useState(1)
  const [headerText, setHeaderText] = useState('All Tasks')

  const handleChange = (val) => {
    setValue(val)
    let newHeaderText = 'All Tasks'
    if (val === 2) {
      newHeaderText = 'Owned Tasks'
    } else if (val === 3) {
      newHeaderText = 'Joined Tasks'
    } else if (val === 4) {
      newHeaderText = 'Closed Tasks'
    }
    setHeaderText(newHeaderText)
  }

  return (
    <>
      <Container>
        <Row className="justify-content-center">
          <Col xs="auto">
            <h2 className="text-center" name='header-text'>{headerText}</h2>
          </Col>
        </Row>
      </Container>

      <Container fluid className={styles.CreateSpace}>
        <Row className="justify-content-center">
          <Col xs="auto">
            <ToggleButtonGroup type="radio" name="tasks" value={value} onChange={handleChange}>
              <ToggleButton id="tbg-btn-1" value={1}>
                All Tasks
              </ToggleButton>
              <ToggleButton id="tbg-btn-2" value={2}>
                Owned Tasks
              </ToggleButton>
              <ToggleButton id="tbg-btn-3" value={3}>
                Joined Tasks
              </ToggleButton>
              <ToggleButton id="tbg-btn-4" value={4}>
                Closed Tasks
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>
      </Container>
      <TaskList valuefromhomepage={value} />
    </>
  )
}

export default HomePage
