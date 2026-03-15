const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const Seller = require('../models/Seller');
const Property = require('../models/Property');
const Transaction = require('../models/Transaction');
const Review = require('../models/Review');
const Meeting = require('../models/Meeting');
const CMSPage = require('../models/CMSPage');
const BlogPost = require('../models/BlogPost');
const Notification = require('../models/Notification');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await User.deleteMany();
    await Seller.deleteMany();
    await Property.deleteMany();
    await Transaction.deleteMany();
    await Review.deleteMany();
    await Meeting.deleteMany();
    await CMSPage.deleteMany();
    await BlogPost.deleteMany();
    await Notification.deleteMany();

    console.log('Data cleared...');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create Users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@rachna.com', password, role: 'admin', status: 'active' },
      { name: 'Rajesh Kumar', email: 'rajesh@premiumprop.com', password, role: 'seller', status: 'active' },
      { name: 'Priya Sharma', email: 'priya@goldenestates.com', password, role: 'seller', status: 'active' },
      { name: 'Amit Patel', email: 'amit@sunriserealty.in', password, role: 'seller', status: 'inactive' },
      { name: 'Neha Gupta', email: 'neha@metrohomes.com', password, role: 'seller', status: 'active' },
      { name: 'Arun Mehta', email: 'arun@email.com', password, role: 'buyer', status: 'active' },
      { name: 'Sneha Reddy', email: 'sneha@email.com', password, role: 'buyer', status: 'active' },
      { name: 'Karan Joshi', email: 'karan@email.com', password, role: 'buyer', status: 'suspended' },
    ]);

    const [admin, seller1, seller2, seller3, seller4, buyer1, buyer2, buyer3] = users;

    // Create Sellers
    const sellers = await Seller.create([
      {
        userId: seller1._id, companyName: 'Premium Properties Ltd', contactName: 'Rajesh Kumar',
        email: seller1.email, phone: '+91 98765 43210', address: '123 Business District, Mumbai',
        gstNumber: 'GST123456789', licenseNumber: 'LIC-2024-001', status: 'submitted',
        documents: [
          { name: 'GST Certificate', type: 'gst', url: '/docs/gst.pdf', uploadedAt: new Date() },
          { name: 'Business License', type: 'license', url: '/docs/license.pdf', uploadedAt: new Date() },
        ],
      },
      {
        userId: seller2._id, companyName: 'Golden Estates', contactName: 'Priya Sharma',
        email: seller2.email, phone: '+91 87654 32109', address: '456 Commercial Hub, Delhi',
        gstNumber: 'GST987654321', licenseNumber: 'LIC-2024-002', status: 'approved',
        documents: [{ name: 'GST Certificate', type: 'gst', url: '/docs/gst2.pdf', uploadedAt: new Date() }],
        verificationRemarks: [
          { step: 'business_info', remark: 'All information verified', status: 'approved', reviewedAt: new Date(), reviewedBy: 'Admin' },
          { step: 'documents', remark: 'Documents authentic', status: 'approved', reviewedAt: new Date(), reviewedBy: 'Admin' },
        ],
      },
      {
        userId: seller3._id, companyName: 'Sunrise Realty', contactName: 'Amit Patel',
        email: seller3.email, phone: '+91 76543 21098', address: '789 Real Estate Avenue, Bangalore',
        gstNumber: 'GST456789123', status: 'rejected', documents: [],
        verificationRemarks: [
          { step: 'business_info', remark: 'Information verified', status: 'approved', reviewedAt: new Date(), reviewedBy: 'Admin' },
          { step: 'documents', remark: 'Business license missing', status: 'needs_revision', reviewedAt: new Date(), reviewedBy: 'Admin' },
        ],
      },
      {
        userId: seller4._id, companyName: 'Metro Homes', contactName: 'Neha Gupta',
        email: seller4.email, phone: '+91 65432 10987', address: '321 Housing Complex, Chennai',
        gstNumber: 'GST321654987', licenseNumber: 'LIC-2023-045', status: 'approved',
        documents: [
          { name: 'GST Certificate', type: 'gst', url: '/docs/gst3.pdf', uploadedAt: new Date() },
          { name: 'License', type: 'license', url: '/docs/lic3.pdf', uploadedAt: new Date() },
        ],
      },
    ]);

    const [sp1, sp2, sp3, sp4] = sellers;

    // Create Properties
    await Property.create([
      { owner: sp1._id, title: 'Luxury Villa in Powai', type: 'Villa', location: 'Powai', price: 35000000, city: 'Mumbai', description: 'A beautiful luxury villa with lake view.', bedrooms: 4, bathrooms: 3, area: 3500, status: 'available', rating: 4.8, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'], amenities: ['Pool', 'Garden', 'Security'] },
      { owner: sp2._id, title: 'Modern Apartment in Bandra', type: 'Apartment', location: 'Bandra West', price: 15000000, city: 'Mumbai', description: 'Spacious 2BHK in the heart of the city.', bedrooms: 2, bathrooms: 2, area: 1200, status: 'available', rating: 4.5, images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'], amenities: ['Gym', 'Parking', 'Clubhouse'] },
      { owner: sp2._id, title: 'Penthouse in South Delhi', type: 'Penthouse', location: 'South Delhi', price: 45000000, city: 'Delhi', description: 'Stunning penthouse with city skyline views.', bedrooms: 5, bathrooms: 4, area: 5000, status: 'available', rating: 4.9, images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'], amenities: ['Pool', 'Gym', 'Concierge'] },
      { owner: sp4._id, title: 'Commercial Space in Andheri', type: 'Commercial', location: 'Andheri East', price: 8000000, city: 'Mumbai', description: 'Prime commercial space for offices.', bedrooms: 0, bathrooms: 2, area: 2000, status: 'available', rating: 4.2, images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'], amenities: ['Parking', 'Security', 'Lift'] },
      { owner: sp4._id, title: 'Cozy Studio in Koramangala', type: 'Apartment', location: 'Koramangala', price: 6000000, city: 'Bangalore', description: 'Perfect studio apartment for young professionals.', bedrooms: 1, bathrooms: 1, area: 600, status: 'sold', rating: 4.0, images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'], amenities: ['Gym', 'WiFi'] },
    ]);

    // Create Transactions
    await Transaction.create([
      { buyerId: buyer1._id, buyerName: 'Arun Mehta', sellerId: sp2._id, sellerName: 'Priya Sharma', amount: 250000, status: 'completed', description: 'Property booking advance', completedAt: new Date() },
      { buyerId: buyer2._id, buyerName: 'Sneha Reddy', sellerId: sp4._id, sellerName: 'Neha Gupta', amount: 500000, status: 'pending', description: 'Commercial property deposit' },
      { buyerId: buyer3._id, buyerName: 'Karan Joshi', sellerId: sp2._id, sellerName: 'Priya Sharma', amount: 75000, status: 'failed', description: 'Site visit booking' },
      { buyerId: buyer1._id, buyerName: 'Arun Mehta', sellerId: sp4._id, sellerName: 'Neha Gupta', amount: 150000, status: 'completed', description: 'Consultation fee', completedAt: new Date() },
      { buyerId: buyer2._id, buyerName: 'Sneha Reddy', sellerId: sp2._id, sellerName: 'Priya Sharma', amount: 100000, status: 'refunded', description: 'Cancelled booking refund' },
    ]);

    // Create Reviews
    await Review.create([
      { buyerId: buyer1._id, buyerName: 'Arun Mehta', sellerId: sp2._id, sellerName: 'Priya Sharma', rating: 5, comment: 'Excellent service! Priya was very professional and helpful throughout the process.', status: 'approved', flagged: false },
      { buyerId: buyer2._id, buyerName: 'Sneha Reddy', sellerId: sp4._id, sellerName: 'Neha Gupta', rating: 4, comment: 'Good experience overall. Response time could be improved.', status: 'approved', flagged: false },
      { buyerId: buyer3._id, buyerName: 'Karan Joshi', sellerId: sp2._id, sellerName: 'Priya Sharma', rating: 2, comment: 'This is spam content with inappropriate language...', status: 'pending', flagged: true, flagReason: 'Contains inappropriate content' },
      { buyerId: buyer1._id, buyerName: 'Arun Mehta', sellerId: sp4._id, sellerName: 'Neha Gupta', rating: 5, comment: 'Amazing properties and great customer service!', status: 'pending', flagged: false },
    ]);

    // Create Meetings
    await Meeting.create([
      { title: 'Property Discussion - 3BHK Villa', buyerId: buyer1._id, buyerName: 'Arun Mehta', sellerId: sp2._id, sellerName: 'Priya Sharma', scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), duration: 30, status: 'scheduled', meetingLink: 'https://meet.rachna.com/abc123' },
      { title: 'Commercial Property Tour', buyerId: buyer2._id, buyerName: 'Sneha Reddy', sellerId: sp4._id, sellerName: 'Neha Gupta', scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), duration: 45, status: 'scheduled', meetingLink: 'https://meet.rachna.com/def456' },
      { title: 'Residential Property Inquiry', buyerId: buyer3._id, buyerName: 'Karan Joshi', sellerId: sp2._id, sellerName: 'Priya Sharma', scheduledAt: new Date(Date.now() - 86400000), duration: 30, status: 'completed' },
    ]);

    // Create Blog Posts
    await BlogPost.create([
      { title: 'Top 10 Tips for First-Time Home Buyers in 2024', slug: 'top-10-tips-first-time-home-buyers-2024', content: '<p>Buying your first home is an exciting milestone. Here are 10 tips to guide you through the process...</p>', excerpt: 'Essential tips every first-time home buyer should know.', authorId: admin._id, authorName: 'Admin User', status: 'published', category: 'Buying Guide', tags: ['first-time-buyer', 'tips'], isFeatured: true, publishedAt: new Date() },
      { title: 'Understanding Property Registration Process', slug: 'understanding-property-registration', content: '<p>Property registration is a crucial step in any real estate transaction...</p>', authorId: admin._id, authorName: 'Admin User', status: 'draft', category: 'Legal', isFeatured: false },
      { title: 'Investment Opportunities in Commercial Real Estate', slug: 'investment-opportunities-commercial', content: '<p>Commercial real estate offers unique investment opportunities...</p>', excerpt: 'Explore lucrative investment opportunities.', authorId: admin._id, authorName: 'Admin User', status: 'pending_approval', category: 'Investment', tags: ['commercial', 'investment'], isFeatured: false },
    ]);

    // Create CMS Pages
    await CMSPage.create([
      { title: 'Hero Section', slug: 'home-hero', content: '<h1>Find Your Dream Property</h1><p>Discover the best properties...</p>', seoTitle: 'Rachna Innovative - Premium Properties', seoDescription: 'Find your dream property with Rachna Innovative', isActive: true, section: 'home', order: 1 },
      { title: 'Featured Properties', slug: 'home-featured', content: '<section>Featured properties carousel...</section>', isActive: true, section: 'home', order: 2 },
      { title: 'About Us', slug: 'about', content: '<h1>About Rachna Innovative</h1><p>We are a leading real estate platform.</p>', seoTitle: 'About Us - Rachna Innovative', isActive: true, section: 'about', order: 1 },
      { title: 'Privacy Policy', slug: 'privacy-policy', content: '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>', isActive: true, section: 'policies', order: 1 },
      { title: 'Testimonials Section', slug: 'home-testimonials', content: '<section>Customer testimonials...</section>', isActive: false, section: 'home', order: 3 },
    ]);

    // Create Notifications
    await Notification.create([
      { userId: admin._id.toString(), title: 'New Seller Registration', message: 'Premium Properties Ltd has registered and is pending verification.', type: 'info', isRead: false, link: '/admin/sellers' },
      { userId: admin._id.toString(), title: 'Meeting Scheduled', message: 'Video call scheduled between Arun Mehta and Golden Estates.', type: 'success', isRead: true, link: '/admin/meetings' },
      { userId: admin._id.toString(), title: 'Review Flagged', message: 'A review has been flagged for inappropriate content.', type: 'warning', isRead: false, link: '/admin/reviews' },
      { userId: admin._id.toString(), title: 'Transaction Failed', message: 'A transaction has failed and needs attention.', type: 'error', isRead: false, link: '/admin/transactions' },
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
