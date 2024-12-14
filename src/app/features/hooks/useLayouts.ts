import { useQuery } from "@tanstack/react-query"
import { useAssetStore } from "../stores/useAssetStore"
import { useEffect } from "react"
import type { PaginatedResponse, Asset } from "../types/types"

export function useLayouts() {
  const setAssets = useAssetStore((state) => state.setAssets)
  const query = useQuery({
    queryKey: ['layouts'],
    queryFn: async () => {
      const response = await fetch('/api/layouts')
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