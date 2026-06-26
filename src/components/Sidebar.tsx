import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Building2, 
  MessageSquare, 
  Map, 
  Clock, 
  Share2, 
  Briefcase, 
  Calendar, 
  ShieldAlert, 
  Bot,
  LogOut,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Newspaper
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  userProfile: any;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onLogout?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  isCollapsed, 
  setIsCollapsed, 
  userProfile,
  isMobileOpen,
  setIsMobileOpen,
  onLogout
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTabSelect = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const getAvatarEmoji = (id: string) => {
    const map: Record<string, string> = {
      "avatar-1": "🎓",
      "avatar-2": "🚀",
      "avatar-3": "⚡",
      "avatar-4": "🔬",
      "avatar-5": "📱",
      "avatar-6": "📡"
    };
    return map[id] || "🎓";
  };

  const getAvailabilityColor = (status: string) => {
    const map: Record<string, string> = {
      seeking_internship: "bg-emerald-500",
      seeking_research: "bg-blue-500",
      seeking_freelance: "bg-purple-500",
      academic_focus: "bg-amber-500",
      seeking_fulltime: "bg-sky-500",
    };
    return map[status] || "bg-emerald-500";
  };

  const getAvailabilityLabel = (status: string) => {
    const map: Record<string, string> = {
      seeking_internship: "Active Internship Search",
      seeking_research: "Research Collab Open",
      seeking_freelance: "Freelance Avail",
      academic_focus: "Exam Mode (Busy)",
      seeking_fulltime: "Seeking Placement",
    };
    return map[status] || "Active Status";
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard Hub", icon: Sparkles, badge: "AI" },
    { id: "comm", label: "Communication Suite", icon: MessageSquare, badge: "VoIP" },
    { id: "map", label: "Smart Navigation", icon: Map },
    { id: "productivity", label: "Productivity Hub", icon: Clock },
    { id: "social", label: "Social Media Hub", icon: Share2 },
    { id: "campus", label: "Campus Connect", icon: Building2 },
    { id: "careers", label: "Careers & CV AI", icon: Briefcase, badge: "Prep" },
    { id: "news", label: "Career News Feed", icon: Newspaper, badge: "Live" },
    { id: "events", label: "Events Ecosystem", icon: Calendar },
    { id: "security", label: "Security & Consent", icon: ShieldAlert },
    { id: "profile", label: "My Profile Settings", icon: UserCheck, badge: "New" },
  ];

  const sidebarWidth = isCollapsed ? "80px" : "280px";

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden"
        />
      )}

      <motion.div 
        initial={isMobile ? { x: -280 } : false}
        animate={
          isMobile 
            ? { x: isMobileOpen ? 0 : -280, width: "280px" } 
            : { x: 0, width: sidebarWidth }
        }
        transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
        className={`bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col h-screen fixed md:sticky top-0 left-0 shrink-0 z-50 md:z-40 shadow-xl`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          {(!isCollapsed || isMobile) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl tracking-wider text-white shadow-lg shadow-blue-500/20">
                JR
              </div>
              <div>
                <h1 className="font-bold tracking-tight text-md text-white">JR INVENTO</h1>
                <span className="text-[10px] text-blue-400 font-medium tracking-widest block uppercase">GLOBAL PLATFORM</span>
              </div>
            </motion.div>
          )}

          {isCollapsed && !isMobile && (
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl text-white mx-auto">
              JR
            </div>
          )}

          {/* Controls toggle - desktop collapses, mobile closes */}
          {isMobile ? (
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 md:hidden"
            >
              <X size={16} />
            </button>
          ) : (
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 hidden md:block"
            >
              {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          )}
        </div>

        {/* User Quick Info */}
        <div 
          onClick={() => handleTabSelect("profile")}
          className="p-4 border-b border-slate-800/60 bg-slate-950/40 cursor-pointer hover:bg-slate-800/30 transition-all group relative"
          title="View Scholar Profile & Settings"
        >
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-blue-500/60 flex items-center justify-center text-lg font-bold overflow-hidden">
                {userProfile?.avatarOption === "custom" && userProfile?.customAvatarUrl ? (
                  <img 
                    src={userProfile.customAvatarUrl} 
                    alt="Scholar avatar" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <span className="text-xl">
                    {userProfile?.avatarOption ? getAvatarEmoji(userProfile.avatarOption) : "🎓"}
                  </span>
                )}
              </div>
              
              {/* Availability dot indicator */}
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                userProfile?.availabilityStatus 
                  ? getAvailabilityColor(userProfile.availabilityStatus) 
                  : "bg-emerald-500"
              } animate-pulse`}></span>
            </div>

            {(!isCollapsed || isMobile) && (
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-semibold truncate text-white group-hover:text-blue-400 transition-colors">
                  {userProfile?.name || "Guest Scholar"}
                </p>
                <p className="text-[10px] text-slate-400 truncate font-mono">
                  {userProfile?.institution || "Unregistered Session"}
                </p>
                <span className="text-[9px] font-bold text-slate-500 block truncate uppercase mt-0.5 font-mono">
                  {userProfile?.availabilityStatus 
                    ? getAvailabilityLabel(userProfile.availabilityStatus) 
                    : "Internship Active"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Nav Menu */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg transition-all text-left text-sm font-medium ${
                  isActive 
                    ? "bg-blue-600/90 text-white shadow-lg shadow-blue-600/10" 
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                {(!isCollapsed || isMobile) && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {(!isCollapsed || isMobile) && item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${
                    item.badge === "AI" 
                      ? "bg-emerald-500/20 text-emerald-400" 
                      : "bg-blue-50/20 text-blue-400"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer System Status & Logout */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 font-mono">
          {(!isCollapsed || isMobile) ? (
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] text-slate-400">SIP Network Live</span>
                </div>
                <p className="text-[10px] text-slate-500">Node: CISCO-VOIP-KY</p>
              </div>
              {onLogout && (
                <button
                  id="sidebar-logout-button-expanded"
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-400 border border-slate-700 hover:border-red-900 text-slate-300 transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  title="Sign Out Session"
                >
                  <LogOut size={13} />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {onLogout && (
                <button
                  id="sidebar-logout-button-collapsed"
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/40 hover:text-red-400 border border-slate-700 hover:border-red-900 text-slate-300 transition-colors cursor-pointer flex items-center justify-center"
                  title="Sign Out Session"
                >
                  <LogOut size={13} />
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
