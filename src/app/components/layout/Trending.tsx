import { AssetCard } from "@/app/components/assets/AssetCard"
import { useTrendingAssets } from "../../features/hooks/useAssets"

export function Trending() {
  const { data: assets, isLoading, error } = useTrendingAssets()

  if (isLoading) return <div>Loading...</div>
  if (error instanceof Error) return <div>{error.message}</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Trending</h2>
      <p className="text-muted-foreground mb-6">Most popular by community</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {assets?.data?.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  )
}
