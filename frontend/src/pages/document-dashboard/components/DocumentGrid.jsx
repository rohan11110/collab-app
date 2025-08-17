import React from 'react';
import DocumentCard from './DocumentCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';



const DocumentGrid = ({ 
  documents = [],
  viewMode = 'grid',
  selectedDocuments = [],
  onSelectDocument,
  onSelectAll,
  onShare,
  onDuplicate,
  onDelete,
  onToggleStar,
  loading = false
}) => {
  const navigate = useNavigate();
  
  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectAll?.(documents?.map(doc => doc?.id));
    } else {
      onSelectAll?.([]);
    }
  };

  const isAllSelected = documents?.length > 0 && selectedDocuments?.length === documents?.length;
  const isIndeterminate = selectedDocuments?.length > 0 && selectedDocuments?.length < documents?.length;

  if (loading) {
    return (
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}`}>
        {Array.from({ length: 8 })?.map((_, index) => (
          <div key={index} className="animate-pulse">
            {viewMode === 'grid' ? (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="h-32 bg-muted"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                    <div className="flex space-x-1">
                      <div className="w-6 h-6 bg-muted rounded-full"></div>
                      <div className="w-6 h-6 bg-muted rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center p-4 bg-card border border-border rounded-lg">
                <div className="w-4 h-4 bg-muted rounded mr-4"></div>
                <div className="w-10 h-10 bg-muted rounded-lg mr-4"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
                <div className="flex space-x-1 mr-4">
                  <div className="w-6 h-6 bg-muted rounded-full"></div>
                  <div className="w-6 h-6 bg-muted rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (documents?.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="FileText" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-card-foreground mb-2">No documents yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Get started by creating your first collaborative document. You can invite team members to edit together in real-time.
        </p>
        <Button
          variant="default"
          onClick={() => navigate('/document-editor')}
          iconName="Plus"
          iconPosition="left"
          iconSize={16}
          className="btn-press"
        >
          Create Your First Document
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Select All Header (List View Only) */}
      {viewMode === 'list' && documents?.length > 0 && (
        <div className="flex items-center p-4 bg-surface border border-border rounded-lg">
          <input
            type="checkbox"
            checked={isAllSelected}
            ref={(el) => {
              if (el) el.indeterminate = isIndeterminate;
            }}
            onChange={(e) => handleSelectAll(e?.target?.checked)}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2 mr-4"
          />
          <span className="text-sm font-medium text-card-foreground">
            {isAllSelected ? 'Deselect All' : isIndeterminate ? `${selectedDocuments?.length} Selected` : 'Select All'}
          </span>
          <span className="text-sm text-muted-foreground ml-2">
            ({documents?.length} documents)
          </span>
        </div>
      )}
      {/* Documents Grid/List */}
      <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-2'}`}>
        {documents?.map((document) => (
          <DocumentCard
            key={document?.id}
            document={document}
            viewMode={viewMode}
            isSelected={selectedDocuments?.includes(document?.id)}
            onSelect={onSelectDocument}
            onShare={onShare}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            onToggleStar={onToggleStar}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentGrid;