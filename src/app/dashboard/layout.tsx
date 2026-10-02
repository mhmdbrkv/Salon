"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { NewAppointmentModal } from "@/components/dashboard/NewAppointmentModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [newBookingOpen, setNewBookingOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B0F17] text-slate-100">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader onNewBookingClick={() => setNewBookingOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Global New Appointment Modal */}
      <NewAppointmentModal
        isOpen={newBookingOpen}
        onClose={() => setNewBookingOpen(false)}
      />
    </div>
  );
}
