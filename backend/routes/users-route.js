var express = require('express');
var router = express.Router();
const authenticateUser = require('../middleware/authenticateUser.js');
const {
    getAllUsers,
    getUserById,
    registerUser,
    loginUser,
    logoutUser,
    updateUser,
    populateTestData
} = require('../controllers/users-controller.js');

// render views
router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));

// GET REQUESTS
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);

// POST REQUESTS
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// PUT REQUESTS
router.put('/update/:userId', authenticateUser, updateUser);

// DELETE REQUESTS
/* users should not be "deleted" for audit purposes (?)
 todo -- add deleted + dateCreated flags to user schema
  to delete: PATCH to set deleted flag to true
  alt: delete the user profile */

// POPULATE TEST DATA
router.post('/users/populate-test-data', populateTestData);

module.exports = router;