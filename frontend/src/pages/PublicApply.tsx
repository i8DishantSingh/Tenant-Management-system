import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Building2,
  User,
  Mail,
  Phone,
  Zap,
  Send,
  CheckCircle2,
  BedDouble,
} from "lucide-react";

interface VacantBedOption {
  bedId: number;
  bedNumber: string;
  roomNumber: string;
  roomId: number;
  baseRent: string;
}

export const PublicApply: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  console.log(propertyId);
  // View Layout States
  const [propertyName, setPropertyName] = useState("");
  const [vacantBeds, setVacantBeds] = useState<VacantBedOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Input States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    selectedBedId: "",
    initialMeterReading: "0",
  });

  // 1. Fetch available property beds manifest upon mounting
  useEffect(() => {
    const fetchVacantInventory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:5001/api/applications/properties/${propertyId}/vacant`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(
            errBody.error ||
              `Server responded with status code ${response.status}`,
          );
        }

        const data = await response.json();
        setPropertyName(data.propertyName);
        setVacantBeds(data.vacantBeds || []);
      } catch (err: any) {
        console.error("Vacancy lookup network failure:", err);
        setError(
          err.message ||
            "Failed to establish clean communication lines with backend matrix systems.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchVacantInventory();
    }
  }, [propertyId]);

  // 2. Transmit Application payload down to database processing queue
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedBedId) {
      alert("Please select an available room/bed allocation slot.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a clean ISO string for today's timestamp
      const todayIsoString = new Date().toISOString();

      const response = await fetch(
        "http://localhost:5001/api/applications/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bedId: Number(formData.selectedBedId),
            name: formData.name,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            initialMeterReading: Number(formData.initialMeterReading),
            proposedJoinDate: todayIsoString, // ✅ FIXED: Adding the missing Date parameter payload
          }),
        },
      );
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        // ✅ UPDATED: Prioritize the raw error message returned from Express/Prisma
        throw new Error(
          errData.error ||
            errData.message ||
            "Failed to file lease application records.",
        );
      }
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.error || "Failed to file lease application records.",
        );
      }

      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        selectedBedId: "",
        initialMeterReading: "0",
      });
    } catch (err: any) {
      console.error("Intake submission failure:", err);
      setError(
        err.message || "A network failure occurred during intake distribution.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // ROUTE SPLIT DISPATCHERS (Guarded safely below all Hook blocks)
  // =========================================================================

  // STATE A: Running asynchronous background fetch routines
  if (loading && !submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm font-medium">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse" />
          <span>Syncing active space vacancy rosters...</span>
        </div>
      </div>
    );
  }

  // STATE B: Operation transaction written out cleanly -> Render Success UI Screen
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Application Filed!
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Thank you for applying to stay at{" "}
            <strong className="text-slate-800">
              {propertyName || "the housing unit"}
            </strong>
            . Your profile has been sent to the landlord onboarding review
            queue. You will be notified once operations are processed.
          </p>
        </div>
      </div>
    );
  }

  // STATE C: Property context has loaded completely, but contains 0 open bed allocations
  if (vacantBeds.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <BedDouble size={30} />
          </div>
          <h2 className="text-xl font-bold text-slate-900">100% Occupied</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            We're sorry, but{" "}
            <strong className="text-slate-800">
              {propertyName || "Devkaran Housing"}
            </strong>{" "}
            currently has zero vacant room allotments. Please contact the
            management desk directly to register for the waiting list.
          </p>
        </div>
      </div>
    );
  }

  // STATE D: Standard Active Form Intake Interface View Engine
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
        {/* Visual Identity Strip Header Banner */}
        <div className="bg-slate-900 text-white p-6 flex items-center space-x-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white">
            <Building2 size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              {propertyName || "Apex Housing Network"}
            </h1>
            <p className="text-xs text-slate-400">
              Digital Residency Request Intake Manifest
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Dynamic Bed Selector Dropdown Menu Options */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Select Desired Room & Bed Space
              </label>
              <div className="relative">
                <BedDouble
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <select
                  required
                  value={formData.selectedBedId}
                  onChange={(e) =>
                    setFormData({ ...formData, selectedBedId: e.target.value })
                  }
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer text-slate-700"
                >
                  <option value="">
                    -- Choose a Vacant Allocation Slot --
                  </option>
                  {vacantBeds.map((bed) => (
                    <option key={bed.bedId} value={bed.bedId}>
                      Room {bed.roomNumber} &bull; {bed.bedNumber} (₹
                      {Number(bed.baseRent).toLocaleString()}/mo)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <hr className="border-slate-100 my-2" />

            {/* Applicant Personal Particular Data Parameters */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="Jane Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                    placeholder="applicant@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                  Mobile Contact Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                    placeholder="+91 99999 88888"
                  />
                </div>
              </div>
            </div>

            {/* Sub-Meter Baseline Data Frame Initialization Input */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Current Electric Sub-Meter Handover Reading (kWh)
              </label>
              <div className="relative">
                <Zap
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="number"
                  required
                  value={formData.initialMeterReading}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      initialMeterReading: e.target.value,
                    })
                  }
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            {/* Dispatch Submission Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg text-sm transition mt-4 flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:bg-blue-400 select-none"
            >
              <span>
                {loading
                  ? "Transmitting Particulars..."
                  : "Transmit Application Form"}
              </span>
              {!loading && <Send size={14} />}
            </button>
          </form>
        </div>

        {/* Footer Identity Frame */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-center text-[11px] text-slate-400 font-medium tracking-tight">
          Apex SaaS Engine Secure Data Transit &bull; June 2026
        </div>
      </div>
    </div>
  );
};
