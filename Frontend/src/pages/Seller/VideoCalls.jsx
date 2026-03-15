import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  Video, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Link2,
  User,
  Building,
  Search,
  Play,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';

const statusConfig = {
  requested: { label: 'Pending', variant: 'secondary' },
  scheduled: { label: 'Scheduled', variant: 'default' },
  ongoing: { label: 'Ongoing', variant: 'default' },
  cancelled: { label: 'Rejected', variant: 'destructive' },
};

const meetingStatusConfig = {
  requested: { label: 'Requested', variant: 'secondary' },
  scheduled: { label: 'Scheduled', variant: 'default' },
  ongoing: { label: 'Ongoing', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'outline' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
  missed: { label: 'Missed', variant: 'destructive' },
};

const generateZoomLink = () => `https://zoom.us/j/${Math.floor(Math.random() * 10000000000)}`;

export default function VideoCalls() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: meetings = [] } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => { const res = await api.get('/data/meetings'); return res.data; },
    refetchInterval: 10000, // Auto-refresh every 10s for live status updates
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['seller-transactions'],
    queryFn: async () => {
      const { data } = await api.get('/data/transactions');
      return data;
    },
  });

  const videoCallRequests = meetings.filter(m => m.status === 'scheduled' || m.status === 'requested');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedDuration, setSelectedDuration] = useState('30');

  const updateMeetingMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await api.put(`/data/meetings/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['meetings']);
    }
  });

  const filteredRequests = videoCallRequests.filter((request) => {
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesSearch =
      (request.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.sellerName || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleScheduleMeeting = (request) => {
    setSelectedRequest(request);
    setIsScheduleOpen(true);
  };

  const handleConfirmSchedule = () => {
    if (selectedRequest && selectedDate && selectedTime) {
      const timeParts = selectedTime.split(':');
      const finalDateTime = new Date(selectedDate);
      finalDateTime.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), 0, 0);

      const meetingLink = generateZoomLink();

      updateMeetingMutation.mutate({
        id: selectedRequest._id,
        data: {
          scheduledAt: finalDateTime,
          duration: parseInt(selectedDuration, 10),
          status: 'scheduled',
          meetingLink: meetingLink,
        }
      });

      setIsScheduleOpen(false);
      setSelectedRequest(null);
    }
  };

  const handleRejectRequest = (request) => {
    updateMeetingMutation.mutate({
      id: request._id,
      data: {
        status: 'cancelled',
      }
    });
  };

  const handleJoinCall = (meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  };

  const completedMeetings = meetings.filter(m => m.status === 'completed');
  const avgDuration = completedMeetings.length > 0
    ? Math.round(completedMeetings.reduce((acc, m) => acc + (m.duration || 0), 0) / completedMeetings.length)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Video Calls</h1>
          <p className="text-sm text-muted-foreground">Manage your scheduled property tours</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="animate-slide-up">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">{videoCallRequests.filter(r => r.status === 'scheduled').length}</div>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{meetings.filter(m => m.status === 'scheduled').length}</div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedMeetings.length}</div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <div className="text-2xl font-bold">{avgDuration} min</div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call Requests & Schedule */}
      <Card className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">Upcoming Schedules & Requests</CardTitle>
            <div className="flex items-center gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="requested">Pending</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="cancelled">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Buyer</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No video call schedules found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{request.buyerName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{request.title}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[request.status]?.variant || 'outline'}>
                        {statusConfig[request.status]?.label || request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.scheduledAt 
                        ? format(new Date(request.scheduledAt), 'MMM dd, yyyy HH:mm') 
                        : format(new Date(request.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === 'requested' && (
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" onClick={() => handleScheduleMeeting(request)}>
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleRejectRequest(request)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      {request.status === 'scheduled' && (() => {
                        const mtgTxn = transactions.find(t => t.meetingId === request._id);
                        const isPaid = mtgTxn ? mtgTxn.status === 'completed' : true; // Assume paid if no txn found (legacy)
                        
                        return (
                          <div className="flex items-center justify-end gap-2">
                            {!isPaid ? (
                              <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200 py-1.5 px-3">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                Awaiting Buyer Payment
                              </Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => handleJoinCall(request.meetingLink)}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Join
                              </Button>
                            )}
                          </div>
                        );
                      })()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Call Logs */}
      <Card className="animate-slide-up" style={{ animationDelay: "250ms" }}>
        <CardHeader>
          <CardTitle className="text-lg">Call Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meeting</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting._id}>
                  <TableCell className="font-medium max-w-xs truncate">{meeting.title}</TableCell>
                  <TableCell>
                    {meeting.buyerName}
                  </TableCell>
                  <TableCell>{meeting.duration || 0} min</TableCell>
                  <TableCell>
                    <Badge variant={meetingStatusConfig[meeting.status]?.variant || 'outline'}>
                      {meetingStatusConfig[meeting.status]?.label || meeting.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{meeting.scheduledAt ? format(new Date(meeting.scheduledAt), 'MMM dd, yyyy HH:mm') : 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {meeting.status === 'scheduled' && (() => {
                        const mtgTxn = transactions.find(t => t.meetingId === meeting._id);
                        const isPaid = mtgTxn ? mtgTxn.status === 'completed' : true;

                        return (
                          <>
                            {!isPaid ? (
                              <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                                Awaiting Payment
                              </Badge>
                            ) : (
                              <Button 
                                size="sm" 
                                onClick={() => handleJoinCall(meeting.meetingLink)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Join
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => {
                              navigator.clipboard.writeText(meeting.meetingLink);
                            }}>
                              <Link2 className="h-4 w-4" />
                            </Button>
                          </>
                        );
                      })()}
                      {meeting.notes && meeting.notes.length > 0 && (
                        <Button size="sm" variant="ghost">
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Schedule Meeting Dialog */}
      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Video Call</DialogTitle>
            <DialogDescription>
              Set up a meeting with {selectedRequest?.buyerName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !selectedDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Time</label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 19 }, (_, i) => i + 6).map((hour) => (
                      <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                        {`${hour.toString().padStart(2, '0')}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmSchedule}>
              <Video className="h-4 w-4 mr-2" />
              Schedule Meeting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
