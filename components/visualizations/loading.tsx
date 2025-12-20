import { Loader2 } from "lucide-react";

import { useTheme } from "@/lib/theme-context";

import { CITIES } from "@/lib/constants";


type Props = {
  activeCity?: string,
}

function Loading({ activeCity }: Props) {
  const { colors } = useTheme();
  if (!colors) return;

  return (
    <div
      className="flex h-[400px] w-full items-center justify-center rounded-3xl border border-dashed transition-all duration-300"
      style={{ borderColor: colors.border, backgroundColor: colors.card }}
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.primary }} />
        <span className="text-sm font-medium" style={{ color: colors.textMuted }}>
          Loading {CITIES.find(c => c.value === activeCity)?.english} trends...
        </span>
      </div>
    </div>
  )
}

export default Loading;
