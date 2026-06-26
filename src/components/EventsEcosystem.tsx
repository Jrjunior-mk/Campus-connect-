import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_EVENTS, EventDetail } from "../types";
import { Calendar, Plus, Ticket, Play, Users, MapPin, CheckCircle, ExternalLink, Activity } from "lucide-react";

export default function EventsEcosystem() {
  const [events, setEvents] = useState<EventDetail[]>(INITIAL_EVENTS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newHost, setNewHost] = useState("");
  const [newDate, setNewDate] = useState("2026-06-30");
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newType, setNewType] = useState<any>("Webinar");
  const [newLocation, setNewLocation] = useState("JR Virtual Lobby Room 4");
  const [newDesc, setNewDesc] = useState("");

  // Ticket Modal State
  const [selectedTicket, setSelectedTicket] = useState<EventDetail | null>(null);

  // Broadcast Theater State
  const [activeTheaterRoom, setActiveTheaterRoom] = useState<EventDetail | null>(null);
  const [theaterChat, setTheaterChat] = useState<Array<{ name: string; text: string }>>([
    { name: "John (JKUAT)", text: "This QoS layout is super helpful, thanks Eng Hillary!" },
    { name: "Sylvia (Safaricom)", text: "We will be opening attachments based on this exact packet tracer format." }
  ]);
  const [chatInput, setChatInput] = useState("");

  const handleRegister = (id: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        const isRegistered = !ev.registered;
        return {
          ...ev,
          registered: isRegistered,
          ticketCode: isRegistered ? `JR-TKT-${Math.floor(Math.random() * 8999 + 1000)}` : undefined,
          attendeesCount: ev.attendeesCount + (isRegistered ? 1 : -1)
        };
      }
      return ev;
    }));
  };

  const handleCreateEvent = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvent: EventDetail = {
      id: `ev-${Math.random().toString()}`,
      title: newTitle,
      host: newHost || "JR Scholar",
      date: newDate,
      time: newTime,
      type: newType,
      location: newLocation,
      registered: true,
      ticketCode: `JR-TKT-${Math.floor(Math.random() * 8999 + 1000)}`,
      description: newDesc,
      attendeesCount: 1
    };

    setEvents(prev => [newEvent, ...prev]);
    setShowCreateModal(false);
    
    // reset form
    setNewTitle("");
    setNewDesc("");
    alert("Enterprise Event scheduled successfully! Digital pass created.");
  };

  const handleSendTheaterChat = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setTheaterChat(prev => [...prev, { name: "Me", text: chatInput }]);
    setChatInput("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)]">
      
      {/* Event list (LHS) */}
      <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col h-auto lg:h-full shadow-sm lg:overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={18} />
            <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Engineering & TVET Webinars</h3>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus size={14} /> Schedule Event
          </button>
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 custom-scrollbar">
          {events.map((ev) => (
            <div 
              key={ev.id} 
              className="p-5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                    ev.type === "Webinar" ? "bg-blue-100 text-blue-700" :
                    ev.type === "Hackathon" ? "bg-purple-100 text-purple-700" : "bg-slate-200 text-slate-700"
                  }`}>
                    {ev.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <MapPin size={10} /> {ev.location}
                  </span>
                </div>

                <h4 className="font-bold text-slate-800 text-xs leading-snug">{ev.title}</h4>
                <p className="text-[11px] text-slate-500 font-medium">Host: {ev.host} | Time: {ev.date} @ {ev.time}</p>
                <p className="text-[11px] text-slate-500 line-clamp-2 max-w-xl">{ev.description}</p>
              </div>

              {/* Action columns */}
              <div className="flex items-center gap-2 md:self-center">
                {ev.registered ? (
                  <>
                    <button
                      onClick={() => setSelectedTicket(ev)}
                      className="p-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-150"
                      title="View Digital Pass"
                    >
                      <Ticket size={15} />
                    </button>
                    <button
                      onClick={() => setActiveTheaterRoom(ev)}
                      className="p-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Play size={13} /> Enter Theater
                    </button>
                  </>
                ) : null}

                <button
                  onClick={() => handleRegister(ev.id)}
                  className={`text-xs font-bold px-4 py-2 rounded-lg border transition-colors ${
                    ev.registered 
                      ? "bg-white text-red-600 border-red-200 hover:bg-red-50" 
                      : "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {ev.registered ? "Unregister" : "Register Pass"}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Interactive Theater Simulator Screen (RHS) */}
      <div className="lg:col-span-4 bg-slate-950 text-white border border-slate-900 rounded-2xl p-5 flex flex-col h-auto lg:h-full shadow-lg lg:overflow-hidden justify-between">
        
        {activeTheaterRoom ? (
          <div className="flex flex-col h-full overflow-hidden justify-between">
            {/* Header */}
            <div className="border-b border-slate-800 pb-2.5 mb-2.5">
              <span className="text-[9px] font-bold text-red-500 uppercase font-mono animate-pulse block mb-0.5">● LIVE BROADCAST MODE</span>
              <h4 className="font-bold text-xs truncate text-white">{activeTheaterRoom.title}</h4>
            </div>

            {/* Simulated Speaker screen */}
            <div className="bg-slate-900 border border-slate-800 h-28 rounded-xl flex items-center justify-center relative overflow-hidden mb-3">
              <Activity size={24} className="text-blue-500 animate-pulse" />
              <span className="absolute bottom-1.5 left-1.5 text-[8px] bg-slate-950/80 px-1 py-0.5 rounded font-mono">SPEAKER PANEL: G.711 DEPLOYED</span>
              <span className="absolute top-1.5 right-1.5 text-[8px] bg-blue-600 px-1 py-0.5 rounded font-mono font-bold uppercase tracking-wider text-white">4K Transmit</span>
            </div>

            {/* Chat list */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-3 bg-slate-900/60 p-3 rounded-xl border border-slate-900 custom-scrollbar text-[11px] font-mono text-slate-300">
              {theaterChat.map((c, i) => (
                <div key={i} className="leading-relaxed">
                  <strong className="text-blue-400">{c.name}:</strong> {c.text}
                </div>
              ))}
            </div>

            {/* Chat form */}
            <form onSubmit={handleSendTheaterChat} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Participate in live chat..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 rounded-lg font-bold">
                Send
              </button>
            </form>

            <button 
              onClick={() => setActiveTheaterRoom(null)}
              className="w-full mt-3 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono border border-slate-800 text-slate-400 py-1.5 rounded"
            >
              Close Broadcast Viewport
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
            <Play size={36} className="text-slate-700" />
            <h4 className="font-bold text-xs text-slate-400">Webinar Theater Stream</h4>
            <p className="text-[11px] max-w-xs leading-relaxed">
              Register for any active event on the left pane and click "Enter Theater" to launch the real-time presentation stream.
            </p>
          </div>
        )}

      </div>

      {/* CREATE EVENT MODAL DIALOG */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <h3 className="font-bold text-slate-800 text-sm">Schedule Enterprise Conference</h3>

              <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. TVET Mechatronics Project Pitch"
                    className="w-full border border-slate-350 p-2 rounded-lg"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Host Organizer</label>
                    <input
                      type="text"
                      value={newHost}
                      onChange={(e) => setNewHost(e.target.value)}
                      placeholder="e.g. Dr. Evans Mwangi"
                      className="w-full border border-slate-350 p-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Event Format</label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full border border-slate-350 p-2 rounded-lg bg-white"
                    >
                      <option>Webinar</option>
                      <option>Hackathon</option>
                      <option>Conference</option>
                      <option>Department Meet</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Schedule Date</label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full border border-slate-350 p-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Schedule Time</label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="e.g. 2:00 PM"
                      className="w-full border border-slate-350 p-2 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Virtual Link or physical location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full border border-slate-350 p-2 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brief Description</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={2}
                    className="w-full border border-slate-350 p-2 rounded-lg"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold"
                  >
                    Register and Open
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRINTABLE DIGITAL TICKET PASS DIALOG */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              {/* Ticket Top stub */}
              <div className="bg-slate-900 text-white p-5 text-center relative">
                <span className="text-[8px] font-bold font-mono tracking-widest text-blue-400 block mb-1">JR INVENTO BROADCAST ID</span>
                <h4 className="font-bold text-sm tracking-tight leading-snug">{selectedTicket.title}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-1">Host: {selectedTicket.host}</p>

                {/* Decorative side cuts */}
                <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-slate-400/25"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-slate-400/25"></div>
              </div>

              {/* Ticket bottom stub */}
              <div className="p-5 flex flex-col items-center justify-center space-y-4">
                <div className="text-center font-mono text-[10px] text-slate-600 space-y-0.5">
                  <p>TIME: {selectedTicket.date} @ {selectedTicket.time}</p>
                  <p className="text-slate-400 uppercase">CLASS: UNIFIED ACCESS PASS</p>
                </div>

                {/* Vectorized barcode mockup */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg flex flex-col items-center justify-center space-y-1 w-full max-w-[200px]">
                  {/* barcode stripes */}
                  <div className="h-10 w-full flex gap-[1.5px] items-stretch">
                    <div className="w-1 bg-slate-800"></div>
                    <div className="w-0.5 bg-slate-800"></div>
                    <div className="w-2 bg-slate-800"></div>
                    <div className="w-1 bg-slate-800"></div>
                    <div className="w-0.5 bg-slate-800"></div>
                    <div className="w-1 bg-slate-800"></div>
                    <div className="w-1.5 bg-slate-800"></div>
                    <div className="w-0.5 bg-slate-800"></div>
                    <div className="w-2 bg-slate-800"></div>
                    <div className="w-1 bg-slate-800"></div>
                  </div>
                  <span className="font-mono text-[9px] tracking-widest text-slate-500">{selectedTicket.ticketCode}</span>
                </div>

                <div className="flex gap-2.5 w-full">
                  <button
                    onClick={() => alert("Digital pass sent to your registered smartphone wallet.")}
                    className="flex-1 bg-slate-900 text-white font-bold text-xs py-2 rounded-lg"
                  >
                    Send to Wallet
                  </button>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="bg-slate-100 text-slate-600 border border-slate-200 text-xs px-4 py-2 rounded-lg font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
