// Mock Users (combined buyers & sellers for unified view)
export const mockUsers = [
  { id: 'u1', email: 'rajesh@premiumprop.com', name: 'Rajesh Kumar', role: 'seller', status: 'active', createdAt: '2024-01-15T10:00:00Z' },
  { id: 'u2', email: 'priya@goldenestates.com', name: 'Priya Sharma', role: 'seller', status: 'active', createdAt: '2024-01-10T09:00:00Z' },
  { id: 'u3', email: 'amit@sunriserealty.in', name: 'Amit Patel', role: 'seller', status: 'inactive', createdAt: '2024-01-08T11:00:00Z' },
  { id: 'u4', email: 'arun@email.com', name: 'Arun Mehta', role: 'buyer', status: 'active', createdAt: '2024-01-01T08:00:00Z' },
  { id: 'u5', email: 'sneha@email.com', name: 'Sneha Reddy', role: 'buyer', status: 'active', createdAt: '2024-01-05T10:00:00Z' },
  { id: 'u6', email: 'karan@email.com', name: 'Karan Joshi', role: 'buyer', status: 'suspended', createdAt: '2024-01-10T12:00:00Z' },
  { id: 'u7', email: 'neha@metrohomes.com', name: 'Neha Gupta', role: 'seller', status: 'active', createdAt: '2023-12-20T08:00:00Z' },
];

// Mock Sellers
export const mockSellers = [
  {
    id: '1',
    userId: 'u1',
    companyName: 'Premium Properties Ltd',
    contactName: 'Rajesh Kumar',
    email: 'rajesh@premiumprop.com',
    phone: '+91 98765 43210',
    address: '123 Business District, Mumbai, Maharashtra',
    gstNumber: 'GST123456789',
    licenseNumber: 'LIC-2024-001',
    documents: [
      { id: 'd1', name: 'GST Certificate', type: 'gst', url: '/docs/gst.pdf', uploadedAt: '2024-01-15' },
      { id: 'd2', name: 'Business License', type: 'license', url: '/docs/license.pdf', uploadedAt: '2024-01-15' },
    ],
    status: 'submitted',
    currentStep: 'business_info',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    userId: 'u2',
    companyName: 'Golden Estates',
    contactName: 'Priya Sharma',
    email: 'priya@goldenestates.com',
    phone: '+91 87654 32109',
    address: '456 Commercial Hub, Delhi',
    gstNumber: 'GST987654321',
    licenseNumber: 'LIC-2024-002',
    documents: [
      { id: 'd3', name: 'GST Certificate', type: 'gst', url: '/docs/gst2.pdf', uploadedAt: '2024-01-10' },
    ],
    status: 'approved',
    currentStep: 'contact_verification',
    verificationRemarks: [
      { step: 'business_info', remark: 'All information verified', status: 'approved', reviewedAt: '2024-01-11T10:00:00Z', reviewedBy: 'Admin' },
      { step: 'documents', remark: 'Documents authentic', status: 'approved', reviewedAt: '2024-01-11T14:00:00Z', reviewedBy: 'Admin' },
      { step: 'contact_verification', remark: 'Contact verified via phone', status: 'approved', reviewedAt: '2024-01-12T10:00:00Z', reviewedBy: 'Admin' },
    ],
    verifiedAt: '2024-01-12T14:00:00Z',
    verifiedBy: 'admin-1',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-12T14:00:00Z',
  },
  {
    id: '3',
    userId: 'u3',
    companyName: 'Sunrise Realty',
    contactName: 'Amit Patel',
    email: 'amit@sunriserealty.in',
    phone: '+91 76543 21098',
    address: '789 Real Estate Avenue, Bangalore',
    gstNumber: 'GST456789123',
    documents: [],
    status: 'rejected',
    currentStep: 'documents',
    rejectionReason: 'Incomplete documentation - Missing business license',
    verificationRemarks: [
      { step: 'business_info', remark: 'Information verified', status: 'approved', reviewedAt: '2024-01-08T14:00:00Z', reviewedBy: 'Admin' },
      { step: 'documents', remark: 'Business license missing', status: 'needs_revision', reviewedAt: '2024-01-09T10:00:00Z', reviewedBy: 'Admin' },
    ],
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-09T16:00:00Z',
  },
  {
    id: '4',
    userId: 'u7',
    companyName: 'Metro Homes',
    contactName: 'Neha Gupta',
    email: 'neha@metrohomes.com',
    phone: '+91 65432 10987',
    address: '321 Housing Complex, Chennai',
    gstNumber: 'GST321654987',
    licenseNumber: 'LIC-2023-045',
    documents: [
      { id: 'd4', name: 'GST Certificate', type: 'gst', url: '/docs/gst3.pdf', uploadedAt: '2023-12-20' },
      { id: 'd5', name: 'License', type: 'license', url: '/docs/lic3.pdf', uploadedAt: '2023-12-20' },
    ],
    status: 'approved',
    currentStep: 'contact_verification',
    verifiedAt: '2023-12-22T10:00:00Z',
    verifiedBy: 'admin-1',
    createdAt: '2023-12-20T08:00:00Z',
    updatedAt: '2023-12-22T10:00:00Z',
  },
  {
    id: '5',
    userId: 'seller-5',
    companyName: 'Heritage Properties',
    contactName: 'Vikram Singh',
    email: 'vikram@heritageprop.com',
    phone: '+91 54321 09876',
    address: '567 Old City, Jaipur',
    status: 'under_review',
    currentStep: 'documents',
    documents: [
      { id: 'd6', name: 'ID Proof', type: 'id', url: '/docs/id.pdf', uploadedAt: '2024-01-18' },
    ],
    verificationRemarks: [
      { step: 'business_info', remark: 'Information looks good', status: 'approved', reviewedAt: '2024-01-19T10:00:00Z', reviewedBy: 'Admin' },
    ],
    createdAt: '2024-01-18T14:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
  },
];

