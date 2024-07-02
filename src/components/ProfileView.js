import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Image, Row, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import styles from '../css/CreateEditForm.Module.css'

function ProfileView() {
    // State to store profile data
    const [profileData,setProfileData] = useState('');
    // State to store any errors
    const [errors,setErrors] = useState('');
    // Extract 'id' parameter from the URL
    const {id} = useParams();
    // Hook for navigating
    const history = useHistory()
    // Destructure profile data fields for easy access
    const {bios,created_at,image,is_owner,joined_tasks_count,owner,owned_tasks_count} =profileData

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
               const response = await axios.get(`profiles/${id}`)
               setProfileData(response.data)
            } catch (err) {
                setErrors(err.message)
            }
        }
        // Call the function to fetch profile details
        fetchProfileDetails(); 

    }, [id]);
    // Handler for editing the profile
    const handleEditprofile = ()=>{
        // Navigate to the edit profile page
        history.push(`/edit-profile/${id}`)
    }
    // Display a spinner while data is being fetched
    if (!profileData && !errors) {
        return (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        );
      }
    return(<>
    <Row className={`${styles.profileRow}`}>
        <Container fluid >
            {/* Checks if the is_owner variable is True, if so, renders an edit button for profile owners to edit their profile */}
        {is_owner === true && (
                    <Col lg={2} className="text-right mt-1">
                        <Button onClick={()=>{handleEditprofile()}} variant="primary">Edit</Button>
                    </Col>
                )}
                
        </Container>
        <Container fluid>
            <Row className="align-items-center">
                {/* Renders the user profile pic in circle format */}
                <Col lg={4} className="text-center">
                    <Image src={image} roundedCircle width={230} height={230} className="me-3 mt-1" />
                </Col>
                <Col lg={8} className="d-flex flex-column justify-content-center">
                    <div className="mb-2 fw-bolder"><strong><h2>{owner}</h2></strong></div>
                    <div className="text-muted fw-bolder">{`Date Joined : ${created_at}`}</div>
                    <div className="mb-2 mt-5">{bios}</div>
                </Col>
            </Row>
        </Container>
        <Container fluid className='mt-2'>
                <Row className="justify-content-center text-center">
                    {/* Shows the number of tasks the profile owner has joined*/}
                    <Col lg={3}>
                        <div>
                            <h4 className={`${styles.HeaderV1}`}>Joined Tasks</h4>
                            <div className='fw-bolder fs-4'>{joined_tasks_count}</div>
                        </div>
                    </Col>
                    {/* Shows the number of tasks the profile owner has created*/}
                    <Col lg={3}>
                        <div>
                            <h4 className={`${styles.HeaderV1}`}>Owned Tasks</h4>
                            <div className='fw-bolder fs-4'>{owned_tasks_count}</div>
                        </div>
                    </Col>
                </Row>
        </Container>
    </Row>
    </>)
}

export default ProfileView;
