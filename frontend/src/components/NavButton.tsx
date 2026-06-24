import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

// 1. Define a strict TypeScript interface for the component props
interface NavButtonProps {
  path: string;
  icon: LucideIcon; // Expects the Lucide icon component itself (e.g., Home, Settings)
  isCollapsed: boolean;
  title: string;
}

// 2. Destructure props correctly within a single object argument
const NavButton = ({
  path,
  icon: Icon, // Capitalize to render it as a React component
  isCollapsed,
  title,
}: NavButtonProps) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `btn-wide h-11.5 bg-white flex items-center gap-3 p-2 rounded-md transition-all hover:bg-blue-600 hover:text-white ${
          isActive ? "bg-blue-600! text-white" : "text-gray-700"
        }`
      }
    >
      {/* Icon Wrapper */}
      <span className="transition-transform duration-200 scale-100">
        <Icon size={20} />
      </span>

      {/* Conditionally render text based on sidebar collapse state */}
      {!isCollapsed && (
        <span className="font-bold animate-in fade-in slide-in-from-left-2 duration-200 whitespace-nowrap">
          {title}
        </span>
      )}
    </NavLink>
  );
};

export default NavButton;
