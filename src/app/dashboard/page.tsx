"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useSalon } from "@/context/SalonContext";
import { formatEGP, getTodayDateString, formatTimeDisplay } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AppointmentStatus, Appointment } from "@/types";
import {
  TrendingUp,
  CalendarCheck,
  CheckCircle2,
  UserX,
  Clock,
  Scissors,
  ArrowRight,
  Filter,
  User,
  Phone,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { salon, barbers, services, appointments, kpis, updateAppointmentStatus } = useSalon();
  const todayStr = getTodayDateString();

  const [selectedBarberFilter, setSelectedBarberFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");

  // Filter today's appointments
  const todayAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.date === todayStr)
      .filter((a) => (selectedBarberFilter === "ALL" ? true : a.barberId === selectedBarberFilter))
      .filter((a) => (selectedStatusFilter === "ALL" ? true : a.status === selectedStatusFilter))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, todayStr, selectedBarberFilter, selectedStatusFilter]);

  // Live in-chair & next up appointments
  const inServiceAppointments = useMemo(
    () => appointments.filter((a) => a.date === todayStr && a.status === "IN_SERVICE"),
    [appointments, todayStr]
  );

  const upcomingTodayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.date === todayStr && (a.status === "BOOKED" || a.status === "CHECKED_IN"))
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [appointments, todayStr]
  );

  const handleQuickStatusChange = (appointmentId: string, nextStatus: AppointmentStatus) => {
    updateAppointmentStatus(appointmentId, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#161D2C] via-[#1A2336] to-[#161D2C] border border-[#232D42] p-5 sm:p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
              يوم سعيد، فريق بركة
            </h1>
            <span className="text-lg">✂️</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            هذه هي حالة الطابق المباشرة والجدول اليومي لـ {salon.name}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={`/book/${salon.slug}`}
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-500 hover:bg-brand-400 text-black shadow-lg shadow-brand-500/20 transition-all"
          >
            <span>رابط حجز العملاء</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Today's Revenue */}
        <div className="bg-[#121826] border border-[#232D42] rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">إيرادات اليوم</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
              {formatEGP(kpis.todayRevenue)}
            </span>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <span>● خدمات مكتملة</span>
            </p>
          </div>
        </div>

        {/* KPI 2: Total Appointments Today */}
        <div className="bg-[#121826] border border-[#232D42] rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">حجوزات اليوم</span>
            <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold text-white font-display">
              {kpis.todayAppointmentsCount}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {kpis.todayUpcomingCount} قادمة / في الطابور
            </p>
          </div>
        </div>

        {/* KPI 3: Completed */}
        <div className="bg-[#121826] border border-[#232D42] rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">مكتمل</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold text-white font-display">
              {kpis.todayCompletedCount}
            </span>
            <p className="text-[11px] text-indigo-400 mt-1">
              {kpis.todayAppointmentsCount > 0
                ? Math.round((kpis.todayCompletedCount / kpis.todayAppointmentsCount) * 100)
                : 0}
              % معدل الإنجاز
            </p>
          </div>
        </div>

        {/* KPI 4: No Shows */}
        <div className="bg-[#121826] border border-[#232D42] rounded-xl p-4 sm:p-5 relative overflow-hidden group hover:border-brand-500/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">التغيبات</span>
            <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-900/60 flex items-center justify-center text-rose-400">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-bold text-white font-display">
              {kpis.todayNoShowsCount}
            </span>
            <p className="text-[11px] text-rose-400/80 mt-1">زيارات فائتة اليوم</p>
          </div>
        </div>
      </div>

      {/* Live Barber Status Cards */}
      <div className="bg-[#121826] border border-[#232D42] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-brand-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              جدول الحلاقين وحالة الطابق
            </h2>
          </div>
          <Link
            href="/dashboard/barbers"
            className="text-xs text-brand-400 hover:text-brand-300 font-medium flex items-center gap-1"
          >
            <span>إدارة الحلاقين</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {barbers.map((barber) => {
            const currentApt = appointments.find(
              (a) => a.date === todayStr && a.barberId === barber.id && a.status === "IN_SERVICE"
            );
            const nextApt = appointments
              .filter(
                (a) =>
                  a.date === todayStr &&
                  a.barberId === barber.id &&
                  (a.status === "BOOKED" || a.status === "CHECKED_IN")
              )
              .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

            const todayBarberApts = appointments.filter(
              (a) => a.date === todayStr && a.barberId === barber.id && a.status !== "CANCELLED"
            );

            return (
              <div
                key={barber.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  !barber.isActive
                    ? "bg-[#0E131E]/60 border-slate-800 opacity-60"
                    : currentApt
                    ? "bg-amber-950/20 border-amber-800/60 shadow-sm"
                    : "bg-[#161D2C] border-[#232D42]"
                }`}
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="relative">
                    {/* Barber Avatar */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={barber.avatar}
                      alt={barber.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#232D42]"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#121826] ${
                        !barber.isActive
                          ? "bg-slate-500"
                          : currentApt
                          ? "bg-amber-500 animate-pulse"
                          : "bg-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">{barber.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{barber.role}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] pt-1 border-t border-[#232D42]">
                  <div className="flex justify-between text-slate-400">
                    <span>الدوام:</span>
                    <span className="text-slate-200 font-mono">
                      {barber.workingHours.start} - {barber.workingHours.end}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">الحالة:</span>
                    {currentApt ? (
                      <span className="text-amber-400 font-medium flex items-center gap-1">
                        <Scissors className="w-3 h-3 animate-spin" /> قيد الخدمة
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-medium">متاح</span>
                    )}
                  </div>
                  {currentApt && (
                    <p className="text-[10px] text-amber-300/80 truncate">
                      يعمل الآن: {currentApt.customerName} ({currentApt.serviceName})
                    </p>
                  )}
                  {nextApt && !currentApt && (
                    <p className="text-[10px] text-slate-400 truncate">
                      التالي: {nextApt.startTime} ({nextApt.customerName})
                    </p>
                  )}
                  <div className="flex justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>حمل اليوم:</span>
                    <span className="font-semibold text-slate-300">
                      {todayBarberApts.length} حجز
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Schedule & Timeline Section */}
      <div className="bg-[#121826] border border-[#232D42] rounded-2xl overflow-hidden">
        {/* Header & Controls */}
        <div className="p-5 border-b border-[#232D42] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-400" />
              <span>Today&apos;s Schedule & Timeline</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live workflow timeline for {salon.name} (Cairo time)
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Barber filter */}
            <select
              value={selectedBarberFilter}
              onChange={(e) => setSelectedBarberFilter(e.target.value)}
              className="bg-[#161D2C] border border-[#232D42] text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Barbers</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-[#161D2C] border border-[#232D42] text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="BOOKED">Booked</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="IN_SERVICE">In Service</option>
              <option value="COMPLETED">Completed</option>
              <option value="NO_SHOW">No Show</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <Link
              href="/dashboard/appointments"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20"
            >
              All Appointments Table →
            </Link>
          </div>
        </div>

        {/* Schedule List */}
        <div className="divide-y divide-[#1F293D]">
          {todayAppointments.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <CalendarCheck className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-medium">No appointments match the selected filters.</p>
              <p className="text-xs text-slate-600">
                Adjust filters or add a new walk-in appointment from the top right.
              </p>
            </div>
          ) : (
            todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-4 sm:px-6 hover:bg-[#161D2C]/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                {/* Time & Service info */}
                <div className="flex items-start sm:items-center gap-4">
                  {/* Time Badge */}
                  <div className="w-20 text-left shrink-0">
                    <span className="font-mono text-sm font-bold text-white block">
                      {apt.startTime}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 block">
                      to {apt.endTime}
                    </span>
                  </div>

                  <div className="h-8 w-px bg-[#232D42] hidden sm:block" />

                  {/* Customer & Service */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-100">{apt.customerName}</span>
                      <span className="text-xs text-slate-400 font-mono">({apt.customerPhone})</span>
                      {apt.source === "WALK_IN" && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
                          Walk-in
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="text-brand-300 font-medium">{apt.serviceName}</span>
                      <span>•</span>
                      <span>{formatEGP(apt.servicePrice)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <User className="w-3 h-3 text-slate-400" /> {apt.barberName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status & Quick Action Pipeline */}
                <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                  <StatusBadge status={apt.status} size="sm" />

                  {/* Quick status progress buttons */}
                  <div className="flex items-center gap-1.5 bg-[#0E131E] p-1 rounded-lg border border-[#232D42]">
                    {apt.status === "BOOKED" && (
                      <button
                        onClick={() => handleQuickStatusChange(apt.id, "CHECKED_IN")}
                        className="px-2 py-1 text-[11px] font-medium rounded bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-800 transition-colors"
                        title="Mark Customer Checked In"
                      >
                        Check In
                      </button>
                    )}

                    {apt.status === "CHECKED_IN" && (
                      <button
                        onClick={() => handleQuickStatusChange(apt.id, "IN_SERVICE")}
                        className="px-2 py-1 text-[11px] font-medium rounded bg-amber-950 text-amber-300 hover:bg-amber-900 border border-amber-800 transition-colors"
                        title="Start Service"
                      >
                        Start Cut
                      </button>
                    )}

                    {apt.status === "IN_SERVICE" && (
                      <button
                        onClick={() => handleQuickStatusChange(apt.id, "COMPLETED")}
                        className="px-2 py-1 text-[11px] font-bold rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800 transition-colors"
                        title="Complete Service and Collect Payment"
                      >
                        ✓ Complete
                      </button>
                    )}

                    {apt.status === "BOOKED" && (
                      <button
                        onClick={() => handleQuickStatusChange(apt.id, "NO_SHOW")}
                        className="px-1.5 py-1 text-[11px] text-slate-400 hover:text-rose-400 rounded hover:bg-rose-950/50 transition-colors"
                        title="Mark as No Show"
                      >
                        No Show
                      </button>
                    )}

                    {/* Status Dropdown for Full Control */}
                    <select
                      value={apt.status}
                      onChange={(e) =>
                        handleQuickStatusChange(apt.id, e.target.value as AppointmentStatus)
                      }
                      className="bg-[#161D2C] border border-[#232D42] text-[11px] text-slate-300 rounded px-1.5 py-1 focus:outline-none focus:border-brand-500"
                    >
                      <option value="BOOKED">Booked</option>
                      <option value="CHECKED_IN">Checked In</option>
                      <option value="IN_SERVICE">In Service</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="NO_SHOW">No Show</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
