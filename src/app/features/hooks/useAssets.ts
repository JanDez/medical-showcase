import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { Asset, SearchParams, PaginatedResponse } from '../types/types'
import { useAssetStore } from "@/app/features/stores/useAssetStore"
import { useEffect } from 'react'

async function fetchAssets(params: SearchParams) {
  const searchParams: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(',') : String(value || '')
      ])
    )
  }
  
  const queryString = new URLSearchParams(searchParams).toString()
  
  const response = await fetch(`/api/assets?${queryString}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json() as Promise<PaginatedResponse<Asset>>
}

export function useAssets(params: SearchParams = {}) {
  const setAssets = useAssetStore((state) => state.setAssets)
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['assets', params],
    queryFn: () => fetchAssets(params),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5
  })

  useEffect(() => {
    if (query.data?.data) {
      setAssets(query.data.data)
    }
  }, [query.data?.data, setAssets])

  const updateAssetInCache = (id: number, updates: Partial<Asset>) => {
    ['assets', 'trending', 'recent', 'search'].forEach(queryKey => {
      queryClient.setQueriesData({ queryKey: [queryKey] }, (oldData: any) => {
        if (!oldData?.data) return oldData
        return {
          ...oldData,
          data: oldData.data.map((asset: Asset) =>
            asset.id === id ? { ...asset, ...updates } : asset
          )
        }
      })
    })
  }

  return { ...query, updateAssetInCache }
}

export function useTrendingAssets(limit = 4) {
  const setAssets = useAssetStore((state) => state.setAssets)
  const query = useQuery({
    queryKey: ['assets', 'trending', limit],
    queryFn: async () => {
      const response = await fetch(`/api/trending?limit=${limit}`)
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json() as Promise<PaginatedResponse<Asset>>
    },
  })

  useEffect(() => {
    if (query.data?.data) {
      setAssets(query.data.data)
    }
  }, [query.data?.data, setAssets])

  return query
}

export function useRecentAssets(limit = 4) {
  return useQuery({
    queryKey: ['assets', 'recent', limit],
    queryFn: async () => {
      const response = await fetch(`/api/recent?limit=${limit}`)
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json() as Promise<PaginatedResponse<Asset>>
    },
  })
} 