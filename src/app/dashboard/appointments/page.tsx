"use client";

import React, { useState, useMemo } from "react";
import { useSalon } from "@/context/SalonContext";
import { formatEGP, formatDatePretty, getTodayDateString, getRelativeDateString } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Appointment, AppointmentStatus } from "@/types";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  User,
  Phone,
  Clock,
  Scissors,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowUpDown,
  FileText,
  AlertCircle,
} from "lucide-react";
import { NewAppointmentModal } from "@/components/dashboard/NewAppointmentModal";

export default function AppointmentsPage() {
  const { appointments, barbers, services, updateAppointmentStatus } = useSalon();

  const todayStr = getTodayDateString();
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedBarber, setSelectedBarber] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAppointmentDetail, setActiveAppointmentDetail] = useState<Appointment | null>(null);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // Quick date selector chips
  const quickDates = [
    { label: "Yesterday", value: getRelativeDateString(-1) },
    { label: "Today", value: todayStr },
    { label: "Tomorrow", value: getRelativeDateString(1) },
    { label: "In 2 Days", value: getRelativeDateString(2) },
  ];

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((apt) => {
        // Date match (if selectedDate set)
        if (selectedDate && apt.date !== selectedDate) return false;
        // Barber match
        if (selectedBarber !== "ALL" && apt.barberId !== selectedBarber) return false;
        // Status match
        if (selectedStatus !== "ALL" && apt.status !== selectedStatus) return false;
        // Search query match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = apt.customerName.toLowerCase().includes(q);
          const matchPhone = apt.customerPhone.includes(q);
          const matchService = apt.serviceName.toLowerCase().includes(q);
          const matchBarber = apt.barberName.toLowerCase().includes(q);
          if (!matchName && !matchPhone && !matchService && !matchBarber) return false;
        }
        return true;
      })
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, selectedDate, selectedBarber, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">المواعيد</h1>
          <p className="text-xs text-slate-400">
            عرض وتصنيف ومتابعة حجوزات العملاء في الوقت الحقيقي
          </p>
        </div>
        <button
          onClick={() => setIsNewBookingModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-400 text-black font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>حجز جديد</span>
        </button>
      </div>

      {/* Filter and Date Ribbon */}
      <div className="bg-[#121826] border border-[#232D42] rounded-2xl p-4 sm:p-5 space-y-4">
        {/* Date Quick Tabs & Custom Date Picker */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#232D42]">
          <div className="flex flex-wrap items-center gap-2">
            {quickDates.map((item) => (
              <button
                key={item.value}
                onClick={() => setSelectedDate(item.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDate === item.value
                    ? "bg-brand-500 text-black font-bold shadow-sm shadow-brand-500/20"
                    : "bg-[#161D2C] text-slate-300 hover:bg-[#1E2638] hover:text-white border border-[#232D42]"
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => setSelectedDate("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDate === ""
                  ? "bg-brand-500 text-black font-bold"
                  : "bg-[#161D2C] text-slate-300 hover:bg-[#1E2638] border border-[#232D42]"
              }`}
            >
              كل التواريخ
            </button>
          </div>

          {/* Custom Date Input */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">اختر التاريخ:</span>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Search & Granular Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customer, phone, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Barber Selector */}
          <div>
            <select
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">كل الحلاقين</option>
              {barbers.map((b) => (
                <option key={b.id} value={b.id}>
                  الحلاق: {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">كل الحالات</option>
              <option value="BOOKED">الحالة: محجوز</option>
              <option value="CHECKED_IN">الحالة: تم الوصول</option>
              <option value="IN_SERVICE">الحالة: قيد الخدمة</option>
              <option value="COMPLETED">الحالة: مكتمل</option>
              <option value="NO_SHOW">الحالة: تغيب</option>
              <option value="CANCELLED">الحالة: ملغي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="bg-[#121826] border border-[#232D42] rounded-2xl overflow-hidden shadow-card-subtle">
        {filteredAppointments.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <CalendarIcon className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-base font-medium text-slate-300">
              No appointments found for this selection.
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your date or filter options, or click &quot;New Appointment&quot; to book a customer.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#232D42] bg-[#0E131E] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 sm:px-6">Time & Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service & Price</th>
                  <th className="py-3 px-4">Barber</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293D]">
                {filteredAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-[#161D2C]/80 transition-colors group cursor-pointer"
                    onClick={() => setActiveAppointmentDetail(apt)}
                  >
                    {/* Time & Date */}
                    <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                      <div className="font-mono font-bold text-white text-sm">
                        {apt.startTime} - {apt.endTime}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {formatDatePretty(apt.date)}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 text-sm">{apt.customerName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{apt.customerPhone}</div>
                    </td>

                    {/* Service & Price */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-brand-300">{apt.serviceName}</div>
                      <div className="text-slate-400 text-[11px]">
                        {formatEGP(apt.servicePrice)} • {apt.serviceDuration} min
                      </div>
                    </td>

                    {/* Barber */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 font-bold flex items-center justify-center text-[10px]">
                          {apt.barberName.charAt(0)}
                        </div>
                        <span className="text-slate-200 font-medium">{apt.barberName}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={apt.status}
                        onChange={(e) =>
                          updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)
                        }
                        className="bg-[#161D2C] border border-[#232D42] text-xs text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-brand-500 font-medium"
                      >
                        <option value="BOOKED">محجوز</option>
                        <option value="CHECKED_IN">تم الوصول</option>
                        <option value="IN_SERVICE">قيد الخدمة</option>
                        <option value="COMPLETED">مكتمل</option>
                        <option value="NO_SHOW">تغيب</option>
                        <option value="CANCELLED">ملغي</option>
                      </select>
                    </td>

                    {/* Quick Detail Action */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveAppointmentDetail(apt)}
                        className="px-2.5 py-1 rounded bg-[#1E2638] text-slate-300 hover:text-white hover:bg-[#2A364F] text-[11px] font-medium transition-colors"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {activeAppointmentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setActiveAppointmentDetail(null)}
          />
          <div className="relative w-full max-w-md bg-[#121826] border border-[#232D42] rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#232D42]">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  Appointment Details
                </h3>
                <p className="text-xs text-slate-400">ID: {activeAppointmentDetail.id}</p>
              </div>
              <StatusBadge status={activeAppointmentDetail.status} size="sm" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#161D2C] p-3 rounded-xl border border-[#232D42] space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-white">
                    {activeAppointmentDetail.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-mono text-slate-200">
                    {activeAppointmentDetail.customerPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-semibold text-brand-300">
                    {activeAppointmentDetail.serviceName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Barber:</span>
                  <span className="font-medium text-white">
                    {activeAppointmentDetail.barberName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Schedule:</span>
                  <span className="font-mono text-white">
                    {formatDatePretty(activeAppointmentDetail.date)} @{" "}
                    {activeAppointmentDetail.startTime} - {activeAppointmentDetail.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Price:</span>
                  <span className="font-bold text-emerald-400">
                    {formatEGP(activeAppointmentDetail.servicePrice)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Source:</span>
                  <span className="text-slate-300 capitalize">
                    {activeAppointmentDetail.source.replace("_", " ").toLowerCase()}
                  </span>
                </div>
                {activeAppointmentDetail.notes && (
                  <div className="pt-2 border-t border-[#232D42]">
                    <span className="text-slate-400 block mb-1">Notes:</span>
                    <p className="text-slate-300 italic">{activeAppointmentDetail.notes}</p>
                  </div>
                )}
              </div>

              {/* Status Updater Buttons */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase">
                  Change Status
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      "BOOKED",
                      "CHECKED_IN",
                      "IN_SERVICE",
                      "COMPLETED",
                      "NO_SHOW",
                      "CANCELLED",
                    ] as AppointmentStatus[]
                  ).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        updateAppointmentStatus(activeAppointmentDetail.id, st);
                        setActiveAppointmentDetail({
                          ...activeAppointmentDetail,
                          status: st,
                        });
                      }}
                      className={`py-1.5 rounded-lg text-[11px] font-medium border transition-all ${
                        activeAppointmentDetail.status === st
                          ? "bg-brand-500 text-black font-bold border-brand-400 shadow-sm"
                          : "bg-[#161D2C] text-slate-300 hover:text-white border-[#232D42]"
                      }`}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#232D42] flex justify-end">
              <button
                onClick={() => setActiveAppointmentDetail(null)}
                className="px-4 py-2 rounded-lg bg-[#1E2638] hover:bg-[#2A364F] text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Appointment Modal */}
      <NewAppointmentModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        defaultDate={selectedDate || todayStr}
      />
    </div>
  );
}
