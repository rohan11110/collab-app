import React, { useState } from 'react';
import Button from '../ui/Button';
import Icon from '../AppIcon';

const EditorContextBar = ({ 
  document = {},
  collaborators = [],
  isSharing = false,
  onShare,
  onComment,
  onHistory,
  onExport,
  onSettings,
  showCollaborationPanel = false,
  onToggleCollaboration
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const shareOptions = [
    { value: 'link', label: 'Copy Link', icon: 'Link' },
    { value: 'email', label: 'Email Invite', icon: 'Mail' },
    { value: 'embed', label: 'Embed Code', icon: 'Code' },
  ];

  const exportOptions = [
    { value: 'pdf', label: 'Export as PDF', icon: 'FileText' },
    { value: 'docx', label: 'Export as DOCX', icon: 'FileDown' },
    { value: 'html', label: 'Export as HTML', icon: 'Globe' },
    { value: 'markdown', label: 'Export as Markdown', icon: 'Hash' },
  ];

  const getCollaboratorAvatars = () => {
    return collaborators?.slice(0, 3)?.map((collaborator, index) => (
      <div
        key={collaborator?.id}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white -ml-2 first:ml-0 border-2 border-background animate-presence-glow`}
        style={{ 
          backgroundColor: collaborator?.color || '#2563EB',
          zIndex: collaborators?.length - index 
        }}
        title={`${collaborator?.name} - ${collaborator?.status}`}
      >
        {collaborator?.name?.charAt(0)}
      </div>
    ));
  };

  return (
    <div className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side - Document Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={20} className="text-muted-foreground" />
            <div>
              <h1 className="text-lg font-medium text-foreground truncate max-w-xs">
                {document?.title || 'Untitled Document'}
              </h1>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span className="font-mono">
                  {document?.lastModified || 'Just now'}
                </span>
                <span>•</span>
                <span>{document?.wordCount || 0} words</span>
                {document?.autoSaved && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Check" size={12} className="text-success" />
                      <span className="text-success">Saved</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center - Collaboration Status */}
        <div className="hidden md:flex items-center space-x-3">
          {collaborators?.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {getCollaboratorAvatars()}
                {collaborators?.length > 3 && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground -ml-2 border-2 border-background">
                    +{collaborators?.length - 3}
                  </div>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {collaborators?.length} collaborator{collaborators?.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-2">
          {/* Comments */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onComment}
            iconName="MessageSquare"
            iconPosition="left"
            iconSize={16}
            className="btn-press hidden sm:flex"
          >
            Comments
          </Button>

          {/* History */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onHistory}
            iconName="History"
            iconPosition="left"
            iconSize={16}
            className="btn-press hidden sm:flex"
          >
            History
          </Button>

          {/* Share Menu */}
          <div className="relative">
            <Button
              variant={isSharing ? "default" : "outline"}
              size="sm"
              onClick={() => setShowShareMenu(!showShareMenu)}
              iconName="Share2"
              iconPosition="left"
              iconSize={16}
              className="btn-press"
            >
              Share
            </Button>

            {showShareMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated z-1100 animate-fade-in-backdrop">
                <div className="p-1">
                  {shareOptions?.map((option) => (
                    <Button
                      key={option?.value}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onShare?.(option?.value);
                        setShowShareMenu(false);
                      }}
                      iconName={option?.icon}
                      iconPosition="left"
                      iconSize={16}
                      className="w-full justify-start"
                    >
                      {option?.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Export Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExportMenu(!showExportMenu)}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
              className="btn-press hidden sm:flex"
            >
              Export
            </Button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated z-1100 animate-fade-in-backdrop">
                <div className="p-1">
                  {exportOptions?.map((option) => (
                    <Button
                      key={option?.value}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onExport?.(option?.value);
                        setShowExportMenu(false);
                      }}
                      iconName={option?.icon}
                      iconPosition="left"
                      iconSize={16}
                      className="w-full justify-start"
                    >
                      {option?.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Collaboration Panel Toggle */}
          <Button
            variant={showCollaborationPanel ? "default" : "ghost"}
            size="sm"
            onClick={onToggleCollaboration}
            iconName="Users"
            iconPosition="left"
            iconSize={16}
            className="btn-press"
          >
            <span className="hidden sm:inline">Collaborate</span>
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettings}
            className="btn-press"
          >
            <Icon name="Settings" size={16} />
          </Button>
        </div>
      </div>
      {/* Mobile Collaboration Info */}
      {collaborators?.length > 0 && (
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {getCollaboratorAvatars()}
              {collaborators?.length > 3 && (
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground -ml-1 border border-background">
                  +{collaborators?.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {collaborators?.length} active
            </span>
          </div>
        </div>
      )}
      {/* Overlay for dropdowns */}
      {(showShareMenu || showExportMenu) && (
        <div
          className="fixed inset-0 z-1050"
          onClick={() => {
            setShowShareMenu(false);
            setShowExportMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default EditorContextBar;