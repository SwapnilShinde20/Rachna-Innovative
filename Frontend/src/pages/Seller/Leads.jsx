import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  MessageSquare,
  Phone,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDistanceToNow, format } from "date-fns";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";



const statusStyles = {
  new: { label: "New", variant: "new" },
  contacted: { label: "Contacted", variant: "warning" },
  closed: { label: "Closed", variant: "success" },
};

export default function Leads() {
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['seller-leads'],
    queryFn: async () => {
      const { data } = await api.get('/sellers/me/leads');
      return data;
    }
  });

  const filteredLeads =
    statusFilter === "all"
      ? leads
      : leads.filter((l) => l.status === statusFilter);

  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">
            {leads.length} total leads • {newLeadsCount} new inquiries
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Leads</p>
              <p className="text-2xl font-semibold">{leads.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contacted</p>
              <p className="text-2xl font-semibold">
                {leads.filter((l) => l.status === "contacted").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Closed</p>
              <p className="text-2xl font-semibold">
                {leads.filter((l) => l.status === "closed").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>All Leads</CardTitle>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="w-full pl-9 sm:w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-muted-foreground">
                No leads found matching your criteria.
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredLeads.map((lead, index) => {
                  const status = statusStyles[lead.status] || statusStyles.new;

                  return (
                    <TableRow
                      key={lead._id}
                      className="group"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={lead.buyerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.buyerName)}&background=random`}
                            alt={lead.buyerName}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{lead.buyerName}</p>
                            <p className="text-sm text-muted-foreground">
                              {/* Displaying static email since lead model doesn't explicitly track buyer email yet */}
                              Inquired User
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>{lead.propertyName}</TableCell>
                      <TableCell>{format(new Date(lead.createdAt), 'MMM d, yyyy')}</TableCell>
                      <TableCell>Direct</TableCell>

                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MessageSquare className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Send Message</DropdownMenuItem>
                              <DropdownMenuItem>Call</DropdownMenuItem>
                              <DropdownMenuItem>
                                Mark as Closed
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
