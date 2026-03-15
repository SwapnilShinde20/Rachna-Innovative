const Property = require('../models/Property');
const Seller = require('../models/Seller');
const Review = require('../models/Review');
const Lead = require('../models/Lead');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { search, type, minPrice, maxPrice, location, amenities, sellerId } = req.query;
    
    let query = {};

    // If sellerId is provided, return ALL properties for that seller (any status)
    if (sellerId) {
      query.owner = sellerId;
    } else {
      // Public queries: only show approved properties
      query.status = 'approved';
    }

    // Search by title or location
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by type
    if (type && type !== 'all') {
      query.type = type;
    }

    // Filter by location
    if (location) {
        query.city = { $regex: location, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by amenities
    if (amenities) {
        const amenitiesList = amenities.split(',');
        query.amenities = { $all: amenitiesList };
    }

    const properties = await Property.find(query).populate('owner', 'companyName status').sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner');
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private (Seller)
const createProperty = async (req, res) => {
  try {
    // Look up the seller profile for the logged-in user
    const seller = await Seller.findOne({ userId: req.user.id });
    if (!seller) {
      return res.status(400).json({ message: 'Seller profile not found. Please complete your profile first.' });
    }

    const property = new Property({
      ...req.body,
      owner: seller._id,
      status: 'pending_review',
    });
    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      Object.assign(property, req.body);
      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      await property.deleteOne();
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── ADMIN ENDPOINTS ────────────────────────────────

// @desc    Get all pending properties
// @route   GET /api/properties/pending
// @access  Private (Admin)
const getPendingProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'pending_review' })
      .populate('owner', 'companyName contactName phone')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Approve a property
// @route   PUT /api/properties/:id/approve
// @access  Private (Admin)
const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    property.status = 'approved';
    property.adminRemarks = '';
    await property.save();
    res.json({ message: 'Property approved', property });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Reject a property
// @route   PUT /api/properties/:id/reject
// @access  Private (Admin)
const rejectProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    property.status = 'rejected';
    property.adminRemarks = req.body.remarks || 'Rejected by admin';
    await property.save();
    res.json({ message: 'Property rejected', property });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ─── BUYER ENDPOINTS ────────────────────────────────

// @desc    Get reviews for a specific property
// @route   GET /api/properties/:id/reviews
// @access  Public
const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.id, status: 'approved' })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a review for a property
// @route   POST /api/properties/:id/reviews
// @access  Private (Buyer)
const addPropertyReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ message: 'Rating is required' });

    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Check if user already reviewed this property
    const existing = await Review.findOne({ propertyId: req.params.id, buyerId: req.user.id });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
    } else {
      await Review.create({
        propertyId: req.params.id,
        buyerId: req.user.id,
        buyerName: req.user.name,
        rating,
        comment,
        status: 'approved',
      });
    }

    // Recalculate average rating for this property
    const allReviews = await Review.find({ propertyId: req.params.id, status: 'approved' });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    property.rating = Math.round(avgRating * 10) / 10;
    await property.save();

    res.status(201).json({ message: 'Review submitted', rating: property.rating });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Submit enquiry / schedule tour for a property
// @route   POST /api/properties/:id/enquire
// @access  Private (Buyer)
const enquireProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    
    // Distinguish between general enquiry vs. schedule tour
    const { date, time, message } = req.body;


    if (date && time) {
      // Create a Meeting for Tour Request
      const Meeting = require('../models/Meeting'); // Inline import to avoid circular dep if any
      
      // Check if buyer already has a pending or scheduled meeting for this property
      const existingMeeting = await Meeting.findOne({
        buyerId: req.user.id,
        propertyId: property._id,
        status: { $in: ['requested', 'scheduled'] }
      });

      if (existingMeeting) {
        return res.status(400).json({ message: 'You already have a requested or scheduled tour for this property. Please wait for an admin to handle it.' });
      }

      const scheduledAt = new Date(`${date}T${time}`);
      
      const meeting = await Meeting.create({
        title: `Property Tour: ${property.title}`,
        propertyId: property._id,
        buyerId: req.user.id,
        buyerName: req.user.name,
        buyerEmail: req.user.email, // Passing email if frontend ever needs it on meeting
        sellerId: property.owner._id,
        sellerName: property.owner.companyName || property.owner.contactName, // sellerName is generally company name
        scheduledAt,
        duration: 30, // Default 30 min tour
        status: 'requested',
        notes: message ? [{
          authorId: req.user.id,
          authorName: req.user.name,
          content: message,
          isInternal: false,
          createdAt: new Date(),
        }] : []
      });

      return res.status(201).json({ message: 'Tour request submitted successfully', meeting });
    } else {
      // Create a Lead for General Enquiry
      const lead = await Lead.create({
        propertyId: property._id,
        propertyName: property.title,
        buyerId: req.user.id,
        buyerName: req.user.name,
        sellerId: property.owner._id,
        status: 'new',
      });

      return res.status(201).json({ message: 'Enquiry submitted successfully', lead });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Check tour status for a property
// @route   GET /api/properties/:id/tour-status
// @access  Private (Buyer)
const getPropertyTourStatus = async (req, res) => {
  try {
    const Meeting = require('../models/Meeting');
    const existingMeeting = await Meeting.findOne({
      buyerId: req.user.id,
      propertyId: req.params.id,
      status: { $in: ['requested', 'scheduled'] }
    });

    if (existingMeeting) {
      return res.json({ hasPendingTour: true, status: existingMeeting.status, scheduledAt: existingMeeting.scheduledAt });
    }
    
    return res.json({ hasPendingTour: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getPendingProperties,
  approveProperty,
  rejectProperty,
  getPropertyReviews,
  addPropertyReview,
  enquireProperty,
  getPropertyTourStatus,
};
