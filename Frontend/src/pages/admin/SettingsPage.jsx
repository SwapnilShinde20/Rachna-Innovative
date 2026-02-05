import { useState } from 'react';
import { DashboardHeader } from '../../components/admin/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/admin/ui/card';
import { Button } from '../../components/admin/ui/button';
import { Input } from '../../components/admin/ui/input';
import { Switch } from '../../components/admin/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/admin/ui/tabs';
import { Separator } from '../../components/admin/ui/separator';
import { useAuthStore } from '../../stores/authStore';
import { 
  User, 
  Lock, 
  Bell, 
  Settings as SettingsIcon,
  Save,
  Mail,
  Phone,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  
  // Profile state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [sellerAlerts, setSellerAlerts] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  
  // System settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newRegistrations, setNewRegistrations] = useState(true);
  const [videoCalls, setVideoCalls] = useState(true);
  const [blogComments, setBlogComments] = useState(true);

  const handleSaveProfile = () => {
    console.log('Saving profile:', { name, email, phone });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Changing password');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveNotifications = () => {
    console.log('Saving notification settings:', {
      emailNotifications,
      meetingReminders,
      sellerAlerts,
      securityAlerts,
    });
  };

  const handleSaveSystem = () => {
    console.log('Saving system settings:', {
      maintenanceMode,
      newRegistrations,
      videoCalls,
      blogComments,
    });
  };

  return (
      <div>
        <DashboardHeader title="Settings" subtitle="Manage your account and system preferences" />

    <div className="p-6 space-y-6">

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="password" className="gap-2">
            <Lock className="h-4 w-4" />
            Password
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <SettingsIcon className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{user?.name.charAt(0)}</span>
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Avatar</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 max-w-md">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="flex items-center mt-1.5">
                    <User className="h-4 w-4 text-muted-foreground absolute ml-3" />
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <div className="flex items-center mt-1.5">
                    <Mail className="h-4 w-4 text-muted-foreground absolute ml-3" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <div className="flex items-center mt-1.5">
                    <Phone className="h-4 w-4 text-muted-foreground absolute ml-3" />
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium">Current Password</label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="text-sm font-medium">New Password</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 8 characters with at least one number and symbol
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button onClick={handleChangePassword}>
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Meeting Reminders</p>
                    <p className="text-sm text-muted-foreground">Get reminded before scheduled meetings</p>
                  </div>
                  <Switch checked={meetingReminders} onCheckedChange={setMeetingReminders} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Seller Alerts</p>
                    <p className="text-sm text-muted-foreground">New seller registrations and verifications</p>
                  </div>
                  <Switch checked={sellerAlerts} onCheckedChange={setSellerAlerts} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Security Alerts</p>
                    <p className="text-sm text-muted-foreground">Suspicious activities and login attempts</p>
                  </div>
                  <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
                </div>
              </div>
              <Button onClick={handleSaveNotifications}>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Control platform features and functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-destructive">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Disable access to the platform temporarily</p>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Registrations</p>
                    <p className="text-sm text-muted-foreground">Allow new sellers and buyers to register</p>
                  </div>
                  <Switch checked={newRegistrations} onCheckedChange={setNewRegistrations} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Video Calls</p>
                    <p className="text-sm text-muted-foreground">Enable video call feature</p>
                  </div>
                  <Switch checked={videoCalls} onCheckedChange={setVideoCalls} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Blog Comments</p>
                    <p className="text-sm text-muted-foreground">Allow comments on blog posts</p>
                  </div>
                  <Switch checked={blogComments} onCheckedChange={setBlogComments} />
                </div>
              </div>
              <Button onClick={handleSaveSystem}>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
      </div>
  );
}
