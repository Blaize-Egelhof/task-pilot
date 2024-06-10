import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, ListGroup, Container } from 'react-bootstrap';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import styles from '../css/Home-Page.Module.css';

function TaskList({ valuefromhomepage }) {
  const currentUser = useCurrentUser();
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`related-tasks/${currentUser.pk}`);
        console.log(response.data);
        setTasks(response.data);
      } catch (err) {
        setErrors(err.message);
        console.log(err);
      }
    };

    fetchTasks();
  }, [currentUser?.pk, valuefromhomepage]);

  const filterTasks = () => {
    console.log(tasks);
    switch (valuefromhomepage) {
      case 2: // Owned tasks
        let ownerTasks = tasks.filter(task => task.owner);
  
        let importantOwnerTasks = ownerTasks.filter(task => task.priority === 'High' && task.state === 'open');
        let nonImportantOwnerTasks = ownerTasks.filter(task => task.priority !== 'High' || task.state !== 'open');
  
        importantOwnerTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  
        ownerTasks = importantOwnerTasks.concat(nonImportantOwnerTasks);
  
        return ownerTasks;
  
      case 3: // Assigned tasks
        let assignedTasks = tasks.filter(task => task.assigned_users.length > 0);
  
        let importantAssignedTasks = assignedTasks.filter(task => task.priority === 'High' && task.state === 'open');
        let nonImportantAssignedTasks = assignedTasks.filter(task => task.priority !== 'High' || task.state !== 'open');
  
        importantAssignedTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  
        assignedTasks = importantAssignedTasks.concat(nonImportantAssignedTasks);
  
        return assignedTasks;
  
      case 1: // All tasks
      default:
        let allTasks = tasks.filter(task => task.assigned_users.length > 0 || task.owner);
  
        let importantAllTasks = allTasks.filter(task => task.priority === 'High' && task.state === 'open');
        let nonImportantAllTasks = allTasks.filter(task => task.priority !== 'High' || task.state !== 'open');
  
        importantAllTasks.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  
        allTasks = importantAllTasks.concat(nonImportantAllTasks);
  
        return allTasks;
    }
  };  

  const filteredTasks = filterTasks();

  return (
    <Container className={`${styles.CreateSpace} ${styles.LeftAlign}`}>
      <Row xs={2} md={2} lg={3} xl={4} className="g-4 justify-content-center ms-50px" >
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
                {/* <ListGroup.Item>Category:{task.category}</ListGroup.Item> */}
                {/* <ListGroup.Item>Visability:{task.task_visability}</ListGroup.Item> */}
                <ListGroup.Item>Due Date:{task.due_date}</ListGroup.Item>
                {/* <ListGroup.Item>Owner:{task.owner}</ListGroup.Item> */}
                <ListGroup.Item>
                  Members: {Array.isArray(task.assigned_users) ? task.assigned_users.length : 0} | Contributions: {Array.isArray(task.task_messages) ? task.task_messages.length : 0}
                </ListGroup.Item>
              </ListGroup>
              <Card.Body>
                <Card.Link href="#">View</Card.Link>
                {task.is_owner === true}{
                  <Card.Link href="#">Edit</Card.Link>
                }
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default TaskList;
