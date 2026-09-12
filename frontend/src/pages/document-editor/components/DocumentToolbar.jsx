import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Image,
  Italic,
  Link2,
  List,
  ListOrdered,
  MessageSquare,
  Palette,
  Redo2,
  Strikethrough,
  Table2,
  Type,
  Underline,
  Undo2,
} from "lucide-react";
import Select from "../../../components/ui/Select";

const IconButton = ({ active, label, children, onClick }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition ${active ? "bg-primary/10 text-primary" : "hover:bg-muted hover:text-foreground"}`}
  >
    {children}
  </button>
);

const Divider = () => <span className="mx-1 h-5 w-px shrink-0 bg-border" />;

const DocumentToolbar = ({ onFormat, currentFormat = {}, onInsert, onComment, isCommentMode = false }) => {
  const [showColorMenu, setShowColorMenu] = useState(false);
  const textColors = ["#111827", "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
  const highlightColors = ["#ffffff", "#fef3c7", "#dbeafe", "#d1fae5", "#fce7f3", "#e0e7ff", "#f3e8ff"];

  return (
    <div className="sticky top-[72px] z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8 scrollbar-thin">
        <div className="hidden shrink-0 items-center gap-1 md:flex">
          <IconButton label="Undo" onClick={() => onFormat?.("undo")}><Undo2 size={15}/></IconButton>
          <IconButton label="Redo" onClick={() => onFormat?.("redo")}><Redo2 size={15}/></IconButton>
          <Divider />
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-xl border border-border/70 bg-card px-1">
          <Select options={["Inter", "Manrope", "Arial", "Georgia", "Times New Roman"].map((value) => ({ value, label: value }))} value={currentFormat.fontFamily || "Inter"} onChange={(value) => onFormat?.("fontFamily", value)} className="w-[112px] border-0 shadow-none" />
          <span className="h-4 w-px bg-border" />
          <Select options={[12,14,16,18,20,24,32,40].map((value) => ({ value: String(value), label: String(value) }))} value={currentFormat.fontSize || "16"} onChange={(value) => onFormat?.("fontSize", value)} className="w-[72px] border-0 shadow-none" />
        </div>

        <Divider />
        <IconButton active={currentFormat.bold} label="Bold" onClick={() => onFormat?.("bold")}><Bold size={15}/></IconButton>
        <IconButton active={currentFormat.italic} label="Italic" onClick={() => onFormat?.("italic")}><Italic size={15}/></IconButton>
        <IconButton active={currentFormat.underline} label="Underline" onClick={() => onFormat?.("underline")}><Underline size={15}/></IconButton>
        <IconButton active={currentFormat.strikethrough} label="Strikethrough" onClick={() => onFormat?.("strikethrough")}><Strikethrough size={15}/></IconButton>

        <Divider />
        <div className="relative shrink-0">
          <button onClick={() => setShowColorMenu((value) => !value)} className="flex h-8 items-center gap-1 rounded-lg px-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
            <Palette size={15}/><span className="hidden text-[11px] font-medium xl:inline">Color</span><ChevronDown size={12}/>
          </button>
          <AnimatePresence>
            {showColorMenu && (
              <motion.div initial={{ opacity: 0, y: 6, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: .98 }} className="absolute left-0 top-10 z-50 w-64 rounded-2xl border border-border bg-popover p-3 shadow-2xl">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">Text color</p>
                <div className="flex flex-wrap gap-1.5">
                  {textColors.map((color) => <button key={color} onClick={() => { onFormat?.("color", color); setShowColorMenu(false); }} className="h-7 w-7 rounded-lg border border-border transition hover:scale-110" style={{ background: color }} />)}
                </div>
                <p className="mb-2 mt-3 text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">Highlight</p>
                <div className="flex flex-wrap gap-1.5">
                  {highlightColors.map((color) => <button key={color} onClick={() => { onFormat?.("backgroundColor", color); setShowColorMenu(false); }} className="h-7 w-7 rounded-lg border border-border transition hover:scale-110" style={{ background: color }} />)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Divider />
        <IconButton active={currentFormat.align === "left"} label="Align left" onClick={() => onFormat?.("align", "left")}><AlignLeft size={15}/></IconButton>
        <IconButton active={currentFormat.align === "center"} label="Align center" onClick={() => onFormat?.("align", "center")}><AlignCenter size={15}/></IconButton>
        <IconButton active={currentFormat.align === "right"} label="Align right" onClick={() => onFormat?.("align", "right")}><AlignRight size={15}/></IconButton>
        <IconButton active={currentFormat.align === "justify"} label="Justify" onClick={() => onFormat?.("align", "justify")}><AlignJustify size={15}/></IconButton>

        <Divider />
        <IconButton active={currentFormat.listType === "bullet"} label="Bulleted list" onClick={() => onFormat?.("list", "bullet")}><List size={15}/></IconButton>
        <IconButton active={currentFormat.listType === "number"} label="Numbered list" onClick={() => onFormat?.("list", "number")}><ListOrdered size={15}/></IconButton>

        <Divider />
        <IconButton label="Insert link" onClick={() => onInsert?.("link")}><Link2 size={15}/></IconButton>
        <IconButton label="Insert image" onClick={() => onInsert?.("image")}><Image size={15}/></IconButton>
        <IconButton label="Insert table" onClick={() => onInsert?.("table")}><Table2 size={15}/></IconButton>

        <div className="ml-auto hidden shrink-0 items-center gap-1.5 xl:flex">
          <span className="flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-muted-foreground"><Type size={12}/> Editor</span>
          <button onClick={onComment} className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold transition ${isCommentMode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><MessageSquare size={14}/> Comment</button>
        </div>
      </div>
    </div>
  );
};

export default DocumentToolbar;
