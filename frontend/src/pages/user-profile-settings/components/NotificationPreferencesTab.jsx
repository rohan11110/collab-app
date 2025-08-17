import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const NotificationPreferencesTab = ({ onUpdateNotifications }) => {
  const [emailNotifications, setEmailNotifications] = useState({
    documentShared: true,
    commentAdded: true,
    collaboratorJoined: false,
    documentUpdated: true,
    weeklyDigest: true,
    securityAlerts: true
  });

  const [inAppNotifications, setInAppNotifications] = useState({
    documentShared: true,
    commentAdded: true,
    collaboratorJoined: true,
    documentUpdated: false,
    realTimeUpdates: true,
    systemMessages: true
  });

  const [collaborationNotifications, setCollaborationNotifications] = useState({
    typingIndicators: true,
    presenceUpdates: true,
    chatMessages: true,
    documentChanges: false,
    cursorMovements: true
  });

  const [emailFrequency, setEmailFrequency] = useState('immediate');
  const [quietHours, setQuietHours] = useState({ enabled: false, start: '22:00', end: '08:00' });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const frequencyOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: 'hourly', label: 'Hourly Digest' },
    { value: 'daily', label: 'Daily Digest' },
    { value: 'weekly', label: 'Weekly Digest' },
    { value: 'never', label: 'Never' }
  ];

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i?.toString()?.padStart(2, '0');
    return { value: `${hour}:00`, label: `${hour}:00` };
  });

  const handleEmailNotificationChange = (key, value) => {
    setEmailNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleInAppNotificationChange = (key, value) => {
    setInAppNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCollaborationNotificationChange = (key, value) => {
    setCollaborationNotifications(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setQuietHours(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdateNotifications?.({
        email: emailNotifications,
        inApp: inAppNotifications,
        collaboration: collaborationNotifications,
        frequency: emailFrequency,
        quietHours
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const emailNotificationItems = [
    { key: 'documentShared', label: 'Document shared with me', description: 'When someone shares a document with you' },
    { key: 'commentAdded', label: 'New comments', description: 'When someone comments on your documents' },
    { key: 'collaboratorJoined', label: 'Collaborator joined', description: 'When someone joins your document' },
    { key: 'documentUpdated', label: 'Document updates', description: 'When collaborators make changes' },
    { key: 'weeklyDigest', label: 'Weekly activity digest', description: 'Summary of your weekly activity' },
    { key: 'securityAlerts', label: 'Security alerts', description: 'Important security notifications' }
  ];

  const inAppNotificationItems = [
    { key: 'documentShared', label: 'Document shared', description: 'Show notifications when documents are shared' },
    { key: 'commentAdded', label: 'New comments', description: 'Show notifications for new comments' },
    { key: 'collaboratorJoined', label: 'Collaborator activity', description: 'Show when people join or leave' },
    { key: 'documentUpdated', label: 'Document changes', description: 'Show notifications for document updates' },
    { key: 'realTimeUpdates', label: 'Real-time updates', description: 'Show live collaboration updates' },
    { key: 'systemMessages', label: 'System messages', description: 'Show important system notifications' }
  ];

  const collaborationNotificationItems = [
    { key: 'typingIndicators', label: 'Typing indicators', description: 'Show when others are typing' },
    { key: 'presenceUpdates', label: 'Presence updates', description: 'Show when collaborators join/leave' },
    { key: 'chatMessages', label: 'Chat messages', description: 'Show notifications for chat messages' },
    { key: 'documentChanges', label: 'Document changes', description: 'Show notifications for every change' },
    { key: 'cursorMovements', label: 'Cursor movements', description: 'Show other users\' cursor positions' }
  ];

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3 animate-fade-in-backdrop">
          <Icon name="Check" size={20} className="text-success" />
          <span className="text-success font-medium">Notification preferences updated successfully!</span>
        </div>
      )}
      {/* Email Notifications */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Mail" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Email Notifications</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Choose which email notifications you'd like to receive.
        </p>
        
        <div className="space-y-4 mb-6">
          {emailNotificationItems?.map((item) => (
            <div key={item?.key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 collaborative-transition">
              <Checkbox
                checked={emailNotifications?.[item?.key]}
                onChange={(e) => handleEmailNotificationChange(item?.key, e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  {item?.label}
                </label>
                <p className="text-xs text-muted-foreground mt-1">{item?.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <Select
            label="Email Frequency"
            description="How often would you like to receive email notifications?"
            options={frequencyOptions}
            value={emailFrequency}
            onChange={setEmailFrequency}
            className="max-w-xs"
          />
        </div>
      </div>
      {/* In-App Notifications */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Bell" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">In-App Notifications</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Control which notifications appear while you're using the app.
        </p>
        
        <div className="space-y-4">
          {inAppNotificationItems?.map((item) => (
            <div key={item?.key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 collaborative-transition">
              <Checkbox
                checked={inAppNotifications?.[item?.key]}
                onChange={(e) => handleInAppNotificationChange(item?.key, e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  {item?.label}
                </label>
                <p className="text-xs text-muted-foreground mt-1">{item?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Collaboration Notifications */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Users" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Collaboration Notifications</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Manage real-time collaboration notifications and indicators.
        </p>
        
        <div className="space-y-4">
          {collaborationNotificationItems?.map((item) => (
            <div key={item?.key} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 collaborative-transition">
              <Checkbox
                checked={collaborationNotifications?.[item?.key]}
                onChange={(e) => handleCollaborationNotificationChange(item?.key, e?.target?.checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground cursor-pointer">
                  {item?.label}
                </label>
                <p className="text-xs text-muted-foreground mt-1">{item?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quiet Hours */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Moon" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Quiet Hours</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Set quiet hours to pause non-urgent notifications during specific times.
        </p>
        
        <div className="space-y-4">
          <Checkbox
            checked={quietHours?.enabled}
            onChange={(e) => handleQuietHoursChange('enabled', e?.target?.checked)}
            label="Enable quiet hours"
            description="Pause notifications during specified hours"
          />
          
          {quietHours?.enabled && (
            <div className="grid grid-cols-2 gap-4 max-w-md ml-6">
              <Select
                label="Start Time"
                options={timeOptions}
                value={quietHours?.start}
                onChange={(value) => handleQuietHoursChange('start', value)}
              />
              <Select
                label="End Time"
                options={timeOptions}
                value={quietHours?.end}
                onChange={(value) => handleQuietHoursChange('end', value)}
              />
            </div>
          )}
        </div>
      </div>
      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={handleSave}
          loading={isLoading}
          iconName="Save"
          iconPosition="left"
          iconSize={16}
          className="btn-press"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferencesTab;