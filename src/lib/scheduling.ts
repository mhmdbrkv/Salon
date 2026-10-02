import { Appointment, Barber, Salon } from "@/types";

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  const startMin = timeToMinutes(startTime);
  const endMin = startMin + durationMinutes;
  return minutesToTime(endMin);
}

export function doTimeIntervalsOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB);

  // Two intervals overlap if each starts before the other ends
  return sA < eB && sB < eA;
}

export interface GeneratedSlot {
  time: string;
  isAvailable: boolean;
  availableBarberIds: string[];
  reason?: string;
}

/**
 * Generates slot grid and determines availability for a given date, barber, and service duration.
 * Excludes cancelled appointments. Respects active barber status and working hours.
 */
export function generateAvailableSlots({
  date,
  serviceDuration,
  barberId,
  serviceId,
  appointments,
  barbers,
  salon,
}: {
  date: string;
  serviceDuration: number;
  barberId: string | "any";
  serviceId?: string;
  appointments: Appointment[];
  barbers: Barber[];
  salon: Salon;
}): GeneratedSlot[] {
  const step = salon.slotIntervalMinutes || 30;
  const salonStartMin = timeToMinutes(salon.openTime || "09:00");
  const salonEndMin = timeToMinutes(salon.closeTime || "22:00");

  const [year, month, day] = date.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 5 = Friday, etc.

  // Filter active barbers who are capable of providing the service (if serviceId provided)
  const candidateBarbers = barbers.filter((b) => {
    if (!b.isActive) return false;
    if (b.workingHours.offDays.includes(dayOfWeek)) return false;
    if (serviceId && !b.serviceIds.includes(serviceId)) return false;
    if (barberId !== "any" && b.id !== barberId) return false;
    return true;
  });

  // Active non-cancelled appointments for this date
  const dayAppointments = appointments.filter(
    (apt) => apt.date === date && apt.status !== "CANCELLED"
  );

  const slots: GeneratedSlot[] = [];

  for (let currentMin = salonStartMin; currentMin + serviceDuration <= salonEndMin; currentMin += step) {
    const slotStartTime = minutesToTime(currentMin);
    const slotEndTime = minutesToTime(currentMin + serviceDuration);

    const freeBarberIds: string[] = [];

    for (const barber of candidateBarbers) {
      const bStart = timeToMinutes(barber.workingHours.start);
      const bEnd = timeToMinutes(barber.workingHours.end);

      // Check if slot falls within barber working hours
      if (currentMin < bStart || currentMin + serviceDuration > bEnd) {
        continue;
      }

      // Check if barber has conflicting appointment
      const hasConflict = dayAppointments.some(
        (apt) =>
          apt.barberId === barber.id &&
          doTimeIntervalsOverlap(slotStartTime, slotEndTime, apt.startTime, apt.endTime)
      );

      if (!hasConflict) {
        freeBarberIds.push(barber.id);
      }
    }

    const isAvailable = freeBarberIds.length > 0;

    slots.push({
      time: slotStartTime,
      isAvailable,
      availableBarberIds: freeBarberIds,
      reason: !isAvailable ? (candidateBarbers.length === 0 ? "No barber available" : "Fully booked") : undefined,
    });
  }

  return slots;
}

export function findAvailableBarberForSlot(
  time: string,
  duration: number,
  date: string,
  serviceId: string | undefined,
  appointments: Appointment[],
  barbers: Barber[]
): Barber | null {
  const [year, month, day] = date.split("-").map(Number);
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  const slotStart = time;
  const slotEnd = calculateEndTime(time, duration);
  const startMin = timeToMinutes(slotStart);
  const endMin = timeToMinutes(slotEnd);

  const dayAppointments = appointments.filter(
    (apt) => apt.date === date && apt.status !== "CANCELLED"
  );

  for (const barber of barbers) {
    if (!barber.isActive) continue;
    if (barber.workingHours.offDays.includes(dayOfWeek)) continue;
    if (serviceId && !barber.serviceIds.includes(serviceId)) continue;

    const bStart = timeToMinutes(barber.workingHours.start);
    const bEnd = timeToMinutes(barber.workingHours.end);
    if (startMin < bStart || endMin > bEnd) continue;

    const hasConflict = dayAppointments.some(
      (apt) =>
        apt.barberId === barber.id &&
        doTimeIntervalsOverlap(slotStart, slotEnd, apt.startTime, apt.endTime)
    );

    if (!hasConflict) {
      return barber;
    }
  }

  return null;
}
