import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SharingHistory = ({ history = [] }) => {
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filterOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'invitations', label: 'Invitations' },
    { value: 'access', label: 'Document Access' },
    { value: 'permissions', label: 'Permission Changes' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'user', label: 'By User' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'invitation_sent': return 'Mail';
      case 'invitation_accepted': return 'UserCheck';
      case 'invitation_declined': return 'UserX';
      case 'document_accessed': return 'Eye';
      case 'permission_changed': return 'Shield';
      case 'user_removed': return 'UserMinus';
      case 'link_created': return 'Link';
      case 'link_accessed': return 'ExternalLink';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'invitation_sent': return 'text-primary';
      case 'invitation_accepted': return 'text-success';
      case 'invitation_declined': return 'text-error';
      case 'document_accessed': return 'text-accent';
      case 'permission_changed': return 'text-warning';
      case 'user_removed': return 'text-error';
      case 'link_created': return 'text-primary';
      case 'link_accessed': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getActivityDescription = (activity) => {
    switch (activity?.type) {
      case 'invitation_sent':
        return `Invitation sent to ${activity?.targetUser}`;
      case 'invitation_accepted':
        return `${activity?.user} accepted invitation`;
      case 'invitation_declined':
        return `${activity?.user} declined invitation`;
      case 'document_accessed':
        return `${activity?.user} accessed the document`;
      case 'permission_changed':
        return `${activity?.user}'s role changed to ${activity?.newRole}`;
      case 'user_removed':
        return `${activity?.user} was removed from document`;
      case 'link_created':
        return `Public sharing link created`;
      case 'link_accessed':
        return `Document accessed via public link`;
      default:
        return activity?.description || 'Unknown activity';
    }
  };

  const filteredHistory = history?.filter(item => {
    if (filterType === 'all') return true;
    if (filterType === 'invitations') {
      return ['invitation_sent', 'invitation_accepted', 'invitation_declined']?.includes(item?.type);
    }
    if (filterType === 'access') {
      return ['document_accessed', 'link_accessed']?.includes(item?.type);
    }
    if (filterType === 'permissions') {
      return ['permission_changed', 'user_removed']?.includes(item?.type);
    }
    return true;
  });

  const sortedHistory = [...filteredHistory]?.sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    if (sortBy === 'oldest') {
      return new Date(a.timestamp) - new Date(b.timestamp);
    }
    if (sortBy === 'user') {
      return (a?.user || '')?.localeCompare(b?.user || '');
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Sharing History</h3>
        <span className="text-sm text-muted-foreground">
          {history?.length} activit{history?.length !== 1 ? 'ies' : 'y'}
        </span>
      </div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select
          options={filterOptions}
          value={filterType}
          onChange={setFilterType}
          className="flex-1"
        />
        <Select
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
          className="flex-1"
        />
      </div>
      {/* History List */}
      <div className="bg-surface rounded-lg border border-border">
        {sortedHistory?.length > 0 ? (
          <div className="divide-y divide-border">
            {sortedHistory?.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-muted/50 collaborative-transition">
                <div className="flex items-start space-x-3">
                  <div className={`mt-1 ${getActivityColor(activity?.type)}`}>
                    <Icon name={getActivityIcon(activity?.type)} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      {getActivityDescription(activity)}
                    </p>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        {activity?.timestamp}
                      </span>
                      
                      {activity?.ipAddress && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {activity?.ipAddress}
                          </span>
                        </>
                      )}
                      
                      {activity?.location && (
                        <>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {activity?.location}
                          </span>
                        </>
                      )}
                    </div>

                    {activity?.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity?.details}
                      </p>
                    )}
                  </div>

                  {activity?.status && (
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        activity?.status === 'success' ? 'bg-success/10 text-success' :
                        activity?.status === 'pending' ? 'bg-warning/10 text-warning' :
                        activity?.status === 'failed'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
                      }`}>
                        {activity?.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Clock" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No sharing activity yet</p>
            <p className="text-xs mt-1">Activity will appear here when you share the document</p>
          </div>
        )}
      </div>
      {/* Export History */}
      {history?.length > 0 && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            iconSize={16}
            className="btn-press"
          >
            Export History
          </Button>
        </div>
      )}
    </div>
  );
};

export default SharingHistory;