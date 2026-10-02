"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSalon } from "@/context/SalonContext";
import { generateAvailableSlots, calculateEndTime, findAvailableBarberForSlot } from "@/lib/scheduling";
import { formatEGP, formatDatePretty, getTodayDateString, getRelativeDateString } from "@/lib/utils";
import { Service, Barber, Appointment } from "@/types";
import confetti from "canvas-confetti";
import {
  Scissors,
  User,
  Calendar as CalendarIcon,
  Clock,
  Phone,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Star,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CalendarCheck,
  Share2,
  ArrowRight,
} from "lucide-react";

export default function CustomerBookingPage() {
  const params = useParams();
  const { salon, barbers, services, appointments, addAppointment } = useSalon();

  // Booking Flow Steps: 1: Service -> 2: Barber -> 3: Date & Slot -> 4: Contact Info -> 5: Confirmed
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Selections
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<string>("any");
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+20 ");
  const [notes, setNotes] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [validationError, setValidationError] = useState("");

  // Default initial service
  useEffect(() => {
    if (!selectedService && services.length > 0) {
      const activeFirst = services.find((s) => s.isActive) || services[0];
      setSelectedService(activeFirst);
    }
  }, [services, selectedService]);

  // Generate 7-day date slider
  const next7Days = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = getRelativeDateString(i);
      const [y, m, d] = dateStr.split("-").map(Number);
      const obj = new Date(y, m - 1, d);
      dates.push({
        dateStr,
        dayName: i === 0 ? "Today" : i === 1 ? "Tmrw" : obj.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: obj.getDate(),
        monthName: obj.toLocaleDateString("en-US", { month: "short" }),
      });
    }
    return dates;
  }, []);

  // Calculate available slots based on selected service, barber, date, and appointments
  const availableSlots = useMemo(() => {
    if (!selectedService || !selectedDate) return [];
    return generateAvailableSlots({
      date: selectedDate,
      serviceDuration: selectedService.duration,
      barberId: selectedBarberId,
      serviceId: selectedService.id,
      appointments,
      barbers,
      salon,
    });
  }, [selectedDate, selectedService, selectedBarberId, appointments, barbers, salon]);

  // Group slots by Morning / Afternoon / Evening
  const groupedSlots = useMemo(() => {
    const morning = availableSlots.filter((s) => parseInt(s.time.split(":")[0], 10) < 13);
    const afternoon = availableSlots.filter(
      (s) => parseInt(s.time.split(":")[0], 10) >= 13 && parseInt(s.time.split(":")[0], 10) < 18
    );
    const evening = availableSlots.filter((s) => parseInt(s.time.split(":")[0], 10) >= 18);

    return { morning, afternoon, evening };
  }, [availableSlots]);

  const activeServices = useMemo(() => services.filter((s) => s.isActive), [services]);
  const activeBarbers = useMemo(() => barbers.filter((b) => b.isActive), [barbers]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!selectedService) {
      setValidationError("Please select a service.");
      return;
    }
    if (!customerName.trim()) {
      setValidationError("Please enter your name.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setValidationError("Please enter a valid mobile number.");
      return;
    }
    if (!selectedTimeSlot) {
      setValidationError("Please select an available time slot.");
      return;
    }

    // Resolve barber
    let finalBarber = barbers.find((b) => b.id === selectedBarberId);
    if (selectedBarberId === "any" || !finalBarber) {
      finalBarber = findAvailableBarberForSlot(
        selectedTimeSlot,
        selectedService.duration,
        selectedDate,
        selectedService.id,
        appointments,
        barbers
      ) || undefined;
    }

    if (!finalBarber) {
      setValidationError("This slot is no longer available. Please select another time.");
      return;
    }

    const endTime = calculateEndTime(selectedTimeSlot, selectedService.duration);

    const newApt = addAppointment({
      salonId: salon.id,
      barberId: finalBarber.id,
      barberName: finalBarber.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.duration,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      date: selectedDate,
      startTime: selectedTimeSlot,
      endTime,
      status: "BOOKED",
      source: "ONLINE_BOOKING",
      notes: notes.trim() || undefined,
    });

    setConfirmedBooking(newApt);
    setCurrentStep(5);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#D97706", "#F59E0B", "#FBBF24", "#10B981"],
      });
    } catch (e) {
      console.log(e);
    }
  };

  const selectedBarberObj = barbers.find((b) => b.id === selectedBarberId);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="border-b border-[#232D42] bg-[#0E131E]/90 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-black font-bold shadow-md shadow-brand-500/20">
              <Scissors className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="font-bold text-sm text-white font-display block leading-none">
                {salon.name}
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-brand-400" />
                <span>{salon.address}, {salon.city}</span>
              </span>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="text-xs text-brand-400 hover:text-brand-300 font-medium px-2.5 py-1 rounded-lg bg-[#161D2C] border border-[#232D42]"
          >
            Owner Portal →
          </Link>
        </div>
      </header>

      {/* Main Booking Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Salon Brand Showcase Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-[#232D42] bg-gradient-to-b from-[#161D2C] to-[#121826] p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-semibold">
                  Online Booking
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{salon.rating}</span>
                  <span className="text-slate-400 font-normal">({salon.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white font-display">
                Book Your Grooming Session
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                {salon.tagline} • Open {salon.openTime} – {salon.closeTime}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          {currentStep < 5 && (
            <div className="mt-6 pt-4 border-t border-[#232D42]/80">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                <span className={currentStep >= 1 ? "text-brand-400" : ""}>1. Service</span>
                <span className={currentStep >= 2 ? "text-brand-400" : ""}>2. Barber</span>
                <span className={currentStep >= 3 ? "text-brand-400" : ""}>3. Date & Time</span>
                <span className={currentStep >= 4 ? "text-brand-400" : ""}>4. Your Details</span>
              </div>
              <div className="h-1.5 w-full bg-[#0E131E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-300 rounded-full"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* STEP 1: SERVICE SELECTION */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Scissors className="w-4 h-4 text-brand-400" />
                <span>Select Service</span>
              </h2>
              <span className="text-xs text-slate-400">Step 1 of 4</span>
            </div>

            <div className="space-y-3">
              {activeServices.map((srv) => {
                const isSelected = selectedService?.id === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? "bg-brand-500/10 border-brand-500 shadow-md shadow-brand-500/10 ring-1 ring-brand-500"
                        : "bg-[#121826] border-[#232D42] hover:border-slate-600 hover:bg-[#161D2C]"
                    }`}
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{srv.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1E2638] text-slate-300 font-medium">
                          {srv.duration} mins
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end">
                      <span className="font-bold text-base text-emerald-400 font-display">
                        {formatEGP(srv.price)}
                      </span>
                      <span
                        className={`w-5 h-5 rounded-full border mt-1.5 flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-brand-500 border-brand-400 text-black font-bold"
                            : "border-slate-600"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                disabled={!selectedService}
                onClick={() => setCurrentStep(2)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-sm shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Barber</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: BARBER SELECTION */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <User className="w-4 h-4 text-brand-400" />
                <span>Choose Barber / Stylist</span>
              </h2>
              <span className="text-xs text-slate-400">Step 2 of 4</span>
            </div>

            {/* Any Available Barber Option */}
            <div
              onClick={() => setSelectedBarberId("any")}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                selectedBarberId === "any"
                  ? "bg-brand-500/10 border-brand-500 shadow-md ring-1 ring-brand-500"
                  : "bg-[#121826] border-[#232D42] hover:bg-[#161D2C]"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/20 to-brand-700/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Any Available Barber</h3>
                  <p className="text-xs text-slate-400">
                    Get the earliest open slot with any of our master barbers
                  </p>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedBarberId === "any"
                    ? "bg-brand-500 border-brand-400 text-black"
                    : "border-slate-600"
                }`}
              >
                {selectedBarberId === "any" && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
              </div>
            </div>

            {/* Individual Barbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeBarbers.map((barber) => {
                const isSelected = selectedBarberId === barber.id;
                return (
                  <div
                    key={barber.id}
                    onClick={() => setSelectedBarberId(barber.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-brand-500/10 border-brand-500 shadow-md ring-1 ring-brand-500"
                        : "bg-[#121826] border-[#232D42] hover:bg-[#161D2C]"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={barber.avatar}
                        alt={barber.name}
                        className="w-11 h-11 rounded-full object-cover border border-[#232D42]"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm text-white truncate">{barber.name}</h4>
                        <p className="text-[11px] text-brand-400 truncate">{barber.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-[#232D42]">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-white">{barber.rating}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {barber.workingHours.start} - {barber.workingHours.end}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 rounded-xl bg-[#161D2C] hover:bg-[#1E2638] text-slate-300 text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center justify-center gap-1"
              >
                <span>Select Date & Time</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DATE & TIME SELECTION */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-brand-400" />
                <span>Select Date & Time Slot</span>
              </h2>
              <span className="text-xs text-slate-400">Step 3 of 4</span>
            </div>

            {/* Date Slider */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Available Dates (Next 7 Days)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {next7Days.map((d) => {
                  const isSelected = selectedDate === d.dateStr;
                  return (
                    <button
                      key={d.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDate(d.dateStr);
                        setSelectedTimeSlot("");
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "bg-brand-500 text-black font-bold border-brand-400 shadow-md shadow-brand-500/20"
                          : "bg-[#121826] border-[#232D42] text-slate-300 hover:bg-[#161D2C] hover:text-white"
                      }`}
                    >
                      <span className="text-[11px] block opacity-80">{d.dayName}</span>
                      <span className="text-base font-bold font-display block leading-tight">
                        {d.dayNumber}
                      </span>
                      <span className="text-[10px] block opacity-70">{d.monthName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Picker by Time of Day */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  <span>Available Time Slots ({selectedService?.duration} mins)</span>
                </label>
                {selectedTimeSlot && (
                  <span className="text-xs text-brand-400 font-bold">
                    Selected: {selectedTimeSlot} (ends at{" "}
                    {selectedService && calculateEndTime(selectedTimeSlot, selectedService.duration)})
                  </span>
                )}
              </div>

              {availableSlots.filter((s) => s.isAvailable).length === 0 ? (
                <div className="p-8 text-center bg-[#121826] border border-[#232D42] rounded-2xl space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-slate-300">
                    No available time slots on {formatDatePretty(selectedDate)}.
                  </p>
                  <p className="text-xs text-slate-500">
                    Please try another date or choose &quot;Any Available Barber&quot;.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Morning Slots */}
                  {groupedSlots.morning.length > 0 && (
                    <div className="bg-[#121826] border border-[#232D42] p-3.5 rounded-xl space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        🌅 Morning
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {groupedSlots.morning.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all ${
                              selectedTimeSlot === slot.time
                                ? "bg-brand-500 text-black font-bold ring-2 ring-brand-400"
                                : slot.isAvailable
                                ? "bg-[#1E2638] text-slate-200 hover:bg-[#2A364F] hover:text-white"
                                : "bg-slate-900/40 text-slate-600 line-through cursor-not-allowed"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Afternoon Slots */}
                  {groupedSlots.afternoon.length > 0 && (
                    <div className="bg-[#121826] border border-[#232D42] p-3.5 rounded-xl space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        ☀️ Afternoon
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {groupedSlots.afternoon.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all ${
                              selectedTimeSlot === slot.time
                                ? "bg-brand-500 text-black font-bold ring-2 ring-brand-400"
                                : slot.isAvailable
                                ? "bg-[#1E2638] text-slate-200 hover:bg-[#2A364F] hover:text-white"
                                : "bg-slate-900/40 text-slate-600 line-through cursor-not-allowed"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evening Slots */}
                  {groupedSlots.evening.length > 0 && (
                    <div className="bg-[#121826] border border-[#232D42] p-3.5 rounded-xl space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        🌙 Evening
                      </span>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {groupedSlots.evening.map((slot) => (
                          <button
                            key={slot.time}
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`py-2 px-3 rounded-lg text-xs font-mono font-medium transition-all ${
                              selectedTimeSlot === slot.time
                                ? "bg-brand-500 text-black font-bold ring-2 ring-brand-400"
                                : slot.isAvailable
                                ? "bg-[#1E2638] text-slate-200 hover:bg-[#2A364F] hover:text-white"
                                : "bg-slate-900/40 text-slate-600 line-through cursor-not-allowed"
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2.5 rounded-xl bg-[#161D2C] hover:bg-[#1E2638] text-slate-300 text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                disabled={!selectedTimeSlot}
                onClick={() => setCurrentStep(4)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:pointer-events-none text-black font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center justify-center gap-1"
              >
                <span>Enter Contact Details</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT INFO & INSTANT CONFIRMATION */}
        {currentStep === 4 && (
          <form onSubmit={handleConfirmBooking} className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>Your Contact Details</span>
              </h2>
              <span className="text-xs text-slate-400">Step 4 of 4</span>
            </div>

            {/* Booking Summary Card */}
            <div className="bg-[#121826] border border-brand-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
              <h3 className="text-xs font-bold text-brand-300 uppercase tracking-wider">
                Booking Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Service</span>
                  <span className="font-semibold text-white">{selectedService?.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Barber</span>
                  <span className="font-semibold text-white">
                    {selectedBarberObj ? selectedBarberObj.name : "Any Available"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date & Time</span>
                  <span className="font-semibold text-white">
                    {formatDatePretty(selectedDate)} @ {selectedTimeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Price</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {selectedService && formatEGP(selectedService.price)}
                  </span>
                </div>
              </div>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-medium">
                {validationError}
              </div>
            )}

            {/* Contact Form */}
            <div className="bg-[#121826] border border-[#232D42] rounded-2xl p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omar Farouk"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Mobile Number (for booking SMS/WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+20 100 234 5678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3.5 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Special Notes or Requests (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bringing hair reference picture, skin fade preference"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3.5 py-2 text-white text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#0E131E] border border-[#232D42] text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  No upfront payment or registration required. Pay in salon upon completion.
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2.5 rounded-xl bg-[#161D2C] hover:bg-[#1E2638] text-slate-300 text-xs font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-sm shadow-xl shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Confirm Booking</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: CONFIRMATION RECEIPT */}
        {currentStep === 5 && confirmedBooking && (
          <div className="bg-[#121826] border border-emerald-800/80 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Top Badge */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white font-display">
                Your Appointment is Confirmed!
              </h2>
              <p className="text-xs text-slate-400">
                We have reserved your chair at {salon.name}. A confirmation has been logged.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-[#161D2C] border border-[#232D42] rounded-xl p-5 space-y-3.5 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#232D42]">
                <span className="text-slate-400">Appointment Code</span>
                <span className="font-mono font-bold text-brand-400 text-sm">
                  #{confirmedBooking.id.slice(-6).toUpperCase()}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer:</span>
                  <span className="font-bold text-white">{confirmedBooking.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span className="font-semibold text-brand-300">
                    {confirmedBooking.serviceName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Barber:</span>
                  <span className="font-medium text-white">{confirmedBooking.barberName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="font-medium text-white">
                    {formatDatePretty(confirmedBooking.date)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time:</span>
                  <span className="font-mono font-bold text-white">
                    {confirmedBooking.startTime} – {confirmedBooking.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-slate-200">{salon.address}, {salon.city}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#232D42]">
                  <span className="text-slate-400 font-medium">Total Amount Due at Shop:</span>
                  <span className="font-bold text-emerald-400 text-base font-display">
                    {formatEGP(confirmedBooking.servicePrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="w-full sm:flex-1 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-black font-bold text-xs text-center shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View on Salon Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedTimeSlot("");
                  setConfirmedBooking(null);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1E2638] hover:bg-[#2A364F] text-slate-200 font-semibold text-xs transition-colors"
              >
                Book Another
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#232D42] bg-[#0E131E] py-4 px-4 text-center text-xs text-slate-500">
        <p>
          Powered by <span className="text-slate-300 font-medium">Baraka Barbershop OS</span> •{" "}
          {salon.phone}
        </p>
      </footer>
    </div>
  );
}
