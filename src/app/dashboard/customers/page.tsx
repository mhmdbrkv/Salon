"use client";

import React, { useState, useMemo } from "react";
import { useSalon } from "@/context/SalonContext";
import { formatEGP, formatDatePretty } from "@/lib/utils";
import { Customer, Appointment } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Users,
  Search,
  Phone,
  Calendar,
  CreditCard,
  History,
  X,
  User,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function CustomersPage() {
  const { customers, getCustomerAppointments } = useSalon();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const q = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }, [customers, searchQuery]);

  const customerAppointments = useMemo(() => {
    if (!selectedCustomer) return [];
    return getCustomerAppointments(selectedCustomer.phone).sort((a, b) =>
      b.date.localeCompare(a.date)
    );
  }, [selectedCustomer, getCustomerAppointments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">دليل العملاء</h1>
          <p className="text-xs text-slate-400">
            متابعة الولاء، عدد الزيارات، وسجل الحجوزات السابقة
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121826] border border-[#232D42] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#121826] border border-[#232D42] rounded-2xl overflow-hidden shadow-card-subtle">
        {filteredCustomers.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <Users className="w-10 h-10 mx-auto text-slate-600" />
            <p className="text-sm font-medium text-slate-300">No customers found.</p>
            <p className="text-xs text-slate-500">
              Try searching with a different name or phone number.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#232D42] bg-[#0E131E] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4 sm:px-6">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Total Visits</th>
                  <th className="py-3 px-4">Last Visit</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4 text-right">History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293D]">
                {filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomer(cust)}
                    className="hover:bg-[#161D2C]/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="font-bold text-white text-sm">{cust.name}</div>
                      {cust.email && (
                        <div className="text-[11px] text-slate-400">{cust.email}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {cust.phone}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-300 border border-brand-500/20">
                        {cust.totalVisits} visits
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      {cust.lastVisitDate ? formatDatePretty(cust.lastVisitDate) : "—"}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-emerald-400 font-mono">
                      {formatEGP(cust.totalSpent)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(cust);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1E2638] group-hover:bg-brand-500 group-hover:text-black text-slate-300 text-[11px] font-semibold transition-all"
                      >
                        <History className="w-3.5 h-3.5" />
                        <span>View Records</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Appointment History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCustomer(null)}
          />
          <div className="relative w-full max-w-xl bg-[#121826] border border-[#232D42] rounded-2xl shadow-2xl p-6 z-10 max-h-[90vh] overflow-y-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#232D42]">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  {selectedCustomer.name}
                </h3>
                <p className="text-xs text-brand-400 font-mono flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{selectedCustomer.phone}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-3 gap-3 bg-[#161D2C] p-3.5 rounded-xl border border-[#232D42] text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Total Visits</span>
                <span className="text-base font-bold text-white">
                  {selectedCustomer.totalVisits}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Lifetime Spent</span>
                <span className="text-base font-bold text-emerald-400">
                  {formatEGP(selectedCustomer.totalSpent)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Last Visit</span>
                <span className="text-slate-200 font-medium">
                  {selectedCustomer.lastVisitDate
                    ? formatDatePretty(selectedCustomer.lastVisitDate)
                    : "—"}
                </span>
              </div>
            </div>

            {/* Appointment History List */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
                Appointment History ({customerAppointments.length})
              </h4>

              {customerAppointments.length === 0 ? (
                <p className="text-center py-6 text-xs text-slate-500 bg-[#0E131E] rounded-xl border border-[#232D42]">
                  No past appointments recorded for this customer phone number.
                </p>
              ) : (
                <div className="space-y-2">
                  {customerAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 bg-[#161D2C] rounded-xl border border-[#232D42] flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-semibold text-white">{apt.serviceName}</span>
                          <span className="text-emerald-400 font-mono font-medium">
                            {formatEGP(apt.servicePrice)}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2">
                          <span className="font-mono">
                            {formatDatePretty(apt.date)} @ {apt.startTime}
                          </span>
                          <span>•</span>
                          <span>Barber: {apt.barberName}</span>
                        </div>
                      </div>
                      <StatusBadge status={apt.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#232D42] flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-lg bg-[#1E2638] hover:bg-[#2A364F] text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
