import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SettingsTabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: 'User',
      description: 'Manage your personal information and account details'
    },
    {
      id: 'security',
      label: 'Account Security',
      icon: 'Shield',
      description: 'Password, 2FA, and security settings'
    },
    {
      id: 'notifications',
      label: 'Notification Preferences',
      icon: 'Bell',
      description: 'Control how and when you receive notifications'
    },
    {
      id: 'collaboration',
      label: 'Collaboration Settings',
      icon: 'Users',
      description: 'Document permissions and collaboration features'
    }
  ];

  return (
    <>
      {/* Desktop Tab Navigation */}
      <div className="hidden lg:block bg-background border-b border-border">
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => onTabChange(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm collaborative-transition ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      {/* Mobile Tab Navigation */}
      <div className="lg:hidden bg-background border-b border-border">
        <div className="px-4 py-3">
          <div className="grid grid-cols-2 gap-2">
            {tabs?.map((tab) => (
              <Button
                key={tab?.id}
                variant={activeTab === tab?.id ? "default" : "outline"}
                size="sm"
                onClick={() => onTabChange(tab?.id)}
                iconName={tab?.icon}
                iconPosition="left"
                iconSize={16}
                className="justify-start text-xs btn-press"
              >
                <span className="truncate">{tab?.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Tab Description */}
      <div className="bg-surface border-b border-border">
        <div className="px-6 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon 
                name={tabs?.find(tab => tab?.id === activeTab)?.icon || 'Settings'} 
                size={16} 
                className="text-primary" 
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {tabs?.find(tab => tab?.id === activeTab)?.label || 'Settings'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {tabs?.find(tab => tab?.id === activeTab)?.description || 'Manage your account settings'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsTabNavigation;