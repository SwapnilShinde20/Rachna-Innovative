// User Roles
export type UserRole = 'admin' | 'seller' | 'buyer';

// Seller Status - Updated flow
export type SellerStatus = 'submitted' | 'under_review' | 'approved' | 'rejected';

// Verification Step
export type VerificationStep = 'business_info' | 'documents' | 'contact_verification';

// Meeting Status
export type MeetingStatus = 'requested' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

// Blog Status
export type BlogStatus = 'draft' | 'pending_approval' | 'published' | 'archived';

// Transaction Status
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Review Status
export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

// User Status
export type UserStatus = 'active' | 'inactive' | 'suspended';

// User
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
}

// Seller Profile
export interface SellerProfile {
  id: string;
  userId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  gstNumber?: string;
  licenseNumber?: string;
  documents: Document[];
  status: SellerStatus;
  currentStep: VerificationStep;
  verificationRemarks?: VerificationRemark[];
  rejectionReason?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Verification Remark
export interface VerificationRemark {
  step: VerificationStep;
  remark: string;
  status: 'pending' | 'approved' | 'needs_revision';
  reviewedAt: string;
  reviewedBy: string;
}

// Document
export interface Document {
  id: string;
  name: string;
  type: 'gst' | 'license' | 'id' | 'other';
  url: string;
  uploadedAt: string;
}

// Buyer Profile
export interface BuyerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: UserStatus;
  createdAt: string;
}

// Transaction
export interface Transaction {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  status: TransactionStatus;
  description?: string;
  createdAt: string;
  completedAt?: string;
}

// Review
export interface Review {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  flagged: boolean;
  flagReason?: string;
  createdAt: string;
  moderatedAt?: string;
  moderatedBy?: string;
}

// Meeting
export interface Meeting {
  id: string;
  title: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  adminId?: string;
  scheduledAt: string;
  duration: number;
  status: MeetingStatus;
  meetingLink?: string;
  notes?: MeetingNote[];
  createdAt: string;
  updatedAt: string;
}

// Meeting Note
export interface MeetingNote {
  id: string;
  meetingId: string;
  authorId: string;
  authorName: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

// Video Call Request
export interface VideoCallRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  sellerCompany: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Blog Post
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  authorId: string;
  authorName: string;
  status: BlogStatus;
  category?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// CMS Page
export interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive: boolean;
  section: 'home' | 'about' | 'contact' | 'policies' | 'other';
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Notification
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// Analytics
export interface PlatformAnalytics {
  totalSellers: number;
  verifiedSellers: number;
  pendingSellers: number;
  rejectedSellers: number;
  totalBuyers: number;
  totalMeetings: number;
  scheduledMeetings: number;
  completedMeetings: number;
  cancelledMeetings: number;
  avgCallDuration: number;
  totalTransactions: number;
  totalRevenue: number;
  topSellers: { id: string; name: string; meetingCount: number }[];
  conversionRate: number;
}
