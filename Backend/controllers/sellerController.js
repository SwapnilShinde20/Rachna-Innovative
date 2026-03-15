const Seller = require('../models/Seller');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Property = require('../models/Property');

// @desc    Get all sellers (Admin only mostly)
// @route   GET /api/sellers
// @access  Private (Admin)
const getSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().populate('userId', 'name email');
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get current logged in seller
// @route   GET /api/sellers/me
// @access  Private
const getSellerMe = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id }).populate('userId', 'name email');
    if (seller) {
      res.json(seller);
    } else {
      res.status(404).json({ message: 'Seller profile not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get seller profile by ID or User ID
// @route   GET /api/sellers/:id
// @access  Private
const getSeller = async (req, res) => {
  try {
    // Try to find by Seller ID first, then User ID
    let seller = await Seller.findById(req.params.id).populate('userId', 'name email');
    if (!seller) {
      seller = await Seller.findOne({ userId: req.params.id }).populate('userId', 'name email');
    }

    if (seller) {
      res.json(seller);
    } else {
      res.status(404).json({ message: 'Seller profile not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create/Update Seller Profile
// @route   POST /api/sellers
// @access  Private
const updateSellerProfile = async (req, res) => {
  const { companyName, contactName, phone, email, address, gstNumber, licenseNumber, documents, logoUrl, yearsExperience } = req.body;

  try {
    let seller = await Seller.findOne({ userId: req.user.id });

    if (seller) {
      // Update
      seller.companyName = companyName || seller.companyName;
      seller.contactName = contactName || seller.contactName;
      seller.phone = phone || seller.phone;
      seller.email = email || seller.email;
      seller.address = address || seller.address;
      seller.gstNumber = gstNumber || seller.gstNumber;
      seller.licenseNumber = licenseNumber || seller.licenseNumber;
      if (yearsExperience !== undefined) seller.yearsExperience = yearsExperience;
      if (logoUrl !== undefined) seller.logoUrl = logoUrl;
      if (documents) seller.documents = documents;

      const updatedSeller = await seller.save();

      // Mark profile as completed
      await User.findByIdAndUpdate(req.user.id, { profileCompleted: true });

      res.json(updatedSeller);
    } else {
      // Create
      seller = new Seller({
        userId: req.user.id,
        companyName,
        contactName,
        phone,
        email,
        address,
        gstNumber,
        licenseNumber,
        yearsExperience,
        logoUrl,
        documents,
        status: 'submitted',
      });

      const createdSeller = await seller.save();

      // Mark profile as completed and ensure role is seller
      await User.findByIdAndUpdate(req.user.id, { role: 'seller', profileCompleted: true });

      res.status(201).json(createdSeller);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get seller's leads
// @route   GET /api/sellers/me/leads
// @access  Private
const getSellerLeads = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    const leads = await Lead.find({ sellerId: seller._id })
      .sort({ createdAt: -1 })
      .limit(10);
      
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get seller's analytics
// @route   GET /api/sellers/me/analytics
// @access  Private
const getSellerAnalytics = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    const totalLeads = await Lead.countDocuments({ sellerId: seller._id });
    
    // Hardcoded mock monthly data structure for demonstration, but driven by actual total counts dynamically
    // In a full production app this would aggregate createdAt timestamps
    const analyticsData = totalLeads === 0 ? [] : [
      { month: "Jan", views: totalLeads * 10, inquiries: totalLeads * 2 },
      { month: "Feb", views: totalLeads * 12, inquiries: totalLeads * 3 },
      { month: "Mar", views: totalLeads * 15, inquiries: totalLeads * 4 },
      { month: "Apr", views: totalLeads * 14, inquiries: totalLeads * 4 },
      { month: "May", views: totalLeads * 20, inquiries: totalLeads * 5 },
      { month: "Jun", views: totalLeads * 18, inquiries: totalLeads * 5 },
    ];

    res.json({
      totalViews: totalLeads * 89,
      totalInquiries: totalLeads * 23,
      viewsGrowth: totalLeads > 0 ? "+15%" : "0%",
      inquiriesGrowth: totalLeads > 0 ? "+12%" : "0%",
      chartData: analyticsData
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get detailed full analytics for the Analytics page
// @route   GET /api/sellers/me/analytics/full
// @access  Private
const getSellerFullAnalytics = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id });
    if (!seller) return res.status(404).json({ message: 'Seller profile not found' });

    // In a real production SQL/Mongo aggregation this would be a single optimized pipeline.
    // For this scope, we will compute the stats logically.
    const allLeads = await Lead.find({ sellerId: seller._id });
    const totalLeads = allLeads.length;
    
    // Derived dummy totalViews based on leads for demonstration
    const totalViews = totalLeads * 87; 
    const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : 0;
    
    // Mocking revenue based on lead count
    const totalRevenue = totalLeads * 1450; 

    // Generate monthly historical data
    // We will generate the last 6 months based on current counts spread artificially, or mapping real dates
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = totalLeads === 0 ? [] : months.map((m, i) => {
      // Simulate historical growth
      const scale = (i + 1) / months.length;
      return {
        month: m,
        views: Math.floor((totalViews / 6) * scale * 1.5),
        leads: Math.floor((totalLeads / 6) * scale * 1.5),
        revenue: Math.floor((totalRevenue / 6) * scale * 1.5)
      };
    });

    // Top properties algorithm: 
    // Count how many leads target each propertyId
    const propertyLeadCounts = {};
    if (totalLeads > 0) {
      allLeads.forEach(lead => {
        if(!propertyLeadCounts[lead.propertyId]) {
          propertyLeadCounts[lead.propertyId] = {
            name: lead.propertyName,
            leads: 0,
          };
        }
        propertyLeadCounts[lead.propertyId].leads++;
      });
    }

    // Convert to array and sort
    const topProperties = Object.values(propertyLeadCounts)
      .sort((a,b) => b.leads - a.leads)
      .slice(0, 5)
      .map(p => ({
        name: p.name,
        views: p.leads * 45, // mock views per property
        leads: p.leads,
        trend: p.leads > 2 ? 'up' : 'down'
      }));

    res.json({
      kpis: {
        totalViews,
        totalLeads,
        conversionRate: `${conversionRate}%`,
        revenue: totalRevenue,
        viewsGrowth: totalLeads > 0 ? "+12%" : "0%",
        leadsGrowth: totalLeads > 0 ? "+8%" : "0%",
        conversionGrowth: totalLeads > 0 ? "-1%" : "0%",
        revenueGrowth: totalLeads > 0 ? "+15%" : "0%"
      },
      monthlyData,
      topProperties
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update seller status (Admin)
// @route   PUT /api/sellers/:id/status
// @access  Private (Admin)
const updateSellerStatus = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const { status, reason } = req.body;
    const validStatuses = ['submitted', 'under_review', 'approved', 'rejected', 'suspended'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    seller.status = status;

    // Add a verification remark for audit trail
    const remark = {
      step: 'admin_review',
      remark: reason || `Status changed to ${status}`,
      status,
      reviewedAt: new Date(),
      reviewedBy: req.user.name || req.user._id.toString(),
    };
    seller.verificationRemarks.push(remark);

    const updatedSeller = await seller.save();
    res.json(updatedSeller);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSellers,
  getSeller,
  updateSellerProfile,
  updateSellerStatus,
  getSellerMe,
  getSellerLeads,
  getSellerAnalytics,
  getSellerFullAnalytics,
};
