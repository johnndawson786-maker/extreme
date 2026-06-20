import React, { useState } from 'react';
import {
  Printer,
  Search,
  Download,
  Wrench,
  MessageCircle,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Phone,
  Mail,
  Globe,
  FileText,
  PlayCircle,
  Cpu,
  Wifi,
  Droplet,
  RefreshCw,
  Star,
} from 'lucide-react';

/**
 * Helix Support — a fictional printer-support website built for testing/demo purposes.
 * Original layout and content. Not affiliated with any real brand.
 */

const NAV_LINKS = ['Products', 'Software & Drivers', 'Support', 'Community', 'My Account'];

const QUICK_ACTIONS = [
  {
    icon: Download,
    title: 'Software & Drivers',
    desc: 'Download the latest drivers, firmware and Helix Smart app for your printer.',
    cta: 'Get downloads',
  },
  {
    icon: Wrench,
    title: 'Diagnose & Fix',
    desc: 'Run an automated check to detect and resolve common printing problems.',
    cta: 'Start diagnostics',
  },
  {
    icon: MessageCircle,
    title: 'Contact Support',
    desc: 'Chat with a virtual agent or connect with a Helix specialist 24/7.',
    cta: 'Contact us',
  },
  {
    icon: ShieldCheck,
    title: 'Warranty & Repair',
    desc: 'Check your warranty status, register a product, or request a repair.',
    cta: 'Check warranty',
  },
];

const CATEGORIES = [
  { icon: Printer, label: 'Inkjet Printers' },
  { icon: Cpu, label: 'LaserJet Printers' },
  { icon: Droplet, label: 'Ink & Toner' },
  { icon: Wifi, label: 'Wireless Setup' },
  { icon: FileText, label: 'Scanning & Copy' },
  { icon: RefreshCw, label: 'Updates & Firmware' },
];

const POPULAR_TOPICS = [
  'Printer is offline or not responding',
  'Connect printer to a Wi-Fi network',
  'Fix paper jams and feed errors',
  'Install or update printer drivers',
  'Improve print quality and fix streaks',
  'Replace ink or toner cartridges',
  'Scan documents to a computer',
  'Reset printer to factory settings',
];

const RESOURCES = [
  {
    icon: PlayCircle,
    title: 'Video Tutorials',
    desc: 'Step-by-step setup and troubleshooting walkthroughs.',
  },
  {
    icon: FileText,
    title: 'User Guides & Manuals',
    desc: 'Browse product documentation and specifications.',
  },
  {
    icon: Globe,
    title: 'Community Forum',
    desc: 'Ask questions and get answers from other Helix users.',
  },
];

const FAQS = [
  {
    q: 'How do I find my printer model and serial number?',
    a: 'The model name is printed on the front of the device. The serial number is on a label on the back or underside, beginning with "HX". You can also find both in the Helix Smart app under Device Information.',
  },
  {
    q: 'Where can I download drivers for my printer?',
    a: 'Open the Software & Drivers section, enter your printer model or serial number, and select your operating system. The recommended driver package will be listed first.',
  },
  {
    q: 'My printer shows as offline. What should I do?',
    a: 'Make sure the printer is powered on and connected to the same network as your computer. Restart both devices, then run the Diagnose & Fix tool to reset the print spooler automatically.',
  },
  {
    q: 'How do I check my warranty status?',
    a: 'Go to Warranty & Repair and enter your serial number. You will see your coverage start and end dates, plus options to extend coverage or request a repair.',
  },
];

