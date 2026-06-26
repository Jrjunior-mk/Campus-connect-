import React, { useState } from "react";
import { motion } from "motion/react";
import { OnboardingProfile, KENYAN_INSTITUTIONS } from "../types";
import { Sparkles, ArrowRight, ArrowLeft, GraduationCap, Laptop, Compass, Heart } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: OnboardingProfile, recommendations: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function Onboarding({ onComplete, isLoading, setIsLoading }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingProfile>({
    academicBackground: "Undergraduate Student",
    institution: "University of Nairobi (UoN)",
    course: "B.Sc. Electrical & Information Engineering",
    department: "School of Engineering",
    skills: "React, Cisco Networking, Python",
    careerInterests: "Cloud Systems, Telecom Engineering",
    locationPreferences: "Nairobi (Hybrid)",
    researchInterests: "Internet of Things & Smart Grids",
    industryInterests: "Telecommunication Systems",
    eventInterests: "Hackathons, Technical Webinars"
  });

  const totalSteps = 4;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini/profile-onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: formData })
      });
      const data = await response.json();
      onComplete(formData, data);
    } catch (error) {
      console.error("Onboarding analysis failed, loading standard recommendations:", error);
      // Fallback response handled locally
      onComplete(formData, null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-12 p-1 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">JR INVENTO Onboarding</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">STEP {step} OF {totalSteps}: INTUITIVE AI PROFILING</p>
            </div>
            <Sparkles className="text-blue-500 animate-pulse" size={28} />
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-6 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              className="bg-blue-600 h-full rounded-full"
            ></motion.div>
          </div>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <h3 className="text-lg font-bold text-slate-800 mt-5">Analyzing with JR INVENTO AI</h3>
              <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
                We are building your custom-tailored dashboard recommendations for engineering groups, research hubs, and attachments across Kenya.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              
              {/* STEP 1: Academic Background */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2 border-b border-slate-100 pb-3">
                    <GraduationCap className="text-blue-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-800">Academic Foundations</h3>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Academic Status</label>
                    <select
                      name="academicBackground"
                      value={formData.academicBackground}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none"
                    >
                      <option>Undergraduate Student</option>
                      <option>TVET/Diploma Candidate</option>
                      <option>Postgraduate Researcher</option>
                      <option>Professional Engineer</option>
                      <option>Technical Instructor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Institution / Polytechnic</label>
                    <select
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none"
                    >
                      {KENYAN_INSTITUTIONS.map((inst, index) => (
                        <option key={index}>{inst.name}</option>
                      ))}
                      <option>Other Kenyan TVET / College</option>
                      <option>International Institution</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Course of Study</label>
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        placeholder="e.g. Mechatronics Engineering"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Department / Faculty</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="e.g. Electrical Engineering"
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Technical Skills & Career */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2 border-b border-slate-100 pb-3">
                    <Laptop className="text-blue-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-800">Skills & Career Trajectory</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Technical Skills (Comma Separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      placeholder="e.g. Cisco Routing, PCB Layout, Node.js, CAD"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Career Interests / Desired Roles</label>
                    <input
                      type="text"
                      name="careerInterests"
                      value={formData.careerInterests}
                      onChange={handleInputChange}
                      placeholder="e.g. Telecom Solutions Architect, Embedded Dev"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Location Preferences</label>
                    <select
                      name="locationPreferences"
                      value={formData.locationPreferences}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none"
                    >
                      <option>Nairobi (Hybrid)</option>
                      <option>Nairobi (On-site)</option>
                      <option>Mombasa / Coastal Region</option>
                      <option>Kisumu / Western Region</option>
                      <option>Rift Valley / Eldoret</option>
                      <option>Remote (International)</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Research & Industry */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2 border-b border-slate-100 pb-3">
                    <Compass className="text-blue-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-800">Research & Inventions</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Research / Innovation Interests</label>
                    <input
                      type="text"
                      name="researchInterests"
                      value={formData.researchInterests}
                      onChange={handleInputChange}
                      placeholder="e.g. Smart Grids, 5G Network slices, Autonomous IoT"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Primary Target Industry</label>
                    <input
                      type="text"
                      name="industryInterests"
                      value={formData.industryInterests}
                      onChange={handleInputChange}
                      placeholder="e.g. Telecommunications, Smart Agriculture, Clean Energy"
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Campus Events */}
              {step === 4 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                  <div className="flex items-center gap-3 mb-2 border-b border-slate-100 pb-3">
                    <Heart className="text-blue-600" size={24} />
                    <h3 className="text-lg font-semibold text-slate-800">Engagement & Community</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Campus Events Interests</label>
                    <select
                      name="eventInterests"
                      value={formData.eventInterests}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-slate-50 focus:border-blue-500 focus:bg-white focus:outline-none"
                    >
                      <option>Hackathons & Competitions</option>
                      <option>Technical Webinars & Masterclasses</option>
                      <option>Recruiting Days & Professional Panels</option>
                      <option>Academic Defense & Peer Presentations</option>
                    </select>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mt-4">
                    <p className="text-xs text-slate-600 font-sans leading-relaxed">
                      By completing onboarding, the JR INVENTO AI compiler will construct secure pathways to analyze your credentials, map regional Kenyan student networks, and auto-generate specialized VoIP conference permissions tailored to your department.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ArrowLeft size={16} /> Previous
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md transition-colors"
                >
                  {step === totalSteps ? "Generate AI Ecosystem" : "Next Segment"} <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
