import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SettingsBreadcrumb = ({ currentTab }) => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/document-dashboard', icon: 'Home' },
    { label: 'Settings', path: '/user-profile-settings', icon: 'Settings' },
    { label: getTabLabel(currentTab), current: true }
  ];

  function getTabLabel(tab) {
    switch (tab) {
      case 'profile': return 'Profile Information';
      case 'security': return 'Account Security';
      case 'notifications': return 'Notification Preferences';
      case 'collaboration': return 'Collaboration Settings';
      default: return 'Profile Information';
    }
  }

  return (
    <div className="bg-background border-b border-border">
      <div className="px-6 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbItems?.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              )}
              {item?.current ? (
                <div className="flex items-center space-x-2">
                  <Icon name={item?.icon} size={16} className="text-primary" />
                  <span className="font-medium text-foreground">{item?.label}</span>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item?.path)}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground collaborative-transition p-1 h-auto"
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.label}</span>
                </Button>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SettingsBreadcrumb;