import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Map, MapPin, Compass, Navigation, Send, ShieldAlert, CheckCircle, Activity, Search } from "lucide-react";

interface OpportunityPin {
  id: string;
  name: string;
  lat: number; // grid Y
  lng: number; // grid X
  type: "University" | "TVET" | "Company" | "Event";
  details: string;
}

const MAP_PINS: OpportunityPin[] = [
  { id: "uon", name: "University of Nairobi (UoN)", lat: 180, lng: 220, type: "University", details: "Main Campus Engineering Lab, Nairobi Center" },
  { id: "jkuat", name: "JKUAT Juja Campus", lat: 80, lng: 420, type: "University", details: "Telecommunication and Research Center, Juja" },
  { id: "kabete", name: "The Kabete National Polytechnic", lat: 210, lng: 90, type: "TVET", details: "Robotics Fabrication Lab, Kabete" },
  { id: "safaricom", name: "Safaricom HQ", lat: 290, lng: 310, type: "Company", details: "Cloud Architecture Center, Waiyaki Way" },
  { id: "telkom", name: "Telkom Kenya Gate", lat: 230, lng: 250, type: "Company", details: "VoIP Trunk Switching Station, City Center" },
  { id: "ieee-event", name: "IEEE Annual Hackathon Site", lat: 140, lng: 280, type: "Event", details: "Main Conference Hall" }
];

