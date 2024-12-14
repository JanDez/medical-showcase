import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider, ToastViewport } from "@/app/components/ui/toast"

import "@/app/styles/globals.css";

const queryClient = new QueryClient()

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <main className={GeistSans.className}>
          <Component {...pageProps} />
        </main>
        <ToastViewport />
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default MyApp;