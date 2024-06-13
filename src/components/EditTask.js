import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { NavLink, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { Alert, Spinner } from "react-bootstrap";
import styles from "../css/CreateEditForm.Module.css";

function EditTask() {
  const currentUser = useCurrentUser();
  const history = useHistory();
  const { id } = useParams(); 
  const [editTicketData, setEditTicketData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "",
    category: "",
  });
  const [errors, setErrors] = useState([]);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/task-view/${id}`);
        const taskData = response.data;
        setEditTicketData({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.due_date,
          priority: taskData.priority,
          category: taskData.category,
        });
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching task details:', err);
        setIsLoading(false);
      }
    };

    fetchTaskDetails();

    // Fetch available users
    const fetchAvailableUsers = async () => {
      console.log(availableUsers)
      try {
        const response = await axios.get(`/users/${id}`); 
        setAvailableUsers(response.data);
      } catch (err) {
        console.error('Error fetching available users:', err);
      }
    };

    fetchAvailableUsers();
  }, [id]);

  const { title, description, due_date, priority, category } = editTicketData;

  const handleChange = (event) => {
    setEditTicketData({
      ...editTicketData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAssignedUsersChange = (event) => {
    const selectedUserIds = Array.from(event.target.selectedOptions, option => option.value);
    setAssignedUsers(selectedUserIds);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const updatedTaskData = {
        title,
        description,
        due_date,
        priority,
        category,
        assigned_users: assignedUsers, 
      };
      await axios.put(`/update-task/${id}`, updatedTaskData);
      history.push("/home-page");
    } catch (err) {
      setErrors(err.response?.data || ['An error occurred while updating the task.']);
      setIsLoading(false);
      console.error('Error updating task:', err);
    }
  };

  return (
    <Row className={styles.Row}>
      <Col>
        <Container className={`p-4`}>
          <h2 className={styles.Header}>Edit Task</h2>
          {isLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <Form onSubmit={handleSubmit}>
              {errors.length > 0 && (
                <Alert variant="danger">
                  {errors.map((error, idx) => (
                    <p key={idx}>{error}</p>
                  ))}
                </Alert>
              )}
              <Form.Group className="mb-3" controlId="title">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>Task Title</Form.Label>
                <Form.Control
                  name="title"
                  type="text"
                  placeholder="Enter Task Title"
                  className={`${styles.Input} ${styles.InputBorder}`}
                  value={title}
                  required
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="description">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>Description</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  name="description"
                  as="textarea"
                  placeholder="Task Description"
                  rows={3}
                  required
                  value={description}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="due_date">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>Due Date</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  name="due_date"
                  type="date"
                  placeholder="Enter a due date"
                  required
                  value={due_date}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="priority">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>Priority</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  name="priority"
                  as="select"
                  placeholder="Select Priority"
                  required
                  value={priority}
                  onChange={handleChange}
                >
                  <option value="Medium">Select Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="assignedUsers">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>Assigned Users</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  as="select"
                  multiple
                  value={assignedUsers}
                  onChange={handleAssignedUsersChange}
                >
                  {availableUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.username}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="category">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>Category</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  name="category"
                  as="select"
                  placeholder="Select a category"
                  required
                  value={category}
                  onChange={handleChange}
                >
                  <option value="Other">Select Category</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Study">Study</option>
                  <option value="Other">Other</option>
                </Form.Control>
              </Form.Group>

              <Button className={styles.Button} variant="primary" type="submit">
                Update
              </Button>
              <NavLink to={'/home-page'}>
                <Button variant="secondary" className={`${styles.Button} ${styles.ButtonSpacing}`}>Cancel</Button>
              </NavLink>

              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}
            </Form>
          )}
        </Container>
      </Col>
    </Row>
  );
}

export default EditTask;
