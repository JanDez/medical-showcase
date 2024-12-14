import { AssetCard } from "@/app/components/assets/AssetCard"
import { useLayouts } from "@/app/features/hooks/useLayouts"

export function Layouts() {
  const { data: assets, isLoading, error } = useLayouts()

  if (isLoading) return <div>Loading...</div>
  if (error instanceof Error) return <div>{error.message}</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Layout Templates</h2>
      <p className="text-muted-foreground mb-6">Pre-designed layouts for your reports</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {assets?.data?.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  )
} 