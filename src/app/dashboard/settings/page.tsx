"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSalon } from "@/context/SalonContext";
import {
  Settings,
  Store,
  Clock,
  Phone,
  MapPin,
  Share2,
  Copy,
  Check,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const { salon, updateSalonSettings, resetToDefaultData } = useSalon();

  const [name, setName] = useState(salon.name);
  const [tagline, setTagline] = useState(salon.tagline);
  const [address, setAddress] = useState(salon.address);
  const [city, setCity] = useState(salon.city);
  const [phone, setPhone] = useState(salon.phone);
  const [openTime, setOpenTime] = useState(salon.openTime);
  const [closeTime, setCloseTime] = useState(salon.closeTime);
  const [slotInterval, setSlotInterval] = useState(salon.slotIntervalMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const bookingUrl = typeof window !== "undefined"
    ? `${window.location.origin}/book/${salon.slug}`
    : `https://baraka-barbershop.com/book/${salon.slug}`;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalonSettings({
      name,
      tagline,
      address,
      city,
      phone,
      openTime,
      closeTime,
      slotIntervalMinutes: Number(slotInterval),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white font-display">Salon Settings</h1>
        <p className="text-xs text-slate-400">
          Manage your barbershop profile, business hours, and customer booking link
        </p>
      </div>

      {/* Shareable Booking Link Card */}
      <div className="bg-gradient-to-br from-[#161D2C] via-[#1A2336] to-[#121826] border border-brand-500/30 rounded-2xl p-5 sm:p-6 shadow-gold-glow/10">
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="w-5 h-5 text-brand-400" />
          <h2 className="text-base font-bold text-white font-display">
            Your Customer Booking Link
          </h2>
        </div>
        <p className="text-xs text-slate-300 mb-4 max-w-xl">
          Share this link directly with your clients on WhatsApp, Instagram Bio, or Google Maps.
          Customers can book in under 60 seconds without creating an account.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 bg-[#0E131E] border border-[#232D42] rounded-xl px-3.5 py-2.5 text-xs text-brand-300 font-mono select-all truncate">
            {bookingUrl}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyBookingLink}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-brand-500 hover:bg-brand-400 text-black text-xs font-bold rounded-xl transition-all shadow-md"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
            </button>
            <Link
              href={`/book/${salon.slug}`}
              target="_blank"
              className="inline-flex items-center justify-center p-2.5 bg-[#1E2638] hover:bg-[#2A364F] text-slate-200 rounded-xl border border-[#232D42] transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-[#121826] border border-[#232D42] rounded-2xl p-6 space-y-6">
        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Salon settings updated successfully!</span>
          </div>
        )}

        {/* General Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-400" />
            <span>Shop Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Salon Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Tagline / Motto</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">City / Region</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-300 font-medium mb-1">Salon Official Phone *</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full sm:w-1/2 bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>
        </div>

        {/* Operating Hours */}
        <div className="pt-4 border-t border-[#232D42] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-400" />
            <span>Operating Hours & Booking Slots</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Opening Time</label>
              <input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Closing Time</label>
              <input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Slot Step Interval</label>
              <select
                value={slotInterval}
                onChange={(e) => setSlotInterval(Number(e.target.value))}
                className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
              >
                <option value={15}>Every 15 minutes</option>
                <option value={30}>Every 30 minutes (Standard)</option>
                <option value={45}>Every 45 minutes</option>
                <option value={60}>Every 60 minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#232D42] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (confirm("Reset demo data back to default state?")) {
                resetToDefaultData();
                setName(salon.name);
                setAddress(salon.address);
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs shadow-lg shadow-brand-500/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
