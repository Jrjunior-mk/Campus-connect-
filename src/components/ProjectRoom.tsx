import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Folder, 
  MessageSquare, 
  CheckSquare, 
  UploadCloud, 
  Download, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Tag, 
  Globe, 
  Building, 
  Cpu, 
  Layers, 
  Bot, 
  Paperclip, 
  ExternalLink, 
  Briefcase,
  X,
  Send,
  Users
} from "lucide-react";

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  column: "todo" | "inprogress" | "completed";
  priority: "High" | "Medium" | "Low";
  assignee: string;
}

export interface ProjectMessage {
  id: string;
  senderName: string;
  role: "user" | "partner" | "advisor";
  text: string;
  timestamp: string;
  attachedFileId?: string;
}

export interface ProjectRoomData {
  id: string;
  name: string;
  description: string;
  category: "IoT" | "Telecom" | "Renewable Energy" | "Software" | "Mechanical";
  creator: string;
  teamSize: number;
  institution: string;
  files: ProjectFile[];
  tasks: ProjectTask[];
  messages: ProjectMessage[];
}

const INITIAL_PROJECT_ROOMS: ProjectRoomData[] = [
  {
    id: "egg-incubator-1",
    name: "Solar-Powered IoT Egg Incubator",
    description: "Automated microcontroller incubator targeting smallholder farmers in Kiambu. Fits TVET agricultural modernization protocols.",
    category: "IoT",
    creator: "John Mwangi",
    teamSize: 3,
    institution: "JKUAT",
    files: [
      { id: "cad-1", name: "incubator_enclosure_v2.step", size: "4.2 MB", uploadedBy: "John Mwangi", uploadedAt: "2026-06-25 10:14" },
      { id: "code-1", name: "temp_sensor_esp32.ino", size: "12 KB", uploadedBy: "Sylvia Njeri", uploadedAt: "2026-06-25 14:32" },
      { id: "schematic-1", name: "solar_regulator_circuit.pdf", size: "1.1 MB", uploadedBy: "Prof. Evans Mwangi", uploadedAt: "2026-06-25 16:05" }
    ],
    tasks: [
      { id: "task-1", title: "Optimize ESP32 Deep Sleep Cycles", description: "Implement deep sleep to conserve battery during low sunlight hours.", column: "inprogress", priority: "High", assignee: "Sylvia Njeri" },
      { id: "task-2", title: "Validate DHT22 Sensor Precision", description: "Run a 48-hour continuous drift analysis.", column: "todo", priority: "Medium", assignee: "John Mwangi" },
      { id: "task-3", title: "Fabricate outer enclosure mesh", description: "Cut recycled PMMA using JKUAT laser cutter.", column: "completed", priority: "Low", assignee: "John Mwangi" }
    ],
    messages: [
      { id: "m-1", senderName: "John Mwangi", role: "user", text: "Hey team, I uploaded the PMMA outer enclosure STEP file. Please review the air vents placement.", timestamp: "10:15 AM" },
      { id: "m-2", senderName: "Sylvia Njeri", role: "partner", text: "Vent looks good, but let's make sure the fan mounts are aligned. ESP32 firmware code uploaded too!", timestamp: "10:20 AM" },
      { id: "m-3", senderName: "Prof. Evans Mwangi", role: "advisor", text: "Outstanding progress. I have linked the regulator circuit PDF. Keep up the clean work.", timestamp: "11:00 AM" }
    ]
  },
  {
    id: "swahili-voice-router-2",
    name: "5G Swahili Voice Router",
    description: "VoIP gateway optimized for local TVET communication. Converts Swahili voice commands to SIP network controls.",
    category: "Telecom",
    creator: "Sarah Wambui",
    teamSize: 2,
    institution: "University of Nairobi (UoN)",
    files: [
      { id: "config-1", name: "asterisk_sip_trunk.conf", size: "45 KB", uploadedBy: "Sarah Wambui", uploadedAt: "2026-06-24 11:15" },
      { id: "dataset-1", name: "swahili_acoustic_model.bin", size: "38.5 MB", uploadedBy: "Kamau Njoroge", uploadedAt: "2026-06-24 15:10" }
    ],
    tasks: [
      { id: "task-4", title: "SIP registration troubleshooting", description: "Solve the 403 Forbidden challenge when dialing TVET local nodes.", column: "todo", priority: "High", assignee: "Sarah Wambui" },
      { id: "task-5", title: "Audio payload compression", description: "Convert WAV audio headers into low-bandwidth Opus formats.", column: "completed", priority: "Medium", assignee: "Kamau Njoroge" }
    ],
    messages: [
      { id: "m-4", senderName: "Sarah Wambui", role: "user", text: "The Swahili speech decoder is operational! Testing Asterisk SIP registrations now.", timestamp: "Yesterday" },
      { id: "m-5", senderName: "Kamau Njoroge", role: "partner", text: "Excellent. Let me compress the acoustic file so it runs efficiently on edge gateways.", timestamp: "Yesterday" }
    ]
  }
];

