import React, { useState, useEffect } from "react";
import {
  Building2,
  PlusCircle,
  CheckCircle,
  XCircle,
  MapPin,
  RefreshCw,
  X,
  UserPlus,
  UserMinus,
  User,
  Mail,
  Phone,
  Zap,
} from "lucide-react";
import { api } from "../services/api";
import type { PropertyDetails, SelectedBedContext } from "../types/property";

export const PropertyGrid: React.FC = () => {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal Interaction States
  const [selectedBed, setSelectedBed] = useState<SelectedBedContext | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [tenantForm, setTenantForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    initialMeterReading: "0",
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    totalFloors: "3",
    roomsPerFloor: "4",
    bedsPerRoom: "2",
    baseRentPerBed: "8500",
  });

  const fetchPropertyData = async () => {
    try {
      setLoading(true);
      const properties = await api.get<any[]>("/properties");

      if (properties && properties.length > 0) {
        const details = await api.get<PropertyDetails>(
          `/properties/${properties[0].id}`,
        );
        setProperty(details);
      } else {
        setProperty(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sync property floorplan matrix.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPropertyData();
  }, []);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/properties/setup-layout", {
        userId: 1,
        name: formData.name,
        address: formData.address,
        totalFloors: Number(formData.totalFloors),
        roomsPerFloor: Number(formData.roomsPerFloor),
        bedsPerRoom: Number(formData.bedsPerRoom),
        baseRentPerBed: Number(formData.baseRentPerBed),
      });

      setFormData({
        name: "",
        address: "",
        totalFloors: "3",
        roomsPerFloor: "4",
        bedsPerRoom: "2",
        baseRentPerBed: "8500",
      });
      setShowCreateForm(false);
      await fetchPropertyData();
    } catch (err: any) {
      setError(
        err.message ||
          "Backend execution failed during matrix loop generation.",
      );
      setLoading(false);
    }
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBed) return;
    setSubmitting(true);
    setError(null);

    try {
      await api.post("/applications/submit", {
        bedId: selectedBed.bedId,
        name: tenantForm.name,
        email: tenantForm.email,
        phoneNumber: tenantForm.phoneNumber,
        initialMeterReading: Number(tenantForm.initialMeterReading),
      });

      setTenantForm({
        name: "",
        email: "",
        phoneNumber: "",
        initialMeterReading: "0",
      });
      setSelectedBed(null);
      await fetchPropertyData();
    } catch (err: any) {
      setError(err.message || "Failed to finalize room checking placement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckOut = async () => {
    if (!selectedBed) return;
    if (
      !window.confirm(
        `Are you sure you want to process check-out operations for this bed allocation slot?`,
      )
    )
      return;

    setSubmitting(true);
    setError(null);

    try {
      await api.patch(`/applications/beds/${selectedBed.bedId}/evict`);
      setSelectedBed(null);
      await fetchPropertyData();
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to safely dissolve resident structural assignment logs.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] space-x-2 text-slate-500">
        <RefreshCw className="animate-spin" size={20} />
        <span className="text-sm font-medium">
          Compiling dynamic building schema vectors...
        </span>
      </div>
    );
  }

  if (!property || showCreateForm) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center space-x-3 mb-6">
          <PlusCircle className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-slate-900">
            Initialize Property Matrix
          </h2>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleCreateProperty} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Building/PG Name
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                placeholder="Apex Boys PG"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Monthly Rent per Bed (₹)
              </label>
              <input
                type="number"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                value={formData.baseRentPerBed}
                onChange={(e) =>
                  setFormData({ ...formData, baseRentPerBed: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
              Physical Address
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Total Floors
              </label>
              <input
                type="number"
                max="10"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                value={formData.totalFloors}
                onChange={(e) =>
                  setFormData({ ...formData, totalFloors: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Rooms Per Floor
              </label>
              <input
                type="number"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                value={formData.roomsPerFloor}
                onChange={(e) =>
                  setFormData({ ...formData, roomsPerFloor: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                Beds Per Room
              </label>
              <input
                type="number"
                max="4"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                value={formData.bedsPerRoom}
                onChange={(e) =>
                  setFormData({ ...formData, bedsPerRoom: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition shadow-md"
            >
              Execute Matrix Generation Loop
            </button>
          </div>
        </form>
      </div>
    );
  }

  const roomsByFloor: { [key: number]: any[] } = {};
  if (property && Array.isArray(property.rooms)) {
    property.rooms.forEach((room) => {
      if (!roomsByFloor[room.floorNumber]) roomsByFloor[room.floorNumber] = [];
      roomsByFloor[room.floorNumber].push(room);
    });
  }

  const sortedFloors = Object.keys(roomsByFloor)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="space-y-6 relative">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg shadow-sm">
          {error}
        </div>
      )}

      {/* Property Meta Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl mt-1">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {property.name}
            </h2>
            <p className="text-sm text-slate-500 flex items-center mt-1">
              <MapPin size={14} className="mr-1 text-slate-400" />
              {property.address}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-slate-900 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition shadow-sm flex items-center space-x-2 cursor-pointer"
        >
          <PlusCircle size={16} />
          <span>Add Another Asset</span>
        </button>
      </div>

      {/* Render Floor Bands */}
      <div className="space-y-8">
        {sortedFloors.map((floor) => (
          <div key={floor} className="space-y-3">
            <div className="border-b border-slate-200 pb-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {floor === 0 ? "Ground Floor" : `Floor ${floor}`}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(roomsByFloor[floor] || [])
                .sort((a, b) =>
                  String(a.roomNumber).localeCompare(String(b.roomNumber)),
                )
                .map((room) => {
                  // Fallback scaffold to ensure there is always a clickable target if beds array is unpopulated
                  const visualBeds =
                    room.beds && room.beds.length > 0
                      ? room.beds
                      : [
                          {
                            id: room.id * 100,
                            bedNumber: "Bed-1",
                            isOccupied: false,
                          },
                        ];

                  return (
                    <div
                      key={room.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3 transition hover:border-slate-300"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-800">
                          Room {room.roomNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                          ₹
                          {Number(
                            room.baseRent ||
                              property.rooms[0]?.baseRent ||
                              8500,
                          ).toLocaleString()}
                          /mo
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {visualBeds.map((bed: any) => (
                          <div
                            key={bed.id}
                            onClick={() =>
                              setSelectedBed({
                                propertyId: property.id,
                                propertyName: property.name,
                                roomId: room.id,
                                roomNumber: room.roomNumber,
                                bedId: bed.id,
                                bedNumber: bed.bedNumber,
                                isOccupied: bed.isOccupied,
                              })
                            }
                            className={`p-2.5 rounded-lg border flex flex-col justify-between h-16 transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-[0.97] hover:shadow-xs ${
                              bed.isOccupied
                                ? "bg-red-50/80 border-red-200 text-red-800 hover:bg-red-100/90"
                                : "bg-green-50/80 border-green-200 text-green-800 hover:bg-green-100/90"
                            }`}
                          >
                            <span className="text-xs font-bold tracking-tight">
                              {bed.bedNumber}
                            </span>
                            <div className="flex items-center space-x-1.5">
                              {bed.isOccupied ? (
                                <>
                                  <XCircle size={12} className="text-red-500" />
                                  <span className="text-[10px] font-semibold text-red-600">
                                    Occupied
                                  </span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle
                                    size={12}
                                    className="text-green-500"
                                  />
                                  <span className="text-[10px] font-semibold text-green-600">
                                    Available
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* INTERACTIVE OVERLAY SIDE-DRAWER */}
      {selectedBed && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-end z-50 transition-opacity duration-300"
          onClick={() => setSelectedBed(null)} // Closes panel gracefully when clicking the external backdrop
        >
          <div
            className="bg-white h-screen w-full max-w-md shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200 relative transition-transform duration-300 translate-x-0"
            onClick={(e) => e.stopPropagation()} // Prevents accidental closing when clicking inside the panel
          >
            {/* Modal Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Room {selectedBed.roomNumber} &bull; {selectedBed.bedNumber}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedBed.propertyName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBed(null)}
                  className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Dynamic Internal Content Frame Context */}
              <div className="mt-6">
                {!selectedBed.isOccupied ? (
                  /* FLOW A: CHECK-IN REGISTRATION FORM VIEW */
                  <form onSubmit={handleCheckInSubmit} className="space-y-4">
                    <div className="p-3 bg-green-50/60 text-green-800 rounded-xl flex items-center space-x-3 text-xs border border-green-100 font-medium mb-2">
                      <UserPlus size={16} className="text-green-600" />
                      <span>
                        This space assignment is available. Add resident
                        particulars to initialize contract.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Tenant Name
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="text"
                          required
                          value={tenantForm.name}
                          onChange={(e) =>
                            setTenantForm({
                              ...tenantForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                          placeholder="Dishant Singh"
                        />
                      </div>
                    </div>

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
                          value={tenantForm.email}
                          onChange={(e) =>
                            setTenantForm({
                              ...tenantForm,
                              email: e.target.value,
                            })
                          }
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                          placeholder="tenant@gmail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="tel"
                          required
                          value={tenantForm.phoneNumber}
                          onChange={(e) =>
                            setTenantForm({
                              ...tenantForm,
                              phoneNumber: e.target.value,
                            })
                          }
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Initial Sub-Meter Reading (kWh)
                      </label>
                      <div className="relative">
                        <Zap
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                          size={16}
                        />
                        <input
                          type="number"
                          required
                          value={tenantForm.initialMeterReading}
                          onChange={(e) =>
                            setTenantForm({
                              ...tenantForm,
                              initialMeterReading: e.target.value,
                            })
                          }
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition mt-4 cursor-pointer disabled:bg-blue-400"
                    >
                      {submitting
                        ? "Processing Check-In..."
                        : "Deploy Active Lease"}
                    </button>
                  </form>
                ) : (
                  /* FLOW B: RESIDENT PROFILE OVERVIEW & CHECK-OUT ACTION */
                  <div className="space-y-6">
                    <div className="p-3 bg-red-50/60 text-red-800 rounded-xl flex items-center space-x-3 text-xs border border-red-100 font-medium">
                      <XCircle size={16} className="text-red-500" />
                      <span>
                        This space assignment index is active. Running lease
                        monitoring protocol logs.
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                      <div className="flex justify-between text-xs border-b border-slate-200/60 pb-2">
                        <span className="text-slate-400 font-medium">
                          Occupancy Status
                        </span>
                        <span className="font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          Leased Contract
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        To view fully detailed statement breaks, utility delta
                        trackers, or ledger logs for this active profile
                        cluster, navigate directly to your primary{" "}
                        <strong>Invoices</strong> sidebar panel context.
                      </p>
                    </div>

                    <button
                      onClick={handleCheckOut}
                      disabled={submitting}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg text-sm transition flex items-center justify-center space-x-2 cursor-pointer disabled:bg-red-400"
                    >
                      <UserMinus size={16} />
                      <span>
                        {submitting
                          ? "Processing Check-Out..."
                          : "Execute Tenant Check-Out"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-4">
              Apex Matrix Engine Session Lock &bull; June 2026
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
