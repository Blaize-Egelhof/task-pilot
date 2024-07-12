import React from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import styles from '../css/SignInUpForm.module.css'
import { Link } from 'react-router-dom/cjs/react-router-dom'

/**
 * Component for displaying a custom 404 Not Found page.
 * Provides a message and options for navigating back to safety.
 */

function Four0Four() {
  return (
    <>
    <Row className='mt-10'>
      <Container>
        <Col>
        <Link to="/sign-up" className={`${styles.Link} `}>
        <span className={styles.Text}>Oh No! You are lost!, to return back to safety, please click: <span className={styles.Link}>HERE</span> </span>
        </Link>
        </Col>
      </Container>
      <Container className={styles.Four0FourContainer}>
      <Col
        md={12}
        className={`my-auto d-md-block p-2 ${styles.ImageStyling}`}
      >
        <Image
          className="img-fluid"
          src={"https://res.cloudinary.com/drdelhvyt/image/upload/v1717588579/d8qzgqm3jehxarrooyku.webp"}
        />
      </Col>
      </Container>
      <Container>
        <Col>
          <Link to="/sign-up" className={`${styles.Link}`}>
            <Button className={`${styles.AutoButton}`}>
              <span>HERE</span>
            </Button>
          </Link>
        </Col>
      </Container>
    </Row>
    </>
  )
}

export default Four0Four