import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { format } from 'date-fns';
import { Shield, Briefcase, Clock, CheckCircle, XCircle, Loader2, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function ServiceRequestsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('All');

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['admin-service-requests'],
    queryFn: async () => {
      const { data } = await api.get('/service-requests');
      return data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.put(`/service-requests/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      toast.success('Request status updated');
      queryClient.invalidateQueries({ queryKey: ['admin-service-requests'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  });

  const handleStatusUpdate = (id, newStatus) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'All') return true;
    return req.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-700';
      case 'In Progress': return 'bg-blue-100 text-blue-700';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700';
      case 'Rejected': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    if (category === 'Legal') return <Briefcase className="w-5 h-5 text-amber-600" />;
    if (category === 'Security') return <Shield className="w-5 h-5 text-blue-600" />;
    return <FileText className="w-5 h-5 text-gray-600" />;
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Manage incoming legal and security inquiries.</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {['All', 'Pending', 'In Progress', 'Resolved'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
            <CheckCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No requests found</h3>
          <p className="text-gray-500 max-w-sm mt-2">There are currently no {filter.toLowerCase()} service requests in the system.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredRequests.map(req => (
            <div key={req._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Left: Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${req.serviceCategory === 'Legal' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                      {getCategoryIcon(req.serviceCategory)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-gray-900 text-lg">{req.subject}</h3>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(req.status)}`}>
                          {req.status}
                        </span>
                        {req.urgency === 'Urgent' && (
                          <span className="flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                            <AlertCircle size={12} /> Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        {req.requestType} • Submitted on {format(new Date(req.createdAt), 'MMM do, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
                    {req.description}
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Requester</p>
                      <p className="font-medium text-gray-900 text-sm">{req.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Email</p>
                      <a href={`mailto:${req.email}`} className="font-medium text-blue-600 text-sm hover:underline">{req.email}</a>
                    </div>
                    {req.phone && (
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Phone</p>
                        <a href={`tel:${req.phone}`} className="font-medium text-gray-900 text-sm hover:underline">{req.phone}</a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="lg:w-48 flex flex-col gap-2 pt-2 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-6">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Update Status</p>
                  
                  {req.status !== 'In Progress' && (
                    <button 
                      onClick={() => handleStatusUpdate(req._id, 'In Progress')}
                      disabled={updateStatusMutation.isPending}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold transition-colors justify-center"
                    >
                      <Clock size={16} /> Contact To Review
                    </button>
                  )}
                  
                  {req.status !== 'Resolved' && (
                    <button 
                      onClick={() => handleStatusUpdate(req._id, 'Resolved')}
                      disabled={updateStatusMutation.isPending}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold transition-colors justify-center"
                    >
                      <CheckCircle size={16} /> Mark Resolved
                    </button>
                  )}

                  {req.status !== 'Rejected' && (
                    <button 
                      onClick={() => handleStatusUpdate(req._id, 'Rejected')}
                      disabled={updateStatusMutation.isPending}
                      className="w-full flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-sm font-semibold transition-colors justify-center mt-auto"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
