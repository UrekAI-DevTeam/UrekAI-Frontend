"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/state/authStore';
import { User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Camera,
  Shield,
  Bell,
  Activity,
  BarChart3,
  MessageCircle,
  Brain,
  Target,
  Clock
} from 'lucide-react';

export default ProfilePage;

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const { user: authUser, updateProfile } = useAuthStore();
  
  const displayName = ((): string => {
    const fallback = authUser?.email ? authUser.email.split('@')[0] : 'User';
    if (!authUser?.name) return fallback;
    if (authUser.name.trim().toLowerCase() === 'google user') return fallback;
    return authUser.name;
  })();
  const initial = (displayName || 'U').charAt(0).toUpperCase();
  
  // Initialize profile data from authUser
  const [profileData, setProfileData] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    avatar: authUser?.avatar || ''
  });

  // Sync profileData when authUser changes
  React.useEffect(() => {
    if (authUser) {
      setProfileData({
        name: authUser.name,
        email: authUser.email,
        avatar: authUser.avatar || ''
      });
    }
  }, [authUser]);

  const stats = [
    { label: 'Analyses Created', value: '247', icon: BarChart3 },
    { label: 'Chat Sessions', value: '1,024', icon: MessageCircle },
    { label: 'Insights Generated', value: '3,847', icon: Brain },
    { label: 'Data Processed', value: '2.3TB', icon: Activity }
  ];


  const recentActivity = [
    {
      action: 'Analyzed sales performance data',
      time: '2 hours ago',
      type: 'analysis'
    },
    {
      action: 'Started chat about customer behavior',
      time: '4 hours ago',
      type: 'chat'
    },
    {
      action: 'Generated quarterly insights report',
      time: '1 day ago',
      type: 'insight'
    },
    {
      action: 'Uploaded new market research dataset',
      time: '2 days ago',
      type: 'upload'
    }
  ];

  const handleSave = async () => {
    if (!authUser) return;
    
    try {
      // Update the user in authStore
      const updatedUser: User = {
        ...authUser,
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar
      };
      
      await updateProfile(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Could show an error toast here
    }
  };

  return (
    <div className="p-8 space-y-8 min-h-screen text-text-primary">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Profile</h1>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          className="bg-primary text-white gap-2 hover:bg-primary/90"
        >
          <Edit3 className="w-4 h-4" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Overview */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg bg-surface backdrop-blur-xl rounded-2xl border border-border">
            <CardHeader>
              <CardTitle className="text-text-primary">Personal Information</CardTitle>
              <CardDescription className="text-text-muted">Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blood-red to-crimson flex items-center justify-center text-2xl font-bold text-text-white shadow-lg overflow-hidden ring-1 ring-white/20">
                    {authUser?.avatar && !avatarError ? (
                      <Image 
                        src={authUser.avatar}
                        alt={displayName}
                        width={96}
                        height={96}
                        className="object-cover"
                        sizes="96px"
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <span className="tracking-wide">{initial}</span>
                    )}
                  </div>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-gradient-to-r from-blood-red to-crimson"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Profile Form */}
                <div className="flex-1 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-text-secondary mb-1 block">Full Name</label>
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        disabled={!isEditing}
                        className="bg-surface backdrop-blur-xl border-border text-text-primary placeholder-text-muted"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary mb-1 block">Email</label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        className="bg-surface backdrop-blur-xl border-border text-text-primary placeholder-text-muted"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-text-secondary mb-1 block">User ID</label>
                      <Input
                        value={authUser?.id || ''}
                        disabled={true}
                        className="bg-surface backdrop-blur-xl border-border text-text-muted placeholder-text-muted cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary mb-1 block">Avatar URL</label>
                      <Input
                        value={profileData.avatar}
                        onChange={(e) => setProfileData({...profileData, avatar: e.target.value})}
                        disabled={!isEditing}
                        placeholder="https://example.com/avatar.jpg"
                        className="bg-surface backdrop-blur-xl border-border text-text-primary placeholder-text-muted"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSave} className="bg-gradient-to-r from-blood-red to-crimson text-text-white hover:shadow-lg hover:shadow-blood-red/20">
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="text-text-primary border-border hover:bg-hover">
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Info */}
        <div className="space-y-6">
          <Card className="shadow-lg bg-surface backdrop-blur-xl rounded-2xl border border-border">
            <CardHeader>
              <CardTitle className="text-text-primary">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-sm text-text-secondary">Account Status</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-text-primary">Active</p>
                    <Badge className="bg-success/10 text-success border border-success/20">Verified</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-sm text-text-secondary">Authentication</p>
                  <p className="font-medium text-text-primary">
                    {authUser?.firebase_token ? 'Firebase Connected' : 'Email/Password'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-muted" />
                <div>
                  <p className="text-sm text-text-secondary">Email Status</p>
                  <p className="font-medium text-text-primary">
                    {authUser?.email ? 'Verified' : 'Not Set'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-surface backdrop-blur-xl rounded-2xl border border-border">
            <CardHeader>
              <CardTitle className="text-text-primary">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2 text-text-primary border-border hover:bg-hover">
                <Shield className="w-4 h-4" />
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-text-primary border-border hover:bg-hover">
                <Bell className="w-4 h-4" />
                Notification Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-text-primary border-border hover:bg-hover">
                <UserIcon className="w-4 h-4" />
                Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats + Manage Subscription */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-surface backdrop-blur-xl rounded-2xl border border-border">
          <CardHeader>
            <CardTitle className="text-text-primary">Your Statistics</CardTitle>
            <CardDescription className="text-text-secondary">Track your usage and productivity metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blood-red/20 to-crimson/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-8 h-8 text-blood-red" />
                    </div>
                    <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                    <div className="text-sm text-text-secondary">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
          <CardHeader>
            <CardTitle className="text-text-primary">Manage Subscription</CardTitle>
            <CardDescription className="text-text-secondary">Monitor credits and update plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-secondary">Credits Remaining</span>
                  <span className="text-sm font-medium text-text-primary">72 / 100</span>
                </div>
                <div className="w-full h-3 rounded-full bg-muted overflow-hidden border border-border">
                  <div className="h-full w-[72%] bg-primary"></div>
                </div>
              </div>
              <a href="/pricing">
                <Button className="w-full bg-primary text-white hover:bg-primary/90 mt-2">Add Credits</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
