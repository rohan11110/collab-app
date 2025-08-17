import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const DocumentCanvas = ({ 
  content = '',
  onChange,
  collaborators = [],
  comments = [],
  onAddComment,
  isCommentMode = false,
  currentFormat = {}
}) => {
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [commentText, setCommentText] = useState('');
  const editorRef = useRef(null);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    
    if (selectedText && isCommentMode) {
      setSelectedText(selectedText);
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();
      setSelectionPosition({
        top: rect?.bottom + window.scrollY,
        left: rect?.left + window.scrollX
      });
      setShowCommentDialog(true);
    }
  };

  const handleAddComment = () => {
    if (commentText?.trim() && selectedText) {
      onAddComment?.({
        text: selectedText,
        comment: commentText,
        position: selectionPosition
      });
      setCommentText('');
      setShowCommentDialog(false);
      setSelectedText('');
      setSelectionPosition(null);
    }
  };

  const getCollaboratorCursors = () => {
    return collaborators?.filter(c => c?.cursorPosition)?.map((collaborator, index) => (
        <div
          key={collaborator?.id}
          className="absolute pointer-events-none z-10"
          style={{
            top: collaborator?.cursorPosition?.top,
            left: collaborator?.cursorPosition?.left
          }}
        >
          <div 
            className="w-0.5 h-5 animate-pulse"
            style={{ backgroundColor: collaborator?.color }}
          />
          <div 
            className="absolute -top-6 left-0 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
            style={{ backgroundColor: collaborator?.color }}
          >
            {collaborator?.name}
            {collaborator?.isTyping && (
              <span className="ml-1 animate-typing-bounce">...</span>
            )}
          </div>
        </div>
      ));
  };

  const mockDocumentContent = `# Quarterly Business Review - Q3 2024

## Executive Summary

This document outlines the key performance indicators, achievements, and strategic initiatives for the third quarter of 2024. Our team has made significant progress across multiple departments while maintaining focus on customer satisfaction and operational excellence.

## Key Metrics

- **Revenue Growth**: 23% increase compared to Q2 2024
- **Customer Acquisition**: 1,247 new customers onboarded
- **Customer Satisfaction**: 94% satisfaction rate (up from 91% in Q2)
- **Employee Retention**: 96% retention rate across all departments

## Department Updates

### Sales & Marketing
The sales team exceeded targets by 15% this quarter, driven by our new digital marketing campaigns and improved lead qualification processes. Key achievements include:

- Launch of the new product line in August
- Successful partnership with three major distributors
- Implementation of CRM automation tools

### Product Development
Our engineering team delivered several critical features and improvements:

- Mobile app performance optimization (40% faster load times)
- New collaboration features in the web platform
- Enhanced security protocols and compliance updates

### Operations
Operational efficiency improvements have resulted in cost savings and better customer experience:

- Streamlined order processing (reduced by 2 days average)
- Improved inventory management system
- Enhanced customer support response times

## Strategic Initiatives for Q4

Looking ahead to the fourth quarter, we will focus on:

1. **Market Expansion**: Enter two new geographic markets
2. **Product Innovation**: Launch beta version of AI-powered features
3. **Team Growth**: Hire 25 new team members across all departments
4. **Customer Success**: Implement new onboarding program

## Challenges and Mitigation

While we've seen strong performance, we've identified several areas requiring attention:

- **Supply Chain**: Working with alternative suppliers to reduce dependency
- **Competition**: Increased competitive pressure in our core market
- **Talent Acquisition**: Competitive job market making hiring challenging

## Financial Overview

Our financial performance this quarter demonstrates strong fundamentals:

- **Total Revenue**: $2.4M (23% growth)
- **Operating Expenses**: $1.8M (controlled growth of 8%)
- **Net Profit**: $600K (85% increase from Q2)
- **Cash Flow**: Positive $450K operational cash flow

## Conclusion

Q3 2024 has been a successful quarter with strong performance across all key metrics. The team's dedication and strategic focus have positioned us well for continued growth in Q4 and beyond.

We remain committed to our core values of innovation, customer success, and operational excellence as we move forward with our ambitious plans for the remainder of the year.

---

*This document was collaboratively created by the leadership team and is updated in real-time as new information becomes available.*`;

  return (
    <div className="flex-1 bg-background relative">
      <div className="max-w-4xl mx-auto p-8">
        {/* Document Canvas */}
        <div 
          ref={editorRef}
          className="min-h-screen bg-card border border-border rounded-lg shadow-sm p-12 relative"
          style={{ 
            fontFamily: currentFormat?.fontFamily || 'Inter',
            fontSize: `${currentFormat?.fontSize || 16}px`,
            lineHeight: 1.6
          }}
        >
          {/* Collaborative Cursors */}
          {getCollaboratorCursors()}

          {/* Document Content */}
          <div 
            className="prose prose-lg max-w-none text-card-foreground"
            onMouseUp={handleTextSelection}
            dangerouslySetInnerHTML={{ 
              __html: mockDocumentContent?.replace(/\n/g, '<br>')?.replace(/#{1,6}\s/g, match => {
                const level = match?.trim()?.length - 1;
                return `<h${level} class="font-semibold text-foreground mt-6 mb-4">`;
              })?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            }}
          />

          {/* Comment Markers */}
          {comments?.map((comment, index) => (
            <div
              key={index}
              className="absolute w-4 h-4 bg-warning rounded-full border-2 border-background cursor-pointer hover:scale-110 collaborative-transition"
              style={{
                top: comment?.position?.top || 100 + (index * 30),
                right: -8
              }}
              title={`${comment?.user?.name}: ${comment?.text}`}
            >
              <Icon name="MessageSquare" size={12} className="text-white" />
            </div>
          ))}
        </div>

        {/* Comment Dialog */}
        {showCommentDialog && selectionPosition && (
          <div
            className="absolute z-1100 bg-popover border border-border rounded-lg shadow-elevated p-4 w-80 animate-fade-in-backdrop"
            style={{
              top: selectionPosition?.top + 10,
              left: Math.min(selectionPosition?.left, window.innerWidth - 320)
            }}
          >
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-popover-foreground">Selected text:</p>
                <p className="text-sm text-muted-foreground bg-muted p-2 rounded mt-1">
                  "{selectedText}"
                </p>
              </div>
              <div>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e?.target?.value)}
                  placeholder="Add your comment..."
                  className="w-full h-20 p-2 text-sm border border-border rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowCommentDialog(false);
                    setCommentText('');
                    setSelectedText('');
                  }}
                  className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground collaborative-transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddComment}
                  disabled={!commentText?.trim()}
                  className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 collaborative-transition"
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Typing Indicators */}
        {collaborators?.some(c => c?.isTyping) && (
          <div className="fixed bottom-4 left-4 bg-popover border border-border rounded-lg p-3 shadow-elevated animate-fade-in-backdrop">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-typing-bounce" />
                <div className="w-2 h-2 bg-accent rounded-full animate-typing-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-accent rounded-full animate-typing-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-sm text-popover-foreground">
                {collaborators?.filter(c => c?.isTyping)?.map(c => c?.name)?.join(', ')} 
                {collaborators?.filter(c => c?.isTyping)?.length === 1 ? ' is' : ' are'} typing...
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Overlay for comment dialog */}
      {showCommentDialog && (
        <div
          className="fixed inset-0 z-1050"
          onClick={() => {
            setShowCommentDialog(false);
            setCommentText('');
            setSelectedText('');
          }}
        />
      )}
    </div>
  );
};

export default DocumentCanvas;