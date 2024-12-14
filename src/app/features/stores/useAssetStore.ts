import { create } from 'zustand'
import type { Asset } from '../types/types'

interface AssetStore {
  assets: Asset[]
  updateAsset: (id: number, updates: Partial<Asset>) => void
  setAssets: (assets: Asset[]) => void
}

export const useAssetStore = create<AssetStore>((set) => ({
  assets: [],
  updateAsset: (id, updates) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === id ? { ...asset, ...updates } : asset
      ),
    })),
  setAssets: (assets) => set({ assets }),
})) 