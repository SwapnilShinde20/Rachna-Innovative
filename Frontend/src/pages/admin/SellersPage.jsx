import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardHeader } from "../../components/admin/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/admin/ui/card";
import { Badge } from "../../components/admin/ui/badge";
import { Button } from "../../components/admin/ui/button";
import { Input } from "../../components/admin/ui/input";
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
import { Textarea } from "../../components/admin/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/admin/ui/tabs";
import { mockSellers } from "../../data/mockData";
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
} from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  submitted: { label: "Submitted", variant: "secondary" },
  under_review: { label: "Under Review", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

const stepLabels = {
  business_info: "Business Info",
  documents: "Documents",
  contact_verification: "Contact Verification",
};

export default function SellersPage() {
  const { status } = useParams();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeStep, setActiveStep] = useState("business_info");

  const getStatusFilter = () => {
    switch (status) {
      case "pending":
        return "submitted";
      case "review":
        return "under_review";
      case "approved":
        return "approved";
      case "rejected":
        return "rejected";
      default:
        return undefined;
    }
  };

  const statusFilter = getStatusFilter();

  const filteredSellers = mockSellers.filter((seller) => {
    const matchesStatus = statusFilter ? seller.status === statusFilter : true;
    const matchesSearch =
      seller.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getPageTitle = () => {
    switch (status) {
      case "pending":
        return "Pending Sellers";
      case "review":
        return "Under Review";
      case "approved":
        return "Approved Sellers";
      case "rejected":
        return "Rejected Sellers";
      default:
        return "All Sellers";
    }
  };

  const handleViewSeller = (seller) => {
    setSelectedSeller(seller);
    setActiveStep(seller.currentStep);
    setIsViewOpen(true);
  };

  const handleApproveSeller = (seller) => {
    console.log("Approving seller:", seller.id);
    setIsViewOpen(false);
  };

  const handleRejectSeller = () => {
    if (!selectedSeller) return;
    console.log(
      "Rejecting seller:",
      selectedSeller.id,
      "Reason:",
      rejectionReason
    );
    setIsRejectOpen(false);
    setIsViewOpen(false);
    setRejectionReason("");
  };

  const handleSuspendSeller = (seller) => {
    console.log("Suspending seller:", seller.id);
  };

  const steps = ["business_info", "documents", "contact_verification"];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title={getPageTitle()}
        subtitle="Manage seller registrations and verifications"
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          value={mockSellers.length}
          label="Total Sellers"
          onClick={() => navigate("/admin/sellers")}
        />
        <StatCard
          value={
            mockSellers.filter(
              (s) => s.status === "submitted" || s.status === "under_review"
            ).length
          }
          label="Pending Review"
          onClick={() => navigate("/admin/sellers/pending")}
        />
        <StatCard
          value={mockSellers.filter((s) => s.status === "approved").length}
          label="Approved"
          onClick={() => navigate("/admin/sellers/approved")}
        />
        <StatCard
          value={mockSellers.filter((s) => s.status === "rejected").length}
          label="Rejected"
          onClick={() => navigate("/admin/sellers/rejected")}
        />
      </div>

      {/* Table */}
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
                  <TableCell>{seller.companyName}</TableCell>
                  <TableCell>{seller.contactName}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[seller.status].variant}>
                      {statusConfig[seller.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{stepLabels[seller.currentStep]}</TableCell>
                  <TableCell>
                    {format(new Date(seller.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewSeller(seller)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Seller</DialogTitle>
            <DialogDescription>
              Provide a reason for rejection
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectSeller}>
              Reject Seller
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* Helper */
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
