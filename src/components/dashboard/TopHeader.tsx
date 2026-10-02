"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSalon } from "@/context/SalonContext";
import {
  Scissors,
  Plus,
  ExternalLink,
  Menu,
  X,
  Clock,
  Sparkles,
  CalendarDays,
  Users,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { formatDatePretty } from "@/lib/utils";

interface TopHeaderProps {
  onNewBookingClick?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onNewBookingClick }) => {
  const { salon, barbers, appointments } = useSalon();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const activeBarbers = barbers.filter((b) => b.isActive).length;

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 py-3.5 bg-[#0E131E]/95 backdrop-blur-md border-b border-[#232D42]">
        {/* Left Mobile Brand / Desktop Context */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg bg-[#161D2C] text-slate-300 hover:text-white border border-[#232D42]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">{salon.name}</span>
                <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-medium">
                  صالون مباشر
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {salon.address} • {salon.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions & Clock */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Live Date/Time Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161D2C] border border-[#232D42] text-xs text-slate-300">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span className="font-medium text-white">{currentTime}</span>
            <span className="text-slate-500">|</span>
            <span>{formatDatePretty(todayStr)}</span>
          </div>

          {/* Quick External Booking Link */}
          <Link
            href={`/book/${salon.slug}`}
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#161D2C] hover:bg-[#1E2638] border border-[#232D42] rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
            <span>صفحة الحجز</span>
          </Link>

          {/* New Appointment / Walk-in Button */}
          {onNewBookingClick && (
            <button
              onClick={onNewBookingClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-black bg-brand-500 hover:bg-brand-400 active:scale-95 rounded-lg shadow-md shadow-brand-600/20 transition-all"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>حجز جديد</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-[#0E131E] border-r border-[#232D42] h-full flex flex-col p-5 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-[#232D42]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-black font-bold">
                  <Scissors className="w-4 h-4 text-black" />
                </div>
                <span className="font-bold text-white text-sm">{salon.name}</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {[
                { name: "نظرة عامة", href: "/dashboard", icon: LayoutDashboard },
                { name: "المواعيد", href: "/dashboard/appointments", icon: CalendarDays },
                { name: "الحلاقون", href: "/dashboard/barbers", icon: Scissors },
                { name: "الخدمات", href: "/dashboard/services", icon: Sparkles },
                { name: "العملاء", href: "/dashboard/customers", icon: Users },
                { name: "الإعدادات", href: "/dashboard/settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-[#161D2C] hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4 text-brand-400" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#232D42]">
              <Link
                href={`/book/${salon.slug}`}
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-brand-500 text-black text-xs font-semibold shadow-md"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>فتح صفحة الحجز العامة</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
