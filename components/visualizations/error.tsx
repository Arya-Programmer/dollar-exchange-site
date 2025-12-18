import { useTheme } from "@/lib/theme-context";
import { AlertCircle } from "lucide-react";

type Props = {
  refetch?: any,
  error: string,
}

function Error({ refetch, error }: Props) {
  const { colors } = useTheme();
  if (!colors) return;

  return (
    <div
      className="flex h-[400px] w-full items-center justify-center rounded-3xl border border-dashed p-8 transition-all duration-300"
      style={{ borderColor: colors.border, backgroundColor: colors.card }}
    >
      <div className="flex flex-col items-center gap-4 text-center max-w-xs">
        <div className="p-3 rounded-full bg-red-100/10">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <p className="font-semibold mb-1" style={{ color: colors.text }}>Unable to load data</p>
          <p className="text-sm" style={{ color: colors.textMuted }}>{error}</p>
        </div>
        <button
          onClick={refetch}
          className="px-6 py-2 rounded-xl text-sm font-medium transition-transform hover:scale-105"
          style={{ backgroundColor: colors.primary, color: "white" }}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export default Error;
