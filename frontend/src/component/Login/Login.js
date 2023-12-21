import React, { useState, useContext } from "react";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import { loginFields } from "../../constants/formField";
import UserContext from "../../context/UserContext";
import LoadingContext from "../../context/LoadingContext";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Post } from "../../helpers/backend-helpers";
import { loginRoute } from "../../api/Routes";
import { ToastContainer } from "react-toastify";
import FormExtra from "./FormExtra";
import FormAction from "./FormAction";
import Input from "./Input";
import notify from "../../helpers/notifyLogin";

const fields = loginFields;
let fieldsState = {};
fields.forEach((field) => (fieldsState[field.id] = ""));

export default function Login() {
    const navigate = useNavigate();
    const { setLoading } = useContext(LoadingContext);
    const { setUserID } = useContext(UserContext);

    const [loginState, setLoginState] = useState(fieldsState);
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [invalid, setInvalid] = useState(false);

    const handleChange = (e) => {
        setLoginState({ ...loginState, [e.target.id]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(loginRoute)
        authenticateUser();
    };

    //Handle Login API Integration here
    const authenticateUser = async () => {
        try {
            Post(loginRoute, setLoading, {
                email: loginState.email,
                password: loginState.password,
            }).then((response) => {
                if (response.status === "success") {
                    setUserName(loginState.username);
                    setLoginState("");
                    setUserID(response._id);
                    localStorage.setItem("study-hub-app-user", JSON.stringify(response));

                    notify("success");
                    setTimeout(() => {
                        navigate("/chat");
                    }, "3000");
                } else {
                    notify("error");
                }
            });
        } catch (error) {
            notify("error");
        }
    }


    return (
        <Box component="main" maxWidth="xs" pt={3}>
            <ToastContainer
                position="top-center"
                autoClose={1800}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <form onSubmit={handleSubmit}>
                {fields.map((field) => (
                    <Input
                        key={field.id}
                        handleChange={handleChange}
                        value={loginState[field.id]}
                        labelText={field.labelText}
                        labelFor={field.labelFor}
                        id={field.id}
                        name={field.name}
                        type={field.type}
                        isRequired={field.isRequired}
                        placeholder={field.placeholder}
                        autoComplete={field.name}
                    />
                ))}
                <FormExtra />
                <FormAction handleSubmit={handleSubmit} text="Login" />
            </form>
        </Box>
    );
}
