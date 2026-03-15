const ServiceRequest = require('../models/ServiceRequest');

// Create a new service request (Buyer/Seller)
const createRequest = async (req, res) => {
  try {
    const {
      serviceCategory,
      fullName,
      email,
      phone,
      requestType,
      subject,
      description,
      files,
      urgency
    } = req.body;

    const newRequest = new ServiceRequest({
      user: req.user ? req.user.id : null, 
      serviceCategory,
      fullName,
      email,
      phone,
      requestType,
      subject,
      description,
      files,
      urgency
    });

    await newRequest.save();
    res.status(201).json({ message: 'Service request created successfully', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all service requests or user's specific requests
const getRequests = async (req, res) => {
  try {
    let query = {};
    if (req.user.role !== 'admin') {
      // If not an admin, only see your own requests
      query.user = req.user.id;
    }
    const requests = await ServiceRequest.find(query).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Update status of a request
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Ensure only valid statuses are set
    if (!['Pending', 'In Progress', 'Resolved', 'Rejected'].includes(status)) {
       return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedRequest = await ServiceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(updatedRequest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus
};
