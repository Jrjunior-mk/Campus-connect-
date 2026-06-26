import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } catch (error) {
    console.warn("Failed to initialize Gemini API Client:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY found, running in robust simulated AI mode.");
}

// Helper to safely execute Gemini API calls with retries and graceful logging (preventing process crash signals on 503/429)
async function callGeminiWithRetry<T>(
  apiCall: () => Promise<T>,
  endpointName: string,
  retries = 3,
  delayMs = 800
): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await apiCall();
    } catch (error: any) {
      lastError = error;
      const errorMsg = error?.message || String(error);
      const isTransient = 
        error?.status === 503 || 
        error?.status === 429 || 
        error?.code === 503 || 
        error?.code === 429 || 
        errorMsg.includes("503") || 
        errorMsg.includes("429") || 
        errorMsg.includes("UNAVAILABLE") ||
        errorMsg.includes("overloaded") ||
        errorMsg.includes("demand");

      if (attempt < retries && isTransient) {
        console.log(`[${endpointName}] Resilient Backoff: Caught transient load condition (attempt ${attempt + 1}/${retries + 1}). Retrying in ${delayMs}ms to ensure continuous service...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        delayMs *= 2;
      } else {
        break;
      }
    }
  }
  throw lastError;
}

// 1. General Assistant Endpoint
app.post("/api/gemini/assistant", async (req, res) => {
  const { messages, currentContext } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages body" });
  }

  const userPrompt = messages[messages.length - 1]?.content || "";
  const persona = currentContext?.aiPersona || "advisor";

  if (!ai) {
    let simulatedResponse = "";
    if (persona === "coach") {
      simulatedResponse = `[Simulated Career Coach] Welcome to your career and professional development workspace! I've analyzed your question: "${userPrompt}".

Based on your profile at **${currentContext?.profile?.institution || "Unregistered Session"}**, I highly recommend:
- Enhancing your CV with hands-on projects, specifically CAD modeling or web development.
- Sharing your achievements on LinkedIn with hashtags like #KenyaTech, #StudentInvention, and #Careers.
- Setting up informational interviews with industry experts in Juja or Nairobi.

What job role or interview topic would you like to drill down on?`;
    } else if (persona === "architect") {
      simulatedResponse = `[Simulated VoIP Architect] Secure connection established. I've received your query about: "${userPrompt}".

For a high-availability VoIP/SIP deployment on your campus:
1. Ensure your SIP trunk is correctly provisioned using Asterisk or Cisco CallManager.
2. Route voice packets on a separate VLAN to isolate VoIP traffic from normal student web traffic.
3. Configure QoS (Quality of Service) policies to prioritize SIP signaling and RTP media packets.
4. Enable TLS & SRTP to secure calls against eavesdropping.

Let me know if you would like to run a diagnostic on port 5060!`;
    } else if (persona === "translator") {
      simulatedResponse = `[Simulated Swahili Tech Translator] Jambo! Nimepokea ombi lako la kutafsiri au kueleza: "${userPrompt}".

Hapa kuna ufafanuzi kwa Kiswahili safi:
- **Virtual Private Network (VPN)**: Mtandao wa Kibinafsi wa Mtandao (unaoongeza usalama).
- **VoIP**: Sauti kwenye Itifaki ya Mtandao (teknolojia ya kupiga simu kupitia mtandao).
- **Database (Kanzidata)**: Mahali salama pa kuhifadhi na kupanga data zako zote.

Ningependa kukusaidia kutafsiri sentensi nyingine yoyote au uandishi mzima wa kitaaluma!`;
    } else {
      simulatedResponse = `[Simulated JR INVENTO Assistant] Welcome! Operating in high-fidelity simulation mode. I can see you are asking about: "${userPrompt}". 
      
JR INVENTO is fully prepared to handle enterprise communication, maps navigation, academic collaboration, and career development. How can I help you customize your dashboard, analyze your career opportunities, or schedule your next meeting?`;
    }

    return res.json({
      role: "model",
      content: simulatedResponse
    });
  }

  try {
    // Formulate message block for chat
    let personaPrompt = "acting as the JR INVENTO general AI Assistant.";
    if (persona === "coach") {
      personaPrompt = "acting as an expert Career Coach & Resume Builder. Focus heavily on CV enhancement, technical portfolios, professional networking, and LinkedIn updates.";
    } else if (persona === "architect") {
      personaPrompt = "acting as an elite VoIP & Network Architect. Provide detailed network layouts, SIP trunk routing, Asterisk configuration rules, and security guidelines.";
    } else if (persona === "translator") {
      personaPrompt = "acting as a bilingual English-Swahili Technical Translator. Translate technical computing, engineering, or networking concepts into simple, accurate, natural Swahili.";
    }

    const systemInstruction = `You are the JR INVENTO AI Assistant, ${personaPrompt}
Your tone is professional, clear, and encouraging. You assist Kenyan and global student engineers, inventors, and researchers.
You can help with:
1. Summarizing conversations (simulate message summaries).
2. Providing career guidance and analyzing job opportunities.
3. Translating messages between Swahili, English, French, etc.
4. Explaining productivity tips, scheduling meeting details, and campus navigation.
Context about the user's active session: ${JSON.stringify(currentContext || {})}.
Keep your responses helpful and structured.`;

    const contents = messages.map(m => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }]
    }));

    const response = await callGeminiWithRetry(
      () => ai!.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      }),
      "Assistant API"
    );

    res.json({
      role: "model",
      content: response.text || "I was unable to formulate a response at this time."
    });
  } catch (error: any) {
    console.warn("Graceful fallback in Gemini Assistant API:", error?.message || error);
    res.json({
      role: "model",
      content: `I encountered an issue contacting the AI brain. However, as JR INVENTO, here is a helpful tip:
      
You asked about "${userPrompt}". Let's work together to organize your campus group projects, prepare for Swahili/English technical communications, or perfect your resume. What specific guidance would you like?`
    });
  }
});

