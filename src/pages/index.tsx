import Head from "next/head";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { ArrowRight, LayoutTemplate, PieChart, FileSpreadsheet } from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Asset Library</title>
        <meta name="description" content="Browse and manage your reporting assets" />
      </Head>
      
      <main className="container mx-auto px-4 py-16 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Asset Library</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your central hub for reporting assets, templates, and KPIs
          </p>
          <Link href="/library">
            <Button size="lg">
              Browse Library <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6">
            <PieChart className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">KPI Templates</h2>
            <p className="text-muted-foreground">Ready-to-use KPI and metric templates</p>
          </div>
          
          <div className="text-center p-6">
            <LayoutTemplate className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Layout Library</h2>
            <p className="text-muted-foreground">Pre-designed layouts for your reports</p>
          </div>
          
          <div className="text-center p-6">
            <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-semibold mb-2">Storyboards</h2>
            <p className="text-muted-foreground">Narrative templates for presentations</p>
          </div>
        </div>
      </main>
    </>
  );
}
