import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const LinkSharingControls = ({ 
  linkSettings = {}, 
  onUpdateLinkSettings,
  documentLink = ""
}) => {
  const [copied, setCopied] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const accessLevelOptions = [
    { value: 'viewer', label: 'Viewer', description: 'Can view only' },
    { value: 'commenter', label: 'Commenter', description: 'Can view and comment' },
    { value: 'editor', label: 'Editor', description: 'Can edit document' }
  ];

  const expirationOptions = [
    { value: 'never', label: 'Never expires' },
    { value: '1day', label: '1 day' },
    { value: '7days', label: '7 days' },
    { value: '30days', label: '30 days' },
    { value: 'custom', label: 'Custom date' }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(documentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleSettingChange = (key, value) => {
    onUpdateLinkSettings?.({
      ...linkSettings,
      [key]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Link Sharing</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          iconSize={16}
          className="btn-press"
        >
          Advanced
        </Button>
      </div>
      <div className="bg-surface rounded-lg border border-border p-4 space-y-4">
        {/* Public Access Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <Icon name="Globe" size={20} className="text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">Public Access</p>
                <p className="text-xs text-muted-foreground">Anyone with the link can access</p>
              </div>
            </div>
          </div>
          <Checkbox
            checked={linkSettings?.isPublic || false}
            onChange={(e) => handleSettingChange('isPublic', e?.target?.checked)}
          />
        </div>

        {linkSettings?.isPublic && (
          <div className="space-y-4 animate-fade-in-backdrop">
            {/* Link Display and Copy */}
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={documentLink}
                  readOnly
                  className="pr-10 font-mono text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyLink}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 btn-press"
                >
                  <Icon name={copied ? "Check" : "Copy"} size={16} />
                </Button>
              </div>
            </div>

            {copied && (
              <div className="flex items-center space-x-2 text-success text-sm animate-fade-in-backdrop">
                <Icon name="Check" size={16} />
                <span>Link copied to clipboard!</span>
              </div>
            )}

            {/* Access Level */}
            <div>
              <Select
                label="Access Level"
                options={accessLevelOptions}
                value={linkSettings?.accessLevel || 'viewer'}
                onChange={(value) => handleSettingChange('accessLevel', value)}
                className="w-full"
              />
            </div>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-4 pt-4 border-t border-border animate-fade-in-backdrop">
                {/* Password Protection */}
                <div className="space-y-2">
                  <Checkbox
                    label="Password Protection"
                    description="Require a password to access the document"
                    checked={linkSettings?.requirePassword || false}
                    onChange={(e) => handleSettingChange('requirePassword', e?.target?.checked)}
                  />
                  
                  {linkSettings?.requirePassword && (
                    <Input
                      type="password"
                      placeholder="Enter password..."
                      value={linkSettings?.password || ''}
                      onChange={(e) => handleSettingChange('password', e?.target?.value)}
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Expiration Date */}
                <div className="space-y-2">
                  <Select
                    label="Link Expiration"
                    options={expirationOptions}
                    value={linkSettings?.expiration || 'never'}
                    onChange={(value) => handleSettingChange('expiration', value)}
                    className="w-full"
                  />
                  
                  {linkSettings?.expiration === 'custom' && (
                    <Input
                      type="datetime-local"
                      value={linkSettings?.customExpiration || ''}
                      onChange={(e) => handleSettingChange('customExpiration', e?.target?.value)}
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Download Restrictions */}
                <Checkbox
                  label="Prevent Download"
                  description="Viewers cannot download or print the document"
                  checked={linkSettings?.preventDownload || false}
                  onChange={(e) => handleSettingChange('preventDownload', e?.target?.checked)}
                />

                {/* Copy Restrictions */}
                <Checkbox
                  label="Prevent Copy"
                  description="Viewers cannot copy text from the document"
                  checked={linkSettings?.preventCopy || false}
                  onChange={(e) => handleSettingChange('preventCopy', e?.target?.checked)}
                />
              </div>
            )}
          </div>
        )}

        {!linkSettings?.isPublic && (
          <div className="text-center py-4 text-muted-foreground">
            <Icon name="Lock" size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Document is private</p>
            <p className="text-xs mt-1">Enable public access to share via link</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkSharingControls;