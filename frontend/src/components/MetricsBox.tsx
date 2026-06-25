import type { ReactNode } from "react";

interface MetricsBoxProps {
  title: string;
  label?: string;
  value: number;
  difference?: number;
  calculateValue?: number;
  majorIcon: ReactNode;
  minorIcon: ReactNode;
  isActie?: boolean;
  description?: string;
}

const MetricsBox = ({
  title,
  value,
  majorIcon,
  minorIcon,
  difference,
}: MetricsBoxProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex justify-between items-start shadow-xs">
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <span className="text-3xl font-black tracking-tight block text-slate-900">
          {value}%
        </span>
        <div className="text-xs text-emerald-600 font-semibold flex items-center">
          <span className="mr-1.5">{minorIcon}</span>+{difference} variance
        </div>
      </div>
      <div className="p-3 bg-blue-50 border border-blue-100 text-blue-600 rounded-xl">
        <span className="size-20">{majorIcon}</span>
      </div>
    </div>
  );
};

export default MetricsBox;
