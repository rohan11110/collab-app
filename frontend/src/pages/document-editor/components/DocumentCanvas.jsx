import React, { useEffect, useRef, useState } from "react";
import Icon from "../../../components/AppIcon";

const DocumentCanvas = ({
  content = "",
  onChange,
  collaborators = [],
  comments = [],
  onAddComment,
  isCommentMode = false,
  currentFormat = {},
  loading = false,
}) => {
  const editorRef = useRef(null);
  const lastAppliedContentRef = useRef(null);
  const [selectedText, setSelectedText] = useState("");
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || loading) return;

    const incoming = typeof content === "string" ? content : "";

    // React should not rewrite the editable DOM on every keystroke. Doing so
    // resets the browser selection/caret and makes typing appear backwards.
    if (lastAppliedContentRef.current === incoming) return;
    if (editor.innerHTML === incoming) {
      lastAppliedContentRef.current = incoming;
      return;
    }

    editor.innerHTML = incoming;
    lastAppliedContentRef.current = incoming;
  }, [content, loading]);

  const handleInput = () => {
    const nextContent = editorRef.current?.innerHTML || "";
    lastAppliedContentRef.current = nextContent;
    onChange?.(nextContent);
  };

  const handleSelection = () => {
    if (!isCommentMode) return;

    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (!text || !selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelectedText(text);
    setSelectionPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });
    setShowCommentDialog(true);
  };

  const submitComment = () => {
    if (!commentText.trim() || !selectedText) return;

    onAddComment?.({
      text: selectedText,
      comment: commentText.trim(),
      position: selectionPosition,
    });

    setCommentText("");
    setSelectedText("");
    setSelectionPosition(null);
    setShowCommentDialog(false);
    window.getSelection()?.removeAllRanges();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      document.execCommand("insertText", false, "\t");
    }
  };

  return (
    <div className="relative flex-1 overflow-auto bg-background">
      <div className="mx-auto max-w-4xl p-8">
        <div className="relative min-h-[calc(100vh-260px)] rounded-lg border border-border bg-card p-12 shadow-sm">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-2/3 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
              <div className="h-4 w-4/6 rounded bg-muted" />
            </div>
          ) : (
            <>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onMouseUp={handleSelection}
                onKeyDown={handleKeyDown}
                spellCheck
                role="textbox"
                aria-multiline="true"
                className="min-h-[60vh] max-w-none whitespace-pre-wrap text-card-foreground outline-none prose prose-lg"
                style={{
                  fontFamily: currentFormat.fontFamily || "Inter",
                  fontSize: `${currentFormat.fontSize || 16}px`,
                  textAlign: currentFormat.align || "left",
                  lineHeight: 1.6,
                }}
                data-placeholder="Start writing…"
              />

              {collaborators
                .filter((collaborator) => collaborator.cursorPosition)
                .map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className="pointer-events-none absolute z-10"
                    style={{
                      top: collaborator.cursorPosition.top,
                      left: collaborator.cursorPosition.left,
                    }}
                  >
                    <div
                      className="h-5 w-0.5 animate-pulse"
                      style={{
                        backgroundColor: collaborator.color || "#2563EB",
                      }}
                    />
                    <div
                      className="absolute -top-6 left-0 whitespace-nowrap rounded px-2 py-1 text-xs text-white"
                      style={{
                        backgroundColor: collaborator.color || "#2563EB",
                      }}
                    >
                      {collaborator.name}
                    </div>
                  </div>
                ))}

              {comments
                .filter((comment) => !comment.resolved && comment.position)
                .map((comment) => (
                  <div
                    key={comment.id}
                    className="absolute z-20"
                    style={{
                      top: comment.position.top,
                      left: comment.position.left,
                    }}
                  >
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-lg"
                      title={comment.text}
                    >
                      <Icon name="MessageSquare" size={14} />
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

      {showCommentDialog && (
        <div
          className="fixed inset-0 z-[1100] bg-black/10"
          onClick={() => setShowCommentDialog(false)}
        >
          <div
            className="absolute w-80 rounded-lg border border-border bg-popover p-4 shadow-elevated"
            style={{
              top: selectionPosition?.top || 100,
              left: selectionPosition?.left || 100,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-2 flex items-center gap-2">
              <Icon name="MessageSquare" size={16} />
              <span className="font-medium text-popover-foreground">
                Add comment
              </span>
            </div>

            <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
              “{selectedText}”
            </p>

            <textarea
              autoFocus
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              className="min-h-24 w-full rounded-md border border-border bg-background p-2 text-foreground outline-none focus:ring-2 focus:ring-primary"
              placeholder="Write a comment…"
            />

            <div className="mt-3 flex justify-end gap-2">
              <button
                className="px-3 py-2 text-sm"
                onClick={() => setShowCommentDialog(false)}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
                disabled={!commentText.trim()}
                onClick={submitComment}
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCanvas;
