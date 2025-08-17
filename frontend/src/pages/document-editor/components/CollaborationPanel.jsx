import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const CollaborationPanel = ({ 
  isOpen = false,
  onClose,
  collaborators = [],
  messages = [],
  comments = [],
  onSendMessage,
  onResolveComment,
  activeTab = 'chat'
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [currentTab, setCurrentTab] = useState(activeTab);

  const tabs = [
    { id: 'chat', label: 'Chat', icon: 'MessageCircle', count: messages?.length },
    { id: 'comments', label: 'Comments', icon: 'MessageSquare', count: comments?.filter(c => !c?.resolved)?.length },
    { id: 'people', label: 'People', icon: 'Users', count: collaborators?.length },
  ];

  const handleSendMessage = () => {
    if (newMessage?.trim()) {
      onSendMessage?.(newMessage);
      setNewMessage('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'busy': return 'bg-error';
      default: return 'bg-muted-foreground';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-soft z-1050 lg:hidden"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-16 bottom-0 w-full max-w-sm lg:w-80 bg-background border-l border-border z-1100 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Collaboration</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="btn-press"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setCurrentTab(tab?.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 text-sm font-medium border-b-2 collaborative-transition ${
                currentTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span className="hidden sm:inline">{tab?.label}</span>
              {tab?.count > 0 && (
                <span className="bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">
                  {tab?.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {/* Chat Tab */}
          {currentTab === 'chat' && (
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.length > 0 ? (
                  messages?.map((message, index) => (
                    <div key={index} className="flex space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white flex-shrink-0"
                        style={{ backgroundColor: message?.user?.color || '#2563EB' }}
                      >
                        {message?.user?.name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-foreground">
                            {message?.user?.name}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {message?.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-1">{message?.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Icon name="MessageCircle" size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs mt-1">Start a conversation with your team</p>
                  </div>
                )}
              </div>
              
              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e?.target?.value)}
                    onKeyPress={(e) => e?.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button
                    variant="default"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!newMessage?.trim()}
                    className="btn-press"
                  >
                    <Icon name="Send" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {currentTab === 'comments' && (
            <div className="h-full overflow-y-auto p-4 space-y-4">
              {comments?.length > 0 ? (
                comments?.map((comment, index) => (
                  <div key={index} className={`bg-surface rounded-lg p-3 border border-border ${comment?.resolved ? 'opacity-60' : ''}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                          style={{ backgroundColor: comment?.user?.color || '#2563EB' }}
                        >
                          {comment?.user?.name?.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {comment?.user?.name}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {comment?.timestamp}
                        </span>
                      </div>
                      {!comment?.resolved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onResolveComment?.(comment?.id)}
                          iconName="Check"
                          iconSize={14}
                          className="btn-press text-success hover:text-success"
                        />
                      )}
                    </div>
                    <p className="text-sm text-foreground">{comment?.text}</p>
                    {comment?.selection && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground border-l-2 border-accent">
                        "{comment?.selection}"
                      </div>
                    )}
                    {comment?.resolved && (
                      <div className="mt-2 flex items-center space-x-1 text-xs text-success">
                        <Icon name="Check" size={12} />
                        <span>Resolved</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Icon name="MessageSquare" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No comments yet</p>
                  <p className="text-xs mt-1">Select text to add a comment</p>
                </div>
              )}
            </div>
          )}

          {/* People Tab */}
          {currentTab === 'people' && (
            <div className="h-full overflow-y-auto p-4 space-y-3">
              {collaborators?.map((collaborator, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 collaborative-transition">
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
                      style={{ backgroundColor: collaborator?.color || '#2563EB' }}
                    >
                      {collaborator?.name?.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(collaborator?.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {collaborator?.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {collaborator?.role} • {collaborator?.status}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {collaborator?.isTyping && (
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-accent rounded-full animate-typing-bounce" />
                        <div className="w-1 h-1 bg-accent rounded-full animate-typing-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 h-1 bg-accent rounded-full animate-typing-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CollaborationPanel;