import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import LoadingContext from "../../context/LoadingContext";
import { signupFields } from "../../constants/formField";
import FormAction from "./FormAction";
import Input from "./Input";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Post } from "../../helpers/backend-helpers";
import { registerRoute } from "../../api/Routes"
import { Box, Container } from "@mui/material";
import notify from '../../helpers/notifyRegister';

const fields = signupFields;
let fieldsState = {};

fields.forEach((field) => (fieldsState[field.id] = ""));

export default function SignUp() {
  const navigate = useNavigate();
  const { setLoading } = useContext(LoadingContext);
  const { setUserID } = useContext(UserContext);

  const [signupState, setSignupState] = useState(fieldsState);

  const handleChange = (e) => {
    setSignupState({ ...signupState, [e.target.id]: e.target.value });
    console.log(signupState)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAccount();
  };

  const createAccount = async () => {
    if (signupState.password !== signupState.confirm_password) {
      notify("error", "Password doesn't match with Confirm Password");
      setLoading(false);
      return;
    }
    try {
      Post(registerRoute, setLoading, {
        username: signupState.username,
        email: signupState.email,
        password: signupState.password,
      }).then((response) => {

        if (response.status === "success") {
          setUserID(signupState.username);
          setSignupState("");

          notify("success");
          setTimeout(() => {
            navigate("/");
          }, "3000");
        } else {
          notify("error", response.message);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <Box component="main" mt={3}>
      <form onSubmit={handleSubmit}>
        <div>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {fields.map((field) => (
            <Input
              key={field.id}
              handleChange={handleChange}
              value={signupState[field.id]}
              labelText={field.labelText}
              labelFor={field.labelFor}
              id={field.id}
              name={field.name}
              type={field.type}
              isRequired={field.isRequired}
              placeholder={field.placeholder}
            />
          ))}
          <FormAction handleSubmit={handleSubmit} text="Sign up" />
        </div>
      </form>
    </Box>
  );
}
