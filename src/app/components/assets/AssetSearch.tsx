import { useState } from 'react'
import { useDebounce } from '@/app/features/hooks/useDebounce'
import { useAssetsSearch } from '@/app/features/hooks/useAssetsSearch'
import { useSearchStore } from '@/app/features/stores/searchStore'
import { Input } from '@/app/components/ui/input'
import { AssetCard } from './AssetCard'
import { SearchHistorySidebar } from './SearchHistorySidebar'
import { baseSearchParamsSchema } from '@/app/lib/schemas'

// Define the type for search parameters
interface SearchParams {
  query: string;
  page: number;
  pageSize: number;
  categories: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function AssetSearch() {
  const [searchParams, setSearchParams] = useState<SearchParams>({ 
    query: '', 
    page: 1, 
    pageSize: 10,
    categories: [],
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [showRecent, setShowRecent] = useState(false)
  const debouncedParams = useDebounce(searchParams, 300)
  const { data: searchResults, isLoading } = useAssetsSearch(debouncedParams, {
    enabled: debouncedParams.query.length > 0,
    keepPreviousData: false,
    refetchOnWindowFocus: false
  })

  const { recentSearches, addRecentSearch, clearRecentSearches } = useSearchStore()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchParams(prev => ({ ...prev, query: value }))
    setShowRecent(value.length === 0)
  }

  const handleRecentSearch = (term: string) => {
    setSearchParams(prev => ({ ...prev, query: term }))
    setShowRecent(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (searchParams.query) {
        addRecentSearch(searchParams.query)
      }
    }
  }

  const validatedParams = baseSearchParamsSchema.safeParse({
    page: searchParams.page,
    pageSize: searchParams.pageSize,
    query: searchParams.query,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder,
    categories: searchParams.categories.join(','),
  });

  return (
    <div className="mb-8">
      <div className="space-y-2 relative">
        <p className="text-sm text-muted-foreground">
          Search across KPIs, layouts, and storyboard templates. Press Enter to search.
        </p>
        <div className="flex gap-2">
          <form onSubmit={(e) => e.preventDefault()} className="flex-1">
            <Input 
              type="search" 
              placeholder="Search by name or description (Press Enter to search)" 
              className="max-w-3xl"
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              value={searchParams.query}
              autoComplete="off"
            />
          </form>
          <SearchHistorySidebar onSelectSearch={handleRecentSearch} />
        </div>
      </div>
      
      {isLoading && <p className="mt-2 text-sm text-muted-foreground">Searching...</p>}
      
      {!isLoading && searchParams.query && (!searchResults?.data || searchResults.data.length === 0) && (
        <p className="mt-2 text-sm text-muted-foreground">No results found</p>
      )}
      
      {searchResults?.data && searchResults.data.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {searchResults.data.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      )}
    </div>
  )
} 