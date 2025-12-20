import * as React from "react";

function CustomTooltip({
  active,
  payload,
  label,
  colors,
}: {
  active?: boolean
  payload?: any[]
  label?: string
  colors: any
}) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="px-4 py-3 rounded-xl shadow-lg"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        boxShadow: `0 10px 40px -10px ${colors.primary}30`,
      }}
    >
      <p className="font-semibold mb-1" style={{ color: colors.text }}>
        {label}
      </p>
      {payload.map((entry: any, index: number) => (
        <p key={index} style={{ color: entry.color || colors.primary }}>
          {entry.name}: <span className="font-bold">{entry.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

export { CustomTooltip }
