import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import DashboardToolbar from '../../components/ui/DashboardToolbar';

import DocumentGrid from './components/DocumentGrid';
import ActivityFeed from './components/ActivityFeed';
import QuickStats from './components/QuickStats';
import EmptyState from './components/EmptyState';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const DocumentDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('modified');
  const [filterBy, setFilterBy] = useState('all');
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showActivitySidebar, setShowActivitySidebar] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock user data
  const currentUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "Document shared",
      message: "Michael shared \'Project Proposal\' with you",
      time: "2 minutes ago",
      read: false
    },
    {
      id: 2,
      title: "New comment",
      message: "Emma added a comment to \'Marketing Strategy'",
      time: "15 minutes ago",
      read: false
    },
    {
      id: 3,
      title: "Document updated",
      message: "Alex made changes to \'Technical Specs'",
      time: "1 hour ago",
      read: true
    }
  ];

  // Mock documents data
  const mockDocuments = [
    {
      id: 1,
      title: "Project Proposal - Q4 2024",
      lastModified: "2024-08-16T04:30:00Z",
      size: "2.4 MB",
      wordCount: 1247,
      isStarred: true,
      isShared: true,
      owner: "Sarah Johnson",
      collaborators: [
        { id: 1, name: "Michael Chen", color: "#2563EB" },
        { id: 2, name: "Emma Wilson", color: "#059669" },
        { id: 3, name: "Alex Rodriguez", color: "#DC2626" }
      ],
      type: "document",
      status: "active"
    },
    {
      id: 2,
      title: "Marketing Strategy Document",
      lastModified: "2024-08-16T02:15:00Z",
      size: "1.8 MB",
      wordCount: 892,
      isStarred: false,
      isShared: true,
      owner: "Emma Wilson",
      collaborators: [
        { id: 1, name: "Sarah Johnson", color: "#7C3AED" },
        { id: 4, name: "David Kim", color: "#EA580C" }
      ],
      type: "document",
      status: "active"
    },
    {
      id: 3,
      title: "Technical Specifications",
      lastModified: "2024-08-15T16:45:00Z",
      size: "3.1 MB",
      wordCount: 2156,
      isStarred: true,
      isShared: false,
      owner: "Sarah Johnson",
      collaborators: [
        { id: 5, name: "Lisa Park", color: "#0891B2" }
      ],
      type: "document",
      status: "active"
    },
    {
      id: 4,
      title: "Meeting Notes - August 15",
      lastModified: "2024-08-15T14:20:00Z",
      size: "0.9 MB",
      wordCount: 456,
      isStarred: false,
      isShared: true,
      owner: "Michael Chen",
      collaborators: [
        { id: 1, name: "Sarah Johnson", color: "#7C3AED" },
        { id: 2, name: "Emma Wilson", color: "#059669" },
        { id: 6, name: "Tom Anderson", color: "#DC2626" }
      ],
      type: "document",
      status: "active"
    },
    {
      id: 5,
      title: "Budget Analysis 2024",
      lastModified: "2024-08-14T11:30:00Z",
      size: "1.5 MB",
      wordCount: 734,
      isStarred: false,
      isShared: false,
      owner: "Sarah Johnson",
      collaborators: [],
      type: "document",
      status: "active"
    },
    {
      id: 6,
      title: "User Research Findings",
      lastModified: "2024-08-13T09:15:00Z",
      size: "4.2 MB",
      wordCount: 1823,
      isStarred: true,
      isShared: true,
      owner: "Emma Wilson",
      collaborators: [
        { id: 1, name: "Sarah Johnson", color: "#7C3AED" },
        { id: 7, name: "Rachel Green", color: "#059669" }
      ],
      type: "document",
      status: "active"
    }
  ];

  // Mock activity data
  const mockActivities = [
    {
      id: 1,
      type: "document_edited",
      user: { name: "Michael Chen", color: "#2563EB" },
      description: "edited Project Proposal - Q4 2024",
      documentTitle: "Project Proposal - Q4 2024",
      timestamp: "2024-08-16T04:30:00Z"
    },
    {
      id: 2,
      type: "comment_added",
      user: { name: "Emma Wilson", color: "#059669" },
      description: "added a comment to Marketing Strategy Document",
      documentTitle: "Marketing Strategy Document",
      timestamp: "2024-08-16T03:45:00Z"
    },
    {
      id: 3,
      type: "document_shared",
      user: { name: "Sarah Johnson", color: "#7C3AED" },
      description: "shared Technical Specifications with Lisa Park",
      documentTitle: "Technical Specifications",
      timestamp: "2024-08-16T02:20:00Z"
    },
    {
      id: 4,
      type: "user_joined",
      user: { name: "Tom Anderson", color: "#DC2626" },
      description: "joined Meeting Notes - August 15",
      documentTitle: "Meeting Notes - August 15",
      timestamp: "2024-08-15T16:10:00Z"
    },
    {
      id: 5,
      type: "document_created",
      user: { name: "Sarah Johnson", color: "#7C3AED" },
      description: "created Budget Analysis 2024",
      documentTitle: "Budget Analysis 2024",
      timestamp: "2024-08-14T11:30:00Z"
    }
  ];

  // Calculate stats
  const stats = useMemo(() => {
    const totalDocuments = mockDocuments?.length;
    const sharedDocuments = mockDocuments?.filter(doc => doc?.isShared)?.length;
    const recentActivity = mockActivities?.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return activityDate > oneDayAgo;
    })?.length;
    const totalCollaborators = new Set(
      mockDocuments.flatMap(doc => doc.collaborators.map(collab => collab.id))
    )?.size;

    return {
      totalDocuments,
      sharedDocuments,
      recentActivity,
      totalCollaborators
    };
  }, [mockDocuments, mockActivities]);

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = [...mockDocuments];

    // Apply search filter
    if (searchQuery?.trim()) {
      filtered = filtered?.filter(doc =>
        doc?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        doc?.owner?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply category filter
    switch (filterBy) {
      case 'owned':
        filtered = filtered?.filter(doc => doc?.owner === currentUser?.name);
        break;
      case 'shared':
        filtered = filtered?.filter(doc => doc?.isShared);
        break;
      case 'recent':
        const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
        filtered = filtered?.filter(doc => new Date(doc.lastModified) > threeDaysAgo);
        break;
      case 'starred':
        filtered = filtered?.filter(doc => doc?.isStarred);
        break;
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a?.title?.localeCompare(b?.title);
        case 'created':
          return new Date(b.lastModified) - new Date(a.lastModified);
        case 'size':
          return parseFloat(b?.size) - parseFloat(a?.size);
        case 'modified':
        default:
          return new Date(b.lastModified) - new Date(a.lastModified);
      }
    });

    return filtered;
  }, [mockDocuments, searchQuery, filterBy, sortBy, currentUser?.name]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Event handlers
  const handleCreateDocument = () => {
    navigate('/document-editor');
  };

  const handleSelectDocument = (documentId, isSelected) => {
    if (isSelected) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev?.filter(id => id !== documentId));
    }
  };

  const handleSelectAll = (documentIds) => {
    setSelectedDocuments(documentIds);
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'clear':
        setSelectedDocuments([]);
        break;
      case 'share': console.log('Sharing documents:', selectedDocuments);
        break;
      case 'move': console.log('Moving documents:', selectedDocuments);
        break;
      case 'duplicate': console.log('Duplicating documents:', selectedDocuments);
        break;
      case 'delete':
        console.log('Deleting documents:', selectedDocuments);
        setSelectedDocuments([]);
        break;
    }
  };

  const handleDocumentAction = (action, documentId) => {
    switch (action) {
      case 'share': navigate('/document-sharing-settings', { state: { documentId } });
        break;
      case 'duplicate': console.log('Duplicating document:', documentId);
        break;
      case 'delete':
        console.log('Deleting document:', documentId);
        break;
      case 'star': console.log('Toggling star for document:', documentId);
        break;
    }
  };

  const handleLogout = () => {
    navigate('/login-screen');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <GlobalHeader
        user={currentUser}
        notifications={notifications}
        onLogout={handleLogout}
      />
      {/* Main Content */}
      <div className="pt-16">
        {/* Dashboard Toolbar */}
        <DashboardToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          selectedCount={selectedDocuments?.length}
          onBulkAction={handleBulkAction}
          onCreateDocument={handleCreateDocument}
        />

        <div className="flex">
          {/* Main Content Area */}
          <div className={`flex-1 p-6 ${showActivitySidebar ? 'mr-80' : ''} collaborative-transition`}>
            {/* Quick Stats */}
            <QuickStats stats={stats} />

            {/* Documents Section */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">
                    {filterBy === 'all' ? 'All Documents' : 
                     filterBy === 'owned' ? 'My Documents' :
                     filterBy === 'shared' ? 'Shared with Me' :
                     filterBy === 'recent' ? 'Recent Documents' :
                     filterBy === 'starred' ? 'Starred Documents' : 'Documents'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {loading ? 'Loading...' : `${filteredAndSortedDocuments?.length} documents`}
                  </p>
                </div>
                
                <Button
                  variant={showActivitySidebar ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowActivitySidebar(!showActivitySidebar)}
                  iconName="Activity"
                  iconPosition="left"
                  iconSize={16}
                  className="btn-press"
                >
                  Activity
                </Button>
              </div>

              <div className="p-6">
                {loading || filteredAndSortedDocuments?.length > 0 ? (
                  <DocumentGrid
                    documents={filteredAndSortedDocuments}
                    viewMode={viewMode}
                    selectedDocuments={selectedDocuments}
                    onSelectDocument={handleSelectDocument}
                    onSelectAll={handleSelectAll}
                    onShare={(id) => handleDocumentAction('share', id)}
                    onDuplicate={(id) => handleDocumentAction('duplicate', id)}
                    onDelete={(id) => handleDocumentAction('delete', id)}
                    onToggleStar={(id) => handleDocumentAction('star', id)}
                    loading={loading}
                  />
                ) : (
                  <EmptyState
                    type={searchQuery ? 'no-search-results' : 
                          filterBy === 'shared' ? 'no-shared-documents' : 'no-documents'}
                    title={searchQuery ? 'No search results' : 
                           filterBy === 'shared' ? 'No shared documents' : 'No documents'}
                    description={searchQuery ? 'Try adjusting your search terms' : 
                                filterBy === 'shared' ? 'No documents have been shared with you yet' : 'Create your first document to get started'}
                    actionLabel={searchQuery ? 'Clear search' : 'Create document'}
                    onAction={searchQuery ? () => setSearchQuery('') : handleCreateDocument}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Activity Sidebar */}
          {showActivitySidebar && (
            <div className="fixed right-0 top-16 bottom-0 w-80 bg-background border-l border-border z-50 animate-slide-in-right">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowActivitySidebar(false)}
                  className="btn-press"
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              <div className="p-4 h-full overflow-y-auto">
                <ActivityFeed activities={mockActivities} />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Overlay for mobile activity sidebar */}
      {showActivitySidebar && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-soft z-40 lg:hidden"
          onClick={() => setShowActivitySidebar(false)}
        />
      )}
    </div>
  );
};

export default DocumentDashboard;