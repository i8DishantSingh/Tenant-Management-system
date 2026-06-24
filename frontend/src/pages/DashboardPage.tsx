import { useState } from "react";
import { Navigate, Outlet, NavLink } from "react-router-dom";
import NavButton from "../components/NavButton";

import {
  Building2,
  // LayoutDashboard,
  Users,
  DollarSign,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  // Download,
  // TrendingUp,
  // Calendar,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
} from "lucide-react";

const ScrapePage: React.FC<{
  onLogout: () => void;
}> = ({ onLogout }) => {
  const token = localStorage.getItem("tms_token");

  // const [activeTab, setActiveTab] = useState<string>("Analytics");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* ========================================== */}
      {/*             COLLAPSIBLE SIDEBAR             */}
      {/* ========================================== */}
      <aside
        className={`bg-white  flex flex-col justify-between  lg:flex shrink-0 fixed h-full z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20 px-3 py-6" : "w-64 p-6"
        }`}
      >
        <div className="space-y-8">
          {/* Header row */}
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} relative h-10`}
          >
            {!isCollapsed && (
              <div className="flex items-center space-x-3 animate-in fade-in duration-200">
                <Building2 className="text-blue-500" size={24} />
                <span className="text-xl text-black font-bold tracking-tight">
                  Apex PMS
                </span>
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 bg-blue-600 hover:bg-slate-750 border border-slate-700/40 rounded-xl text-white hover:text-slate-200 transition cursor-pointer ${
                isCollapsed ? "" : "absolute right-0"
              }`}
            >
              {isCollapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          </div>

          <hr className="border-slate-800" />

          {/* Nav Items */}
          <nav className="flex flex-col gap-3">
            <NavButton
              path="/dashboard/analytics"
              title="Analytics"
              icon={BarChart3}
              isCollapsed={isCollapsed}
            ></NavButton>
            <NavButton
              path="/dashboard/properties"
              title="Properties"
              icon={Building2}
              isCollapsed={isCollapsed}
            ></NavButton>
            <NavButton
              path="/dashboard/tenants"
              title="Tenants"
              icon={Users}
              isCollapsed={isCollapsed}
            ></NavButton>
            <NavButton
              path="/dashboard/financials"
              title="Financials"
              icon={DollarSign}
              isCollapsed={isCollapsed}
            ></NavButton>
            <NavButton
              path="/dashboard/maintenance"
              title="Maintenance"
              icon={Wrench}
              isCollapsed={isCollapsed}
            ></NavButton>
            <NavButton
              path="/dashboard/settings"
              title="Settings"
              icon={Settings}
              isCollapsed={isCollapsed}
            ></NavButton>
          </nav>
        </div>

        {/* Exit Action Button */}
        <button
          title={isCollapsed ? "Sign Out" : undefined}
          onClick={onLogout}
          className={`flex items-center text-red-400 hover:bg-blue-600 hover:text-white font-medium text-sm transition rounded-xl cursor-pointer select-none ${
            isCollapsed
              ? "justify-center h-12 w-12 mx-auto"
              : "w-full px-4 py-2.5 space-x-3"
          }`}
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <span className="animate-in fade-in duration-200">
              Exit Workspace
            </span>
          )}
        </button>
      </aside>
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* TOP WORKSPACE CONTROLLER HEADER BAR */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 lg:hidden cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="lg:hidden flex items-center space-x-2">
              <span className="text-md font-bold tracking-tight text-slate-900">
                Apex PMS
              </span>
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
              Real-time Portfolio Stream
            </span>
          </div>

          {/* HOVER ACCORDION TRIGGER */}
          <div className="relative group py-2">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="text-right hidden sm:block">
                <span className="block text-sm font-bold text-slate-900">
                  Welcome Back, Landlord
                </span>
                <span className="block text-xs font-medium text-slate-500 mt-0.5">
                  Dishant Singh
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
                <span>A</span>
              </div>
            </div>

            {/* ANIMATED HOVER DOCK VIEW CARD */}
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-5 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-out z-50 pointer-events-none group-hover:pointer-events-auto">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
                  <div className="h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-inner">
                    <span>A</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Dishant Singh
                    </h4>
                    <span className="text-xs font-medium text-slate-400 block mt-0.5">
                      Landlord Workspace
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-medium text-slate-600">
                  <div className="flex items-center px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <Shield size={12} className="mr-2 text-blue-500" /> Admin
                    Access Mode Enabled
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <NavLink
                    to="/dashboard/settings"
                    className="w-full text-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl py-2 text-xs font-bold text-slate-700 transition cursor-pointer"
                  >
                    Settings
                  </NavLink>
                  <button
                    className="w-full bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl py-2 text-xs font-bold text-red-600 transition cursor-pointer"
                    onClick={onLogout}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] w-full mx-auto flex-1">
          {/* Header Metadata Block */}
          <Outlet></Outlet>
        </main>
      </div>
      {/* ========================================== */}
      {/* MOBILE DRAWER OVERLAY                      */}
      {/* ========================================== */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-xs z-50 lg:hidden flex justify-start">
          <div className="w-72 bg-white h-full p-6 flex flex-col justify-between text-white shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 size={20} className="text-blue-500" />
                  <span className="text-lg text-black font-bold tracking-tight">
                    Apex PMS
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 bg-slate-800 rounded-lg border border-slate-700 text-slate-400 cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <nav className="space-y-2">
                <NavButton
                  path="/dashboard/analytics"
                  title="Analytics"
                  icon={BarChart3}
                  isCollapsed={isCollapsed}
                ></NavButton>
                <NavButton
                  path="/dashboard/properties"
                  title="Properties"
                  icon={Building2}
                  isCollapsed={isCollapsed}
                ></NavButton>
                <NavButton
                  path="/dashboard/tenants"
                  title="Tenants"
                  icon={Users}
                  isCollapsed={isCollapsed}
                ></NavButton>
                <NavButton
                  path="/dashboard/financials"
                  title="Financials"
                  icon={DollarSign}
                  isCollapsed={isCollapsed}
                ></NavButton>
                <NavButton
                  path="/dashboard/maintenance"
                  title="Maintenance"
                  icon={Wrench}
                  isCollapsed={isCollapsed}
                ></NavButton>
                <NavButton
                  path="/dashboard/settings"
                  title="Settings"
                  icon={Settings}
                  isCollapsed={isCollapsed}
                ></NavButton>
              </nav>
            </div>

            <button className="flex items-center space-x-3 text-red-400 hover:text-red-300 font-bold text-xs tracking-wide uppercase transition w-full px-4 py-3 rounded-xl cursor-pointer select-none">
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrapePage;