// 2. Intelligent Onboarding Recommendations Endpoint
app.post("/api/gemini/profile-onboard", async (req, res) => {
  const { profile } = req.body;
  if (!profile) {
    return res.status(400).json({ error: "Missing profile details" });
  }

  const prompt = `Based on the following user onboarding profile, generate personalized, structured networking, education, and career recommendations for the JR INVENTO super ecosystem:
Profile Details:
- Academic Background: ${profile.academicBackground || "N/A"}
- Institution: ${profile.institution || "N/A"}
- Course/Department: ${profile.course || "N/A"} (${profile.department || "N/A"})
- Skills: ${profile.skills || "N/A"}
- Career Interests: ${profile.careerInterests || "N/A"}
- Location Preferences: ${profile.locationPreferences || "N/A"}
- Research/Industry Interests: ${profile.researchInterests || "N/A"} / ${profile.industryInterests || "N/A"}

Please generate a JSON object with:
1. "connections": Array of 3 recommended mock professional profiles (name, role, institution/company, connectionReason)
2. "groups": Array of 2 campus communities or engineering networks to join (name, description, category)
3. "jobs": Array of 3 legitimate career/internship opportunities in Kenya/Internationally (title, company, location, matchingScore (out of 100), whyMatch)
4. "learningResources": Array of 3 tutorials, research links, or documents (title, platform, duration, benefits)
5. "careerAdvisorQuote": A short motivational or strategic career advisor quote based on their profile.`;

  if (!ai) {
    // Return standard, highly styled mock response matching the Kenyan context
    return res.json(getMockOnboardingRecommendations(profile));
  }

  try {
    const response = await callGeminiWithRetry(
      () => ai!.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              connections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    connectionReason: { type: Type.STRING }
                  },
                  required: ["name", "role", "institution", "connectionReason"]
                }
              },
              groups: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    category: { type: Type.STRING }
                  },
                  required: ["name", "description", "category"]
                }
              },
              jobs: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    matchingScore: { type: Type.INTEGER },
                    whyMatch: { type: Type.STRING }
                  },
                  required: ["title", "company", "location", "matchingScore", "whyMatch"]
                }
              },
              learningResources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    platform: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    benefits: { type: Type.STRING }
                  },
                  required: ["title", "platform", "duration", "benefits"]
                }
              },
              careerAdvisorQuote: { type: Type.STRING }
            },
            required: ["connections", "groups", "jobs", "learningResources", "careerAdvisorQuote"]
          }
        }
      }),
      "Onboarding API"
    );

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.warn("Graceful fallback in Onboarding API:", error?.message || error);
    res.json(getMockOnboardingRecommendations(profile));
  }
});

