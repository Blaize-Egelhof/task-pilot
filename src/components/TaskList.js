import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, ListGroup, Container, Badge, ListGroupItem, Spinner } from 'react-bootstrap'; 
import { useCurrentUser } from '../contexts/CurrentUserContext';
import styles from '../css/Home-Page.Module.css';
import { NavLink } from 'react-router-dom';

function TaskList({ valuefromhomepage }) {
  const currentUser = useCurrentUser(); // Access current user data from context
  const [tasks, setTasks] = useState([]);// State to store fetched tasks in an array format
  const [errors, setErrors] = useState('');// State to store error messages during fetch
  const [isLoading, setIsLoading] = useState(false); // State to track loading state

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted

    // Function to fetch tasks based on current user
    const fetchTasks = async () => {
      setIsLoading(true); // Set loading state to true before fetching data
      try {
        // Fetch tasks related to the current user using their id
        const response = await axios.get(`related-tasks/${currentUser.pk}`);
        if (isMounted) {
          setTasks(response.data); // Set fetched tasks into state if component is still mounted
        }
      } catch (err) {
        if (isMounted) {
          setErrors(err.message); // Set error message if fetch fails
        }
      } finally {
        setIsLoading(false); // Set loading state to false after data fetch (success or failure)
      }
    };

    fetchTasks();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false; // Update flag to false on unmount
    };
  }, [currentUser, valuefromhomepage]); // Depend on currentUser and valuefromhomepage changes to refetch tasks

  // Function to sort tasks by state (In Progress, Done) and priority (High, Medium, Low)
  const sortByStateAndPriority = (tasks) => {
    const highPriorityInProgress = tasks.filter(task => task.priority === 'High' && task.state === 'In Progress');
    const mediumPriorityInProgress = tasks.filter(task => task.priority === 'Medium' && task.state === 'In Progress');
    const lowPriorityInProgress = tasks.filter(task => task.priority === 'Low' && task.state === 'In Progress');
    const highPriorityDone = tasks.filter(task => task.priority === 'High' && task.state === 'Done');
    const mediumPriorityDone = tasks.filter(task => task.priority === 'Medium' && task.state === 'Done');
    const lowPriorityDone = tasks.filter(task => task.priority === 'Low' && task.state === 'Done');

    // Combine and return sorted tasks array
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

  // Function to sort tasks by due date and priority
  const sortByDateAndPriority = (tasks) => {
    return tasks.sort((a, b) => {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);

      if (dateA > dateB) return -1;
      if (dateA < dateB) return 1;

      // If dates are equal, sort by priority
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const filterTasks = () => {
    switch (valuefromhomepage) {
      case 2: // Owned tasks, organized by state and priority
        return sortByStateAndPriority(tasks.filter(task => task.owner && task.owner.id === currentUser.id));

      case 3: // Assigned tasks, organized by state and priority
        return sortByStateAndPriority(tasks.filter(task => task.assigned_users.some(user => user.id === currentUser.id) && !task.owner));
      
      case 4: // Completed tasks, organized by date and priority
        return sortByDateAndPriority(tasks.filter(task => task.state === 'Done'));

      case 1: // All tasks, organized by state and priority
      default:
        return sortByStateAndPriority(tasks);
    }
  };

  // Apply selected filters to tasks and store in filteredTasks
  const filteredTasks = filterTasks();

  return (
    <Container className={`${styles.CreateSpace} ${styles.ContainerStyling}`}>
      {/* Display Spinner while loading */}
      {isLoading ? (
        <div className='d-flex justify-content-center'>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        </div>
      ) : (
        // Display tasks when not loading
        <Row xs={2} md={2} lg={3} xl={4} className="g-4 justify-content-center ms-50px">
          {filteredTasks.map(task => (
            <Col key={task.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card style={{ width: 'auto' }}>
                <Card.Body className={`${styles.CardBodyGrey}`}>
                  <Container className={`${styles.CenterAlign}`}>
                    {/* Display badge indicating if user is owner or member of the task */}
                    {task.is_owner ? 
                      <Badge pill className={`${styles.CustomOwnerBadge}`}>Owner</Badge> : 
                      <Badge pill className={`${styles.CustomMemberBadge}`}>Member</Badge>
                    }
                    {/* Display badge indicating task state (Done or Overdue) */}
                    {task.state === 'Done' ? (
                      <Badge pill className={`${styles.CustomDoneBadge}`} style={{ float: 'right' }}>Done</Badge>
                    ) : (
                      new Date(task.due_date) < new Date() && (
                        <Badge pill className={`${styles.CustomOverdueBadge}`} style={{ float: 'right' }}>Overdue</Badge>
                      )
                    )}
                  </Container>
                  <Card.Title className={`${styles.CardTitleTruncate} ${styles.HeaderSpacing}`}>{task.title}</Card.Title>
                </Card.Body>
                <ListGroup className="list-group-flush">
                  {/* Display task details: state, priority, due date, members, and contributions */}
                  <ListGroup.Item>State: {task.state}</ListGroup.Item>
                  <ListGroup.Item>Priority: {task.priority}</ListGroup.Item>
                  <ListGroup.Item>Due Date: {task.due_date}</ListGroup.Item>
                  <ListGroup.Item>Members: {Array.isArray(task.assigned_users) ? task.assigned_users.length : 0}</ListGroup.Item>
                  <ListGroupItem>Contributions: {Array.isArray(task.task_messages) ? task.task_messages.length : 0}</ListGroupItem>
                </ListGroup>
                {/* Display navigation links based on user's role (owner or member) */}
                <Card.Body className={`d-flex justify-content-center ${styles.CardBodyGrey}`}>
                  {task.is_owner ? (
                    <>
                      <NavLink style={{ marginRight: '10px' }} to={`task-view/${task.id}`}>View</NavLink>
                      <NavLink to={`task-edit/${task.id}`}>Edit</NavLink>
                    </>
                  ) : (
                    <NavLink to={`task-view/${task.id}`}>View</NavLink>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default TaskList;
