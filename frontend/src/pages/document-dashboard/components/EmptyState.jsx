import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ 
  type = 'no-documents',
  title,
  description,
  actionLabel,
  onAction
}) => {
  const navigate = useNavigate();

  const getEmptyStateConfig = () => {
    switch (type) {
      case 'no-documents':
        return {
          icon: 'FileText',
          title: title || 'No documents yet',
          description: description || `Get started by creating your first collaborative document. You can invite team members to edit together in real-time.`,
          actionLabel: actionLabel || 'Create Your First Document',
          action: onAction || (() => navigate('/document-editor'))
        };
      case 'no-search-results':
        return {
          icon: 'Search',
          title: title || 'No documents found',
          description: description || `We couldn't find any documents matching your search. Try adjusting your search terms or filters.`,
          actionLabel: actionLabel || 'Clear Search',
          action: onAction
        };
      case 'no-shared-documents':
        return {
          icon: 'Users',
          title: title || 'No shared documents',
          description: description || `You don't have any shared documents yet. Documents shared with you by others will appear here.`,
          actionLabel: actionLabel || 'Create New Document',
          action: onAction || (() => navigate('/document-editor'))
        };
      case 'no-recent-activity':
        return {
          icon: 'Activity',
          title: title || 'No recent activity',
          description: description || `There's no recent activity to show. Start collaborating on documents to see updates here.`,
          actionLabel: actionLabel || 'Browse Documents',
          action: onAction
        };
      default:
        return {
          icon: 'FileText',
          title: title || 'Nothing here yet',
          description: description || 'Content will appear here once available.',
          actionLabel: actionLabel || 'Get Started',
          action: onAction
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name={config?.icon} size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium text-card-foreground mb-2">
        {config?.title}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {config?.description}
      </p>
      {config?.actionLabel && config?.action && (
        <Button
          variant="default"
          onClick={config?.action}
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
          className="btn-press"
        >
          {config?.actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;