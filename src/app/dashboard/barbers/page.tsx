"use client";

import React, { useState } from "react";
import { useSalon } from "@/context/SalonContext";
import { Barber } from "@/types";
import { getTodayDateString } from "@/lib/utils";
import {
  Scissors,
  Plus,
  Star,
  Clock,
  Check,
  X,
  Edit2,
  Power,
  Calendar,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function BarbersManagementPage() {
  const { barbers, services, appointments, addBarber, updateBarber, toggleBarberStatus } =
    useSalon();
  const todayStr = getTodayDateString();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [startHour, setStartHour] = useState("09:00");
  const [endHour, setEndHour] = useState("21:00");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [offDays, setOffDays] = useState<number[]>([0]);

  const openAddModal = () => {
    setEditingBarber(null);
    setName("");
    setRole("Senior Stylist & Barber");
    setBio("Expert in precision fades, traditional hot towel shaves, and modern styling.");
    setAvatar("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80");
    setStartHour("09:00");
    setEndHour("21:00");
    setSelectedServiceIds(services.map((s) => s.id));
    setOffDays([0]);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Barber) => {
    setEditingBarber(b);
    setName(b.name);
    setRole(b.role);
    setBio(b.bio);
    setAvatar(b.avatar);
    setStartHour(b.workingHours.start);
    setEndHour(b.workingHours.end);
    setSelectedServiceIds(b.serviceIds);
    setOffDays(b.workingHours.offDays);
    setIsModalOpen(true);
  };

  const handleSaveBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingBarber) {
      updateBarber(editingBarber.id, {
        name: name.trim(),
        role: role.trim(),
        bio: bio.trim(),
        avatar: avatar.trim() || editingBarber.avatar,
        workingHours: {
          start: startHour,
          end: endHour,
          offDays,
        },
        serviceIds: selectedServiceIds,
      });
    } else {
      addBarber({
        salonId: "salon-baraka-1",
        name: name.trim(),
        role: role.trim(),
        avatar:
          avatar.trim() ||
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
        bio: bio.trim(),
        rating: 5.0,
        reviewCount: 0,
        workingHours: {
          start: startHour,
          end: endHour,
          offDays,
        },
        serviceIds: selectedServiceIds.length > 0 ? selectedServiceIds : services.map((s) => s.id),
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  const daysOfWeek = [
    { label: "Sun", day: 0 },
    { label: "Mon", day: 1 },
    { label: "Tue", day: 2 },
    { label: "Wed", day: 3 },
    { label: "Thu", day: 4 },
    { label: "Fri", day: 5 },
    { label: "Sat", day: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">الحلاقون وذوو المهن</h1>
          <p className="text-xs text-slate-400">
            إدارة فريق الصالون، أوقات الدوام، المهارات المخصصة، والتوفر المباشر
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-400 text-black font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة حلاق جديد</span>
        </button>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
        {barbers.map((barber) => {
          const todayBarberApts = appointments.filter(
            (a) => a.date === todayStr && a.barberId === barber.id && a.status !== "CANCELLED"
          );
          const completedToday = appointments.filter(
            (a) => a.date === todayStr && a.barberId === barber.id && a.status === "COMPLETED"
          );

          const assignedServices = services.filter((s) => barber.serviceIds.includes(s.id));

          return (
            <div
              key={barber.id}
              className={`bg-[#121826] border rounded-2xl p-5 sm:p-6 transition-all relative overflow-hidden flex flex-col justify-between ${
                barber.isActive
                  ? "border-[#232D42] hover:border-brand-500/40"
                  : "border-slate-800 opacity-60 bg-[#0E131E]"
              }`}
            >
              <div>
                {/* Header & Status */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#232D42] shadow-md"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#121826] ${
                          barber.isActive ? "bg-emerald-500" : "bg-slate-600"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-white font-display">
                          {barber.name}
                        </h2>
                        {barber.isActive ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-brand-400 font-medium">{barber.role}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-white">{barber.rating}</span>
                        <span>({barber.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(barber)}
                      className="p-2 rounded-lg bg-[#161D2C] text-slate-300 hover:text-white hover:bg-[#1E2638] border border-[#232D42] transition-colors"
                      title="Edit Barber Info"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleBarberStatus(barber.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        barber.isActive
                          ? "bg-rose-950/40 text-rose-300 hover:bg-rose-900 border-rose-900"
                          : "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900 border-emerald-900"
                      }`}
                      title={barber.isActive ? "Deactivate Barber" : "Activate Barber"}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-300 line-clamp-2 mb-4 italic">
                  &ldquo;{barber.bio}&rdquo;
                </p>

                {/* Details Section */}
                <div className="space-y-2.5 text-xs bg-[#161D2C] p-3.5 rounded-xl border border-[#232D42]">
                  {/* Hours */}
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      <span>Shift Hours:</span>
                    </span>
                    <span className="text-white font-mono font-medium">
                      {barber.workingHours.start} - {barber.workingHours.end}
                    </span>
                  </div>

                  {/* Off Days */}
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-400" />
                      <span>Weekly Off Days:</span>
                    </span>
                    <div className="flex gap-1">
                      {daysOfWeek.map((d) => (
                        <span
                          key={d.day}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                            barber.workingHours.offDays.includes(d.day)
                              ? "bg-rose-950 text-rose-300 border border-rose-900 font-bold"
                              : "bg-[#0E131E] text-slate-400"
                          }`}
                        >
                          {d.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Today's workload */}
                  <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-[#232D42]">
                    <span>Today&apos;s Appointments:</span>
                    <span className="text-emerald-400 font-bold">
                      {completedToday.length} completed / {todayBarberApts.length} total
                    </span>
                  </div>
                </div>

                {/* Assigned Services Pills */}
                <div className="mt-3.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Authorized Services ({assignedServices.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {assignedServices.map((srv) => (
                      <span
                        key={srv.id}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-[#1F293D] text-slate-300 border border-slate-700/60"
                      >
                        {srv.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Barber Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#121826] border border-[#232D42] rounded-2xl shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#232D42]">
              <h2 className="text-lg font-bold text-white font-display">
                {editingBarber ? "Edit Barber Profile" : "Add New Barber"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBarber} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Barber Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mostafa El-Sayed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Role / Specialization</label>
                <input
                  type="text"
                  placeholder="e.g. Master Fade Specialist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Profile Photo URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Bio / Credentials</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Brief expertise notes..."
                  className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Shift Hours */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Shift Start Time</label>
                  <input
                    type="time"
                    value={startHour}
                    onChange={(e) => setStartHour(e.target.value)}
                    className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Shift End Time</label>
                  <input
                    type="time"
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}
                    className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>

              {/* Weekly Off Days */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Weekly Days Off</label>
                <div className="flex gap-2">
                  {daysOfWeek.map((d) => {
                    const isOff = offDays.includes(d.day);
                    return (
                      <button
                        key={d.day}
                        type="button"
                        onClick={() => {
                          if (isOff) {
                            setOffDays(offDays.filter((x) => x !== d.day));
                          } else {
                            setOffDays([...offDays, d.day]);
                          }
                        }}
                        className={`flex-1 py-1.5 rounded-lg font-bold border transition-colors ${
                          isOff
                            ? "bg-rose-950 text-rose-300 border-rose-800"
                            : "bg-[#161D2C] text-slate-400 border-[#232D42] hover:text-white"
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Assigned Services Checklist */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Assigned Services Can Perform
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#0E131E] p-3 rounded-lg border border-[#232D42]">
                  {services.map((srv) => {
                    const isAssigned = selectedServiceIds.includes(srv.id);
                    return (
                      <label
                        key={srv.id}
                        className="flex items-center gap-2 text-slate-300 cursor-pointer text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={isAssigned}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedServiceIds([...selectedServiceIds, srv.id]);
                            } else {
                              setSelectedServiceIds(selectedServiceIds.filter((id) => id !== srv.id));
                            }
                          }}
                          className="rounded bg-[#161D2C] border-slate-700 text-brand-500 focus:ring-0"
                        />
                        <span>{srv.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#232D42] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#161D2C] hover:bg-[#1E2638] text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-black text-xs font-bold shadow-md shadow-brand-500/20"
                >
                  Save Barber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
