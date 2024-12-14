import { useQuery } from '@tanstack/react-query'
import type { Asset, SearchParams, PaginatedResponse } from '../types/types'

async function searchAssets(params: SearchParams) {
  const searchParams: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(',') : String(value ?? '')
      ])
    )
  }
  
  const response = await fetch(`/api/search?${new URLSearchParams(searchParams).toString()}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json() as Promise<PaginatedResponse<Asset>>;
}

export function useAssetsSearch(params: SearchParams, options = {}) {
  return useQuery<PaginatedResponse<Asset>>({
    queryKey: ['search', params],
    queryFn: () => searchAssets(params),
    ...options
  })
}