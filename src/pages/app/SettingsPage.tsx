"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { Label } from '@/ui/label';
import { Switch } from '@/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Badge } from '@/ui/badge';
import { 
  Settings, 
  Bell, 
  Shield, 
  User, 
  Palette, 
  Database, 
  Key,
  Mail,
  Globe,
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Brain
} from 'lucide-react';

export default SettingsPage;

export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    insights: true,
    reports: false,
    marketing: false
  });

  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    timezone: 'UTC-8',
    autoSave: true,
    lowPower: false
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    publicProfile: false,
    searchable: true
  });

  const applyThemeClass = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) { root.classList.add('dark'); root.setAttribute('data-theme', 'dark'); }
      else { root.classList.remove('dark'); root.setAttribute('data-theme', 'light'); }
    }
  };

  React.useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const initial = saved || preferences.theme;
    applyThemeClass(initial);
    if (!saved) localStorage.setItem('theme', initial);

    if (initial === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyThemeClass('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  const handleSetTheme = (theme: 'light' | 'dark' | 'system') => {
    setPreferences({ ...preferences, theme });
    localStorage.setItem('theme', theme);
    applyThemeClass(theme);
    try { window.dispatchEvent(new Event('themechange')); } catch {}
    try { window.location.reload(); } catch {}
  };

  return (
    <div className="p-8 space-y-8 min-h-screen text-text-primary">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-muted mt-1">
            Manage your account preferences and application settings
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blood-red to-crimson text-text-white hover:shadow-lg hover:shadow-blood-red/20">
          Save All Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 bg-surface backdrop-blur-xl border border-border shadow-lg">
          <TabsTrigger value="general" className="gap-2 text-text-primary data-[state=active]:bg-hover">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 text-text-primary data-[state=active]:bg-hover">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2 text-text-primary data-[state=active]:bg-hover">
            <Palette className="w-4 h-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2 text-text-primary data-[state=active]:bg-hover">
            <Shield className="w-4 h-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2 text-text-primary data-[state=active]:bg-hover">
            <Database className="w-4 h-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 text-text-primary data-[state=active]:bg-hover">
            <Key className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">General Preferences</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-900 dark:text-white/70">Configure your basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="language" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Language</Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({...preferences, language: value})}>
                    <SelectTrigger className="mt-1 bg-surface backdrop-blur-xl border-border text-text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface backdrop-blur-xl border-border">
                      <SelectItem value="en" className="text-text-primary hover:bg-hover">English</SelectItem>
                      <SelectItem value="es" className="text-text-primary hover:bg-hover">Spanish</SelectItem>
                      <SelectItem value="fr" className="text-text-primary hover:bg-hover">French</SelectItem>
                      <SelectItem value="de" className="text-text-primary hover:bg-hover">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Timezone</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => setPreferences({...preferences, timezone: value})}>
                    <SelectTrigger className="mt-1 bg-surface backdrop-blur-xl border-border text-text-primary">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-surface backdrop-blur-xl border-border">
                      <SelectItem value="UTC-8" className="text-text-primary hover:bg-hover">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5" className="text-text-primary hover:bg-hover">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0" className="text-text-primary hover:bg-hover">Greenwich Mean Time (UTC+0)</SelectItem>
                      <SelectItem value="UTC+1" className="text-text-primary hover:bg-hover">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-save" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Auto-save work</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Automatically save your progress while working</p>
                  </div>
                  <Switch 
                    id="auto-save"
                    checked={preferences.autoSave}
                    onCheckedChange={(checked) => setPreferences({...preferences, autoSave: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="low-power" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Low power mode</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Reduce animations and background processing</p>
                  </div>
                  <Switch 
                    id="low-power"
                    checked={preferences.lowPower}
                    onCheckedChange={(checked) => setPreferences({...preferences, lowPower: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Notification Settings</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-900 dark:text-white/70">Choose how and when you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Email notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Receive updates via email</p>
                  </div>
                  <Switch 
                    id="email-notifications"
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Push notifications</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Get notified in your browser</p>
                  </div>
                  <Switch 
                    id="push-notifications"
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="insights-notifications" className="text-gray-600 dark:text-gray-900 dark:text-white/70">New insights</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Notify when AI generates new insights</p>
                  </div>
                  <Switch 
                    id="insights-notifications"
                    checked={notifications.insights}
                    onCheckedChange={(checked) => setNotifications({...notifications, insights: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="reports-notifications" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Weekly reports</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Receive weekly summary reports</p>
                  </div>
                  <Switch 
                    id="reports-notifications"
                    checked={notifications.reports}
                    onCheckedChange={(checked) => setNotifications({...notifications, reports: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-notifications" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Marketing updates</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Product news and feature announcements</p>
                  </div>
                  <Switch 
                    id="marketing-notifications"
                    checked={notifications.marketing}
                    onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Appearance Settings</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-900 dark:text-white/70">Customize how the application looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold text-gray-900 dark:text-white">Theme</Label>
                <p className="text-sm text-gray-600 dark:text-gray-900 dark:text-white/70 mb-4">Choose your preferred theme for the application</p>
                <div className="grid grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleSetTheme('light')}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 backdrop-blur-sm ${preferences.theme === 'light' ? 'border-blood-red bg-white/10' : 'border-white/20 hover:border-white/40 bg-white/5'}`}
                  >
                    <Sun className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                    <div className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Light</div>
                    <div className="text-sm text-gray-600 dark:text-gray-900 dark:text-white/70">Clean and bright</div>
                  </button>
                  <button 
                    onClick={() => handleSetTheme('dark')}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 bg-gradient-to-br ${preferences.theme === 'dark' ? 'border-blood-red from-blood-red/10 to-crimson/10' : 'border-white/20 hover:border-white/40 from-white/5 to-white/5'}`}
                  >
                    <Moon className="w-8 h-8 mx-auto mb-3 text-blue-400" />
                    <div className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">Dark</div>
                    <div className="text-sm text-gray-600 dark:text-gray-900 dark:text-white/70">Easy on the eyes</div>
                  </button>
                  <button 
                    onClick={() => handleSetTheme('system')}
                    className={`p-6 rounded-2xl border-2 transition-all duration-200 backdrop-blur-sm ${preferences.theme === 'system' ? 'border-blood-red bg-white/10' : 'border-white/20 hover:border-white/40 bg-white/5'}`}
                  >
                    <Monitor className="w-8 h-8 mx-auto mb-3 text-gray-500 dark:text-white/70" />
                    <div className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">System</div>
                    <div className="text-sm text-gray-600 dark:text-gray-900 dark:text-white/70">Follow device</div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Privacy & Data Settings</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-900 dark:text-white/70">Control how your data is used and shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Data sharing for improvements</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Help improve UrekAI by sharing anonymized usage data</p>
                  </div>
                  <Switch 
                    id="data-sharing"
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => setPrivacy({...privacy, dataSharing: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Analytics tracking</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Allow analytics to help us understand feature usage</p>
                  </div>
                  <Switch 
                    id="analytics"
                    checked={privacy.analytics}
                    onCheckedChange={(checked) => setPrivacy({...privacy, analytics: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="public-profile" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Public profile</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Make your profile visible to other users</p>
                  </div>
                  <Switch 
                    id="public-profile"
                    checked={privacy.publicProfile}
                    onCheckedChange={(checked) => setPrivacy({...privacy, publicProfile: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="searchable" className="text-gray-600 dark:text-gray-900 dark:text-white/70">Searchable in directory</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-900 dark:text-white/50">Allow others to find you in the user directory</p>
                  </div>
                  <Switch 
                    id="searchable"
                    checked={privacy.searchable}
                    onCheckedChange={(checked) => setPrivacy({...privacy, searchable: checked})}
                    className="data-[state=checked]:bg-blood-red"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Data Management</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-900 dark:text-white/70">Manage your data storage and exports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Storage Usage</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-900 dark:text-white/70">Datasets</span>
                      <span className="font-medium text-gray-900 dark:text-white">2.3 GB</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blood-red to-crimson h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-900 dark:text-white/70">Chat History</span>
                      <span className="font-medium text-gray-900 dark:text-white">156 MB</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-crimson to-copper-orange h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-900 dark:text-white/70">Insights</span>
                      <span className="font-medium text-gray-900 dark:text-white">89 MB</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-copper-orange to-blood-red h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Data Actions</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-2 text-text-primary border-border hover:bg-hover">
                      <Download className="w-4 h-4" />
                      Export All Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 text-text-primary border-border hover:bg-hover">
                      <Upload className="w-4 h-4" />
                      Import Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                      Clear All Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Security Settings</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-900 dark:text-white/70">Manage your account security and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-600 dark:text-gray-900 dark:text-white/70">Change Password</Label>
                  <div className="grid gap-3 mt-2">
                    <Input type="password" placeholder="Current password" className="bg-surface backdrop-blur-xl border-border text-text-primary placeholder-text-muted" />
                    <Input type="password" placeholder="New password" className="bg-surface backdrop-blur-xl border-border text-text-primary placeholder-text-muted" />
                    <Input type="password" placeholder="Confirm new password" className="bg-surface backdrop-blur-xl border-border text-text-primary placeholder-text-muted" />
                    <Button className="w-fit bg-gradient-to-r from-blood-red to-crimson text-gray-900 dark:text-white hover:shadow-lg hover:shadow-blood-red/20">
                      Update Password
                    </Button>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">2FA Enabled</p>
                        <p className="text-sm text-gray-600 dark:text-gray-900 dark:text-white/70">Using authenticator app</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-text-primary border-border hover:bg-hover">Configure</Button>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Active Sessions</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Current Session</p>
                        <p className="text-sm text-gray-600 dark:text-gray-900 dark:text-white/70">Chrome on macOS • San Francisco, CA</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Mobile App</p>
                        <p className="text-sm text-gray-600 dark:text-gray-900 dark:text-white/70">iPhone • Last active 2 hours ago</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-red-400 border-red-500/30 hover:bg-red-500/10">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
