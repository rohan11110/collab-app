import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import GlobalHeader from '../../components/ui/GlobalHeader';
import CollaboratorsList from './components/CollaboratorsList';
import AddPeopleSection from './components/AddPeopleSection';
import LinkSharingControls from './components/LinkSharingControls';
import SharingHistory from './components/SharingHistory';

const DocumentSharingSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('collaborators');
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data
  const currentUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150"
  };

  // Mock document data
  const [document] = useState({
    id: "doc_123",
    title: "Q4 Marketing Strategy Document",
    owner: currentUser,
    createdAt: "2025-08-10T10:30:00Z",
    lastModified: "2025-08-16T05:20:00Z"
  });

  // Mock collaborators data
  const [collaborators, setCollaborators] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "owner",
      status: "online",
      color: "#2563EB",
      isCurrentUser: true,
      lastActive: "Active now"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@example.com",
      role: "editor",
      status: "online",
      color: "#059669",
      isCurrentUser: false,
      lastActive: "2 minutes ago"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@example.com",
      role: "viewer",
      status: "away",
      color: "#DC2626",
      isCurrentUser: false,
      lastActive: "1 hour ago"
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@example.com",
      role: "editor",
      status: "offline",
      color: "#7C3AED",
      isCurrentUser: false,
      lastActive: "Yesterday"
    }
  ]);

  // Mock link sharing settings
  const [linkSettings, setLinkSettings] = useState({
    isPublic: true,
    accessLevel: "viewer",
    requirePassword: false,
    password: "",
    expiration: "never",
    customExpiration: "",
    preventDownload: false,
    preventCopy: false
  });

  // Mock suggestions for adding people
  const suggestions = [
    {
      name: "Alex Thompson",
      email: "alex.thompson@example.com",
      color: "#F59E0B"
    },
    {
      name: "Lisa Wang",
      email: "lisa.wang@example.com",
      color: "#8B5CF6"
    },
    {
      name: "James Wilson",
      email: "james.wilson@example.com",
      color: "#EF4444"
    },
    {
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      color: "#10B981"
    }
  ];

  // Mock sharing history
  const sharingHistory = [
    {
      type: "invitation_sent",
      targetUser: "alex.thompson@example.com",
      timestamp: "2025-08-16T04:30:00Z",
      status: "pending",
      ipAddress: "192.168.1.100",
      location: "New York, US"
    },
    {
      type: "invitation_accepted",
      user: "David Kim",
      timestamp: "2025-08-15T16:45:00Z",
      status: "success",
      ipAddress: "10.0.0.50",
      location: "San Francisco, US"
    },
    {
      type: "document_accessed",
      user: "Emily Rodriguez",
      timestamp: "2025-08-15T14:20:00Z",
      status: "success",
      ipAddress: "172.16.0.25",
      location: "Los Angeles, US"
    },
    {
      type: "permission_changed",
      user: "Michael Chen",
      newRole: "editor",
      timestamp: "2025-08-15T12:10:00Z",
      status: "success",
      details: "Role changed from viewer to editor"
    },
    {
      type: "link_created",
      timestamp: "2025-08-14T09:15:00Z",
      status: "success",
      details: "Public sharing link enabled"
    },
    {
      type: "link_accessed",
      timestamp: "2025-08-14T11:30:00Z",
      status: "success",
      ipAddress: "203.0.113.45",
      location: "Chicago, US"
    }
  ];

  // Mock notifications
  const notifications = [
    {
      title: "New collaborator joined",
      message: "David Kim accepted your invitation",
      time: "5 minutes ago",
      read: false
    },
    {
      title: "Document shared",
      message: "Link sharing has been enabled",
      time: "1 hour ago",
      read: true
    }
  ];

  const documentLink = `https://collabdocs.app/d/${document?.id}`;

  const tabs = [
    { id: 'collaborators', label: 'Collaborators', icon: 'Users', count: collaborators?.length },
    { id: 'link', label: 'Link Sharing', icon: 'Link' },
    { id: 'history', label: 'History', icon: 'Clock', count: sharingHistory?.length }
  ];

  const handleRoleChange = (collaboratorId, newRole) => {
    setCollaborators(prev => 
      prev?.map(collab => 
        collab?.id === collaboratorId 
          ? { ...collab, role: newRole }
          : collab
      )
    );
  };

  const handleRemoveCollaborator = (collaboratorId) => {
    setCollaborators(prev => prev?.filter(collab => collab?.id !== collaboratorId));
  };

  const handleInviteUser = ({ email, role, message }) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newCollaborator = {
        id: Date.now(),
        name: email?.split('@')?.[0]?.replace('.', ' ')?.replace(/\b\w/g, l => l?.toUpperCase()),
        email,
        role,
        status: "offline",
        color: `#${Math.floor(Math.random()*16777215)?.toString(16)}`,
        isCurrentUser: false,
        lastActive: "Invited"
      };
      
      setCollaborators(prev => [...prev, newCollaborator]);
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateLinkSettings = (newSettings) => {
    setLinkSettings(newSettings);
  };

  const handleClose = () => {
    // Navigate back to previous page or document editor
    const from = location?.state?.from || '/document-editor';
    navigate(from);
  };

  const handleLogout = () => {
    navigate('/login-screen');
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        user={currentUser}
        notifications={notifications}
        onLogout={handleLogout}
      />
      {/* Modal Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-soft z-1040 pt-16">
        <div className="flex items-center justify-center min-h-full p-4">
          <div className="w-full max-w-4xl bg-background rounded-lg shadow-elevated border border-border max-h-[90vh] flex flex-col animate-fade-in-backdrop">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <Icon name="Share2" size={24} className="text-primary" />
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    Share "{document?.title}"
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Manage collaboration and access permissions
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="btn-press"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-6">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 collaborative-transition ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                  {tab?.count !== undefined && (
                    <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">
                      {tab?.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'collaborators' && (
                <div className="space-y-8">
                  <CollaboratorsList
                    collaborators={collaborators}
                    onRoleChange={handleRoleChange}
                    onRemoveCollaborator={handleRemoveCollaborator}
                  />
                  
                  <AddPeopleSection
                    onInviteUser={handleInviteUser}
                    suggestions={suggestions}
                  />
                </div>
              )}

              {activeTab === 'link' && (
                <LinkSharingControls
                  linkSettings={linkSettings}
                  onUpdateLinkSettings={handleUpdateLinkSettings}
                  documentLink={documentLink}
                />
              )}

              {activeTab === 'history' && (
                <SharingHistory history={sharingHistory} />
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border bg-surface">
              <div className="text-sm text-muted-foreground">
                <Icon name="Shield" size={16} className="inline mr-1" />
                Your document is secured with end-to-end encryption
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="btn-press"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleClose}
                  iconName="Check"
                  iconPosition="left"
                  iconSize={16}
                  className="btn-press"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSharingSettings;