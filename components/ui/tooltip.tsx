"use client"

import { memo } from "react"

type TooltipProps = {
  active?: boolean
  payload?: any[]
  label?: string
  colors: any
}

const CustomTooltip = memo(function CustomTooltip({ active, payload, label, colors }: TooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="rounded-2xl shadow-xl border backdrop-blur-md p-0 overflow-hidden min-w-45 animate-in fade-in zoom-in-95 duration-200"
      style={{
        backgroundColor: `${colors.card}E6`,
        borderColor: colors.border,
        boxShadow: colors.shadowHover,
      }}
    >
      <div
        className="px-4 py-3 border-b"
        style={{
          borderColor: `${colors.border}80`,
          backgroundColor: `${colors.backgroundElevated}80`
        }}
      >
        <p className="font-bold text-sm" style={{ color: colors.text }}>
          {label}
        </p>
      </div>

      <div className="px-4 py-3 space-y-2">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shadow-sm ring-1 ring-white/10"
                style={{ backgroundColor: entry.color || colors.primary }}
              />
              <span className="text-sm font-medium" style={{ color: colors.textMuted }}>
                {entry.name}
              </span>
            </div>

            <span className="text-sm font-bold font-mono" style={{ color: colors.text }}>
              {entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default CustomTooltip;
export { CustomTooltip };
