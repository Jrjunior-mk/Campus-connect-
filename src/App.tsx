import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { OnboardingProfile, RecommendationData } from "./types";
import Sidebar from "./components/Sidebar";
import Onboarding from "./components/Onboarding";
import CommunicationSuite from "./components/CommunicationSuite";
import MapNavigation from "./components/MapNavigation";
import ProductivityHub from "./components/ProductivityHub";
import SocialHub from "./components/SocialHub";
import CampusConnect from "./components/CampusConnect";
import CareersSuite from "./components/CareersSuite";
import EventsEcosystem from "./components/EventsEcosystem";
import SecurityCenter from "./components/SecurityCenter";
import AiAssistant from "./components/AiAssistant";
import ProjectRoom from "./components/ProjectRoom";
import CareerNewsFeed from "./components/CareerNewsFeed";
import Login from "./components/Login";
import UserProfileSettings from "./components/UserProfileSettings";

import { 
  Sparkles, 
  Bot, 
  TrendingUp, 
  Users, 
  Compass, 
  MessageSquare, 
  Award, 
  ShieldCheck, 
  Network,
  Activity,
  UserCheck,
  Menu,
  Sun,
  Moon,
  Bell,
  BellOff,
  Check,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("workspace-logged-in") === "true";
  });
  const [showRegister, setShowRegister] = useState(false);

  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem("workspace-logged-in") === "true";
  });

  const [userProfile, setUserProfile] = useState<any>(() => {
    const saved = localStorage.getItem("workspace-user-profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [aiRecommendations, setAiRecommendations] = useState<RecommendationData | null>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(false);

  // Notification State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "New Connection Request",
      sender: "Sylvia Njeri (Safaricom Lead)",
      date: "Today",
      description: "Sylvia viewed your profile and would like to connect and discuss your TVET & engineering designs.",
      type: "connection" as const,
      read: false,
      accepted: false,
      declined: false
    },
    {
      id: "notif-2",
      title: "Upcoming Cisco Workshop",
      date: "Tomorrow",
      description: "Eng. Hillary Rono's Cisco Enterprise VoIP & Unified Communications Workshop begins at 2:00 PM.",
      type: "event" as const,
      read: false,
      eventId: "ev1"
    },
    {
      id: "notif-3",
      title: "Security Setup Warning",
      date: "Yesterday",
      description: "Secure your workspace. Scan your fingerprint and verify SMS OTP to activate your secure enclave profile.",
      type: "security" as const,
      read: true
    },
    {
      id: "notif-4",
      title: "Upcoming Engineering Hackathon",
      date: "In 2 weeks",
      description: "Kenyan Engineering Hackathon 2026 starts at the Main Auditorium, University of Nairobi.",
      type: "event" as const,
      read: true,
      eventId: "ev2"
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAcceptConnection = (id: string, sender: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, accepted: true, description: `Accepted request! Added ${sender} to your professional circles.` } : n));
    setToastMessage(`Connection request with ${sender} accepted!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDeclineConnection = (id: string, sender: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, declined: true, description: `Declined connection request from ${sender}.` } : n));
    setToastMessage(`Connection request with ${sender} declined.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Persistent Theme State
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("workspace-theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("workspace-theme", theme);
  }, [theme]);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (profile: OnboardingProfile, recommendations: any) => {
    const completeProfile = {
      ...profile,
      bio: "B.Sc. Telecommunication & Information Engineering scholar at University of Nairobi, specializing in Cisco Enterprise VoIP and IoT systems development.",
      avatarOption: "avatar-1",
      customAvatarUrl: null,
      availabilityStatus: "seeking_internship",
      notifEmail: true,
      notifSms: true,
      notifInApp: true,
      notifAiDigest: true
    };
    setUserProfile(completeProfile);
    localStorage.setItem("workspace-user-profile", JSON.stringify(completeProfile));
    localStorage.setItem("workspace-logged-in", "true");
    setIsLoggedIn(true);

    if (recommendations) {
      setAiRecommendations(recommendations);
    } else {
      // Load standard default recommendations in type-safe format
      setAiRecommendations({
        connections: [
          { name: "Dr. Evans Mwangi", role: "Networking Lead & Professor", institution: profile.institution, connectionReason: "Matches your academic trajectory." },
          { name: "Sylvia Njeri", role: "Cloud Architect at Safaricom", institution: "Nairobi", connectionReason: "Leads East Africa VoIP trunk operations." }
        ],
        groups: [
          { name: "IEEE Kenya Student Branch", description: "Hackathons and student peer paper publications.", category: "Professional" }
        ],
        jobs: [
          { title: "Graduate Trainee Systems Engineer", company: "Cisco Systems", location: "Nairobi (Hybrid)", matchingScore: 92, whyMatch: "Excellent match for your course department." }
        ],
        learningResources: [
          { title: "VoIP Protocols: SIP & SRTP QoS setups", platform: "JR INVENTO Open Lib", duration: "6 Hours", benefits: "Provides practical telemetry routing mastery." }
        ],
        careerAdvisorQuote: "Proactive communication coupled with hands-on fabrication will launch your Kenyan-built inventions globally."
      });
    }
    setIsOnboarded(true);
    setActiveTab("dashboard");
  };

  const handleLoginSuccess = (email: string, userName: string, customBio?: string, customAvatar?: string) => {
    localStorage.setItem("workspace-logged-in", "true");
    setIsLoggedIn(true);

    const savedProfile = localStorage.getItem("workspace-user-profile");
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setIsOnboarded(true);
    } else {
      const initialProfile = {
        academicBackground: "Undergraduate Student",
        institution: "University of Nairobi (UoN)",
        course: "B.Sc. Telecommunication & Information Engineering",
        department: "School of Engineering",
        skills: "React, Cisco Routing, Python, VoIP, SIP",
        careerInterests: "Cloud Systems, Telecom Engineering",
        locationPreferences: "Nairobi (Hybrid)",
        researchInterests: "Internet of Things & Smart Grids",
        industryInterests: "Telecommunication Systems",
        eventInterests: "Hackathons & Technical Webinars",
        bio: customBio || "B.Sc. Telecommunication & Information Engineering scholar at University of Nairobi, specializing in Cisco Enterprise VoIP and IoT systems development.",
        avatarOption: "avatar-1",
        customAvatarUrl: customAvatar || null,
        availabilityStatus: "seeking_internship",
        notifEmail: true,
        notifSms: true,
        notifInApp: true,
        notifAiDigest: true
      };

      setUserProfile(initialProfile);
      localStorage.setItem("workspace-user-profile", JSON.stringify(initialProfile));
      setIsOnboarded(true);
    }

    setAiRecommendations({
      connections: [
        { name: "Dr. Evans Mwangi", role: "Networking Lead & Professor", institution: "University of Nairobi (UoN)", connectionReason: "Matches your academic trajectory." },
        { name: "Sylvia Njeri", role: "Cloud Architect at Safaricom", institution: "Nairobi", connectionReason: "Leads East Africa VoIP trunk operations." }
      ],
      groups: [
        { name: "IEEE Kenya Student Branch", description: "Hackathons and student peer paper publications.", category: "Professional" }
      ],
      jobs: [
        { title: "Graduate Trainee Systems Engineer", company: "Cisco Systems", location: "Nairobi (Hybrid)", matchingScore: 92, whyMatch: "Excellent match for your course department." }
      ],
      learningResources: [
        { title: "VoIP Protocols: SIP & SRTP QoS setups", platform: "JR INVENTO Open Lib", duration: "6 Hours", benefits: "Provides practical telemetry routing mastery." }
      ],
      careerAdvisorQuote: "Proactive communication coupled with hands-on fabrication will launch your Kenyan-built inventions globally."
    });

    setToastMessage(`Welcome back, ${userName}! Secure session authorized.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("workspace-logged-in");
    setIsLoggedIn(false);
    setShowRegister(false);
    setIsOnboarded(false);
    setUserProfile(null);
    setToastMessage("Secure session cleared. Logged out successfully.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Restore AI recommendations on load if logged in
  useEffect(() => {
    if (isLoggedIn) {
      setAiRecommendations({
        connections: [
          { name: "Dr. Evans Mwangi", role: "Networking Lead & Professor", institution: userProfile?.institution || "University of Nairobi (UoN)", connectionReason: "Matches your academic trajectory." },
          { name: "Sylvia Njeri", role: "Cloud Architect at Safaricom", institution: "Nairobi", connectionReason: "Leads East Africa VoIP trunk operations." }
        ],
        groups: [
          { name: "IEEE Kenya Student Branch", description: "Hackathons and student peer paper publications.", category: "Professional" }
        ],
        jobs: [
          { title: "Graduate Trainee Systems Engineer", company: "Cisco Systems", location: "Nairobi (Hybrid)", matchingScore: 92, whyMatch: "Excellent match for your course department." }
        ],
        learningResources: [
          { title: "VoIP Protocols: SIP & SRTP QoS setups", platform: "JR INVENTO Open Lib", duration: "6 Hours", benefits: "Provides practical telemetry routing mastery." }
        ],
        careerAdvisorQuote: "Proactive communication coupled with hands-on fabrication will launch your Kenyan-built inventions globally."
      });
    }
  }, [isLoggedIn]);

  // Skip Onboarding Utility for quick demo
  const handleQuickDemo = () => {
    const demoProfile: OnboardingProfile = {
      academicBackground: "Undergraduate Student",
      institution: "University of Nairobi (UoN)",
      course: "B.Sc. Telecommunication & Information Engineering",
      department: "School of Engineering",
      skills: "Cisco Routing, React, SIP, Python",
      careerInterests: "Cloud Telephony Systems, DevOps",
      locationPreferences: "Nairobi (Hybrid)",
      researchInterests: "Internet of Things & QoS Routing",
      industryInterests: "Telecommunication Systems",
      eventInterests: "Hackathons & Technical Webinars"
    };
    handleOnboardingComplete(demoProfile, null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased selection:bg-blue-500/20">
      
      {/* APP SECURE GATEWAY LOGIN */}
      {!isLoggedIn && !showRegister ? (
        <div className="flex-1 flex flex-col justify-center py-10 px-4 bg-slate-950 min-h-screen">
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onGoToRegister={() => setShowRegister(true)} 
          />
        </div>
      ) : !isLoggedIn && showRegister ? (
        /* ONBOARDING FLOW PANEL */
        <div className="flex-1 flex flex-col justify-center py-6 px-4 bg-slate-900 min-h-screen">
          <div className="max-w-3xl mx-auto w-full text-center mb-6">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">JR INVENTO</h1>
            <p className="text-sm text-slate-400 font-mono mt-1 uppercase tracking-widest">
              Global Communication, Networking, Education & Professional Ecosystem
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleQuickDemo}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/10"
              >
                <UserCheck size={14} /> Skip to Quick Demo Dashboard
              </button>
            </div>
          </div>

          <Onboarding 
            onComplete={handleOnboardingComplete} 
            isLoading={onboardingLoading} 
            setIsLoading={setOnboardingLoading} 
          />
        </div>
      ) : (
        /* CORE APPLICATION LAYOUT */
        <div className="flex flex-row min-h-screen">
          
          {/* Sidebar */}
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isCollapsed={sidebarCollapsed} 
            setIsCollapsed={setSidebarCollapsed} 
            userProfile={userProfile}
            isMobileOpen={mobileMenuOpen}
            setIsMobileOpen={setMobileMenuOpen}
            onLogout={handleLogout}
          />

          {/* Main workspace container */}
          <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50 relative custom-scrollbar">
            
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 h-16 px-4 md:px-6 sticky top-0 flex items-center justify-between z-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-1.5 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden transition-colors"
                  aria-label="Open menu"
                >
                  <Menu size={20} />
                </button>
                <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline">MODULE:</span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                  {activeTab === "dashboard" ? "Dashboard Hub" : activeTab}
                </span>
              </div>

              {/* Security Audit Badge */}
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-medium">
                  <ShieldCheck size={14} />
                  <span>E2E Encryption Deployed</span>
                </div>

                {/* High-Contrast Theme Switcher Toggle */}
                <button
                  onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}
                  className="p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-200 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
                >
                  {theme === "light" ? (
                    <>
                      <Moon size={14} className="text-slate-600" />
                      <span className="text-[10px] font-bold font-mono text-slate-600 hidden md:inline">DARK MODE</span>
                    </>
                  ) : (
                    <>
                      <Sun size={14} className="text-amber-400" />
                      <span className="text-[10px] font-bold font-mono text-amber-400 hidden md:inline">LIGHT MODE</span>
                    </>
                  )}
                </button>

                {/* Notification Dropdown Container */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-750 dark:text-slate-200 rounded-lg transition-all flex items-center justify-center cursor-pointer shadow-sm relative active:scale-95"
                    title="Alerts & Notifications"
                  >
                    <Bell size={14} className={notifications.some(n => !n.read) ? "animate-bounce text-blue-600 dark:text-blue-400" : "text-slate-600 dark:text-slate-200"} />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white font-mono text-[8px] font-bold rounded-full flex items-center justify-center shadow-sm">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <>
                        <div className="fixed inset-0 z-40 cursor-default" onClick={() => setNotificationsOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 15, scale: 0.95 }}
                          className="absolute right-0 mt-2.5 w-[300px] sm:w-[380px] max-w-[calc(100vw-32px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden text-xs"
                        >
                          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
                            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono tracking-wider uppercase">Alerts Hub</span>
                            <button
                              onClick={handleMarkAllNotificationsRead}
                              className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            >
                              Mark all read
                            </button>
                          </div>

                          <div className="max-h-[350px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 custom-scrollbar">
                            {notifications.length > 0 ? (
                              notifications.map((notif) => (
                                <div
                                  key={notif.id}
                                  className={`p-4 space-y-2.5 transition-colors border-b border-slate-100 dark:border-slate-800 ${
                                    notif.read 
                                      ? "bg-slate-50 dark:bg-slate-900" 
                                      : "bg-blue-50 dark:bg-blue-950/40 border-l-2 border-blue-500"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="space-y-0.5">
                                      <h4 className={`text-xs font-bold ${notif.read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-slate-100"}`}>{notif.title}</h4>
                                      <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono font-bold uppercase">{notif.date}</p>
                                    </div>
                                    {!notif.read && (
                                      <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0"></span>
                                    )}
                                  </div>

                                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                                    {notif.description}
                                  </p>

                                  {notif.type === "connection" && !notif.accepted && !notif.declined && (
                                    <div className="flex items-center gap-1.5 pt-1.5">
                                      <button
                                        onClick={() => handleAcceptConnection(notif.id, notif.sender || "")}
                                        className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => handleDeclineConnection(notif.id, notif.sender || "")}
                                        className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer transition-colors border border-slate-200 dark:border-slate-700 shadow-sm"
                                      >
                                        Decline
                                      </button>
                                    </div>
                                  )}

                                  {notif.type === "event" && (
                                    <button
                                      onClick={() => {
                                        setNotificationsOpen(false);
                                        setActiveTab("events");
                                        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                      }}
                                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 pt-1 cursor-pointer"
                                    >
                                      <span>View Event Ecosystem</span>
                                      <ArrowUpRight size={11} />
                                    </button>
                                  )}

                                  {notif.type === "security" && (
                                    <button
                                      onClick={() => {
                                        setNotificationsOpen(false);
                                        setActiveTab("security");
                                        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
                                      }}
                                      className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 pt-1 cursor-pointer"
                                    >
                                      <span>Setup Security Enclave</span>
                                      <ArrowUpRight size={11} />
                                    </button>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="p-8 text-center text-slate-400 space-y-1">
                                <BellOff size={18} className="mx-auto text-slate-300" />
                                <p className="text-[10px] font-mono">No notifications found</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => setAssistantOpen(!assistantOpen)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-slate-950/10"
                >
                  <Bot size={14} className="text-blue-400" />
                  <span className="text-[11px] sm:text-xs">Ask AI Assistant</span>
                </button>
              </div>
            </header>

            {/* Core workspace tabs */}
            <main className="flex-1 p-4 md:p-6 max-w-[1600px] w-full mx-auto">
              
              {/* TAB: EXECUTIVE BENTO-GRID DASHBOARD */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  
                  {/* Top Welcome Alert Banner */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-blue-600/30 rounded-full blur-3xl"></div>
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="text-blue-400 animate-pulse" size={20} />
                        <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-bold">JR INVENTO AI AGENT METRIC</span>
                      </div>
                      <h2 className="text-2xl font-bold tracking-tight">
                        Hello, {userProfile?.name || "Student Innovator"}! Welcome to your Cisco-inspired Digital Hub.
                      </h2>
                      <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                        We have automatically generated deep recommendations for professional student networks, local TVET projects, patent registrations, and Cisco VoIP attachments based on your stated Electrical/ICT profile.
                      </p>
                    </div>
                  </div>

                  {/* Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Bento 1: Dynamic AI Quote (LHS size 4) */}
                    <div className="md:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between interactive-card">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase font-mono text-[10px]">
                          <Bot className="text-blue-600" size={14} />
                          <span>AI Mentor Strategy</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium italic">
                          "{aiRecommendations?.careerAdvisorQuote}"
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-2xl flex items-center gap-3">
                        <Activity className="text-blue-600 animate-pulse" size={18} />
                        <div>
                          <p className="text-[10px] text-slate-500 font-mono font-bold uppercase">VoIP Trunk Health</p>
                          <p className="text-xs font-semibold text-slate-800">45 Active connections | latency 14ms</p>
                        </div>
                      </div>
                    </div>

                    {/* Bento 2: Network Recommendations (MHS size 5) */}
                    <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 interactive-card">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase font-mono text-[10px]">
                          <Network className="text-blue-600" size={14} />
                          <span>AI Recommended Connections</span>
                        </div>
                        <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-100 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider">Matched</span>
                      </div>

                      <div className="space-y-3.5">
                        {aiRecommendations?.connections.map((con, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setActiveTab("comm")}
                            className="flex items-start justify-between gap-3 text-xs border-b border-slate-50 pb-2.5 last:border-0 last:pb-0 cursor-pointer hover:bg-slate-50/60 p-1.5 rounded-xl transition-all group"
                            title="Click to Chat with connection"
                          >
                            <div className="flex items-start gap-3 overflow-hidden">
                              <div className="w-7 h-7 rounded-full bg-slate-100 border border-blue-500 flex items-center justify-center font-bold font-mono text-[10px] group-hover:scale-105 transition-transform shrink-0">
                                {con.name[0]}
                              </div>
                              <div className="space-y-0.5 overflow-hidden">
                                <p className="font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{con.name}</p>
                                <p className="text-[10px] text-slate-500 font-mono truncate">{con.role} ({con.institution.split(" ")[0]})</p>
                                <p className="text-[10px] text-slate-400 font-serif italic line-clamp-1">Reason: "{con.connectionReason}"</p>
                              </div>
                            </div>
                            <span className="text-[9px] text-blue-500 font-mono font-bold group-hover:underline self-center shrink-0">Chat</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bento 3: Quick Stats (RHS size 3) */}
                    <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between text-center interactive-card">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Ecosystem Status</span>
                        <div className="text-3xl font-extrabold text-slate-800 font-mono">14.2K</div>
                        <p className="text-[10px] text-slate-500">Global inventors active today</p>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex justify-around text-center">
                        <button 
                          onClick={() => setActiveTab("campus")} 
                          className="hover:bg-slate-50 p-1.5 rounded-lg transition-all cursor-pointer group"
                          title="View CAD Viewer"
                        >
                          <p className="text-xs font-bold text-slate-800 font-mono group-hover:text-blue-600">2</p>
                          <p className="text-[9px] text-slate-400 font-mono underline group-hover:text-blue-500">My CADs</p>
                        </button>
                        <button 
                          onClick={() => setActiveTab("events")} 
                          className="hover:bg-slate-50 p-1.5 rounded-lg transition-all cursor-pointer group"
                          title="View Events & Passes"
                        >
                          <p className="text-xs font-bold text-slate-800 font-mono group-hover:text-blue-600">4</p>
                          <p className="text-[9px] text-slate-400 font-mono underline group-hover:text-blue-500 font-semibold">Passes</p>
                        </button>
                        <button 
                          onClick={() => setActiveTab("careers")} 
                          className="hover:bg-slate-50 p-1.5 rounded-lg transition-all cursor-pointer group"
                          title="View Score & Prep"
                        >
                          <p className="text-xs font-bold text-slate-800 font-mono group-hover:text-blue-600">92%</p>
                          <p className="text-[9px] text-slate-400 font-mono underline group-hover:text-blue-500 font-semibold">M. Score</p>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Row Bento Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Recommended Groups & Communities */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 interactive-card">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase font-mono text-[10px]">
                          <Users className="text-blue-600" size={14} />
                          <span>Student Circles & TVET Forums</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {aiRecommendations?.groups.map((g, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-slate-800">{g.name}</h5>
                              <span className="text-[8px] font-bold font-mono uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                {g.category}
                              </span>
                            </div>
                            <p className="text-slate-500 line-clamp-2">{g.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Academic Resources */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3 interactive-card">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-1">
                        <div className="flex items-center gap-2 text-slate-400 font-bold uppercase font-mono text-[10px]">
                          <Compass className="text-blue-600" size={14} />
                          <span>Learning Pathways & Cisco Accreditations</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {aiRecommendations?.learningResources.map((res, idx) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-bold text-slate-800 truncate">{res.title}</h5>
                              <span className="text-[9px] font-mono text-slate-400">{res.duration}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono">Platform: {res.platform}</p>
                            <p className="text-[11px] text-slate-600 font-serif italic mt-1">Benefit: "{res.benefits}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Virtual Project Rooms & Innovation workspaces */}
                  <ProjectRoom onNavigateToTab={setActiveTab} />

                </div>
              )}

              {/* Render Tab Views dynamically */}
              {activeTab === "comm" && <CommunicationSuite userProfile={userProfile} />}
              {activeTab === "map" && <MapNavigation />}
              {activeTab === "productivity" && <ProductivityHub />}
              {activeTab === "social" && <SocialHub />}
              {activeTab === "campus" && <CampusConnect />}
              {activeTab === "careers" && <CareersSuite userProfile={userProfile} recommendations={aiRecommendations} />}
              {activeTab === "news" && <CareerNewsFeed userProfile={userProfile} />}
              {activeTab === "events" && <EventsEcosystem />}
              {activeTab === "security" && <SecurityCenter />}
              {activeTab === "profile" && (
                <UserProfileSettings 
                  userProfile={userProfile} 
                  setUserProfile={(p) => {
                    setUserProfile(p);
                    localStorage.setItem("workspace-user-profile", JSON.stringify(p));
                  }} 
                  onSaveSuccess={(msg) => {
                    setToastMessage(msg);
                    setTimeout(() => setToastMessage(null), 4000);
                  }}
                />
              )}

            </main>

            {/* Toast Alerts Container */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  className="fixed bottom-6 left-6 right-6 sm:right-auto z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-2.5 text-xs font-medium max-w-[calc(100vw-48px)] sm:max-w-md"
                >
                  <Check className="text-emerald-400 shrink-0" size={16} />
                  <span className="break-words">{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Float Floating AI Trigger Button */}
            <button
              onClick={() => setAssistantOpen(true)}
              className="fixed bottom-6 right-6 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-transform hover:scale-105 z-35 border border-slate-800"
            >
              <Bot size={24} className="text-blue-400 animate-pulse" />
            </button>

            {/* AI Assistant Drawer Component */}
            <AiAssistant 
              userProfile={userProfile} 
              isOpen={assistantOpen} 
              onClose={() => setAssistantOpen(false)} 
            />

          </div>
        </div>
      )}

    </div>
  );
}