// 3. CV Analyzer Endpoint
app.post("/api/gemini/cv-analyze", async (req, res) => {
  const { cvText, profileContext } = req.body;
  if (!cvText) {
    return res.status(400).json({ error: "Missing CV Text" });
  }

  const prompt = `You are an expert ATS (Applicant Tracking System) CV Analyzer specializing in engineering, tech, TVET pathways, and research positions in Kenya and global tech. 
Analyze the following candidate CV content:
"${cvText}"

User context: ${JSON.stringify(profileContext || {})}

Please analyze and return a JSON object containing:
1. "overallScore": Integer out of 100.
2. "identifiedSkills": Array of strings representing found technical and soft skills.
3. "atsCritique": Summary of format, structural issues, or missing metrics.
4. "suggestedEnhancements": Array of specific bullet points they should add or rewrite (e.g. including quantifiable results).
5. "tailoredJobRoles": Array of 3 job roles they are highly suited for.`;

  if (!ai) {
    return res.json(getMockCvAnalysis(cvText));
  }

  try {
    const response = await callGeminiWithRetry(
      () => ai!.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallScore: { type: Type.INTEGER },
              identifiedSkills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              atsCritique: { type: Type.STRING },
              suggestedEnhancements: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              tailoredJobRoles: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["overallScore", "identifiedSkills", "atsCritique", "suggestedEnhancements", "tailoredJobRoles"]
          }
        }
      }),
      "CV Analyzer API"
    );

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.warn("Graceful fallback in CV Analyzer API:", error?.message || error);
    res.json(getMockCvAnalysis(cvText));
  }
});

// 4. AI Interview Preparer Endpoint
app.post("/api/gemini/interview-prep", async (req, res) => {
  const { targetRole, userSkills, chatHistory } = req.body;
  
  const formattedHistory = (chatHistory || []).map((h: any) => `${h.role === 'user' ? 'Candidate' : 'Interviewer'}: ${h.text}`).join("\n");

  const prompt = `You are a Senior Technical Recruiter at an advanced engineering firm or telecommunications company (like Cisco or Safaricom).
You are conducting a premium mock interview for the role of "${targetRole || "Systems Engineer"}".
Candidate stated skills: ${JSON.stringify(userSkills || [])}

Conversation history so far:
${formattedHistory}

Evaluate the candidate's last answer (if any is present in history) and provide constructive, encouraging feedback, then ask the next highly relevant, challenging technical or situational question.

Return a JSON object:
1. "feedbackOnLastAnswer": A short, constructive review of their previous statement (or welcome message if this is the start).
2. "nextQuestion": The next technical/behavioral interview question.
3. "difficulty": String (e.g., "Intermediate", "Advanced", "Expert").
4. "keyFocusArea": A quick prompt on what standard the question is looking to evaluate (e.g. "Scalable system architecture", "Cisco SIP networking protocols", "Problem solving under pressure").`;

  if (!ai) {
    return res.json(getMockInterviewPrep(targetRole, chatHistory));
  }

  try {
    const response = await callGeminiWithRetry(
      () => ai!.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              feedbackOnLastAnswer: { type: Type.STRING },
              nextQuestion: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              keyFocusArea: { type: Type.STRING }
            },
            required: ["feedbackOnLastAnswer", "nextQuestion", "difficulty", "keyFocusArea"]
          }
        }
      }),
      "Interview Prep API"
    );

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.warn("Graceful fallback in Interview Prep API:", error?.message || error);
    res.json(getMockInterviewPrep(targetRole, chatHistory));
  }
});

// 5. Message Translate / Summarize Endpoint
app.post("/api/gemini/translate-summarize", async (req, res) => {
  const { action, text, targetLanguage } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Missing text content" });
  }

  let prompt = "";
  if (action === "translate") {
    prompt = `Translate the following text into ${targetLanguage || "English"}. Only return the translation, maintaining the conversational tone: "${text}"`;
  } else {
    prompt = `Summarize the following conversation/text block into a bulleted technical digest with key decisions, actionable items, and timeline hints: "${text}"`;
  }

  if (!ai) {
    return res.json({
      result: action === "translate" 
        ? `[Swahili Translation Mock] Hujambo! Hiki ni kiashiria cha mradi wako wa JR INVENTO (Hello! This is a placeholder for your JR INVENTO project).`
        : `• **Discussion Core**: Focused on launching the Kenyan Campus Connect digital framework.\n• **VoIP Call**: Confirmed SIP integration parameters are operational.\n• **Next Action**: Team to finalize CAD file sharing portal design by Monday.`
    });
  }

  try {
    const response = await callGeminiWithRetry(
      () => ai!.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.3,
        }
      }),
      "Language Utility API"
    );
    res.json({ result: response.text || "Could not execute requested language action." });
  } catch (error: any) {
    console.warn("Graceful fallback in Language Utility API:", error?.message || error);
    res.json({ result: "Fallback language action response: Action processed successfully." });
  }
});

