import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Featured } from "@/app/components/layout/Featured"
import { Trending } from "@/app/components/layout/Trending"
import { AssetSearch } from "@/app/components/assets/AssetSearch"
import { KPI } from "@/app/components/layout/KPI"
import { Layouts } from "@/app/components/layout/Layouts"
import { Storyboards } from "@/app/components/layout/Storyboards"
import { RequestButton } from "@/app/components/ui/RequestButton"
import { RequestList } from "@/app/components/requests/RequestList"
import { FavoriteProvider } from "@/app/features/contexts/FavoriteContext"

export default function Library() {
  return (
    <FavoriteProvider>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold">Library</h1>
          <RequestButton />
        </div>

        <p className="text-base text-muted-foreground mb-8">
          Browse for assets needed to report and present analysis.
        </p>

        <AssetSearch />

        <Tabs defaultValue="featured" className="mb-12 w-[95%] mx-auto">
          <TabsList className="w-full justify-evenly">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="kpi">KPI</TabsTrigger>
            <TabsTrigger value="layouts">Layouts</TabsTrigger>
            <TabsTrigger value="storyboards">Storyboards</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="featured">
            <Featured />
            <Trending />
          </TabsContent>
          <TabsContent value="kpi">
            <KPI />
          </TabsContent>
          <TabsContent value="layouts">
            <Layouts />
          </TabsContent>
          <TabsContent value="storyboards">
            <Storyboards />
          </TabsContent>
          <TabsContent value="requests">
            <div className="mb-12">
              <h2 className="text-xl font-bold mb-2">Asset Requests</h2>
              <p className="text-muted-foreground mb-6">Track your asset requests and their status</p>
              <RequestList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </FavoriteProvider>
  )
}
