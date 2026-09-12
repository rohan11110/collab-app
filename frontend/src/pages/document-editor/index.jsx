import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import GlobalHeader from "../../components/ui/GlobalHeader";
import EditorContextBar from "../../components/ui/EditorContextBar";
import DocumentToolbar from "./components/DocumentToolbar";
import DocumentCanvas from "./components/DocumentCanvas";
import CollaborationPanel from "./components/CollaborationPanel";
import VersionHistory from "./components/VersionHistory";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import API from "../../api";
import { clearUser } from "../../slices/authSlice";

const API_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
const WS_URL =
  import.meta.env.VITE_WS_URL || API_URL;

const makeClientId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const DocumentEditor = () => {
  const navigate = useNavigate();
  const { projectId: routeProjectId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  // A document must always be opened with its MongoDB project id.
  const projectId = routeProjectId || location.state?.documentId || null;
console.log(projectId);
  const socketRef = useRef(null);
  const clientIdRef = useRef(makeClientId());
  const emitTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const mountedRef = useRef(false);
  const hasLocalChangesRef = useRef(false);
  const lastLocalContentRef = useRef("");
  const latestContentRef = useRef("");
  const serverContentRef = useRef("");

  const [documentMeta, setDocumentMeta] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [connectionState, setConnectionState] = useState("connecting");
  const [saveState, setSaveState] = useState("saved");
  const [collaborators, setCollaborators] = useState([]);
  const [messages, setMessages] = useState([]);
  const [comments, setComments] = useState([]);
  const [showCollaborationPanel, setShowCollaborationPanel] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [currentFormat, setCurrentFormat] = useState({
    fontFamily: "Inter",
    fontSize: "16",
    bold: false,
    italic: false,
    underline: false,
    align: "left",
  });

  useEffect(() => {
    latestContentRef.current = content;
  }, [content]);

  const wordCount = useMemo(() => {
    const text = content
      .replace(/<br\s*\/?\s*>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .trim();

    return text ? text.split(/\s+/).length : 0;
  }, [content]);

  const documentView = useMemo(
    () => ({
      id: documentMeta?._id || projectId,
      title: documentMeta?.title || "Untitled Document",
      lastModified: documentMeta?.updatedAt
        ? new Date(documentMeta.updatedAt).toLocaleString()
        : "Just now",
      wordCount,
      autoSaved: saveState === "saved",
      owner: documentMeta?.owner || currentUser,
    }),
    [documentMeta, projectId, wordCount, saveState, currentUser]
  );

  const loadProject = useCallback(async () => {
    if (!projectId) {
      setLoadError("No document was selected.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError("");
    hasLocalChangesRef.current = false;

    try {
      const { data } = await API.get(`/api/projects/${projectId}`);
      const serverContent = typeof data?.content === "string" ? data.content : "";

      setDocumentMeta(data);
      if (!hasLocalChangesRef.current) {
        setContent(serverContent);
        latestContentRef.current = serverContent;
        lastLocalContentRef.current = serverContent;
        serverContentRef.current = serverContent;
        setSaveState("saved");
      }
    } catch (error) {
      console.error("Failed to load project:", error);

      const status = error.response?.status;
      if (status === 401) {
        dispatch(clearUser());
        navigate("/login-screen", { replace: true });
        return;
      }

      if (status === 403 || status === 404) {
        setLoadError(error.response?.data?.message || "Document not found.");
      } else {
        setLoadError(
          error.response?.data?.message || "Unable to load this document."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate, projectId]);

  useEffect(() => {
    loadProject();
  }, [loadProject]);

  useEffect(() => {
    if (!projectId || !currentUser?.token) {
      setConnectionState("offline");
      return undefined;
    }

    mountedRef.current = true;
    setConnectionState("connecting");

    const socket = io(WS_URL, {
      auth: {
        token: currentUser.token,
      },
      transports: ["websocket", "polling"],
      withCredentials: false,
      autoConnect: true,
    });

    socketRef.current = socket;

    const handleConnect = () => {
      if (!mountedRef.current) return;
      setConnectionState("connected");

      socket.emit("join:project", { projectId });

      // If the user typed while disconnected, send the latest local version
      // as soon as the socket is back online.
      if (
        hasLocalChangesRef.current ||
        latestContentRef.current !== serverContentRef.current
      ) {
        socket.emit("doc:update", {
          projectId,
          content: latestContentRef.current,
          clientId: clientIdRef.current,
        });
        hasLocalChangesRef.current = false;
        serverContentRef.current = latestContentRef.current;
        setSaveState("saved");
      }
    };

    const handleConnectError = (error) => {
      console.error("Socket connection error:", error.message);
      if (!mountedRef.current) return;
      setConnectionState("error");
    };

    const handleDisconnect = () => {
      if (!mountedRef.current) return;
      setConnectionState("disconnected");
    };

    const handleDocInit = (data = {}) => {
      if (!mountedRef.current) return;

      const serverContent =
        typeof data.content === "string" ? data.content : "";

      // Do not replace text the user has already typed while the socket was
      // connecting. The REST response is already the initial snapshot.
      if (!hasLocalChangesRef.current) {
        setContent(serverContent);
        latestContentRef.current = serverContent;
        lastLocalContentRef.current = serverContent;
        serverContentRef.current = serverContent;
      }

      if (data.meta) {
        setDocumentMeta((prev) => ({
          ...(prev || {}),
          ...data.meta,
          updatedAt: data.meta.lastModified || data.meta.updatedAt,
        }));
      }

      setSaveState("saved");
    };

    const handleRemoteUpdate = (data = {}) => {
      if (data.clientId === clientIdRef.current) return;
      if (typeof data.content !== "string") return;

      setContent(data.content);
      latestContentRef.current = data.content;
      hasLocalChangesRef.current = false;
      lastLocalContentRef.current = data.content;
      serverContentRef.current = data.content;
      setSaveState("saved");
    };

    const handlePresenceUpdate = ({ collaborators: users = [] } = {}) => {
      const currentId = currentUser._id?.toString();
      setCollaborators(
        users.filter((user) => user.id?.toString() !== currentId)
      );
    };

    const handlePresenceUser = ({ user } = {}) => {
      if (!user) return;
      if (user.id?.toString() === currentUser._id?.toString()) return;

      setCollaborators((prev) => {
        const exists = prev.some(
          (item) => item.id?.toString() === user.id?.toString()
        );

        return exists
          ? prev.map((item) =>
              item.id?.toString() === user.id?.toString()
                ? { ...item, ...user }
                : item
            )
          : [...prev, user];
      });
    };

    const handleChatMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleCommentAdded = (comment) => {
      setComments((prev) => [...prev, comment]);
    };

    const handleCommentResolved = ({ commentId } = {}) => {
      if (!commentId) return;
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId ? { ...comment, resolved: true } : comment
        )
      );
    };

    const handleProjectError = ({ message } = {}) => {
      console.error("Project socket error:", message);
      if (message === "Access denied" || message === "Project not found") {
        setLoadError(message);
      }
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);
    socket.on("doc:init", handleDocInit);
    socket.on("doc:remoteUpdate", handleRemoteUpdate);
    socket.on("presence:update", handlePresenceUpdate);
    socket.on("presence:user", handlePresenceUser);
    socket.on("chat:message", handleChatMessage);
    socket.on("comment:added", handleCommentAdded);
    socket.on("comment:resolved", handleCommentResolved);
    socket.on("project:error", handleProjectError);

    return () => {
      mountedRef.current = false;

      if (emitTimerRef.current) {
        clearTimeout(emitTimerRef.current);
        emitTimerRef.current = null;
      }

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }

      if (socket.connected) {
        socket.emit("leave:project", { projectId });
      }

      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setCollaborators([]);
    };
  }, [currentUser?._id, currentUser?.token, projectId]);

  const emitTyping = useCallback(
    (isTyping) => {
      const socket = socketRef.current;
      if (!socket?.connected || !projectId) return;

      socket.emit("presence:update", {
        projectId,
        isTyping,
        cursorPosition: null,
      });
    },
    [projectId]
  );

  const queueDocumentUpdate = useCallback(
    (newContent) => {
      if (!projectId) return;

      latestContentRef.current = newContent;
      lastLocalContentRef.current = newContent;
      hasLocalChangesRef.current = true;
      setContent(newContent);
      setSaveState("saving");

      emitTyping(true);

      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }

      typingTimerRef.current = setTimeout(() => {
        emitTyping(false);
      }, 900);

      if (emitTimerRef.current) {
        clearTimeout(emitTimerRef.current);
      }

      emitTimerRef.current = setTimeout(() => {
        const socket = socketRef.current;

        if (!socket?.connected) {
          // Keep the content in React/DOM. The user can retry without losing
          // what they typed when the connection comes back.
          setSaveState("offline");
          return;
        }

        socket.emit("doc:update", {
          projectId,
          content: latestContentRef.current,
          clientId: clientIdRef.current,
        });

        hasLocalChangesRef.current = false;
        serverContentRef.current = latestContentRef.current;
        setSaveState("saved");
      }, 300);
    },
    [emitTyping, projectId]
  );

  const handleContentChange = useCallback(
    (newContent) => {
      queueDocumentUpdate(newContent);
    },
    [queueDocumentUpdate]
  );

  const handleFormat = (type, value) => {
    setCurrentFormat((prev) => {
      if (["bold", "italic", "underline", "strikethrough"].includes(type)) {
        return { ...prev, [type]: !prev[type] };
      }
      return { ...prev, [type]: value };
    });
  };

  const handleSendMessage = (text) => {
    if (!text?.trim() || !socketRef.current?.connected) return;

    const message = {
      id: makeClientId(),
      user: {
        id: currentUser._id,
        name: currentUser.name,
        color: "#2563EB",
      },
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    socketRef.current.emit("chat:message", { projectId, message });
    setMessages((prev) => [...prev, message]);
  };

  const handleAddComment = (data) => {
    const comment = {
      id: makeClientId(),
      user: {
        id: currentUser._id,
        name: currentUser.name,
        color: "#2563EB",
      },
      text: data.comment,
      selection: data.text,
      timestamp: new Date().toISOString(),
      resolved: false,
      position: data.position,
    };

    setComments((prev) => [...prev, comment]);

    socketRef.current?.emit("comment:add", {
      projectId,
      comment,
    });
  };

  const handleResolveComment = (commentId) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, resolved: true } : comment
      )
    );

    socketRef.current?.emit("comment:resolve", {
      projectId,
      commentId,
    });
  };

  const handleShare = async (type) => {
    if (type === "link") {
      await navigator.clipboard?.writeText(window.location.href);
    }
  };

  const handleExport = (format) => {
    if (format !== "html") return;

    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${documentView.title || "document"}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/login-screen", { replace: true });
  };

  const connectionLabel =
    connectionState === "connected"
      ? "Live"
      : connectionState === "connecting"
        ? "Connecting"
        : connectionState === "error"
          ? "Connection error"
          : connectionState === "offline"
            ? "Offline"
            : "Disconnected";

  if (loadError && !documentMeta && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader user={currentUser} notifications={[]} onLogout={handleLogout} />
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
          <div className="max-w-md rounded-xl border border-border bg-card p-6 text-center shadow-sm">
            <Icon name="FileX" size={40} className="mx-auto mb-3 text-muted-foreground" />
            <h1 className="text-lg font-semibold text-card-foreground">
              Unable to open document
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{loadError}</p>
            <Button className="mt-5" onClick={() => navigate("/document-dashboard")}>
              Back to documents
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader
        user={currentUser}
        notifications={[]}
        onLogout={handleLogout}
      />

      <EditorContextBar
        document={documentView}
        collaborators={collaborators}
        onShare={handleShare}
        onComment={() => setIsCommentMode((value) => !value)}
        onHistory={() => setShowVersionHistory(true)}
        onExport={handleExport}
        onSettings={() => navigate("/user-profile-settings")}
        showCollaborationPanel={showCollaborationPanel}
        onToggleCollaboration={() =>
          setShowCollaborationPanel((value) => !value)
        }
      />

      <div className="flex items-center justify-end gap-2 border-b border-border px-4 py-1 text-xs text-muted-foreground">
        <span
          className={`h-2 w-2 rounded-full ${
            connectionState === "connected" ? "bg-success" : "bg-warning"
          }`}
        />
        <span>{connectionLabel}</span>
        <span>•</span>
        <span>
          {saveState === "saving"
            ? "Saving…"
            : saveState === "offline"
              ? "Waiting for connection"
              : "Saved"}
        </span>
      </div>

      <DocumentToolbar
        onFormat={handleFormat}
        currentFormat={currentFormat}
        onInsert={() => {}}
        onComment={() => setIsCommentMode((value) => !value)}
        isCommentMode={isCommentMode}
      />

      <div className="flex" style={{ height: "calc(100vh - 220px)" }}>
        <DocumentCanvas
          content={content}
          onChange={handleContentChange}
          collaborators={collaborators}
          comments={comments}
          onAddComment={handleAddComment}
          isCommentMode={isCommentMode}
          currentFormat={currentFormat}
          loading={loading}
        />

        <CollaborationPanel
          isOpen={showCollaborationPanel}
          onClose={() => setShowCollaborationPanel(false)}
          collaborators={collaborators}
          messages={messages}
          comments={comments}
          onSendMessage={handleSendMessage}
          onResolveComment={handleResolveComment}
        />

        <VersionHistory
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          versions={[]}
          onRestoreVersion={() => setShowVersionHistory(false)}
          currentVersion="current"
        />
      </div>

      <div className="fixed bottom-6 left-6 flex items-center gap-2 rounded-lg bg-success px-3 py-2 text-success-foreground shadow-elevated">
        <Icon name={saveState === "saving" ? "CloudUpload" : "Check"} size={16} />
        <span className="text-sm font-medium">
          {saveState === "saving"
            ? "Saving…"
            : saveState === "offline"
              ? "Offline"
              : "Saved"}
        </span>
      </div>

      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          variant="default"
          size="icon"
          onClick={() => setShowCollaborationPanel(true)}
          className="h-14 w-14 rounded-full"
        >
          <Icon name="Users" size={24} />
        </Button>
      </div>
    </div>
  );
};

export default DocumentEditor;
