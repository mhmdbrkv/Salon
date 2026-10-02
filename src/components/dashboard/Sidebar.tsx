"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSalon } from "@/context/SalonContext";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  UserCheck,
  Settings,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { salon, resetToDefaultData, appointments, barbers } = useSalon();

  const navItems = [
    {
      name: "نظرة عامة",
      href: "/dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: "المواعيد",
      href: "/dashboard/appointments",
      icon: CalendarDays,
      badge: appointments.filter((a) => a.date === new Date().toISOString().split("T")[0] && a.status === "BOOKED").length || undefined,
    },
    {
      name: "الحلاقون",
      href: "/dashboard/barbers",
      icon: Scissors,
      badge: barbers.filter((b) => b.isActive).length,
    },
    {
      name: "الخدمات",
      href: "/dashboard/services",
      icon: Sparkles,
    },
    {
      name: "العملاء",
      href: "/dashboard/customers",
      icon: Users,
    },
    {
      name: "الإعدادات",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#232D42] bg-[#0E131E] min-h-screen text-slate-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#232D42] flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-black font-bold shadow-lg shadow-brand-600/20 group-hover:scale-105 transition-transform">
            <Scissors className="w-5 h-5 text-[#0B0F17]" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-wide font-display">
              {salon.name}
            </h1>
            <p className="text-xs text-brand-400 font-medium tracking-wider uppercase">
              بوابة الإدارة
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          القائمة الرئيسية
        </div>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group",
                isActive
                  ? "bg-brand-500/15 text-brand-300 border border-brand-500/30 font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#161D2C]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive
                      ? "text-brand-400"
                      : "text-slate-400 group-hover:text-slate-200"
                  )}
                />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs rounded-full font-medium",
                    isActive
                      ? "bg-brand-500 text-black font-bold"
                      : "bg-[#232D42] text-slate-300"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Live Booking Quick Action & Footer */}
      <div className="p-4 border-t border-[#232D42] space-y-3 bg-[#0B0F17]/60">
        <Link
          href={`/book/${salon.slug}`}
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-black transition-all shadow-md shadow-brand-500/20 group"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>فتح صفحة الحجز</span>
          </span>
          <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono">
            عميل
          </span>
        </Link>

        <div className="flex items-center justify-between pt-1 text-xs text-slate-500 px-1">
          <span className="text-[11px]">وضع العرض التجريبي</span>
          <button
            onClick={() => {
              if (confirm("هل تريد إعادة ضبط بيانات العرض إلى إعدادات البداية؟")) {
                resetToDefaultData();
              }
            }}
            title="إعادة ضبط العرض"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-brand-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>إعادة ضبط</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
