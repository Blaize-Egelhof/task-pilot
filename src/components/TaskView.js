import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Container, Row, Col, Card, Form, Button, Image, Badge } from 'react-bootstrap';
import { useCurrentUser } from "../contexts/CurrentUserContext";

function TaskView() {
  const currentUser = useCurrentUser();
  const [ticketData, setTicketData] = useState(null);
  const [ticketMessageData, setTicketMessageData] = useState([]);
  const [errors, setErrors] = useState({});
  const [newMessageData, setNewMessageData] = useState({
    context: '',
  });
  const { id } = useParams();

  useEffect(() => {
    const getTicketView = async () => {
      try {
        const response = await axios.get(`/task-view/${id}`);
        const data = response.data;
        setTicketData(data);
      } catch (err) {
        console.error('Error fetching task details:', err);
        setErrors({ ...errors, fetch: err.message });
      }
    };

    const getTicketMessages = async () => {
      try {
        const response = await axios.get(`/task-messages-view/${id}`);
        const data = response.data;
        console.log(data)
        setTicketMessageData(data);
      } catch (err) {
        console.error('Error fetching task messages:', err);
        setErrors({ ...errors, fetch: err.message });
      }
    };

    getTicketView();
    getTicketMessages();
  }, [id]);

  const handleChange = (event) => {
    setNewMessageData({
      ...newMessageData,
      [event.target.name]: event.target.value,
    });
  };

  const handleDelete= async(messageId)=>{
    console.log('paramater to handleDelete', messageId)
    try{
      await axios.post(`task-messages-delete/${messageId}`);
      setTicketMessageData(ticketMessageData.filter(msg => msg.id !== messageId));
    }catch(err){
      console.error('Error deleting Message:', err);
      setErrors({ ...errors, delete: err.message });
    }
  }

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

  const isWorthyUser = currentUser && (currentUser.username === ticketData?.owner || ticketData?.assigned_users.includes(currentUser.username));
  const isPriorityHigh = ticketData?.priority === 'High';
  const currentDate = new Date();
  const dueDate = ticketData ? new Date(ticketData.due_date) : null;
  const isDueDatePast = dueDate ? dueDate < currentDate : false;

  console.log('ticketMessageData', ticketMessageData,'!')

  return (
    <Container>
      <Row>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header className='text-center'>
              <h2>{ticketData?.title}</h2>
            </Card.Header>
            <Card.Body>
              <p><strong>Description:</strong> {ticketData?.description}</p>
              <p><strong>Category:</strong> {ticketData?.category}</p>
              <p><strong>Priority:</strong> <span style={{ color: isPriorityHigh ? 'red' : 'black' }}>{ticketData?.priority}</span></p>
              <p><strong>State:</strong> {ticketData?.state}</p>
              <p><strong>Due Date:</strong> <span style={{ color: isDueDatePast ? 'red' : 'inherit' }}>{ticketData?.due_date}</span></p>
              <p><strong>Created At:</strong> {ticketData?.created_at}</p>
              <p><strong>Owner:</strong> {ticketData?.owner}</p>
              <p><strong>Assigned Users:</strong> {ticketData?.assigned_users.length > 0 ? ticketData.assigned_users.join(', ') : 'None'}</p>
            </Card.Body>
          </Card>
          {errors.fetch && <p className="text-danger">Error: {errors.fetch}</p>}
        </Col>

        <Col md={12}>
          <Card className="mb-4">
            <Card.Header className='text-center'>
              <h2>{isWorthyUser ? 'User Messages' : "You do not have permission to view this Task's chat history"}</h2>
            </Card.Header>
            <Card.Body>
              {isWorthyUser ? (
                <>
                  {ticketMessageData.map((msg, index) => (
                    <Card key={index} className="mb-2">
                      <Card.Body className="d-flex align-items-center">
                        <Image src={msg.sender_profile_image_url} roundedCircle width={50} height={50} className="me-3" />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5>{msg.sender_username}</h5>
                              <Badge className='text-dark' bg="secondary">{new Date(msg.timestamp).toLocaleString()}</Badge> 
                            </div>
                            {currentUser && (currentUser.username === msg.sender || currentUser.username === ticketData.owner) && (
                              <Button variant="danger" onClick={()=>handleDelete(msg.id)} size="sm">Delete</Button>
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
    </Container>
  );
}

export default TaskView;
