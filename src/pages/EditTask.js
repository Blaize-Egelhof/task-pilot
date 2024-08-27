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
import styles from "../css/CreateEditForm.module.css";
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


  useEffect(() => {
  /**
   * Fetches task details from the server based on the task 'id' parameter.
   * Updates state with the fetched task data or sets errors if the request fails.
   * This effect runs whenever the 'id' changes.
   */
    const fetchTaskDetails = async () => {
      try {
        // Sends a GET request to fetch task details
        const response = await axios.get(`/task-view/${id}`);
        const taskData = response.data;
        // Updates state with the fetched task data
        setEditTicketData({
          title: taskData.title,
          description: taskData.description,
          due_date: taskData.due_date,
          priority: taskData.priority,
          category: taskData.category,
          owner: taskData.owner,
          assigned_usernames: taskData.assigned_usernames || [],
          state: taskData.state,
        });
        // Updates the assigned users state
        setAssignedUsers(taskData.assigned_users || []);
        // Sets errors if the request fails
      } catch (err) {
        setErrors(err.response?.data);
        // Sets loading state to false once the request is complete
      } finally {
        setIsLoading(false);
      }
    };

    fetchTaskDetails();
  }, [id]);

  useEffect(() => {
   /**
   * Fetches available users from the server based on the task 'id' parameter.
   * Filters out the task owner, current user, and already assigned users from the available users list.
   * Updates state with the filtered available users or sets errors if the request fails.
   * This effect runs whenever the task owner, assigned users, current user's username, or loading state changes.
   */
    const fetchAvailableUsers = async () => {
      // Sends a GET request to fetch users
      try {
        const response = await axios.get(`/users/${id}`);
        const usersData = response.data || [];
         // Filters out the task owner
        const filteredUsers = usersData.filter(user => user.username !== editTicketData.owner);
         // Filters out the current user
        const filteredAvailableUsers = filteredUsers.filter(user => user.username !== currentUser.username);
         // Filters out the already assigned users
        const finalAvailableUsers = filteredAvailableUsers.filter(user => !assignedUsers.includes(user.id));
           // Updates state with the filtered available users
          setAvailableUsers(finalAvailableUsers);
      } catch (err) {
        // Logs errors and sets an error message if the request fails
        console.error("Error fetching available users:", err);
        setErrors([
          "An error occurred while fetching available users. Please refresh the Page.",
        ]);
      }
    };
    // Fetches available users only if the task details have been loaded
    if (!isLoading) {
      fetchAvailableUsers();
    }
  }, [editTicketData.owner, assignedUsers, currentUser.username, isLoading]);

  // Destructure editTicketData for easier access and manipulation
  const { title, description, due_date, priority, category, assigned_usernames,state } = editTicketData;
    /**
   * Handles changes in form input fields.
   * Updates the state with the new values.
   * @param {Object} event - The event object triggered by input change.
   */
  const handleChange = (event) => {
    setEditTicketData({
      ...editTicketData,
      [event.target.name]: event.target.value,
    });
  };
  /**
   * Handles removal of users from the assignedUsers state.
   * Sets the users to be removed in the removeUsers state.
   * @param {Array|Number} selectedIds - An array of user IDs or a single user ID to be removed.
   */
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
  /**
   * Handles deletion of the task.
   * Deletes the task from the database and navigates to the home page on success.
   */
  const handleDelete = async () => {
    try {
      await axios.delete(`/delete-task/${id}`);
      history.push("/home-page",{deleteMessage:`Task ${title} has been deleted`});
    } catch (err) {
      setErrors([
        err.response?.data ||
          "An error occurred while deleting the task. Are you the task owner?",
      ]);
      //Setting errors incase a delete request is made from a user who isnt the owner of the task
      console.error("Error deleting task:", err);
    }
  };
   /**
   * Handles form submission for updating task details.
   * Updates the task details in the database and navigates to the home page on success.
   * @param {Object} event - The form submission event.
   */
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
  
      // Check and correct the state value if it is 'Open'
      const correctedState = state === 'Open' ? 'In Progress' : state;
  
      // Prepared updatedTaskData with the new assigned_users array
      const updatedTaskData = {
        title,
        description,
        due_date,
        priority,
        category,
        assigned_users: updatedAssignedUserIds,
        state: correctedState,
      };
        // Check if title or description is blank
      if (!title.trim()) {
        setErrors({ title: 'Title cannot be empty.' });
        return;
      }
      
      if (!description.trim()) {
        setErrors({ description: 'Description cannot be empty.' });
        return;
      }
  
      // Send request to API update the task
      await axios.put(`/update-task/${id}`, updatedTaskData);
      history.push("/home-page", { successMessage: `Task ${title} updated successfully!` });
    } catch (err) {
      setErrors(err)
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

                <Form.Group className="mb-3" controlId="category">
                  <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>
                    Category
                  </Form.Label>
                  <Form.Control
                    className={`${styles.Input} ${styles.InputBorder}`}
                    name="category"
                    as="select"
                    type="date"
                    placeholder="Enter a due date"
                    required
                    value={category}
                    onChange={handleChange}
                    >
                    <option value={`${category}`}>{`${category}`}</option>
                    <option value='Work'>Work</option>
                    <option value='Personal'>Personal</option>
                    <option value='Study'>Study</option>
                    <option value='Other'>Other</option>
                  </Form.Control>
                </Form.Group>

                {errors.category?.map((message, idx) => (
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
                    <option value={`${priority}`}>{`${priority}`}</option>
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
        <Modal.Header>
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