// Mock Buyers
export const mockBuyers = [
  { id: 'b1', userId: 'u4', name: 'Arun Mehta', email: 'arun@email.com', phone: '+91 11111 22222', status: 'active', createdAt: '2024-01-01' },
  { id: 'b2', userId: 'u5', name: 'Sneha Reddy', email: 'sneha@email.com', company: 'Tech Corp', status: 'active', createdAt: '2024-01-05' },
  { id: 'b3', userId: 'u6', name: 'Karan Joshi', email: 'karan@email.com', phone: '+91 33333 44444', status: 'suspended', createdAt: '2024-01-10' },
];

// Mock Transactions
export const mockTransactions = [
  { id: 'txn-1', buyerId: 'b1', buyerName: 'Arun Mehta', sellerId: '2', sellerName: 'Priya Sharma', amount: 250000, status: 'completed', description: 'Property booking advance', createdAt: '2024-01-15T10:00:00Z', completedAt: '2024-01-15T10:05:00Z' },
  { id: 'txn-2', buyerId: 'b2', buyerName: 'Sneha Reddy', sellerId: '4', sellerName: 'Neha Gupta', amount: 500000, status: 'pending', description: 'Commercial property deposit', createdAt: '2024-01-18T14:00:00Z' },
  { id: 'txn-3', buyerId: 'b3', buyerName: 'Karan Joshi', sellerId: '2', sellerName: 'Priya Sharma', amount: 75000, status: 'failed', description: 'Site visit booking', createdAt: '2024-01-19T09:00:00Z' },
  { id: 'txn-4', buyerId: 'b1', buyerName: 'Arun Mehta', sellerId: '4', sellerName: 'Neha Gupta', amount: 150000, status: 'completed', description: 'Consultation fee', createdAt: '2024-01-10T11:00:00Z', completedAt: '2024-01-10T11:02:00Z' },
  { id: 'txn-5', buyerId: 'b2', buyerName: 'Sneha Reddy', sellerId: '2', sellerName: 'Priya Sharma', amount: 100000, status: 'refunded', description: 'Cancelled booking refund', createdAt: '2024-01-12T16:00:00Z' },
];

// Mock Reviews
export const mockReviews = [
  { id: 'rev-1', buyerId: 'b1', buyerName: 'Arun Mehta', sellerId: '2', sellerName: 'Priya Sharma', rating: 5, comment: 'Excellent service! Priya was very professional and helpful throughout the process.', status: 'approved', flagged: false, createdAt: '2024-01-16T10:00:00Z', moderatedAt: '2024-01-16T12:00:00Z', moderatedBy: 'Admin' },
  { id: 'rev-2', buyerId: 'b2', buyerName: 'Sneha Reddy', sellerId: '4', sellerName: 'Neha Gupta', rating: 4, comment: 'Good experience overall. Response time could be improved.', status: 'approved', flagged: false, createdAt: '2024-01-17T14:00:00Z', moderatedAt: '2024-01-17T15:00:00Z', moderatedBy: 'Admin' },
  { id: 'rev-3', buyerId: 'b3', buyerName: 'Karan Joshi', sellerId: '2', sellerName: 'Priya Sharma', rating: 2, comment: 'This is spam content with inappropriate language...', status: 'pending', flagged: true, flagReason: 'Contains inappropriate content', createdAt: '2024-01-19T08:00:00Z' },
  { id: 'rev-4', buyerId: 'b1', buyerName: 'Arun Mehta', sellerId: '4', sellerName: 'Neha Gupta', rating: 5, comment: 'Amazing properties and great customer service!', status: 'pending', flagged: false, createdAt: '2024-01-20T09:00:00Z' },
];

