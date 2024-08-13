import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { Form, Button, Col, Row, Container, Spinner, Alert } from "react-bootstrap";
import { useSetCurrentUser } from '../contexts/CurrentUserContext';
import styles from '../css/CreateEditForm.module.css'

/**
 * Component for editing user profile details.
 */
function EditProfile() {
    // Extracts the 'id' from the URL
    const { id } = useParams();
    // History for navigation
    const history = useHistory();
    // Function to update the current user context
    const setCurrentUser = useSetCurrentUser();
    //Stores profile data fetched from the server
    const [profileData, setProfileData] = useState(null);
    // Loading state to show a spinner while fetching data
    const [loading, setLoading] = useState(true);
    // Stores any errors encountered during fetch or submit
    const [errors, setErrors] = useState({});
    // Stores profile image and bios file
    const [formData, setFormData] = useState({
        image: null,
        bios: "",
    });

    /**
     * Fetches profile details from the server based on the 'id' parameter.
     * Updates state with fetched profile data or sets errors if request fails.
     */
    useEffect(() => {
        // Fetches profile details from the server
        const fetchProfileDetails = async () => {
            try {
                const response = await axios.get(`/profiles/${id}`);
                setProfileData(response.data);
                //set response data , otherwise toggels to defaults if nothing is provided
                setFormData({
                    image: response.data.image || null,
                    bios: response.data.bios || "",
                });
                //Toggle loading to false to remove spinner
                setLoading(false);
            } catch (err) {
                //Save any errors to Errors state , removes spinner
                console.error('Error fetching profile details:', err);
                setErrors({ fetch: err.message });
                setLoading(false);
            }
        };

        fetchProfileDetails();

        // Add background class to body
        document.body.classList.add(styles.backgroundImage);

        // Clean up the background class on component unmount
        return () => {
        document.body.classList.remove(styles.backgroundImage);
        };
    }, [id,]);// Re-runs the effect if 'id' changes

    /**
     * Handles changes in form input fields.
     * @param {Object} event - The event object containing the updated input value.
     */
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };
    /**
     * Handles changes in the profile image upload.
     * @param {Object} event - The event object containing the uploaded file.
     */
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setFormData({
            ...formData,
            image: file,
        });

        // Update image preview,when uploading
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setProfileData({
                    ...profileData,
                    image: reader.result,
                });
            }
        };
        //read the file as a URL for API updating purposes
        reader.readAsDataURL(file);
    };
    /**
     * Handles form submission for updating the profile.
     * @param {Object} event - The event object triggered on form submission.
     */
    const handleSubmit = async (event) => {
        // Prevent the form from losing data upon unsuccesful submit
        event.preventDefault();
        // Creates a variable to hold the forms data
        const formDataToSend = new FormData();
        formDataToSend.append("bios", formData.bios);
        // Checks if the image uploaded is a file , then appends
        if (formData.image instanceof File) {
            formDataToSend.append("image", formData.image);
        }
        // Sends update request to API , while updating profile data context to re-render header and update image
        try {   
            const { data } = await axios.put(`/profiles/${id}/`, formDataToSend);
            setProfileData(data); 
            setCurrentUser((currentUser) => ({
                ...currentUser,
                profile_image: data.image,
            }));
            //redirect to profile page to see changes in action
            history.push(`/user-profile/${id}`, {successMessage:"Profile Updated Succesfully!"});
        } catch (err) {
            // Catch any errors to present to users for better UX
            console.error('Error updating profile:', err);
            setErrors({ submit: err.message });
        }
    };
    // Show spinner if loading is true
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }
    // Renders this warning if the person requesting to edit a profile is NOT the owner of the profile
    if (profileData && profileData.is_owner === false) {
        return (
            <Container className="text-center">
                <Alert variant="danger">You do not have permission to edit this profile.</Alert>
            </Container>
        );
    }
    // If the user requesting the profile instance is the owner of the profile then render the full form for editing
    return (
        <Container className={`${styles.ProfileEditContainer}`}>
            <Row className="justify-content-md-center">
                <Col md={6} className='text-center'>
                    <h2 className={`${styles.Header}`}>Edit Profile</h2>
                    <p className='fw-bold fs-5'>Profile Image</p>
                    {errors.fetch && <Alert variant="danger">{errors.fetch}</Alert>}
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Form.Group controlId="formImage" className="mb-3">
                            <div className="mb-3">
                                {formData.image && (
                                    <img src={profileData.image} alt="Profile Preview" width={180} height={180} className="rounded-circle" />
                                )}
                            </div>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="Bios" className="mb-3">
                            <Form.Label className='fw-bold fs-5'>Bio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="bios"
                                value={formData.bios}
                                onChange={handleChange}
                                className={`${styles.profileBackGround}`}
                            />
                        </Form.Group>
                        <Button className='mb-4' variant="primary" type="submit">Save Changes</Button>
                        {errors.submit && <Alert variant="danger" className="mt-3">{errors.submit}</Alert>}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default EditProfile;
