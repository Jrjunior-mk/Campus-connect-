import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  Bot, 
  Sparkles, 
  Award, 
  Star, 
  ArrowRight, 
  CornerDownRight, 
  CheckCircle, 
  HelpCircle, 
  Activity,
  CreditCard,
  ShieldCheck,
  X,
  Check,
  Loader2,
  Sparkle,
  GraduationCap
} from "lucide-react";

interface CareersSuiteProps {
  userProfile: any;
  recommendations: any;
}

export interface InterviewMessage {
  role: "user" | "model";
  text: string;
}

export default function CareersSuite({ userProfile, recommendations }: CareersSuiteProps) {
  const [activeTab, setActiveTab] = useState<"opportunities" | "cv" | "interview">("opportunities");
  
  // CV Analyzer state
  const [cvText, setCvText] = useState("");
  const [cvAnalyzing, setCvAnalyzing] = useState(false);
  const [cvAnalysisResult, setCvAnalysisResult] = useState<any>(null);

  // Digital Card Application State
  const [applyingJob, setApplyingJob] = useState<{ title: string; company: string } | null>(null);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState(false);

  // Interview state
  const [targetRole, setTargetRole] = useState("Graduate Networks Engineer");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<InterviewMessage[]>([]);
  const [answerInput, setAnswerInput] = useState("");
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [focusArea, setFocusArea] = useState("Cisco VoIP routing & UDP optimization");

  // CV Analysis submit handler
  const handleAnalyzeCv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvText.trim()) return;

    setCvAnalyzing(true);
    try {
      const response = await fetch("/api/gemini/cv-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, profileContext: userProfile })
      });
      const data = await response.json();
      setCvAnalysisResult(data);
    } catch (error) {
      console.error("CV Analysis failed", error);
    } finally {
      setCvAnalyzing(false);
    }
  };

  // Start Interview Prep simulation
  const handleStartInterview = async () => {
    setInterviewLoading(true);
    setInterviewStarted(true);
    setInterviewHistory([]);
    try {
      const response = await fetch("/api/gemini/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          userSkills: userProfile?.skills || "React, Cisco Networking, Python",
          chatHistory: []
        })
      });
      const data = await response.json();
      setCurrentQuestion(data.nextQuestion);
      setCurrentFeedback(data.feedbackOnLastAnswer);
      setDifficulty(data.difficulty);
      setFocusArea(data.keyFocusArea);
      
      setInterviewHistory([
        { role: "model", text: data.nextQuestion }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setInterviewLoading(false);
    }
  };

  // Submit Answer to AI interviewer
  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    const userMsg: InterviewMessage = { role: "user", text: answerInput };
    const updatedHistory = [...interviewHistory, userMsg];
    setInterviewHistory(updatedHistory);
    setAnswerInput("");
    setInterviewLoading(true);

    try {
      const response = await fetch("/api/gemini/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole,
          userSkills: userProfile?.skills || "React, Cisco, Python",
          chatHistory: updatedHistory
        })
      });
      const data = await response.json();
      
      setCurrentQuestion(data.nextQuestion);
      setCurrentFeedback(data.feedbackOnLastAnswer);
      setDifficulty(data.difficulty);
      setFocusArea(data.keyFocusArea);

      setInterviewHistory(prev => [
        ...prev,
        { role: "model", text: `${data.feedbackOnLastAnswer}\n\n${data.nextQuestion}` }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setInterviewLoading(false);
    }
  };

  const jobMatches = recommendations?.jobs || [
    {
      title: "Graduate Networks Trainee",
      company: "Cisco Systems Kenya",
      location: "Nairobi (Hybrid)",
      matchingScore: 92,
      whyMatch: "Strong match for student candidates specializing in electrical department SIP layouts."
    },
    {
      title: "Industrial Attachment candidate - IoT Infrastructure",
      company: "Safaricom PLC",
      location: "Mombasa on-site",
      matchingScore: 85,
      whyMatch: "Matches your local Coastal preference and Python-based microcontroller interests."
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)]">
      
      {/* LHS Menu navigation (Careers specific) */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 h-auto lg:h-full shadow-sm">
        <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase text-slate-400">Career Suite Menu</h3>
        <div className="space-y-1">
          <button
            onClick={() => setActiveTab("opportunities")}
            className={`w-full text-left text-xs font-semibold p-3 rounded-lg transition-colors flex items-center gap-2.5 ${
              activeTab === "opportunities" ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Briefcase size={15} />
            <span>Opportunities AI Matches</span>
          </button>

          <button
            onClick={() => setActiveTab("cv")}
            className={`w-full text-left text-xs font-semibold p-3 rounded-lg transition-colors flex items-center gap-2.5 ${
              activeTab === "cv" ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Award size={15} />
            <span>AI CV Analyzer (ATS)</span>
          </button>

          <button
            onClick={() => setActiveTab("interview")}
            className={`w-full text-left text-xs font-semibold p-3 rounded-lg transition-colors flex items-center gap-2.5 ${
              activeTab === "interview" ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Bot size={15} />
            <span>AI Interview Coach</span>
          </button>
        </div>

        <div className="mt-auto bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
            JR INVENTO AI actively crawls regional Kenyan telemetry logs to map legitimate internships and attaches them to student profiles.
          </p>
        </div>
      </div>

      {/* RHS Primary Window */}
      <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:overflow-hidden flex flex-col h-auto lg:h-full">
        
        {/* TAB 1: OPPORTUNITIES AI MATCHES */}
        {activeTab === "opportunities" && (
          <div className="space-y-4 h-full overflow-y-auto custom-scrollbar pr-1">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Star className="text-blue-600" size={18} />
              <h4 className="font-bold text-slate-800 text-sm">Personalized Career Matches</h4>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              We cross-reference your skills, course department, and geographic location with legitimate local and international technical vacancies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobMatches.map((job: any, index: number) => (
                <div key={index} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9px] font-mono font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        MATCH SCORE: {job.matchingScore || 90}%
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{job.location}</span>
                    </div>

                    <h5 className="font-bold text-slate-800 text-xs leading-snug">{job.title}</h5>
                    <p className="text-xs font-semibold text-slate-600 mt-1">{job.company}</p>
                    <p className="text-[11px] text-slate-500 mt-3 leading-relaxed bg-white border border-slate-150 p-3 rounded-lg">
                      {job.whyMatch}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setApplyingJob({ title: job.title, company: job.company });
                      setIsTransmitting(false);
                      setTransmissionSuccess(false);
                    }}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                  >
                    <CreditCard size={13} />
                    <span>Apply with Digital Card</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AI CV ANALYZER */}
        {activeTab === "cv" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-full overflow-hidden">
            
            {/* Input box */}
            <div className="md:col-span-5 flex flex-col gap-3 h-full overflow-hidden">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide">Pasted CV Credentials</h4>
              
              <form onSubmit={handleAnalyzeCv} className="flex-1 flex flex-col justify-between overflow-hidden">
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder={`Paste full CV/Resume text here... (include academic background, TVET certifications, skills like Cisco, React, etc.)`}
                  className="w-full flex-1 bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs focus:outline-none focus:bg-white focus:border-blue-500 resize-none"
                />

                <button
                  type="submit"
                  disabled={cvAnalyzing || !cvText.trim()}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40"
                >
                  <Bot size={14} />
                  <span>{cvAnalyzing ? "Analyzing CV ATS..." : "Analyze CV with AI"}</span>
                </button>
              </form>
            </div>

            {/* Results Output */}
            <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-y-auto custom-scrollbar space-y-4 flex flex-col">
              
              {!cvAnalysisResult && !cvAnalyzing && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                  <Award size={36} className="text-slate-300" />
                  <h4 className="font-bold text-xs text-slate-700">Waiting for Credentials</h4>
                  <p className="text-[11px] max-w-xs leading-relaxed">
                    Paste your engineering CV text in the left viewport to calculate your ATS formatting grade and suggested rewrites.
                  </p>
                </div>
              )}

              {cvAnalyzing && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <h4 className="font-bold text-xs text-slate-700">JR INVENTO AI Grading...</h4>
                  <p className="text-[11px] text-slate-400 font-mono">CRUNCHING RECRUITER RULES</p>
                </div>
              )}

              {cvAnalysisResult && (
                <div className="space-y-4">
                  {/* Score */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">ATS Credentials Analysis</h4>
                      <p className="text-[10px] text-slate-400 font-mono">Accredited by East African Engineering Hub</p>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-bold font-mono text-blue-600">{cvAnalysisResult.overallScore}</span>
                      <span className="text-slate-400 font-mono text-xs">/100</span>
                    </div>
                  </div>

                  {/* Skills found */}
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider mb-1.5">Identified Skills</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {cvAnalysisResult.identifiedSkills.map((sk: string, idx: number) => (
                        <span key={idx} className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Critique */}
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider mb-1">ATS Format Critique</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">{cvAnalysisResult.atsCritique}</p>
                  </div>

                  {/* Improvements */}
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider mb-1.5">Suggested Actionable Improvements</h5>
                    <ul className="space-y-1.5">
                      {cvAnalysisResult.suggestedEnhancements.map((enh: string, idx: number) => (
                        <li key={idx} className="text-xs text-slate-700 leading-relaxed flex items-start gap-1.5">
                          <CheckCircle size={12} className="text-blue-500 shrink-0 mt-0.5" />
                          <span>{enh}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Job roles */}
                  <div>
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider mb-1.5">Tailored Job Pathways</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cvAnalysisResult.tailoredJobRoles.map((role: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setApplyingJob({ title: role, company: "Accredited Local Enterprise" });
                            setIsTransmitting(false);
                            setTransmissionSuccess(false);
                          }}
                          className="bg-white hover:bg-blue-50/20 border border-slate-200 hover:border-blue-300 p-2.5 rounded-xl text-[11px] font-bold text-slate-700 flex items-center justify-between gap-1.5 text-left transition-all active:scale-[0.98] group cursor-pointer"
                          title="Click to Apply with Digital Card"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <CornerDownRight size={12} className="text-slate-400 group-hover:text-blue-500 shrink-0" />
                            <span className="truncate group-hover:text-blue-700">{role}</span>
                          </div>
                          <span className="text-[9px] text-blue-500 font-mono font-bold uppercase shrink-0 border border-blue-200 bg-blue-50 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">Apply</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 3: INTERVIEW PREPARATION */}
        {activeTab === "interview" && (
          <div className="flex flex-col h-full overflow-hidden">
            
            {!interviewStarted ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <Bot size={44} className="text-blue-600 animate-pulse" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Recruiter AI Mock Interview</h4>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed mt-1">
                    Conduct a full-length, responsive mock interview for your desired networks, systems, or software roles. Receive instant recruiter feedback on your technical explanations.
                  </p>
                </div>

                <div className="max-w-xs w-full space-y-2 bg-slate-50 p-4 border border-slate-200 rounded-xl">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase font-mono text-left">Select Target Career Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:outline-none"
                  >
                    <option>Graduate Networks Engineer</option>
                    <option>TVET Electrical Maintenance Officer</option>
                    <option>Graduate Cloud Solutions Analyst</option>
                    <option>Embedded Firmware Developer</option>
                  </select>
                </div>

                <button
                  onClick={handleStartInterview}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md"
                >
                  Initialize AI Interviewer
                </button>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-hidden">
                
                {/* Chat window viewport */}
                <div className="md:col-span-8 flex flex-col h-full overflow-hidden border border-slate-150 rounded-xl">
                  
                  {/* Messages container */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
                    {interviewHistory.map((m, idx) => {
                      const isMe = m.role === "user";
                      return (
                        <div key={idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <span className="text-[10px] text-slate-400 font-mono mb-0.5">
                            {isMe ? "Candidate response" : "Recruiter AI Coach"}
                          </span>
                          <div className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                            isMe 
                              ? "bg-blue-600 text-white rounded-tr-none" 
                              : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 whitespace-pre-wrap"
                          }`}>
                            {m.text}
                          </div>
                        </div>
                      );
                    })}

                    {interviewLoading && (
                      <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                        <Activity size={12} className="text-blue-500 animate-pulse" />
                        <span>INTERVIEWER EVALUATING FEEDBACK...</span>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSubmitAnswer} className="p-3 border-t border-slate-150 bg-slate-50/50 flex items-center gap-2">
                    <input
                      type="text"
                      value={answerInput}
                      onChange={(e) => setAnswerInput(e.target.value)}
                      placeholder="Type your technical answer..."
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      disabled={interviewLoading || !answerInput.trim()}
                      className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-xl"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </form>
                </div>

                {/* Recruiter Evaluation Panel */}
                <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                  <div className="space-y-4">
                    <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-blue-600 uppercase font-mono">Vitals Dashboard</span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                        {difficulty}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">Focus Target</label>
                      <p className="text-xs font-bold text-slate-700">{focusArea}</p>
                    </div>

                    {currentFeedback && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase font-mono mb-1">Immediate Recruiter Evaluation</label>
                        <p className="text-xs text-slate-600 leading-relaxed italic bg-white border border-slate-200 p-3 rounded-lg font-serif">
                          "{currentFeedback}"
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setInterviewStarted(false)}
                    className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] py-2 rounded-lg transition-colors"
                  >
                    Reset & Choose Another Role
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

      {/* DIGITAL CARD APPLICATION MODAL */}
      <AnimatePresence>
        {applyingJob && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setApplyingJob(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-blue-600" size={20} />
                  <div className="text-left">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Decentralized Credentials Transfer</h3>
                    <p className="text-[10px] text-slate-400 font-mono">JR INVENTO DIGITAL PORTFOLIO PROTOCOL</p>
                  </div>
                </div>

                {!transmissionSuccess ? (
                  <>
                    <p className="text-xs text-slate-600 dark:text-slate-350 text-left leading-relaxed">
                      You are applying to <span className="font-bold text-slate-800 dark:text-white">{applyingJob.company}</span> for the role of <span className="font-bold text-slate-800 dark:text-white">{applyingJob.title}</span>. Verify your verified credentials passport:
                    </p>

                    {/* The Cisco/Invento inspired Digital Card preview */}
                    <div className="bg-slate-950 text-white rounded-2xl p-4.5 border border-slate-800 space-y-4 shadow-lg relative overflow-hidden text-left">
                      {/* background mesh/circles for high contrast design */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-550/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-emerald-550/10 rounded-full blur-2xl pointer-events-none" />

                      <div className="flex items-start justify-between">
                        <div className="space-y-0.5">
                          <p className="text-[8px] font-bold font-mono tracking-widest text-blue-400">PASSPORT IDENTITY</p>
                          <h4 className="text-xs font-bold font-sans tracking-wide">JR INVENTO PORTAL</h4>
                        </div>
                        <ShieldCheck className="text-emerald-500 animate-pulse" size={18} />
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="block text-[8px] font-mono text-slate-400">CANDIDATE</span>
                            <span className="text-xs font-bold text-white">{userProfile?.name || "Student Innovator"}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-mono text-slate-400">INSTITUTION</span>
                            <span className="text-xs font-bold text-white truncate block">{userProfile?.institution || "TVET/Academic Member"}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="block text-[8px] font-mono text-slate-400">MAJOR/DEPARTMENT</span>
                            <span className="text-[11px] font-bold text-white truncate block">{userProfile?.major || "Electrical/ICT"}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] font-mono text-slate-400">ATS EVAL SCORE</span>
                            <span className="text-[11px] font-bold font-mono text-blue-400">{cvAnalysisResult?.overallScore || 92}/100</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[8px] font-mono">
                        <span className="text-slate-400">STATUS: ACTIVE & EXCLUSIVE</span>
                        <span className="text-slate-400 font-bold text-white">SHA-256 SECURED</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-start gap-2 text-left">
                      <GraduationCap className="text-blue-500 shrink-0 mt-0.5" size={14} />
                      <p className="text-[11px] text-slate-500 dark:text-slate-350 leading-relaxed font-medium">
                        This digital card serves as your certified academic recommendation, including your verified CAD files, packet tracer uploads, and project room accomplishments.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setApplyingJob(null)}
                        className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer text-center border border-transparent dark:border-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setIsTransmitting(true);
                          await new Promise(r => setTimeout(r, 1200));
                          setIsTransmitting(false);
                          setTransmissionSuccess(true);
                        }}
                        disabled={isTransmitting}
                        className="flex-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50"
                      >
                        {isTransmitting ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <Sparkle size={13} />
                            <span>Transmit Digital Card</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6 space-y-4"
                  >
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-md">
                      <Check size={24} className="animate-bounce" />
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-sm">Credentials Received!</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed mt-1">
                        Your verified Digital Passport has been transmitted successfully to <span className="font-bold text-slate-700 dark:text-slate-350">{applyingJob.company}</span>.
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-850 border border-slate-150 dark:border-slate-800 rounded-xl p-3 font-mono text-[9px] text-slate-400 text-left space-y-0.5">
                      <p>• ID: APP-{Math.floor(100000 + Math.random() * 900000)}</p>
                      <p>• PATHWAY: Direct Industry Placement System</p>
                      <p>• ENCRYPTION: GPG Verified Token Signature</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setApplyingJob(null)}
                      className="bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs py-2 px-6 rounded-xl transition-colors cursor-pointer"
                    >
                      Close Window
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
