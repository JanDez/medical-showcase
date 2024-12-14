import { Button } from "@/app/components/ui/button"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/app/components/ui/sheet"
import { Clock, Search, X } from "lucide-react"
import { useSearchStore } from "@/app/features/stores/searchStore"

interface SearchHistorySidebarProps {
  onSelectSearch: (term: string) => void
}

export function SearchHistorySidebar({ onSelectSearch }: SearchHistorySidebarProps) {
  const { recentSearches, clearRecentSearches, removeRecentSearch } = useSearchStore()

  const handleSearchClick = (term: string) => {
    onSelectSearch(term)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0">
          <Clock className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold">Recent Searches</SheetTitle>
            {recentSearches.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearRecentSearches}
              >
                Clear All
              </Button>
            )}
          </div>
          <p className="text-muted-foreground text-sm">Your previous search history</p>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          {recentSearches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <Search className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm">No recent searches</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentSearches.map((term) => (
                <SheetClose asChild key={term}>
                  <div
                    className="group flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => handleSearchClick(term)}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{term}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRecentSearch(term)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </SheetClose>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
} 