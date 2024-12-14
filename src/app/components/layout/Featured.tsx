import { AssetCard } from "@/app/components/assets/AssetCard"
import { useAssets } from "../../features/hooks/useAssets"

export function Featured() {
  const { data: assets, isLoading, error } = useAssets({
    sortBy: 'createdAt',
    sortOrder: 'desc',
    pageSize: 4
  })

  if (isLoading) return <div>Loading...</div>
  if (error instanceof Error) return <div>{error.message}</div>

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold mb-2">Featured</h2>
      <p className="text-muted-foreground mb-6">Curated top picks from this week</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {assets?.data?.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  )
}
