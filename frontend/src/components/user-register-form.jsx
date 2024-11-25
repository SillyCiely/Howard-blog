import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormValidation } from '../utils/login-register-validation';
import '../styles/form.css';

const RegisterForm = ({ onSubmit, errorMsg }) => {
    const {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usernameError,
        emailError,
        passwordError,
        usernameErrorMessage,
        emailErrorMessage,
        passwordErrorMessage,
        isUsername,
        isEmail,
        isPassword,
        handleSubmit
    } = useFormValidation();

    return (
        <form className="flex-col-container form-container" onSubmit={(e) => handleSubmit(e, onSubmit)}>
            {/* only render the error message if there is one */}
            {errorMsg && <div>{errorMsg}</div>}

            <TextField
                className="form-field"
                label="Username"
                value={username}
                // required
                error={usernameError}
                helperText={usernameErrorMessage}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={isUsername}
            />
            <TextField
                className="form-field"
                label="Email"
                value={email}
                // required
                error={emailError}
                helperText={emailErrorMessage}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={isEmail}
            />
            <TextField
                className="form-field"
                label="Password"
                value={password}
                type="password"
                // required
                error={passwordError}
                helperText={passwordErrorMessage}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={isPassword}
            />
            <Button type="submit">Register</Button>
        </form>
    );
};

export default RegisterForm;