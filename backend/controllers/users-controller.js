const { Users } = require('../models/users-schema');
const { setToken, matchCredentials, logout } = require('../models/users-model');
const userTestData = require('../models/test-data/users-testdata');
const { generateID } = require('../models/utils');
const { hash } = require('bcrypt');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users: ', error);
        res.status(500).send('Error fetching users');
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await Users.findOne({ id: req.params.userId });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user: ', error);
        res.status(500).send('Error fetching user');
    }
};

const registerUser = async (req, res) => {
    const requiredFields = {
        userName: 'Please provide a username.',
        userEmail: 'Please provide an email address.',
        userPassword: 'Please provide a password.'
    };

    for (const [field, errorMessage] of Object.entries(requiredFields)) {
        if (!req.body[field]) {
            return res.status(400).json({ error: errorMessage });
        }
    }

    try {
        const userId = generateID();
        const hashedPassword = await bcrypt.hash(req.body.userPassword, 10);

        const user = await Users.create({
            id: userId,
            name: req.body.userName,
            email: req.body.userEmail,
            password: hashedPassword,
            role: 'user'
        });

        setToken(req, user.email, user.id);

        return res.json({ user });
    } catch (error) {
        if (error.code === 11000) {
            const duplicateKey = Object.keys(error.keyValue)[0];
            const duplicateValue = error.keyValue[duplicateKey];
            console.log({ error: `Duplicate Key Error for ${duplicateKey}: ${duplicateValue}` });
            return res.status(410).json({ error: `${duplicateKey} already in use}` });
        } else {
            console.error(error);
            res.status(500).json({ error: `Error creating user: ${error.message}` });
        }
    }
};

const loginUser = async (req, res, next) => {
    try {
        const requiredFields = {
            userEmail: 'Please provide an email address.',
            userPassword: 'Please provide a password.'
        };

        for (const [field, errorMessage] of Object.entries(requiredFields)) {
            if (!req.body[field]) {
                return res.status(400).json({ error: errorMessage });
            }
        }

        const user = await matchCredentials(req.body.userEmail, req.body.userPassword);

        if (user) {
            setToken(req, user.email, user.id);
            console.log('User session', req.session);

            return res.json({ user });
        } else {
            console.log('Login failed');
            return res.status(401).json({ error: 'Please provide a valid email address and password. If you continue to have issues logging into your account, contact Support.' });
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const logoutUser = async (req, res) => {
    try {
        logout(req);
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed' });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const { name: userName, email: userEmail, currentPassword: userCurrentPassword, newPassword: userNewPassword, flare: userFlare } = req.body;

    console.log('user update ', req.body);

    try {
        let user = await Users.findOne({ id: userId });
        if (!user) {
            return res.status(404).send('User not found');
        }
        if (user.id !== req.user.id) {
            return res.status(403).send('You are not authorised to delete this user');
        }

        const updateData = {};
        updateData.name = userName || user.name;
        updateData.email = userEmail || user.email;
        updateData.flare = userFlare || user.flare;
        updateData.password = userNewPassword
            ? (await bcrypt.compare(userCurrentPassword, user.password))
                ? await bcrypt.hash(userNewPassword, 10)
                : res.status(403).send('Current password is incorrect, please try again')
            : user.password;

        user = await Users.findOneAndUpdate({ id: userId }, updateData, { new: true });

        setToken(req, user.email, user.id);
        console.log('User session', req.session);

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Error updating user details: ', error);
        res.status(500).send('Error updating user details');
    }
};

const populateTestData = async (req, res) => {
    try {
        await Users.deleteMany({});
        const hashedUsers = await Promise.all(userTestData.map(async (user) => {
            user.password = await hash(user.password, 10);
            return user;
        }));
        await Users.insertMany(hashedUsers);
        console.log('populated users');
        res.redirect('/');
    } catch (error) {
        console.error('Error populating test data: ', error);
        res.status(500).send('Error populating test data');
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    populateTestData
};