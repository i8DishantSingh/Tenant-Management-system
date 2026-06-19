import React, { useState } from "react";
import {
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  PlusCircle,
} from "lucide-react";

interface Ticket {
  id: number;
  roomNumber: string;
  category: string;
  description: string;
  severity: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
}

export const MaintenanceTracker: React.FC = () => {
  // Mock tracking matrix array for initial utility assembly
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1,
      roomNumber: "002",
      category: "Plumbing",
      description:
        "Bathroom tap is leaking continuously, causing minor floor flooding.",
      severity: "Medium",
      status: "Open",
      createdAt: "2026-06-18",
    },
    {
      id: 2,
      roomNumber: "104",
      category: "Electrical",
      description:
        "Sub-meter casing sparking slightly when the AC unit kicks in.",
      severity: "High",
      status: "In Progress",
      createdAt: "2026-06-19",
    },
  ]);

  const toggleStatus = (id: number, nextStatus: "In Progress" | "Resolved") => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)),
    );
  };

  const severityColors = {
    Low: "bg-green-50 text-green-700 border-green-100",
    Medium: "bg-amber-50 text-amber-700 border-amber-100",
    High: "bg-red-50 text-red-700 border-red-100 animate-pulse",
  };

  const statusIcons = {
    Open: <AlertTriangle size={14} className="text-red-500" />,
    "In Progress": <Clock size={14} className="text-amber-500 animate-spin" />,
    Resolved: <CheckCircle size={14} className="text-green-500" />,
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
      {/* Module Title Header */}
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <Wrench size={18} className="text-blue-400" />
          <h3 className="font-bold text-sm tracking-tight">
            Property Maintenance Desk
          </h3>
        </div>
        <button className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1 cursor-pointer">
          <PlusCircle size={14} />
          <span>Log Issue</span>
        </button>
      </div>

      {/* Ticket List Body */}
      <div className="divide-y divide-slate-100">
        {tickets.length === 0 ? (
          <div className="p-6 text-center text-xs font-medium text-slate-400">
            No active maintenance incidents reported for this facility.
          </div>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-slate-50/40 transition"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="font-bold text-sm text-slate-800">
                    Room {ticket.roomNumber}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    &bull; {ticket.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 border rounded ${severityColors[ticket.severity]}`}
                  >
                    {ticket.severity} Priority
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 leading-relaxed max-w-2xl">
                  {ticket.description}
                </p>
                <div className="text-[11px] text-slate-400 font-medium flex items-center space-x-1">
                  <span>Reported on: {ticket.createdAt}</span>
                </div>
              </div>

              {/* Status Controls */}
              <div className="flex items-center space-x-3 self-end md:self-center">
                <div className="flex items-center space-x-1 text-xs font-bold text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg bg-slate-50">
                  {statusIcons[ticket.status]}
                  <span>{ticket.status}</span>
                </div>

                {ticket.status !== "Resolved" && (
                  <div className="flex space-x-1">
                    {ticket.status === "Open" && (
                      <button
                        onClick={() => toggleStatus(ticket.id, "In Progress")}
                        className="text-xs font-bold px-2.5 py-1 border border-amber-200 text-amber-700 hover:bg-amber-50 rounded-md transition cursor-pointer"
                      >
                        Start Fix
                      </button>
                    )}
                    {ticket.status === "In Progress" && (
                      <button
                        onClick={() => toggleStatus(ticket.id, "Resolved")}
                        className="text-xs font-bold px-2.5 py-1 border border-green-200 text-green-700 hover:bg-green-50 rounded-md transition cursor-pointer"
                      >
                        Close Ticket
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
