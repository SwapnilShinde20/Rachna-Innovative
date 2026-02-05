import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Eye, Clock, Video, CheckCircle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import DealStatusBadge from "@/components/admin//video-calls/DealStatusBadge";
import { mockVideoCalls } from "@/data/mock-video-calls";
import { DashboardHeader } from "../../components/admin/dashboard/DashboardHeader";

/**
 * Same labels as in types/video-calls
 * (kept identical to preserve UI text)
 */
const DEAL_STATUS_LABELS = {
  open: "Open",
  "in-discussion": "In Discussion",
  negotiation: "Negotiation",
  "deal-closed": "Deal Closed",
  "deal-dropped": "Deal Dropped",
};

export default function CompletedCalls() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCalls = mockVideoCalls.filter((call) => {
    const matchesSearch =
      call.meetingTitle.toLowerCase().includes(search.toLowerCase()) ||
      call.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      call.sellerName.toLowerCase().includes(search.toLowerCase()) ||
      call.propertyReference.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || call.dealStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockVideoCalls.length,
    inDiscussion: mockVideoCalls.filter(
      (c) => c.dealStatus === "in-discussion"
    ).length,
    negotiation: mockVideoCalls.filter(
      (c) => c.dealStatus === "negotiation"
    ).length,
    closed: mockVideoCalls.filter(
      (c) => c.dealStatus === "deal-closed"
    ).length,
  };

  return (
    <div>
            <DashboardHeader title="Completed Video Calls" subtitle="Manage post-call activities and track deal progress" />
      <div className="p-6 space-y-6">
        {/* Header */}
        

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">
                  Total Completed
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-in-discussion/10">
                <Clock className="h-6 w-6 text-status-in-discussion" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.inDiscussion}
                </p>
                <p className="text-sm text-muted-foreground">
                  In Discussion
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-negotiation/10">
                <Clock className="h-6 w-6 text-status-negotiation" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stats.negotiation}
                </p>
                <p className="text-sm text-muted-foreground">
                  In Negotiation
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-deal-closed/10">
                <CheckCircle className="h-6 w-6 text-status-deal-closed" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.closed}</p>
                <p className="text-sm text-muted-foreground">
                  Deals Closed
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters + Table */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>All Completed Calls</CardTitle>
                <CardDescription>
                  Click on any call to view and manage its timeline
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  placeholder="Search calls..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-64"
                />
                <Select
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v)}
                >
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      All Statuses
                    </SelectItem>
                    {Object.entries(DEAL_STATUS_LABELS).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Meeting Title</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Property Ref</TableHead>
                    <TableHead>Call Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Deal Status</TableHead>
                    <TableHead className="text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredCalls.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-12 text-center text-muted-foreground"
                      >
                        No completed calls found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCalls.map((call) => (
                      <TableRow
                        key={call.id}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">
                          {call.meetingTitle}
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {call.buyerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {call.buyerEmail}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {call.sellerName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {call.sellerCompany}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="font-mono text-sm">
                          {call.propertyReference}
                        </TableCell>

                        <TableCell>
                          {format(
                            new Date(call.callDate),
                            "MMM dd, yyyy"
                          )}
                        </TableCell>

                        <TableCell>
                          {call.duration} min
                        </TableCell>

                        <TableCell>
                          <DealStatusBadge
                            status={call.dealStatus}
                          />
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            asChild
                            variant="default"
                            size="sm"
                          >
                            <Link
                              to={`/admin/video-calls/completed/${call.id}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Timeline
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
