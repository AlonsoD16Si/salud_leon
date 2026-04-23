"use client";

import { useEffect, useState } from "react";

type StatCounterProps = {
  value: number;
  label: string;
};

export function StatCounter({ value, label }: StatCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.ceil(value / 45));
    const id = window.setInterval(() => {
      current += step;
      if (current >= value) {
        setDisplayValue(value);
        window.clearInterval(id);
        return;
      }
      setDisplayValue(current);
    }, 30);

    return () => window.clearInterval(id);
  }, [value]);

  return (
    <div className="glass-card rounded-2xl p-4">
      <p className="text-2xl font-semibold text-slate-900 sm:text-3xl">
        {displayValue.toLocaleString("es-MX")}
      </p>
      <p className="text-sm text-slate-600">{label}</p>
    </div>
  );
}
