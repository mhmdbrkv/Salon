"use client";

import React, { useState } from "react";
import { useSalon } from "@/context/SalonContext";
import { Service } from "@/types";
import { formatEGP } from "@/lib/utils";
import {
  Sparkles,
  Plus,
  Clock,
  Edit2,
  Power,
  X,
  Scissors,
  Tag,
  Check,
} from "lucide-react";

export default function ServicesManagementPage() {
  const { services, addService, updateService, toggleServiceStatus } = useSalon();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(200);
  const [duration, setDuration] = useState<number>(30);
  const [category, setCategory] = useState<Service["category"]>("Hair");

  const openAddModal = () => {
    setEditingService(null);
    setName("");
    setDescription("");
    setPrice(200);
    setDuration(30);
    setCategory("Hair");
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setDescription(s.description);
    setPrice(s.price);
    setDuration(s.duration);
    setCategory(s.category);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      updateService(editingService.id, {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        duration: Number(duration),
        category,
      });
    } else {
      addService({
        salonId: "salon-baraka-1",
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        duration: Number(duration),
        category,
        isActive: true,
      });
    }

    setIsModalOpen(false);
  };

  const categories: Service["category"][] = ["Hair", "Beard", "Combo", "Treatment", "Kids"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Services Menu</h1>
          <p className="text-xs text-slate-400">
            Configure your grooming offerings, pricing in EGP, and service durations
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-400 text-black font-semibold text-xs rounded-xl shadow-lg shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-[#121826] border rounded-2xl p-5 transition-all flex flex-col justify-between ${
              service.isActive
                ? "border-[#232D42] hover:border-brand-500/40"
                : "border-slate-800 opacity-60 bg-[#0E131E]"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-300 border border-brand-500/20">
                  {service.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-1.5 rounded-lg bg-[#161D2C] text-slate-300 hover:text-white hover:bg-[#1E2638] border border-[#232D42] transition-colors"
                    title="Edit Service"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleServiceStatus(service.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      service.isActive
                        ? "bg-rose-950/40 text-rose-300 hover:bg-rose-900 border-rose-900"
                        : "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900 border-emerald-900"
                    }`}
                    title={service.isActive ? "Deactivate Service" : "Activate Service"}
                  >
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h2 className="text-base font-bold text-white font-display mb-1">{service.name}</h2>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#232D42] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>{service.duration} mins</span>
              </div>
              <div className="text-base font-bold text-emerald-400 font-display">
                {formatEGP(service.price)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#121826] border border-[#232D42] rounded-2xl shadow-2xl p-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-[#232D42]">
              <h2 className="text-lg font-bold text-white font-display">
                {editingService ? "Edit Service" : "Add New Service"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal VIP Grooming"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Service["category"])}
                  className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the service steps and benefits..."
                  className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Price (EGP) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    step={10}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    step={5}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-[#161D2C] border border-[#232D42] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-500 font-mono"
                  />
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
