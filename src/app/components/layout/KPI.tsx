import { AssetCard } from "@/app/components/assets/AssetCard"
import { useKPIs } from "@/app/features/hooks/useKPIs"

export function KPI() {
  const { data: assets, isLoading, error } = useKPIs()

  if (isLoading) return <div>Loading...</div>
  if (error instanceof Error) return <div>{error.message}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">KPI Assets</h2>
      <p className="text-muted-foreground mb-6">Key Performance Indicators and Metrics</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {assets?.data?.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  )
} 