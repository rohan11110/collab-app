import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const DocumentToolbar = ({ 
  onFormat,
  currentFormat = {},
  onInsert,
  onComment,
  isCommentMode = false
}) => {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);

  const fontFamilyOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Arial', label: 'Arial' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Georgia', label: 'Georgia' },
  ];

  const fontSizeOptions = [
    { value: '12', label: '12px' },
    { value: '14', label: '14px' },
    { value: '16', label: '16px' },
    { value: '18', label: '18px' },
    { value: '20', label: '20px' },
    { value: '24', label: '24px' },
    { value: '32', label: '32px' },
  ];

  const textColors = [
    '#000000', '#DC2626', '#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777'
  ];

  const highlightColors = [
    '#FFFFFF', '#FEF3C7', '#DBEAFE', '#D1FAE5', '#FCE7F3', '#E0E7FF', '#F3E8FF'
  ];

  return (
    <div className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-2 overflow-x-auto">
        {/* Font Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="flex items-center space-x-1">
            <Select
              options={fontFamilyOptions}
              value={currentFormat?.fontFamily || 'Inter'}
              onChange={(value) => onFormat?.('fontFamily', value)}
              className="w-32"
            />
            <Select
              options={fontSizeOptions}
              value={currentFormat?.fontSize || '16'}
              onChange={(value) => onFormat?.('fontSize', value)}
              className="w-20"
            />
          </div>

          <div className="w-px h-6 bg-border mx-2" />

          {/* Text Formatting */}
          <div className="flex items-center space-x-1">
            <Button
              variant={currentFormat?.bold ? "default" : "ghost"}
              size="sm"
              onClick={() => onFormat?.('bold')}
              className="btn-press"
            >
              <Icon name="Bold" size={16} />
            </Button>
            <Button
              variant={currentFormat?.italic ? "default" : "ghost"}
              size="sm"
              onClick={() => onFormat?.('italic')}
              className="btn-press"
            >
              <Icon name="Italic" size={16} />
            </Button>
            <Button
              variant={currentFormat?.underline ? "default" : "ghost"}
              size="sm"
              onClick={() => onFormat?.('underline')}
              className="btn-press"
            >
              <Icon name="Underline" size={16} />
            </Button>
            <Button
              variant={currentFormat?.strikethrough ? "default" : "ghost"}
              size="sm"
              onClick={() => onFormat?.('strikethrough')}
              className="btn-press"
            >
              <Icon name="Strikethrough" size={16} />
            </Button>
          </div>

          <div className="w-px h-6 bg-border mx-2" />

          {/* Text Color */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowColorMenu(!showColorMenu)}
              className="btn-press"
            >
              <div className="flex items-center space-x-1">
                <Icon name="Palette" size={16} />
                <div 
                  className="w-4 h-1 rounded"
                  style={{ backgroundColor: currentFormat?.color || '#000000' }}
                />
              </div>
            </Button>

            {showColorMenu && (
              <div className="absolute top-full left-0 mt-2 p-3 bg-popover border border-border rounded-lg shadow-elevated z-1100 animate-fade-in-backdrop">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-popover-foreground mb-2">Text Color</p>
                    <div className="flex space-x-1">
                      {textColors?.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            onFormat?.('color', color);
                            setShowColorMenu(false);
                          }}
                          className="w-6 h-6 rounded border border-border hover:scale-110 collaborative-transition"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-popover-foreground mb-2">Highlight</p>
                    <div className="flex space-x-1">
                      {highlightColors?.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            onFormat?.('backgroundColor', color);
                            setShowColorMenu(false);
                          }}
                          className="w-6 h-6 rounded border border-border hover:scale-110 collaborative-transition"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-border mx-2" />

          {/* Alignment */}
          <div className="flex items-center space-x-1">
            <Button
              variant={currentFormat?.align === 'left' ? "default" : "ghost"}
              size="sm"
              onClick={() => onFormat?.('align', 'left')}
              className="btn-press"
            >
              <Icon name="AlignLeft" size={16} />
            </Button>
            <Button
              variant={currentFormat?.align === 'center' ? "default" : "ghost"}
              size="sm"
              onClick={() => onFormat?.('align', 'center')}
              className="btn-press"
            >
              <Icon name="AlignCenter" size={16} />
            </Button>
            <Button
              variant={currentFormat?.align === 'right' ? "default" : "ghost"}
              size="sm"
              onClick={() => onFormat?.('align', 'right')}
              className="btn-press"
            >
              <Icon name="AlignRight" size={16} />
            </Button>
            <Button
              variant={currentFormat?.align === 'justify' ? "default" : "ghost"}
              size="sm"
              onClick={() => onFormat?.('align', 'justify')}
              className="btn-press"
            >
              <Icon name="AlignJustify" size={16} />
            </Button>
          </div>

          <div className="w-px h-6 bg-border mx-2" />

          {/* Lists */}
          <div className="flex items-center space-x-1">
            <Button
              variant={currentFormat?.listType === 'bullet' ? "default" : "ghost"}
              size="sm"
              onClick={() => onFormat?.('list', 'bullet')}
              className="btn-press"
            >
              <Icon name="List" size={16} />
            </Button>
            <Button
              variant={currentFormat?.listType === 'number' ? "default" : "ghost"}
              size="sm"
              onClick={() => onFormat?.('list', 'number')}
              className="btn-press"
            >
              <Icon name="ListOrdered" size={16} />
            </Button>
          </div>
        </div>

        {/* Insert & Action Controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onInsert?.('link')}
            className="btn-press"
          >
            <Icon name="Link" size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onInsert?.('image')}
            className="btn-press"
          >
            <Icon name="Image" size={16} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onInsert?.('table')}
            className="btn-press"
          >
            <Icon name="Table" size={16} />
          </Button>

          <div className="w-px h-6 bg-border mx-2" />

          <Button
            variant={isCommentMode ? "default" : "ghost"}
            size="sm"
            onClick={onComment}
            iconName="MessageSquare"
            iconPosition="left"
            iconSize={16}
            className="btn-press"
          >
            Comment
          </Button>
        </div>
      </div>
      {/* Overlay for dropdowns */}
      {(showFontMenu || showColorMenu) && (
        <div
          className="fixed inset-0 z-1050"
          onClick={() => {
            setShowFontMenu(false);
            setShowColorMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default DocumentToolbar;