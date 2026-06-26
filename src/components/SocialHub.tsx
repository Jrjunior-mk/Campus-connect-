import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { INITIAL_SOCIAL_ACCOUNTS, SocialMediaAccount } from "../types";
import { 
  Share2, 
  Linkedin, 
  Github, 
  Send, 
  Check, 
  Plus, 
  Bell, 
  TrendingUp, 
  FileText,
  Calendar,
  Layers,
  Sparkles
} from "lucide-react";

export default function SocialHub() {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>(INITIAL_SOCIAL_ACCOUNTS);
  const [composeText, setComposeText] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["LinkedIn", "X"]);
  const [scheduledPosts, setScheduledPosts] = useState<Array<{ text: string; channels: string[]; date: string }>>([
    {
      text: "Excited to share that our JKUAT engineering team has launched a low-latency VoIP router simulator as part of the JR INVENTO project. Check our CAD files!",
      channels: ["LinkedIn", "GitHub"],
      date: "Tomorrow at 10:00 AM"
    }
  ]);
  const [postScheduleDate, setPostScheduleDate] = useState("2026-06-27T10:00");

  const handleToggleLink = (platform: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.platform === platform) {
        const isLinking = !acc.linked;
        return {
          ...acc,
          linked: isLinking,
          username: isLinking ? `scholar_user_${platform.toLowerCase()}` : "",
          followers: isLinking ? Math.floor(Math.random() * 800) + 150 : 0,
          engagementRate: isLinking ? `${(Math.random() * 6 + 2).toFixed(1)}%` : "0.0%",
          recentNotifications: isLinking ? [`Welcome to your linked ${platform} channel!`] : []
        };
      }
      return acc;
    }));
  };

  const handleTogglePlatformSelection = (p: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(p) ? prev.filter(item => item !== p) : [...prev, p]
    );
  };

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!composeText.trim() || selectedPlatforms.length === 0) return;

    const newPost = {
      text: composeText,
      channels: [...selectedPlatforms],
      date: `Scheduled for ${new Date(postScheduleDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}`
    };

    setScheduledPosts(prev => [newPost, ...prev]);
    setComposeText("");
    alert("Cross-platform content scheduled successfully!");
  };

  // Compile unified notifications
  const unifiedNotifications = accounts
    .filter(acc => acc.linked && acc.recentNotifications.length > 0)
    .flatMap(acc => acc.recentNotifications.map(n => ({ platform: acc.platform, text: n })));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)] lg:overflow-hidden p-1">
      
      {/* Platform Login Manager (LHS) */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Share2 className="text-blue-600" size={18} />
          <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Linked Profiles</h3>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          Unify your professional online identity. Securely authorize external connections to sync portfolio statistics and project repositories.
        </p>

        <div className="space-y-3">
          {accounts.map((acc) => (
            <div 
              key={acc.platform} 
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                acc.linked ? "bg-blue-50/40 border-blue-100" : "bg-slate-50/60 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                  acc.linked ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  {acc.platform === "LinkedIn" ? <Linkedin size={15} /> :
                   acc.platform === "GitHub" ? <Github size={15} /> : <span>{acc.platform[0]}</span>}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-800">{acc.platform}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {acc.linked ? `@${acc.username} (${acc.followers} followers)` : "Disconnected"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleToggleLink(acc.platform)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                  acc.linked 
                    ? "bg-white text-red-600 border-red-200 hover:bg-red-50" 
                    : "bg-slate-900 text-white border-slate-900 hover:bg-slate-800"
                }`}
              >
                {acc.linked ? "Unlink" : "Authorize"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Scheduler & Aggregated Notifications (RHS) */}
      <div className="lg:col-span-8 flex flex-col gap-6 h-full">
        
        {/* Composer & Scheduler */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-600" size={18} />
              <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Cross-Platform Composer</h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Unified Buffer
            </span>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <textarea
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
                placeholder="What innovation are you scheduling for your professional network today?"
                rows={3}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs focus:outline-none focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-150">
              {/* Target platforms */}
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Targets:</span>
                {accounts.filter(a => a.linked).map(acc => {
                  const isChecked = selectedPlatforms.includes(acc.platform);
                  return (
                    <button
                      key={acc.platform}
                      type="button"
                      onClick={() => handleTogglePlatformSelection(acc.platform)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                        isChecked ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200"
                      }`}
                    >
                      {isChecked && <Check size={10} />}
                      {acc.platform}
                    </button>
                  );
                })}
              </div>

              {/* Schedule time */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">Schedule:</span>
                <input
                  type="datetime-local"
                  value={postScheduleDate}
                  onChange={(e) => setPostScheduleDate(e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2 py-1 text-[11px] focus:outline-none text-slate-700"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!composeText.trim() || selectedPlatforms.length === 0}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40"
              >
                <Calendar size={14} /> Schedule Broadcast
              </button>
            </div>
          </form>
        </div>

        {/* Aggregated Notification Stream */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
            <Bell className="text-blue-600" size={18} />
            <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Unified Notifications Feed</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
            {unifiedNotifications.map((notif, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-start gap-3 text-xs">
                <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 font-bold flex items-center justify-center font-mono text-[10px] uppercase shrink-0">
                  {notif.platform[0]}
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-800">{notif.platform} Alert</p>
                  <p className="text-slate-600 font-mono text-[11px]">{notif.text}</p>
                </div>
              </div>
            ))}

            {unifiedNotifications.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs">
                No active external notifications. Link your LinkedIn or GitHub accounts to synchronize feeds.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
