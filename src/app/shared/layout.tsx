import { Metadata } from 'next'
import '@/app/styles/globals.css'

export const metadata: Metadata = {
  title: 'Shared Asset',
  description: 'View shared asset details',
}

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
} 