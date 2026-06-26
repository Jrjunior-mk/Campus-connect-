import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatChannel, ChatMessage, MOCK_CHANNELS } from "../types";
import { 
  Send, 
  Video, 
  Phone, 
  Globe, 
  FileText, 
  Activity, 
  Mic, 
  MicOff, 
  VideoOff, 
  Tv, 
  Users, 
  Maximize2, 
  Sliders, 
  Bot, 
  Smile, 
  Trash2,
  Calendar,
  VolumeX,
  PlusCircle,
  Clock,
  ExternalLink,
  ArrowLeft
} from "lucide-react";

interface CommunicationSuiteProps {
  userProfile: any;
}

export default function CommunicationSuite({ userProfile }: CommunicationSuiteProps) {
  const [channels, setChannels] = useState<ChatChannel[]>(MOCK_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState("global-lobby");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [translateTarget, setTranslateTarget] = useState("Swahili");
  
  // Call State
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video">("video");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isNoiseSuppressed, setIsNoiseSuppressed] = useState(false);
  const [conferenceMode, setConferenceMode] = useState<"standard" | "classroom" | "webinar">("standard");
  const [callDuration, setCallDuration] = useState(0);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [sipLog, setSipLog] = useState<string[]>([]);
  const [aiCallSummary, setAiCallSummary] = useState<string | null>(null);

  // Scheduled message list
  const [scheduledMsg, setScheduledMsg] = useState<{ text: string; time: string } | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("14:30");

  const [aiBusy, setAiBusy] = useState(false);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (isInCall) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
        // Random network metrics update in SIP log
        if (Math.random() > 0.7) {
          const jitter = (Math.random() * 3 + 1).toFixed(1);
          const packetLoss = (Math.random() * 0.05).toFixed(3);
          setSipLog(prev => [
            `[VOIP] Latency: ${Math.floor(Math.random() * 15 + 10)}ms | Jitter: ${jitter}ms | PacketLoss: ${packetLoss}%`,
            ...prev.slice(0, 15)
          ]);
        }
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isInCall]);

  const handleSendMessage = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(),
      sender: "user",
      senderName: userProfile?.name || "Me",
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChannels(prev => prev.map(ch => {
      if (ch.id === activeChannelId) {
        return {
          ...ch,
          lastMessage: messageInput,
          messages: [...ch.messages, newMessage]
        };
      }
      return ch;
    }));

    setMessageInput("");
  };

  // Scheduled Message Submit
  const handleScheduleMessage = () => {
    if (!messageInput.trim()) return;
    setScheduledMsg({ text: messageInput, time: scheduleTime });
    setMessageInput("");
    setShowScheduler(false);
    alert(`Message scheduled for ${scheduleTime} successfully.`);
  };

  // Translate active message
  const handleTranslateMessage = async (msgId: string) => {
    const targetMsg = activeChannel.messages.find(m => m.id === msgId);
    if (!targetMsg || targetMsg.translated) return;

    setAiBusy(true);
    try {
      const response = await fetch("/api/gemini/translate-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "translate",
          text: targetMsg.text,
          targetLanguage: translateTarget
        })
      });
      const data = await response.json();
      
      setChannels(prev => prev.map(ch => {
        if (ch.id === activeChannelId) {
          return {
            ...ch,
            messages: ch.messages.map(m => m.id === msgId ? { ...m, translated: data.result } : m)
          };
        }
        return ch;
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setAiBusy(false);
    }
  };

  // AI Summarize Chat Thread
  const [chatSummaryText, setChatSummaryText] = useState("");
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const handleSummarizeThread = async () => {
    const conversationBlock = activeChannel.messages.map(m => `${m.senderName}: ${m.text}`).join("\n");
    setAiBusy(true);
    setShowSummaryModal(true);
    try {
      const response = await fetch("/api/gemini/translate-summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "summarize",
          text: conversationBlock
        })
      });
      const data = await response.json();
      setChatSummaryText(data.result);
    } catch (err) {
      setChatSummaryText("Failed to formulate summary at this moment.");
    } finally {
      setAiBusy(false);
    }
  };

  // Start Call Simulation
  const startCall = (type: "voice" | "video") => {
    setCallType(type);
    setIsInCall(true);
    setSipLog([
      `[SIP] Initiating INVITE session to ${activeChannel.name}...`,
      `[SDP] v=0 | o=jrinvento 452908234 IN IP4 0.0.0.0 | s=VoIP Session`,
      `[SDP] m=audio 5004 RTP/AVP 0 101`,
      `[SDP] m=video 5006 RTP/AVP 96`,
      `[SIP] Receiving 180 RINGING response`,
      `[SIP] Received 200 OK - Negotiated codec G.711 / H.264`,
      `[SIP] Sending ACK. Stream negotiated successfully on port 3000.`
    ]);
    setAiCallSummary(null);
  };

  // End Call Simulation
  const endCall = () => {
    setIsInCall(false);
    setIsScreenSharing(false);
    setShowWhiteboard(false);
    // Suggest call summary
    setAiCallSummary(
      `• **Duration**: ${Math.floor(callDuration / 60)}m ${callDuration % 60}s\n` +
      `• **Topic**: ${activeChannel.name} Collaboration Room\n` +
      `• **Key Actions**: Discussed local TVET research challenges. Verified low-latency QoS. Plan scheduled for the next hackathon event.`
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] sm:h-[calc(100vh-140px)] overflow-hidden">
      {/* Sidebar Channels (LHS) */}
      <div className={`lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col h-full shadow-sm ${showMobileChat ? "hidden lg:flex" : "flex"}`}>
        <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase mb-3 text-slate-400">Communication Channels</h3>
        <div className="space-y-1.5 flex-1 overflow-y-auto">
          {channels.map((ch) => (
            <button
              key={ch.id}
              onClick={() => {
                setActiveChannelId(ch.id);
                setShowMobileChat(true);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                ch.id === activeChannelId 
                  ? "bg-slate-100 border border-slate-200" 
                  : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="text-xl">{ch.avatar}</span>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-slate-800 truncate">{ch.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{ch.lastMessage}</p>
                </div>
              </div>
              {ch.unreadCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {ch.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Cisco VoIP Network Quick Stats */}
        <div className="border-t border-slate-100 pt-3 mt-3">
          <div className="bg-slate-900 text-slate-300 p-3 rounded-xl font-mono text-[10px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-bold">SIP TRUNK:</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
            <div>STUN server: stun.jrinvento.org</div>
            <div>NAT Type: Symmetric (STUN + TURN)</div>
            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 pt-1 border-t border-slate-800">
              <Activity size={10} className="text-blue-400 animate-pulse" />
              <span>Codec Priority: G.722, G.711</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Communication Hub (RHS) */}
      <div className={`lg:col-span-9 flex flex-col h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative ${showMobileChat ? "flex" : "hidden lg:flex"}`}>
        
        {/* Active Channel Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            {/* Back to channels button for mobile screen view */}
            <button
              onClick={() => setShowMobileChat(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden transition-colors"
              title="Back to channels list"
            >
              <ArrowLeft size={16} />
            </button>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeChannel.avatar}</span>
                <h4 className="font-bold text-slate-800 text-sm">{activeChannel.name}</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-200 text-slate-600 capitalize">
                  {activeChannel.type}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5 max-w-[180px] sm:max-w-md">
                {activeChannel.membersCount ? `${activeChannel.membersCount} active global members` : "Secure direct conversation"}
              </p>
            </div>
          </div>

          {/* Action Call Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSummarizeThread()}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center gap-1.5 text-xs font-medium border border-slate-200"
              title="AI Summarize Thread"
            >
              <Bot size={15} className="text-blue-600" />
              <span className="hidden sm:inline">Summarize</span>
            </button>
            <button
              onClick={() => startCall("voice")}
              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
              title="Voice Conference Call"
            >
              <Phone size={15} />
            </button>
            <button
              onClick={() => startCall("video")}
              className="p-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              title="Video Collaboration Room"
            >
              <Video size={15} />
            </button>
          </div>
        </div>

        {/* Messaging Board / Call overlay wrapper */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar relative">
          
          {/* ACTIVE CALL SIMULATOR OVERLAY */}
          {isInCall && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-slate-950 text-white z-20 flex flex-col p-6"
            >
              {/* Call Header */}
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></div>
                  <div>
                    <h5 className="font-bold text-sm tracking-wide text-white">JR CONFERENCING LAB</h5>
                    <p className="text-[10px] text-slate-400 font-mono">
                      MODE: {conferenceMode.toUpperCase()} | PORT: 5060 (VoIP)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
                    {Math.floor(callDuration / 60).toString().padStart(2, "0")}:
                    {(callDuration % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Call Screen Body */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-hidden mb-4">
                
                {/* Main Speakers Screen Area */}
                <div className="md:col-span-3 bg-slate-900 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  
                  {/* Virtual whiteboard simulation */}
                  {showWhiteboard ? (
                    <div className="absolute inset-0 bg-white text-slate-900 p-4 flex flex-col z-10">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                        <span className="text-xs font-bold text-slate-700">JR Collaborative Whiteboard</span>
                        <button onClick={() => setShowWhiteboard(false)} className="text-xs text-red-600 font-semibold">
                          Close Board
                        </button>
                      </div>
                      <div className="flex-1 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mb-3">
                          CAD
                        </div>
                        <p className="text-sm font-semibold">Active Interactive Board Room</p>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">
                          Use this board to sketch engineering routing ideas, VLAN layouts, and CAD enclosure specs with participants in real-time.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {isVideoOff ? (
                    <div className="text-center">
                      <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center font-bold text-2xl text-blue-400 border border-slate-700 mx-auto">
                        {userProfile?.name ? userProfile.name[0].toUpperCase() : "U"}
                      </div>
                      <p className="text-xs text-slate-400 mt-3 font-semibold">Video Stream Paused</p>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                      {/* Grid speakers */}
                      <div className="w-full h-full grid grid-cols-2 gap-2 p-3">
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 relative flex items-center justify-center">
                          <span className="absolute bottom-2 left-2 text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded font-mono">Me (Candidate)</span>
                          <div className="text-center font-mono text-xs text-blue-400">
                            {isScreenSharing ? "💻 SHARING SCREEN..." : "[HD Camera Active]"}
                          </div>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 rounded-lg p-2 relative flex items-center justify-center">
                          <span className="absolute bottom-2 left-2 text-[10px] bg-slate-900/80 px-1.5 py-0.5 rounded font-mono">Eng. Hillary</span>
                          <div className="text-center font-mono text-xs text-emerald-400">
                            [Transmitting VoIP feed]
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Noise suppression badge */}
                  {isNoiseSuppressed && (
                    <span className="absolute top-3 left-3 bg-emerald-600/90 text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                      Noise Shield Active
                    </span>
                  )}
                </div>

                {/* Right hand diagnostic logs (Cisco VoIP layout) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col h-full font-mono text-[10px]">
                  <div className="flex items-center gap-1 mb-2 text-slate-400 pb-1.5 border-b border-slate-800">
                    <Activity size={12} className="text-blue-500" />
                    <span className="font-bold">SIP DIAGNOSTICS</span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar text-slate-300">
                    {sipLog.map((log, index) => (
                      <div key={index} className="leading-tight text-[9px]">{log}</div>
                    ))}
                  </div>
                  <div className="border-t border-slate-800 pt-2 mt-2 space-y-1 text-[9px]">
                    <div className="flex justify-between">
                      <span>Codec:</span>
                      <span className="text-blue-400">Opus Fullband</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Encryption:</span>
                      <span className="text-emerald-500">SRTP (AES-256)</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Call Controls bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4 bg-slate-950">
                
                {/* Conference Room Settings */}
                <div className="flex items-center gap-2">
                  <select 
                    value={conferenceMode}
                    onChange={(e) => setConferenceMode(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 text-xs px-2 py-1.5 rounded focus:outline-none"
                  >
                    <option value="standard">Standard Grid</option>
                    <option value="classroom">Classroom (Raise Hand)</option>
                    <option value="webinar">Webinar Broadcast</option>
                  </select>
                </div>

                {/* Mic & Video toggles */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full ${isMuted ? "bg-red-600" : "bg-slate-800 hover:bg-slate-700"} text-white transition-colors`}
                  >
                    {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
                  </button>

                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-3 rounded-full ${isVideoOff ? "bg-red-600" : "bg-slate-800 hover:bg-slate-700"} text-white transition-colors`}
                  >
                    {isVideoOff ? <VideoOff size={16} /> : <Video size={16} />}
                  </button>

                  <button
                    onClick={() => setIsScreenSharing(!isScreenSharing)}
                    className={`p-3 rounded-full ${isScreenSharing ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"} text-white transition-colors`}
                    title="Share Screen"
                  >
                    <Tv size={16} />
                  </button>

                  <button
                    onClick={() => setShowWhiteboard(!showWhiteboard)}
                    className={`p-3 rounded-full ${showWhiteboard ? "bg-blue-600" : "bg-slate-800 hover:bg-slate-700"} text-white transition-colors`}
                    title="Interactive Board"
                  >
                    <FileText size={16} />
                  </button>

                  <button
                    onClick={() => setIsNoiseSuppressed(!isNoiseSuppressed)}
                    className={`p-3 rounded-full ${isNoiseSuppressed ? "bg-emerald-600" : "bg-slate-800 hover:bg-slate-700"} text-white transition-colors`}
                    title="AI Noise Suppression"
                  >
                    <VolumeX size={16} />
                  </button>
                </div>

                {/* Hang up */}
                <div>
                  <button
                    onClick={endCall}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-lg shadow-red-600/20"
                  >
                    End Call Session
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* AI Call Summary Panel */}
          {aiCallSummary && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-4 text-xs text-blue-900 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Bot size={16} className="text-blue-600" />
                <span>JR INVENTO AI Call Summary & Transcription Draft</span>
              </div>
              <pre className="font-sans leading-relaxed whitespace-pre-wrap">{aiCallSummary}</pre>
              <div className="text-[10px] text-blue-500 pt-1">
                Transcript and summaries are encrypted and saved to your Student Profile.
              </div>
            </div>
          )}

          {/* Conversation history */}
          <div className="space-y-3">
            {activeChannel.messages.map((m) => {
              const isMe = m.sender === "user";
              return (
                <div key={m.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-500 font-mono">
                    <span className="font-bold">{m.senderName}</span>
                    <span>•</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <div className={`p-3.5 rounded-2xl max-w-lg text-sm leading-relaxed ${
                    isMe 
                      ? "bg-blue-600 text-white rounded-tr-none" 
                      : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                  }`}>
                    <p>{m.text}</p>
                    
                    {/* Translated block */}
                    {m.translated && (
                      <div className="mt-2.5 pt-2 border-t border-slate-300/30 text-xs text-slate-300 font-serif italic">
                        <span className="font-sans text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Translation ({translateTarget}):</span>
                        "{m.translated}"
                      </div>
                    )}
                  </div>

                  {/* Actions for messages */}
                  <div className="flex items-center gap-2 mt-1 px-1">
                    {!isMe && !m.translated && (
                      <button 
                        onClick={() => handleTranslateMessage(m.id)}
                        className="text-[10px] text-blue-600 hover:underline font-semibold"
                        disabled={aiBusy}
                      >
                        {aiBusy ? "Translating..." : `Translate to ${translateTarget}`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scheduled Message Alert in Chat Area */}
          {scheduledMsg && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl flex items-center justify-between text-xs text-yellow-800">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-yellow-600" />
                <span>Scheduled message waiting: "{scheduledMsg.text}" for {scheduledMsg.time}</span>
              </div>
              <button onClick={() => setScheduledMsg(null)} className="text-[10px] font-bold text-red-600 hover:underline">
                Cancel
              </button>
            </div>
          )}

        </div>

        {/* Input Bar (Footer) */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
          
          <div className="flex items-center gap-2.5">
            {/* Translation Target Selector */}
            <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
              <Globe size={11} />
              <span>Target:</span>
              <select 
                value={translateTarget} 
                onChange={(e) => setTranslateTarget(e.target.value)}
                className="bg-white border border-slate-200 rounded px-1 py-0.5 text-[10px] text-slate-600 font-sans focus:outline-none"
              >
                <option value="Swahili">Kiswahili</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
                <option value="Chinese">中文</option>
              </select>
            </div>

            {/* Schedule message trigger */}
            <button
              onClick={() => setShowScheduler(!showScheduler)}
              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 ml-auto font-mono"
            >
              <Calendar size={11} />
              <span>Schedule Delivery</span>
            </button>
          </div>

          {/* Schedule message form panel */}
          {showScheduler && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="bg-white border border-slate-200 p-3 rounded-lg flex items-center gap-3 text-xs"
            >
              <span className="font-semibold text-slate-700">Set Time:</span>
              <input 
                type="time" 
                value={scheduleTime} 
                onChange={(e) => setScheduleTime(e.target.value)}
                className="border border-slate-200 rounded px-2 py-1 text-xs focus:outline-none"
              />
              <button 
                onClick={handleScheduleMessage}
                className="bg-yellow-600 text-white px-3 py-1 rounded text-[11px] font-bold hover:bg-yellow-700 ml-auto"
              >
                Confirm Schedule
              </button>
            </motion.div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={`Send encrypted message to ${activeChannel.name}...`}
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors"
            >
              <Send size={15} />
            </button>
          </form>
        </div>

      </div>

      {/* AI Summarize Modal Drawer */}
      <AnimatePresence>
        {showSummaryModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative"
            >
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
                <Bot className="text-blue-600" size={22} />
                <h4 className="font-bold text-slate-800 text-sm">AI Message Thread Summarization</h4>
              </div>

              {aiBusy ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-xs text-slate-500 mt-3 font-mono">COMPILING TECHNICAL DIGEST...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs text-slate-700 space-y-2 leading-relaxed font-mono">
                    <pre className="font-sans whitespace-pre-wrap">{chatSummaryText}</pre>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowSummaryModal(false)}
                      className="bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold px-4 py-2 rounded-lg"
                    >
                      Close Summary
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
