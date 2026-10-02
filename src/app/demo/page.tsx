"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSalon } from "@/context/SalonContext";
import { Scissors, Sparkles, ArrowRight, Store, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  const router = useRouter();
  const { salon, barbers, services, appointments } = useSalon();

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md w-full bg-[#121826] border border-[#232D42] rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto text-black font-bold shadow-xl shadow-brand-500/20">
          <Scissors className="w-8 h-8 text-black" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold uppercase tracking-wider">
            تجربة المنتج التفاعلية
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
            دخول {salon.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            تم تجهيزها ببيانات صالون القاهره، وأسماء الحلاقين، وجدول اليوم، ومراحل الحجز المباشر.
          </p>
        </div>

        <div className="bg-[#161D2C] border border-[#232D42] rounded-2xl p-4 text-xs space-y-2.5 text-left">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <Store className="w-3.5 h-3.5 text-brand-400" />
              <span>ملف الصالون:</span>
            </span>
            <span className="font-bold text-white">{salon.name} ({salon.city})</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <Scissors className="w-3.5 h-3.5 text-brand-400" />
              <span>الحلاقون النشطون:</span>
            </span>
            <span className="font-bold text-white">{barbers.length} حلاقين</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>الخدمات:</span>
            </span>
            <span className="font-bold text-white">{services.length} باقات</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>الحجوزات المهيأة:</span>
            </span>
            <span className="font-bold text-emerald-400">{appointments.length} حجز</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="w-full py-3.5 px-6 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group"
          >
            <span>تشغيل لوحة تحكم الصالون</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href={`/book/${salon.slug}`}
            target="_blank"
            className="w-full py-2.5 px-6 rounded-xl bg-[#1E2638] hover:bg-[#2A364F] text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>أو اختبر رابط حجز العملاء</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
