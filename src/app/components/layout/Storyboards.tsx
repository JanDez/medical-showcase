import { AssetCard } from "@/app/components/assets/AssetCard"
import { useStoryboards } from "@/app/features/hooks/useStoryboards"

export function Storyboards() {
  const { data: assets, isLoading, error } = useStoryboards()

  if (isLoading) return <div>Loading...</div>
  if (error instanceof Error) return <div>{error.message}</div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Storyboards</h2>
      <p className="text-muted-foreground mb-6">Narrative templates for presentations</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {assets?.data?.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  )
} 