// Mock CMS Pages
export const mockCMSPages = [
  { id: 'page-1', title: 'Hero Section', slug: 'home-hero', content: '<h1>Find Your Dream Property</h1><p>Discover the best properties...</p>', seoTitle: 'Rachna Innovative - Premium Properties', seoDescription: 'Find your dream property with Rachna Innovative', isActive: true, section: 'home', order: 1, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
  { id: 'page-2', title: 'Featured Properties', slug: 'home-featured', content: '<section>Featured properties carousel...</section>', isActive: true, section: 'home', order: 2, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z' },
  { id: 'page-3', title: 'About Us', slug: 'about', content: '<h1>About Rachna Innovative</h1><p>We are a leading...</p>', seoTitle: 'About Us - Rachna Innovative', seoDescription: 'Learn more about Rachna Innovative', isActive: true, section: 'about', order: 1, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'page-4', title: 'Privacy Policy', slug: 'privacy-policy', content: '<h1>Privacy Policy</h1><p>Your privacy is important...</p>', isActive: true, section: 'policies', order: 1, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-01T10:00:00Z' },
  { id: 'page-5', title: 'Testimonials Section', slug: 'home-testimonials', content: '<section>Customer testimonials...</section>', isActive: false, section: 'home', order: 3, createdAt: '2024-01-01T10:00:00Z', updatedAt: '2024-01-05T10:00:00Z' },
];

// Mock Video Call Requests
export const mockVideoCallRequests = [
  { id: 'vcr-1', buyerId: 'b1', buyerName: 'Arun Mehta', buyerEmail: 'arun@email.com', sellerId: '2', sellerName: 'Priya Sharma', sellerCompany: 'Golden Estates', reason: 'Interested in the 3BHK apartment in South Delhi', status: 'pending', createdAt: '2024-01-20T09:00:00Z' },
  { id: 'vcr-2', buyerId: 'b2', buyerName: 'Sneha Reddy', buyerEmail: 'sneha@email.com', sellerId: '4', sellerName: 'Neha Gupta', sellerCompany: 'Metro Homes', reason: 'Want to discuss commercial property options', status: 'pending', createdAt: '2024-01-20T11:00:00Z' },
];

// Mock Meetings
export const mockMeetings = [
  { id: 'm1', title: 'Property Discussion - 3BHK Villa', buyerId: 'b1', buyerName: 'Arun Mehta', sellerId: '2', sellerName: 'Priya Sharma', adminId: '1', scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), duration: 30, status: 'scheduled', meetingLink: 'https://meet.rachna.com/abc123', createdAt: '2024-01-19T10:00:00Z', updatedAt: '2024-01-19T10:00:00Z' },
  { id: 'm2', title: 'Commercial Property Tour', buyerId: 'b2', buyerName: 'Sneha Reddy', sellerId: '4', sellerName: 'Neha Gupta', adminId: '1', scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), duration: 45, status: 'scheduled', meetingLink: 'https://meet.rachna.com/def456', createdAt: '2024-01-18T14:00:00Z', updatedAt: '2024-01-18T14:00:00Z' },
  { id: 'm3', title: 'Residential Property Inquiry', buyerId: 'b3', buyerName: 'Karan Joshi', sellerId: '2', sellerName: 'Priya Sharma', adminId: '1', scheduledAt: '2024-01-15T10:00:00Z', duration: 30, status: 'completed', notes: [ { id: 'n1', meetingId: 'm3', authorId: '1', authorName: 'Admin', content: 'Buyer showed strong interest in the 2BHK flat. Following up next week.', isInternal: true, createdAt: '2024-01-15T10:35:00Z' } ], createdAt: '2024-01-14T09:00:00Z', updatedAt: '2024-01-15T10:35:00Z' },
];

// Mock Blog Posts
export const mockBlogPosts = [
  {
    id: 'blog-1',
    title: 'Top 10 Tips for First-Time Home Buyers in 2024',
    slug: 'top-10-tips-first-time-home-buyers-2024',
    content: '<p>Buying your first home is an exciting milestone...</p>',
    excerpt: 'Essential tips every first-time home buyer should know before making their purchase.',
    featuredImage: '/placeholder.svg',
    authorId: '1',
    authorName: 'Admin User',
    status: 'published',
    category: 'Buying Guide',
    tags: ['first-time-buyer', 'tips', '2024'],
    seoTitle: 'First-Time Home Buyer Tips 2024 | Rachna Innovative',
    seoDescription: 'Discover the top 10 essential tips for first-time home buyers in India.',
    isFeatured: true,
    publishedAt: '2024-01-10T09:00:00Z',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
  },
  {
    id: 'blog-2',
    title: 'Understanding Property Registration Process',
    slug: 'understanding-property-registration-process',
    content: '<p>Property registration is a crucial step...</p>',
    authorId: '1',
    authorName: 'Admin User',
    status: 'draft',
    category: 'Legal',
    isFeatured: false,
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-01-18T11:00:00Z',
  },
  {
    id: 'blog-3',
    title: 'Investment Opportunities in Commercial Real Estate',
    slug: 'investment-opportunities-commercial-real-estate',
    content: '<p>Commercial real estate offers unique investment...</p>',
    excerpt: 'Explore lucrative investment opportunities in the commercial real estate sector.',
    authorId: '1',
    authorName: 'Admin User',
    status: 'pending_approval',
    category: 'Investment',
    tags: ['commercial', 'investment'],
    isFeatured: false,
    createdAt: '2024-01-19T16:00:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
  },
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 'notif-1',
    userId: '1',
    title: 'New Seller Registration',
    message: 'Premium Properties Ltd has registered and is pending verification.',
    type: 'info',
    isRead: false,
    link: '/admin/sellers',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'notif-2',
    userId: '1',
    title: 'Meeting Scheduled',
    message: 'Video call scheduled between Arun Mehta and Golden Estates.',
    type: 'success',
    isRead: true,
    link: '/admin/meetings',
    createdAt: '2024-01-19T14:00:00Z',
  },
  {
    id: 'notif-3',
    userId: '1',
    title: 'Review Flagged',
    message: 'A review has been flagged for inappropriate content.',
    type: 'warning',
    isRead: false,
    link: '/admin/reviews',
    createdAt: '2024-01-20T08:30:00Z',
  },
  {
    id: 'notif-4',
    userId: '1',
    title: 'Transaction Failed',
    message: 'Transaction txn-3 has failed and needs attention.',
    type: 'error',
    isRead: false,
    link: '/admin/transactions',
    createdAt: '2024-01-19T09:05:00Z',
  },
];

