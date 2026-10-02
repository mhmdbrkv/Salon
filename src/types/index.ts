export type AppointmentStatus =
  | "BOOKED"
  | "CHECKED_IN"
  | "IN_SERVICE"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface Salon {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  address: string;
  city: string;
  phone: string;
  rating: number;
  reviewCount: number;
  openTime: string; // "09:00"
  closeTime: string; // "22:00"
  slotIntervalMinutes: number; // 15 or 30
  currency: string; // "EGP"
  coverImage?: string;
  logoImage?: string;
}

export interface Barber {
  id: string;
  salonId: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  rating: number;
  reviewCount: number;
  workingHours: {
    start: string; // "09:00"
    end: string;   // "21:00"
    offDays: number[]; // 0 for Sun, 5 for Fri, etc.
  };
  serviceIds: string[];
  isActive: boolean;
}

export interface Service {
  id: string;
  salonId: string;
  name: string;
  description: string;
  price: number; // in EGP
  duration: number; // in minutes
  category: "Hair" | "Beard" | "Combo" | "Treatment" | "Kids";
  isActive: boolean;
}

export interface Customer {
  id: string;
  salonId: string;
  name: string;
  phone: string;
  email?: string;
  totalVisits: number;
  totalSpent: number; // in EGP
  lastVisitDate: string;
  notes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  salonId: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: number;
  customerName: string;
  customerPhone: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  status: AppointmentStatus;
  notes?: string;
  source: "ONLINE_BOOKING" | "WALK_IN" | "PHONE";
  createdAt: string;
}

export interface TimeSlot {
  time: string; // "HH:mm"
  isAvailable: boolean;
  barberId?: string;
  reason?: string;
}
