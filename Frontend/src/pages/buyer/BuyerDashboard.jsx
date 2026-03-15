import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Video, Calendar as CalendarIcon, Clock, CheckCircle, Play, Building2, MapPin, AlertCircle, XCircle, Briefcase, FileText } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/api';
import Navbar from '../../components/buyer/Navbar';
import { BuyerSidebar } from '../../components/buyer/BuyerSidebar';
import Profile from './Profile';
import { Menu, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

export default function BuyerDashboard() {
  const { data: meetings = [], isLoading } = useQuery({
    queryKey: ['buyer-meetings'],
    queryFn: async () => {
      const { data } = await api.get('/data/meetings');
      return data;
    },
    refetchInterval: 10000,
  });

  const { data: serviceRequests = [] } = useQuery({
    queryKey: ['buyer-service-requests'],
    queryFn: async () => {
      const { data } = await api.get('/service-requests');
      return data;
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['buyer-transactions'],
    queryFn: async () => {
      const { data } = await api.get('/data/transactions');
      return data;
    },
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [activeItem, setActiveItem] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const payMutation = useMutation({
    mutationFn: async (transactionId) => {
      const { data } = await api.put(`/data/transactions/${transactionId}`, { status: 'completed' });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['buyer-transactions']);
      setPaymentModalOpen(false);
      setSelectedTransaction(null);
      toast({
        title: "Payment Successful",
        description: "Your video tour fee has been paid. You can now join the call.",
      });
    },
    onError: (error) => {
      toast({
        title: "Payment Failed",
        description: error.response?.data?.message || "An error occurred during payment.",
        variant: "destructive",
      });
    }
  });

  const pendingMeetings = meetings.filter(m => m.status === 'requested');
  const scheduledMeetings = meetings.filter(m => m.status === 'scheduled' || m.status === 'ongoing');
  const pastMeetings = meetings.filter(m => ['completed', 'cancelled', 'no_show', 'missed', 'rejected'].includes(m.status));

  const handleJoinCall = (meetingLink) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ongoing':
        return <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Ongoing &bull; Join Now</span>;
      case 'scheduled':
        return <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Scheduled</span>;
      case 'requested':
        return <span className="bg-orange-50 text-orange-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Pending Approval</span>;
      case 'completed':
        return <span className="bg-neutral-100 text-neutral-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Completed</span>;
      case 'missed':
        return <span className="bg-rose-50 text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Missed</span>;
      case 'cancelled':
      case 'rejected':
        return <span className="bg-neutral-100 text-neutral-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">{status}</span>;
    }
  };

  const getServiceStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-orange-50 text-orange-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Pending</span>;
      case 'In Progress':
        return <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">In Progress</span>;
      case 'Resolved':
        return <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Resolved</span>;
      case 'Rejected':
        return <span className="bg-rose-50 text-rose-700 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">Rejected</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">{status}</span>;
    }
  };

  const MeetingCard = ({ meeting, showJoin = false }) => (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-100 flex flex-col transition-all hover:shadow-xl hover:shadow-neutral-200/40 hover:-translate-y-1 duration-300">
      <div className="flex justify-between items-start mb-5">
        {getStatusBadge(meeting.status)}
        <div className="text-[11px] text-neutral-400 font-black uppercase tracking-widest whitespace-nowrap">
          {meeting.duration || 30} MIN
        </div>
      </div>
      
      <h3 className="font-black text-neutral-900 line-clamp-2 mb-4 leading-tight">
        {meeting.title || 'Property Video Tour'}
      </h3>
      
      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center text-sm font-medium text-neutral-600">
          <CalendarIcon size={16} className="mr-3 text-neutral-300" />
          {format(new Date(meeting.scheduledAt), 'EEEE, MMM do, yyyy')}
        </div>
        <div className="flex items-center text-sm font-medium text-neutral-600">
          <Clock size={16} className="mr-3 text-neutral-300" />
          {format(new Date(meeting.scheduledAt), 'h:mm a')}
        </div>
        <div className="flex items-center text-sm font-medium text-neutral-600">
          <Building2 size={16} className="mr-3 text-neutral-300" />
          {meeting.sellerName || 'Private Seller'}
        </div>
      </div>

      {showJoin && meeting.status === 'scheduled' && (() => {
        // Find if there is a pending transaction for this meeting
        const mtgTxn = transactions.find(t => t.meetingId === meeting._id);
        const isPaid = mtgTxn?.status === 'completed';
        const hasPendingFee = mtgTxn?.status === 'pending';

        return (
          <div className="mt-auto pt-5 border-t border-neutral-50 flex flex-col gap-2">
            {hasPendingFee ? (
              <button
                onClick={() => {
                  setSelectedTransaction(mtgTxn);
                  setPaymentModalOpen(true);
                }}
                className="w-full bg-brandBlue-600 hover:bg-brandBlue-700 text-white py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg shadow-brandBlue-100"
              >
                <CreditCard size={16} />
                PAY ₹500 TO JOIN
              </button>
            ) : (
              <button
                onClick={() => handleJoinCall(meeting.meetingLink)}
                disabled={!isPaid && mtgTxn} // Disable if there's a txn but it's not paid (failsafe)
                className={`w-full py-3.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                  isPaid || !mtgTxn // If paid OR if no fee was generated (legacy meetings)
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.98] shadow-emerald-100'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Play size={14} fill="currentColor" />
                JOIN ZOOM CALL
              </button>
            )}
            
            {hasPendingFee && (
              <p className="text-[10px] text-center text-neutral-400 font-medium">Payment required before joining.</p>
            )}
          </div>
        );
      })()}
    </div>
  );

  const renderContent = () => {
    switch (activeItem) {
      case 'overview':
        return (
          <>
            <div className="mb-12">
              <h1 className="text-4xl font-black text-neutral-900 tracking-tight">Your Dashboard</h1>
              <p className="mt-3 text-neutral-500 font-medium max-w-2xl leading-relaxed">
                Welcome back! Monitor your upcoming tours, view past property visits, and stay connected with sellers.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-100 flex items-center gap-6 group hover:border-brandBlue-200 transition-colors cursor-pointer" onClick={() => setActiveItem('tours')}>
                <div className="bg-brandBlue-50 text-brandBlue-600 p-4 rounded-[24px] shadow-sm transform transition-transform group-hover:scale-110">
                  <CalendarIcon size={28} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Scheduled Tours</p>
                  <p className="text-3xl font-black text-neutral-900 mt-1">{scheduledMeetings.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-100 flex items-center gap-6 group hover:border-orange-200 transition-colors cursor-pointer" onClick={() => setActiveItem('pending')}>
                <div className="bg-orange-50 text-orange-600 p-4 rounded-[24px] shadow-sm transform transition-transform group-hover:scale-110">
                  <Clock size={28} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Pending Requests</p>
                  <p className="text-3xl font-black text-neutral-900 mt-1">{pendingMeetings.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-neutral-100 flex items-center gap-6 group hover:border-emerald-200 transition-colors cursor-pointer" onClick={() => setActiveItem('history')}>
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-[24px] shadow-sm transform transition-transform group-hover:scale-110">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">Past History</p>
                  <p className="text-3xl font-black text-neutral-900 mt-1">{pastMeetings.length}</p>
                </div>
              </div>
            </div>

            {/* Quick View - Recent Tours */}
            <div className="space-y-16">
              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-brandBlue-600 rounded-full"></div>
                    Recent Scheduled Tours
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveItem('tours')} className="font-bold">View All</Button>
                </div>
                {scheduledMeetings.length === 0 ? (
                   <p className="text-neutral-400 font-medium italic p-8 bg-white rounded-3xl border border-neutral-50 text-center">No upcoming tours scheduled.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scheduledMeetings.slice(0, 3).map(m => <MeetingCard key={m._id} meeting={m} showJoin={true} />)}
                  </div>
                )}
              </section>

              <section>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-500 rounded-full"></div>
                    Professional Service Inquiries
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => setActiveItem('services')} className="font-bold">View All</Button>
                </div>
                {serviceRequests.length === 0 ? (
                  <p className="text-neutral-400 font-medium italic p-8 bg-white rounded-3xl border border-neutral-50 text-center">No service inquiries yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {serviceRequests.slice(0, 3).map(req => (
                      <div key={req._id} className="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-100 flex flex-col transition-all hover:shadow-xl hover:shadow-neutral-200/40 duration-300">
                        <div className="flex justify-between items-start mb-4">
                          {getServiceStatusBadge(req.status)}
                          <div className="text-[11px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                            {req.serviceCategory === 'Legal' ? <Briefcase size={12}/> : <FileText size={12}/>}
                            {req.serviceCategory}
                          </div>
                        </div>
                        <h3 className="font-black text-neutral-900 line-clamp-1 mb-2">{req.subject}</h3>
                        <p className="text-xs text-neutral-500 line-clamp-2 mb-4">{req.description}</p>
                        <div className="flex items-center text-[10px] font-bold text-neutral-400 mt-auto">
                          <CalendarIcon size={12} className="mr-1.5" />
                          {format(new Date(req.createdAt), 'MMM d, yyyy')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        );

      case 'tours':
        return (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="mb-10">
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Upcoming Tours</h2>
              <p className="text-neutral-500 font-medium mt-2">Confirmed video tours ready to join at the scheduled time.</p>
            </div>
            {scheduledMeetings.length === 0 ? (
              <div className="bg-white rounded-[40px] p-16 text-center border-2 border-dashed border-neutral-100">
                <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-200">
                  <CalendarIcon size={40} />
                </div>
                <h3 className="text-lg font-bold text-neutral-900">No scheduled tours</h3>
                <Link to="/buy" className="mt-8 inline-flex bg-neutral-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-neutral-200/50">
                  Browse Properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {scheduledMeetings.map(meeting => (
                  <MeetingCard key={meeting._id} meeting={meeting} showJoin={true} />
                ))}
              </div>
            )}
          </section>
        );

      case 'pending':
        return (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Pending Requests</h2>
              <p className="text-neutral-500 font-medium mt-2">Requests awaiting approval from the admin or seller.</p>
            </div>
            {pendingMeetings.length === 0 ? (
              <div className="bg-white rounded-[40px] p-12 text-center border border-neutral-100/50 shadow-sm">
                <p className="text-neutral-400 font-medium italic">No pending requests at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pendingMeetings.map(meeting => (
                  <MeetingCard key={meeting._id} meeting={meeting} />
                ))}
              </div>
            )}
          </section>
        );
        
      case 'history':
        return (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Tour History</h2>
              <p className="text-neutral-500 font-medium mt-2">Records of all your completed, missed, or cancelled tours.</p>
            </div>
            {pastMeetings.length === 0 ? (
              <div className="bg-white rounded-[40px] p-12 text-center border border-neutral-100/50 shadow-sm opacity-60">
                <p className="text-neutral-400 font-medium italic">Your tour history is empty.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grayscale-[0.3] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                {pastMeetings.map(meeting => (
                  <MeetingCard key={meeting._id} meeting={meeting} />
                ))}
              </div>
            )}
          </section>
        );

      case 'services':
        return (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight">Professional Services</h2>
              <p className="text-neutral-500 font-medium mt-2">Status of your Legal and Security & Privacy service inquiries.</p>
            </div>
            {serviceRequests.length === 0 ? (
              <div className="bg-white rounded-[40px] p-12 text-center border border-neutral-100/50 shadow-sm opacity-60">
                <p className="text-neutral-400 font-medium italic">You haven't requested any professional services yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceRequests.map(req => (
                  <div key={req._id} className="bg-white rounded-[32px] p-6 shadow-sm border border-neutral-100 flex flex-col transition-all hover:shadow-xl hover:shadow-neutral-200/40 hover:-translate-y-1 duration-300">
                    <div className="flex justify-between items-start mb-5">
                      {getServiceStatusBadge(req.status)}
                      <div className="text-[11px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full flex items-center gap-1">
                        {req.serviceCategory === 'Legal' ? <Briefcase size={12}/> : <FileText size={12}/>}
                        {req.serviceCategory}
                      </div>
                    </div>
                    
                    <h3 className="font-black text-neutral-900 line-clamp-2 mb-4 leading-tight">
                      {req.subject}
                    </h3>
                    
                    <div className="space-y-3 mb-6 flex-1">
                      <div className="text-sm font-medium text-neutral-600 line-clamp-3 leading-relaxed">
                        {req.description}
                      </div>
                      <div className="flex items-center text-xs font-bold text-neutral-400 mt-4">
                        <CalendarIcon size={14} className="mr-2 text-neutral-300" />
                        Submitted: {format(new Date(req.createdAt), 'MMM do, yyyy')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );


      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 flex flex-col lg:flex-row font-inter">
      <BuyerSidebar 
        activeItem={activeItem} 
        onItemClick={(id) => setActiveItem(id)} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300 min-h-screen overflow-hidden">
        <Navbar />

        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl overflow-y-auto">
          {activeItem !== 'overview' && (
             <div className="mb-6 lg:hidden">
                <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(true)} className="flex items-center gap-2">
                   <Menu size={18} />
                   Menu
                </Button>
             </div>
          )}
          {renderContent()}
        </main>
      </div>

      {/* Demo Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              To join this scheduled video tour, a booking fee of ₹500 is required.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 bg-neutral-50 rounded-lg mt-4 mb-4 border border-brandBlue-100">
             <CreditCard className="w-12 h-12 text-brandBlue-500 mb-4" />
             <p className="text-2xl font-black text-neutral-900">₹500</p>
             <p className="text-sm text-neutral-500 font-medium">Video Tour Booking Fee</p>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPaymentModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-brandBlue-600 hover:bg-brandBlue-700 text-white min-w-[120px]"
              onClick={() => payMutation.mutate(selectedTransaction?._id)}
              disabled={payMutation.isPending}
            >
              {payMutation.isPending ? 'Processing...' : 'Simulate Payment'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
