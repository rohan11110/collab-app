import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'document_created': return 'FileText';
      case 'document_shared': return 'Share2';
      case 'document_edited': return 'Edit3';
      case 'comment_added': return 'MessageSquare';
      case 'user_joined': return 'UserPlus';
      case 'document_exported': return 'Download';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'document_created': return 'text-success';
      case 'document_shared': return 'text-accent';
      case 'document_edited': return 'text-primary';
      case 'comment_added': return 'text-warning';
      case 'user_joined': return 'text-secondary';
      case 'document_exported': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const formatActivityTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (activities?.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="Activity" size={32} className="mx-auto mb-2 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">No recent activity</p>
        <p className="text-xs text-muted-foreground mt-1">
          Activity will appear here as you collaborate
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities?.map((activity, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 collaborative-transition">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-surface border border-border flex-shrink-0`}>
            <Icon 
              name={getActivityIcon(activity?.type)} 
              size={14} 
              className={getActivityColor(activity?.type)} 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              {activity?.user?.avatar ? (
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium text-white"
                  style={{ backgroundColor: activity?.user?.color || '#2563EB' }}
                >
                  {activity?.user?.name?.charAt(0)}
                </div>
              ) : (
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-foreground">
                    {activity?.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-card-foreground">
                {activity?.user?.name || 'Unknown User'}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mt-1">
              {activity?.description}
            </p>
            
            {activity?.documentTitle && (
              <p className="text-xs text-primary mt-1 font-medium">
                {activity?.documentTitle}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground mt-1 font-mono">
              {formatActivityTime(activity?.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;