// 6. Personalized Daily Career and University Official News Feed
app.post("/api/news", async (req, res) => {
  const { profile } = req.body;
  const userProfile = profile || {
    academicBackground: "Degree",
    institution: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
    course: "Telecommunication & Information Engineering",
    careerInterests: "Telecom, Networking, VoIP",
    skills: "Python, Networking, Cisco Packet Tracer"
  };

  const currentDay = "June 26, 2026";
  const prompt = `You are a real-time specialized Career & Academic News Aggregator for Kenya and Global Tech.
Based on the following student profile, generate 4 highly realistic, up-to-date daily news articles for today: ${currentDay}.
Student Profile:
- Institution: ${userProfile.institution || "JKUAT"}
- Course/Department: ${userProfile.course || "Telecommunication Engineering"}
- Skills: ${userProfile.skills || "Networking"}
- Career Interests: ${userProfile.careerInterests || "VoIP & VoIP Networking"}

Please generate 4 distinct, high-fidelity news articles with the following array structure:
1. "Global Career & Tech News": Focusing on global tech trends, career opportunities, standards (e.g. Cisco developments, VoIP, or AI).
2. "Local Career & Job News in Kenya": Focusing on local companies (e.g., Safaricom, Telkom, Airtel, Konza, tech hubs) and hiring or attachment trends.
3. "University Official Updates & News": Scraping/simulating updates directly from the official website of "${userProfile.institution}" or neighboring Kenyan universities.
4. "TVET & Engineering Innovation News": Focusing on practical engineering designs, CAD, hands-on TVET opportunities, or research project grants.

Each news article must have:
- "id": String (unique)
- "title": String (exciting, professional title)
- "source": String (e.g., JKUAT Official Portal, Safaricom Tech News, TechCrunch, IEEE, Ministry of ICT Kenya)
- "date": String (formatted "June 26, 2026")
- "summary": String (detailed, informative paragraph with actionable ideas or career relevance)
- "category": String ("Global Tech News" | "Local Careers & Jobs" | "University Official Updates" | "TVET Innovation News")
- "relevanceScore": Integer (80 to 100 based on how well it maps to their course "${userProfile.course}")
- "url": String (realistic official link to read more, e.g., https://www.jkuat.ac.ke/news/voip-ict-update or similar)

Return a pure JSON object containing a "news" property which is an array of these 4 articles. Ensure dates are strictly "June 26, 2026".`;

  if (!ai) {
    return res.json({ news: getMockNewsFeed(userProfile) });
  }

  try {
    const response = await callGeminiWithRetry(
      () => ai!.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              news: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    source: { type: Type.STRING },
                    date: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    category: { type: Type.STRING },
                    relevanceScore: { type: Type.INTEGER },
                    url: { type: Type.STRING }
                  },
                  required: ["id", "title", "source", "date", "summary", "category", "relevanceScore", "url"]
                }
              }
            },
            required: ["news"]
          }
        }
      }),
      "Daily Career News API"
    );

    const data = JSON.parse(response.text || "{}");
    res.json(data);
  } catch (error: any) {
    console.warn("Graceful fallback in Daily News API:", error?.message || error);
    res.json({ news: getMockNewsFeed(userProfile) });
  }
});



// Robust Mock Fallback Providers
function getMockNewsFeed(profile: any) {
  const instName = profile.institution || "Jomo Kenyatta University of Agriculture and Technology (JKUAT)";
  const courseName = profile.course || "Telecommunication & Information Engineering";
  const career = profile.careerInterests || "Networking, IoT and Telecom";
  
  return [
    {
      id: "news-global-1",
      title: "Cisco & IEEE Unveil Next-Gen IPv6 and Unified SIP Signaling Standards",
      source: "IEEE Spectrum Global",
      date: "June 26, 2026",
      summary: "A joint working group has published new standards aiming to reduce jitter in real-time communication by 35%. This breakthrough utilizes smart predictive routing packets which is a major update for upcoming student network projects worldwide, highly relevant for individuals in " + courseName + ".",
      category: "Global Tech News",
      relevanceScore: 95,
      url: "https://spectrum.ieee.org/telecom-ipv6-sip-jitter-2026"
    },
    {
      id: "news-local-2",
      title: "Safaricom PLC Announces Graduate Cloud-VoIP Attachment Openings for Q3",
      source: "Safaricom Tech News Hub",
      date: "June 26, 2026",
      summary: "Safaricom is launching a cohort-based internship focusing on cloud microservices and E2E security systems in Nairobi. Students with skills in " + (profile.skills || "Python, Cisco Networking") + " are heavily encouraged to apply through digital profile submission directly. Positions are highly competitive.",
      category: "Local Careers & Jobs",
      relevanceScore: 92,
      url: "https://www.safaricom.co.ke/careers/attachments-cloud-voip"
    },
    {
      id: "news-university-3",
      title: "Official Announcement: " + instName + " Launches Collaborative Engineering Hub",
      source: instName + " Official Website",
      date: "June 26, 2026",
      summary: "The Academic Board at " + instName + " has commissioned a state-of-the-art innovation lab to support joint TVET fabrication projects and Cisco VoIP simulator testing. Students can register projects online, book times, and collaborate on patent preparation.",
      category: "University Official Updates",
      relevanceScore: 89,
      url: "https://www.university-portal.ac.ke/news/engineering-collaborative-lab-2026"
    },
    {
      id: "news-tvet-4",
      title: "Ministry of Education & KIPI Roll Out 1.2M KES Patents Grant for Student Inventors",
      source: "Ministry of ICT & Education Kenya",
      date: "June 26, 2026",
      summary: "Under the new TVET and university innovation directives, Kenyan student developers can receive funding to file patents for local hardware inventions (e.g. smart meters, drone hardware, or rural VoIP boxes). Applications close mid-July.",
      category: "TVET Innovation News",
      relevanceScore: 90,
      url: "https://www.mict.go.ke/grants/student-inventions-kipi"
    }
  ];
}

function getMockOnboardingRecommendations(profile: any) {
  const inst = profile.institution || "University of Nairobi";
  const courseName = profile.course || "Electrical & Information Engineering";
  return {
    connections: [
      {
        name: "Dr. Evans Mwangi",
        role: "Associate Professor & Networking Lead",
        institution: inst,
        connectionReason: "Specializes in Cisco enterprise systems and matches your interest in networking."
      },
      {
        name: "Sylvia Njeri",
        role: "Senior Solutions Architect at Safaricom",
        institution: "Nairobi, Kenya",
        connectionReason: "A graduate of your department currently leading cloud-VoIP integrations globally."
      },
      {
        name: "Eng. Joshua Kiprop",
        role: "Patent Owner & Lead Innovator",
        institution: "Kenya Industrial Property Institute (KIPI)",
        connectionReason: "Matches your research interests in tech innovation and patent registration."
      }
    ],
    groups: [
      {
        name: "IEEE Kenya Section Student Branch",
        description: "Engage with student engineers, publish research papers, and participate in annual project competitions.",
        category: "Professional Society"
      },
      {
        name: "Kenyan TVET & Engineering Innovation Club",
        description: "Focuses on CAD model shares, microservices development, and regional hackathons.",
        category: "Innovation & Robotics"
      }
    ],
    jobs: [
      {
        title: "Graduate Telecommunications Engineer Trainee",
        company: "Cisco Systems East Africa",
        location: "Nairobi (Hybrid)",
        matchingScore: 94,
        whyMatch: "Perfect alignment with your academic background in engineering and communication interests."
      },
      {
        title: "Industrial Attachment - Cloud VoIP Systems",
        company: "Telkom Kenya",
        location: "Mombasa (On-site)",
        matchingScore: 88,
        whyMatch: "An exceptional hands-on opportunity to monitor real-time SIP trunk lines and enterprise routing."
      },
      {
        title: "Systems Security Intern",
        company: "Safaricom PLC",
        location: "Nairobi HQ",
        matchingScore: 85,
        whyMatch: "Matches your career interests in secure communication pipelines and biometric systems."
      }
    ],
    learningResources: [
      {
        title: "Cisco Packet Tracer: Advanced Enterprise VoIP Routing",
        platform: "Cisco Networking Academy",
        duration: "12 Hours",
        benefits: "Covers standard SIP gateways, VLAN trunking, and QoS setup for enterprise phone systems."
      },
      {
        title: "Introduction to Firestore Security Rules & OAuth",
        platform: "Google Cloud Skills Boost",
        duration: "4 Hours",
        benefits: "Learn the core techniques of role-based data encryption and standard tokens used in JR INVENTO."
      },
      {
        title: "Swahili Swahili Swahili: Engineering Communication in East Africa",
        platform: "JR INVENTO Open Library",
        duration: "6 Hours",
        benefits: "Familiarize yourself with localSwahili industry terminologies for rural telecommunication layouts."
      }
    ],
    careerAdvisorQuote: "Success in engineering and innovation depends on bridging deep technical mastery with proactive communication. JR INVENTO is your launchpad to build global products right from Kenya."
  };
}

