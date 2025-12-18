export default function calculateDomain(data: any[], dataKey: string): [number, number] {
  const values = data.map((d) => d[dataKey]).filter((v) => typeof v === "number")
  if (values.length === 0) return [0, 100]

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min

  // Add padding of 2x the range on each side for better visualization
  const padding = range * 0.25
  const domainMin = Math.floor((min - padding) / 5) * 5
  const domainMax = Math.ceil((max + padding) / 5) * 5

  return [Math.max(0, domainMin), domainMax]
}
