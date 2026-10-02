import React from "react";
import { AppointmentStatus } from "@/types";
import { cn } from "@/lib/utils";
import { 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Scissors, 
  XCircle, 
  UserX 
} from "lucide-react";

interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export const statusConfig: Record<
  AppointmentStatus,
  { label: string; bg: string; text: string; border: string; icon: React.ElementType }
> = {
  BOOKED: {
    label: "Booked",
    bg: "bg-sky-950/60",
    text: "text-sky-400",
    border: "border-sky-800/60",
    icon: Clock,
  },
  CHECKED_IN: {
    label: "Checked In",
    bg: "bg-indigo-950/60",
    text: "text-indigo-400",
    border: "border-indigo-800/60",
    icon: UserCheck,
  },
  IN_SERVICE: {
    label: "In Service",
    bg: "bg-amber-950/60",
    text: "text-amber-400",
    border: "border-amber-700/60",
    icon: Scissors,
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-950/60",
    text: "text-emerald-400",
    border: "border-emerald-800/60",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-rose-950/50",
    text: "text-rose-400",
    border: "border-rose-900/50",
    icon: XCircle,
  },
  NO_SHOW: {
    label: "No Show",
    bg: "bg-slate-900/80",
    text: "text-slate-400",
    border: "border-slate-800",
    icon: UserX,
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  className,
  showIcon = true,
}) => {
  const config = statusConfig[status] || statusConfig.BOOKED;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3 py-1.5 gap-2 font-medium",
  }[size];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-colors",
        config.bg,
        config.text,
        config.border,
        sizeClasses,
        className
      )}
    >
      {showIcon && <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />}
      <span>{config.label}</span>
    </span>
  );
};
