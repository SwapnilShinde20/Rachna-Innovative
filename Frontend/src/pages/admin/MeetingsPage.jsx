import { useState } from 'react';
import { DashboardHeader } from '../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/admin/ui/card';
import { Badge } from '../../components/admin/ui/badge';
import { Button } from '../../components/admin/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/admin/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/admin/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/admin/ui/dialog';
import { Textarea } from '../../components/admin/ui/textarea';
import { mockMeetings } from '../../data/mockData';
import {
  Calendar,
  Clock,
  Video,
  Users,
  Edit,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';

/* -------------------- CONFIG -------------------- */

const statusConfig = {
  requested: { label: 'Requested', variant: 'secondary' },
  scheduled: { label: 'Scheduled', variant: 'default' },
  in_progress: { label: 'In Progress', variant: 'default' },
  completed: { label: 'Completed', variant: 'outline' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
  no_show: { label: 'No Show', variant: 'destructive' },
};

/* -------------------- COMPONENT -------------------- */

export default function MeetingsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [newNote, setNewNote] = useState('');

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  /* -------------------- HELPERS -------------------- */

  const getMeetingsForDay = (day) => {
    return mockMeetings.filter((meeting) =>
      isSameDay(new Date(meeting.scheduledAt), day)
    );
  };

  const handleViewDetails = (meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailsOpen(true);
  };

  const handleAddNote = () => {
    console.log('Adding note:', newNote, 'to meeting:', selectedMeeting?.id);
    setIsNotesOpen(false);
    setNewNote('');
  };

  const handleCancelMeeting = (meeting) => {
    console.log('Cancelling meeting:', meeting.id);
    setIsDetailsOpen(false);
  };

  const scheduledMeetings = mockMeetings.filter(
    (m) => m.status === 'scheduled'
  );

  const todayMeetings = mockMeetings.filter((m) =>
    isSameDay(new Date(m.scheduledAt), new Date())
  );

  /* -------------------- RENDER -------------------- */

  return (
  <div>
      <DashboardHeader
        title="Meetings"
        subtitle="Manage and schedule buyer-seller meetings"
      />
      <div className="p-6 space-y-6">

      {/* -------------------- STATS -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mockMeetings.length}</div>
                <p className="text-sm text-muted-foreground">Total Meetings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <div className="text-2xl font-bold">{scheduledMeetings.length}</div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Video className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todayMeetings.length}</div>
                <p className="text-sm text-muted-foreground">
                  Today&apos;s Meetings
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {mockMeetings.filter((m) => m.status === 'completed').length}
                </div>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* -------------------- TABS -------------------- */}
      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        {/* -------------------- CALENDAR VIEW -------------------- */}
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">
                {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}

                {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-24" />
                ))}

                {daysInMonth.map((day) => {
                  const dayMeetings = getMeetingsForDay(day);
                  const isToday = isSameDay(day, new Date());

                  return (
                    <div
                      key={day.toISOString()}
                      className={`h-24 border rounded-lg p-1 ${
                        isToday
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          isToday ? 'text-primary' : ''
                        }`}
                      >
                        {format(day, 'd')}
                      </div>

                      <div className="space-y-0.5 overflow-hidden">
                        {dayMeetings.slice(0, 2).map((meeting) => (
                          <div
                            key={meeting.id}
                            onClick={() => handleViewDetails(meeting)}
                            className="text-xs p-1 rounded bg-primary/10 text-primary truncate cursor-pointer hover:bg-primary/20"
                          >
                            {format(
                              new Date(meeting.scheduledAt),
                              'HH:mm'
                            )}{' '}
                            - {meeting.buyerName}
                          </div>
                        ))}
                        {dayMeetings.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{dayMeetings.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* -------------------- TABLE VIEW -------------------- */}
        <TabsContent value="table" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Meeting</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {mockMeetings.map((meeting) => (
                    <TableRow key={meeting.id}>
                      <TableCell className="font-medium">
                        {meeting.title}
                      </TableCell>
                      <TableCell>{meeting.buyerName}</TableCell>
                      <TableCell>{meeting.sellerName}</TableCell>
                      <TableCell>
                        {format(
                          new Date(meeting.scheduledAt),
                          'MMM dd, yyyy HH:mm'
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={statusConfig[meeting.status].variant}
                        >
                          {statusConfig[meeting.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(meeting)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {meeting.status === 'scheduled' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => handleCancelMeeting(meeting)}
                            >
                              <X className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>

      {/* -------------------- DETAILS DIALOG -------------------- */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedMeeting?.title}</DialogTitle>
            <DialogDescription>
              Meeting details and actions
            </DialogDescription>
          </DialogHeader>

          {selectedMeeting && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Buyer</p>
                  <p className="font-medium">
                    {selectedMeeting.buyerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <p className="font-medium">
                    {selectedMeeting.sellerName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {format(
                      new Date(selectedMeeting.scheduledAt),
                      'PPP p'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {selectedMeeting.duration} minutes
                  </p>
                </div>
              </div>

              <Badge
                variant={statusConfig[selectedMeeting.status].variant}
              >
                {statusConfig[selectedMeeting.status].label}
              </Badge>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNotesOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Add Note
            </Button>

            {selectedMeeting?.status === 'scheduled' && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() => handleCancelMeeting(selectedMeeting)}
                >
                  Cancel Meeting
                </Button>
                <Button>
                  <Video className="h-4 w-4 mr-2" />
                  Join Call
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------------------- NOTES DIALOG -------------------- */}
      <Dialog open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Meeting Note</DialogTitle>
            <DialogDescription>
              Add internal notes for this meeting
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your notes..."
            rows={4}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNotesOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={!newNote.trim()}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
  );
}
