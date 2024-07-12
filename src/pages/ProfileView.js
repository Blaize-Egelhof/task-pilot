import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Image, Row, Spinner } from 'react-bootstrap';
import { useHistory, useLocation, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import styles from '../css/CreateEditForm.module.css'

/**
 * Component for displaying the profile details of a user.
 * Fetches and displays user profile information based on the 'id' parameter from URL.
 * Allows profile owners to edit their profile and shows success alerts upon actions.
 */

function ProfileView() {
    const location = useLocation();
    const successMessage = location.state?.successMessage;
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
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
        /**
         * Function to fetch profile details from the server.
         * Updates 'profileData' state with fetched data or sets 'errors' state on failure.
         */
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
        // If there's a success message, show the success alert
        if (successMessage) {
            setShowSuccessAlert(true);
            // Automatically hide the success alert after 5 seconds
            const successTimer = setTimeout(() => {
            setShowSuccessAlert(false);
            }, 5000);
    
            // Clean up timer
            return () => clearTimeout(successTimer);
        }

    }, [id,successMessage]);
    /**
     * Handler function to dismiss the success alert.
     * Hides the success alert message.
     */
    const handleDismiss = () => {
        // Manually dismiss the alert
        setShowSuccessAlert(false);
    };
    /**
     * Handler function to navigate to the edit profile page.
     * Redirects to the edit profile page using the 'history' object.
     */
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
        <div className="d-flex justify-content-center align-items-center h-auto">
                    <div className="w-50">
                        {showSuccessAlert && (
                            <Alert className='mt-1 text-center' variant="success" onClose={handleDismiss}>
                                <p>{successMessage}</p>
                                <div className="d-flex justify-content-end">
                                    <Button variant="outline-success" onClick={handleDismiss}>
                                        Close
                                    </Button>
                                </div>
                            </Alert>
                        )}
                    </div>
                </div>
        
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
