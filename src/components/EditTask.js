import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { Alert, Spinner } from "react-bootstrap";
import styles from "../css/CreateEditForm.Module.css";
import { useCurrentUser } from '../contexts/CurrentUserContext';

/**
 * EditTask component for editing a task.
 * Fetches task details, allows editing and updating tasks,
 * and handles deletion with confirmation modal.
 */

function EditTask() {
  const history = useHistory(); //Used to push users to home page on succesful form submission
  const currentUser = useCurrentUser(); //Harvest Currently logged in user info 
  const { id } = useParams(); // Harvest task ID in navlink
  //Using state to save all fields that I want users to be able to manipulate/change
  const [editTicketData, setEditTicketData] = useState({ 
    title: "",
    description: "",
    due_date: "",
    priority: "",
    category: "",
    owner: "",
    assigned_users: [],
    // Custom field which can render user NAMES based of ID's 
    assigned_usernames: [], 
    state:"",
  });
  const [errors, setErrors] = useState([]); //Set errors
  const [removeUsers, setRemoveUsers] = useState([]); //array which holds the currently assigned userID's which belong to this ticket
  const [assignedUsers, setAssignedUsers] = useState([]); // array which will hold the final updated array , provided on submission
  const [availableUsers, setAvailableUsers] = useState([]); // array which holds all users who can be added to the task
  const [addUsers, setAddUsers] = useState([]); //array used onSubmission to harvest the selected users to be added
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  // Fetch task details and available users on component mount
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await axios.get(`/task-view/${id}`);
        const taskData = response.data;
        setEditTicketData({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.due_date,
          priority: taskData.priority,
          category: taskData.category,
          owner: taskData.owner,
          assigned_usernames: taskData.assigned_usernames || [],
          state:taskData.state,
        });
        setAssignedUsers(taskData.assigned_users || []); // assigned_users is set or default to empty array
      } catch (err) {
        setErrors(err.response?.data); // catch any errors for user feedback
      } finally {
        setIsLoading(false); // Set loading to false to remove spinner
      }
    };

    fetchTaskDetails();
    // Fetch available users from API
    const fetchAvailableUsers = async () => {
      try {
        const response = await axios.get(`/users/${id}`);
        const usersData = response.data || [];
    
        // Filter out the owner of task from availableUsers array by ID
        const filteredUsers = usersData.filter(user => user.username !== editTicketData.owner);
    
        // Filter out the current user from availableUsers array by ID
        const filteredAvailableUsers = filteredUsers.filter(user => user.username !== currentUser.username);
    
        // Filter out users already in assignedUsers from availableUsers in order to provide a new array of ID's on each form submission
        const finalAvailableUsers = filteredAvailableUsers.filter(user => !assignedUsers.includes(user.id));
    
        setAvailableUsers(finalAvailableUsers);
      } catch (err) {
        console.error("Error fetching available users:", err);
        //If authentication errors occur , a refresh will be recommended.
        setErrors([
          "An error occurred while fetching available users. Please refresh the Page.",
        ]);
      }
    };

    fetchAvailableUsers();
  }, [id,assignedUsers,currentUser.username,editTicketData.owner]); // Dependency array ensures useEffect runs when id changes

  // Destructure editTicketData for easier access and manipulation
  const { title, description, due_date, priority, category, assigned_usernames,state } = editTicketData;
  //Update the events values on each update
  const handleChange = (event) => {
    setEditTicketData({
      ...editTicketData,
      [event.target.name]: event.target.value,
    });
  };
  // Handle removing users from assignedUsers
  const handleRemoveUser = (selectedIds) => {
    // Convert selectedIds to an array if it's not already
    const idsArray = Array.isArray(selectedIds) ? selectedIds : [selectedIds];
    
    // Filter out users from assignedUsers based on selectedIds
    const updatedAssignedUsers = assignedUsers.filter(user => !idsArray.includes(user));
    
    // Set removeUsers state with the actual user objects to be removed
    const usersToRemove = assignedUsers.filter(user => idsArray.includes(user));
    setRemoveUsers(usersToRemove);
    
    // Update assignedUsers state
    setAssignedUsers(updatedAssignedUsers);
  };
  // function to handle deleting tasks , first renders a model asking a user if they want to delete in the event of accidental click
  const handleDelete = async () => {
    try {
      await axios.delete(`/delete-task/${id}`);
      history.push("/home-page");
    } catch (err) {
      setErrors([
        err.response?.data ||
          "An error occurred while deleting the task. Are you the task owner?",
      ]);
      //Setting errors incase a delete request is made from a user who isnt the owner of the task
      console.error("Error deleting task:", err);
    }
  };
  // Handle form submission for updating task details
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Extract user IDs from removeUsers and addUsers
      const removeUserIds = removeUsers.map(user => user);
      const addUserIds = addUsers;

      // Create updated assignedUsers array
      const updatedAssignedUserIds = assignedUsers
        .filter(userId => !removeUserIds.includes(userId)) // Remove users marked for removal
        .concat(addUserIds); // Add newly selected users

      // Prepared updatedTaskData with the new assigned_users array
      const updatedTaskData = {
        title,
        description,
        due_date,
        priority,
        category,
        assigned_users: updatedAssignedUserIds,
        state,
      };

      // Send request to API update the task
      await axios.put(`/update-task/${id}`, updatedTaskData);
      history.push("/home-page");
    } catch (err) {
      console.error("Error updating task:", err);
      //Setting errors in order to provide direct feedback to users if a field controlID specific error is given
      setErrors(
        err.response?.data,
      );
    }
  };

  return (
    <>
      <Row className={`${styles.Row} ${styles.CustomContainer}`}>
        <Col>
          <Container className={`p-4`}>
            <h2 className={styles.Header}>Edit Task</h2>
            {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
              <Spinner animation="border" variant="primary" />
            </div>
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
                  <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>
                    Task Title
                  </Form.Label>
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

                {errors.title?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
                ))}

                <Form.Group className="mb-3" controlId="description">
                  <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>
                    Description
                  </Form.Label>
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

                {errors.description?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
                ))}

                <Form.Group className="mb-3" controlId="due_date">
                  <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>
                    Due Date
                  </Form.Label>
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

                {errors.due_date?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
                ))}

                <Form.Group className="mb-3" controlId="priority">
                  <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>
                    Priority
                  </Form.Label>
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

                {errors.priority?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
                ))}

                <Form.Group className="mb-3" controlId="state">
                  <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>
                    State
                  </Form.Label>
                  <Form.Control
                    className={`${styles.Input} ${styles.InputBorder}`}
                    name="state"
                    as="select"
                    placeholder="Select State"
                    required
                    value={state}
                    onChange={handleChange}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </Form.Control>
                </Form.Group>

                {errors.state?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
                ))}

                <Form.Group className="mb-3" controlId="removeUsers">
                  <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>
                    Remove Users
                  </Form.Label>
                  <Form.Control
                    className={`${styles.Input} ${styles.InputBorder}`}
                    as="select"
                    multiple
                    onChange={(e) =>
                      handleRemoveUser(
                        Array.from(e.target.selectedOptions, (option) => parseInt(option.value))
                      )
                    }
                  >
                    {assigned_usernames?.map((user) => (
                      <option className={`${styles.Input}`} key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                {errors.removeUsers?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
                ))}

                <Form.Group className="mb-3" controlId="addUsers">
                  <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>
                    Add Users
                  </Form.Label>
                  <Form.Control
                    className={`${styles.Input} ${styles.InputBorder}`}
                    as="select"
                    multiple
                    onChange={(e) => {
                      //Create a new array of ID's based off selected user ID's
                      const selectedIds = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
                      // Update addUsers state with selected user IDs
                      setAddUsers(selectedIds); 
                    }}
                  >
                    {availableUsers.map((user) => (
                      <option className={`${styles.Input}`} key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>

                {errors.addUsers?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
                ))}

              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
                ))}

                <Button className={styles.Button} variant="primary" type="submit">
                  Update
                </Button>
                <Button
                  variant="danger"
                  className={`${styles.Button} ${styles.ButtonSpacing}`}
                  //Reveal the pop up model confirming if a user wants to delete the task
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  className={`${styles.Button} ${styles.ButtonSpacing}`}
                  // return the user back to the home page
                  onClick={() => history.push("/home-page")}
                >
                  Cancel
                </Button>
                  
                {errors.non_field_errors?.map((message, idx) => (
                  // Renders any non field errors if any is found
                  <Alert key={idx} variant="warning" className="mt-3">
                    {message}
                  </Alert>
                ))}
              </Form>
            )}
          </Container>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary"
          //Closes model if a user selects Cancel , cancelling any delete attempts
          onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger"
          // Triggers the delete function is a user selects delete again.
          onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditTask;
