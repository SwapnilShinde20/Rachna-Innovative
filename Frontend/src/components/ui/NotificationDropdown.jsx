import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, Trash2, CheckCircle, Info, AlertTriangle, XCircle, CheckCheck } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const typeConfig = {
  info: { icon: Info, color: 'text-blue-500' },
  success: { icon: CheckCircle, color: 'text-emerald-500' },
  warning: { icon: AlertTriangle, color: 'text-yellow-500' },
  error: { icon: XCircle, color: 'text-red-500' },
};

export const NotificationDropdown = ({ userId }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch Notifications
  const { data: fetchedNotifications = [] } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      // In a real app we'd pass userId to filter, but backend /data/notifications might just return all for admins
      // Since we're using the same endpoint, we'll filter them on client side or assume the backend handles it via JWT
      const res = await api.get('/data/notifications');
      return res.data;
    },
    // Poll every 30 seconds for new notifications
    refetchInterval: 30000,
  });

  // Depending on how backend is set up, if the backend returns ALL notifications (because it's an admin endpoint),
  // we need to filter to only show this user's notifications.
  // Assuming the notification model has a 'userId' or 'target' field. If not, it shows all.
  const notifications = fetchedNotifications.filter((n) => {
    // If notification has no specific user attached, or it belongs to this user
    return !n.userId || n.userId === userId || n.user === userId;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.put(`/data/notifications/${id}`, { isRead: true });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/data/notifications/read-all');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/data/notifications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
    }
  });

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative outline-none">
          <Bell className="h-5 w-5 text-neutral-600" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-[380px] p-0 shadow-xl border-neutral-100 rounded-xl overflow-hidden mt-2 z-50">
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-100">
          <h3 className="font-semibold text-sm text-neutral-800">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              className="h-8 text-xs text-brandBlue-600 hover:text-brandBlue-700 hover:bg-brandBlue-50"
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
               <div className="bg-neutral-100 p-3 rounded-full mb-3">
                 <Bell className="h-6 w-6 text-neutral-400" />
               </div>
               <p className="text-sm font-medium text-neutral-600">No notifications yet</p>
               <p className="text-xs text-neutral-400 mt-1">We'll let you know when something happens.</p>
             </div>
          ) : (
            <div className="divide-y divide-neutral-50/50">
              {notifications.map((notification) => {
                const TypeIcon = typeConfig[notification.type]?.icon || Info;
                const iconColor = typeConfig[notification.type]?.color || 'text-neutral-500';

                return (
                  <div
                    key={notification._id}
                    className={`relative p-4 transition-colors hover:bg-neutral-50/80 ${
                      !notification.isRead ? 'bg-brandBlue-50/30' : ''
                    }`}
                  >
                    {!notification.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brandBlue-500 rounded-r" />
                    )}
                    <div className="flex gap-3">
                      <div className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
                        <TypeIcon className="h-[18px] w-[18px]" />
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-8">
                        <p className={`text-sm tracking-tight leading-tight mb-1 ${!notification.isRead ? 'font-semibold text-neutral-900' : 'font-medium text-neutral-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-neutral-500 leading-snug line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] font-medium text-neutral-400 mt-2 uppercase tracking-wider">
                          {format(new Date(notification.createdAt), 'MMM dd, h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="absolute right-3 top-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            markAsReadMutation.mutate(notification._id);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-brandBlue-600 hover:bg-brandBlue-50 rounded-md transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteMutation.mutate(notification._id);
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