// Mock Audit Logs
export const mockAuditLogs = [
  {
    id: 'audit-1',
    userId: '1',
    userName: 'Admin User',
    action: 'APPROVE_SELLER',
    resource: 'seller',
    resourceId: '2',
    details: { sellerName: 'Golden Estates' },
    ipAddress: '192.168.1.100',
    createdAt: '2024-01-12T14:00:00Z',
  },
  {
    id: 'audit-2',
    userId: '1',
    userName: 'Admin User',
    action: 'SCHEDULE_MEETING',
    resource: 'meeting',
    resourceId: 'm1',
    details: { buyer: 'Arun Mehta', seller: 'Priya Sharma' },
    ipAddress: '192.168.1.100',
    createdAt: '2024-01-19T10:00:00Z',
  },
  {
    id: 'audit-3',
    userId: '1',
    userName: 'Admin User',
    action: 'APPROVE_REVIEW',
    resource: 'review',
    resourceId: 'rev-1',
    details: { rating: 5 },
    ipAddress: '192.168.1.100',
    createdAt: '2024-01-16T12:00:00Z',
  },
];

// Mock Analytics
export const mockAnalytics = {
  totalSellers: 5,
  verifiedSellers: 2,
  pendingSellers: 2,
  rejectedSellers: 1,
  totalBuyers: 3,
  totalMeetings: 12,
  scheduledMeetings: 2,
  completedMeetings: 8,
  cancelledMeetings: 2,
  avgCallDuration: 28,
  totalTransactions: 5,
  totalRevenue: 1075000,
  topSellers: [
    { id: '2', name: 'Golden Estates', meetingCount: 5 },
    { id: '4', name: 'Metro Homes', meetingCount: 3 },
  ],
  conversionRate: 67,
};
