import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, ListGroup, Container, Badge, Spinner } from 'react-bootstrap';
import { useCurrentUser } from '../contexts/CurrentUserContext';
import styles from '../css/Home-Page.module.css';
import { NavLink } from 'react-router-dom';


/**
 * TaskList component renders a list of tasks based on user's role and filters.
 * 
 * @param {number} valuefromhomepage - Value indicating which tasks to display based on the homepage filter.
 */
function TaskList({ valuefromhomepage }) {
  const currentUser = useCurrentUser(); // Access current user data from context
  const [tasks, setTasks] = useState([]); // State to store fetched tasks in an array format
  const [isLoading, setIsLoading] = useState(false); // State to track loading state

  useEffect(() => {
    let isMounted = true; // Flag to track if component is mounted 

    /**
     * Fetches tasks based on current user and updates state accordingly.
     */
    const fetchTasks = async () => {
      setIsLoading(true); // Set loading state to true before fetching data
      try {
        // Fetch tasks related to the current user using their id
        const response = await axios.get(`related-tasks/${currentUser.pk}`);
        if (isMounted) { // CHECK IF COMPONENT IS STILL MOUNTED 
          setTasks(response.data); // Set fetched tasks into state if component is still mounted
        }
      } catch (err) {
        console.error('Error fetching tasks:', err);
      } finally {
        if (isMounted) { // CHECK IF COMPONENT IS STILL MOUNTED
          setIsLoading(false); // Set loading state to false after data fetch (success or failure)
        }
      }
    };

    fetchTasks();

    // Cleanup function to prevent state updates if component unmounts (INSERTED)
    return () => {
      isMounted = false; // Update flag to false on unmount
    };
  }, [currentUser, valuefromhomepage]); // Depend on currentUser and valuefromhomepage changes to refetch tasks

  /**
   * Sorts tasks by state, priority, and due date.
   * 
   * @param {array} tasks - Array of tasks to be sorted.
   * @returns {array} Sorted tasks.
   */
  const sortByStatePriorityAndDate = (tasks) => {
    return tasks.sort((a, b) => {
      // Check if tasks are overdue
      const isOverdueA = new Date(a.due_date) < new Date();
      const isOverdueB = new Date(b.due_date) < new Date();

      // Prioritize overdue tasks first
      if (isOverdueA !== isOverdueB) {
        return isOverdueA ? -1 : 1;
      }

      // Sort by state ("In Progress" first, then "Done")
      if (a.state !== b.state) {
        return a.state === 'In Progress' ? -1 : 1;
      }

      // Sort by priority ("High" first, then "Medium", then "Low")
      if (a.priority !== b.priority) {
        const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      // If states, priorities, and overdue status are the same, sort by due date descending
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);

      return dateB - dateA; // Sort in descending order (newest to oldest)
    });
  };

  /**
   * Filters tasks based on homepage filter value and sorts them.
   * 
   * @returns {array} Filtered and sorted tasks.
   */
  const filterAndSortTasks = () => {
    let filteredTasks = [];

    switch (valuefromhomepage) {
      case 2: // Owned tasks, organized by state and priority
        filteredTasks = tasks.filter(task => task.owner && task.owner === currentUser.username && task.state !== 'Done');
        break;

      case 3: // Assigned tasks, organized by state and priority
        filteredTasks = tasks.filter(task => task.assigned_users.includes(currentUser.pk) && task.state !== 'Done');
        break;

      case 4: // Completed tasks, organized by date and priority
        filteredTasks = tasks.filter(task => task.state === 'Done');
        break;

      case 1: // All tasks, organized by state and priority (excluding 'Done')
        filteredTasks = tasks.filter(task => task.state !== 'Done');
        break;

      default:
        filteredTasks = tasks;
        break;
    }

    // Sort filtered tasks by state, priority, and due date
    return sortByStatePriorityAndDate(filteredTasks);
  };

  // Apply selected filters and sorting to tasks
  const filteredTasks = filterAndSortTasks();

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
                  <ListGroup.Item>Contributions: {Array.isArray(task.task_messages) ? task.task_messages.length : 0}</ListGroup.Item>
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
