import { useState } from 'react';
import { DashboardHeader } from '../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/admin/ui/card';
import { Button } from '../../components/admin/ui/button';
import { Badge } from '../../components/admin/ui/badge';
import { Input } from '../../components/admin/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/admin/ui/select';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/admin/ui/alert-dialog';

import {
  Search,
  Eye,
  UserCheck,
  UserX,
  Ban,
  Users,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  Calendar,
  Shield,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';

export default function UsersPage() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users');
      return data.map(user => ({
        ...user,
        id: user._id,
        status: user.status || 'active',
        createdAt: user.createdAt || new Date().toISOString(),
      }));
    },
  });

  // ── Status update mutation (uses admin endpoint) ──
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await api.put(`/admin/users/${id}`, { status });
      return data;
    },
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      // Update selected user if detail dialog is open
      if (selectedUser && selectedUser._id === updatedUser._id) {
        setSelectedUser({ ...updatedUser, id: updatedUser._id, status: updatedUser.status });
      }
    },
  });

  // ── Delete mutation ──
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowDetails(false);
      setSelectedUser(null);
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // ── Filtering ──
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: users.length,
    buyers: users.filter((u) => u.role === 'buyer').length,
    sellers: users.filter((u) => u.role === 'seller').length,
    active: users.filter((u) => u.status === 'active').length,
  };

  // ── Action handlers ──
  const handleActivateUser = (user) => {
    statusMutation.mutate({ id: user._id, status: 'active' });
  };

  const handleDeactivateUser = (user) => {
    statusMutation.mutate({ id: user._id, status: 'inactive' });
  };

  const handleSuspendUser = (user) => {
    statusMutation.mutate({ id: user._id, status: 'suspended' });
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  // ── Badge helpers ──
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'buyer':
        return <Badge className="bg-info/10 text-info border-info/20">Buyer</Badge>;
      case 'seller':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Seller</Badge>;
      case 'admin':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Admin</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div>
      <DashboardHeader
        title="Users Management"
        subtitle="Manage all buyers and sellers"
      />
      <div className="p-6 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Users className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-lg" />
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <UserPlus className="h-10 w-10 text-info bg-info/10 p-2 rounded-lg" />
            <div>
              <p className="text-sm text-muted-foreground">Buyers</p>
              <p className="text-2xl font-bold">{stats.buyers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <UserMinus className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-lg" />
            <div>
              <p className="text-sm text-muted-foreground">Sellers</p>
              <p className="text-2xl font-bold">{stats.sellers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <UserCheck className="h-10 w-10 text-success bg-success/10 p-2 rounded-lg" />
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="buyer">Buyers</SelectItem>
              <SelectItem value="seller">Sellers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {/* View */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewUser(user)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Activate (for inactive/suspended users, not admins) */}
                        {user.role !== 'admin' && user.status !== 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleActivateUser(user)}
                            disabled={statusMutation.isPending}
                            title="Activate user"
                          >
                            <UserCheck className="h-4 w-4 text-success" />
                          </Button>
                        )}

                        {/* Deactivate (for active users, not admins) */}
                        {user.role !== 'admin' && user.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeactivateUser(user)}
                            disabled={statusMutation.isPending}
                            title="Deactivate user"
                          >
                            <UserX className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}

                        {/* Delete (not admins) */}
                        {user.role !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setUserToDelete(user)}
                            disabled={deleteMutation.isPending}
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* ────────── User Detail Dialog ────────── */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Details
            </DialogTitle>
            <DialogDescription>
              View and manage user account
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <>
              {/* User info grid */}
              <div className="grid grid-cols-2 gap-4">
                <InfoField icon={<Users className="h-4 w-4" />} label="Name" value={selectedUser.name} />
                <InfoField icon={<Mail className="h-4 w-4" />} label="Email" value={selectedUser.email} />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Role</p>
                  {getRoleBadge(selectedUser.role)}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Status</p>
                  {getStatusBadge(selectedUser.status)}
                </div>
                <InfoField icon={<Phone className="h-4 w-4" />} label="Phone" value={selectedUser.phone} />
                <InfoField
                  icon={<Calendar className="h-4 w-4" />}
                  label="Registered"
                  value={format(new Date(selectedUser.createdAt), 'PPP')}
                />
                <InfoField
                  icon={<Shield className="h-4 w-4" />}
                  label="Profile Completed"
                  value={selectedUser.profileCompleted ? 'Yes' : 'No'}
                />
              </div>

              {/* Dialog Action Buttons */}
              {selectedUser.role !== 'admin' && (
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
                  {selectedUser.status !== 'active' && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleActivateUser(selectedUser)}
                      disabled={statusMutation.isPending}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Activate
                    </Button>
                  )}
                  {selectedUser.status === 'active' && (
                    <Button
                      variant="outline"
                      onClick={() => handleDeactivateUser(selectedUser)}
                      disabled={statusMutation.isPending}
                    >
                      <UserX className="h-4 w-4 mr-2" />
                      Deactivate
                    </Button>
                  )}
                  {selectedUser.status !== 'suspended' && (
                    <Button
                      variant="outline"
                      className="text-orange-500 border-orange-500 hover:bg-orange-50"
                      onClick={() => handleSuspendUser(selectedUser)}
                      disabled={statusMutation.isPending}
                    >
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setShowDetails(false);
                      setUserToDelete(selectedUser);
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ────────── Delete Confirmation ────────── */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                deleteMutation.mutate(userToDelete._id);
                setUserToDelete(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
    </div>
  );
}

/* ── Helper ── */
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
