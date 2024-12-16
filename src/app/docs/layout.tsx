import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'Medical Showcase API documentation',
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
        <body>
            <div className="min-h-screen bg-background antialiased">
                {children}
            </div>
        </body>
    </html>
  )
} 