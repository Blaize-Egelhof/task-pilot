import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, ListGroup, Container } from 'react-bootstrap';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import styles from '../css/Home-Page.Module.css';

function TaskList({ valuefromhomepage }) {
  const currentUser = useCurrentUser();
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`related-tasks/${currentUser.pk}`);
        if (isMounted) {
          setTasks(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setErrors(err.message);
        }
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();

    // Cleanup function to cancel or tasks
    return () => {
      isMounted = false; // Set flag to false on unmount to prevent state updates
    };
  }, [currentUser, valuefromhomepage]);

  const sortByStateAndPriority = (tasks) => {
    const highPriorityInProgress = tasks.filter(task => task.priority === 'High' && task.state === 'In Progress');
    const mediumPriorityInProgress = tasks.filter(task => task.priority === 'Medium' && task.state === 'In Progress');
    const lowPriorityInProgress = tasks.filter(task => task.priority === 'Low' && task.state === 'In Progress');
    const highPriorityDone = tasks.filter(task => task.priority === 'High' && task.state === 'Done');
    const mediumPriorityDone = tasks.filter(task => task.priority === 'Medium' && task.state === 'Done');
    const lowPriorityDone = tasks.filter(task => task.priority === 'Low' && task.state === 'Done');

    const sortedTasks = [
      ...highPriorityInProgress,
      ...mediumPriorityInProgress,
      ...lowPriorityInProgress,
      ...highPriorityDone,
      ...mediumPriorityDone,
      ...lowPriorityDone,
    ];

    return sortedTasks;
  };

  const filterTasks = () => {
    switch (valuefromhomepage) {
      case 2: // Owned tasks, organized by state and priority
        return sortByStateAndPriority(tasks.filter(task => task.owner && task.owner.id === currentUser.id));

      case 3: // Assigned tasks, organized by state and priority
        return sortByStateAndPriority(tasks.filter(task => task.assigned_users.some(user => user.id === currentUser.id) && !task.owner));

      case 1: // All tasks, organized by state and priority
      default:
        return sortByStateAndPriority(tasks);
    }
  };

  const filteredTasks = filterTasks();

  return (
    <Container className={`${styles.CreateSpace} ${styles.LeftAlign}`}>
      <Row xs={2} md={2} lg={3} xl={4} className="g-4 justify-content-center ms-50px">
        {filteredTasks.map(task => (
          <Col key={task.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card style={{ width: 'auto' }}>
              <Card.Body>
                {task.is_owner ? <p>Owner</p> : <p>Member</p>}
                <Card.Title>{task.title}</Card.Title>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  State: {task.state} 
                </ListGroup.Item>
                <ListGroup.Item>
                  Priority: {task.priority}
                </ListGroup.Item>
                <ListGroup.Item>Due Date: {task.due_date}</ListGroup.Item>
                <ListGroup.Item>
                  Members: {Array.isArray(task.assigned_users) ? task.assigned_users.length : 0} | Contributions: {Array.isArray(task.task_messages) ? task.task_messages.length : 0}
                </ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Card.Link href="#">View</Card.Link>
                {task.is_owner && <Card.Link href="#">Edit</Card.Link>}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TaskList;
