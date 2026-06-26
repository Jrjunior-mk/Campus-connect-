import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, Mail, Shield, Sparkles, Fingerprint, Eye, EyeOff, CheckCircle2, UserCheck } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (email: string, userName: string, customBio?: string, customAvatar?: string) => void;
  onGoToRegister: () => void;
}

export default function Login({ onLoginSuccess, onGoToRegister }: LoginProps) {
  const [email, setEmail] = useState("ragotjohn25@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"credentials" | "biometric">("credentials");

  // Biometric login simulation state
  const [bioScanning, setBioScanning] = useState(false);
  const [bioFingerPlaced, setBioFingerPlaced] = useState(false);
  const [bioProgress, setBioProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please specify your email address.");
      return;
    }
    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      // Log in with pre-determined profile details or defaults
      onLoginSuccess(
        email, 
        email === "ragotjohn25@gmail.com" ? "John Ragot" : email.split("@")[0],
        email === "ragotjohn25@gmail.com" ? "B.Sc. Telecommunication & Information Engineering scholar at University of Nairobi, specializing in Cisco Enterprise VoIP and IoT systems development." : "Student Innovator"
      );
    }, 1000);
  };

  const startBiometricScan = () => {
    setBioScanning(true);
    setBioProgress(0);
    setError(null);
  };

  const handleFingerTouch = () => {
    setBioFingerPlaced(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setBioProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setBioScanning(false);
        setBioFingerPlaced(false);
        onLoginSuccess(
          "ragotjohn25@gmail.com", 
          "John Ragot",
          "B.Sc. Telecommunication & Information Engineering scholar at University of Nairobi, specializing in Cisco Enterprise VoIP and IoT systems development."
        );
      }
    }, 120);

    // Save interval id to stop on release if needed
    (window as any)._bioInterval = interval;
  };

  const handleFingerRelease = () => {
    if (bioFingerPlaced && bioProgress < 100) {
      clearInterval((window as any)._bioInterval);
      setBioFingerPlaced(false);
      setBioProgress(0);
      setError("⚠️ Biometric contact severed too early. Hold your finger down on the sensor.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" id="login-module-container">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Banner Section */}
        <div className="bg-slate-900 p-8 text-white relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-36 h-36 bg-blue-600/20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-emerald-500/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-2xl tracking-wider text-white shadow-lg shadow-blue-500/20 mb-3">
              JR
            </div>
            <h2 className="text-xl font-bold tracking-tight">JR INVENTO</h2>
            <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-widest">
              Secure Gateway Authentication
            </p>
          </div>
        </div>

        {/* Form Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <button
            id="tab-credentials-login"
            type="button"
            onClick={() => { setAuthMode("credentials"); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold font-mono uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
              authMode === "credentials"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            Password Key
          </button>
          <button
            id="tab-biometric-login"
            type="button"
            onClick={() => { setAuthMode("biometric"); setError(null); }}
            className={`flex-1 py-3 text-xs font-bold font-mono uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
              authMode === "biometric"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900"
                : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            Fingerprint Touch
          </button>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="p-3 text-xs bg-red-50 dark:bg-red-950/20 border border-red-150 dark:border-red-900/50 text-red-700 dark:text-red-400 rounded-xl leading-relaxed">
              {error}
            </div>
          )}

          {authMode === "credentials" ? (
            <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
              {/* Email field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                  Academic / Scholar Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail size={14} />
                  </span>
                  <input
                    id="login-email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ragotjohn25@gmail.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-150 transition-colors interactive-input"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-wider">
                    Enter Security Passcode
                  </label>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock size={14} />
                  </span>
                  <input
                    id="login-password-input"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-150 transition-colors interactive-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 btn-interactive"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-button"
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2 btn-press"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Synchronizing Server Keys...</span>
                  </>
                ) : (
                  <>
                    <UserCheck size={14} />
                    <span>Authorize Secure Session</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Biometric Verification Login */
            <div className="space-y-5 text-center flex flex-col items-center py-2" id="login-biometric-container">
              {!bioScanning ? (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800">
                    <Fingerprint size={44} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Biometric Sensor Standby</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Secure Enclave Ready</p>
                  </div>
                  <button
                    id="btn-initiate-bio-login"
                    type="button"
                    onClick={startBiometricScan}
                    className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Scan Fingerprint to Login
                  </button>
                </div>
              ) : (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <p className="text-xs font-bold text-slate-750 dark:text-slate-350 uppercase tracking-wider font-mono animate-pulse">
                    {bioFingerPlaced ? "⚡ Sensor Contact Syncing" : "🔴 Hold Finger on Pad Below"}
                  </p>

                  <button
                    id="btn-fingerprint-sensor-pad"
                    type="button"
                    onMouseDown={handleFingerTouch}
                    onMouseUp={handleFingerRelease}
                    onMouseLeave={handleFingerRelease}
                    onTouchStart={handleFingerTouch}
                    onTouchEnd={handleFingerRelease}
                    className={`p-7 rounded-full transition-all cursor-pointer select-none relative overflow-hidden ring-offset-2 focus:outline-none ${
                      bioFingerPlaced 
                        ? "bg-blue-600 text-white scale-110 ring-4 ring-blue-400 animate-pulse shadow-lg shadow-blue-500/20" 
                        : "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-200 dark:ring-blue-900 hover:bg-blue-100/80"
                    } border border-blue-200 dark:border-blue-900`}
                  >
                    <Fingerprint size={48} />
                    {bioFingerPlaced && (
                      <span className="absolute inset-0 bg-white/20 animate-ping rounded-full"></span>
                    )}
                  </button>

                  <div className="w-full space-y-2 px-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold">
                      <span>{bioFingerPlaced ? "COMMUNICATING..." : "TAP & HOLD SCANNER"}</span>
                      <span>{bioProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full transition-all duration-75" 
                        style={{ width: `${bioProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      Hold contact on fingerprint scanner to let the secure enclave map your digital identity.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              New Scholar to JR INVENTO?{" "}
              <button
                id="btn-go-to-register"
                type="button"
                onClick={onGoToRegister}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Onboard Profile
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
