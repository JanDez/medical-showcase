import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchStore {
  recentSearches: string[]
  addRecentSearch: (term: string) => void
  removeRecentSearch: (term: string) => void
  clearRecentSearches: () => void
  maxRecentSearches: number
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      recentSearches: [],
      maxRecentSearches: 5,
      
      addRecentSearch: async (term: string) => {
        set((state) => {
          const filtered = state.recentSearches.filter(s => s !== term)
          const newSearches = [term, ...filtered].slice(0, state.maxRecentSearches)
          return { recentSearches: newSearches }
        })

        // POST the new search term to the database
        try {
          await fetch('/api/recent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm: term }),
          })
        } catch (error) {
          console.error('Failed to save recent search:', error)
        }
      },
      
      removeRecentSearch: (term: string) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter(s => s !== term)
        })),
        
      clearRecentSearches: () => 
        set({ recentSearches: [] }),
    }),
    {
      name: 'search-storage',
    }
  )
) 