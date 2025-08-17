import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileInformationTab = ({ user, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    profilePicture: user?.profilePicture || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewImage, setPreviewImage] = useState(user?.profilePicture || '');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e?.target?.result);
        setFormData(prev => ({
          ...prev,
          profilePicture: e?.target?.result
        }));
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdateProfile?.(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const accountStats = [
    { label: 'Documents Created', value: '47', icon: 'FileText' },
    { label: 'Collaborations', value: '23', icon: 'Users' },
    { label: 'Comments Made', value: '156', icon: 'MessageSquare' },
    { label: 'Account Age', value: '8 months', icon: 'Calendar' }
  ];

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3 animate-fade-in-backdrop">
          <Icon name="Check" size={20} className="text-success" />
          <span className="text-success font-medium">Profile updated successfully!</span>
        </div>
      )}
      {/* Profile Picture Section */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Profile Picture</h3>
        <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt="Profile picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary">
                  <span className="text-2xl font-semibold text-primary-foreground">
                    {formData?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 collaborative-transition">
              <Icon name="Camera" size={16} color="white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">
              Upload a new profile picture. Recommended size: 400x400px
            </p>
            <div className="flex space-x-2">
              <label>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Icon name="Upload" size={16} className="mr-2" />
                    Choose File
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {previewImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPreviewImage('');
                    setFormData(prev => ({ ...prev, profilePicture: '' }));
                  }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Basic Information */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            type="text"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            placeholder="Enter your full name"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          <textarea
            value={formData?.bio}
            onChange={(e) => handleInputChange('bio', e?.target?.value)}
            placeholder="Tell us about yourself..."
            rows={4}
            className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {formData?.bio?.length}/500 characters
          </p>
        </div>
      </div>
      {/* Account Statistics */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Account Statistics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {accountStats?.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-surface rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Icon name={stat?.icon} size={20} className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
              <p className="text-sm text-muted-foreground">{stat?.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Member since: <span className="font-medium">January 2024</span>
            </span>
          </div>
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
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileInformationTab;