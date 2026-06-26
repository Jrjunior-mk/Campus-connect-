import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Settings, 
  Bell, 
  Smartphone, 
  Mail, 
  Briefcase, 
  Upload, 
  Check, 
  Camera, 
  ShieldAlert, 
  HelpCircle,
  FileImage,
  Sparkles
} from "lucide-react";

interface UserProfileSettingsProps {
  userProfile: any;
  setUserProfile: (profile: any) => void;
  onSaveSuccess: (message: string) => void;
}

// Preset high-fidelity avatars
const PRESET_AVATARS = [
  { id: "avatar-1", emoji: "🎓", label: "Scholar", color: "bg-blue-100 border-blue-300 text-blue-700" },
  { id: "avatar-2", emoji: "🚀", label: "Innovator", color: "bg-emerald-100 border-emerald-300 text-emerald-700" },
  { id: "avatar-3", emoji: "⚡", label: "Engineer", color: "bg-amber-100 border-amber-300 text-amber-700" },
  { id: "avatar-4", emoji: "🔬", label: "Researcher", color: "bg-purple-100 border-purple-300 text-purple-700" },
  { id: "avatar-5", emoji: "📱", label: "DevOps", color: "bg-indigo-100 border-indigo-300 text-indigo-700" },
  { id: "avatar-6", emoji: "📡", label: "Telecom", color: "bg-pink-100 border-pink-300 text-pink-700" },
];

const AVAILABILITY_STATUSES = [
  { id: "seeking_internship", label: "Actively Looking for Internships / Attachments", color: "border-emerald-200 bg-emerald-50/40 text-emerald-800 dark:text-emerald-400 dark:bg-emerald-950/20", indicator: "bg-emerald-500" },
  { id: "seeking_research", label: "Open for Research Collaboration & Patents", color: "border-blue-200 bg-blue-50/40 text-blue-800 dark:text-blue-400 dark:bg-blue-950/20", indicator: "bg-blue-500" },
  { id: "seeking_freelance", label: "Available for Part-Time Freelance Engineering", color: "border-purple-200 bg-purple-50/40 text-purple-800 dark:text-purple-400 dark:bg-purple-950/20", indicator: "bg-purple-500" },
  { id: "academic_focus", label: "Focused on Academics & Exams (Not Available)", color: "border-amber-200 bg-amber-50/40 text-amber-800 dark:text-amber-400 dark:bg-amber-950/20", indicator: "bg-amber-500" },
  { id: "seeking_fulltime", label: "Graduated & Seeking Full-Time Trainee Roles", color: "border-sky-200 bg-sky-50/40 text-sky-800 dark:text-sky-400 dark:bg-sky-950/20", indicator: "bg-sky-500" },
];

export default function UserProfileSettings({ 
  userProfile, 
  setUserProfile,
  onSaveSuccess 
}: UserProfileSettingsProps) {
  // Local profile state
  const [bio, setBio] = useState(
    userProfile?.bio || 
    "B.Sc. Telecommunication & Information Engineering student at University of Nairobi, specializing in Cisco Enterprise VoIP and IoT systems development. Passionate about building robust telecommunications networks."
  );
  
  const [name, setName] = useState(userProfile?.name || "John Ragot");
  const [institution, setInstitution] = useState(userProfile?.institution || "University of Nairobi (UoN)");
  const [course, setCourse] = useState(userProfile?.course || "B.Sc. Telecommunication & Information Engineering");
  const [avatarOption, setAvatarOption] = useState(userProfile?.avatarOption || "avatar-1");
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(userProfile?.customAvatarUrl || null);
  const [availabilityStatus, setAvailabilityStatus] = useState(userProfile?.availabilityStatus || "seeking_internship");
  
  // Notification States
  const [notifEmail, setNotifEmail] = useState(userProfile?.notifEmail !== false);
  const [notifSms, setNotifSms] = useState(userProfile?.notifSms !== false);
  const [notifInApp, setNotifInApp] = useState(userProfile?.notifInApp !== false);
  const [notifAiDigest, setNotifAiDigest] = useState(userProfile?.notifAiDigest !== false);

  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processImageFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomAvatarUrl(event.target.result as string);
          setAvatarOption("custom"); // Switch to custom upload
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processImageFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      const updatedProfile = {
        ...userProfile,
        name,
        institution,
        course,
        bio,
        avatarOption,
        customAvatarUrl,
        availabilityStatus,
        notifEmail,
        notifSms,
        notifInApp,
        notifAiDigest
      };
      setUserProfile(updatedProfile);
      onSaveSuccess("User profile settings and professional status synced successfully!");
    }, 1200);
  };

  // Find active preset avatar
  const activePreset = PRESET_AVATARS.find(a => a.id === avatarOption);

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="profile-settings-hub">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-blue-600/30 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Settings className="text-blue-400 animate-spin" size={18} />
            <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-bold">Workspace Configuration</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Scholar Profile Settings</h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Update your professional biography, select a premium scholar avatar, coordinate real-time notification pathways, and establish your availability state for recruiters in Kenya.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Hand: Avatar & Availability (Col size 5) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Avatar Profile Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">Scholar Representation</h3>
            
            <div className="flex flex-col items-center text-center p-3">
              {/* Profile Avatar Frame */}
              <div className="relative group">
                <div className={`w-28 h-28 rounded-full border-2 border-dashed border-blue-500/30 flex items-center justify-center p-1 bg-slate-50 dark:bg-slate-950 overflow-hidden`}>
                  {avatarOption === "custom" && customAvatarUrl ? (
                    <img 
                      src={customAvatarUrl} 
                      alt="Custom Scholar avatar" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover" 
                    />
                  ) : (
                    <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl font-bold shadow-inner ${
                      activePreset ? activePreset.color : "bg-blue-100 text-blue-700"
                    }`}>
                      {activePreset ? activePreset.emoji : "🎓"}
                    </div>
                  )}
                </div>
                
                {/* Hover Camera icon to edit custom avatar */}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute bottom-1 right-1 bg-slate-900 text-white p-2 rounded-full border border-slate-750 hover:bg-slate-850 cursor-pointer shadow-md transition-transform active:scale-90"
                  title="Upload profile image"
                >
                  <Camera size={14} />
                </button>
              </div>

              <div className="mt-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{name}</h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{institution}</p>
              </div>
            </div>

            {/* Selector: Custom avatar drop zone */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                Select Scholar Avatar Preset
              </label>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    type="button"
                    onClick={() => {
                      setAvatarOption(avatar.id);
                    }}
                    className={`h-11 rounded-xl flex items-center justify-center border text-2xl transition-all cursor-pointer ${
                      avatarOption === avatar.id
                        ? "border-blue-600 dark:border-blue-500 scale-115 ring-2 ring-blue-100 bg-white dark:bg-slate-800"
                        : "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100/50"
                    }`}
                    title={avatar.label}
                  >
                    <span>{avatar.emoji}</span>
                  </button>
                ))}
              </div>

              {/* File upload connector */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-2xl p-3.5 text-center transition-colors cursor-pointer text-xs mt-3 select-none ${
                  dragOver 
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-600" 
                    : "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Upload size={16} className="mx-auto text-slate-400 mb-1.5" />
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Drag & drop photo here</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">or click to browse local files</span>
              </div>
            </div>

          </div>

          {/* Availability Status Radio Selector */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide">Professional Availability</h3>
              <span className="text-[9px] font-bold font-mono text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900 uppercase">Live status</span>
            </div>

            <div className="space-y-2">
              {AVAILABILITY_STATUSES.map((status) => (
                <button
                  key={status.id}
                  type="button"
                  onClick={() => setAvailabilityStatus(status.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left text-xs font-medium transition-all cursor-pointer ${
                    availabilityStatus === status.id
                      ? `${status.color} ring-2 ring-blue-500/20 scale-[1.01] font-semibold border-blue-500 dark:border-blue-500`
                      : "border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950/60 text-slate-700 dark:text-slate-350 bg-white dark:bg-slate-900"
                  }`}
                >
                  <span className="flex-1 pr-2 leading-snug">{status.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span className={`w-2 h-2 rounded-full ${status.indicator} animate-pulse`}></span>
                    {availabilityStatus === status.id && (
                      <Check size={14} className="text-blue-600 dark:text-blue-400 stroke-[3]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Hand: Bio & Notifications (Col size 7) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Main Scholar Details Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2">Academic Biography</h3>
            
            <div className="space-y-4">
              {/* Full Name & Info fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                    Full Scholar Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white text-slate-800 dark:text-slate-150 interactive-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                    Assigned Institution
                  </label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white text-slate-800 dark:text-slate-150 interactive-input"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                  Course of Study
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white text-slate-800 dark:text-slate-150 interactive-input"
                />
              </div>

              {/* Biography Area */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                    Professional Scholar Bio
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">{bio.length}/350 chars</span>
                </div>
                <textarea
                  maxLength={350}
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short summary of your background, TVET designs, or telemetry expertise."
                  className="w-full text-xs p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white text-slate-800 dark:text-slate-150 leading-relaxed resize-none interactive-input"
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-2">Workspace Notification Pathways</h3>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Email Switch */}
              <div className="flex items-center justify-between py-3">
                <div className="flex gap-3 items-start max-w-md">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Email Notifications</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                      Receive alerts on peer connection requests, chat responses, and hackathon schedules.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifEmail(!notifEmail)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none cursor-pointer ${
                    notifEmail ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notifEmail ? "translate-x-5" : "translate-x-0"
                  }`}></div>
                </button>
              </div>

              {/* SMS Switch */}
              <div className="flex items-center justify-between py-3">
                <div className="flex gap-3 items-start max-w-md">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 mt-0.5">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">SMS Mobile OTP Pin Tunnels</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                      Receive secure SMS OTP verify triggers for administrative security setups.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifSms(!notifSms)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none cursor-pointer ${
                    notifSms ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notifSms ? "translate-x-5" : "translate-x-0"
                  }`}></div>
                </button>
              </div>

              {/* In-App Workspace Switch */}
              <div className="flex items-center justify-between py-3">
                <div className="flex gap-3 items-start max-w-md">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 mt-0.5">
                    <Bell size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">In-App Banner Broadcasts</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                      Display dynamic high-contrast system alert hub messages immediately during sessions.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifInApp(!notifInApp)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none cursor-pointer ${
                    notifInApp ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notifInApp ? "translate-x-5" : "translate-x-0"
                  }`}></div>
                </button>
              </div>

              {/* AI Recommendations Digest Switch */}
              <div className="flex items-center justify-between py-3">
                <div className="flex gap-3 items-start max-w-md">
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 mt-0.5">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">AI Recommendations Digest</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                      Auto-analyze course matches with real-time job and patent recommendations.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifAiDigest(!notifAiDigest)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none cursor-pointer ${
                    notifAiDigest ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    notifAiDigest ? "translate-x-5" : "translate-x-0"
                  }`}></div>
                </button>
              </div>

            </div>
          </div>

          {/* Save Settings Trigger */}
          <div className="flex justify-end pt-2">
            <button
              id="btn-save-profile-settings"
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3.5 rounded-2xl transition-all cursor-pointer shadow-lg shadow-blue-500/10 flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Synchronizing Enclave Profile...</span>
                </>
              ) : (
                <>
                  <Check size={14} className="stroke-[3]" />
                  <span>Save Profile & Availability</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
