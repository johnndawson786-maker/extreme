
import React, { useState } from 'react';
import { Mail, Lock, Loader2, Info, X, CheckCircle, FileText, AlertTriangle, Headset } from 'lucide-react';
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// Custom ER Logo Component
const ERLogo = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4z" fill="currentColor"/>
    <text x="50%" y="62%" textAnchor="middle" fill="white" fontSize="8" fontWeight="900" fontFamily="sans-serif">The Extreme</text>
  </svg>
);

interface LoginProps {
  onLogin: (email: string) => void;
  isDarkMode: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGuidelines, setShowGuidelines] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) { 
      setError("Please enter both email and password."); 
      return; 
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      const user = userCredential.user;

      try {
        const sessionDocRef = doc(db, "active_sessions", cleanEmail);
        const sessionDoc = await getDoc(sessionDocRef);

        let currentBrowserId = localStorage.getItem("er_browser_id");
        if (!currentBrowserId) {
          currentBrowserId = Math.random().toString(36).substring(7);
          localStorage.setItem("er_browser_id", currentBrowserId);
        }

        if (sessionDoc.exists()) {
          const activeSessionData = sessionDoc.data();
          const lastActive = activeSessionData.lastActive || 0;
          const now = Date.now();
          
          if (activeSessionData.browserId !== currentBrowserId && (now - lastActive < 60000)) {
            setError("Access Denied: Account active on another device. Please wait 60 seconds for auto-timeout.");
            setLoading(false);
            return;
          }
        }

        await setDoc(sessionDocRef, {
          email: cleanEmail,
          browserId: currentBrowserId,
          lastActive: Date.now(),
          status: "active"
        });

      } catch (firestoreErr: any) {
        if (firestoreErr.code === 'permission-denied') {
          setError("System Error: Firestore Database rules are blocking access. Please update Firebase Security Rules.");
          setLoading(false);
          return;
        }
        throw firestoreErr;
      }

      onLogin(cleanEmail);
    } catch (err: any) {
      console.error("Auth Error:", err.code);
      let msg = "Authorization failed. Please check credentials.";
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") msg = "Incorrect password or email.";
      else if (err.code === "auth/too-many-requests") msg = "Too many attempts. Account temporary locked.";
      setError(msg);
    } finally { 
      setLoading(false); 
    }
  };

  const tools = [
    { name: "Email Blaster", icon: "🚀", url: "https://er-mailer.github.io/ER-Mailer---Download-Center/" },
    { name: "Ghost Scraper", icon: "👻", url: "https://er-mailer.github.io/ER-Ghost-Scraper/" },
    { name: "MS365 Uploader", icon: "☁️", url: "https://er-mailer.github.io/ER-MS365/" },
    { name: "RDP Center", icon: "🖥️", url: "https://er-mailer.github.io/RDP/" }
  ];

  const textPrimary = isDarkMode ? "text-white" : "text-slate-900";
  const textSecondary = isDarkMode ? "text-slate-400" : "text-slate-500";
  const cardBg = isDarkMode ? "bg-slate-800/40 border-slate-700/50" : "bg-white/80 border-slate-200 shadow-2xl shadow-indigo-200/50";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className={`w-full max-w-md p-8 backdrop-blur-xl rounded-[2.5rem] space-y-6 border relative overflow-hidden transition-all ${cardBg}`}>
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl mb-2 shadow-lg shadow-indigo-600/20">
            <ERLogo className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-black tracking-tight ${textPrimary}`}>The Extreme</h1>
          <p className={`${textSecondary} text-[10px] uppercase font-black tracking-[0.2em]`}>Restricted Access Control Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase ml-1 tracking-widest ${textSecondary}`}>Administrator Email</label>
            <div className="relative group">
              <Mail className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all text-sm font-medium border ${isDarkMode ? 'bg-slate-900/40 border-slate-700 focus:ring-indigo-500/50 text-slate-200 placeholder:text-slate-700' : 'bg-slate-50 border-slate-200 focus:ring-indigo-500/30 text-slate-900 placeholder:text-slate-400 shadow-inner'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] font-black uppercase ml-1 tracking-widest ${textSecondary}`}>Security Access Key</label>
            <div className="relative group">
              <Lock className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${isDarkMode ? 'text-slate-500 group-focus-within:text-indigo-400' : 'text-slate-400 group-focus-within:text-indigo-600'}`} />
              <input
                type="password"
                placeholder="Enter your password"
                className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none transition-all text-sm font-medium border ${isDarkMode ? 'bg-slate-900/40 border-slate-700 focus:ring-indigo-500/50 text-slate-200 placeholder:text-slate-700' : 'bg-slate-50 border-slate-200 focus:ring-indigo-500/30 text-slate-900 placeholder:text-slate-400 shadow-inner'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-500 text-[11px] font-bold uppercase tracking-tight leading-tight">{error}</p>
            </div>
          )}

          <button
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Access"}
          </button>
        </form>

        <div className="pt-2 relative z-10 flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <button 
              onClick={() => setShowGuidelines(true)}
              className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${textSecondary} hover:text-indigo-500`}
            >
              <Info className="w-3.5 h-3.5" /> Guidelines
            </button>
            <a 
              href="https://wa.me/+918585876735"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${textSecondary} hover:text-indigo-500`}
            >
              <Headset className="w-3.5 h-3.5" /> Support
            </a>
          </div>
          <span className={`${textSecondary} text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
            Encrypted Connection Active
          </span>
        </div>
      </div>

      {showGuidelines && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-lg">
          <div className={`w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className={`p-8 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <ERLogo className="w-5 h-5 text-indigo-500" />
                <h2 className={`text-xl font-black uppercase tracking-widest ${textPrimary}`}>System Guidelines</h2>
              </div>
              <button onClick={() => setShowGuidelines(false)} className={`p-2.5 transition-all rounded-full ${isDarkMode ? 'bg-slate-700/50 text-slate-400 hover:text-rose-400' : 'bg-slate-100 text-slate-500 hover:text-rose-500'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-500 font-black text-[11px] uppercase tracking-widest">
                    <FileText className="w-4 h-4" /> 01. Input Formats
                  </div>
                  <p className={`text-sm leading-relaxed ${textSecondary}`}>
                    The checker supports standard <b>Email:Password</b> combo lists or <b>Plain Email</b> lists. The system automatically parses and extracts the email address for validation.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-500 font-black text-[11px] uppercase tracking-widest">
                    <CheckCircle className="w-4 h-4" /> 02. Single Session Policy
                  </div>
                  <p className={`text-sm leading-relaxed ${textSecondary}`}>
                    To ensure security, accounts are limited to <b>One Active Session</b>. If you close your browser without logging out, the session will auto-expire after 60 seconds of inactivity.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-indigo-500 font-black text-[11px] uppercase tracking-widest">
                    <ERLogo className="w-4 h-4" /> 03. Security Protocols
                  </div>
                  <p className={`text-sm leading-relaxed ${textSecondary}`}>
                    All sessions are <b>End-to-End Encrypted</b>. Concurrent login attempts from different devices are blocked to protect your account integrity.
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-8 border-t flex justify-center ${isDarkMode ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <button onClick={() => setShowGuidelines(false)} className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg">Close Guidelines</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-16 w-full max-w-4xl px-4">
        <h2 className={`text-center text-[10px] font-black mb-8 uppercase tracking-[0.4em] ${textSecondary}`}>Verified Ecosystem Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`backdrop-blur-md p-6 rounded-[2rem] flex flex-col items-center justify-center space-y-3 transition-all border group shadow-sm hover:shadow-xl ${isDarkMode ? 'bg-slate-800/30 border-slate-700/30 hover:bg-slate-700/40 hover:border-indigo-500/40' : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}`}
            >
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{tool.icon}</span>
              <span className={`text-[10px] font-black text-center uppercase tracking-tighter transition-colors group-hover:text-indigo-600 ${textSecondary}`}>{tool.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
