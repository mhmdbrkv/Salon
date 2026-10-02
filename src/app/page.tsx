"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Scissors,
  CalendarCheck,
  Clock,
  Users,
  Smartphone,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { formatEGP } from "@/lib/utils";

export default function LandingPage() {
  const [earlyAccessModalOpen, setEarlyAccessModalOpen] = useState(false);
  const [salonName, setSalonName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleEarlyAccessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setEarlyAccessModalOpen(false);
      setSubmitted(false);
      setSalonName("");
      setOwnerPhone("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-black">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0B0F17]/90 backdrop-blur-md border-b border-[#232D42] px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-black font-bold shadow-lg shadow-brand-500/20">
              <Scissors className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-bold text-lg text-white font-display tracking-tight block leading-none">
                Baraka
              </span>
              <span className="text-[10px] text-brand-400 font-semibold tracking-wider uppercase">
                Barbershop OS
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#problem" className="hover:text-white transition-colors">
              The Problem
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <Link
              href="/book/baraka-barbershop"
              target="_blank"
              className="text-brand-300 hover:text-brand-200 transition-colors"
            >
              Customer Booking Live
            </Link>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#161D2C] hover:bg-[#1E2638] text-slate-200 border border-[#232D42] transition-colors"
            >
              View Demo
            </Link>
            <button
              onClick={() => setEarlyAccessModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-400 text-black shadow-lg shadow-brand-500/20 transition-all"
            >
              Get Early Access
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 border-b border-[#232D42]">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built Exclusively for Modern Barbershops</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight leading-[1.15]">
            Manage your barbershop in one place.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-amber-300 to-brand-500">
              Let customers book the right barber at the right time.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Stop losing appointments to cluttered WhatsApp chats, notebook scribbles, and double
            bookings. Give your clients a 60-second booking link while your staff focus on precision
            cuts.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => setEarlyAccessModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Get Early Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/demo"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#161D2C] hover:bg-[#1E2638] text-slate-200 border border-[#232D42] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>View Interactive Demo</span>
            </Link>
          </div>

          {/* Live Preview Teaser Card */}
          <div className="pt-10 max-w-4xl mx-auto">
            <div className="bg-[#121826] border border-[#232D42] rounded-2xl p-4 sm:p-6 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between border-b border-[#232D42] pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-white">Live Floor Status: Baraka Barbershop</span>
                </div>
                <span className="text-slate-400 font-mono">Today&apos;s Schedule</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#161D2C] border border-[#232D42]">
                  <span className="text-slate-400 block text-[11px]">Chair 1 (Ahmed Hassan)</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                    <Scissors className="w-3.5 h-3.5" /> Cutting Haircut + Beard (Tarek E.)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#161D2C] border border-[#232D42]">
                  <span className="text-slate-400 block text-[11px]">Chair 2 (Mohamed Ali)</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Next at 15:00 (Nader S.)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#161D2C] border border-[#232D42]">
                  <span className="text-slate-400 block text-[11px]">Today&apos;s Revenue</span>
                  <span className="font-bold text-white text-sm font-mono mt-0.5 block">
                    {formatEGP(2450)} (12 Completed)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section id="problem" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#232D42] bg-[#0E131E]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Why Traditional Barbershop Scheduling Breaks Down
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Running a busy shop with 3–10 barbers is chaotic when relying on outdated habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#121826] border border-rose-950/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-900/60 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">WhatsApp Voice Note Chaos</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customers message asking &ldquo;Are you free at 6?&rdquo; while you are holding scissors.
                By the time you reply, the chair is taken or they went elsewhere.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121826] border border-rose-950/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-900/60 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Paper Notebook Collisions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                One barber writes in pencil, another books the same slot on WhatsApp. Two clients
                show up at 7:00 PM expecting the same chair.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121826] border border-rose-950/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-900/60 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">No Show Revenue Leaks</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Without structured time slots and clear availability tracking, empty chairs eat into
                your daily profit margins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION & KEY FEATURES */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#232D42]">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
              The Purpose-Built Solution
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              Everything Your Salon Floor Needs to Run Like Clockwork
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Conflict-Free Slot Engine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculates precise open windows based on service duration (e.g. 45 min cut vs 20 min
                beard) and individual barber shift hours. Overlapping bookings are impossible.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">60-Second Mobile Booking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Drop your booking link in your Instagram bio or WhatsApp autoreply. Clients pick
                their barber, date, and time in 4 simple taps without creating accounts.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Barber Shifts & Skills</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Set weekly off-days, start and finish hours, and authorized services for each
                barber. If a barber is off on Friday, customers cannot book them.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Real Daily Revenue KPIs</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track revenue generated only from completed cuts. See completed appointments, in-chair
                services, and no-shows at a glance.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Customer Visit History</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automatically build a client directory with total visits, lifetime spend, and last
                appointment dates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Walk-in Quick Creator</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A walk-in customer arrives? Register them with one click directly into the floor queue
                with instant auto-assignment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#232D42] bg-[#0E131E]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              How Baraka Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Two seamless experiences designed for speed and clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Salon Owner Journey */}
            <div className="bg-[#121826] border border-[#232D42] rounded-2xl p-6 space-y-4">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">
                For The Salon Owner
              </span>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>Set up barbers, working shift hours, and weekly off days.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>Add services with pricing in EGP and duration minutes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>Share your custom booking link on Instagram / WhatsApp.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span>Watch bookings appear in real time on your floor dashboard.</span>
                </li>
              </ul>
            </div>

            {/* Customer Journey */}
            <div className="bg-[#121826] border border-[#232D42] rounded-2xl p-6 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                For The Customer
              </span>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span>Opens link on phone via WhatsApp or Instagram.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span>Selects service (e.g. Haircut + Beard) and favorite barber.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span>Picks an open slot from available morning/afternoon/evening times.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
                    4
                  </span>
                  <span>Enters name and phone number — instant confirmation receipt!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#232D42] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Ready to upgrade your barbershop workflow?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Experience the live prototype with Egyptian barbershop seed data or request early access
            for your salon.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setEarlyAccessModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-sm shadow-xl shadow-brand-500/20 transition-all"
            >
              Get Early Access
            </button>
            <Link
              href="/demo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#161D2C] hover:bg-[#1E2638] text-white border border-[#232D42] font-semibold text-sm transition-colors"
            >
              Enter Live Demo
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B0F17] py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-brand-500" />
            <span className="font-bold text-slate-300">Baraka Barbershop Platform</span>
            <span>• Cairo, Egypt</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/demo" className="hover:text-white">
              Demo Portal
            </Link>
            <Link href="/book/baraka-barbershop" className="hover:text-white">
              Booking Page
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              Owner Dashboard
            </Link>
          </div>
        </div>
      </footer>

      {/* Early Access Modal */}
      {earlyAccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setEarlyAccessModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#121826] border border-[#232D42] rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232D42]">
              <div>
                <h3 className="text-base font-bold text-white font-display">Get Early Access</h3>
                <p className="text-xs text-slate-400">Join the waitlist for your salon</p>
              </div>
              <button
                onClick={() => setEarlyAccessModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">Thank you!</p>
                <p className="text-xs text-slate-400">
                  We will contact you shortly to onboard your salon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEarlyAccessSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Salon Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Al-Omda Barbershop"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Owner Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+20 100 123 4567"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs shadow-md shadow-brand-500/20"
                >
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
