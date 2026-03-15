const User = require('../models/User');
const Property = require('../models/Property');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// @desc    Get current user's favorite properties
// @route   GET /api/users/favorites
// @access  Private (Buyer)
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'favorites',
      match: { status: 'approved' },
    });
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Toggle favorite (add or remove a property from favorites)
// @route   POST /api/users/favorites/toggle
// @access  Private (Buyer)
const toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    if (!propertyId) return res.status(400).json({ message: 'propertyId is required' });

    const user = await User.findById(req.user.id);
    const index = user.favorites.findIndex(id => id.toString() === propertyId);

    let added;
    if (index > -1) {
      // Already favorited → remove
      user.favorites.splice(index, 1);
      added = false;
    } else {
      user.favorites.push(propertyId);
      added = true;
    }

    await user.save();
    res.json({ added, favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    if (req.body.profileImage !== undefined) {
      user.profileImage = req.body.profileImage;
    }
    
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      profileImage: user.profileImage,
      phone: user.phone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getFavorites,
  toggleFavorite,
  updateProfile,
};
