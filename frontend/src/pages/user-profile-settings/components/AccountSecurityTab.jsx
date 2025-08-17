import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AccountSecurityTab = ({ onUpdateSecurity }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const activeSessions = [
    {
      id: 1,
      device: "MacBook Pro - Chrome",
      location: "New York, NY",
      lastActive: "2 minutes ago",
      current: true,
      ip: "192.168.1.100"
    },
    {
      id: 2,
      device: "iPhone 14 - Safari",
      location: "New York, NY",
      lastActive: "1 hour ago",
      current: false,
      ip: "192.168.1.101"
    },
    {
      id: 3,
      device: "Windows PC - Edge",
      location: "Boston, MA",
      lastActive: "3 days ago",
      current: false,
      ip: "10.0.0.50"
    }
  ];

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordUpdate = async () => {
    if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onUpdateSecurity?.({ type: 'password', data: passwordForm });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    setIsLoading(true);
    try {
      await onUpdateSecurity?.({ type: '2fa', enabled: !twoFactorEnabled });
      setTwoFactorEnabled(!twoFactorEnabled);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await onUpdateSecurity?.({ type: 'revoke_session', sessionId });
    } catch (error) {
      console.error('Failed to revoke session:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await onUpdateSecurity?.({ type: 'delete_account' });
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3 animate-fade-in-backdrop">
          <Icon name="Check" size={20} className="text-success" />
          <span className="text-success font-medium">Security settings updated successfully!</span>
        </div>
      )}
      {/* Change Password */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Change Password</h3>
        <div className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm?.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
            placeholder="Enter current password"
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwordForm?.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
            placeholder="Enter new password"
            description="Must be at least 8 characters long"
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm?.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
            placeholder="Confirm new password"
            error={passwordForm?.confirmPassword && passwordForm?.newPassword !== passwordForm?.confirmPassword ? "Passwords don't match" : ""}
            required
          />
          <Button
            variant="default"
            onClick={handlePasswordUpdate}
            loading={isLoading}
            disabled={!passwordForm?.currentPassword || !passwordForm?.newPassword || passwordForm?.newPassword !== passwordForm?.confirmPassword}
            iconName="Lock"
            iconPosition="left"
            iconSize={16}
            className="btn-press"
          >
            Update Password
          </Button>
        </div>
      </div>
      {/* Two-Factor Authentication */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Two-Factor Authentication</h3>
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={twoFactorEnabled}
                onChange={(e) => handleTwoFactorToggle()}
                label="Enable Two-Factor Authentication"
              />
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                twoFactorEnabled 
                  ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
              }`}>
                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            {twoFactorEnabled && (
              <div className="mt-4 p-4 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">2FA is active</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your account is protected with two-factor authentication
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Active Sessions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Active Sessions</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your active sessions across different devices and locations.
        </p>
        <div className="space-y-4">
          {activeSessions?.map((session) => (
            <div key={session?.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon 
                    name={session?.device?.includes('iPhone') ? 'Smartphone' : session?.device?.includes('Windows') ? 'Monitor' : 'Laptop'} 
                    size={20} 
                    className="text-primary" 
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-foreground">{session?.device}</p>
                    {session?.current && (
                      <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{session?.location}</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {session?.ip} • Last active: {session?.lastActive}
                  </p>
                </div>
              </div>
              {!session?.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevokeSession(session?.id)}
                  iconName="LogOut"
                  iconPosition="left"
                  iconSize={14}
                  className="btn-press text-error hover:text-error"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Danger Zone */}
      <div className="bg-card rounded-lg border border-error/20 p-6">
        <h3 className="text-lg font-semibold text-error mb-4">Danger Zone</h3>
        <div className="space-y-4">
          <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              iconName="Trash2"
              iconPosition="left"
              iconSize={16}
              className="btn-press"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-soft z-1100 flex items-center justify-center p-4">
          <div className="bg-popover border border-border rounded-lg shadow-elevated max-w-md w-full p-6 animate-fade-in-backdrop">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <h3 className="text-lg font-semibold text-popover-foreground">Delete Account</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  handleDeleteAccount();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSecurityTab;