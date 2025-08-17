import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CollaboratorsList = ({ collaborators = [], onRoleChange, onRemoveCollaborator }) => {
  const [editingRole, setEditingRole] = useState(null);

  const roleOptions = [
    { value: 'owner', label: 'Owner', description: 'Full control over document' },
    { value: 'editor', label: 'Editor', description: 'Can edit and comment' },
    { value: 'viewer', label: 'Viewer', description: 'Can only view document' }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return 'text-primary';
      case 'editor': return 'text-accent';
      case 'viewer': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return 'Crown';
      case 'editor': return 'Edit';
      case 'viewer': return 'Eye';
      default: return 'User';
    }
  };

  const handleRoleChange = (collaboratorId, newRole) => {
    onRoleChange?.(collaboratorId, newRole);
    setEditingRole(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Current Collaborators</h3>
        <span className="text-sm text-muted-foreground">
          {collaborators?.length} member{collaborators?.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-3">
        {collaborators?.map((collaborator) => (
          <div
            key={collaborator?.id}
            className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border hover:bg-muted/50 collaborative-transition"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                  style={{ backgroundColor: collaborator?.color || '#2563EB' }}
                >
                  {collaborator?.name?.charAt(0)}
                </div>
                {collaborator?.status === 'online' && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-foreground truncate">
                    {collaborator?.name}
                  </p>
                  {collaborator?.isCurrentUser && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                      You
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {collaborator?.email}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Icon 
                    name={getRoleIcon(collaborator?.role)} 
                    size={12} 
                    className={getRoleColor(collaborator?.role)} 
                  />
                  <span className={`text-xs font-medium ${getRoleColor(collaborator?.role)}`}>
                    {collaborator?.role?.charAt(0)?.toUpperCase() + collaborator?.role?.slice(1)}
                  </span>
                  {collaborator?.lastActive && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {collaborator?.lastActive}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {editingRole === collaborator?.id ? (
                <div className="flex items-center space-x-2">
                  <Select
                    options={roleOptions}
                    value={collaborator?.role}
                    onChange={(value) => handleRoleChange(collaborator?.id, value)}
                    className="w-32"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingRole(null)}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              ) : (
                <>
                  {!collaborator?.isCurrentUser && collaborator?.role !== 'owner' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingRole(collaborator?.id)}
                      iconName="Edit"
                      iconPosition="left"
                      iconSize={14}
                      className="btn-press"
                    >
                      Change Role
                    </Button>
                  )}
                  
                  {!collaborator?.isCurrentUser && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveCollaborator?.(collaborator?.id)}
                      className="btn-press text-error hover:text-error"
                    >
                      <Icon name="UserMinus" size={16} />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {collaborators?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Users" size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No collaborators yet</p>
            <p className="text-xs mt-1">Add people to start collaborating</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaboratorsList;