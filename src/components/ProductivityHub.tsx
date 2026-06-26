import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { INITIAL_TASKS, TaskItem } from "../types";
import { Clock, Play, Pause, RotateCcw, CheckSquare, Plus, Trash2, Calendar, Award, AlertCircle, Volume2, VolumeX, History } from "lucide-react";

export default function ProductivityHub() {
  // Clocks State
  const [time, setTime] = useState(new Date());

  // Tasks State
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<any>("Assignment");
  const [newTaskDeadline, setNewTaskDeadline] = useState("June 30, 2026");

  // Pomodoro State
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(1500); // 25 min default
  const [timerRunning, setTimerRunning] = useState(false);
  const [focusStreak, setFocusStreak] = useState(2);
  const [selectedSound, setSelectedSound] = useState<"zen" | "beep" | "tap">("zen");
  const [isMuted, setIsMuted] = useState(false);
  const [sprintLogs, setSprintLogs] = useState<Array<{ id: string; type: "Focus Block" | "Break Session"; timestamp: string; duration: string }>>([
    { id: "log-1", type: "Focus Block", timestamp: "10:15 AM", duration: "25 min" },
    { id: "log-2", type: "Break Session", timestamp: "10:20 AM", duration: "5 min" }
  ]);

  // Web Audio Synth alarm helper
  const playSynthSound = (type: "focusComplete" | "breakComplete" | "click") => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "focusComplete") {
        if (selectedSound === "zen") {
          // Elegant positive ascending chime (Zen bowl style)
          osc.type = "sine";
          osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.15); // E5
          osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.3); // G5
          osc.frequency.setValueAtTime(1046.5, audioCtx.currentTime + 0.45); // C6
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.8);
        } else if (selectedSound === "beep") {
          // High vintage beep series
          osc.type = "square";
          osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
          osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.1);
          osc.frequency.setValueAtTime(1000, audioCtx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.4);
        } else {
          // Rapid woodblock double-tap
          osc.type = "triangle";
          osc.frequency.setValueAtTime(800, audioCtx.currentTime);
          osc.frequency.setValueAtTime(1000, audioCtx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.15);
        }
      } else if (type === "breakComplete") {
        // Soft triple descending synth notes
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.setValueAtTime(500, audioCtx.currentTime + 0.12);
        osc.frequency.setValueAtTime(400, audioCtx.currentTime + 0.24);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } else {
        // Subtle micro UI click
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      }
    } catch (e) {
      console.warn("Audio synthesis not initialized", e);
    }
  };

  // Live Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pomodoro Ticker
  useEffect(() => {
    let timer: any;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerRunning(false);
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (pomodoroMode === "focus") {
        setFocusStreak(prev => prev + 1);
        setPomodoroMode("break");
        setTimeLeft(300); // 5 min break
        playSynthSound("focusComplete");
        setSprintLogs(prev => [
          { id: Math.random().toString(), type: "Focus Block", timestamp: nowStr, duration: "25 min" },
          ...prev
        ]);
        alert("Focus session complete! Time for a short break.");
      } else {
        setPomodoroMode("focus");
        setTimeLeft(1500);
        playSynthSound("breakComplete");
        setSprintLogs(prev => [
          { id: Math.random().toString(), type: "Break Session", timestamp: nowStr, duration: "5 min" },
          ...prev
        ]);
        alert("Break is over! Ready to focus again?");
      }
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft, pomodoroMode, selectedSound, isMuted]);

  // Format timezone time helper
  const getFormatTime = (offsetHours: number) => {
    // Current UTC time
    const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
    // Target timezone time
    const nd = new Date(utc + (3600000 * offsetHours));
    return nd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Task Handlers
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleAddTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: Math.random().toString(),
      title: newTaskTitle,
      category: newTaskCategory,
      deadline: newTaskDeadline,
      completed: false
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle("");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Pomodoro Helpers
  const formatPomodoroTime = () => {
    const min = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const sec = (timeLeft % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const resetPomodoro = () => {
    setTimerRunning(false);
    setPomodoroMode("focus");
    setTimeLeft(1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)]">
      
      {/* LHS: Clocks & Pomodoro */}
      <div className="lg:col-span-5 flex flex-col gap-6 lg:overflow-y-auto lg:custom-scrollbar">
        
        {/* World Clock Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="text-blue-600" size={18} />
            <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">World Communication Clocks</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-blue-400 font-mono font-bold tracking-widest uppercase block mb-1">Nairobi (Local EAT)</span>
              <p className="font-mono text-xl font-bold">{getFormatTime(3)}</p>
              <span className="text-[9px] text-slate-400 block mt-1">GMT +3:00 Standard</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase block mb-1">London (BST)</span>
              <p className="font-mono text-xl font-bold text-slate-800">{getFormatTime(1)}</p>
              <span className="text-[9px] text-slate-400 block mt-1">GMT +1:00 Daylight</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase block mb-1">New York (EDT)</span>
              <p className="font-mono text-xl font-bold text-slate-800">{getFormatTime(-4)}</p>
              <span className="text-[9px] text-slate-400 block mt-1">GMT -4:00 Daylight</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <span className="text-[10px] text-slate-500 font-mono font-bold tracking-widest uppercase block mb-1">Tokyo (JST)</span>
              <p className="font-mono text-xl font-bold text-slate-800">{getFormatTime(9)}</p>
              <span className="text-[9px] text-slate-400 block mt-1">GMT +9:00 Standard</span>
            </div>

          </div>
        </div>

        {/* Pomodoro Focus Timer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="w-full flex items-center gap-2 border-b border-slate-100 pb-3 mb-1 text-left">
            <Award className="text-blue-600" size={18} />
            <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Engineering Focus Mode</h3>
          </div>

          <div className="space-y-1">
            <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest ${
              pomodoroMode === "focus" ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}>
              {pomodoroMode === "focus" ? "Active Focus Block" : "Take a Rest"}
            </span>
            <p className="text-[10px] text-slate-500 font-mono mt-1">STREAK: {focusStreak} SESSIONS COMPLETED</p>
          </div>

          <div className="text-5xl font-mono font-bold tracking-tight text-slate-800 select-none py-2">
            {formatPomodoroTime()}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between w-full max-w-[240px] border-y border-slate-100 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTimerRunning(!timerRunning);
                  playSynthSound("click");
                }}
                className={`p-3 rounded-full ${timerRunning ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"} text-white shadow-lg transition-transform hover:scale-105`}
              >
                {timerRunning ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={() => {
                  resetPomodoro();
                  playSynthSound("click");
                }}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full border border-slate-200"
                title="Reset timer"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Mute and Synth Tester */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-lg border transition-colors ${isMuted ? "bg-red-50 border-red-200 text-red-500" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}
                title={isMuted ? "Unmute alarm sounds" : "Mute alarm sounds"}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button
                onClick={() => playSynthSound("focusComplete")}
                className="text-[10px] px-2 py-1.5 font-bold border border-slate-200 bg-slate-50 text-slate-600 rounded-lg hover:bg-slate-100 active:scale-95 transition-all"
                title="Test current alarm synthesis tone"
              >
                Test Tone
              </button>
            </div>
          </div>

          {/* Sound Selector Dropdown */}
          <div className="w-full text-left space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">Alert Tone Synthesis</label>
            <select
              value={selectedSound}
              onChange={(e) => setSelectedSound(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:bg-white text-slate-700 font-semibold"
            >
              <option value="zen">Zen Ascending Chime (Sine wave)</option>
              <option value="beep">Retro Beep alarm (Square wave)</option>
              <option value="tap">Ambient Woodblock tap (Triangle wave)</option>
            </select>
          </div>

          {/* Completed Sprints Logger */}
          <div className="w-full text-left border-t border-slate-100 pt-4 space-y-2">
            <div className="flex items-center gap-1 text-slate-400">
              <History size={13} />
              <span className="text-[10px] font-bold uppercase font-mono tracking-wider">Sprint Sessions History</span>
            </div>
            
            <div className="max-h-[110px] overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {sprintLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-150/60 text-[11px]">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span className={`w-1.5 h-1.5 rounded-full ${log.type === "Focus Block" ? "bg-red-500" : "bg-emerald-500"}`}></span>
                    <span className="text-slate-700">{log.type}</span>
                  </div>
                  <span className="text-slate-400 font-mono">{log.timestamp} ({log.duration})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 max-w-xs leading-relaxed text-center font-mono uppercase tracking-tight">
            SIP Focus suppression enabled.
          </div>
        </div>

      </div>

      {/* RHS: Interactive Timetable & Academic Deadlines */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col h-full shadow-sm">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <CheckSquare className="text-blue-600" size={18} />
          <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Deadlines & Timetable</h3>
        </div>

        {/* Task Adding Form */}
        <form onSubmit={handleAddTask} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
          <div className="md:col-span-6">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter new deadline item..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:outline-none focus:bg-white"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:outline-none"
            >
              <option>Assignment</option>
              <option>Research</option>
              <option>Event Reminder</option>
              <option>Call Meeting</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs p-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>
        </form>

        {/* List of Tasks */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                task.completed 
                  ? "bg-slate-50 border-slate-200 opacity-60" 
                  : "bg-white border-slate-150 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div>
                  <p className={`text-xs font-semibold ${task.completed ? "line-through text-slate-500" : "text-slate-800"}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-600">
                      {task.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock size={10} />
                      Due: {task.deadline}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-50"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xs text-slate-500">All caught up! No active deadlines listed.</p>
            </div>
          )}
        </div>

        {/* Academic Event Calendars (Footer notice) */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl mt-4 flex items-start gap-2 text-xs text-amber-800 leading-relaxed">
          <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong>National Campus Alert:</strong> First semester engineering defense dates have been adjusted. TVET national projects submissions are expected before July 15, 2026.
          </div>
        </div>

      </div>

    </div>
  );
}
