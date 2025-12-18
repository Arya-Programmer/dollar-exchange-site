import { useTheme } from "@/lib/theme-context";

import { CITIES } from "@/lib/constants";


type Props = {
  activeCity?: string,
}

function NoData({ activeCity }: Props) {
  const { colors } = useTheme();
  let errorText = "Could not retrieve exchange rates for any cities at this time.";

  if (!colors) return;
  if (activeCity) errorText = `There is currently no trend data available for ${CITIES.find(c => c.value === activeCity)?.english}.`

  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-3xl border border-dashed p-8 transition-all duration-300"
      style={{ borderColor: colors.border, backgroundColor: colors.card }}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-semibold" style={{ color: colors.text }}>No Data Available</p>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          {errorText}
        </p>
      </div>
    </div>
  );
}

export default NoData;
