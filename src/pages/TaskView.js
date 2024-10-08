import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Container, Row, Col, Card, Form, Button, Image, Badge, Modal } from 'react-bootstrap';
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import styles from '../css/TicketDetail.module.css';

/**
 * Component for displaying detailed view of a task, including its messages.
 * Users can view task details, leave the task (if part of assigned users), view and send messages.
 */
function TaskView() {
  const currentUser = useCurrentUser();
  const { id } = useParams();
  const history = useHistory();

  const [ticketData, setTicketData] = useState(null);
  const [ticketMessageData, setTicketMessageData] = useState([]);
  const [errors, setErrors] = useState({});
  const [newMessageData, setNewMessageData] = useState({
    context: '',
    important: false, // Initial important value set to false
  });

  // State for modals
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    const getTicketView = async () => {
      try {
        const response = await axios.get(`/task-view/${id}`);
        setTicketData(response.data);
      } catch (err) {
        setErrors({ ...errors, fetch: err.message });
      }
    };

    const getTicketMessages = async () => {
      try {
        const response = await axios.get(`/task-messages-view/${id}`);
        setTicketMessageData(response.data);
      } catch (err) {
        setErrors({ ...errors, fetch: err.message });
      }
    };

    getTicketView();
    getTicketMessages();
    // Add background class to body
    document.body.classList.add(styles.backgroundImage);

    // Clean up the background class on component unmount
    return () => {
    document.body.classList.remove(styles.backgroundImage);
    };
  }, [id, errors]);
  /**
   * Handles input change events by updating the state with the new value.
   * If the input is a checkbox, it toggles the boolean value in the state.
   * @param {Event} event - The input change event containing the target element.
   */
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const val = type === 'checkbox' ? checked : value;
    setNewMessageData({
      ...newMessageData,
      [name]: val,
    });
  };
  /**
   * Handles leaving a task group by making a PUT request to the backend API.
   * Navigates to the home page upon successful leave and shows a success message.
   * Sets errors state if there's an error during the API call.
   */
  const handleLeaveGroup = async () => {
    try {
      await axios.put(`leave-task/${id}`);
      history.push('/home-page', { deleteMessage: `Left Task: ${ticketData.title} successfully.` }); 
    } catch (err) {
      console.error("Error leaving task:", err); // Log the error
      setErrors("An error occurred while leaving the task. Please try again.");
    }
  };

  /**
   * Handles deleting a message by making a POST request to the backend API.
   * Removes the deleted message from ticketMessageData state upon successful delete.
   * Closes the delete modal upon successful deletion.
   * Sets errors state if there's an error during the API call.
   */
  const handleDelete = async () => {
    try {
      await axios.post(`task-messages-delete/${messageToDelete}`);
      setTicketMessageData(ticketMessageData.filter((msg) => msg.id !== messageToDelete));
      setShowDeleteModal(false); // Close the delete modal
    } catch (err) {
      console.error('Error deleting message:', err);
      setErrors({ ...errors, delete: err.message });
    }
  };
  /**
   * Navigates to the user profile page when clicking on a profile image or username in the message.
   * @param {string} msgId - The ID of the message sender's profile to navigate to.
   */

  const handleProfileClick = (msgId) => {
    history.push(`/user-profile/${msgId}`);
  };

  /**
   * Handles submitting a new message by making a POST request to the backend API.
   * Updates ticketMessageData state with the new message upon successful submission.
   * Resets newMessageData state after submission.
   * Sets errors state if there's an error during the API call.
   * @param {Event} e - The form submit event.
   */
  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/task-messages-send/${id}`, newMessageData);
      setTicketMessageData([...ticketMessageData, response.data]);
      setNewMessageData({ context: '', important: false }); // Reset important status after submission
    } catch (err) {
      console.error('Error submitting message:', err);
      setErrors({ ...errors, submit: err.message });
    }
  };

  if (!ticketData && !errors.fetch) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const isOwner = currentUser && ticketData?.owner === currentUser.username;
  const isWorthyUser = currentUser && (ticketData?.assigned_users.includes(currentUser.pk));
  const isPriorityHigh = ticketData?.priority === 'High';
  const currentDate = new Date();
  const dueDate = ticketData ? new Date(ticketData.due_date) : null;
  const isDueDatePast = dueDate ? dueDate < currentDate : false;

  return (
    <Container>
      <Row className={`${styles.CustomContainer}`}>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header className={`text-center ${styles.InputBorder}`}>
              <h2 className={`${styles.InputLabel}`}>{ticketData?.title}</h2>
            </Card.Header>
            <Card.Body className={`${styles.CustomBackGround}`}>
              {isWorthyUser && (
                <div>
                  <Button variant="danger" className="ms-1 mb-1" onClick={() => setShowLeaveModal(true)}>Leave Task</Button>
                </div>
              )}
              <p><strong>Description:</strong> {ticketData?.description}</p>
              <p><strong>Category:</strong> {ticketData?.category}</p>
              <p><strong>Priority:</strong> <span style={{ color: isPriorityHigh ? 'red' : 'black' }}>{ticketData?.priority}</span></p>
              <p><strong>State:</strong> {ticketData?.state}</p>
              <p><strong>Due Date:</strong> <span style={{ color: isDueDatePast ? 'red' : 'inherit' }}>{ticketData?.due_date}</span><span><Badge pill className={`${styles.CustomOverdueBadge}`}>Overdue</Badge></span></p>
              <p><strong>Created At:</strong> {ticketData?.created_at}</p>
              <p><strong>Owner:</strong> {ticketData?.owner}</p>
              <p><strong>Assigned Users:</strong> {ticketData?.assigned_users ? ticketData.assigned_users.length : 'None'}</p>
            </Card.Body>
          </Card>
          {errors.fetch && <p className="text-danger text-center">Error: {errors.fetch}</p>}
        </Col>

        <Col md={12}>
          <Card className="mb-4">
            <Card.Header className={`text-center ${styles.InputBorder}`}>
            <h2>
        {isWorthyUser || isOwner ? (
          <p className={styles.InputLabel}>User Messages</p>
        ) : (
          "You do not have permission to view this Task's chat history"
        )}
      </h2>
            </Card.Header>
            <Card.Body className={styles.CustomBackGround}>
            {isWorthyUser || isOwner ? (
                <>
                  {ticketMessageData.map((msg, index) => (
                    <Card key={index} className={`mb-2 mt-2 ${styles.CustomUserBackground}`}>
                      <Card.Body className={`${styles.CustomMessage}`}>
                        <div className={`d-flex align-items-start align-items-sm-center ${styles.CustomMessageLayout}`}>
                          <div className={`me-3 mb-3 mb-sm-0`}>
                            <Image src={msg.sender_profile_image_url} roundedCircle width={50} height={50} onClick={() => handleProfileClick(msg.sender)} />
                          </div>
                          <div className={`flex-grow-1 mw-100`}>
                            <div className={`d-flex justify-content-start align-items-center  ${styles.CustomRemoveButton}`}>
                              <div>
                                <h5 onClick={() => handleProfileClick(msg.sender)}>{msg.sender_username}</h5>
                                <Badge className={`text-dark  ${styles.hideText}`} bg="secondary">{new Date(msg.timestamp).toLocaleString()}</Badge>
                              </div>
                              {msg.important && <Badge className={`${styles.CustomOverdueBadge} me-2`} bg="warning">Important</Badge>}
                              {(currentUser.username === msg.sender || currentUser.username === ticketData.owner) && (
                                <Button variant="danger" onClick={() => { setMessageToDelete(msg.id); setShowDeleteModal(true); }} size="sm">Delete</Button>
                              )}
                            </div>
                            <p className={`${styles.ContainText}`}>{msg.context}</p>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                  <Form onSubmit={handleSubmitMessage}>
                    <Form.Group controlId="context">
                      <Form.Label>New Message</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="context"
                        value={newMessageData.context}
                        onChange={handleChange}
                        className={styles.CustomUserBackground}
                      />
                    </Form.Group>
                    {isOwner && (
                      <Form.Group controlId="important">
                        <Form.Check
                          type="checkbox"
                          label="Mark Important"
                          name="important"
                          checked={newMessageData.important}
                          onChange={handleChange}
                          className="mb-3"
                        />
                      </Form.Group>
                    )}
                    <Button type="submit" className="mt-2">Submit</Button>
                  </Form>
                  {errors.submit && <p className="text-danger mt-2">Error: Your message is too long, please shorten it.</p>}
                </>
              ) : (
                <p>You do not have permission to view this Task's chat history.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal for leaving the task */}
      <Modal show={showLeaveModal} onHide={() => setShowLeaveModal(false)}>
        <Modal.Header>
          <Modal.Title>Confirm Leave Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to leave this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLeaveModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLeaveGroup}>
            Yes, Leave Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for deleting a message */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header>
          <Modal.Title>Confirm Delete Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this message?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default TaskView;