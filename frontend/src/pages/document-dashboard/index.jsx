import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FilePlus2,
  FolderOpen,
  LayoutGrid,
  List,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GlobalHeader from "../../components/ui/GlobalHeader";
import DashboardToolbar from "../../components/ui/DashboardToolbar";
import DocumentGrid from "./components/DocumentGrid";
import ActivityFeed from "./components/ActivityFeed";
import QuickStats from "./components/QuickStats";
import EmptyState from "./components/EmptyState";
import API from "../../api";
import { clearUser } from "../../slices/authSlice";
import { toast } from "sonner";

const colors = [
  "#4f46e5",
  "#0891b2",
  "#059669",
  "#d97706",
  "#db2777",
  "#7c3aed",
];

const DocumentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("recent");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showActivitySidebar, setShowActivitySidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/api/projects");
      const data = response.data;

      const projects = Array.isArray(data) ? data : data?.projects || [];

      setDocuments(
        projects.map((project) => ({
          id: project._id,
          title: project.title,
          lastModified: project.updatedAt || project.createdAt,
          size: `${Math.max(
            1,
            Math.ceil((project.content || "").length / 1024),
          )} KB`,
          wordCount: (project.content || "")
            .replace(/<[^>]*>/g, " ")
            .trim()
            .split(/\s+/)
            .filter(Boolean).length,
          isStarred: false,
          isShared: (project.members || []).length > 1,
          owner: project.owner?.name || "Unknown",
          ownerId: project.owner?._id || project.owner,
          collaborators: (project.members || []).map((member, index) => ({
            id: member._id || member,
            name: member.name || "Member",
            color: colors[index % colors.length],
          })),
          type: "document",
          status: "active",
        })),
      );
    } catch (err) {
      if (err.response?.status === 401) {
        dispatch(clearUser());
        navigate("/login-screen", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load documents.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const stats = useMemo(() => {
    const recent = documents.filter(
      (doc) => new Date(doc.lastModified) > new Date(Date.now() - 7 * 86400000),
    ).length;
    const shared = documents.filter((doc) => doc.isShared).length;
    const collaborators = new Set(
      documents.flatMap((doc) => doc.collaborators.map((c) => c.id)),
    ).size;
    return {
      totalDocuments: documents.length,
      sharedDocuments: shared,
      recentActivity: recent,
      totalCollaborators: collaborators,
    };
  }, [documents]);

  const filteredAndSortedDocuments = useMemo(
    () =>
      documents
        .filter((doc) => {
          const q = searchQuery.trim().toLowerCase();
          if (
            q &&
            !doc.title.toLowerCase().includes(q) &&
            !doc.owner.toLowerCase().includes(q)
          )
            return false;
          if (
            filterBy === "owned" &&
            doc.ownerId?.toString() !== currentUser?._id?.toString()
          )
            return false;
          if (filterBy === "shared" && !doc.isShared) return false;
          if (
            filterBy === "recent" &&
            new Date(doc.lastModified) < new Date(Date.now() - 3 * 86400000)
          )
            return false;
          if (filterBy === "starred" && !doc.isStarred) return false;
          return true;
        })
        .sort((a, b) =>
          sortBy === "name"
            ? a.title.localeCompare(b.title)
            : new Date(b.lastModified) - new Date(a.lastModified),
        ),
    [documents, searchQuery, filterBy, sortBy, currentUser],
  );

  const handleCreateDocument = async () => {
    const title = window
      .prompt("Name your new document", "Untitled document")
      ?.trim();
    if (!title) return;
    try {
      const { data } = await API.post("/api/projects", { title, content: "" });
      toast.success("Document created");
      navigate(`/document-editor/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to create document.");
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login-screen", { replace: true });
  };
  const activities = documents
    .slice(0, 8)
    .map((doc, index) => ({
      id: doc.id,
      type: "document_edited",
      user: { name: doc.owner, color: colors[index % colors.length] },
      description: `updated ${doc.title}`,
      documentTitle: doc.title,
      timestamp: doc.lastModified,
    }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <GlobalHeader
        user={currentUser}
        notifications={[]}
        onLogout={handleLogout}
      />
      <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-[96px] sm:px-6 lg:px-8">
        <div className="relative mb-7 overflow-hidden rounded-[28px] border border-border/70 bg-card p-6 shadow-card sm:p-8">
          <div className="absolute inset-0 soft-grid opacity-70" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1 text-[11px] font-semibold text-primary"
              >
                <Sparkles size={12} /> Collaborative workspace
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-balance text-3xl font-extrabold tracking-[-.04em] text-foreground sm:text-4xl"
              >
                Everything your team writes, in one place.
              </motion.h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Create polished documents, invite teammates, and watch changes
                appear live without the clutter.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCreateDocument}
                className="flex h-11 items-center gap-2 rounded-xl bg-foreground px-4 text-sm font-semibold text-background shadow-sm transition hover:opacity-90"
              >
                <FilePlus2 size={17} /> New document
              </button>
              <button
                onClick={() => setShowActivitySidebar((v) => !v)}
                className="flex h-11 items-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                <TrendingUp size={16} /> Activity
              </button>
            </div>
          </div>
        </div>

        <QuickStats stats={stats} />
        {error && (
          <div className="mb-5 rounded-2xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
            {error}
          </div>
        )}

        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Your documents</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {loading
                ? "Syncing workspace…"
                : `${filteredAndSortedDocuments.length} documents available`}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground"}`}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        <DashboardToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          selectedCount={selectedDocuments.length}
          onBulkAction={() => setSelectedDocuments([])}
          onCreateDocument={handleCreateDocument}
        />

        <div className="mt-4 rounded-[24px] border border-border/70 bg-card/60 p-3 shadow-soft sm:p-5">
          {loading || filteredAndSortedDocuments.length > 0 ? (
            <DocumentGrid
              documents={filteredAndSortedDocuments}
              viewMode={viewMode}
              selectedDocuments={selectedDocuments}
              onSelectDocument={(id, selected) =>
                setSelectedDocuments((prev) =>
                  selected
                    ? [...new Set([...prev, id])]
                    : prev.filter((x) => x !== id),
                )
              }
              onSelectAll={setSelectedDocuments}
              onShare={(id) =>
                navigate("/document-sharing-settings", {
                  state: { documentId: id },
                })
              }
              onDelete={async (id) => {
                try {
                  await API.delete(`/api/projects/${id}`);
                  setDocuments((prev) => prev.filter((doc) => doc.id !== id));
                  toast.success("Document deleted");
                } catch (err) {
                  toast.error(
                    err.response?.data?.message || "Unable to delete document.",
                  );
                }
              }}
              onDuplicate={() => toast.info("Duplicate is coming soon")}
              onToggleStar={(id) =>
                setDocuments((prev) =>
                  prev.map((d) =>
                    d.id === id ? { ...d, isStarred: !d.isStarred } : d,
                  ),
                )
              }
              loading={loading}
            />
          ) : (
            <EmptyState
              type="no-documents"
              title="Start your first document"
              description="Create a canvas for ideas, plans, meeting notes, or anything your team needs to write together."
              actionLabel="Create document"
              onAction={handleCreateDocument}
            />
          )}
        </div>
      </main>

      {showActivitySidebar && (
        <motion.aside
          initial={{ x: 360 }}
          animate={{ x: 0 }}
          exit={{ x: 360 }}
          className="fixed bottom-0 right-0 top-[72px] z-[80] w-full max-w-sm border-l border-border bg-background/95 p-5 shadow-2xl backdrop-blur-2xl"
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold">Workspace activity</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Recent document changes
              </p>
            </div>
            <button
              onClick={() => setShowActivitySidebar(false)}
              className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
            >
              Close
            </button>
          </div>
          <ActivityFeed activities={activities} />
        </motion.aside>
      )}
    </div>
  );
};

export default DocumentDashboard;
