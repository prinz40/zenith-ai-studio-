import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ZENITH AI STUDIO - Luxury AI Video Engine',
  description: 'ElevenLabs Rachel luxe voice + MoviePy Ken Burns + epic music. Creates Ah Reels for zenith-mail.vercel.app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
