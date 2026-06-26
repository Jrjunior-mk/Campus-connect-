// Shared types and mock database for JR INVENTO

export interface OnboardingProfile {
  academicBackground: string;
  institution: string;
  course: string;
  department: string;
  skills: string;
  careerInterests: string;
  locationPreferences: string;
  researchInterests: string;
  industryInterests: string;
  eventInterests: string;
}

export interface RecommendationData {
  connections: Array<{
    name: string;
    role: string;
    institution: string;
    connectionReason: string;
  }>;
  groups: Array<{
    name: string;
    description: string;
    category: string;
  }>;
  jobs: Array<{
    title: string;
    company: string;
    location: string;
    matchingScore: number;
    whyMatch: string;
  }>;
  learningResources: Array<{
    title: string;
    platform: string;
    duration: string;
    benefits: string;
  }>;
  careerAdvisorQuote: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "other";
  senderName: string;
  text: string;
  timestamp: string;
  translated?: string;
  isVoice?: boolean;
  voiceDuration?: string;
  reactions?: string[];
}

export interface ChatChannel {
  id: string;
  name: string;
  type: "private" | "group" | "community" | "threaded";
  lastMessage: string;
  unreadCount: number;
  avatar: string;
  membersCount?: number;
  messages: ChatMessage[];
}

export interface UniversityDetail {
  name: string;
  type: "Public University" | "Private University" | "TVET" | "International Affiliate";
  location: string;
  established: string;
  logo: string;
  departments: string[];
  currentHackathons: string[];
}

export interface CadFile {
  id: string;
  title: string;
  author: string;
  category: "PCB Design" | "Mechanical Enclosure" | "RF Antenna" | "Robotics Arm";
  fileSize: string;
  views: number;
  downloads: number;
  vectorSchema: "rect" | "circle" | "complex" | "mesh";
}

export interface EventDetail {
  id: string;
  title: string;
  host: string;
  date: string;
  time: string;
  type: "Webinar" | "Conference" | "Hackathon" | "Livestream" | "Department Meet";
  location: string;
  registered: boolean;
  ticketCode?: string;
  description: string;
  attendeesCount: number;
}

export interface SocialMediaAccount {
  platform: "LinkedIn" | "WhatsApp" | "Telegram" | "X" | "Instagram" | "Discord" | "GitHub" | "YouTube";
  linked: boolean;
  username: string;
  followers: number;
  engagementRate: string;
  recentNotifications: string[];
}

export interface TaskItem {
  id: string;
  title: string;
  deadline: string;
  category: "Assignment" | "Research" | "Event Reminder" | "Call Meeting";
  completed: boolean;
}

// SEEDED MOCK DATA FOR KENYA UNIVERSITY COVERAGE
export const KENYAN_INSTITUTIONS: UniversityDetail[] = [
  {
    name: "University of Nairobi (UoN)",
    type: "Public University",
    location: "Nairobi (Main Campus)",
    established: "1970",
    logo: "UoN",
    departments: ["Electrical & Information Engineering", "Mechanical & Manufacturing Engineering", "Civil & Construction Engineering", "Computer Science"],
    currentHackathons: ["Nairobi Smart Traffic IoT Challenge", "AI for Agri-Tech East Africa"]
  },
  {
    name: "Jomo Kenyatta University of Agriculture and Technology (JKUAT)",
    type: "Public University",
    location: "Juja",
    established: "1994",
    logo: "JKUAT",
    departments: ["Telecommunication & Information Engineering", "Mechatronic Engineering", "Computing & Information Technology"],
    currentHackathons: ["Juja Robotics & Automation Summit", "Green Energy Microgrid hack"]
  },
  {
    name: "Kenyatta University (KU)",
    type: "Public University",
    location: "Nairobi (Thika Road)",
    established: "1985",
    logo: "KU",
    departments: ["Engineering & Technology", "Pure & Applied Sciences", "Computer Science"],
    currentHackathons: ["Nairobi Transit Route Optimization Hack"]
  },
  {
    name: "Moi University",
    type: "Public University",
    location: "Eldoret",
    established: "1984",
    logo: "MU",
    departments: ["Electrical & Communications Engineering", "Aerospace Engineering", "Information Sciences"],
    currentHackathons: ["Rift Valley Agribusiness Tech Hackathon"]
  },
  {
    name: "Egerton University",
    type: "Public University",
    location: "Njoro, Nakuru",
    established: "1987",
    logo: "EU",
    departments: ["Agricultural Engineering", "Computer Science", "Dairy Science & Technology"],
    currentHackathons: ["Smart Agri-Water Conservation Challenge"]
  },
  {
    name: "Maseno University",
    type: "Public University",
    location: "Maseno, Kisumu",
    established: "1991",
    logo: "MSU",
    departments: ["Computing and Informatics", "Physical & Biological Sciences", "Urban & Regional Planning"],
    currentHackathons: ["Lake Victoria Blue Tech Hackathon"]
  },
  {
    name: "Technical University of Kenya (TUK)",
    type: "Public University",
    location: "Nairobi (City Square)",
    established: "2013",
    logo: "TUK",
    departments: ["Electrical & Electronic Engineering", "Chemical & Process Engineering", "Geospatial Science"],
    currentHackathons: ["CBD Micro-Grid Solar Layout Competition"]
  },
  {
    name: "Technical University of Mombasa (TUM)",
    type: "Public University",
    location: "Mombasa",
    established: "2013",
    logo: "TUM",
    departments: ["Mechanical & Automotive Engineering", "Medical Engineering", "Computing & IT"],
    currentHackathons: ["Coastal Wind Power Grid Challenge"]
  },
  {
    name: "Dedan Kimathi University of Technology (DeKUT)",
    type: "Public University",
    location: "Nyeri",
    established: "2012",
    logo: "DeKUT",
    departments: ["Mechatronic Engineering", "Geospatial Information Science", "Computer Science & IT"],
    currentHackathons: ["DeKUT Coffee Harvester Automation Hack"]
  },
  {
    name: "Masinde Muliro University of Science and Technology (MMUST)",
    type: "Public University",
    location: "Kakamega",
    established: "2007",
    logo: "MMUST",
    departments: ["Disaster Management & Humanitarian Assistance", "Electrical Engineering", "Computing & IT"],
    currentHackathons: ["Disaster Alert IoT System Challenge"]
  },
  {
    name: "Multimedia University of Kenya (MMU)",
    type: "Public University",
    location: "Nairobi (Mbagathi)",
    established: "2013",
    logo: "MMU",
    departments: ["Media & Communication Tech", "Computing & IT", "Engineering & Technology"],
    currentHackathons: ["5G Live Stream Jitter Optimization Hack"]
  },
  {
    name: "Chuka University",
    type: "Public University",
    location: "Chuka, Tharaka Nithi",
    established: "2013",
    logo: "CU",
    departments: ["Computer Science", "Environmental Studies", "Agriculture & Natural Resources"],
    currentHackathons: ["Tharaka Nithi Water Sourcing Smart Map"]
  },
  {
    name: "Kisii University",
    type: "Public University",
    location: "Kisii",
    established: "2013",
    logo: "KSU",
    departments: ["Information Science & Technology", "Pure & Applied Sciences", "Health Sciences"],
    currentHackathons: ["Gusii Highlands Drone Delivery Hackathon"]
  },
  {
    name: "Meru University of Science and Technology (MUST)",
    type: "Public University",
    location: "Meru",
    established: "2013",
    logo: "MUST",
    departments: ["Computing & Informatics", "Engineering & Architecture", "Agriculture & Food Science"],
    currentHackathons: ["Meru Smart Irrigation & Drone Survey"]
  },
  {
    name: "Machakos University",
    type: "Public University",
    location: "Machakos",
    established: "2016",
    logo: "MksU",
    departments: ["Engineering & Technology", "Computing & Mathematical Sciences", "Applied Sciences"],
    currentHackathons: ["Ukambani Smart Water Borehole Monitor"]
  },
  {
    name: "The Co-operative University of Kenya",
    type: "Public University",
    location: "Nairobi (Karen)",
    established: "2016",
    logo: "CUK",
    departments: ["Computing & Information Technology", "Co-operative Development", "Business & Economics"],
    currentHackathons: ["Sacco FinTech Ledger Verification Hack"]
  },
  {
    name: "South Eastern Kenya University (SEKU)",
    type: "Public University",
    location: "Kitui",
    established: "2013",
    logo: "SEKU",
    departments: ["Meteorology & Hydrology", "Water & Agricultural Engineering", "Informatics"],
    currentHackathons: ["Semi-Arid Crop Yield Predictor AI"]
  },
  {
    name: "Murang'a University of Technology (MUT)",
    type: "Public University",
    location: "Murang'a",
    established: "2016",
    logo: "MUT",
    departments: ["Computer Science & Software Engineering", "Electrical Engineering", "Applied Sciences"],
    currentHackathons: ["Central Kenya Smart Agriculture Grid"]
  },
  {
    name: "Karatina University",
    type: "Public University",
    location: "Karatina",
    established: "2013",
    logo: "KrU",
    departments: ["Pure & Applied Sciences", "Computer Science", "Agriculture & Biotech"],
    currentHackathons: ["Tea Harvest Yield Grading Computer Vision"]
  },
  {
    name: "University of Kabianga",
    type: "Public University",
    location: "Kericho",
    established: "2013",
    logo: "UoK",
    departments: ["Science & Technology", "Agriculture & Natural Resources", "Information Sciences"],
    currentHackathons: ["Kericho Smart Weather Station IoT"]
  },
  {
    name: "Maasai Mara University",
    type: "Public University",
    location: "Narok",
    established: "2013",
    logo: "MMarU",
    departments: ["Computing & Information Sciences", "Wildlife & Tourism Management", "Science & Tech"],
    currentHackathons: ["Mara Wildlife Anti-Poaching Sensor Grid"]
  },
  {
    name: "Pwani University",
    type: "Public University",
    location: "Kilifi",
    established: "2013",
    logo: "PU",
    departments: ["Pure & Applied Sciences", "Computer Science", "Agricultural Sciences"],
    currentHackathons: ["Coastal Marine Ecosystem Monitoring IoT"]
  },
  {
    name: "Taita Taveta University",
    type: "Public University",
    location: "Voi",
    established: "2016",
    logo: "TTU",
    departments: ["Mining & Materials Engineering", "Computing & IT", "Science & Technology"],
    currentHackathons: ["Mining Safety & Gas Level Detector IoT"]
  },
  {
    name: "Kibabii University",
    type: "Public University",
    location: "Bungoma",
    established: "2015",
    logo: "KIBU",
    departments: ["Computing & Informatics", "Science & Technology", "Business Studies"],
    currentHackathons: ["Western Kenya Secure Sacco Ledger App"]
  },
  {
    name: "University of Eldoret",
    type: "Public University",
    location: "Eldoret",
    established: "2013",
    logo: "UoE",
    departments: ["Agriculture & Biotechnology", "Computer Science", "Environmental Studies"],
    currentHackathons: ["Soil pH & NPK Drone Mapper Challenge"]
  },
  {
    name: "Garissa University",
    type: "Public University",
    location: "Garissa",
    established: "2017",
    logo: "GU",
    departments: ["Information & Communication Tech", "Pure & Applied Sciences", "Business"],
    currentHackathons: ["Arid Area Smart Water Grid Monitor"]
  },
  {
    name: "Rongo University",
    type: "Public University",
    location: "Rongo, Migori",
    established: "2016",
    logo: "RU",
    departments: ["Information, Communication & Media", "Science & Technology", "Agriculture"],
    currentHackathons: ["Gold Processing Tailings Tracker App"]
  },
  {
    name: "Laikipia University",
    type: "Public University",
    location: "Nyahururu",
    established: "2013",
    logo: "LU",
    departments: ["Computer Science", "Pure & Applied Sciences", "Humanities"],
    currentHackathons: ["Nyahururu Tourism Route Recommender AI"]
  },
  {
    name: "Tharaka University",
    type: "Public University",
    location: "Gatunga",
    established: "2022",
    logo: "TU",
    departments: ["Computing & IT", "Pure & Applied Sciences", "Business"],
    currentHackathons: ["Tharaka Drylands Crop Moisture Predictor"]
  },
  {
    name: "Alupe University",
    type: "Public University",
    location: "Busia",
    established: "2022",
    logo: "AU",
    departments: ["Computing & Informatics", "Health Sciences", "Pure Sciences"],
    currentHackathons: ["Border Control Truck Queue Monitor"]
  },
  {
    name: "Kaimosi Friends University",
    type: "Public University",
    location: "Kaimosi, Vihiga",
    established: "2022",
    logo: "KAFU",
    departments: ["Computing & IT", "Pure & Applied Sciences", "Health Sciences"],
    currentHackathons: ["Vihiga Mudslide Early Warning System IoT"]
  },
  {
    name: "Tom Mboya University",
    type: "Public University",
    location: "Homa Bay",
    established: "2022",
    logo: "TMU",
    departments: ["Computing & Informatics", "Biological & Physical Sciences", "Business"],
    currentHackathons: ["Lake Victoria Water Hyacinth Satellite Tracker"]
  },
  {
    name: "Turkana University College",
    type: "Public University",
    location: "Lodwar",
    established: "2017",
    logo: "TUC",
    departments: ["Computing & IT", "Arid Land Agriculture & Science", "Business"],
    currentHackathons: ["Lodwar Solar Borehole Pump Controller"]
  },
  {
    name: "The Kabete National Polytechnic",
    type: "TVET",
    location: "Nairobi (Kabete)",
    established: "1924",
    logo: "TKNP",
    departments: ["Electrical & Electronic Engineering", "Mechanical Engineering", "ICT & Computer Studies"],
    currentHackathons: ["TVET National Fabrication Challenge"]
  },
  {
    name: "Nyeri National Polytechnic",
    type: "TVET",
    location: "Nyeri",
    established: "1977",
    logo: "NNP",
    departments: ["Electrical Engineering", "Applied Sciences", "Automotive Technology"],
    currentHackathons: ["Central Kenya Hydro-Tech Expo"]
  },
  {
    name: "Kenya Coast National Polytechnic",
    type: "TVET",
    location: "Mombasa",
    established: "1950",
    logo: "KCNP",
    departments: ["Marine Engineering", "Electrical Engineering", "ICT Department"],
    currentHackathons: ["Blue Economy Tech Innovate 2026"]
  },
  {
    name: "Kisumu National Polytechnic",
    type: "TVET",
    location: "Kisumu",
    established: "1953",
    logo: "KINP",
    departments: ["Electrical & Electronic Engineering", "Mechanical Engineering", "ICT"],
    currentHackathons: ["Kisumu Port Machinery Optimization"]
  },
  {
    name: "Eldoret National Polytechnic",
    type: "TVET",
    location: "Eldoret",
    established: "1985",
    logo: "TENP",
    departments: ["Building & Civil Engineering", "Electrical & Electronics", "ICT Department"],
    currentHackathons: ["Uasin Gishu Smart Grain Silo Level Monitor"]
  },
  {
    name: "Sigalagala National Polytechnic",
    type: "TVET",
    location: "Kakamega",
    established: "1950",
    logo: "SNP",
    departments: ["Electrical Engineering", "Applied Sciences", "ICT Department"],
    currentHackathons: ["Kakamega Biotech Fermentation Challenge"]
  },
  {
    name: "Meru National Polytechnic",
    type: "TVET",
    location: "Meru",
    established: "1956",
    logo: "MNP",
    departments: ["Electrical & Electronics Engineering", "Applied Sciences", "ICT Studies"],
    currentHackathons: ["Meru Smart Biomass Gasifier Monitor"]
  },
  {
    name: "Kitale National Polytechnic",
    type: "TVET",
    location: "Kitale",
    established: "1980",
    logo: "KNP",
    departments: ["Agricultural Engineering", "Mechanical Engineering", "ICT Studies"],
    currentHackathons: ["Trans-Nzoia Maize Moisture Sensor Hack"]
  },
  {
    name: "Strathmore University",
    type: "Private University",
    location: "Nairobi (Madaraka)",
    established: "1961",
    logo: "SU",
    departments: ["Faculty of Information Technology", "Strathmore Business School"],
    currentHackathons: ["FinTech Sandbox Challenge", "Cybersecurity Capture The Flag"]
  },
  {
    name: "United States International University-Africa (USIU)",
    type: "Private University",
    location: "Nairobi (Roysambu)",
    established: "1969",
    logo: "USIU",
    departments: ["School of Science & Technology", "Chandaria School of Business"],
    currentHackathons: ["USIU Global Tech Venture Pitch"]
  },
  {
    name: "Mount Kenya University (MKU)",
    type: "Private University",
    location: "Thika (Main Campus)",
    established: "1997",
    logo: "MKU",
    departments: ["Pure & Applied Sciences", "Computing & Informatics", "Health Sciences"],
    currentHackathons: ["MKU Smart Community Drone Patrol Hack"]
  },
  {
    name: "Daystar University",
    type: "Private University",
    location: "Athi River",
    established: "1973",
    logo: "DU",
    departments: ["Science, Engineering & Health", "Communication & Journalism Studies"],
    currentHackathons: ["Athi River Low-Latency FM/VoIP Broadcaster"]
  },
  {
    name: "Catholic University of Eastern Africa (CUEA)",
    type: "Private University",
    location: "Nairobi (Lang'ata)",
    established: "1984",
    logo: "CUEA",
    departments: ["Computer Science", "Natural Sciences", "Business Administration"],
    currentHackathons: ["Secure Multi-Cloud Voting Ledger CTF"]
  },
  {
    name: "Africa Nazarene University (ANU)",
    type: "Private University",
    location: "Nairobi (Ongata Rongai)",
    established: "1994",
    logo: "ANU",
    departments: ["Computer Science & IT", "Environment & Natural Resources"],
    currentHackathons: ["Rongai Human-Wildlife Conflict Alert AI"]
  },
  {
    name: "KCA University (KCAU)",
    type: "Private University",
    location: "Nairobi (Ruaraka)",
    established: "1989",
    logo: "KCAU",
    departments: ["Technology & Informatics", "Professional Studies", "Business"],
    currentHackathons: ["Fintech Micro-Lending Risk Evaluator Model"]
  },
  {
    name: "Riara University",
    type: "Private University",
    location: "Nairobi (Mbagathi)",
    established: "2012",
    logo: "RU",
    departments: ["Computing & Sciences", "School of Education"],
    currentHackathons: ["EdTech AI Audio Transcriber Swahili"]
  },
  {
    name: "Kabarak University",
    type: "Private University",
    location: "Nakuru",
    established: "2001",
    logo: "KABU",
    departments: ["Computer Science & IT", "Science, Engineering & Technology"],
    currentHackathons: ["Rift Valley Soil Nutrition Sensor System"]
  },
  {
    name: "Massachusetts Institute of Technology (MIT)",
    type: "International Affiliate",
    location: "Cambridge, USA",
    established: "1861",
    logo: "MIT",
    departments: ["EECS Department", "MIT Media Lab"],
    currentHackathons: ["MIT-Africa Hackathon for Global Health"]
  },
  {
    name: "Stanford University",
    type: "International Affiliate",
    location: "Stanford, California, USA",
    established: "1891",
    logo: "STAN",
    departments: ["Computer Science Department", "Stanford AI Lab (SAIL)", "Electrical Engineering"],
    currentHackathons: ["Global Collaborative Smart Grid Hackathon"]
  },
  {
    name: "University of Oxford",
    type: "International Affiliate",
    location: "Oxford, United Kingdom",
    established: "1096",
    logo: "OXF",
    departments: ["Department of Computer Science", "Oxford e-Research Centre"],
    currentHackathons: ["Oxford-Africa Climate Data modeling Project"]
  },
  {
    name: "Imperial College London",
    type: "International Affiliate",
    location: "London, United Kingdom",
    established: "1907",
    logo: "IMP",
    departments: ["Department of Computing", "Imperial Enterprise Lab"],
    currentHackathons: ["Imperial Global Health IoT Challenge"]
  },
  {
    name: "National University of Singapore (NUS)",
    type: "International Affiliate",
    location: "Queenstown, Singapore",
    established: "1905",
    logo: "NUS",
    departments: ["NUS School of Computing", "NUS Smart Systems Institute"],
    currentHackathons: ["Smart Port Optimization & Logistic Blockchain"]
  },
  {
    name: "ETH Zurich",
    type: "International Affiliate",
    location: "Zurich, Switzerland",
    established: "1855",
    logo: "ETH",
    departments: ["Department of Computer Science", "Institute for Robotics"],
    currentHackathons: ["Autonomous Drone Search & Rescue Simulation"]
  },
  {
    name: "University of Cape Town (UCT)",
    type: "International Affiliate",
    location: "Cape Town, South Africa",
    established: "1829",
    logo: "UCT",
    departments: ["School of IT", "Department of Electrical Engineering"],
    currentHackathons: ["Sub-Saharan Smart Energy Grid Microgrid Hack"]
  },
  {
    name: "Tsinghua University",
    type: "International Affiliate",
    location: "Beijing, China",
    established: "1911",
    logo: "TSIN",
    departments: ["Department of Computer Science", "Tsinghua Space Institute"],
    currentHackathons: ["Tsinghua-Africa Satellite Data Joint Modeling"]
  }
];

export const MOCK_CHANNELS: ChatChannel[] = [
  {
    id: "global-lobby",
    name: "Global Engineering Forum",
    type: "community",
    lastMessage: "Welcome to the JR INVENTO World Network! Please introduce yourselves.",
    unreadCount: 2,
    avatar: "🌐",
    membersCount: 1420,
    messages: [
      { id: "1", sender: "other", senderName: "Eng. Kiprotich", text: "Hello everyone, excited to see student innovators from JKUAT and Kabete polytechnic here!", timestamp: "09:30 AM" },
      { id: "2", sender: "other", senderName: "Abdi (UoN)", text: "I am sharing my PCB routing for our agricultural smart sensor tomorrow in the CAD library.", timestamp: "10:15 AM" },
      { id: "3", sender: "user", senderName: "Me", text: "Thanks, looking forward to comparing notes on standard SIP protocols!", timestamp: "10:20 AM" }
    ]
  },
  {
    id: "cisco-telecom",
    name: "Cisco VoIP Integration",
    type: "group",
    lastMessage: "SIP trunk setup complete on port 5060.",
    unreadCount: 0,
    avatar: "📞",
    membersCount: 45,
    messages: [
      { id: "1", sender: "other", senderName: "Instructor Evans", text: "Remember to configure your class maps for priority voice payloads.", timestamp: "Yesterday" },
      { id: "2", sender: "other", senderName: "Jane (Strathmore)", text: "Done! Checked with standard ping diagnostics and VoIP jitter has dropped to 2ms.", timestamp: "Yesterday" }
    ]
  },
  {
    id: "sharon-mentor",
    name: "Sharon (Safaricom Mentor)",
    type: "private",
    lastMessage: "Your CV suggestions are live. Let's do a mock interview.",
    unreadCount: 1,
    avatar: "👩‍💼",
    messages: [
      { id: "1", sender: "other", senderName: "Sharon", text: "Hi! I looked at your interests. I highly recommend trying out the Opportunities & Interview Prep AI in our main dashboard.", timestamp: "08:00 AM" },
      { id: "2", sender: "other", senderName: "Sharon", text: "It matches standard Cisco networking exam templates.", timestamp: "08:02 AM" }
    ]
  },
  {
    id: "hackathon-planning",
    name: "UoN Transit Hackathon Hub",
    type: "threaded",
    lastMessage: "Has anyone loaded the route layout GPS files?",
    unreadCount: 0,
    avatar: "🏎️",
    membersCount: 8,
    messages: [
      { id: "1", sender: "other", senderName: "Michael", text: "I generated the vector nodes representing Thika Road and Mombasa Road coordinates.", timestamp: "Wednesday" },
      { id: "2", sender: "user", senderName: "Me", text: "Perfect, we can plot them directly in the smart navigation map component.", timestamp: "Wednesday" }
    ]
  }
];

export const INITIAL_TASKS: TaskItem[] = [
  { id: "t1", title: "Verify SIP Gateway Trunk parameters", category: "Research", deadline: "June 27, 2026", completed: false },
  { id: "t2", title: "Submit UoN Route Optimization CAD Schema", category: "Assignment", deadline: "June 29, 2026", completed: true },
  { id: "t3", title: "Cisco VoIP webinar at 3:00 PM", category: "Event Reminder", deadline: "Today", completed: false },
  { id: "t4", title: "Practice AI interview preparer questionnaire", category: "Call Meeting", deadline: "June 30, 2026", completed: false }
];

export const INITIAL_CAD_FILES: CadFile[] = [
  { id: "cad1", title: "IoT Smart Irrigation PCB", author: "Abdi (JKUAT)", category: "PCB Design", fileSize: "4.8 MB", views: 245, downloads: 89, vectorSchema: "mesh" },
  { id: "cad2", title: "Robotics Arm Joint Connector", author: "Wanjiku (Kabete TVET)", category: "Mechanical Enclosure", fileSize: "12.4 MB", views: 189, downloads: 43, vectorSchema: "complex" },
  { id: "cad3", title: "5.8GHz Patch Antenna Array", author: "Dr. Mwangi (UoN)", category: "RF Antenna", fileSize: "2.1 MB", views: 420, downloads: 156, vectorSchema: "circle" }
];

export const INITIAL_EVENTS: EventDetail[] = [
  {
    id: "ev1",
    title: "Cisco Enterprise VoIP & Unified Communications Workshop",
    host: "Eng. Hillary Rono",
    date: "2026-06-28",
    time: "2:00 PM - 4:00 PM",
    type: "Webinar",
    location: "JR INVENTO Virtual Conference Hall 3",
    registered: true,
    ticketCode: "JR-VOIP-7730",
    description: "Learn SIP trunks, jitter buffer strategies, and standard QoS deployment parameters on enterprise-grade networks.",
    attendeesCount: 342
  },
  {
    id: "ev2",
    title: "Kenyan Engineering Hackathon 2026",
    host: "JR INVENTO Academic Board",
    date: "2026-07-10",
    time: "8:00 AM onwards",
    type: "Hackathon",
    location: "Main Auditorium, University of Nairobi",
    registered: false,
    description: "Pitching global inventions, IoT solutions, TVET machinery improvements, and agricultural drone software. Over 100,000 KES in grants.",
    attendeesCount: 890
  },
  {
    id: "ev3",
    title: "Safaricom 5G Cloud Microservices Department Briefing",
    host: "Sylvia Njeri",
    date: "2026-06-30",
    time: "11:00 AM",
    type: "Department Meet",
    location: "Virtual Meeting Room 8",
    registered: false,
    description: "Overview of cloud-native systems, security compliance (GDPR/Kenya Data Protection Act), and container orchestration.",
    attendeesCount: 150
  }
];

export const INITIAL_SOCIAL_ACCOUNTS: SocialMediaAccount[] = [
  { platform: "LinkedIn", linked: true, username: "john_ragot_invento", followers: 1250, engagementRate: "8.4%", recentNotifications: ["Sylvia Njeri viewed your profile", "Cisco Systems posted a vacancy"] },
  { platform: "GitHub", linked: true, username: "ragotjohn", followers: 45, engagementRate: "12.1%", recentNotifications: ["Your repository JKT-VoIP-Client was starred", "KabetePoly committed to main"] },
  { platform: "WhatsApp", linked: false, username: "", followers: 0, engagementRate: "0.0%", recentNotifications: [] },
  { platform: "X", linked: true, username: "ragot_j", followers: 320, engagementRate: "4.2%", recentNotifications: ["IEEE Kenya Section retweeted your hackathon post"] },
  { platform: "YouTube", linked: false, username: "", followers: 0, engagementRate: "0.0%", recentNotifications: [] },
  { platform: "Telegram", linked: false, username: "", followers: 0, engagementRate: "0.0%", recentNotifications: [] }
];
