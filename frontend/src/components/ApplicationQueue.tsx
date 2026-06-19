import React, { useState, useEffect } from "react";
import { Check, X, User, Mail, Phone, Zap, Clock, Inbox } from "lucide-react";

interface Application {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  initialMeterReading: number;
  proposedJoinDate: string;
  bed: {
    bedNumber: string;
    room: {
      roomNumber: string;
    };
  };
}

interface ApplicationQueueProps {
  propertyId: number;
  onActionComplete: () => void; // Refreshes the room grid layout automatically on approval
}

export const ApplicationQueue: React.FC<ApplicationQueueProps> = ({
  propertyId,
  onActionComplete,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:5001/api/applications/property/${propertyId}/pending`,
      );

      if (!response.ok)
        throw new Error("Failed to load inbound applicant metrics.");

      const data = await response.json();
      setApplications(data.applications || []);
    } catch (err: any) {
      setError(err.message || "Failed to sync pending intake logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) fetchApplications();
  }, [propertyId]);

  const handleAction = async (id: number, action: "approve" | "reject") => {
    try {
      setProcessingId(id);
      setError(null);

      const response = await fetch(
        `http://localhost:5001/api/applications/${id}/${action}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error || `Failed to execute allocation ${action} loop.`,
        );
      }

      // Locally slice out the processed row item dynamically
      setApplications((prev) => prev.filter((app) => app.id !== id));
      onActionComplete(); // Force parent matrix redraw updates!
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-xs font-semibold text-slate-400 p-4 animate-pulse text-center">
        Loading inbound queue...
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-6">
      <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-white">
          <Clock size={18} className="text-blue-400" />
          <h3 className="font-bold text-sm tracking-tight">
            Inbound Intake Review Queue
          </h3>
        </div>
        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">
          {applications.length} Pending
        </span>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="p-8 text-center space-y-2 flex flex-col items-center">
          <Inbox size={28} className="text-slate-300" />
          <p className="text-xs font-medium text-slate-400">
            All applications processed. Inbound pipeline is clean.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white hover:bg-slate-50/50 transition"
            >
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-800">
                    {app.name}
                  </span>
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded">
                    Allocated: Room {app.bed?.room?.roomNumber} &bull;{" "}
                    {app.bed?.bedNumber}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                  <div className="flex items-center">
                    <Mail size={12} className="mr-1 text-slate-400" />{" "}
                    {app.email}
                  </div>
                  <div className="flex items-center">
                    <Phone size={12} className="mr-1 text-slate-400" />{" "}
                    {app.phoneNumber}
                  </div>
                  <div className="flex items-center">
                    <Zap size={12} className="mr-1 text-slate-400" />{" "}
                    {app.initialMeterReading} kWh
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end md:self-center">
                <button
                  disabled={processingId !== null}
                  onClick={() => handleAction(app.id, "reject")}
                  className="p-1.5 border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 cursor-pointer"
                  title="Reject and drop entry"
                >
                  <X size={16} />
                </button>
                <button
                  disabled={processingId !== null}
                  onClick={() => handleAction(app.id, "approve")}
                  className="bg-blue-600 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <Check size={14} />
                  <span>
                    {processingId === app.id
                      ? "Processing..."
                      : "Approve Check-In"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
