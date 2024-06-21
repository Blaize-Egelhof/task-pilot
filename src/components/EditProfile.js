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
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

function EditProfile(){

    const {id} = useParams()

    return(
        <p>Edit Form Rendered!</p>
    )
}
export default EditProfile;