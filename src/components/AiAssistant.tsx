import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  CornerDownLeft, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Languages, 
  Cpu, 
  Briefcase 
} from "lucide-react";

interface AiAssistantProps {
  userProfile: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function AiAssistant({ userProfile, isOpen, onClose }: AiAssistantProps) {
  const [activePersona, setActivePersona] = useState<"advisor" | "coach" | "architect" | "translator">("advisor");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getPersonaGreeting = (id: string) => {
    switch (id) {
      case "coach":
        return `Hello! I am your **Career & CV Coach**. 
        
I can help you review your CV, draft high-converting LinkedIn status updates about your tech achievements, prepare for engineering job interviews, or analyze role matches in Kenya and globally. What professional milestone can we build today?`;
      case "architect":
        return `Welcome to the secure console. I am your **VoIP & Network Architect**.
        
I specialize in SIP VoIP trunks, Cisco routing networks, end-to-end cryptographic protocols, secure enclaves, and technical network topologies. Let me know what network specifications you need help configuring!`;
      case "translator":
        return `Habari yako! Mimi ni **Mtafsiri wako wa Kiswahili wa Kijenerali na Teknolojia**.
        
I specialize in translating technical computer science, telecom, and engineering concepts into clear, natural Swahili. Ask me to translate your text or draft tech updates!`;
      default:
        return `Hello! I am your **JR INVENTO AI Assistant**. 
      
I can assist you with your academic career paths, translate text, draft technical LinkedIn statuses, or configure your local network dashboard parameters. How can I serve your innovation goals today?`;
    }
  };

  const [messages, setMessages] = useState<Array<{ role: "user" | "model"; content: string }>>([
    {
      role: "model",
      content: getPersonaGreeting("advisor")
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle switching personas and loading their specialized greeting
  const handlePersonaChange = (id: "advisor" | "coach" | "architect" | "translator") => {
    setActivePersona(id);
    setMessages([
      {
        role: "model",
        content: getPersonaGreeting(id)
      }
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim()) return;

    if (!textToSend) setInput("");

    // Append user message
    const updatedMessages = [...messages, { role: "user", content: prompt }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          currentContext: {
            profile: userProfile,
            time: new Date().toISOString(),
            aiPersona: activePersona
          }
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: "model", content: data.content }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [
        ...prev, 
        { role: "model", content: "I encountered a minor network latency issue communicating with my primary compiler, but I'm ready to keep collaborating. Please rephrase!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your current conversation history?")) {
      setMessages([
        {
          role: "model",
          content: getPersonaGreeting(activePersona)
        }
      ]);
    }
  };

  const handleExportTranscript = () => {
    const transcript = messages
      .map(m => `### ${m.role === "user" ? "USER" : "AI ASSISTANT (${activePersona.toUpperCase()})"}\n\n${m.content}\n\n---`)
      .join("\n\n");
    
    const element = document.createElement("a");
    const file = new Blob([transcript], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `jr-invento-ai-transcript-${activePersona}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const quickPrompts = {
    advisor: [
      "Recommend IEEE groups in Kenya",
      "How do I set up a SIP VoIP trunk?",
      "Tips for my attachment interview"
    ],
    coach: [
      "Draft a LinkedIn update on my CAD design",
      "Review my engineering internship CV profile",
      "Suggest interview prep for telecom engineers"
    ],
    architect: [
      "Explain the SIP handshake process",
      "How does AES-GCM protect voice packets?",
      "Draw up a typical campus star network map"
    ],
    translator: [
      "Translate: 'Voice over IP protocol'",
      "Translate: 'Database security credentials'",
      "How do you say 'Cloud load balancer' in Swahili?"
    ]
  };

  const personaList = [
    { id: "advisor", name: "Advisor", icon: Bot, color: "text-blue-500 bg-blue-50 border-blue-200" },
    { id: "coach", name: "Career", icon: Briefcase, color: "text-amber-500 bg-amber-50 border-amber-200" },
    { id: "architect", name: "VoIP/Net", icon: Cpu, color: "text-indigo-500 bg-indigo-50 border-indigo-200" },
    { id: "translator", name: "Swahili", icon: Languages, color: "text-emerald-500 bg-emerald-50 border-emerald-200" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed top-0 right-0 h-screen w-full sm:w-[440px] bg-white border-l border-slate-200 z-50 shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="p-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-blue-500" />
              <div>
                <h3 className="font-bold text-xs tracking-tight">JR INVENTO Intelligent Assistant</h3>
                <span className="text-[9px] font-mono text-emerald-400 block tracking-wider uppercase">Online (Gemini Pro Brain)</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleExportTranscript}
                title="Export Transcript (Markdown)"
                className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-white transition-colors"
              >
                <Download size={14} />
              </button>
              <button 
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
              <button onClick={onClose} className="p-1.5 rounded bg-slate-900 text-slate-400 hover:text-white transition-colors ml-1">
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Specialization Persona Tabs */}
          <div className="bg-slate-50 border-b border-slate-200 p-2 grid grid-cols-4 gap-1">
            {personaList.map((p) => {
              const IconComponent = p.icon;
              const isSelected = activePersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePersonaChange(p.id as any)}
                  className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border text-center transition-all ${
                    isSelected 
                      ? `${p.color} shadow-sm font-bold scale-[1.02]` 
                      : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <IconComponent size={15} className={isSelected ? "" : "text-slate-400"} />
                  <span className="text-[9px] mt-1 tracking-tight font-medium uppercase">{p.name}</span>
                </button>
              );
            })}
          </div>

          {/* Messages board */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
            
            {/* Quick Prompts Panel */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Suggested Specialization Commands</p>
                <div className="grid grid-cols-1 gap-1.5">
                  {quickPrompts[activePersona].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(q)}
                      className="text-left text-xs bg-white border border-slate-200 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 font-semibold flex items-center justify-between"
                    >
                      <span className="truncate pr-2">{q}</span>
                      <CornerDownLeft size={11} className="text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chats */}
            {messages.map((m, idx) => {
              const isMe = m.role === "user";
              return (
                <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`p-3.5 rounded-2xl max-w-sm text-xs leading-relaxed group relative ${
                    isMe 
                      ? "bg-slate-900 text-white rounded-tr-none" 
                      : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm"
                  }`}>
                    {/* Render message formatting */}
                    <div className="space-y-1 pr-6">
                      {m.content.split("\n").map((line, lIdx) => {
                        if (line.startsWith("- ") || line.startsWith("* ")) {
                          return <li key={lIdx} className="ml-4 list-disc font-medium">{line.substring(2)}</li>;
                        }
                        if (line.startsWith("### ")) {
                          return <h4 key={lIdx} className="font-bold text-slate-900 mt-1.5 text-xs">{line.substring(4)}</h4>;
                        }
                        // Support inline bold tags (simple support)
                        if (line.includes("**")) {
                          const parts = line.split("**");
                          return (
                            <p key={lIdx}>
                              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-blue-600">{p}</strong> : p)}
                            </p>
                          );
                        }
                        return <p key={lIdx}>{line}</p>;
                      })}
                    </div>

                    {/* Copier overlay */}
                    {!isMe && (
                      <button
                        onClick={() => handleCopyMessage(m.content, idx)}
                        className="absolute right-2 top-2 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Copy message to clipboard"
                      >
                        {copiedIndex === idx ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px]">
                <Sparkles size={12} className="text-blue-500 animate-spin" />
                <span>AI ASSISTANT TRANSMITTING DIGEST...</span>
              </div>
            )}

            <div ref={scrollRef}></div>
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 border-t border-slate-150 bg-white flex flex-col gap-1">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask our ${activePersona} persona anything...`}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl disabled:opacity-40"
              >
                <Send size={13} />
              </button>
            </form>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
