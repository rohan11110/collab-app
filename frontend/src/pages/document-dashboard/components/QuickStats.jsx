import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats = {} }) => {
  const statItems = [
    {
      label: 'Total Documents',
      value: stats?.totalDocuments || 0,
      icon: 'FileText',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Shared with Me',
      value: stats?.sharedDocuments || 0,
      icon: 'Users',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Recent Activity',
      value: stats?.recentActivity || 0,
      icon: 'Activity',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Collaborators',
      value: stats?.totalCollaborators || 0,
      icon: 'UserPlus',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statItems?.map((item, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4 hover:shadow-md collaborative-transition">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item?.bgColor}`}>
              <Icon name={item?.icon} size={20} className={item?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-semibold text-card-foreground">
                {item?.value?.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {item?.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;