const SupportSite: React.FC = () => {
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top utility bar */}
      <div className="bg-slate-900 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-between">
          <span className="hidden sm:block">Helix Support — testing/demo environment</span>
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-1 hover:text-white transition-colors">
              <Globe size={13} /> United States
            </a>
            <a href="#" className="hover:text-white transition-colors">Sign in</a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <Printer className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Helix<span className="text-blue-600">Support</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" className="hover:text-blue-600 transition-colors whitespace-nowrap">
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
              <Phone size={15} /> Call us
            </button>
            <button
              className="lg:hidden p-2 text-slate-700"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href="#"
                className="py-2 px-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {l}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,white,transparent_45%),radial-gradient(circle_at_80%_60%,white,transparent_40%)]" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            How can we help you today?
          </h1>
          <p className="mt-4 text-blue-100 text-base sm:text-lg">
            Find drivers, manuals, troubleshooting steps and support for your Helix printer.
          </p>

          <form
            className="mt-8 max-w-2xl mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden p-1.5">
              <Search className="ml-4 text-slate-400 shrink-0" size={20} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product name, model, or serial number…"
                className="flex-1 px-3 py-2.5 text-slate-800 placeholder-slate-400 outline-none text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-5 sm:px-7 py-2.5 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
            <p className="mt-3 text-xs text-blue-100">
              Popular: Helix InkTank 4100 &middot; LaserJet Pro M200 &middot; OfficeWave 9000
            </p>
          </form>
        </div>
      </section>

      {/* Quick actions */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {QUICK_ACTIONS.map((a) => (
            <div
              key={a.title}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-6 flex flex-col"
            >
              <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <a.icon size={22} />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">{a.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500 flex-1">{a.desc}</p>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:gap-2 transition-all"
              >
                {a.cta} <ChevronRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Browse by category */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Browse support by category</h2>
            <p className="text-slate-500 mt-1">Choose a topic to find guides and solutions.</p>
          </div>
          <a href="#" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600">
            View all <ChevronRight size={16} />
          </a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((c) => (
            <a
              key={c.label}
              href="#"
              className="group bg-white rounded-xl border border-slate-200 p-5 flex flex-col items-center text-center gap-3 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                <c.icon size={22} />
              </div>
              <span className="text-sm font-medium text-slate-700">{c.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Popular topics + Drivers callout */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Popular help topics</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {POPULAR_TOPICS.map((t) => (
                <a
                  key={t}
                  href="#"
                  className="flex items-center justify-between gap-3 p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-700">{t}</span>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 shrink-0" />
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 flex flex-col">
            <Download size={28} className="text-cyan-400" />
            <h3 className="mt-4 text-xl font-bold">Helix Smart App</h3>
            <p className="mt-2 text-slate-300 text-sm flex-1">
              Set up your printer, order ink automatically, scan on the go, and get guided fixes —
              all from one app.
            </p>
            <div className="mt-4 flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
              <span className="ml-2 text-xs text-slate-400">4.8 · 120k ratings</span>
            </div>
            <button className="mt-5 px-5 py-2.5 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors">
              Download the app
            </button>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">More ways to get help</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {RESOURCES.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-xl border border-slate-200 p-7 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <r.icon size={26} />
              </div>
              <h3 className="mt-4 font-bold text-slate-900">{r.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="border border-slate-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-semibold text-slate-800 text-sm sm:text-base">{f.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-blue-600 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open && (
                    <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">{f.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold">Still need help?</h2>
            <p className="text-blue-100 mt-1">Our support team is available 24/7.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors">
              <MessageCircle size={18} /> Start a chat
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-800/40 ring-1 ring-white/40 text-white font-semibold hover:bg-blue-800/60 transition-colors">
              <Phone size={18} /> 1-800-HELIX-00
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Printer className="text-white" size={17} />
              </div>
              <span className="text-lg font-bold text-white">HelixSupport</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              A fictional printer-support site created for testing and demonstration purposes only.
            </p>
          </div>

          {[
            { h: 'Support', items: ['Drivers & Software', 'Manuals', 'Diagnostics', 'Warranty'] },
            { h: 'Products', items: ['Inkjet', 'LaserJet', 'Ink & Toner', 'Accessories'] },
            { h: 'Company', items: ['About', 'Contact', 'Privacy', 'Terms'] },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="text-white font-semibold mb-3">{col.h}</h4>
              <ul className="space-y-2">
                {col.items.map((it) => (
                  <li key={it}>
                    <a href="#" className="hover:text-white transition-colors">{it}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span>© {new Date().getFullYear()} Helix Support (demo). All rights reserved.</span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white flex items-center gap-1">
                <Mail size={13} /> support@helix.example
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SupportSite;
