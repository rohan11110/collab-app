import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CollaborationSettingsTab = ({ onUpdateCollaboration }) => {
  const [defaultPermissions, setDefaultPermissions] = useState('editor');
  const [autoSaveSettings, setAutoSaveSettings] = useState({
    enabled: true,
    interval: '30',
    showIndicator: true
  });
  const [editorSettings, setEditorSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    showLineNumbers: false,
    wordWrap: true,
    spellCheck: true
  });
  const [keyboardShortcuts, setKeyboardShortcuts] = useState({
    enabled: true,
    customShortcuts: false
  });
  const [collaborationFeatures, setCollaborationFeatures] = useState({
    showCursors: true,
    showSelections: true,
    enableChat: true,
    enableComments: true,
    enableSuggestions: true,
    enableVersionHistory: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const permissionOptions = [
    { value: 'viewer', label: 'Viewer', description: 'Can only view documents' },
    { value: 'commenter', label: 'Commenter', description: 'Can view and comment' },
    { value: 'editor', label: 'Editor', description: 'Can view, comment, and edit' }
  ];

  const autoSaveIntervalOptions = [
    { value: '10', label: '10 seconds' },
    { value: '30', label: '30 seconds' },
    { value: '60', label: '1 minute' },
    { value: '300', label: '5 minutes' },
    { value: 'manual', label: 'Manual only' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'auto', label: 'Auto (System)' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Small (12px)' },
    { value: 'medium', label: 'Medium (14px)' },
    { value: 'large', label: 'Large (16px)' },
    { value: 'xlarge', label: 'Extra Large (18px)' }
  ];

  const handleAutoSaveChange = (field, value) => {
    setAutoSaveSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditorChange = (field, value) => {
    setEditorSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleKeyboardShortcutsChange = (field, value) => {
    setKeyboardShortcuts(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCollaborationFeatureChange = (field, value) => {
    setCollaborationFeatures(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdateCollaboration?.({
        defaultPermissions,
        autoSave: autoSaveSettings,
        editor: editorSettings,
        keyboard: keyboardShortcuts,
        collaboration: collaborationFeatures
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update collaboration settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const shortcutsList = [
    { action: 'Save Document', shortcut: 'Ctrl + S' },
    { action: 'Bold Text', shortcut: 'Ctrl + B' },
    { action: 'Italic Text', shortcut: 'Ctrl + I' },
    { action: 'Underline Text', shortcut: 'Ctrl + U' },
    { action: 'Add Comment', shortcut: 'Ctrl + Alt + M' },
    { action: 'Share Document', shortcut: 'Ctrl + Shift + S' },
    { action: 'Find & Replace', shortcut: 'Ctrl + H' },
    { action: 'Toggle Chat', shortcut: 'Ctrl + /' }
  ];

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3 animate-fade-in-backdrop">
          <Icon name="Check" size={20} className="text-success" />
          <span className="text-success font-medium">Collaboration settings updated successfully!</span>
        </div>
      )}
      {/* Default Document Permissions */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Default Document Permissions</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Set the default permission level for new collaborators when you share documents.
        </p>
        
        <div className="space-y-3">
          {permissionOptions?.map((option) => (
            <label key={option?.value} className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 collaborative-transition cursor-pointer">
              <input
                type="radio"
                name="defaultPermissions"
                value={option?.value}
                checked={defaultPermissions === option?.value}
                onChange={(e) => setDefaultPermissions(e?.target?.value)}
                className="mt-1 w-4 h-4 text-primary border-border focus:ring-primary"
              />
              <div>
                <p className="font-medium text-foreground">{option?.label}</p>
                <p className="text-sm text-muted-foreground">{option?.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
      {/* Auto-Save Settings */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Save" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Auto-Save Settings</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Configure how frequently your documents are automatically saved.
        </p>
        
        <div className="space-y-4">
          <Checkbox
            checked={autoSaveSettings?.enabled}
            onChange={(e) => handleAutoSaveChange('enabled', e?.target?.checked)}
            label="Enable auto-save"
            description="Automatically save changes while you work"
          />
          
          {autoSaveSettings?.enabled && (
            <div className="ml-6 space-y-4">
              <Select
                label="Auto-save interval"
                options={autoSaveIntervalOptions}
                value={autoSaveSettings?.interval}
                onChange={(value) => handleAutoSaveChange('interval', value)}
                className="max-w-xs"
              />
              
              <Checkbox
                checked={autoSaveSettings?.showIndicator}
                onChange={(e) => handleAutoSaveChange('showIndicator', e?.target?.checked)}
                label="Show save indicator"
                description="Display a visual indicator when auto-saving"
              />
            </div>
          )}
        </div>
      </div>
      {/* Editor Customization */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Editor Customization</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Customize your document editing experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Theme"
            options={themeOptions}
            value={editorSettings?.theme}
            onChange={(value) => handleEditorChange('theme', value)}
          />
          
          <Select
            label="Font Size"
            options={fontSizeOptions}
            value={editorSettings?.fontSize}
            onChange={(value) => handleEditorChange('fontSize', value)}
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <Checkbox
            checked={editorSettings?.showLineNumbers}
            onChange={(e) => handleEditorChange('showLineNumbers', e?.target?.checked)}
            label="Show line numbers"
            description="Display line numbers in the editor"
          />
          
          <Checkbox
            checked={editorSettings?.wordWrap}
            onChange={(e) => handleEditorChange('wordWrap', e?.target?.checked)}
            label="Word wrap"
            description="Wrap long lines to fit the editor width"
          />
          
          <Checkbox
            checked={editorSettings?.spellCheck}
            onChange={(e) => handleEditorChange('spellCheck', e?.target?.checked)}
            label="Spell check"
            description="Enable spell checking while typing"
          />
        </div>
      </div>
      {/* Collaboration Features */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Users" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Collaboration Features</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Control which collaboration features are enabled in your documents.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox
            checked={collaborationFeatures?.showCursors}
            onChange={(e) => handleCollaborationFeatureChange('showCursors', e?.target?.checked)}
            label="Show collaborator cursors"
            description="Display other users' cursor positions"
          />
          
          <Checkbox
            checked={collaborationFeatures?.showSelections}
            onChange={(e) => handleCollaborationFeatureChange('showSelections', e?.target?.checked)}
            label="Show text selections"
            description="Highlight text selected by collaborators"
          />
          
          <Checkbox
            checked={collaborationFeatures?.enableChat}
            onChange={(e) => handleCollaborationFeatureChange('enableChat', e?.target?.checked)}
            label="Enable chat"
            description="Allow real-time chat in documents"
          />
          
          <Checkbox
            checked={collaborationFeatures?.enableComments}
            onChange={(e) => handleCollaborationFeatureChange('enableComments', e?.target?.checked)}
            label="Enable comments"
            description="Allow commenting on document content"
          />
          
          <Checkbox
            checked={collaborationFeatures?.enableSuggestions}
            onChange={(e) => handleCollaborationFeatureChange('enableSuggestions', e?.target?.checked)}
            label="Enable suggestions"
            description="Allow suggesting changes to documents"
          />
          
          <Checkbox
            checked={collaborationFeatures?.enableVersionHistory}
            onChange={(e) => handleCollaborationFeatureChange('enableVersionHistory', e?.target?.checked)}
            label="Enable version history"
            description="Track and restore document versions"
          />
        </div>
      </div>
      {/* Keyboard Shortcuts */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Keyboard" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Keyboard Shortcuts</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Manage keyboard shortcuts for faster document editing.
        </p>
        
        <div className="space-y-4 mb-6">
          <Checkbox
            checked={keyboardShortcuts?.enabled}
            onChange={(e) => handleKeyboardShortcutsChange('enabled', e?.target?.checked)}
            label="Enable keyboard shortcuts"
            description="Use keyboard shortcuts for common actions"
          />
          
          <Checkbox
            checked={keyboardShortcuts?.customShortcuts}
            onChange={(e) => handleKeyboardShortcutsChange('customShortcuts', e?.target?.checked)}
            label="Enable custom shortcuts"
            description="Create your own keyboard shortcuts"
            disabled={!keyboardShortcuts?.enabled}
          />
        </div>
        
        {keyboardShortcuts?.enabled && (
          <div className="bg-surface rounded-lg border border-border p-4">
            <h4 className="font-medium text-foreground mb-3">Available Shortcuts</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {shortcutsList?.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 collaborative-transition">
                  <span className="text-sm text-foreground">{shortcut?.action}</span>
                  <kbd className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded font-mono">
                    {shortcut?.shortcut}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        )}
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
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default CollaborationSettingsTab;