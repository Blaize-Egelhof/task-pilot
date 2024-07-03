import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Container, Row, Col, Card, Form, Button, Image, Badge, Modal } from 'react-bootstrap';
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import styles from '../css/TicketDetail.module.css';

function TaskView() {
  const currentUser = useCurrentUser();
  const [ticketData, setTicketData] = useState(null);
  const [ticketMessageData, setTicketMessageData] = useState([]);
  const [errors, setErrors] = useState({});
  const [newMessageData, setNewMessageData] = useState({
    context: '',
  });
  const { id } = useParams();
  const history = useHistory();

  // State for modals
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);

  useEffect(() => {
    const getTicketView = async () => {
      try {
        const response = await axios.get(`/task-view/${id}`);
        const data = response.data;
        setTicketData(data);
      } catch (err) {
        setErrors({ ...errors, fetch: err.message });
      }
    };

    const getTicketMessages = async () => {
      try {
        const response = await axios.get(`/task-messages-view/${id}`);
        const data = response.data;
        setTicketMessageData(data);
      } catch (err) {
        setErrors({ ...errors, fetch: err.message });
      }
    };

    getTicketView();
    getTicketMessages();
  }, [id,errors]);

  const handleChange = (event) => {
    setNewMessageData({
      ...newMessageData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.put(`leave-task/${id}`);
      // Redirect or update state as needed
      history.push('/some-other-page'); // Redirect to another page
    } catch (err) {
      setErrors(err);
    }
  };

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

  const handleProfileClick = (msgId) => {
    history.push(`/user-profile/${msgId}`);
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/task-messages-send/${id}`, newMessageData);
      setTicketMessageData([...ticketMessageData, response.data]);
      setNewMessageData({ context: '' });
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

  const isWorthyUser = currentUser && (currentUser.username === ticketData?.owner || ticketData?.assigned_users.includes(currentUser));
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
              {isWorthyUser && ticketData?.assigned_users.includes(currentUser.id) && (
                <div>
                  <Button variant="danger" onClick={() => setShowLeaveModal(true)}>Leave Task</Button>
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
              <h2>{isWorthyUser === false ? <p className={styles.InputLabel}>User Messages</p> : "You do not have permission to view this Task's chat history"}</h2>
            </Card.Header>
            <Card.Body className={styles.CustomBackGround}>
              {isWorthyUser ? (
                <>
                  {ticketMessageData.map((msg, index) => (
                    <Card key={index} className={`{mb-2} ${styles.CustomUserBackground}`}>
                      <Card.Body className="d-flex align-items-center">
                        <Image src={msg.sender_profile_image_url} roundedCircle width={50} height={50} className="me-3" onClick={() => handleProfileClick(msg.id)} />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5 onClick={() => handleProfileClick(msg.id)}>{msg.sender_username}</h5>
                              <Badge className='text-dark' bg="secondary">{new Date(msg.timestamp).toLocaleString()}</Badge>
                            </div>
                            {currentUser && (currentUser.username === msg.sender || currentUser.username === ticketData.owner) && (
                              <Button variant="danger" onClick={() => { setMessageToDelete(msg.id); setShowDeleteModal(true); }} size="sm">Delete</Button>
                            )}
                          </div>
                          <h6>{msg.title}</h6>
                          <p>{msg.context}</p>
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
                    <Button type="submit" className="mt-2">Submit</Button>
                  </Form>
                  {errors.submit && <p className="text-danger mt-2">Error Your message sent is too long , please shorten</p>}
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
