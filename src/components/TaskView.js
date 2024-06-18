import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Container, Row, Col, Card } from 'react-bootstrap';
import { useCurrentUser } from "../contexts/CurrentUserContext";

function TaskView() {
  const currentUser = useCurrentUser();
  const [ticketData, setTicketData] = useState(null);
  const [errors, setErrors] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const getTicketView = async () => {
      try {
        const response = await axios.get(`task-view/${id}`);
        const data = response.data;
        setTicketData(data);
      } catch (err) {
        console.error('Error fetching task details:', err);
        setErrors(err.message);
      }
    };

    getTicketView();
  }, [id]);

  if (!ticketData && !errors) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const isWorthyUser = currentUser && (currentUser.username === ticketData.owner || ticketData.assigned_users.includes(currentUser.username));
  const isPriorityHigh = ticketData?.priority === 'High';
  const currentDate = new Date();
  // const dueDate = new Date(ticketData.due_date);
  // const isDueDatePast = dueDate < currentDate;
  const dueDate = ticketData ? new Date(ticketData.due_date) : null;
  const isDueDatePast = dueDate ? dueDate < currentDate : false; 

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
          {errors && <p className="text-danger">Error: {errors}</p>}
        </Col>

        <Col md={12}>
          <Card className="mb-4">
            <Card.Header className='text-center'>
              <h2>{isWorthyUser ? 'User Messages' : "You do not have permission to view this Task's chat history"}</h2>
            </Card.Header>
            <Card.Body>
              {isWorthyUser ? (
                <p>Messages and form to be implemented...</p>
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
