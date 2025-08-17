import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const AddPeopleSection = ({ onInviteUser, suggestions = [] }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('editor');
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomMessage, setShowCustomMessage] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const roleOptions = [
    { value: 'editor', label: 'Editor', description: 'Can edit and comment' },
    { value: 'viewer', label: 'Viewer', description: 'Can only view document' }
  ];

  const filteredSuggestions = suggestions?.filter(suggestion =>
    suggestion?.email?.toLowerCase()?.includes(inviteEmail?.toLowerCase()) ||
    suggestion?.name?.toLowerCase()?.includes(inviteEmail?.toLowerCase())
  );

  const handleInvite = () => {
    if (inviteEmail?.trim()) {
      onInviteUser?.({
        email: inviteEmail,
        role: selectedRole,
        message: customMessage
      });
      setInviteEmail('');
      setCustomMessage('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setInviteEmail(suggestion?.email);
    setShowSuggestions(false);
  };

  const handleEmailChange = (e) => {
    setInviteEmail(e?.target?.value);
    setShowSuggestions(e?.target?.value?.length > 0 && filteredSuggestions?.length > 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Add People</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowCustomMessage(!showCustomMessage)}
          iconName={showCustomMessage ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          iconSize={16}
          className="btn-press"
        >
          Custom Message
        </Button>
      </div>
      <div className="bg-surface rounded-lg border border-border p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Input
              type="email"
              label="Email Address"
              placeholder="Enter email address..."
              value={inviteEmail}
              onChange={handleEmailChange}
              onKeyPress={(e) => e?.key === 'Enter' && handleInvite()}
              className="w-full"
            />
            
            {/* Email Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions?.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-elevated z-50 max-h-48 overflow-y-auto">
                {filteredSuggestions?.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full flex items-center space-x-3 p-3 hover:bg-muted collaborative-transition text-left"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                      style={{ backgroundColor: suggestion?.color || '#2563EB' }}
                    >
                      {suggestion?.name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {suggestion?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {suggestion?.email}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Select
              label="Role"
              options={roleOptions}
              value={selectedRole}
              onChange={setSelectedRole}
              className="w-full"
            />
          </div>
        </div>

        {showCustomMessage && (
          <div className="animate-fade-in-backdrop">
            <Input
              type="text"
              label="Custom Message (Optional)"
              placeholder="Add a personal message to the invitation..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e?.target?.value)}
              className="w-full"
            />
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>Invitees will receive an email notification</span>
          </div>
          
          <Button
            variant="default"
            onClick={handleInvite}
            disabled={!inviteEmail?.trim()}
            iconName="Send"
            iconPosition="left"
            iconSize={16}
            className="btn-press"
          >
            Send Invitation
          </Button>
        </div>
      </div>
      {/* Quick Add Suggestions */}
      {suggestions?.length > 0 && !showSuggestions && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Suggested People</p>
          <div className="flex flex-wrap gap-2">
            {suggestions?.slice(0, 6)?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="flex items-center space-x-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg collaborative-transition"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: suggestion?.color || '#2563EB' }}
                >
                  {suggestion?.name?.charAt(0)}
                </div>
                <span className="text-sm text-foreground">{suggestion?.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPeopleSection;