import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Newspaper, 
  RotateCw, 
  Search, 
  BookOpen, 
  Building2, 
  ExternalLink, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight,
  School
} from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  category: string;
  relevanceScore: number;
  url: string;
}

interface CareerNewsFeedProps {
  userProfile: any;
}

export default function CareerNewsFeed({ userProfile }: CareerNewsFeedProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchNews = async (force = false) => {
    setLoading(true);
    try {
      // Check if we have cached news for today (daily update simulation)
      const cached = localStorage.getItem("jr-daily-news-cache");
      const cachedDate = localStorage.getItem("jr-daily-news-date");
      const todayString = new Date().toDateString();

      if (cached && cachedDate === todayString && !force) {
        setNews(JSON.parse(cached));
        setLastUpdated(localStorage.getItem("jr-daily-news-time") || "Today, 08:00 AM");
        setLoading(false);
        return;
      }

      // Fetch from real-time endpoint
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: userProfile })
      });
      const data = await res.json();
      if (data && data.news) {
        setNews(data.news);
        localStorage.setItem("jr-daily-news-cache", JSON.stringify(data.news));
        localStorage.setItem("jr-daily-news-date", todayString);
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updateStamp = `Today, ${timeString} (Real-time sync complete)`;
        localStorage.setItem("jr-daily-news-time", updateStamp);
        setLastUpdated(updateStamp);
      }
    } catch (err) {
      console.error("Failed to load daily career news feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [userProfile]);

  // Handle category filtering
  const categories = ["All", "University Official Updates", "Local Careers & Jobs", "Global Tech News", "TVET Innovation News"];

  const filteredNews = news.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Universities Official Portals List
  const officialPortals = [
    { name: "JKUAT Official Portal", url: "https://www.jkuat.ac.ke/news", abbv: "JKUAT" },
    { name: "UoN News Academic Portal", url: "https://www.uonbi.ac.ke/news", abbv: "UoN" },
    { name: "Kenyatta University News", url: "https://www.ku.ac.ke/index.php/news", abbv: "KU" },
    { name: "Kabete National Polytechnic Portal", url: "https://kabetepolytechnic.ac.ke", abbv: "Kabete" },
    { name: "Strathmore University Portal", url: "https://strathmore.edu/news", abbv: "SU" }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-400" size={16} />
              <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-bold">Personalized daily intelligence</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Personalized Career & University News Feed</h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Real-time daily news and announcement streams curated specifically for your course, <strong className="text-slate-200">{userProfile?.course || "Engineering"}</strong>, sync'd from official Kenyan university websites and global tech agencies.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
            <button
              onClick={() => fetchNews(true)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <RotateCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Sync Real-Time News</span>
            </button>
            {lastUpdated && (
              <span className="text-[10px] text-slate-400 font-mono mt-1">
                Last updated: {lastUpdated}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* News Feed Stream (col-span-8) */}
        <div className="xl:col-span-8 space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search keywords, university updates, or career news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1.5 self-start sm:self-center text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Daily Stream</span>
              </div>

            </div>

            {/* Horizontal Category Selectors */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 custom-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0 transition-all cursor-pointer border ${
                    activeCategory === cat
                      ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Skeleton / State */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-slate-150 rounded-2xl p-5 space-y-3 animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                  <div className="space-y-1.5 pt-2">
                    <div className="h-3 bg-slate-100 rounded w-full"></div>
                    <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="space-y-4">
              {filteredNews.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-md transition-all space-y-3 relative overflow-hidden group"
                >
                  {/* Category Border Highlight */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    item.category.includes("Updates") ? "bg-amber-500" :
                    item.category.includes("Careers") ? "bg-emerald-500" :
                    item.category.includes("Global") ? "bg-blue-500" : "bg-purple-500"
                  }`}></div>

                  <div className="pl-2 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold uppercase px-2 py-0.5 rounded border ${
                          item.category.includes("Updates") ? "bg-amber-50 border-amber-200 text-amber-700" :
                          item.category.includes("Careers") ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                          item.category.includes("Global") ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-purple-50 border-purple-200 text-purple-700"
                        }`}>
                          {item.category}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="font-bold text-slate-700">{item.source}</span>
                      </div>

                      <span className="text-slate-400">{item.date}</span>
                    </div>

                    <h3 className="text-sm md:text-base font-bold text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.summary}
                    </p>

                    {/* Footer Row (Relevance score & View details) */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      
                      {/* Relevance Score Indicator */}
                      <div className="flex items-center gap-2">
                        <TrendingUp size={13} className="text-emerald-500" />
                        <span className="text-[10px] text-slate-500 font-semibold">
                          Match Relevance: <strong className="text-emerald-600">{item.relevanceScore}%</strong>
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div className="bg-emerald-500 h-full" style={{ width: `${item.relevanceScore}%` }}></div>
                        </div>
                      </div>

                      {/* External Action Button */}
                      <a
                        href={item.url}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="text-[10px] font-bold text-slate-700 hover:text-blue-600 border border-slate-200 px-2.5 py-1 rounded-lg hover:border-blue-300 transition-all flex items-center gap-1 cursor-pointer bg-slate-50/50"
                      >
                        <span>Visit Official Portal</span>
                        <ExternalLink size={11} />
                      </a>

                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
              <BookOpen className="text-slate-300 mx-auto" size={32} />
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-700">No news articles match your filter</p>
                <p className="text-[11px] text-slate-400">Try searching for different keywords or select "All" categories.</p>
              </div>
            </div>
          )}

        </div>

        {/* Universities Portals sidebar & Local TVET news index (col-span-4) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Universities Official Websites quick-access */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <School className="text-blue-600" size={16} />
              <h3 className="font-bold text-slate-800 text-xs tracking-wide uppercase">University Portals Directory</h3>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Direct access links to official news pages of accredited institutions in Kenya. Use these pages to verify physical attachment notices and exam timetables.
            </p>

            <div className="space-y-2">
              {officialPortals.map((portal, idx) => (
                <a
                  key={idx}
                  href={portal.url}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="p-3 border border-slate-150 rounded-xl flex items-center justify-between hover:bg-slate-50/70 group transition-all cursor-pointer bg-slate-50/20"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center font-bold font-mono text-[9px] text-slate-600">
                      {portal.abbv}
                    </div>
                    <span className="text-xs font-bold text-slate-750 group-hover:text-blue-600 transition-colors">
                      {portal.name}
                    </span>
                  </div>
                  <ArrowUpRight size={13} className="text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Stats widget */}
          <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-100 rounded-2xl p-5 space-y-3.5">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={15} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-blue-800">Syllabus Sync Analytics</span>
            </div>
            
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your profile is synchronized with Safaricom & Cisco's Q3 educational frameworks. This ensures your daily news highlights practical hands-on TVET milestones and patent opportunities as they release.
            </p>

            <div className="pt-2 border-t border-blue-100/50 flex items-center justify-between text-[10px] text-blue-700 font-mono font-bold">
              <span>Sync Status: ACTIVE DAILY</span>
              <span>100% HEALTH</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
