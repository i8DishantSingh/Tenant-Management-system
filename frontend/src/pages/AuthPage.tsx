import React, { useState } from "react";
import { Building2, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { api } from "../services/api";

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post<{ token: string; user: any }>(
          "/auth/login",
          {
            email: formData.email,
            password: formData.password,
          },
        );
        localStorage.setItem("tms_token", response.token);
        alert("Authentication verified successfully!");
      } else {
        await api.post("/auth/signup", formData);
        alert("Account registered! Switching to login...");
        setIsLogin(true);
      }
      window.location.reload(); // Refresh to broadcast auth state changes
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setFormData({ name: "", email: "", password: "", phoneNumber: "" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Visual Brand Panel Column */}
        <div className="bg-slate-900 text-white p-12 flex flex-col justify-between hidden md:flex">
          <div className="flex items-center space-x-2">
            <Building2 className="text-blue-500" size={32} />
            <span className="text-2xl font-bold tracking-tight">Apex PMS</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold leading-tight">
              Automate your housing operations in seconds.
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate floor plan matrices, execute monthly utility split
              calculations, and capture digital payment histories cleanly in one
              workspace.
            </p>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 Apex Property Software Engine Inc.
          </p>
        </div>

        {/* Form Input Interface Panel */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900">
              {isLogin ? "Sign In to Dashboard" : "Register Landlord Account"}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {isLogin
                ? "Enter your credentials to enter your management dashboard."
                : "Initialize your master profile credentials below."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="landlord@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-sm transition flex items-center justify-center space-x-2 shadow-md cursor-pointer disabled:bg-blue-400"
            >
              <span>
                {loading
                  ? "Processing Operations..."
                  : isLogin
                    ? "Authenticate Session"
                    : "Create Master Account"}
              </span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm text-blue-600 font-medium hover:underline cursor-pointer"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
