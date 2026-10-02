"use client";

import React, { useState, useMemo } from "react";
import { useSalon } from "@/context/SalonContext";
import { generateAvailableSlots, calculateEndTime, findAvailableBarberForSlot } from "@/lib/scheduling";
import { getTodayDateString, formatEGP, formatTimeDisplay } from "@/lib/utils";
import { X, Calendar, Clock, Scissors, User, Phone, Check } from "lucide-react";

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBarberId?: string;
  defaultDate?: string;
  defaultTime?: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  defaultBarberId,
  defaultDate,
  defaultTime,
}) => {
  const { salon, barbers, services, appointments, addAppointment } = useSalon();

  const [serviceId, setServiceId] = useState<string>(services[0]?.id || "");
  const [barberId, setBarberId] = useState<string>(defaultBarberId || "any");
  const [date, setDate] = useState<string>(defaultDate || getTodayDateString());
  const [selectedTime, setSelectedTime] = useState<string>(defaultTime || "");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("+20 ");
  const [source, setSource] = useState<"WALK_IN" | "PHONE">("WALK_IN");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId) || services[0],
    [services, serviceId]
  );

  const availableSlots = useMemo(() => {
    if (!selectedService || !date) return [];
    return generateAvailableSlots({
      date,
      serviceDuration: selectedService.duration,
      barberId,
      serviceId: selectedService.id,
      appointments,
      barbers,
      salon,
    });
  }, [date, selectedService, barberId, appointments, barbers, salon]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Please enter the customer's name.");
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 9) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }
    if (!selectedTime) {
      setErrorMsg("Please select an available time slot.");
      return;
    }

    let assignedBarber = barbers.find((b) => b.id === barberId);
    if (barberId === "any" || !assignedBarber) {
      assignedBarber = findAvailableBarberForSlot(
        selectedTime,
        selectedService.duration,
        date,
        selectedService.id,
        appointments,
        barbers
      ) || undefined;
    }

    if (!assignedBarber) {
      setErrorMsg("No barber is available for this exact slot. Please choose another time.");
      return;
    }

    const endTime = calculateEndTime(selectedTime, selectedService.duration);

    addAppointment({
      salonId: salon.id,
      barberId: assignedBarber.id,
      barberName: assignedBarber.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.duration,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      date,
      startTime: selectedTime,
      endTime,
      status: source === "WALK_IN" ? "CHECKED_IN" : "BOOKED",
      source,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#121826] border border-[#232D42] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#232D42] flex items-center justify-between bg-[#0E131E]">
          <div>
            <h2 className="text-lg font-bold text-white font-display">New Appointment</h2>
            <p className="text-xs text-slate-400">Add a walk-in customer or phone reservation</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1E2638] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm flex-1">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Booking Type Pill */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSource("WALK_IN")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                source === "WALK_IN"
                  ? "bg-brand-500/20 border-brand-500 text-brand-300"
                  : "bg-[#161D2C] border-[#232D42] text-slate-400 hover:text-white"
              }`}
            >
              🚶 Walk-in (Ready Now)
            </button>
            <button
              type="button"
              onClick={() => setSource("PHONE")}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                source === "PHONE"
                  ? "bg-brand-500/20 border-brand-500 text-brand-300"
                  : "bg-[#161D2C] border-[#232D42] text-slate-400 hover:text-white"
              }`}
            >
              📞 Phone Booking
            </button>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 text-brand-400" />
              <span>Select Service</span>
            </label>
            <select
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setSelectedTime("");
              }}
              className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 text-sm"
            >
              {services
                .filter((s) => s.isActive)
                .map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} — {formatEGP(srv.price)} ({srv.duration} mins)
                  </option>
                ))}
            </select>
          </div>

          {/* Barber Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-brand-400" />
              <span>Assigned Barber</span>
            </label>
            <select
              value={barberId}
              onChange={(e) => {
                setBarberId(e.target.value);
                setSelectedTime("");
              }}
              className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 text-sm"
            >
              <option value="any">✨ Any Available Barber (Auto-assign)</option>
              {barbers
                .filter((b) => b.isActive)
                .map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.role})
                  </option>
                ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-400" />
              <span>Appointment Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setSelectedTime("");
              }}
              className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 text-sm"
            />
          </div>

          {/* Time Slot Picker Grid */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>Select Time Slot ({selectedService.duration} min duration)</span>
              </span>
              {selectedTime && (
                <span className="text-xs text-brand-400 font-semibold">
                  Ends at {calculateEndTime(selectedTime, selectedService.duration)}
                </span>
              )}
            </label>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 bg-[#0E131E] rounded-lg border border-[#232D42]">
              {availableSlots.length === 0 ? (
                <p className="col-span-full text-center py-4 text-xs text-slate-500">
                  No slots available for this date/barber.
                </p>
              ) : (
                availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.isAvailable}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-1.5 px-2 rounded text-xs font-medium transition-all ${
                      selectedTime === slot.time
                        ? "bg-brand-500 text-black font-bold ring-2 ring-brand-400"
                        : slot.isAvailable
                        ? "bg-[#1E2638] text-slate-200 hover:bg-[#2A364F] hover:text-white"
                        : "bg-slate-900/40 text-slate-600 line-through cursor-not-allowed"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Customer Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Mahmoud Taha"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="+20 100 123 4567"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
                className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-500 text-sm"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Internal Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. VIP client, preferred side part"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-brand-500 text-xs"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-[#232D42] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#161D2C] hover:bg-[#1E2638] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-bold text-black bg-brand-500 hover:bg-brand-400 active:scale-95 transition-all shadow-md shadow-brand-500/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Appointment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
