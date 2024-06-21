import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Image, Row, Spinner } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { useCurrentUser } from '../contexts/CurrentUserContext';

function ProfileView() {

    const [profileData,setProfileData] = useState('');
    const [errors,setErrors] = useState('');
    const {id} = useParams();
    const currentUser = useCurrentUser()
    const history = useHistory()

    const {bios,created_at,image,is_owner,joined_tasks_count,owner,public_tasks_count} =profileData

    console.log(created_at)

    useEffect(() => {
        const fetchProfileDetails = async () => {
            try {
               const response = await axios.get(`profiles/${id}`)
               setProfileData(response.data)
               console.log(profileData)
            } catch (err) {
                setErrors(err.message)
                console.log(errors)
            }
        }

        fetchProfileDetails(); 

    }, [id]);

    const handleEditprofile = ()=>{
        history.push(`/edit-profile/${id}`)
    }

    if (!profileData && !errors.fetch) {
        return (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        );
      }
    return(<>
        <Container fluid className='align-items-right'>
        
        {currentUser.owner === profileData.owner && (
                    <Col lg={2} className="text-right">
                        <Button onClick={()=>{handleEditprofile()}} variant="primary">Edit</Button>
                    </Col>
                )}
                
        </Container>
        <Container fluid>
            <Row className="align-items-center">
                <Col lg={4} className="text-center">
                    <Image src={image} roundedCircle width={150} height={150} className="me-3" />
                </Col>
                <Col lg={8} className="d-flex flex-column justify-content-center">
                    <div className="mb-2"><strong><h2>{owner}</h2></strong></div>
                    <div className="text-muted">{`Date Joined : ${created_at}`}</div>
                    <div className="mb-2 mt-5">{bios}</div>
                </Col>
            </Row>
        </Container>
        <Container fluid className='mt-5 bg-secondary'>
                <Row className="justify-content-center text-center">
                    <Col lg={3}>
                        <div>
                            <h4>Joined Tasks</h4>
                            <div>{joined_tasks_count}</div>
                        </div>
                    </Col>
                    <Col lg={3}>
                        <div>
                            <h4>Public Tasks</h4>
                            <div>{public_tasks_count}</div>
                        </div>
                    </Col>
                </Row>
        </Container>
    </>)
}

export default ProfileView;
