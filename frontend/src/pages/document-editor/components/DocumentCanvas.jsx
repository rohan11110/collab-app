import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, MousePointer2, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    setSelectionPosition({ top: rect.bottom + 12, left: Math.min(rect.left, window.innerWidth - 340) });
    setShowCommentDialog(true);
  };

  const submitComment = () => {
    if (!commentText.trim() || !selectedText) return;
    onAddComment?.({ text: selectedText, comment: commentText.trim(), position: selectionPosition });
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
    <div className="relative h-full min-h-[calc(100vh-188px)] overflow-auto editor-surface scrollbar-thin">
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-64 bg-gradient-to-t from-primary/[0.025] to-transparent" />
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto mb-4 flex max-w-[850px] items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground/70">
          <span>Draft workspace</span>
          <span className="hidden sm:inline">Autosave enabled</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="doc-paper relative mx-auto min-h-[calc(100vh-290px)] w-full max-w-[850px] overflow-hidden rounded-[18px] border border-border/70">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-violet-500 to-cyan-400" />
          {loading ? (
            <div className="space-y-5 p-10 sm:p-16">
              <div className="h-9 w-3/5 animate-pulse rounded-xl bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
            </div>
          ) : (
            <div className="relative p-8 sm:p-14 lg:p-16">
              <div className="mb-7 flex items-center justify-between border-b border-border/60 pb-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.16em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Live canvas
                </div>
                {isCommentMode && <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"><MessageSquare size={11}/> Select text to comment</span>}
              </div>

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
                className="doc-editor-content min-h-[60vh] max-w-none text-[17px] leading-8 text-card-foreground outline-none selection:bg-primary/15"
                style={{ fontFamily: currentFormat.fontFamily || "Inter", fontSize: `${currentFormat.fontSize || 16}px`, textAlign: currentFormat.align || "left" }}
                data-placeholder="Start writing…"
              />

              {collaborators.filter((person) => person.cursorPosition).map((person) => (
                <div key={person.id} className="pointer-events-none absolute z-10" style={{ top: person.cursorPosition.top, left: person.cursorPosition.left }}>
                  <div className="relative"><div className="h-5 w-0.5 animate-pulse" style={{ backgroundColor: person.color || "#6366f1" }}/><span className="absolute left-0 top-[-22px] whitespace-nowrap rounded-md px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm" style={{ backgroundColor: person.color || "#6366f1" }}>{person.name}</span></div>
                </div>
              ))}

              {comments.filter((comment) => !comment.resolved && comment.position).map((comment) => (
                <motion.div key={comment.id} initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute z-20" style={{ top: comment.position.top, left: comment.position.left }}>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-4 ring-primary/10"><MessageSquare size={13}/></span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        <div className="mx-auto mt-4 flex max-w-[850px] items-center justify-center gap-3 text-[10px] font-medium text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MousePointer2 size={11}/> Click anywhere to edit</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1"><Wifi size={11} className="text-emerald-500"/> Realtime sync</span>
        </div>
      </div>

      <AnimatePresence>
        {showCommentDialog && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1100] bg-black/10 backdrop-blur-[1px]" onClick={() => setShowCommentDialog(false)}>
            <motion.div initial={{ opacity: 0, y: 8, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: .97 }} className="absolute w-[min(340px,calc(100vw-24px))] rounded-2xl border border-border bg-popover p-4 shadow-2xl" style={{ top: selectionPosition?.top || 100, left: selectionPosition?.left || 20 }} onClick={(event) => event.stopPropagation()}>
              <div className="mb-3 flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><MessageSquare size={15}/></span><div><p className="text-sm font-semibold text-foreground">Add comment</p><p className="text-[10px] text-muted-foreground">Collaborators will see this thread</p></div></div>
              <p className="mb-3 rounded-xl bg-muted/60 p-2.5 text-xs leading-5 text-muted-foreground">“{selectedText}”</p>
              <textarea autoFocus value={commentText} onChange={(event) => setCommentText(event.target.value)} className="min-h-24 w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10" placeholder="Write a comment…" />
              <div className="mt-3 flex justify-end gap-2"><button className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted" onClick={() => setShowCommentDialog(false)}>Cancel</button><button className="rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background disabled:cursor-not-allowed disabled:opacity-40" disabled={!commentText.trim()} onClick={submitComment}>Add comment</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentCanvas;
