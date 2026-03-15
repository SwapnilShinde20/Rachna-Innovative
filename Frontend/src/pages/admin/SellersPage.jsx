import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from "date-fns";
import {
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  FileText,
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Download,
  RefreshCw,
  User,
  Shield,
  Clock,
  ExternalLink,
} from "lucide-react";

import api from '../../lib/api';
import { DashboardHeader } from "../../components/admin/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/admin/ui/card";
import { Badge } from "../../components/admin/ui/badge";
import { Button } from "../../components/admin/ui/button";
import { Input } from "../../components/admin/ui/input";
import { Textarea } from "../../components/admin/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/admin/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/admin/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/admin/ui/dialog";

const statusConfig = {
  submitted: { label: "Submitted", variant: "secondary" },
  under_review: { label: "Under Review", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  suspended: { label: "Suspended", variant: "destructive" },
};

const stepLabels = {
  business_info: "Business Info",
  documents: "Documents",
  contact_verification: "Contact Verification",
};

export default function SellersPage() {
  const { status } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState("business_info");

  // ── Fetch sellers ──
  const { data: sellers = [], isLoading } = useQuery({
    queryKey: ['sellers'],
    queryFn: async () => {
      const { data } = await api.get('/sellers');
      return data.map(seller => ({
          ...seller,
          id: seller._id,
          currentStep: 'business_info',
          createdAt: seller.createdAt || new Date().toISOString()
      }));
    }
  });

  // ── Status update mutation ──
  const statusMutation = useMutation({
    mutationFn: async ({ id, status, reason }) => {
      const { data } = await api.put(`/sellers/${id}/status`, { status, reason });
      return data;
    },
    onSuccess: (updatedSeller) => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
      // If we have the detail dialog open, update the selected seller in-place
      if (selectedSeller && selectedSeller._id === updatedSeller._id) {
        setSelectedSeller({ ...updatedSeller, id: updatedSeller._id, currentStep: 'business_info' });
      }
    },
  });

  // ── Filtering logic ──
  const getStatusFilter = () => {
    switch (status) {
      case "pending": return "submitted";
      case "review": return "under_review";
      case "approved": return "approved";
      case "rejected": return "rejected";
      default: return undefined;
    }
  };

  const statusFilter = getStatusFilter();

  const filteredSellers = sellers.filter((seller) => {
    const matchesStatus = statusFilter ? seller.status === statusFilter : true;
    const matchesSearch =
      (seller.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (seller.contactName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (seller.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getPageTitle = () => {
    switch (status) {
      case "pending": return "Pending Sellers";
      case "review": return "Under Review";
      case "approved": return "Approved Sellers";
      case "rejected": return "Rejected Sellers";
      default: return "All Sellers";
    }
  };

  // ── Action handlers ──
  const handleViewSeller = (seller) => {
    setSelectedSeller(seller);
    setActiveTab("business_info");
    setIsViewOpen(true);
  };

  const handleApproveSeller = (seller) => {
    statusMutation.mutate({ id: seller._id, status: 'approved', reason: 'Seller approved by admin' });
  };

  const handleOpenReject = (seller) => {
    setSelectedSeller(seller);
    setRejectionReason("");
    setIsRejectOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedSeller) return;
    statusMutation.mutate(
      { id: selectedSeller._id, status: 'rejected', reason: rejectionReason || 'Rejected by admin' },
      {
        onSuccess: () => {
          setIsRejectOpen(false);
          setIsViewOpen(false);
          setRejectionReason("");
        }
      }
    );
  };

  const handleSuspendSeller = (seller) => {
    statusMutation.mutate({ id: seller._id, status: 'suspended', reason: 'Seller suspended by admin' });
  };

  const handleReactivateSeller = (seller) => {
    statusMutation.mutate({ id: seller._id, status: 'approved', reason: 'Seller reactivated by admin' });
  };

  return (
    <div>
      <DashboardHeader
        title={getPageTitle()}
        subtitle="Manage seller registrations and verifications"
      />
      <div className="p-6 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          value={sellers.length}
          label="Total Sellers"
          onClick={() => navigate("/admin/sellers")}
        />
        <StatCard
          value={
            sellers.filter(
              (s) => s.status === "submitted" || s.status === "under_review"
            ).length
          }
          label="Pending Review"
          onClick={() => navigate("/admin/sellers/pending")}
        />
        <StatCard
          value={sellers.filter((s) => s.status === "approved").length}
          label="Approved"
          onClick={() => navigate("/admin/sellers/approved")}
        />
        <StatCard
          value={sellers.filter((s) => s.status === "rejected").length}
          label="Rejected"
          onClick={() => navigate("/admin/sellers/rejected")}
        />
      </div>

      {/* Sellers Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sellers List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
              <Input
                className="pl-9"
                placeholder="Search sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading sellers...
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sellers found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSellers.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell className="font-medium">{seller.companyName}</TableCell>
                    <TableCell>{seller.contactName}</TableCell>
                    <TableCell>{seller.email}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[seller.status]?.variant || 'outline'}>
                        {statusConfig[seller.status]?.label || seller.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{stepLabels[seller.currentStep] || seller.currentStep}</TableCell>
                    <TableCell>
                      {format(new Date(seller.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewSeller(seller)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(seller.status === 'submitted' || seller.status === 'under_review') && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApproveSeller(seller)}
                              disabled={statusMutation.isPending}
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleOpenReject(seller)}
                              disabled={statusMutation.isPending}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {seller.status === 'approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-orange-500 hover:text-orange-600"
                            onClick={() => handleSuspendSeller(seller)}
                            disabled={statusMutation.isPending}
                            title="Suspend"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                        {seller.status === 'suspended' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleReactivateSeller(seller)}
                            disabled={statusMutation.isPending}
                            title="Reactivate"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ────────── Seller Detail Dialog ────────── */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedSeller?.companyName}
            </DialogTitle>
            <DialogDescription>
              Seller registration details and verification
            </DialogDescription>
          </DialogHeader>

          {selectedSeller && (
            <>
              {/* Status badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">Current Status:</span>
                <Badge variant={statusConfig[selectedSeller.status]?.variant || 'outline'}>
                  {statusConfig[selectedSeller.status]?.label || selectedSeller.status}
                </Badge>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full">
                  <TabsTrigger value="business_info" className="flex-1">Business Info</TabsTrigger>
                  <TabsTrigger value="documents" className="flex-1">Documents</TabsTrigger>
                  <TabsTrigger value="remarks" className="flex-1">Remarks</TabsTrigger>
                </TabsList>

                {/* ── Business Info Tab ── */}
                <TabsContent value="business_info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField icon={<Building2 className="h-4 w-4" />} label="Company Name" value={selectedSeller.companyName} />
                    <InfoField icon={<User className="h-4 w-4" />} label="Contact Person" value={selectedSeller.contactName} />
                    <InfoField icon={<Mail className="h-4 w-4" />} label="Email" value={selectedSeller.email} />
                    <InfoField icon={<Phone className="h-4 w-4" />} label="Phone" value={selectedSeller.phone} />
                    <InfoField icon={<MapPin className="h-4 w-4" />} label="Address" value={selectedSeller.address} />
                    <InfoField icon={<Shield className="h-4 w-4" />} label="GST Number" value={selectedSeller.gstNumber} />
                    <InfoField icon={<FileText className="h-4 w-4" />} label="License Number" value={selectedSeller.licenseNumber} />
                    <InfoField icon={<Calendar className="h-4 w-4" />} label="Years of Experience" value={selectedSeller.yearsExperience ? `${selectedSeller.yearsExperience} years` : undefined} />
                  </div>
                  <InfoField
                    icon={<Calendar className="h-4 w-4" />}
                    label="Registered On"
                    value={format(new Date(selectedSeller.createdAt), "PPP")}
                  />
                </TabsContent>

                {/* ── Documents Tab ── */}
                <TabsContent value="documents" className="mt-4">
                  {selectedSeller.documents && selectedSeller.documents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSeller.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{doc.name || `Document ${index + 1}`}</p>
                              <p className="text-xs text-muted-foreground">{doc.type || 'Unknown type'}</p>
                            </div>
                          </div>
                          {doc.url && (
                            <Button size="sm" variant="outline" onClick={() => window.open(doc.url, '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No documents uploaded
                    </div>
                  )}
                </TabsContent>

                {/* ── Remarks Tab ── */}
                <TabsContent value="remarks" className="mt-4">
                  {selectedSeller.verificationRemarks && selectedSeller.verificationRemarks.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSeller.verificationRemarks.slice().reverse().map((remark, index) => (
                        <div key={index} className="p-3 border rounded-lg space-y-1">
                          <div className="flex items-center justify-between">
                            <Badge variant={statusConfig[remark.status]?.variant || 'outline'} className="text-xs">
                              {statusConfig[remark.status]?.label || remark.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {remark.reviewedAt ? format(new Date(remark.reviewedAt), "MMM dd, yyyy HH:mm") : 'N/A'}
                            </span>
                          </div>
                          <p className="text-sm">{remark.remark}</p>
                          <p className="text-xs text-muted-foreground">By: {remark.reviewedBy || 'System'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      No verification remarks yet
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* ── Dialog Action Buttons ── */}
              <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                {(selectedSeller.status === 'submitted' || selectedSeller.status === 'under_review') && (
                  <>
                    <Button
                      onClick={() => handleApproveSeller(selectedSeller)}
                      disabled={statusMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Seller
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleOpenReject(selectedSeller)}
                      disabled={statusMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Seller
                    </Button>
                  </>
                )}
                {selectedSeller.status === 'approved' && (
                  <Button
                    variant="outline"
                    className="text-orange-500 border-orange-500 hover:bg-orange-50"
                    onClick={() => handleSuspendSeller(selectedSeller)}
                    disabled={statusMutation.isPending}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend Seller
                  </Button>
                )}
                {selectedSeller.status === 'suspended' && (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleReactivateSeller(selectedSeller)}
                    disabled={statusMutation.isPending}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reactivate Seller
                  </Button>
                )}
                {selectedSeller.status === 'rejected' && (
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveSeller(selectedSeller)}
                    disabled={statusMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Re-approve Seller
                  </Button>
                )}
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ────────── Reject Dialog ────────── */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Seller</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {selectedSeller?.companyName}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Enter the reason for rejection..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? 'Rejecting...' : 'Reject Seller'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}

/* ── Helper Components ── */

function StatCard({ value, label, onClick }) {
  return (
    <Card
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={onClick}
    >
      <CardContent className="pt-4">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}

function InfoField({ icon, label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium">{value || <span className="text-muted-foreground italic">Not provided</span>}</p>
    </div>
  );
}
