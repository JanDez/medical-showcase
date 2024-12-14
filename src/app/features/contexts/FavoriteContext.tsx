import { createContext, useContext, useCallback, useEffect } from 'react'
import { useAssetStore } from '../stores/useAssetStore'
import { useAssets } from '../hooks/useAssets'
import { useToast } from '../hooks/useToast'
import { useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoriteStore {
  favorites: Record<number, boolean>
  setFavorite: (assetId: number, isFavorite: boolean) => void
}

const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set) => ({
      favorites: {},
      setFavorite: (assetId, isFavorite) =>
        set((state) => ({
          favorites: { ...state.favorites, [assetId]: isFavorite }
        }))
    }),
    {
      name: 'favorite-storage'
    }
  )
)

const FavoriteContext = createContext<{
  toggleFavorite: (assetId: number, currentState: boolean) => Promise<void>
  isFavorite: (id: number) => boolean
} | null>(null)

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const { updateAsset, setAssets } = useAssetStore()
  const { updateAssetInCache } = useAssets()
  const queryClient = useQueryClient()
  const { favorites, setFavorite } = useFavoriteStore()

  useEffect(() => {
    const queryKeys = ['assets', 'trending', 'kpis', 'layouts', 'storyboards']
    const allAssets: any[] = []
    
    queryKeys.forEach(key => {
      const queryData = queryClient.getQueriesData<any>({ queryKey: [key] })
      queryData.forEach(([_, data]) => {
        if (data?.data) {
          const assetsWithFavorites = data.data.map((asset: any) => ({
            ...asset,
            isFavorite: favorites[asset.id] ?? false
          }))
          allAssets.push(...assetsWithFavorites)
        }
      })
    })
    
    if (allAssets.length) {
      setAssets(allAssets)
    }
  }, [queryClient, setAssets, favorites])

  const toggleFavorite = async (assetId: number, currentState: boolean) => {
    const newState = !currentState
    
    setFavorite(assetId, newState)
    updateAsset(assetId, { isFavorite: newState })
    updateAssetInCache(assetId, { isFavorite: newState })
    
    try {
      const response = await fetch(`/api/assets/${assetId}/favorite`, {
        method: newState ? 'PUT' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: newState ? JSON.stringify({ isFavorite: true }) : undefined,
        cache: 'no-store'
      })

      if (!response.ok) throw new Error('Failed to update favorite status')
      
      toast({
        title: newState ? "Added to favorites" : "Removed from favorites",
        description: newState 
          ? "The item has been added to your favorites"
          : "The item has been removed from your favorites",
      })
    } catch (error) {
      setFavorite(assetId, currentState)
      updateAsset(assetId, { isFavorite: currentState })
      updateAssetInCache(assetId, { isFavorite: currentState })
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update favorite status",
      })
    }
  }

  return (
    <FavoriteContext.Provider value={{ toggleFavorite, isFavorite: (id) => favorites[id] ?? false }}>
      {children}
    </FavoriteContext.Provider>
  )
}

export function useFavoriteContext() {
  const context = useContext(FavoriteContext)
  if (!context) {
    throw new Error('useFavoriteContext must be used within a FavoriteProvider')
  }
  return context
} 