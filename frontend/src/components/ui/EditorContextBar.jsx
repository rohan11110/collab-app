import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Download,
  History,
  Link2,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Settings,
  Share2,
  Users,
} from "lucide-react";
import Button from "../ui/Button";

const menuMotion = {
  initial: { opacity: 0, y: 8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.98 },
};

const EditorContextBar = ({
  document = {},
  collaborators = [],
  isSharing = false,
  onShare,
  onComment,
  onHistory,
  onExport,
  onSettings,
  showCollaborationPanel = false,
  onToggleCollaboration,
}) => {
  const [shareOpen, setShareOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className="mt-[72px] border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[76px] max-w-[1600px] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-card shadow-soft">
            <span className="h-5 w-5 rounded-md bg-gradient-to-br from-primary to-violet-500" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="max-w-[42vw] truncate text-[15px] font-semibold tracking-tight text-foreground">
                {document.title || "Untitled document"}
              </h1>
              <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline-flex">DOC</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
              <span>{document.wordCount || 0} words</span>
              <span>•</span>
              <span>{document.lastModified || "Just now"}</span>
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {collaborators.length > 0 && (
            <div className="flex items-center rounded-full border border-border/70 bg-card/80 px-2 py-1">
              <div className="flex items-center">
                {collaborators.slice(0, 4).map((person, index) => (
                  <motion.span
                    key={person.id || index}
                    whileHover={{ y: -2, zIndex: 20 }}
                    className="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-[9px] font-bold text-white first:ml-0"
                    style={{ background: person.color || "#6366f1", zIndex: 10 - index }}
                    title={person.name}
                  >
                    {(person.name || "U").slice(0, 2).toUpperCase()}
                  </motion.span>
                ))}
                {collaborators.length > 4 && (
                  <span className="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-muted text-[9px] font-bold text-muted-foreground">
                    +{collaborators.length - 4}
                  </span>
                )}
              </div>
              <span className="ml-2 pr-1 text-[11px] font-semibold text-muted-foreground">Live</span>
            </div>
          )}

          <div className="h-7 w-px bg-border/70" />
          <Button variant="ghost" size="sm" onClick={onComment} className="rounded-xl text-xs" iconName="MessageSquare" iconPosition="left" iconSize={15}>Comment</Button>
          <Button variant="ghost" size="sm" onClick={onHistory} className="rounded-xl text-xs" iconName="History" iconPosition="left" iconSize={15}>History</Button>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button
              onClick={() => { setShareOpen((v) => !v); setExportOpen(false); }}
              className="flex h-9 items-center gap-2 rounded-xl bg-foreground px-3.5 text-xs font-semibold text-background shadow-sm transition hover:opacity-90"
            >
              <Share2 size={14} /> Share <ChevronDown size={13} />
            </button>
            <AnimatePresence>
              {shareOpen && (
                <motion.div {...menuMotion} className="absolute right-0 top-11 z-40 w-52 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-2xl">
                  <button className="menu-row" onClick={() => { onShare?.("link"); setShareOpen(false); }}><Link2 size={15}/> Copy link</button>
                  <button className="menu-row" onClick={() => { onShare?.("email"); setShareOpen(false); }}><Mail size={15}/> Invite people</button>
                  <button className="menu-row" onClick={() => { onToggleCollaboration?.(); setShareOpen(false); }}><Users size={15}/> Collaboration panel</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative hidden sm:block">
            <button
              onClick={() => { setExportOpen((v) => !v); setShareOpen(false); }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground"
              title="Export"
            >
              <Download size={15} />
            </button>
            <AnimatePresence>
              {exportOpen && (
                <motion.div {...menuMotion} className="absolute right-0 top-11 z-40 w-48 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-2xl">
                  {[["html", "HTML"], ["pdf", "PDF"], ["docx", "DOCX"], ["markdown", "Markdown"]].map(([value, label]) => (
                    <button className="menu-row" key={value} onClick={() => { onExport?.(value); setExportOpen(false); }}>
                      <Download size={14}/> Export {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={onToggleCollaboration} className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${showCollaborationPanel ? "border-primary/40 bg-primary/10 text-primary" : "border-border/70 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"}`} title="Collaborate">
            <Users size={16} />
          </button>
          <button onClick={onSettings} className="hidden h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground sm:flex">
            <Settings size={15} />
          </button>
          <button className="hidden h-9 w-9 items-center justify-center rounded-xl border border-border/70 bg-card text-muted-foreground transition hover:bg-muted hover:text-foreground lg:flex">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorContextBar;
