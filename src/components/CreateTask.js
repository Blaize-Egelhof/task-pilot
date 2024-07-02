import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import styles from "../css/CreateEditForm.Module.css";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useCurrentUser } from '../contexts/CurrentUserContext';
import { Alert } from "react-bootstrap";
import { useRedirect } from "../hooks/useRedirect";

function CreateTask() {
  const currentUser = useCurrentUser();
  const [createTicketData , setCreateTicketData] = useState(
    {
      title:'',
      description:'',
      due_date:'',
      priority:'',
      category:'',
    }
  )

  const [errors,setErrors] = useState('')
  const history = useHistory()

  const {title,description,due_date,priority,category} = createTicketData;

  const handleChange = (event) => {
    setCreateTicketData({
      ...createTicketData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async(event)=>{
    event.preventDefault();
    console.log(createTicketData)
    try{
      await axios.post("/create-task/", createTicketData);
      history.push("/home-page");
    }catch(err){
      setErrors(err.response?.data);
    }
  }

    return (
      <Row className={styles.Row}>
        <Col>
          <Container className={`p-4`}>
            <h2 className={styles.Header}>Create A Task</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>Ticket Title</Form.Label>
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

              {errors.description?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}

              <Form.Group className="mb-3" controlId="due_date">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`} >Due Date</Form.Label>
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
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`} >Priority</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  name="priority"
                  as="select"
                  placeholder="Select Priority"
                  required
                  value={priority}
                  onChange={handleChange}
                >
                  <option value='Medium'>Select Priority</option>
                  <option value='High'>High</option>
                  <option value='Medium'>Medium</option>
                  <option value='Low'>Low</option>
                </Form.Control>
              </Form.Group>

              {errors.priority?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}

              <Form.Group className="mb-3" controlId="category">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`} >Category</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  name="category"
                  as="select"
                  placeholder="Select a category"
                  required
                  value={category}
                  onChange={handleChange}
                >
                  <option value='Other'>Select Category</option>
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

              <Button className={styles.Button} variant="primary" type="submit">
                Create
              </Button>
              <Link to="/home-page" >
                <Button variant="secondary" className={`${styles.Button} ${styles.ButtonSpacing}`}>Cancel</Button>
              </Link>
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}
            </Form>
          </Container>
        </Col>
      </Row>
    );
}

export default CreateTask;