export default function MapNavigation() {
  const [selectedPin, setSelectedPin] = useState<OpportunityPin | null>(MAP_PINS[0]);
  const [startNode, setStartNode] = useState("kabete");
  const [endNode, setEndNode] = useState("safaricom");
  const [isRouting, setIsRouting] = useState(false);
  const [gpsSimulating, setGpsSimulating] = useState(false);
  const [gpsProgress, setGpsProgress] = useState(0);
  const [emergencyAlert, setEmergencyAlert] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const startPin = MAP_PINS.find(p => p.id === startNode) || MAP_PINS[0];
  const endPin = MAP_PINS.find(p => p.id === endNode) || MAP_PINS[3];

  // GPS Simulation Loop
  useEffect(() => {
    let interval: any;
    if (gpsSimulating) {
      interval = setInterval(() => {
        setGpsProgress(prev => {
          if (prev >= 100) {
            setGpsSimulating(false);
            return 100;
          }
          return prev + 5;
        });
      }, 200);
    } else {
      setGpsProgress(0);
    }
    return () => clearInterval(interval);
  }, [gpsSimulating]);

  const handlePlotRoute = () => {
    setIsRouting(true);
    setGpsProgress(0);
    setGpsSimulating(false);
  };

  const handleSimulateGps = () => {
    if (!isRouting) return;
    setGpsSimulating(true);
    setGpsProgress(0);
  };

  // Coordinate interpolator for GPS simulation
  const getGpsCoords = () => {
    const fraction = gpsProgress / 100;
    const x = startPin.lng + (endPin.lng - startPin.lng) * fraction;
    const y = startPin.lat + (endPin.lat - startPin.lat) * fraction;
    return { x, y };
  };

  const gpsCoords = getGpsCoords();

  const filteredPins = MAP_PINS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)]">
      
      {/* Route planning drawer (LHS) */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col h-full shadow-sm justify-between">
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Compass className="text-blue-600" size={20} />
            <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Smart Campus Router</h3>
          </div>

          {/* Location Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Kenya campuses/companies..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          {/* Route Config */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Departure Station</label>
              <select
                value={startNode}
                onChange={(e) => { setStartNode(e.target.value); setIsRouting(false); }}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:outline-none"
              >
                {MAP_PINS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Destination Hub</label>
              <select
                value={endNode}
                onChange={(e) => { setEndNode(e.target.value); setIsRouting(false); }}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:outline-none"
              >
                {MAP_PINS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              <button
                onClick={handlePlotRoute}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Navigation size={13} />
                <span>Calculate Vector Route</span>
              </button>
            </div>
          </div>

          {/* Navigation GPS status */}
          {isRouting && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-900">
                <Activity size={14} className="text-blue-600 animate-pulse" />
                <span>Path Optimization Calculated</span>
              </div>
              <p className="text-slate-600">
                Vector Distance: <strong className="text-slate-900">{(Math.hypot(endPin.lng - startPin.lng, endPin.lat - startPin.lat) * 0.15).toFixed(1)} km</strong>
              </p>
              <p className="text-slate-600">
                Suggested Speed: <strong className="text-slate-900">45 km/h (Optimal QoS latency routing)</strong>
              </p>

              <button
                onClick={handleSimulateGps}
                disabled={gpsSimulating}
                className="w-full bg-slate-800 text-white hover:bg-slate-700 text-[11px] font-bold py-2 rounded-lg mt-1 disabled:opacity-50"
              >
                {gpsSimulating ? "GPS tracking moving..." : "Simulate Live GPS Travel"}
              </button>
            </div>
          )}

          {/* Selected Pin Profile Panel */}
          {selectedPin && (
            <div className="border border-slate-150 p-4 rounded-xl bg-white shadow-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                  selectedPin.type === "University" ? "bg-purple-100 text-purple-700" :
                  selectedPin.type === "TVET" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                  {selectedPin.type}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">ID: {selectedPin.id.toUpperCase()}</span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs">{selectedPin.name}</h4>
              <p className="text-[11px] text-slate-600">{selectedPin.details}</p>
            </div>
          )}
        </div>

        {/* Emergency Alert framework */}
        <div className="border-t border-slate-100 pt-4 mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Safety & Broadcast Controls</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <button
            onClick={() => setEmergencyAlert(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-600/10"
          >
            <ShieldAlert size={14} />
            <span>Broadcast Emergency Location</span>
          </button>

          {emergencyAlert && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-800 flex items-start gap-2"
            >
              <CheckCircle size={14} className="text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Encrypted Coordinates Broadcasted!</p>
                <p className="mt-0.5 text-slate-600 font-mono">
                  Coordinates: lat: {gpsCoords.y.toFixed(4)}, lng: {gpsCoords.x.toFixed(4)} dispatched to local campus security and ambulance logs.
                </p>
                <button onClick={() => setEmergencyAlert(false)} className="mt-1 font-bold text-blue-600 hover:underline">
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </div>

      </div>

      {/* SVG Interactive Map (RHS) */}
      <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-lg">
        
        {/* Map Watermark & Coordinates */}
        <div className="absolute top-4 left-4 font-mono text-[10px] text-slate-500 space-y-0.5 z-10 pointer-events-none">
          <p className="font-bold text-slate-400">JR INVENTO DIGITAL TWIN GRID</p>
          <p>REGION: NAIROBI METROPOLITAN AREA</p>
          <p>DATUM: ARC 1960 / UT ZONE 37S</p>
        </div>

        {/* Dynamic Map canvas wrapper */}
        <div className="w-full h-full min-h-[400px] flex items-center justify-center relative p-4">
          <svg 
            viewBox="0 0 500 400" 
            className="w-full h-full max-h-[500px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Simulated Geographic Road Network Pathways (Kenyan Highways) */}
            {/* Waiyaki Way */}
            <path d="M 50 120 Q 200 240 310 290" fill="none" stroke="#334155" strokeWidth="3" strokeDasharray="5,5" />
            {/* Thika Highway */}
            <path d="M 220 180 L 420 80" fill="none" stroke="#334155" strokeWidth="4" />
            {/* Jogoo Road */}
            <path d="M 220 180 L 310 310" fill="none" stroke="#334155" strokeWidth="2.5" />
            
            {/* Route path tracing */}
            {isRouting && (
              <motion.path
                d={`M ${startPin.lng} ${startPin.lat} L ${endPin.lng} ${endPin.lat}`}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDasharray: "1000", strokeDashoffset: "1000" }}
                animate={{ strokeDashoffset: "0" }}
                transition={{ duration: 1 }}
              />
            )}

            {/* Map Pin Elements */}
            {filteredPins.map((pin) => {
              const isSelected = selectedPin?.id === pin.id;
              const isStart = pin.id === startNode;
              const isEnd = pin.id === endNode;

              let color = "#a855f7"; // University (purple)
              if (pin.type === "TVET") color = "#f59e0b"; // TVET (amber)
              if (pin.type === "Company") color = "#10b981"; // Company (emerald)
              if (pin.type === "Event") color = "#3b82f6"; // Event (blue)

              return (
                <g 
                  key={pin.id} 
                  className="cursor-pointer"
                  onClick={() => setSelectedPin(pin)}
                >
                  {/* Outer circle pulse */}
                  {isSelected && (
                    <circle cx={pin.lng} cy={pin.lat} r="18" fill={color} fillOpacity="0.15" className="animate-pulse" />
                  )}

                  {/* Pin Circle */}
                  <circle 
                    cx={pin.lng} 
                    cy={pin.lat} 
                    r={isSelected ? "9" : "6"} 
                    fill={color} 
                    stroke="#0f172a" 
                    strokeWidth="1.5"
                    className="transition-all"
                  />

                  {/* Route Role Highlights */}
                  {isRouting && isStart && (
                    <rect x={pin.lng - 16} y={pin.lat - 24} width="32" height="12" rx="3" fill="#ef4444" />
                  )}
                  {isRouting && isStart && (
                    <text x={pin.lng} y={pin.lat - 15} fill="white" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">START</text>
                  )}

                  {isRouting && isEnd && (
                    <rect x={pin.lng - 14} y={pin.lat - 24} width="28" height="12" rx="3" fill="#10b981" />
                  )}
                  {isRouting && isEnd && (
                    <text x={pin.lng} y={pin.lat - 15} fill="white" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">END</text>
                  )}

                  {/* Label */}
                  <text 
                    x={pin.lng} 
                    y={pin.lat + 18} 
                    fill={isSelected ? "#ffffff" : "#94a3b8"} 
                    fontSize="8" 
                    fontWeight={isSelected ? "bold" : "normal"}
                    textAnchor="middle" 
                    fontFamily="monospace"
                  >
                    {pin.name.split(" ")[0]}
                  </text>
                </g>
              );
            })}

            {/* GPS Live simulated dot */}
            {gpsSimulating && (
              <g>
                <circle cx={gpsCoords.x} cy={gpsCoords.y} r="8" fill="#ef4444" fillOpacity="0.4" />
                <circle cx={gpsCoords.x} cy={gpsCoords.y} r="4" fill="#ef4444" stroke="white" strokeWidth="1" />
              </g>
            )}

          </svg>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 right-4 bg-slate-950/80 border border-slate-800 p-3 rounded-xl flex items-center gap-4 text-[10px] font-mono text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>University</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>TVET</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Enterprise</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Event</span>
          </div>
        </div>

      </div>

    </div>
  );
}
