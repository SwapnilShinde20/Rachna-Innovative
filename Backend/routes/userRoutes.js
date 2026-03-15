const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getFavorites, toggleFavorite, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUsers);
router.route('/favorites').get(protect, getFavorites);
router.route('/favorites/toggle').post(protect, toggleFavorite);
router.route('/profile').put(protect, updateProfile);
router.route('/:id').delete(protect, deleteUser);

module.exports = router;
