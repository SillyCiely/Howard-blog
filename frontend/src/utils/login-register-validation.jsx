// frontend/src/utils/form-validation.js

import { useState } from 'react';

export const useFormValidation = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const isUsername = () => {
        if (username.length === 0) {
            setUsernameError(true);
            setUsernameErrorMessage('Username is required');
            return false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage('');
            return true;
        }
    };

    const isEmail = () => {
        if (email.length === 0) {
            setEmailError(true);
            setEmailErrorMessage('Email is required');
            return false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
            return true;
        }
    };

    const isPassword = () => {
        if (password.length === 0) {
            setPasswordError(true);
            setPasswordErrorMessage('Password is required');
            return false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
            return true;
        }
    };

    const handleSubmit = (e, onSubmit) => {
        e.preventDefault();
        const isUsernameValid = isUsername();
        const isEmailValid = isEmail();
        const isPasswordValid = isPassword();

        if (isUsernameValid && isEmailValid && isPasswordValid) {
            onSubmit({ username, email, password });
        }
    };

    return {
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
    };
};