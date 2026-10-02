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
                نظام صالون الحلاقة
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#problem" className="hover:text-white transition-colors">
              المشكلة
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              المزايا
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              طريقة العمل
            </a>
            <Link
              href="/book/baraka-barbershop"
              target="_blank"
              className="text-brand-300 hover:text-brand-200 transition-colors"
            >
              حجز العملاء مباشر
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#161D2C] hover:bg-[#1E2638] text-slate-200 border border-[#232D42] transition-colors"
            >
              مشاهدة العرض
            </Link>
            <button
              onClick={() => setEarlyAccessModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-400 text-black shadow-lg shadow-brand-500/20 transition-all"
            >
              احصل على الوصول المبكر
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 border-b border-[#232D42]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>مصمم خصيصًا لصالونات الحلاقة الحديثة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight leading-[1.15]">
            أدر صالونك في مكان واحد.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-amber-300 to-brand-500">
              ودع العملاء يحجزون الحلاق المناسب في الوقت المناسب.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            توقف عن فقدان الحجوزات في رسائل الواتساب المتناثرة وملاحظات الهاتف والازدواجية.
            أعطِ عملاءك رابط حجز خلال 60 ثانية بينما يركز فريقك على القص بدقة.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <button
              onClick={() => setEarlyAccessModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-sm shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>احصل على الوصول المبكر</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/demo"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#161D2C] hover:bg-[#1E2638] text-slate-200 border border-[#232D42] font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>مشاهدة العرض التفاعلي</span>
            </Link>
          </div>

          <div className="pt-10 max-w-4xl mx-auto">
            <div className="bg-[#121826] border border-[#232D42] rounded-2xl p-4 sm:p-6 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between border-b border-[#232D42] pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-white">حالة الطابق المباشرة: صالون بركة</span>
                </div>
                <span className="text-slate-400 font-mono">جدول اليوم</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#161D2C] border border-[#232D42]">
                  <span className="text-slate-400 block text-[11px]">الكرسي 1 (أحمد حسن)</span>
                  <span className="font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
                    <Scissors className="w-3.5 h-3.5" /> تقليم + لحية (طارق ع.)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#161D2C] border border-[#232D42]">
                  <span className="text-slate-400 block text-[11px]">الكرسي 2 (محمد علي)</span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> التالي الساعة 15:00 (نادر س.)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#161D2C] border border-[#232D42]">
                  <span className="text-slate-400 block text-[11px]">إيرادات اليوم</span>
                  <span className="font-bold text-white text-sm font-mono mt-0.5 block">
                    {formatEGP(2450)} (12 مكتملة)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="problem" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#232D42] bg-[#0E131E]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              لماذا ينهار تحديد مواعيد صالونات الحلاقة التقليدية؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              إدارة صالون مزدحم بـ 3–10 حلاقين يكون فوضويًا عند الاعتماد على العادات القديمة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#121826] border border-rose-950/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-900/60 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">فوضى رسائل الواتساب الصوتية</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                يرسل العملاء رسائل مثل “هل أنت متاح عند الساعة 6؟” بينما أنت تمسك بالمقص.
                وعند الرد، يكون الكرسي مشغولًا أو انتقلوا لغيرك.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121826] border border-rose-950/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-900/60 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">تداخل الملاحظات الورقية</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                يكتب أحد الحلاقين بالقلم الرصاص، ويقوم آخر بحجز نفس الموعد عبر الواتساب.
                فيظهر عميلان في السابعة مساءً منتظرين نفس الكرسي.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121826] border border-rose-950/60 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-950/80 border border-rose-900/60 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">تسرب الإيرادات بسبب الغياب</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                بدون مواعيد منظمة وتتبع واضح للمتاح، تستهلك الكراسي الفارغة هامش ربحك اليومي.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#232D42]">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">
              الحل المخصص
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
              كل ما يحتاجه طابق صالونك لتعمل مثل الساعة
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">محرك مواقيت بدون تعارض</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                يحسب فترات متاحة دقيقة بناءً على مدة الخدمة ووقت دوام كل حلاق، بحيث لا يمكن تداخل الحجوزات.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">حجز من الهاتف خلال 60 ثانية</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                أضف رابط الحجز في إنستغرامك أو واتسابك. يختار العميل الحلاق والتاريخ والوقت في 4 خطوات فقط.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">مواعيد الحلاقين ومهاراتهم</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                يمكنك ضبط أيام الراحة، أوقات التشغيل، والخدمات المصرح لكل حلاق، فلا يستطيع العملاء حجز من هو في إجازة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">مؤشرات الإيراد اليومية</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تتبع الإيراد فقط من الخدمات المكتملة، ومشاهدات الحجوزات والغيابات في لمحة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">سجل زوار العملاء</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                تنشئ دليل عملاء تلقائيًا مع عدد الزيارات، إجمالي الإنفاق، وتاريخ آخر زيارة.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#121826] border border-[#232D42] hover:border-brand-500/40 transition-colors space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">إضافة الحجز الفوري</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                عند وصول عميل عابر؟ يمكنك تسجيله بنقرة واحدة مباشرة في قائمة الطابق مع تخصيص فوري.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#232D42] bg-[#0E131E]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              كيف يعمل بركة؟
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              تجربة سلسة مصممة للسرعة والوضوح.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#121826] border border-[#232D42] rounded-2xl p-6 space-y-4">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider block">
                لصاحب الصالون
              </span>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>اضبط الحلاقين، أوقات الدوام، وأيام الراحة الأسبوعية.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>أضف الخدمات مع السعر بالجينهي والمدة بالدقائق.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>شارك رابط الحجز الخاص بك على إنستغرام أو واتساب.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center shrink-0">4</span>
                  <span>شاهد الحجوزات تظهر في الوقت الحقيقي على لوحة القيادة.</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#121826] border border-[#232D42] rounded-2xl p-6 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                للعميل
              </span>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>يفتح الرابط من الهاتف عبر واتساب أو إنستغرام.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>يختار الخدمة والحلاق المفضل.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>يختار وقتًا متاحًا من الصباح أو الظهيرة أو المساء.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">4</span>
                  <span>يدخل الاسم ورقم الهاتف ويتلقى تأكيدًا فورياً.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-8 border-b border-[#232D42] relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
            هل أنت مستعد لرفع كفاءة صالونك؟
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            جرّب النموذج المباشر ببيانات صالونات مصرية أو اطلب الوصول المبكر لصالونك.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setEarlyAccessModalOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-sm shadow-xl shadow-brand-500/20 transition-all"
            >
              احصل على الوصول المبكر
            </button>
            <Link
              href="/demo"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#161D2C] hover:bg-[#1E2638] text-white border border-[#232D42] font-semibold text-sm transition-colors"
            >
              الدخول إلى العرض المباشر
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#0B0F17] py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-brand-500" />
            <span className="font-bold text-slate-300">منصة بركة لصالونات الحلاقة</span>
            <span>• القاهرة، مصر</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/demo" className="hover:text-white">
              بوابة العرض
            </Link>
            <Link href="/book/baraka-barbershop" className="hover:text-white">
              صفحة الحجز
            </Link>
            <Link href="/dashboard" className="hover:text-white">
              لوحة الإدارة
            </Link>
          </div>
        </div>
      </footer>

      {earlyAccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setEarlyAccessModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#121826] border border-[#232D42] rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232D42]">
              <div>
                <h3 className="text-base font-bold text-white font-display">احصل على الوصول المبكر</h3>
                <p className="text-xs text-slate-400">انضم إلى قائمة الانتظار لصالونك</p>
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
                <p className="text-sm font-bold text-white">شكراً لك!</p>
                <p className="text-xs text-slate-400">
                  سنتواصل معك قريبًا لبدء توصيل الصالون الخاص بك.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEarlyAccessSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">اسم الصالون *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثل: صالون الأوّمة"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    هاتف المالك / واتساب *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+966 500 123 4567"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs shadow-md shadow-brand-500/20"
                >
                  إرسال الطلب
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
