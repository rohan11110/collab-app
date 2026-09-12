import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const DocumentCard = ({ 
  document, 
  viewMode = 'grid',
  isSelected = false,
  onSelect,
  onShare,
  onDuplicate,
  onDelete,
  onToggleStar
}) => {
  const [showActions, setShowActions] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    if (e?.target?.closest('.action-button') || e?.target?.closest('.checkbox-wrapper')) {
      return;
    }
    navigate(`/document-editor/${document?.id}`);
  };

  const getCollaboratorAvatars = () => {
    const maxVisible = viewMode === 'grid' ? 3 : 5;
    const visibleCollaborators = document?.collaborators?.slice(0, maxVisible) || [];
    const remainingCount = (document?.collaborators?.length || 0) - maxVisible;

    return (
      <div className="flex items-center -space-x-1">
        {visibleCollaborators?.map((collaborator, index) => (
          <div
            key={collaborator?.id}
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-background"
            style={{ 
              backgroundColor: collaborator?.color || '#2563EB',
              zIndex: visibleCollaborators?.length - index 
            }}
            title={collaborator?.name}
          >
            {collaborator?.name?.charAt(0)}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium text-muted-foreground border-2 border-background">
            +{remainingCount}
          </div>
        )}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (viewMode === 'list') {
    return (
      <div 
        className={`group flex items-center p-4 bg-card border border-border rounded-lg hover:shadow-md collaborative-transition cursor-pointer ${
          isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
        }`}
        onClick={handleCardClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Checkbox */}
        <div className="checkbox-wrapper mr-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect?.(document?.id, e?.target?.checked)}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
          />
        </div>
        {/* Document Icon */}
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
          <Icon name="FileText" size={20} className="text-primary" />
        </div>
        {/* Document Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-medium text-card-foreground truncate">
              {document?.title}
            </h3>
            {document?.isStarred && (
              <Icon name="Star" size={14} className="text-warning fill-current" />
            )}
            {document?.isShared && (
              <Icon name="Users" size={14} className="text-accent" />
            )}
          </div>
          <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
            <span>Modified {formatDate(document?.lastModified)}</span>
            <span>{document?.size}</span>
            <span>{document?.wordCount} words</span>
          </div>
        </div>
        {/* Collaborators */}
        <div className="mr-4">
          {getCollaboratorAvatars()}
        </div>
        {/* Actions */}
        <div className={`flex items-center space-x-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onToggleStar?.(document?.id);
            }}
            className="action-button btn-press"
          >
            <Icon name={document?.isStarred ? "Star" : "Star"} size={16} className={document?.isStarred ? "text-warning fill-current" : ""} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onShare?.(document?.id);
            }}
            className="action-button btn-press"
          >
            <Icon name="Share2" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onDuplicate?.(document?.id);
            }}
            className="action-button btn-press"
          >
            <Icon name="Copy" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onDelete?.(document?.id);
            }}
            className="action-button btn-press text-error hover:text-error"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group bg-card border border-border rounded-lg overflow-hidden hover:shadow-md collaborative-transition cursor-pointer ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
      onClick={handleCardClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-surface overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="FileText" size={32} className="text-muted-foreground" />
        </div>
        
        {/* Checkbox */}
        <div className="checkbox-wrapper absolute top-2 left-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect?.(document?.id, e?.target?.checked)}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
          />
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-2 right-2 flex space-x-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onToggleStar?.(document?.id);
            }}
            className="action-button btn-press bg-background/80 backdrop-blur-soft"
          >
            <Icon name={document?.isStarred ? "Star" : "Star"} size={14} className={document?.isStarred ? "text-warning fill-current" : ""} />
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-card-foreground truncate">
                {document?.title}
              </h3>
              {document?.isShared && (
                <Icon name="Users" size={12} className="text-accent flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(document?.lastModified)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{document?.wordCount} words</span>
          <span>{document?.size}</span>
        </div>

        {/* Collaborators and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {getCollaboratorAvatars()}
          </div>
          
          <div className={`flex items-center space-x-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e?.stopPropagation();
                onShare?.(document?.id);
              }}
              className="action-button btn-press"
            >
              <Icon name="Share2" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e?.stopPropagation();
                onDuplicate?.(document?.id);
              }}
              className="action-button btn-press"
            >
              <Icon name="Copy" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e?.stopPropagation();
                onDelete?.(document?.id);
              }}
              className="action-button btn-press text-error hover:text-error"
            >
              <Icon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;