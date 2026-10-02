"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Salon, Barber, Service, Customer, Appointment, AppointmentStatus } from "@/types";
import {
  initialSalon,
  initialBarbers,
  initialServices,
  initialCustomers,
  initialAppointments,
} from "@/data/mockData";
import { getTodayDateString } from "@/lib/utils";

interface SalonKPIs {
  todayRevenue: number;
  todayAppointmentsCount: number;
  todayCompletedCount: number;
  todayNoShowsCount: number;
  todayInServiceCount: number;
  todayUpcomingCount: number;
}

interface SalonContextType {
  salon: Salon;
  barbers: Barber[];
  services: Service[];
  customers: Customer[];
  appointments: Appointment[];
  kpis: SalonKPIs;
  isHydrated: boolean;
  addAppointment: (apt: Omit<Appointment, "id" | "createdAt">) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addBarber: (barber: Omit<Barber, "id">) => void;
  updateBarber: (id: string, barber: Partial<Barber>) => void;
  toggleBarberStatus: (id: string) => void;
  addService: (service: Omit<Service, "id">) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  toggleServiceStatus: (id: string) => void;
  updateSalonSettings: (updates: Partial<Salon>) => void;
  getCustomerById: (id: string) => Customer | undefined;
  getCustomerAppointments: (customerPhone: string) => Appointment[];
  resetToDefaultData: () => void;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SALON: "baraka_salon_data",
  BARBERS: "baraka_barbers_data",
  SERVICES: "baraka_services_data",
  CUSTOMERS: "baraka_customers_data",
  APPOINTMENTS: "baraka_appointments_data",
};

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [salon, setSalon] = useState<Salon>(initialSalon);
  const [barbers, setBarbers] = useState<Barber[]>(initialBarbers);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedSalon = localStorage.getItem(STORAGE_KEYS.SALON);
      const savedBarbers = localStorage.getItem(STORAGE_KEYS.BARBERS);
      const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
      const savedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      const savedAppointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);

      if (savedSalon) setSalon(JSON.parse(savedSalon));
      if (savedBarbers) setBarbers(JSON.parse(savedBarbers));
      if (savedServices) setServices(JSON.parse(savedServices));
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
      if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
    } catch (e) {
      console.warn("Could not load from localStorage, using initial mock data", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SALON, JSON.stringify(salon));
      localStorage.setItem(STORAGE_KEYS.BARBERS, JSON.stringify(barbers));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.warn("Could not persist state to localStorage", e);
    }
  }, [salon, barbers, services, customers, appointments, isHydrated]);

  // Dynamic KPI calculations for today
  const kpis = useMemo(() => {
    const todayStr = getTodayDateString();
    const todayApts = appointments.filter((a) => a.date === todayStr);

    const completed = todayApts.filter((a) => a.status === "COMPLETED");
    const noShows = todayApts.filter((a) => a.status === "NO_SHOW");
    const inService = todayApts.filter((a) => a.status === "IN_SERVICE");
    const upcoming = todayApts.filter((a) => a.status === "BOOKED" || a.status === "CHECKED_IN");

    // Revenue only counts completed appointments as per rule 18
    const revenue = completed.reduce((sum, apt) => sum + (apt.servicePrice || 0), 0);

    return {
      todayRevenue: revenue,
      todayAppointmentsCount: todayApts.length,
      todayCompletedCount: completed.length,
      todayNoShowsCount: noShows.length,
      todayInServiceCount: inService.length,
      todayUpcomingCount: upcoming.length,
    };
  }, [appointments]);

  const addAppointment = useCallback(
    (aptData: Omit<Appointment, "id" | "createdAt">): Appointment => {
      const newId = `apt-${Date.now()}`;
      const newAppointment: Appointment = {
        ...aptData,
        id: newId,
        createdAt: new Date().toISOString(),
      };

      setAppointments((prev) => [newAppointment, ...prev]);

      // Sync customer record or create one
      setCustomers((prevCustomers) => {
        const existingIdx = prevCustomers.findIndex(
          (c) => c.phone.replace(/\s+/g, "") === aptData.customerPhone.replace(/\s+/g, "")
        );

        if (existingIdx >= 0) {
          const updated = [...prevCustomers];
          const curr = updated[existingIdx];
          updated[existingIdx] = {
            ...curr,
            totalVisits: curr.totalVisits + 1,
            totalSpent: curr.totalSpent + (aptData.status === "COMPLETED" ? aptData.servicePrice : 0),
            lastVisitDate: aptData.date,
          };
          return updated;
        } else {
          const newCust: Customer = {
            id: `cust-${Date.now()}`,
            salonId: aptData.salonId,
            name: aptData.customerName,
            phone: aptData.customerPhone,
            totalVisits: 1,
            totalSpent: aptData.status === "COMPLETED" ? aptData.servicePrice : 0,
            lastVisitDate: aptData.date,
            createdAt: aptData.date,
          };
          return [newCust, ...prevCustomers];
        }
      });

      return newAppointment;
    },
    []
  );

  const updateAppointmentStatus = useCallback((id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        return { ...a, status };
      })
    );
  }, []);

  const addBarber = useCallback((barberData: Omit<Barber, "id">) => {
    const newBarber: Barber = {
      ...barberData,
      id: `barber-${Date.now()}`,
    };
    setBarbers((prev) => [...prev, newBarber]);
  }, []);

  const updateBarber = useCallback((id: string, updates: Partial<Barber>) => {
    setBarbers((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }, []);

  const toggleBarberStatus = useCallback((id: string) => {
    setBarbers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  }, []);

  const addService = useCallback((serviceData: Omit<Service, "id">) => {
    const newService: Service = {
      ...serviceData,
      id: `srv-${Date.now()}`,
    };
    setServices((prev) => [...prev, newService]);
  }, []);

  const updateService = useCallback((id: string, updates: Partial<Service>) => {
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  }, []);

  const toggleServiceStatus = useCallback((id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  }, []);

  const updateSalonSettings = useCallback((updates: Partial<Salon>) => {
    setSalon((prev) => ({ ...prev, ...updates }));
  }, []);

  const getCustomerById = useCallback(
    (id: string) => {
      return customers.find((c) => c.id === id);
    },
    [customers]
  );

  const getCustomerAppointments = useCallback(
    (customerPhone: string) => {
      const cleanPhone = customerPhone.replace(/\s+/g, "");
      return appointments.filter(
        (a) => a.customerPhone.replace(/\s+/g, "") === cleanPhone
      );
    },
    [appointments]
  );

  const resetToDefaultData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.SALON);
    localStorage.removeItem(STORAGE_KEYS.BARBERS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);

    setSalon(initialSalon);
    setBarbers(initialBarbers);
    setServices(initialServices);
    setCustomers(initialCustomers);
    setAppointments(initialAppointments);
  }, []);

  return (
    <SalonContext.Provider
      value={{
        salon,
        barbers,
        services,
        customers,
        appointments,
        kpis,
        isHydrated,
        addAppointment,
        updateAppointmentStatus,
        addBarber,
        updateBarber,
        toggleBarberStatus,
        addService,
        updateService,
        toggleServiceStatus,
        updateSalonSettings,
        getCustomerById,
        getCustomerAppointments,
        resetToDefaultData,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export function useSalon() {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error("useSalon must be used within a SalonProvider");
  }
  return context;
}
