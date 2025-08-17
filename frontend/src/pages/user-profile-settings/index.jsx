import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import SettingsBreadcrumb from './components/SettingsBreadcrumb';
import SettingsTabNavigation from './components/SettingsTabNavigation';
import ProfileInformationTab from './components/ProfileInformationTab';
import AccountSecurityTab from './components/AccountSecurityTab';
import NotificationPreferencesTab from './components/NotificationPreferencesTab';
import CollaborationSettingsTab from './components/CollaborationSettingsTab';

const UserProfileSettings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    bio: "Senior Product Manager with 8+ years of experience in collaborative tools and document management systems. Passionate about creating seamless user experiences.",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    role: "Product Manager",
    department: "Engineering",
    joinDate: "2024-01-15",
    lastActive: "2 minutes ago",
    documentsCreated: 47,
    collaborations: 23,
    commentsMade: 156
  };

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      title: "Document shared",
      message: "Alex shared \'Q4 Planning Document\' with you",
      time: "5 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "New comment",
      message: "Maria commented on \'Project Roadmap'",
      time: "1 hour ago",
      read: false
    },
    {
      id: 3,
      title: "Document updated",
      message: "Changes made to \'Team Guidelines'",
      time: "3 hours ago",
      read: true
    }
  ];

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUser(mockUser);
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleUpdateProfile = async (profileData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUser(prev => ({ ...prev, ...profileData }));
      console.log('Profile updated:', profileData);
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const handleUpdateSecurity = async (securityData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Security settings updated:', securityData);
      
      if (securityData?.type === 'delete_account') {
        // Redirect to login after account deletion
        navigate('/login-screen');
      }
    } catch (error) {
      console.error('Failed to update security settings:', error);
      throw error;
    }
  };

  const handleUpdateNotifications = async (notificationData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Notification preferences updated:', notificationData);
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      throw error;
    }
  };

  const handleUpdateCollaboration = async (collaborationData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Collaboration settings updated:', collaborationData);
    } catch (error) {
      console.error('Failed to update collaboration settings:', error);
      throw error;
    }
  };

  const handleLogout = () => {
    // Clear user session and redirect to login
    navigate('/login-screen');
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'profile':
        return (
          <ProfileInformationTab
            user={user}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'security':
        return (
          <AccountSecurityTab
            onUpdateSecurity={handleUpdateSecurity}
          />
        );
      case 'notifications':
        return (
          <NotificationPreferencesTab
            onUpdateNotifications={handleUpdateNotifications}
          />
        );
      case 'collaboration':
        return (
          <CollaborationSettingsTab
            onUpdateCollaboration={handleUpdateCollaboration}
          />
        );
      default:
        return (
          <ProfileInformationTab
            user={user}
            onUpdateProfile={handleUpdateProfile}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader
        user={user}
        notifications={mockNotifications}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="pt-16">
        {/* Breadcrumb Navigation */}
        <SettingsBreadcrumb currentTab={activeTab} />

        {/* Tab Navigation */}
        <SettingsTabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;