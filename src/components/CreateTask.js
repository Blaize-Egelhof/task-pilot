import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import styles from "../css/CreateEditForm.Module.css";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { useSetCurrentUser } from "../contexts/CurrentUserContext";

function CreateTask() {
  const currentUser = useSetCurrentUser()
    return (
      <Row className={styles.Row}>
        <Col>
          <Container className={`p-4`}>
            <h2 className={styles.Header}>Create A Ticket</h2>
            <Form>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>Ticket Title</Form.Label>
                <Form.Control
                  name="title"
                  type="text"
                  placeholder="Enter Ticket Title"
                  className={`${styles.Input} ${styles.InputBorder}`}
                  required
                />
              </Form.Group>
  
              {/* {errors.username?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))} */}
  
              <Form.Group className="mb-3" controlId="description">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`}>Description</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  name="description"
                  as="textarea"
                  placeholder="Task Description"
                  rows={3}
                  required
                  // value={password}
                  // onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="due_date">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`} >Due Date</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  name="due_date"
                  type="date"
                  placeholder="Enter a due date"
                  required
                  // value={password}
                  // onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="priority">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`} >Priority</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  name="priority"
                  as="select"
                  placeholder="Select Priority"
                  required
                  // value={password}
                  // onChange={handleChange}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="category">
                <Form.Label className={`${styles.Input} ${styles.InputLabel}`} >Category</Form.Label>
                <Form.Control
                  className={`${styles.Input} ${styles.InputBorder}`}
                  name="category"
                  as="select"
                  placeholder="Select a category"
                  required
                  // value={password}
                  // onChange={handleChange}
                >
                  <option>Work</option>
                  <option>Personal</option>
                  <option>Study</option>
                  <option>Other</option>
                </Form.Control>
              </Form.Group>
  
              {/* {errors.password?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))} */}

              <Button className={styles.Button} variant="primary" type="submit">
                Create
              </Button>
              <Button className={`${styles.Button} ${styles.ButtonSpacing}`} variant="secondary">
                Cancel
              </Button>
              {/* {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))} */}
            </Form>
          </Container>
        </Col>
        {/* <Col md={6} className={`my-auto d-none d-md-block p-2 ${styles.ImageStyling}`}>
          <Image
            className="img-fluid"
            src={
              "https://res.cloudinary.com/drdelhvyt/image/upload/v1717518621/ywnnicskunb2ddlciwui.webp"
            }
          />
        </Col> */}
      </Row>
    );
}

export default CreateTask;
