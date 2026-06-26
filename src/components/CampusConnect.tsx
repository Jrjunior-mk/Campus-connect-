import { useState } from "react";
import { motion } from "motion/react";
import { KENYAN_INSTITUTIONS, INITIAL_CAD_FILES, CadFile } from "../types";
import { Building2, Compass, Cpu, HelpCircle, HardDrive, Eye, Download, MessageSquare, Play, AlertCircle, Share2, Search, Globe, X } from "lucide-react";

export default function CampusConnect() {
  const [activeSubTab, setActiveSubTab] = useState<"directory" | "cad" | "rooms">("directory");
  const [selectedInst, setSelectedInst] = useState(KENYAN_INSTITUTIONS[0]);
  
  // Search and filter state for directories
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<"ALL" | "Public University" | "Private University" | "TVET" | "International Affiliate">("ALL");

  // CAD state
  const [cadFiles, setCadFiles] = useState<CadFile[]>(INITIAL_CAD_FILES);
  const [selectedCad, setSelectedCad] = useState<CadFile>(INITIAL_CAD_FILES[0]);
  const [cadLayer, setCadLayer] = useState<"copper" | "silkscreen" | "drill">("copper");

  // Audio rooms simulation
  const [joinedAudioRoom, setJoinedAudioRoom] = useState<string | null>(null);
  const audioRooms = [
    { id: "ar1", name: "School of Engineering Projects Review", participants: 12, host: "Dr. Evans Mwangi" },
    { id: "ar2", name: "Nyeri TVET Green Energy Panel", participants: 8, host: "Sylvia Njeri" },
    { id: "ar3", name: "Juja Smart City IoT Team", participants: 4, host: "Instructor Joshua" }
  ];

  const handleJoinAudioRoom = (roomId: string, roomName: string) => {
    if (joinedAudioRoom === roomId) {
      setJoinedAudioRoom(null);
    } else {
      setJoinedAudioRoom(roomId);
      alert(`Joined virtual audio room: ${roomName}. Mic and Speaker initialized (SIP/WebRTC).`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)]">
      
      {/* Sub Tabs control (LHS sidebar inside Campus Connect) */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 h-auto lg:h-full shadow-sm">
        <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase text-slate-400">Campus Connect Menu</h3>
        <div className="space-y-1">
          <button
            onClick={() => setActiveSubTab("directory")}
            className={`w-full text-left text-xs font-semibold p-3 rounded-lg transition-colors flex items-center gap-2.5 ${
              activeSubTab === "directory" ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Building2 size={15} />
            <span>Kenyan Institutions Directory</span>
          </button>

          <button
            onClick={() => setActiveSubTab("cad")}
            className={`w-full text-left text-xs font-semibold p-3 rounded-lg transition-colors flex items-center gap-2.5 ${
              activeSubTab === "cad" ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Cpu size={15} />
            <span>Interactive CAD & Patent Lab</span>
          </button>

          <button
            onClick={() => setActiveSubTab("rooms")}
            className={`w-full text-left text-xs font-semibold p-3 rounded-lg transition-colors flex items-center gap-2.5 ${
              activeSubTab === "rooms" ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Compass size={15} />
            <span>Virtual Campus Conferencing</span>
          </button>
        </div>

        <div className="mt-auto bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
          <p className="text-[10px] text-slate-500 font-sans leading-relaxed">
            JR INVENTO covers all 47 public Kenyan universities, accredited TVET polytechnics, and links them with patent registries worldwide.
          </p>
        </div>
      </div>

      {/* Primary Display Area (RHS) */}
      <div className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm lg:overflow-hidden flex flex-col h-auto lg:h-full">
        
        {/* TAB 1: INSTITUTIONS DIRECTORY */}
        {activeSubTab === "directory" && (() => {
          const filteredInstitutions = KENYAN_INSTITUTIONS.filter((inst) => {
            const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  inst.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  inst.departments.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesType = selectedType === "ALL" || inst.type === selectedType;
            return matchesSearch && matchesType;
          });

          const displayedSelectedInst = filteredInstitutions.some(i => i.name === selectedInst.name)
            ? filteredInstitutions.find(i => i.name === selectedInst.name)!
            : (filteredInstitutions[0] || selectedInst);

          return (
            <div className="flex flex-col h-full overflow-hidden space-y-4">
              
              {/* Search and Filters Header bar */}
              <div className="flex flex-col gap-3 pb-3 border-b border-slate-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Universities & Global Connect Network</h4>
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-tight font-mono">Real-time collaboration across accredited camps & partners</p>
                  </div>
                  {/* Search input */}
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search name, city, department..."
                      className="w-full sm:w-[220px] bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:bg-white focus:border-blue-500 font-semibold text-slate-800"
                    />
                    <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                    {searchTerm && (
                      <button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                        <X size={11} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Categorization tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none font-mono text-[9px] font-bold uppercase">
                  <button
                    onClick={() => setSelectedType("ALL")}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all shrink-0 ${
                      selectedType === "ALL" 
                        ? "bg-slate-900 border-slate-900 text-white shadow-sm" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    All ({KENYAN_INSTITUTIONS.length})
                  </button>
                  <button
                    onClick={() => setSelectedType("Public University")}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all shrink-0 ${
                      selectedType === "Public University" 
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Public Univ ({KENYAN_INSTITUTIONS.filter(i => i.type === "Public University").length})
                  </button>
                  <button
                    onClick={() => setSelectedType("Private University")}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all shrink-0 ${
                      selectedType === "Private University" 
                        ? "bg-purple-600 border-purple-600 text-white shadow-sm" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    Private Univ ({KENYAN_INSTITUTIONS.filter(i => i.type === "Private University").length})
                  </button>
                  <button
                    onClick={() => setSelectedType("TVET")}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all shrink-0 ${
                      selectedType === "TVET" 
                        ? "bg-amber-600 border-amber-600 text-white shadow-sm" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    TVET / Technical ({KENYAN_INSTITUTIONS.filter(i => i.type === "TVET").length})
                  </button>
                  <button
                    onClick={() => setSelectedType("International Affiliate")}
                    className={`px-2.5 py-1.5 rounded-lg border transition-all shrink-0 flex items-center gap-1 ${
                      selectedType === "International Affiliate" 
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-sm" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <Globe size={11} />
                    <span>Global Connect ({KENYAN_INSTITUTIONS.filter(i => i.type === "International Affiliate").length})</span>
                  </button>
                </div>
              </div>

              {/* Grid display */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 overflow-y-auto lg:overflow-hidden">
                
                {/* List */}
                <div className="md:col-span-5 overflow-y-auto space-y-2 pr-1 custom-scrollbar max-h-[360px] lg:max-h-[380px]">
                  {filteredInstitutions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <p className="text-xs font-semibold">No universities or campuses matched your query.</p>
                    </div>
                  ) : (
                    filteredInstitutions.map((inst, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedInst(inst)}
                        className={`w-full p-3 border rounded-xl text-left transition-all ${
                          displayedSelectedInst.name === inst.name 
                            ? "border-blue-500 bg-blue-50/20 shadow-sm scale-[1.01]" 
                            : "border-slate-150 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            inst.type === "Public University" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                            inst.type === "Private University" ? "bg-purple-50 text-purple-600 border border-purple-100" :
                            inst.type === "TVET" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                            "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}>
                            {inst.type === "International Affiliate" ? "Global Connect" : inst.type}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono font-medium truncate">{inst.location.split(",")[0]}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{inst.name}</p>
                      </button>
                    ))
                  )}
                </div>

                {/* Profile Detail */}
                <div className="md:col-span-7 bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-y-auto custom-scrollbar space-y-4 max-h-[380px]">
                  {displayedSelectedInst ? (
                    <>
                      <div className="border-b border-slate-200 pb-3">
                        <span className={`text-[10px] font-bold uppercase font-mono tracking-wider block mb-1 ${
                          displayedSelectedInst.type === "International Affiliate" ? "text-emerald-600" : "text-blue-600"
                        }`}>
                          {displayedSelectedInst.type === "International Affiliate" ? "🌐 GLOBAL CONNECT COLLABORATOR" : `${displayedSelectedInst.type} PROFILE`}
                        </span>
                        <h3 className="font-bold text-slate-800 text-lg leading-snug">{displayedSelectedInst.name}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-1">Est. {displayedSelectedInst.established} | Location: {displayedSelectedInst.location}</p>
                      </div>

                      {/* Global connect exchange details */}
                      {displayedSelectedInst.type === "International Affiliate" && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 space-y-2 text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-800 font-sans">
                            <Globe size={14} className="text-emerald-600 animate-pulse" />
                            <span>Active Global-Kenyan Exchange Agreement</span>
                          </div>
                          <p className="text-emerald-700 leading-relaxed font-semibold text-[11px]">
                            This institution supports direct credit transfers, research grants, and joint-degree programs with JKUAT, UoN, and accredited TVET centers in Kenya under the JR INVENTO World Network.
                          </p>
                        </div>
                      )}

                      {/* Departments */}
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider mb-2">Registered Departments</h5>
                        <ul className="space-y-1.5">
                          {displayedSelectedInst.departments.map((dept, index) => (
                            <li key={index} className="bg-white border border-slate-200 p-2 rounded-lg text-xs font-semibold text-slate-700">
                              {dept}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Hackathons */}
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider mb-2">
                          {displayedSelectedInst.type === "International Affiliate" ? "Joint Global Research Hackathons" : "Active Hackathons & Research Opportunities"}
                        </h5>
                        <ul className="space-y-2">
                          {displayedSelectedInst.currentHackathons.map((hack, index) => (
                            <li key={index} className="bg-blue-600 text-white p-3 rounded-xl text-xs flex items-center justify-between shadow-md">
                              <div>
                                <p className="font-bold">{hack}</p>
                                <p className="text-[10px] text-blue-200 font-mono mt-0.5">Submissions Open | Academic Credit Accredited</p>
                              </div>
                              <button 
                                onClick={() => alert(`Applied to ${hack} successfully under JR INVENTO Global Sandbox!`)} 
                                className="bg-white text-blue-600 font-bold text-[9px] px-2 py-1 rounded cursor-pointer hover:bg-slate-50 transition-all active:scale-95 shrink-0"
                              >
                                JOIN HUB
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <p className="text-xs font-semibold">Select an institution from the list to view its profile.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })()}

        {/* TAB 2: INTERACTIVE CAD & PATENT VIEWER */}
        {activeSubTab === "cad" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 h-full overflow-hidden">
            
            {/* Left Files List */}
            <div className="md:col-span-4 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide mb-3">CAD Blueprint Library</h4>
              {cadFiles.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedCad(file)}
                  className={`w-full p-3 border rounded-xl text-left transition-all ${
                    selectedCad.id === file.id 
                      ? "border-blue-500 bg-blue-50/20 shadow-sm" 
                      : "border-slate-150 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-600 block mb-1.5 w-max">
                    {file.category}
                  </span>
                  <p className="text-xs font-bold text-slate-800 truncate">{file.title}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Author: {file.author}</p>
                </button>
              ))}
            </div>

            {/* Right Interactive SVG CAD Viewport */}
            <div className="md:col-span-8 flex flex-col bg-slate-950 rounded-xl p-4 overflow-hidden border border-slate-800 relative justify-between">
              
              {/* Layer Controls */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
                <div>
                  <h4 className="font-bold text-xs text-white">{selectedCad.title}</h4>
                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">Vector Scale representation | Size: {selectedCad.fileSize}</p>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg">
                  <button
                    onClick={() => setCadLayer("copper")}
                    className={`text-[9px] font-bold font-mono px-2 py-1 rounded transition-colors ${
                      cadLayer === "copper" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Copper Traces
                  </button>
                  <button
                    onClick={() => setCadLayer("silkscreen")}
                    className={`text-[9px] font-bold font-mono px-2 py-1 rounded transition-colors ${
                      cadLayer === "silkscreen" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Silk Screen
                  </button>
                  <button
                    onClick={() => setCadLayer("drill")}
                    className={`text-[9px] font-bold font-mono px-2 py-1 rounded transition-colors ${
                      cadLayer === "drill" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Drill Holes
                  </button>
                </div>
              </div>

              {/* Viewport Canvas */}
              <div className="flex-1 flex items-center justify-center min-h-[180px] relative">
                <svg viewBox="0 0 200 150" className="w-48 h-36">
                  {/* Grid overlay */}
                  <defs>
                    <pattern id="cadGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="0.5" fill="#334155" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cadGrid)" />

                  {/* Outer CAD Border */}
                  <rect x="10" y="10" width="180" height="130" rx="6" fill="none" stroke="#475569" strokeWidth="1" />

                  {/* COPPER PATH LAYER */}
                  {cadLayer === "copper" && (
                    <g>
                      <path d="M 20 20 L 70 20 L 70 60 L 130 60 L 130 110" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                      <path d="M 120 40 L 150 40 L 150 120" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                      <circle cx="20" cy="20" r="4" fill="#f59e0b" />
                      <circle cx="130" cy="110" r="4" fill="#f59e0b" />
                      <circle cx="150" cy="120" r="4" fill="#f59e0b" />
                    </g>
                  )}

                  {/* SILKSCREEN LABEL LAYER */}
                  {cadLayer === "silkscreen" && (
                    <g>
                      <text x="30" y="40" fill="#10b981" fontSize="6" fontFamily="monospace">U1: MICRO_MCU</text>
                      <rect x="25" y="45" width="40" height="25" fill="none" stroke="#10b981" strokeWidth="1" />
                      
                      <text x="120" y="85" fill="#10b981" fontSize="6" fontFamily="monospace">J1: SIP_TRUNK</text>
                      <rect x="115" y="90" width="30" height="15" fill="none" stroke="#10b981" strokeWidth="1" />

                      <text x="100" y="25" fill="#10b981" fontSize="6" fontFamily="monospace" fontWeight="bold">JR INVENTO v1.0a</text>
                    </g>
                  )}

                  {/* DRILL HOLES LAYER */}
                  {cadLayer === "drill" && (
                    <g>
                      <circle cx="15" cy="15" r="3" fill="#ef4444" fillOpacity="0.4" stroke="#ef4444" strokeWidth="1" />
                      <circle cx="185" cy="15" r="3" fill="#ef4444" fillOpacity="0.4" stroke="#ef4444" strokeWidth="1" />
                      <circle cx="15" cy="135" r="3" fill="#ef4444" fillOpacity="0.4" stroke="#ef4444" strokeWidth="1" />
                      <circle cx="185" cy="135" r="3" fill="#ef4444" fillOpacity="0.4" stroke="#ef4444" strokeWidth="1" />
                      
                      {/* Vias */}
                      <circle cx="70" cy="60" r="1.5" fill="#ef4444" />
                      <circle cx="130" cy="60" r="1.5" fill="#ef4444" />
                    </g>
                  )}
                </svg>

                <div className="absolute bottom-2 left-2 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[8px] font-mono text-slate-400">
                  SCHEMA TYPE: {selectedCad.vectorSchema.toUpperCase()}
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Eye size={12} /> {selectedCad.views} views</span>
                  <span className="flex items-center gap-1"><Download size={12} /> {selectedCad.downloads} saved</span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => alert("CAD blueprint saved securely to your Local Workspace.")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] px-3 py-1.5 rounded transition-colors"
                  >
                    Download CAD
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: CAMPUS CONFERENCING */}
        {activeSubTab === "rooms" && (
          <div className="space-y-4 h-full overflow-y-auto custom-scrollbar pr-1">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Compass className="text-blue-600" size={18} />
              <h4 className="font-bold text-slate-800 text-sm">Active Voice & Lecture Rooms</h4>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Hop into peer-led academic audio lounges. Powered by enterprise-grade SIP connections, rooms deliver crystal-clear voice integration with minimum bandwidth.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {audioRooms.map((room) => {
                const isJoined = joinedAudioRoom === room.id;
                return (
                  <div 
                    key={room.id} 
                    className={`p-5 rounded-2xl border transition-all ${
                      isJoined 
                        ? "border-emerald-500 bg-emerald-50/20" 
                        : "border-slate-200 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">
                      Voice Room
                    </span>
                    <h5 className="font-bold text-slate-800 text-xs mt-3 h-8 line-clamp-2 leading-relaxed">
                      {room.name}
                    </h5>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-100 font-mono">
                      <span>Host: {room.host.split(" ")[2]}</span>
                      <span>🎙️ {room.participants} listeners</span>
                    </div>

                    <button
                      onClick={() => handleJoinAudioRoom(room.id, room.name)}
                      className={`w-full mt-4 font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                        isJoined 
                          ? "bg-red-600 text-white hover:bg-red-700" 
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      }`}
                    >
                      <Play size={11} />
                      <span>{isJoined ? "Leave Room" : "Join Conference"}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
