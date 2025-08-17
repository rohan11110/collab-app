import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Icon from '../AppIcon';
import { useDispatch } from "react-redux";
import { clearUser } from "../../slices/authSlice";

const GlobalHeader = ({ user, notifications = [], onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigationItems = [
    { label: 'Dashboard', path: '/document-dashboard', icon: 'LayoutDashboard' },
    { label: 'Editor', path: '/document-editor', icon: 'FileText' },
    { label: 'Sharing', path: '/document-sharing-settings', icon: 'Share2' },
    { label: 'Profile', path: '/user-profile-settings', icon: 'User' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
    setShowMobileMenu(false);
  };

  const handleCreateDocument = () => {
    navigate('/document-editor');
  };

  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-background border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">CollabDocs</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              iconName={item?.icon}
              iconPosition="left"
              iconSize={16}
              className="collaborative-transition"
            >
              {item?.label}
            </Button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Create Document Button */}
          <Button
            variant="default"
            size="sm"
            onClick={handleCreateDocument}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
            className="hidden sm:flex btn-press"
          >
            New Doc
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative btn-press"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs rounded-full flex items-center justify-center animate-presence-glow">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-popover border border-border rounded-lg shadow-elevated z-1100 animate-fade-in-backdrop">
                <div className="p-4 border-b border-border">
                  <h3 className="font-medium text-popover-foreground">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications?.length > 0 ? (
                    notifications?.slice(0, 5)?.map((notification, index) => (
                      <div
                        key={index}
                        className={`p-3 border-b border-border last:border-b-0 hover:bg-muted collaborative-transition ${
                          !notification?.read ? 'bg-accent/5' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-popover-foreground font-medium truncate">
                              {notification?.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification?.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                              {notification?.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <Icon name="Bell" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="btn-press"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </Button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated z-1100 animate-fade-in-backdrop">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-popover-foreground">{user?.name || 'User'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
                </div>
                <div className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleNavigation('/user-profile-settings');
                      setShowUserMenu(false);
                    }}
                    iconName="Settings"
                    iconPosition="left"
                    iconSize={16}
                    className="w-full justify-start"
                  >
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onLogout?.();
                      setShowUserMenu(false);
                      dispatch(clearUser());
                    }}
                    iconName="LogOut"
                    iconPosition="left"
                    iconSize={16}
                    className="w-full justify-start text-error hover:text-error"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden btn-press"
          >
            <Icon name={showMobileMenu ? "X" : "Menu"} size={20} />
          </Button>
        </div>
      </div>
      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="lg:hidden bg-surface border-t border-border animate-slide-in-right">
          <div className="p-4 space-y-2">
            {navigationItems?.map((item) => (
              <Button
                key={item?.path}
                variant={isActivePath(item?.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item?.path)}
                iconName={item?.icon}
                iconPosition="left"
                iconSize={16}
                className="w-full justify-start"
              >
                {item?.label}
              </Button>
            ))}
            <div className="pt-2 border-t border-border">
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateDocument}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                className="w-full"
              >
                New Document
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Overlay for dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-1050"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default GlobalHeader;