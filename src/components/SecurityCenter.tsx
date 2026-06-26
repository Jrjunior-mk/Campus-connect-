import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Lock, Fingerprint, Smartphone, CheckSquare, EyeOff, Check, RotateCw, AlertTriangle } from "lucide-react";

export default function SecurityCenter() {
  const [e2eEnabled, setE2eEnabled] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricSuccess, setBiometricSuccess] = useState(false);
  const [isFingerPlaced, setIsFingerPlaced] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);

  // Real-Time MFA verification state variables
  const [mfaMethod, setMfaMethod] = useState<"sms" | "email">("sms");
  const [phoneNumber, setPhoneNumber] = useState("+254 712 345 678");
  const [emailAddress, setEmailAddress] = useState("ragotjohn25@gmail.com");
  const [verificationSent, setVerificationSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [expectedOtp, setExpectedOtp] = useState("");
  const [mfaStatusMsg, setMfaStatusMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [timerCount, setTimerCount] = useState(0);

  // Active Device sessions list
  const [devices, setDevices] = useState([
    { id: "dev1", name: "Chrome on Linux (Ubuntu)", location: "Nairobi, KE", active: true, time: "Current Session" },
    { id: "dev2", name: "JR App on Tecno Camon 20", location: "Juja, KE", active: false, time: "2 hours ago" },
    { id: "dev3", name: "Safari on Apple iPad", location: "Mombasa, KE", active: false, time: "Yesterday" }
  ]);

  // Privacy consents checklist
  const [consents, setConsents] = useState([
    { id: "c1", label: "Allow call recordings for AI summarizing summaries", checked: true },
    { id: "c2", label: "Share geolocated coordinates for emergency campus navigation", checked: true },
    { id: "c3", label: "Sync portfolio repos for career opportunity matches", checked: false },
    { id: "c4", label: "Agree to Kenya Data Protection Act 2019 & GDPR policies", checked: true }
  ]);

  const handleToggleConsent = (id: string) => {
    setConsents(prev => prev.map(c => c.id === id ? { ...c, checked: !c.checked } : c));
  };

  const handleRevokeDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    alert("Session revoked successfully.");
  };

  const handleScanBiometrics = () => {
    setBiometricScanning(true);
    setBiometricSuccess(false);
    setScanProgress(0);
    setScanError(null);
  };

  useEffect(() => {
    let interval: any = null;
    if (biometricScanning && isFingerPlaced) {
      setScanError(null);
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setBiometricSuccess(true);
            setBiometricScanning(false);
            setIsFingerPlaced(false);
            return 100;
          }
          return prev + 5;
        });
      }, 70);
    } else if (biometricScanning && !isFingerPlaced && scanProgress > 0 && scanProgress < 100) {
      setScanError("⚠️ Finger removed too early! Hold continuous contact with the sensor to verify.");
      setScanProgress(0);
    }
    return () => clearInterval(interval);
  }, [biometricScanning, isFingerPlaced, scanProgress]);

  // Dispatch secure OTP to Phone or Email
  const handleSendMfaCode = () => {
    if (mfaMethod === "sms" && !phoneNumber.trim()) {
      setMfaStatusMsg({ type: "error", text: "Please enter a valid Kenyan phone number." });
      return;
    }
    if (mfaMethod === "email" && !emailAddress.trim()) {
      setMfaStatusMsg({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setMfaStatusMsg({ type: "info", text: "Dispatching secure authentication code..." });
    
    // Generate a beautiful mock 6-digit pin code
    const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(generatedPin);

    setTimeout(() => {
      setVerificationSent(true);
      setMfaStatusMsg({ 
        type: "success", 
        text: mfaMethod === "sms" 
          ? `[SIMULATION ONLY] SMS OTP sent to device at ${phoneNumber}! Enter Pin Code: ${generatedPin}`
          : `[SIMULATION ONLY] Email OTP dispatched to ${emailAddress}! Enter Pin Code: ${generatedPin}`
      });
      setTimerCount(60);
    }, 1200);
  };

  // Verification helper
  const handleVerifyOtp = () => {
    if (otpValue === expectedOtp) {
      setMfaEnabled(true);
      setMfaStatusMsg({ type: "success", text: `Verification successful! MFA is now active via your secure device.` });
      setVerificationSent(false);
      setOtpValue("");
    } else {
      setMfaStatusMsg({ type: "error", text: "Incorrect 6-digit pin code. Please retry or request a new code." });
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (timerCount > 0) {
      interval = setInterval(() => {
        setTimerCount(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerCount]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar p-1">
      
      {/* LHS Encryption & Auth Settings */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Shield className="text-blue-600" size={18} />
          <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Security Shield</h3>
        </div>

        {/* E2E Toggle */}
        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
              <Lock size={14} className="text-blue-600" />
              <span>End-to-End Encryption (E2EE)</span>
            </div>
            <button
              onClick={() => setE2eEnabled(!e2eEnabled)}
              className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none ${
                e2eEnabled ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                e2eEnabled ? "translate-x-5" : "translate-x-0"
              }`}></div>
            </button>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Encrypts voice notes, private chats, and real-time SIP VoIP payloads on the client using AES-GCM 256. Intermediary routers cannot decode the signaling packets.
          </p>
        </div>

        {/* Biometrics Simulator */}
        <div className="space-y-3">
          <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide">Biometric Fingerprint Authentication</h4>
          <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
            
            {/* 1. IDLE STATE */}
            {!biometricScanning && !biometricSuccess && (
              <div className="space-y-3 w-full flex flex-col items-center">
                <div className="p-4 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                  <Fingerprint size={32} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-750">Fingerprint Scanner Ready</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Sensor Status: OFFLINE</p>
                </div>
                <button
                  type="button"
                  onClick={handleScanBiometrics}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 animate-pulse"
                >
                  Initialize Biometric Scanner
                </button>
              </div>
            )}

            {/* 2. ACTIVE SCANNING STATE */}
            {biometricScanning && (
              <div className="space-y-3.5 w-full flex flex-col items-center">
                <p className="text-xs font-bold text-slate-750 uppercase tracking-wider font-mono">
                  {isFingerPlaced ? "⚡ Contact Established" : "🔴 Waiting for Finger Placement"}
                </p>

                {/* Simulated Finger Touch/Hold Pad */}
                <button
                  type="button"
                  onMouseDown={() => setIsFingerPlaced(true)}
                  onMouseUp={() => setIsFingerPlaced(false)}
                  onMouseLeave={() => setIsFingerPlaced(false)}
                  onTouchStart={() => setIsFingerPlaced(true)}
                  onTouchEnd={() => setIsFingerPlaced(false)}
                  className={`p-6 rounded-full transition-all cursor-pointer select-none relative overflow-hidden ring-offset-2 focus:outline-none ${
                    isFingerPlaced 
                      ? "bg-blue-600 text-white scale-110 ring-4 ring-blue-400 animate-pulse shadow-lg shadow-blue-500/20" 
                      : "bg-blue-50 text-blue-600 ring-2 ring-blue-200 hover:bg-blue-100/80 animate-bounce"
                  } border border-blue-200`}
                >
                  <Fingerprint size={40} />
                  {isFingerPlaced && (
                    <span className="absolute inset-0 bg-white/20 animate-ping rounded-full"></span>
                  )}
                </button>

                <div className="w-full space-y-2 px-4">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                    <span>{isFingerPlaced ? "SCANNING PULSE..." : "TOUCH & HOLD PAD"}</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-75" 
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    {isFingerPlaced 
                      ? "Keep pressing steady! Syncing digital fingerprint signature to Secure Enclave..." 
                      : "Click and HOLD down on the fingerprint pad to simulate sensor contact."}
                  </p>
                </div>
              </div>
            )}

            {/* 3. VERIFIED SUCCESS STATE */}
            {biometricSuccess && (
              <div className="space-y-3 w-full flex flex-col items-center">
                <div className="p-4 rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50 border border-emerald-200">
                  <Check size={32} className="stroke-[3]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-750">Biometric Identity Verified!</p>
                  <p className="text-[10px] text-emerald-600 font-mono mt-0.5">Secure Enclave: EC_P256_ACTIVE</p>
                </div>
                <div className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-3 py-1.5 rounded-xl font-mono w-full break-all">
                  SHA-256 Hash Match: 0x8a92f08e5a7bcf1e...91c2
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setBiometricSuccess(false);
                    setScanProgress(0);
                  }}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer pt-1"
                >
                  Test/Scan Another Fingerprint
                </button>
              </div>
            )}

            {/* ERROR / FEEDBACK ALERT */}
            {scanError && (
              <div className="w-full text-[10px] bg-red-50 border border-red-150 text-red-700 p-2.5 rounded-xl text-left leading-relaxed font-normal">
                {scanError}
              </div>
            )}

          </div>
        </div>

        {/* Real-Time Interactive MFA verification */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wide">Multi-Factor Authentication (MFA)</h4>
            <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
              mfaEnabled ? "bg-emerald-50 border border-emerald-100 text-emerald-700" : "bg-slate-100 border border-slate-200 text-slate-500"
            }`}>
              {mfaEnabled ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3.5">
            {/* Method Picker */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setMfaMethod("sms"); setVerificationSent(false); }}
                className={`p-2.5 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mfaMethod === "sms"
                    ? "bg-white border-blue-500 text-blue-700 shadow-sm"
                    : "bg-slate-100/50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Smartphone size={13} />
                <span>SMS Mobile Code</span>
              </button>
              <button
                type="button"
                onClick={() => { setMfaMethod("email"); setVerificationSent(false); }}
                className={`p-2.5 text-center rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mfaMethod === "email"
                    ? "bg-white border-blue-500 text-blue-700 shadow-sm"
                    : "bg-slate-100/50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Lock size={13} />
                <span>Email Code</span>
              </button>
            </div>

            {/* Input fields based on selected method */}
            {mfaMethod === "sms" ? (
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-600 font-mono uppercase">Your Safaricom/Telkom Mobile Number</label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="+254 7XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={verificationSent}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-250 rounded-xl focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleSendMfaCode}
                    disabled={timerCount > 0}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {timerCount > 0 ? `Retry in ${timerCount}s` : "Send OTP"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-600 font-mono uppercase">Academic or Private Email Address</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="ragotjohn25@gmail.com"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    disabled={verificationSent}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-250 rounded-xl focus:outline-none focus:border-blue-500 disabled:bg-slate-100"
                  />
                  <button
                    type="button"
                    onClick={handleSendMfaCode}
                    disabled={timerCount > 0}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {timerCount > 0 ? `Retry in ${timerCount}s` : "Send Link"}
                  </button>
                </div>
              </div>
            )}

            {/* Status alerts */}
            {mfaStatusMsg && (
              <div className={`p-3 rounded-xl border text-xs leading-relaxed font-normal ${
                mfaStatusMsg.type === "success" ? "bg-emerald-50 border-emerald-150 text-emerald-800" :
                mfaStatusMsg.type === "error" ? "bg-red-50 border-red-150 text-red-800" :
                "bg-blue-50 border-blue-150 text-blue-800"
              }`}>
                {mfaStatusMsg.text}
              </div>
            )}

            {/* OTP entry field */}
            {verificationSent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pt-2 border-t border-slate-200/60 space-y-2.5"
              >
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600 font-mono uppercase">Enter 6-Digit Pin Code Received</label>
                  <p className="text-[10px] text-slate-400">A security callback was triggered to ensure device alignment.</p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    className="flex-1 text-center text-xs tracking-widest font-mono font-bold px-3 py-2 bg-white border border-slate-250 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Verify PIN
                  </button>
                </div>
              </motion.div>
            )}

            {/* Enable/Disable Master Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-150 text-xs">
              <div>
                <p className="font-bold text-slate-800">MFA Override Toggle</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Quick master toggle to activate/deactivate MFA</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMfaEnabled(!mfaEnabled);
                  setMfaStatusMsg(null);
                  setVerificationSent(false);
                }}
                className={`w-11 h-6 rounded-full p-1 transition-colors focus:outline-none cursor-pointer ${
                  mfaEnabled ? "bg-slate-900" : "bg-slate-300"
                }`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  mfaEnabled ? "translate-x-5" : "translate-x-0"
                }`}></div>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* RHS Devices list & GDPR/Kenya Protection Act Audit */}
      <div className="lg:col-span-7 flex flex-col gap-6 h-full">
        
        {/* Active Devices */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="text-blue-600" size={18} />
              <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Authorized Device Enclave</h3>
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-400">Total: {devices.length}</span>
          </div>

          <div className="space-y-3">
            {devices.map((dev) => (
              <div key={dev.id} className="p-3.5 border border-slate-150 rounded-xl flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-200 text-slate-600 flex items-center justify-center font-bold font-mono text-[10px]">
                    {dev.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">{dev.name}</h5>
                    <p className="text-[10px] text-slate-500 font-mono">Location: {dev.location} | {dev.time}</p>
                  </div>
                </div>

                {!dev.active && (
                  <button
                    onClick={() => handleRevokeDevice(dev.id)}
                    className="text-[10px] font-bold text-red-600 hover:underline"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Kenya Protection Act & GDPR Compliance Checklist */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
            <CheckSquare className="text-blue-600" size={18} />
            <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Data Privacy Consent Logs</h3>
          </div>

          <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
            In compliance with the <strong>Kenya Data Protection Act 2019</strong> and <strong>GDPR guidelines</strong>, you hold absolute authority over what telemetry logs are registered inside the platform. Audit or revoke consents below.
          </p>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {consents.map((con) => (
              <button
                key={con.id}
                onClick={() => handleToggleConsent(con.id)}
                className="w-full text-left p-3.5 border rounded-xl flex items-start gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center ${
                  con.checked ? "bg-slate-900 border-slate-900 text-white" : "border-slate-300"
                }`}>
                  {con.checked && <Check size={10} />}
                </div>
                <span className="text-xs text-slate-700 font-semibold leading-relaxed">
                  {con.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Audit status: SECURELY ACCREDITED</span>
            <span className="text-emerald-500 font-bold">COMPLIANCE MET</span>
          </div>
        </div>

      </div>

    </div>
  );
}
