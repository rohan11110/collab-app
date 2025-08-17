import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VersionHistory = ({ 
  isOpen = false,
  onClose,
  versions = [],
  onRestoreVersion,
  currentVersion
}) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVersionIcon = (version) => {
    if (version?.type === 'auto') return 'Clock';
    if (version?.type === 'manual') return 'Save';
    if (version?.type === 'collaborative') return 'Users';
    return 'FileText';
  };

  const getVersionColor = (version) => {
    if (version?.id === currentVersion) return 'text-primary';
    if (version?.type === 'manual') return 'text-success';
    if (version?.type === 'collaborative') return 'text-accent';
    return 'text-muted-foreground';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-soft z-1050 lg:hidden"
        onClick={onClose}
      />
      {/* Version History Panel */}
      <div className="fixed right-0 top-16 bottom-0 w-full max-w-md lg:w-96 bg-background border-l border-border z-1100 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Version History</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="btn-press"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Version List */}
        <div className="flex-1 overflow-y-auto">
          {versions?.length > 0 ? (
            <div className="p-4 space-y-3">
              {versions?.map((version, index) => (
                <div
                  key={version?.id}
                  className={`p-3 rounded-lg border cursor-pointer collaborative-transition ${
                    selectedVersion?.id === version?.id
                      ? 'border-primary bg-primary/5' :'border-border hover:border-muted-foreground hover:bg-muted/50'
                  } ${version?.id === currentVersion ? 'ring-2 ring-primary/20' : ''}`}
                  onClick={() => setSelectedVersion(version)}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`mt-1 ${getVersionColor(version)}`}>
                      <Icon name={getVersionIcon(version)} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">
                          {version?.title || `Version ${versions?.length - index}`}
                        </p>
                        {version?.id === currentVersion && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(version?.timestamp)} • {version?.author}
                      </p>
                      {version?.changes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {version?.changes} changes
                        </p>
                      )}
                      {version?.description && (
                        <p className="text-xs text-foreground mt-2">
                          {version?.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Icon name="History" size={48} className="mb-4 opacity-50" />
              <p className="text-sm">No version history available</p>
              <p className="text-xs mt-1">Versions will appear as you make changes</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {selectedVersion && (
          <div className="p-4 border-t border-border bg-surface">
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-foreground">
                  {selectedVersion?.title || 'Selected Version'}
                </p>
                <p className="text-muted-foreground">
                  {formatDate(selectedVersion?.timestamp)} by {selectedVersion?.author}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(true)}
                  iconName="Eye"
                  iconPosition="left"
                  iconSize={14}
                  className="flex-1 btn-press"
                >
                  Preview
                </Button>
                {selectedVersion?.id !== currentVersion && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onRestoreVersion?.(selectedVersion)}
                    iconName="RotateCcw"
                    iconPosition="left"
                    iconSize={14}
                    className="flex-1 btn-press"
                  >
                    Restore
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Preview Modal */}
      {showPreview && selectedVersion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-soft z-1200 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-lg shadow-elevated max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Version Preview
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedVersion?.title || 'Untitled'} • {formatDate(selectedVersion?.timestamp)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreview(false)}
                className="btn-press"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-lg max-w-none">
                <div className="bg-muted/30 p-4 rounded-lg text-center text-muted-foreground">
                  <Icon name="FileText" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Version preview would be displayed here</p>
                  <p className="text-xs mt-1">
                    Content from {formatDate(selectedVersion?.timestamp)}
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Actions */}
            <div className="flex justify-end space-x-2 p-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="btn-press"
              >
                Close
              </Button>
              {selectedVersion?.id !== currentVersion && (
                <Button
                  variant="default"
                  onClick={() => {
                    onRestoreVersion?.(selectedVersion);
                    setShowPreview(false);
                  }}
                  iconName="RotateCcw"
                  iconPosition="left"
                  iconSize={16}
                  className="btn-press"
                >
                  Restore This Version
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VersionHistory;