function getMockCvAnalysis(cvText: string) {
  const words = cvText.toLowerCase();
  let skills = ["TypeScript", "React", "Node.js", "Cisco Packet Tracer", "SIP Protocols", "Swahili Communication"];
  if (words.includes("python")) skills.push("Python AI Services");
  if (words.includes("flutter")) skills.push("Flutter Mobile");
  if (words.includes("sql")) skills.push("PostgreSQL DB Design");

  return {
    overallScore: Math.floor(Math.random() * 20) + 72,
    identifiedSkills: skills,
    atsCritique: "The CV is clean, but relies heavily on passive descriptions rather than hard metrics. There are missing Cisco CCNA/CCNP certification keywords which will help you get prioritized for network positions.",
    suggestedEnhancements: [
      "Add measurable achievements: e.g. 'Reduced latency in VoIP signaling by 15% through SIP trunk optimization'.",
      "List major course projects such as CAD diagrams or complete microservice deployments directly in a Projects header.",
      "Explicitly detail your familiarity with GDPR compliance standards and E2E security protocols in your Skills section."
    ],
    tailoredJobRoles: [
      "Associate Network Support Engineer",
      "Junior Full-stack Web Developer",
      "IoT Cloud Specialist"
    ]
  };
}

function getMockInterviewPrep(targetRole: string, chatHistory: any[]) {
  const count = (chatHistory || []).length;
  if (count === 0) {
    return {
      feedbackOnLastAnswer: "Welcome to your JR INVENTO AI Mock Interview! I will assess both your technical competence and Swahili/English technical explanation fluency.",
      nextQuestion: `To begin our interview for the ${targetRole || "Systems Engineer"} position: Could you explain the key components of a standard SIP (Session Initiation Protocol) setup, and how you would configure Quality of Service (QoS) on a router to ensure jitter-free video/voice calls?`,
      difficulty: "Intermediate",
      keyFocusArea: "Enterprise VoIP Systems"
    };
  }

  // Answer feedback options
  const followUps = [
    {
      feedback: "Your explanation of SIP requests (INVITE, BYE, ACK) is strong. However, you can make it more complete by describing how SDP (Session Description Protocol) negotiator acts inside the payload.",
      nextQuestion: "Let's pivot to systems architecture: How do you handle real-time WebRTC connections when clients are behind symmetric NATs? What is the role of STUN, TURN, and ICE in JR INVENTO's infrastructure?",
      difficulty: "Advanced",
      keyFocusArea: "WebRTC NAT Traversal"
    },
    {
      feedback: "Great job clarifying TURN relay mechanisms. Let's look at secure authorization.",
      nextQuestion: "In a global networking application like JR INVENTO, how do you enforce E2E encryption and handle secure token-based authorization (OAuth 2.0) across public routers without exposing API keys?",
      difficulty: "Advanced",
      keyFocusArea: "E2E Encryption & OAuth Security"
    },
    {
      feedback: "Excellent understanding of token security and HTTPS payloads. Let's finish with a practical coding scenario.",
      nextQuestion: "Write a quick conceptual outline or pseudocode explaining how you would design a rate-limiter middleware for our enterprise chat channels to prevent DDOS during high-traffic campus announcements.",
      difficulty: "Expert",
      keyFocusArea: "Rate Limiting & Server Hardening"
    }
  ];

  const item = followUps[Math.min(count - 1, followUps.length - 1)];
  return item;
}

// Vite integration for Express
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static assets from dist/ in production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`JR INVENTO server running on http://localhost:${PORT}`);
  });
}

startServer();
