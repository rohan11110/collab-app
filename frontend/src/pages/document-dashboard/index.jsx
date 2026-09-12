import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlobalHeader from "../../components/ui/GlobalHeader";
import DashboardToolbar from "../../components/ui/DashboardToolbar";
import DocumentGrid from "./components/DocumentGrid";
import ActivityFeed from "./components/ActivityFeed";
import QuickStats from "./components/QuickStats";
import EmptyState from "./components/EmptyState";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import API from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../slices/authSlice";

const colors = ["#2563EB", "#059669", "#DC2626", "#7C3AED", "#EA580C", "#0891B2"];

const DocumentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("modified");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showActivitySidebar, setShowActivitySidebar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get("/api/projects");
      const list = data?.projects || [];
      setDocuments(
        list.map((project) => ({
          id: project._id,
          title: project.title,
          lastModified: project.updatedAt || project.createdAt,
          size: `${Math.max(1, Math.ceil((project.content || "").length / 1024))} KB`,
          wordCount: (project.content || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length,
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
        }))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load documents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const stats = useMemo(() => {
    const recent = documents.filter((doc) =>
      new Date(doc.lastModified) > new Date(Date.now() - 7 * 86400000)
    ).length;
    const shared = documents.filter((doc) => doc.isShared).length;
    const collaborators = new Set(documents.flatMap((doc) => doc.collaborators.map((c) => c.id))).size;
    return {
      totalDocuments: documents.length,
      sharedDocuments: shared,
      recentActivity: recent,
      totalCollaborators: collaborators,
    };
  }, [documents]);

  const filteredAndSortedDocuments = useMemo(() => {
    let result = documents.filter((doc) => {
      const q = searchQuery.trim().toLowerCase();
      if (q && !doc.title.toLowerCase().includes(q) && !doc.owner.toLowerCase().includes(q)) return false;
      if (filterBy === "owned" && doc.ownerId?.toString() !== currentUser?._id?.toString()) return false;
      if (filterBy === "shared" && !doc.isShared) return false;
      if (filterBy === "recent" && new Date(doc.lastModified) < new Date(Date.now() - 3 * 86400000)) return false;
      if (filterBy === "starred" && !doc.isStarred) return false;
      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === "name") return a.title.localeCompare(b.title);
      return new Date(b.lastModified) - new Date(a.lastModified);
    });
  }, [documents, searchQuery, filterBy, sortBy, currentUser]);

  const handleCreateDocument = async () => {
    const title = window.prompt("Document title", "Untitled Document")?.trim();
    if (!title) return;
    try {
      const { data } = await API.post("/api/projects", { title, content: "" });
      navigate(`/document-editor/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create document.");
    }
  };

  const handleSelectDocument = (id, selected) => {
    setSelectedDocuments((prev) => selected ? [...new Set([...prev, id])] : prev.filter((x) => x !== id));
  };

  const handleSelectAll = (ids) => setSelectedDocuments(ids);

  const handleDocumentAction = async (action, id) => {
    if (action === "share") navigate("/document-sharing-settings", { state: { documentId: id } });
    if (action === "delete") {
      if (!window.confirm("Delete this document?")) return;
      try {
        await API.delete(`/api/projects/${id}`);
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Unable to delete document.");
      }
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login-screen", { replace: true });
  };

  const notifications = [];
  const activities = documents.slice(0, 8).map((doc, index) => ({
    id: doc.id,
    type: "document_edited",
    user: { name: doc.owner, color: colors[index % colors.length] },
    description: `updated ${doc.title}`,
    documentTitle: doc.title,
    timestamp: doc.lastModified,
  }));

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader user={currentUser} notifications={notifications} onLogout={handleLogout} />
      <div className="pt-16">
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

        <div className="flex">
          <div className={`flex-1 p-6 ${showActivitySidebar ? "mr-80" : ""}`}>
            <QuickStats stats={stats} />
            {error && <div className="mb-4 p-3 rounded-lg bg-error/10 text-error border border-error/20">{error}</div>}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground">
                    {filterBy === "all" ? "All Documents" : filterBy === "owned" ? "My Documents" : filterBy === "shared" ? "Shared with Me" : filterBy === "recent" ? "Recent Documents" : "Starred Documents"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{loading ? "Loading..." : `${filteredAndSortedDocuments.length} documents`}</p>
                </div>
                <Button variant={showActivitySidebar ? "default" : "outline"} size="sm" onClick={() => setShowActivitySidebar(!showActivitySidebar)} iconName="Activity" iconPosition="left" iconSize={16}>Activity</Button>
              </div>
              <div className="p-6">
                {loading || filteredAndSortedDocuments.length > 0 ? (
                  <DocumentGrid
                    documents={filteredAndSortedDocuments}
                    viewMode={viewMode}
                    selectedDocuments={selectedDocuments}
                    onSelectDocument={handleSelectDocument}
                    onSelectAll={handleSelectAll}
                    onShare={(id) => handleDocumentAction("share", id)}
                    onDelete={(id) => handleDocumentAction("delete", id)}
                    onDuplicate={() => {}}
                    onToggleStar={(id) => setDocuments((prev) => prev.map((d) => d.id === id ? { ...d, isStarred: !d.isStarred } : d))}
                    loading={loading}
                  />
                ) : (
                  <EmptyState type="no-documents" title="No documents" description="Create your first collaborative document." actionLabel="Create document" onAction={handleCreateDocument} />
                )}
              </div>
            </div>
          </div>

          {showActivitySidebar && (
            <div className="fixed right-0 top-16 bottom-0 w-80 bg-background border-l border-border z-50">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowActivitySidebar(false)}><Icon name="X" size={20} /></Button>
              </div>
              <div className="p-4 h-full overflow-y-auto"><ActivityFeed activities={activities} /></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDashboard;
