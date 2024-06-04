import React,{useState} from "react";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import styles from "../../css/SignInUpForm.Module.css"
import axios from 'axios'
import { Link, useHistory } from "react-router-dom";

function SignInForm() {

  const [signInData,setSignInData] = useState({
    username:'',
    password:'',
  })

  const [errors,setErrors]= useState({})

  const history = useHistory;

  const {username,password} = signInData

  const handleChange =(event) =>{
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  }
  const formSubmit = async (event) =>{
    event.preventDefault();
    console.log(signInData)
    try{
      await axios.post('/dj-rest-auth/login/', signInData)
      history.push('/home-page')
    }
    catch(err){
      setErrors(err.response?.data);
    }
  }

  return (
    <Row className={styles.Row}>
      <Col className="my-auto p-0 p-md-2" md={6}>
        <Container className={`} p-4 `}>
          <h1 className={styles.Header}>SIGN IN</h1>
          <Form onSubmit={formSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label className='d-none'>Username</Form.Label>
              <Form.Control className={styles.Input} name='username' type="username" placeholder="Enter Username" value={username} onChange={handleChange} />
            </Form.Group>

            {errors.username?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group className="mb-3" controlId="password">
              <Form.Label className='d-none'>Password</Form.Label>
              <Form.Control className={styles.Input} name='password' type="password" placeholder="Password" value={password} onChange={handleChange} />
            </Form.Group>

            {errors.password?.map((message, idx) => (
              <Alert key={idx} variant="warning">
                {message}
              </Alert>
            ))}

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
            </Form.Group>

            <Button className={styles.Button} variant="primary" type="submit">
              Sign In
            </Button>
            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>
        <Container className={`mt-3 `}>
          <Link className={`${styles.Link} `} to="/signup">
          <span className={styles.Text}>Dont have an account?</span> <span className={styles.Link}>Sign up now!</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.ImageStyling}`}
      >
        <Image
          className="img-fluid"
          src={"https://res.cloudinary.com/drdelhvyt/image/upload/v1717518621/ywnnicskunb2ddlciwui.webp"}
        />
      </Col>
    </Row>
  );
}

export default SignInForm;