import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Bell, Shield, Palette, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UserSettings {
  company_name: string;
  company_email: string;
  company_address: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  email_notifications: boolean;
  attendance_alerts: boolean;
  task_reminders: boolean;
  weekly_reports: boolean;
  dark_mode: boolean;
  theme_color: string;
}

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    company_name: '',
    company_email: '',
    company_address: '',
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    email_notifications: true,
    attendance_alerts: true,
    task_reminders: false,
    weekly_reports: true,
    dark_mode: false,
    theme_color: 'primary'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user?.id]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          company_name: data.company_name || '',
          company_email: data.company_email || '',
          company_address: data.company_address || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          role: data.role || '',
          email_notifications: data.email_notifications,
          attendance_alerts: data.attendance_alerts,
          task_reminders: data.task_reminders,
          weekly_reports: data.weekly_reports,
          dark_mode: data.dark_mode,
          theme_color: data.theme_color || 'primary'
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    }
  };

  const saveSettings = async (section: string) => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...settings
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${section} settings saved successfully`
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: keyof UserSettings, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Company Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Settings
            </CardTitle>
            <CardDescription>
              Update your company information and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input 
                  id="company-name" 
                  value={settings.company_name}
                  onChange={(e) => updateSetting('company_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">Company Email</Label>
                <Input 
                  id="company-email" 
                  type="email" 
                  value={settings.company_email}
                  onChange={(e) => updateSetting('company_email', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address">Company Address</Label>
              <Input 
                id="company-address" 
                value={settings.company_address}
                onChange={(e) => updateSetting('company_address', e.target.value)}
              />
            </div>
            <Button 
              onClick={() => saveSettings('Company')}
              disabled={loading}
            >
              Save Company Settings
            </Button>
          </CardContent>
        </Card>

        {/* User Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Profile
            </CardTitle>
            <CardDescription>
              Manage your personal account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input 
                  id="first-name" 
                  value={settings.first_name}
                  onChange={(e) => updateSetting('first_name', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input 
                  id="last-name" 
                  value={settings.last_name}
                  onChange={(e) => updateSetting('last_name', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={settings.email}
                onChange={(e) => updateSetting('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="role" 
                  value={settings.role}
                  onChange={(e) => updateSetting('role', e.target.value)}
                />
                <Badge variant="secondary">Admin</Badge>
              </div>
            </div>
            <Button 
              onClick={() => saveSettings('Profile')}
              disabled={loading}
            >
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch 
                checked={settings.email_notifications}
                onCheckedChange={(checked) => {
                  updateSetting('email_notifications', checked);
                  saveSettings('Notification');
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Attendance Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified about attendance issues</p>
              </div>
              <Switch 
                checked={settings.attendance_alerts}
                onCheckedChange={(checked) => {
                  updateSetting('attendance_alerts', checked);
                  saveSettings('Notification');
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Task Reminders</Label>
                <p className="text-sm text-muted-foreground">Receive reminders for pending tasks</p>
              </div>
              <Switch 
                checked={settings.task_reminders}
                onCheckedChange={(checked) => {
                  updateSetting('task_reminders', checked);
                  saveSettings('Notification');
                }}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Get weekly performance reports</p>
              </div>
              <Switch 
                checked={settings.weekly_reports}
                onCheckedChange={(checked) => {
                  updateSetting('weekly_reports', checked);
                  saveSettings('Notification');
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Change Password</Label>
              <div className="space-y-2">
                <Input type="password" placeholder="Current password" />
                <Input type="password" placeholder="New password" />
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button>Update Password</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Button variant="outline">Enable 2FA</Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
              </div>
              <Switch 
                checked={settings.dark_mode}
                onCheckedChange={(checked) => {
                  updateSetting('dark_mode', checked);
                  saveSettings('Appearance');
                }}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Theme Color</Label>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary border-2 border-primary" />
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-transparent hover:border-green-600 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-transparent hover:border-purple-600 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-transparent hover:border-orange-600 cursor-pointer" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              Export and manage your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline">Export Employee Data</Button>
              <Button variant="outline">Export Attendance Records</Button>
              <Button variant="outline">Export Work Logs</Button>
              <Button variant="outline">Backup All Data</Button>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label className="text-destructive">Danger Zone</Label>
              <p className="text-sm text-muted-foreground">
                These actions cannot be undone. Please be careful.
              </p>
              <Button variant="destructive" size="sm">Delete All Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}