import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row,ListGroup } from 'react-bootstrap'
import { useCurrentUser } from '../contexts/CurrentUserContext'
import styles from '../css/Home-Page.Module.css'

function TaskList({ valuefromhomepage }) {
  const currentUser = useCurrentUser();
  const [tasks, setTasks] = useState([])
  const [errors, setErrors] = useState('')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`related-tasks/${currentUser.pk}`)
        setTasks(response.data)
      } catch (err) {
        setErrors(err.message)
        console.log(err)
      }
    }

    fetchTasks()
  }, [currentUser?.pk])

  const filterTasks = () => {
    switch (valuefromhomepage) {
      case 2:
        return tasks.filter(task => task.owned) 
      case 3:
        return tasks.filter(task => task.joined)
      case 1:
      default:
        return tasks
    }
  }

  const filteredTasks = filterTasks()

  return (
    <>
    <Col xs="auto">
    <Card style={{ width: 'auto' }}>
      <Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
        <Card.Body>
          <Card.Title>Card Title</Card.Title>
          <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text>
        </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link>
      </Card.Body>
    </Card>
    </Col>
<Col xs="auto">
<Card style={{ width: 'auto' }}>
<Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the
      bulk of the card's content.
    </Card.Text>
  </Card.Body>
<ListGroup className="list-group-flush">
  <ListGroup.Item>Cras justo odio</ListGroup.Item>
  <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
  <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
</ListGroup>
<Card.Body>
  <Card.Link href="#">Card Link</Card.Link>
  <Card.Link href="#">Another Link</Card.Link>
</Card.Body>
</Card>
</Col>
<Col xs="auto">
<Card style={{ width: 'auto' }}>
<Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the
      bulk of the card's content.
    </Card.Text>
  </Card.Body>
<ListGroup className="list-group-flush">
  <ListGroup.Item>Cras justo odio</ListGroup.Item>
  <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
  <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
</ListGroup>
<Card.Body>
  <Card.Link href="#">Card Link</Card.Link>
  <Card.Link href="#">Another Link</Card.Link>
</Card.Body>
</Card>
</Col>

<Col xs="auto">
<Card style={{ width: 'auto' }}>
<Card.Img variant="top" src="holder.js/100px180?text=Image cap" />
  <Card.Body>
    <Card.Title>Card Title</Card.Title>
    <Card.Text>
      Some quick example text to build on the card title and make up the
      bulk of the card's content.
    </Card.Text>
  </Card.Body>
<ListGroup className="list-group-flush">
  <ListGroup.Item>Cras justo odio</ListGroup.Item>
  <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
  <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
</ListGroup>
<Card.Body>
  <Card.Link href="#">Card Link</Card.Link>
  <Card.Link href="#">Another Link</Card.Link>
</Card.Body>
</Card>
</Col>

</>
  );
}

export default TaskList
