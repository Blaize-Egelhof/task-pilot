import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import { Form, Button, Col, Row, Container, Spinner, Alert } from "react-bootstrap";
import { useCurrentUser, useSetCurrentUser } from '../contexts/CurrentUserContext';

function EditProfile() {
    const { id } = useParams();
    const history = useHistory();
    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        image: null,
        bios: "",
    });

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
                const response = await axios.get(`/profiles/${id}`);
                setProfileData(response.data);
                setFormData({
                    image: response.data.image || null,
                    bios: response.data.bios || "",
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile details:', err);
                setErrors({ fetch: err.message });
                setLoading(false);
            }
        };

        fetchProfileDetails();
    }, [id]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setFormData({
            ...formData,
            image: file,
        });

        // Update image preview
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setProfileData({
                    ...profileData,
                    image: reader.result,
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("bios", formData.bios);

        if (formData.image instanceof File) {
            formDataToSend.append("image", formData.image);
        }

        try {
            const { data } = await axios.put(`/profiles/${id}/`, formDataToSend);
            setProfileData(data); 
            setCurrentUser((currentUser) => ({
                ...currentUser,
                profile_image: data.image,
            }));
            history.push(`/user-profile/${id}`);
        } catch (err) {
            console.error('Error updating profile:', err);
            setErrors({ submit: err.message });
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (profileData && profileData.is_owner === false) {
        return (
            <Container className="text-center">
                <Alert variant="danger">You do not have permission to edit this profile.</Alert>
            </Container>
        );
    }

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <h2>Edit Profile</h2>
                    {errors.fetch && <Alert variant="danger">{errors.fetch}</Alert>}
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Form.Group controlId="formImage" className="mb-3">
                            <Form.Label>Profile Image</Form.Label>
                            <div className="mb-3">
                                {formData.image && (
                                    <img src={profileData.image} alt="Profile Preview" width={150} height={150} className="rounded-circle" />
                                )}
                            </div>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="Bios" className="mb-3">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="bios"
                                value={formData.bios}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Save Changes</Button>
                        {errors.submit && <Alert variant="danger" className="mt-3">{errors.submit}</Alert>}
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default EditProfile;
