import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthPage } from "./pages/AuthPage";
import { PropertyGrid } from "./pages/PropertyGrid";
import { PublicApply } from "./pages/PublicApply";
import { Building2, LayoutDashboard, LogOut } from "lucide-react";

// 🔐 Private Route Guard Component wrapper
const ProtectedLayout: React.FC<{
  children: React.ReactNode;
  onLogout: () => void;
}> = ({ children, onLogout }) => {
  const token = localStorage.getItem("tms_token");

  // If no active session token is present, bounce unauthorized users back to the auth gateway
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation Panel */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Building2 className="text-blue-500" size={28} />
            <span className="text-xl font-bold tracking-tight">Apex PMS</span>
          </div>
          <nav className="space-y-2 pt-4">
            <Link
              to="/dashboard"
              className="flex items-center space-x-3 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition"
            >
              <LayoutDashboard size={20} />
              <span>Property Grid</span>
            </Link>
          </nav>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center space-x-3 text-red-400 hover:bg-slate-800 hover:text-red-300 px-4 py-2.5 rounded-lg font-medium transition cursor-pointer w-full text-left"
        >
          <LogOut size={20} />
          <span>Exit Workspace</span>
        </button>
      </aside>

      {/* Main Display Window Frame Container */}
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome Back, Landlord
            </h1>
            <p className="text-slate-500 text-sm">
              Real-time space inventory architecture and occupancy monitoring
              vector matrix.
            </p>
          </div>
          <div className="h-10 w-10 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center shadow-md">
            <span>A</span>
          </div>
        </header>

        {/* Dynamic Nested Child Target View Port */}
        {children}
      </main>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("tms_token"),
  );

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("tms_token");
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== PUBLIC UNPROTECTED ROUTES ==================== */}
        {/* ✅ The Parameter String mapping is now managed natively by the framework router */}
        <Route path="/apply/:propertyId" element={<PublicApply />} />

        {/* Authentication Gateway Entrance */}
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <AuthPage onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* ==================== PROTECTED LANDLORD ROUTES ==================== */}
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout onLogout={handleLogout}>
              <PropertyGrid />
            </ProtectedLayout>
          }
        />

        {/* ==================== FALLBACK WILDCARD ROUTING ==================== */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
