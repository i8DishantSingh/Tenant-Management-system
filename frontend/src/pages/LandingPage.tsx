import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  ArrowRight,
  Users,
  CreditCard,
  Wrench,
  MessageSquare,
  Menu,
  X,
  Smartphone,
  //   ShieldCheck,
  Zap,
  Layers,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#fafbfc] font-sans text-slate-800 antialiased selection:bg-[#1d5eff] selection:text-white">
      {/* GLOBAL ALERT BANNER */}
      <div className="bg-[#0f172a] text-white text-center py-2.5 px-4 text-xs font-medium tracking-wide">
        🚀 Apex PMS is{" "}
        <span className="text-emerald-400 font-semibold">100% Free</span> for
        standalone property operators. No credit card required.
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* Logo Identity */}
          <Link
            to="/"
            className="flex items-center space-x-2.5 text-[#0f172a] group"
          >
            <div className="bg-[#1d5eff] text-white p-2 rounded-xl shadow-sm group-hover:bg-blue-600 transition-colors">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Apex PMS</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center space-x-8 text-sm font-semibold text-slate-600 md:flex">
            <a
              href="#features"
              className="hover:text-[#1d5eff] transition-colors"
            >
              Core Features
            </a>
            <a
              href="#about-platform"
              className="hover:text-[#1d5eff] transition-colors"
            >
              Platform Philosophy
            </a>
            <a
              href="#mobile-ecosystem"
              className="hover:text-[#1d5eff] transition-colors"
            >
              Mobile Sync
            </a>
            <span className="h-4 w-px bg-slate-200"></span>
            <Link to="/auth" className="hover:text-[#1d5eff] transition-colors">
              Sign In
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1d5eff] px-5 py-2.5 text-white hover:bg-blue-600 shadow-sm transition-all hover:shadow-md"
            >
              Sign Up Free <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 md:hidden focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-6 py-5 space-y-4 shadow-xl md:hidden flex flex-col animate-in fade-in slide-in-from-top-5 duration-200">
            <a
              href="#features"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-semibold text-slate-600"
            >
              Core Features
            </a>
            <a
              href="#about-platform"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-semibold text-slate-600"
            >
              Platform Philosophy
            </a>
            <a
              href="#mobile-ecosystem"
              onClick={() => setIsMenuOpen(false)}
              className="text-sm font-semibold text-slate-600"
            >
              Mobile Sync
            </a>
            <hr className="border-slate-100" />
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Link
                to="/auth"
                className="flex items-center justify-center rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="flex items-center justify-center gap-1 rounded-xl bg-[#1d5eff] py-2.5 text-sm font-semibold text-white shadow-sm"
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* PREMIUM HIGH-AESTHETIC HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-b from-white to-slate-50/50 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 grid gap-16 lg:grid-cols-12 items-center">
          {/* Left Text Column */}
          <div className="space-y-8 lg:col-span-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#1d5eff]">
              <Zap className="h-3.5 w-3.5 fill-current" /> Complete Ecosystem
              for Landlords
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl leading-[1.1]">
              Streamline Your Entire <br className="hidden sm:inline" />
              <span className="text-[#1d5eff]">Rental Portfolio</span> <br />
              Effortlessly.
            </h1>

            <p className="mx-auto lg:mx-0 max-w-xl text-base sm:text-lg text-slate-500 leading-relaxed">
              Apex PMS provides a modern, centralized cloud workspace built to
              let landlords list structural assets, track live tenant groups,
              and handle complex billing metrics with zero subscription
              overhead.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d5eff] px-7 py-4 font-semibold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-600 hover:shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
              >
                Create Free Account <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Explore Workspace Features
              </a>
            </div>
          </div>

          {/* Right Aesthetic Dashboard Component Preview Mockup */}
          <div className="lg:col-span-6 flex justify-center relative">
            <div className="absolute inset-0 bg-linear-to-tr from-blue-400/10 to-indigo-500/5 blur-3xl -z-10 rounded-full transform scale-95"></div>

            <div className="w-full max-w-xl bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800 p-6 sm:p-8 text-white relative">
              {/* Window Controls Decorative */}
              <div className="flex space-x-1.5 mb-6">
                <span className="h-3 w-3 rounded-full bg-slate-700"></span>
                <span className="h-3 w-3 rounded-full bg-slate-700"></span>
                <span className="h-3 w-3 rounded-full bg-slate-700"></span>
              </div>

              <div className="space-y-5">
                {/* Simulated Header block */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Live Workspace
                    </p>
                    <h3 className="text-base font-bold text-slate-200">
                      Control Hub Matrix
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>{" "}
                    Synced
                  </span>
                </div>

                {/* Simulated UI Cards inside viewport */}
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 text-[#1d5eff] rounded-lg">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">
                          Property Matrix Grid
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          All 12 architecture units compiled cleanly
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">
                          Utility Split Allocation
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          Automated room maintenance splits updated
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                      Executed
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">
                          System Dispatcher Queue
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          WhatsApp & SMS text logs clear
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEEPER PROJECT INFORMATION PROSE */}
      <section
        id="about-platform"
        className="bg-white py-16 lg:py-24 border-y border-slate-100"
      >
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#1d5eff]">
            Why Apex PMS?
          </h2>
          <p className="text-3xl font-bold tracking-tight text-[#0f172a] sm:text-4xl">
            A radical new approach to real estate operational control.
          </p>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed text-left max-w-3xl mx-auto">
            Traditional tenant management systems gate essential utility
            processing software behind complex multi-tiered paywalls. Apex PMS
            challenges this by delivering an institutional-grade, zero-cost
            operations dashboard.
          </p>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed text-left max-w-3xl mx-auto">
            Whether you are managing single rooms or full-scale community
            residential buildings, our architecture ensures you remain
            organized, protected, and completely hands-off as a landlord.
          </p>
        </div>
      </section>

      {/* CORE FEATURES SECTOR */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Core Features
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            Everything you need to automate tenant portfolios from a single,
            unified interface.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            title="Property & Tenant Manager"
            description="Organize precise unit details, rooms matrices, dynamic lease timelines, and continuous tenant profiles securely in seconds."
          />
          <FeatureCard
            icon={<CreditCard className="h-5 w-5 text-emerald-600" />}
            title="Automated Billing & Payments"
            description="Generate complex split invoices for multi-room utilities and rent obligations, capturing permanent digital transaction histories."
          />
          <FeatureCard
            icon={<Wrench className="h-5 w-5 text-amber-600" />}
            title="Smart Maintenance Tracker"
            description="Log, organize, and manage physical repair work orders, assignment statuses, and technician logs for every structural layout."
          />
          <FeatureCard
            icon={<MessageSquare className="h-5 w-5 text-indigo-600" />}
            title="Automated Reminders"
            description="Dispatches crucial automated WhatsApp messages and SMS balance alerts to outstanding balances prior to payment cycles cleanly."
          />
        </div>
      </section>

      {/* MINIMAL STREAMLINED MOBILE COMPANION BANNER */}
      <section
        id="mobile-ecosystem"
        className="bg-[#0f172a] text-white py-20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2"></div>

        <div className="mx-auto max-w-5xl px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-2.5 py-1 text-xs font-semibold text-blue-400">
              <Smartphone className="h-3.5 w-3.5" /> Native Cross-Platform Sync
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Mobile Application Companions
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              While our dense dashboard workspace functions on desktop browsers
              today, native mobile smartphone application synchronization
              structures are engineered to drop alongside the core web system,
              allowing absolute asset tracking on the go.
            </p>
          </div>
          <div className="shrink-0 bg-slate-900 border border-slate-800 rounded-xl p-5 px-6 flex items-center gap-3 shadow-xl">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs font-mono tracking-wider text-slate-300">
              iOS & Android Build Pipeline Active
            </span>
          </div>
        </div>
      </section>

      {/* FINAL HIGH CONVERSION VALUE CALL-TO-ACTION */}
      <section className="mx-auto max-w-5xl px-6 py-20 text-center space-y-6">
        <div className="inline-block bg-emerald-50 text-emerald-700 rounded-full px-3 py-1 text-xs font-semibold">
          🛡️ Secure & Private Data Layer
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Ready to manage your housing network digitally?
        </h2>
        <p className="mx-auto max-w-lg text-slate-500 text-sm sm:text-base">
          Get started instantly with the standalone portfolio manager layout.
          Always unrestricted, always fully operational.
        </p>
        <div className="pt-4">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1d5eff] px-8 py-3.5 font-bold text-white shadow-md hover:bg-blue-600 transition-colors"
          >
            Deploy Your Free Dashboard Now
          </Link>
        </div>
      </section>

      {/* MINIMALIST INFORMATIONAL FOOTER */}
      <footer className="bg-white border-t border-slate-100 px-6 py-12 lg:px-8 text-sm text-slate-500">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-8 md:grid-cols-4 mb-12">
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/about"
                  className="hover:text-slate-800 transition-colors"
                >
                  About Workspace
                </Link>
              </li>
              <li>
                <Link
                  to="/signup"
                  className="hover:text-slate-800 transition-colors"
                >
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-800 cursor-pointer transition-colors">
                Company Hub
              </li>
              <li className="hover:text-slate-800 cursor-pointer transition-colors">
                Developer Blog
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-800 cursor-pointer transition-colors">
                FAQs
              </li>
              <li className="hover:text-slate-800 cursor-pointer transition-colors">
                Privacy Courtesy
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-slate-800 cursor-pointer transition-colors">
                Contact Support
              </li>
            </ul>
          </div>
        </div>
        <div className="mx-auto max-w-7xl border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © 2026 Apex Property Software Engine Inc. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// Reusable Feature Card Component
function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-300/80 transition-all duration-200">
      <div>
        <div className="mb-4 inline-block bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
          {icon}
        </div>
        <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
