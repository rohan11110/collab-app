import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Settings,
  Share2,
  Sparkles,
  Sun,
  User,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../../slices/authSlice";
import Button from "../ui/Button";
import { useTheme } from "../ThemeProvider";

const navigationItems = [
  { label: "Workspace", path: "/document-dashboard", icon: LayoutDashboard },
  { label: "Sharing", path: "/document-sharing-settings", icon: Share2 },
  { label: "Profile", path: "/user-profile-settings", icon: User },
];

const GlobalHeader = ({ user, notifications = [], onLogout }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const nav = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();
  const notificationRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const unreadCount = notifications.filter((item) => !item?.read).length;
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const createDocument = () => nav("/document-editor");
  const logout = () => {
    onLogout?.();
    dispatch(clearUser());
    nav("/login-screen", { replace: true });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-border/70 bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => nav("/")}
          className="group flex min-w-0 items-center gap-3 rounded-2xl px-1 py-1 text-left"
        >
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary to-indigo-500 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,.75)]">
            <FileText size={19} strokeWidth={2.2} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="flex items-center gap-1.5 text-[15px] font-semibold tracking-tight text-foreground">
              CollabDocs
              <Sparkles size={13} className="text-primary" />
            </span>
            <span className="block truncate text-[11px] font-medium text-muted-foreground">Realtime workspace</span>
          </span>
        </motion.button>

        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {navigationItems.map(({ label, path, icon: Icon }) => (
            <button
              key={path}
              onClick={() => nav(path)}
              className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-medium transition-colors ${
                isActive(path) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive(path) && (
                <motion.span
                  layoutId="headerActiveTab"
                  className="absolute inset-0 rounded-xl bg-muted/80"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon size={15} className="relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={createDocument}
            className="hidden h-10 items-center gap-2 rounded-xl bg-foreground px-4 text-[13px] font-semibold text-background shadow-sm transition hover:opacity-90 sm:flex"
          >
            <Plus size={16} />
            New document
          </motion.button>

          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card/70 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Toggle theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? "sun" : "moon"}
                initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
                transition={{ duration: 0.18 }}
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </motion.span>
            </AnimatePresence>
          </button>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((value) => !value)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card/70 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-background" />
              )}
            </button>
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 top-12 w-[320px] overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-2xl"
                >
                  <div className="px-3 py-2.5">
                    <p className="text-sm font-semibold text-foreground">Notifications</p>
                    <p className="text-xs text-muted-foreground">Your latest workspace activity</p>
                  </div>
                  {notifications.length ? notifications.slice(0, 5).map((item, index) => (
                    <div key={item.id || index} className="rounded-xl p-3 hover:bg-muted/70">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.message}</p>
                    </div>
                  )) : (
                    <div className="rounded-xl bg-muted/50 px-4 py-8 text-center text-sm text-muted-foreground">
                      You are all caught up.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu((value) => !value)}
              className="group flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-card/70 px-1.5 pr-2 text-left transition hover:bg-muted"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary/90 to-violet-500 text-[11px] font-bold text-white">
                {initials}
              </span>
              <span className="hidden max-w-24 truncate text-[12px] font-semibold text-foreground md:block">{user?.name || "User"}</span>
              <ChevronDown size={14} className="text-muted-foreground transition group-hover:text-foreground" />
            </button>
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 top-12 w-60 overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-2xl"
                >
                  <div className="mb-1 rounded-xl bg-muted/60 px-3 py-3">
                    <p className="truncate text-sm font-semibold text-foreground">{user?.name || "User"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email || ""}</p>
                  </div>
                  <button onClick={() => nav("/user-profile-settings")} className="menu-row">
                    <Settings size={15} /> Settings
                  </button>
                  <button onClick={logout} className="menu-row text-error hover:text-error">
                    <LogOut size={15} /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setShowMobileMenu((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-card/70 text-muted-foreground lg:hidden"
          >
            {showMobileMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="mx-auto max-w-[1600px] space-y-1 px-4 py-3 sm:px-6">
              {navigationItems.map(({ label, path, icon: Icon }) => (
                <button key={path} onClick={() => { nav(path); setShowMobileMenu(false); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Icon size={16} /> {label}
                </button>
              ))}
              <button onClick={createDocument} className="flex w-full items-center gap-3 rounded-xl bg-foreground px-3 py-3 text-sm font-semibold text-background sm:hidden">
                <Plus size={16} /> New document
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default GlobalHeader;