interface ProjectRoomProps {
  onNavigateToTab?: (tabId: string) => void;
}

export default function ProjectRoom({ onNavigateToTab }: ProjectRoomProps) {
  const [rooms, setRooms] = useState<ProjectRoomData[]>(INITIAL_PROJECT_ROOMS);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("egg-incubator-1");
  const [activeTab, setActiveTab] = useState<"chat" | "tasks" | "files">("chat");

  // Room Creation state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomDesc, setNewRoomDesc] = useState("");
  const [newRoomCategory, setNewRoomCategory] = useState<"IoT" | "Telecom" | "Renewable Energy" | "Software" | "Mechanical">("IoT");
  const [newRoomInstitution, setNewRoomInstitution] = useState("University of Nairobi (UoN)");

  // Chat/Messaging input state
  const [chatInput, setChatInput] = useState("");
  const [attachedFileId, setAttachedFileId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Task creation state
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newTaskAssignee, setNewTaskAssignee] = useState("");

  // File Upload state
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  useEffect(() => {
    // Scroll chat to bottom when message arrives
    if (activeTab === "chat" && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedRoom?.messages, activeTab]);

  // Create Project Room Handler
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim() || !newRoomDesc.trim()) return;

    const newRoom: ProjectRoomData = {
      id: `room-${Date.now()}`,
      name: newRoomName,
      description: newRoomDesc,
      category: newRoomCategory,
      creator: "Innovator Me",
      teamSize: 1,
      institution: newRoomInstitution,
      files: [
        { id: "welcome-doc", name: "getting_started_readme.txt", size: "3 KB", uploadedBy: "System Bot", uploadedAt: new Date().toISOString().split('T')[0] }
      ],
      tasks: [
        { id: `task-init-${Date.now()}`, title: "Brainstorm first hardware prototype", description: "Sketch rough block diagram of circuit layout.", column: "todo", priority: "Medium", assignee: "Innovator Me" }
      ],
      messages: [
        { id: `m-init-${Date.now()}`, senderName: "System Bot", role: "advisor", text: `Welcome to the ${newRoomName} virtual workspace! Share files, manage tasks, and brainstorm right here.`, timestamp: "Just now" }
      ]
    };

    setRooms(prev => [...prev, newRoom]);
    setSelectedRoomId(newRoom.id);
    setNewRoomName("");
    setNewRoomDesc("");
    setShowCreateModal(false);
    setActiveTab("chat");
  };

  // Chat message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && !attachedFileId) return;

    const newMessage: ProjectMessage = {
      id: `msg-${Date.now()}`,
      senderName: "Innovator Me",
      role: "user",
      text: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFileId: attachedFileId || undefined
    };

    const updatedRooms = rooms.map(room => {
      if (room.id === selectedRoom.id) {
        return {
          ...room,
          messages: [...room.messages, newMessage]
        };
      }
      return room;
    });

    setRooms(updatedRooms);
    setChatInput("");
    setAttachedFileId("");

    // Trigger Smart AI response delay
    const userMsgText = chatInput.toLowerCase();
    setTimeout(() => {
      let responseText = "Excellent addition! Let's update our task board with this action item.";
      if (userMsgText.includes("cad") || userMsgText.includes("design") || userMsgText.includes("file")) {
        responseText = "I see you mentioned design documents. I'll inspect the CAD enclosure v2 step file to verify correct offsets!";
      } else if (userMsgText.includes("esp32") || userMsgText.includes("code") || userMsgText.includes("bug") || userMsgText.includes("firmware")) {
        responseText = "Sounds like a firmware check is needed. Let's make sure the baud rate is set to 115200 in our source configs!";
      } else if (userMsgText.includes("test") || userMsgText.includes("run") || userMsgText.includes("measure")) {
        responseText = "Agreed, live testing on-site will help us measure potential drift in extreme weather conditions.";
      }

      const aiResponse: ProjectMessage = {
        id: `msg-ai-${Date.now()}`,
        senderName: "Team Co-Inventor (AI)",
        role: "partner",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setRooms(prevRooms => prevRooms.map(room => {
        if (room.id === selectedRoom.id) {
          return {
            ...room,
            messages: [...room.messages, aiResponse]
          };
        }
        return room;
      }));
    }, 1200);
  };

  // Add Task Handler
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: ProjectTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      column: "todo",
      priority: newTaskPriority,
      assignee: newTaskAssignee || "Unassigned"
    };

    setRooms(prev => prev.map(room => {
      if (room.id === selectedRoom.id) {
        return {
          ...room,
          tasks: [...room.tasks, newTask]
        };
      }
      return room;
    }));

    setNewTaskTitle("");
    setNewTaskDesc("");
    setNewTaskAssignee("");
    setShowAddTask(false);
  };

  // Move Task Column Handler
  const moveTask = (taskId: string, direction: "left" | "right") => {
    setRooms(prev => prev.map(room => {
      if (room.id === selectedRoom.id) {
        const updatedTasks = room.tasks.map(task => {
          if (task.id === taskId) {
            let nextCol: "todo" | "inprogress" | "completed" = task.column;
            if (direction === "right") {
              if (task.column === "todo") nextCol = "inprogress";
              else if (task.column === "inprogress") nextCol = "completed";
            } else {
              if (task.column === "completed") nextCol = "inprogress";
              else if (task.column === "inprogress") nextCol = "todo";
            }
            return { ...task, column: nextCol };
          }
          return task;
        });
        return { ...room, tasks: updatedTasks };
      }
      return room;
    }));
  };

  // Delete Task Handler
  const deleteTask = (taskId: string) => {
    setRooms(prev => prev.map(room => {
      if (room.id === selectedRoom.id) {
        return {
          ...room,
          tasks: room.tasks.filter(t => t.id !== taskId)
        };
      }
      return room;
    }));
  };

  // File Upload Handlers (Simulation)
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (fileName: string, fileSize: string) => {
    const newFile: ProjectFile = {
      id: `file-${Date.now()}`,
      name: fileName,
      size: fileSize,
      uploadedBy: "Innovator Me",
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    setRooms(prev => prev.map(room => {
      if (room.id === selectedRoom.id) {
        return {
          ...room,
          files: [newFile, ...room.files]
        };
      }
      return room;
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      processFile(file.name, sizeStr);
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${(file.size / 1024).toFixed(0)} KB`;
      processFile(file.name, sizeStr);
    }
  };

  // File download click triggers standard browser data-URI download of dummy content
  const handleDownloadFile = (file: ProjectFile) => {
    try {
      const dummyContent = `JR INVENTO Patent-Sandbox Project: ${selectedRoom.name}\nFile: ${file.name}\nSize: ${file.size}\nAuthorized Download Token: SHA-256-${Math.random().toString(36).substring(2)}`;
      const element = document.createElement("a");
      const fileBlob = new Blob([dummyContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(fileBlob);
      element.download = file.name.endsWith(".step") || file.name.endsWith(".ino") || file.name.endsWith(".pdf") || file.name.endsWith(".conf") || file.name.endsWith(".bin")
        ? file.name 
        : `${file.name}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error("Failed to download file.", err);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="text-blue-600" size={18} />
            <h3 className="font-bold text-slate-800 text-base font-sans">Virtual Project Rooms</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Join or establish sandboxes for building hardware & software innovations with peer academics.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/15 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>New Project Room</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[440px]">
        {/* Left column: Workspaces Selector */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Active Workspaces</span>
            <span className="text-[9px] bg-slate-200 text-slate-700 font-mono font-bold px-1.5 py-0.5 rounded-full">{rooms.length}</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[360px] custom-scrollbar pr-1">
            {rooms.map(room => {
              const isSelected = room.id === selectedRoom.id;
              return (
                <button
                  key={room.id}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    setActiveTab("chat");
                  }}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                    isSelected 
                      ? "bg-white border-blue-500 shadow-sm ring-1 ring-blue-500/10" 
                      : "bg-white/60 border-slate-200 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase ${
                      room.category === "IoT" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                      room.category === "Telecom" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                      room.category === "Renewable Energy" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                      "bg-purple-50 text-purple-600 border border-purple-100"
                    }`}>
                      {room.category}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                      <Users size={10} />
                      {room.teamSize} members
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 text-xs leading-tight mb-0.5">{room.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-normal">{room.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono font-bold text-slate-400 pt-1 border-t border-slate-100/60 mt-0.5">
                    <span className="truncate">{room.institution}</span>
                    <span className="shrink-0 text-blue-600">{room.files.length} Files</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts for Jobs / Attachments Links */}
          <div className="mt-auto bg-blue-50 border border-blue-100/60 p-3 rounded-xl space-y-1.5">
            <h5 className="text-[10px] font-bold text-blue-800 font-mono uppercase">Ecosystem Shortcuts</h5>
            <div className="flex flex-col gap-1 text-[11px] font-semibold">
              <button 
                onClick={() => onNavigateToTab && onNavigateToTab("careers")} 
                className="text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1 text-left"
              >
                <Briefcase size={11} />
                <span>Explore Active Attachments & Jobs</span>
                <ExternalLink size={9} />
              </button>
              <button 
                onClick={() => onNavigateToTab && onNavigateToTab("campus")} 
                className="text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1 text-left"
              >
                <Building size={11} />
                <span>Consult Kenya Universities Directory</span>
                <ExternalLink size={9} />
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Selected workspace hub details */}
        <div className="lg:col-span-8 border border-slate-200 rounded-2xl flex flex-col overflow-hidden bg-white">
          {/* Room Header Info */}
          <div className="bg-slate-900 text-white p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold font-mono tracking-widest uppercase text-blue-400">Invention Workspace</span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-semibold">{selectedRoom.category}</span>
              </div>
              <h3 className="font-bold text-sm text-white mt-0.5">{selectedRoom.name}</h3>
              <p className="text-[11px] text-slate-300 leading-normal max-w-xl">{selectedRoom.description}</p>
            </div>

            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono font-semibold h-fit">
              <span className="bg-white/10 px-2.5 py-1 rounded text-slate-200 border border-white/5">Host: {selectedRoom.institution}</span>
            </div>
          </div>

          {/* Sub Navigation tabs */}
          <div className="border-b border-slate-200 bg-slate-50 flex items-center justify-between px-4 py-1.5">
            <div className="flex items-center gap-1 font-sans text-xs">
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "chat" 
                    ? "bg-white text-blue-600 shadow-sm border border-slate-150" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <MessageSquare size={13} />
                <span>Real-time Chat ({selectedRoom.messages.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "tasks" 
                    ? "bg-white text-blue-600 shadow-sm border border-slate-150" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <CheckSquare size={13} />
                <span>Task Board ({selectedRoom.tasks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("files")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === "files" 
                    ? "bg-white text-blue-600 shadow-sm border border-slate-150" 
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Folder size={13} />
                <span>Shared Files ({selectedRoom.files.length})</span>
              </button>
            </div>

            {/* Quick action triggers */}
            <div className="text-[10px] font-semibold text-slate-400 font-mono hidden sm:block">
              ACTIVE SESSION
            </div>
          </div>

          {/* Tab Content Display */}
          <div className="flex-1 p-4 overflow-y-auto max-h-[380px] min-h-[320px] flex flex-col justify-between">
            
            {/* TAB: REAL-TIME MESSAGING */}
            {activeTab === "chat" && (
              <div className="flex flex-col h-full justify-between flex-1">
                {/* Chat feed list */}
                <div className="space-y-3.5 overflow-y-auto max-h-[260px] flex-1 mb-4 pr-1 custom-scrollbar">
                  {selectedRoom.messages.map(msg => {
                    const isMe = msg.role === "user";
                    const fileObj = msg.attachedFileId ? selectedRoom.files.find(f => f.id === msg.attachedFileId) : null;
                    
                    return (
                      <div key={msg.id} className={`flex items-start gap-2 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse text-right" : "mr-auto flex-row text-left"}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] uppercase shrink-0 ${
                          isMe ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                        }`}>
                          {msg.senderName[0]}
                        </div>
                        
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                            <span className="font-bold text-slate-600">{msg.senderName}</span>
                            <span>•</span>
                            <span>{msg.timestamp}</span>
                            {!isMe && msg.role === "advisor" && (
                              <span className="bg-purple-100 text-purple-700 text-[8px] font-bold font-mono px-1 rounded uppercase">Academic Advisor</span>
                            )}
                          </div>
                          
                          <div className={`p-3 rounded-2xl text-xs leading-relaxed inline-block ${
                            isMe 
                              ? "bg-blue-600 text-white rounded-tr-none" 
                              : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            
                            {/* Embedded Attachment Link in Chat */}
                            {fileObj && (
                              <div className={`mt-2 p-2 rounded-xl text-[10px] flex items-center justify-between gap-3 ${
                                isMe ? "bg-blue-700/50 text-blue-100" : "bg-white border border-slate-200 text-slate-700"
                              }`}>
                                <div className="flex items-center gap-1.5 truncate">
                                  <Paperclip size={10} className="shrink-0" />
                                  <span className="font-mono truncate font-bold">{fileObj.name}</span>
                                  <span className="opacity-70 font-mono text-[9px]">({fileObj.size})</span>
                                </div>
                                <button
                                  onClick={() => handleDownloadFile(fileObj)}
                                  className={`p-1 rounded-lg hover:bg-white/10 transition-colors ${
                                    isMe ? "text-blue-100 hover:bg-blue-800" : "text-blue-600 hover:bg-slate-100"
                                  }`}
                                  title="Download Attachment"
                                >
                                  <Download size={10} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input area */}
                <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-150 flex items-center gap-2">
                  {/* File attach shortcut */}
                  <div className="relative">
                    <select
                      value={attachedFileId}
                      onChange={(e) => setAttachedFileId(e.target.value)}
                      className="absolute opacity-0 w-8 h-8 cursor-pointer z-10"
                      title="Attach file to chat"
                    >
                      <option value="">Attach file...</option>
                      {selectedRoom.files.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className={`p-2 rounded-xl border transition-colors flex items-center justify-center ${
                        attachedFileId 
                          ? "bg-blue-50 border-blue-400 text-blue-600" 
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                      }`}
                      title={attachedFileId ? "File Attached!" : "Attach Project File"}
                    >
                      <Paperclip size={14} className={attachedFileId ? "animate-bounce" : ""} />
                    </button>
                  </div>

                  {/* Attachment indicator feedback */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={
                        attachedFileId 
                          ? `Send with attached file: "${selectedRoom.files.find(f => f.id === attachedFileId)?.name}"...` 
                          : "Type your comment or engineering suggestion..."
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white focus:border-blue-500 pr-10 font-medium text-slate-800"
                    />
                    {attachedFileId && (
                      <button 
                        type="button"
                        onClick={() => setAttachedFileId("")}
                        className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!chatInput.trim() && !attachedFileId}
                    className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-xl transition-all disabled:opacity-40 shrink-0 cursor-pointer"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
            )}

            {/* TAB: KANBAN TASK BOARD */}
            {activeTab === "tasks" && (
              <div className="space-y-4 flex flex-col h-full flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Project Kanban Board</span>
                  <button
                    onClick={() => setShowAddTask(!showAddTask)}
                    className="text-[10px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 font-mono uppercase"
                  >
                    {showAddTask ? "Close Form" : "Create Task"}
                    <Plus size={10} />
                  </button>
                </div>

                {/* Form to Add Task */}
                <AnimatePresence>
                  {showAddTask && (
                    <motion.form 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={handleAddTask}
                      className="bg-slate-50 border border-slate-200 p-3 rounded-2xl space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        <div className="md:col-span-6 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Task Title</label>
                          <input
                            type="text"
                            required
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="e.g. Test heat dissipation sensor"
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none"
                          />
                        </div>

                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Priority</label>
                          <select
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value as any)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none"
                          >
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>

                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Assignee</label>
                          <input
                            type="text"
                            value={newTaskAssignee}
                            onChange={(e) => setNewTaskAssignee(e.target.value)}
                            placeholder="Assignee name"
                            className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Description</label>
                        <input
                          type="text"
                          value={newTaskDesc}
                          onChange={(e) => setNewTaskDesc(e.target.value)}
                          placeholder="Provide details about the fabrication criteria..."
                          className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] py-1.5 px-3 rounded-lg font-mono uppercase transition-colors"
                      >
                        Save Task to Backlog
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-start">
                  
                  {/* Column 1: TODO */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-150 pb-1.5 mb-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Backlog / To Do</span>
                      <span className="text-[9px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-full">
                        {selectedRoom.tasks.filter(t => t.column === "todo").length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                      {selectedRoom.tasks.filter(t => t.column === "todo").map(task => (
                        <div key={task.id} className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              task.priority === "High" ? "bg-red-50 text-red-600 border border-red-100" :
                              task.priority === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                              "bg-slate-50 text-slate-600 border border-slate-100"
                            }`}>
                              {task.priority} PRIORITY
                            </span>
                            <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 size={11} />
                            </button>
                          </div>
                          
                          <div>
                            <h5 className="font-bold text-slate-800 text-xs leading-tight">{task.title}</h5>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{task.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-50 text-[9px] font-mono font-medium">
                            <span className="text-slate-400">Owner: {task.assignee}</span>
                            <button 
                              onClick={() => moveTask(task.id, "right")}
                              className="text-blue-600 hover:text-blue-800 flex items-center gap-0.5 font-bold cursor-pointer"
                            >
                              <span>Work</span>
                              <ArrowRight size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {selectedRoom.tasks.filter(t => t.column === "todo").length === 0 && (
                        <p className="text-[10px] text-slate-400 text-center py-4 italic">No tasks in queue.</p>
                      )}
                    </div>
                  </div>

                  {/* Column 2: IN PROGRESS */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-150 pb-1.5 mb-1">
                      <span className="text-[10px] font-bold text-blue-600 uppercase font-mono tracking-wider">In Active Work</span>
                      <span className="text-[9px] font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                        {selectedRoom.tasks.filter(t => t.column === "inprogress").length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                      {selectedRoom.tasks.filter(t => t.column === "inprogress").map(task => (
                        <div key={task.id} className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              task.priority === "High" ? "bg-red-50 text-red-600 border border-red-100" :
                              task.priority === "Medium" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                              "bg-slate-50 text-slate-600 border border-slate-100"
                            }`}>
                              {task.priority} PRIORITY
                            </span>
                            <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 size={11} />
                            </button>
                          </div>
                          
                          <div>
                            <h5 className="font-bold text-slate-800 text-xs leading-tight">{task.title}</h5>
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{task.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-50 text-[9px] font-mono font-medium">
                            <button 
                              onClick={() => moveTask(task.id, "left")}
                              className="text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                            >
                              <ArrowLeft size={10} />
                              <span>Back</span>
                            </button>
                            <span className="text-slate-400">Owner: {task.assignee}</span>
                            <button 
                              onClick={() => moveTask(task.id, "right")}
                              className="text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5 font-bold cursor-pointer"
                            >
                              <span>Done</span>
                              <ArrowRight size={10} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {selectedRoom.tasks.filter(t => t.column === "inprogress").length === 0 && (
                        <p className="text-[10px] text-slate-400 text-center py-4 italic">No tasks currently being worked.</p>
                      )}
                    </div>
                  </div>

                  {/* Column 3: COMPLETED */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-150 pb-1.5 mb-1">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono tracking-wider">Completed</span>
                      <span className="text-[9px] font-mono bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                        {selectedRoom.tasks.filter(t => t.column === "completed").length}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                      {selectedRoom.tasks.filter(t => t.column === "completed").map(task => (
                        <div key={task.id} className="bg-white/80 border border-slate-150 p-3 rounded-xl shadow-sm space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[8px] font-mono font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                              <CheckCircle2 size={9} />
                              RESOLVED
                            </span>
                            <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                              <Trash2 size={11} />
                            </button>
                          </div>
                          
                          <div>
                            <h5 className="font-bold text-slate-700 text-xs leading-tight line-through opacity-80">{task.title}</h5>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-normal line-through">{task.description}</p>
                          </div>

                          <div className="flex items-center justify-between pt-1.5 border-t border-slate-50 text-[9px] font-mono font-medium">
                            <button 
                              onClick={() => moveTask(task.id, "left")}
                              className="text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                            >
                              <ArrowLeft size={10} />
                              <span>Reopen</span>
                            </button>
                            <span className="text-slate-400">By: {task.assignee}</span>
                          </div>
                        </div>
                      ))}
                      {selectedRoom.tasks.filter(t => t.column === "completed").length === 0 && (
                        <p className="text-[10px] text-slate-400 text-center py-4 italic">No completed tasks yet.</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB: FILE SHARING HUB */}
            {activeTab === "files" && (
              <div className="space-y-4 flex flex-col h-full flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Shared Research & CAD Assets</span>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* File Upload Region */}
                  <div className="md:col-span-5">
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`h-[160px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 cursor-pointer transition-colors ${
                        dragActive 
                          ? "bg-blue-50 border-blue-500 text-blue-600" 
                          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleManualUpload}
                        className="hidden" 
                      />
                      <UploadCloud size={24} className="mb-2 text-slate-400 animate-bounce" />
                      <h4 className="font-bold text-xs text-slate-700">Drag & Drop Document</h4>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-[140px] leading-snug">
                        Supports STEP, PDF, DWG, INO codes, or any text assets.
                      </p>
                    </div>
                  </div>

                  {/* Shared File List */}
                  <div className="md:col-span-7 space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar">
                    {selectedRoom.files.map(file => (
                      <div key={file.id} className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-center justify-between text-xs hover:bg-slate-100 transition-colors">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-[9px] text-blue-600 shadow-sm shrink-0">
                            {file.name.includes(".") ? file.name.split(".").pop()?.toUpperCase() : "TXT"}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-slate-800 truncate">{file.name}</p>
                            <p className="text-[9px] text-slate-400 font-mono mt-0.5">{file.size} | By {file.uploadedBy}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDownloadFile(file)}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                            title="Download Shared Asset"
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* NEW ROOM POPUP MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X size={16} />
              </button>

              <h3 className="font-bold text-slate-900 text-lg">Create virtual project workspace</h3>
              <p className="text-xs text-slate-500 mt-0.5 mb-4">Establish an secure academic sandbox to formulate and iterate on your invention.</p>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">Invention Name</label>
                  <input
                    type="text"
                    required
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="e.g. Micro-grid Smart Inverter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">Category</label>
                  <select
                    value={newRoomCategory}
                    onChange={(e) => setNewRoomCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:bg-white focus:border-blue-500"
                  >
                    <option value="IoT">IoT & Microcontrollers</option>
                    <option value="Telecom">Telecom & VoIP Networks</option>
                    <option value="Renewable Energy">Renewable Green Energy</option>
                    <option value="Software">Software & Cloud Services</option>
                    <option value="Mechanical">Mechanical CAD Enclosures</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">Academic Institution Host</label>
                  <input
                    type="text"
                    required
                    value={newRoomInstitution}
                    onChange={(e) => setNewRoomInstitution(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 font-mono uppercase">Description & Objectives</label>
                  <textarea
                    required
                    rows={3}
                    value={newRoomDesc}
                    onChange={(e) => setNewRoomDesc(e.target.value)}
                    placeholder="Describe how the invention meets vocational, electrical, agricultural, or communication needs across Kenyan regional grids..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:bg-white focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-md"
                  >
                    Establish Sandbox
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
