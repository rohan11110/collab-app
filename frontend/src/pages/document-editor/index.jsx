import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import EditorContextBar from '../../components/ui/EditorContextBar';
import DocumentToolbar from './components/DocumentToolbar';
import DocumentCanvas from './components/DocumentCanvas';
import CollaborationPanel from './components/CollaborationPanel';
import VersionHistory from './components/VersionHistory';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const DocumentEditor = () => {
  const navigate = useNavigate();
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [currentFormat, setCurrentFormat] = useState({
    fontFamily: 'Inter',
    fontSize: '16',
    bold: false,
    italic: false,
    underline: false,
    align: 'left'
  });

  // Mock user data
  const currentUser = {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  };

  // Mock document data
  const [document, setDocument] = useState({
    id: 'doc-123',
    title: 'Quarterly Business Review - Q3 2024',
    lastModified: '2 minutes ago',
    wordCount: 1247,
    autoSaved: true,
    owner: currentUser
  });

  // Mock collaborators data
  const [collaborators, setCollaborators] = useState([
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      color: "#DC2626",
      status: "online",
      role: "Editor",
      isTyping: false,
      cursorPosition: { top: 200, left: 150 }
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      color: "#059669",
      status: "online",
      role: "Viewer",
      isTyping: true,
      cursorPosition: { top: 350, left: 280 }
    },
    {
      id: 4,
      name: "David Kim",
      email: "david.kim@company.com",
      color: "#7C3AED",
      status: "away",
      role: "Editor",
      isTyping: false,
      cursorPosition: null
    }
  ]);

  // Mock messages data
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: { name: "Michael Chen", color: "#DC2626" },
      content: "Great progress on the Q3 summary! The metrics look impressive.",
      timestamp: "2:34 PM"
    },
    {
      id: 2,
      user: { name: "Emily Rodriguez", color: "#059669" },
      content: "Should we add more details about the product development section?",
      timestamp: "2:36 PM"
    },
    {
      id: 3,
      user: { name: "Sarah Johnson", color: "#2563EB" },
      content: "Good idea! I\'ll expand on the mobile app improvements.",
      timestamp: "2:38 PM"
    }
  ]);

  // Mock comments data
  const [comments, setComments] = useState([
    {
      id: 1,
      user: { name: "Michael Chen", color: "#DC2626" },
      text: "Consider adding specific numbers here for better impact.",
      selection: "exceeded targets by 15%",
      timestamp: "1:45 PM",
      resolved: false,
      position: { top: 250, left: 600 }
    },
    {
      id: 2,
      user: { name: "Emily Rodriguez", color: "#059669" },
      text: "This section could benefit from a visual chart.",
      selection: "Financial Overview",
      timestamp: "1:52 PM",
      resolved: true,
      position: { top: 450, left: 600 }
    }
  ]);

  // Mock version history data
  const [versions] = useState([
    {
      id: 'v1',
      title: 'Initial Draft',
      timestamp: '2024-08-16T10:30:00Z',
      author: 'Sarah Johnson',
      type: 'manual',
      changes: 15,
      description: 'Created initial document structure'
    },
    {
      id: 'v2',
      title: 'Added Executive Summary',
      timestamp: '2024-08-16T11:15:00Z',
      author: 'Sarah Johnson',
      type: 'auto',
      changes: 8,
      description: 'Expanded executive summary section'
    },
    {
      id: 'v3',
      title: 'Collaborative Edits',
      timestamp: '2024-08-16T14:20:00Z',
      author: 'Michael Chen',
      type: 'collaborative',
      changes: 12,
      description: 'Added sales metrics and updated formatting'
    },
    {
      id: 'v4',
      title: 'Current Version',
      timestamp: '2024-08-16T15:45:00Z',
      author: 'Sarah Johnson',
      type: 'auto',
      changes: 5,
      description: 'Latest changes with financial overview'
    }
  ]);

  // Mock notifications
  const notifications = [
    {
      title: "New Comment",
      message: "Michael Chen commented on your document",
      time: "2 min ago",
      read: false
    },
    {
      title: "Document Shared",
      message: "Emily Rodriguez joined the document",
      time: "15 min ago",
      read: false
    },
    {
      title: "Auto-saved",
      message: "Your document has been automatically saved",
      time: "1 hour ago",
      read: true
    }
  ];

  // Simulate typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setCollaborators(prev => prev?.map(collaborator => ({
        ...collaborator,
        isTyping: Math.random() > 0.8 && collaborator?.status === 'online'
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleFormat = (type, value) => {
    setCurrentFormat(prev => {
      if (type === 'bold' || type === 'italic' || type === 'underline') {
        return { ...prev, [type]: !prev?.[type] };
      }
      return { ...prev, [type]: value };
    });
  };

  const handleInsert = (type) => {
    console.log('Insert:', type);
    // Handle insert operations (link, image, table)
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: messages?.length + 1,
      user: { name: currentUser?.name, color: "#2563EB" },
      content: message,
      timestamp: new Date()?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAddComment = (commentData) => {
    const newComment = {
      id: comments?.length + 1,
      user: { name: currentUser?.name, color: "#2563EB" },
      text: commentData?.comment,
      selection: commentData?.text,
      timestamp: new Date()?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      resolved: false,
      position: commentData?.position
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleResolveComment = (commentId) => {
    setComments(prev => prev?.map(comment => 
      comment?.id === commentId ? { ...comment, resolved: true } : comment
    ));
  };

  const handleShare = (type) => {
    console.log('Share:', type);
    if (type === 'link') {
      navigator.clipboard?.writeText(window.location?.href);
    }
  };

  const handleExport = (format) => {
    console.log('Export:', format);
    // Handle export functionality
  };

  const handleRestoreVersion = (version) => {
    console.log('Restore version:', version);
    setShowVersionHistory(false);
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
      {/* Editor Context Bar */}
      <EditorContextBar
        document={document}
        collaborators={collaborators}
        onShare={handleShare}
        onComment={() => setIsCommentMode(!isCommentMode)}
        onHistory={() => setShowVersionHistory(true)}
        onExport={handleExport}
        onSettings={() => navigate('/user-profile-settings')}
        showCollaborationPanel={showCollaborationPanel}
        onToggleCollaboration={() => setShowCollaborationPanel(!showCollaborationPanel)}
      />
      {/* Document Toolbar */}
      <DocumentToolbar
        onFormat={handleFormat}
        currentFormat={currentFormat}
        onInsert={handleInsert}
        onComment={() => setIsCommentMode(!isCommentMode)}
        isCommentMode={isCommentMode}
      />
      {/* Main Editor Layout */}
      <div className="flex" style={{ height: 'calc(100vh - 180px)' }}>
        {/* Document Canvas */}
        <DocumentCanvas
          collaborators={collaborators}
          comments={comments}
          onAddComment={handleAddComment}
          isCommentMode={isCommentMode}
          currentFormat={currentFormat}
        />

        {/* Collaboration Panel */}
        <CollaborationPanel
          isOpen={showCollaborationPanel}
          onClose={() => setShowCollaborationPanel(false)}
          collaborators={collaborators}
          messages={messages}
          comments={comments}
          onSendMessage={handleSendMessage}
          onResolveComment={handleResolveComment}
        />

        {/* Version History */}
        <VersionHistory
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          versions={versions}
          onRestoreVersion={handleRestoreVersion}
          currentVersion="v4"
        />
      </div>
      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          variant="default"
          size="icon"
          onClick={() => setShowCollaborationPanel(true)}
          className="w-14 h-14 rounded-full shadow-elevated animate-presence-glow"
        >
          <Icon name="Users" size={24} />
        </Button>
      </div>
      {/* Auto-save Indicator */}
      {document?.autoSaved && (
        <div className="fixed bottom-6 left-6 bg-success text-success-foreground px-3 py-2 rounded-lg shadow-elevated animate-fade-in-backdrop">
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={16} />
            <span className="text-sm font-medium">Auto-saved</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentEditor;