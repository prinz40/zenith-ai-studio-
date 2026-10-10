'use client'
import { useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => {
      alert('V2 Engine Connected! This will connect to zenith-mail.vercel.app API + MoviePy worker. Coming next!')
      setLoading(false)
    }, 1000)
  }

  return (
    <main className="min-h-screen hero-gradient">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <nav className="flex justify-between items-center mb-20">
          <h1 className="text-2xl font-black tracking-widest">ZENITH AI STUDIO</h1>
          <div className="text-sm opacity-60">LUXE EDITION V2</div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block glass px-4 py-1 rounded-full text-xs mb-6">ELEVENLABS RACHEL + MOVIEPY + EPIC MUSIC</div>
            <h2 className="text-6xl font-black leading-[0.9] mb-6">LUXURY<br/>AH<br/>REELS</h2>
            <p className="text-lg opacity-70 mb-8">Turn any business idea into a 60-second cinematic ad. Voice by Rachel Luxe, Ken Burns effect, epic royalty-free music. For zenith-mail.vercel.app</p>

            <div className="glass p-6 rounded-2xl">
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your business idea... e.g. Luxury perfume for CEOs" className="w-full bg-black/50 border border-white/10 rounded-xl p-4 mb-4 outline-none" />
              <button onClick={handleGenerate} disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition">
                {loading? 'IGNITING...' : 'GENERATE LUXE REEL →'}
              </button>
              <p className="text-xs opacity-40 mt-3 text-center">Powered by ZENITH Engine • Python MoviePy + ElevenLabs</p>
            </div>
          </div>

          <div className="glass rounded-[2rem] p-2 aspect-[9/16] max-w-sm mx-auto w-full">
            <div className="bg-zinc-900 rounded-[1.5rem] h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🎬</div>
                <p className="font-bold">Preview</p>
                <p className="text-sm opacity-50">Your 9:16 Reel will appear here with voice + music + Ken Burns</p>
                <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full w-1/3 bg-white animate-pulse"></div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 text-center">
          <div className="glass p-6 rounded-2xl"><div className="text-2xl">🎙️</div><p className="font-bold mt-2">Rachel Luxe</p><p className="text-xs opacity-60">ElevenLabs voice</p></div>
          <div className="glass p-6 rounded-2xl"><div className="text-2xl">🎞️</div><p className="font-bold mt-2">Ken Burns</p><p className="text-xs opacity-60">MoviePy zoom</p></div>
          <div className="glass p-6 rounded-2xl"><div className="text-2xl">🎵</div><p className="font-bold mt-2">Epic Music</p><p className="text-xs opacity-60">Royalty-free</p></div>
        </div>

        <p className="text-center mt-20 opacity-30 text-xs">zenith-ai-studio • Built by prinz40 • 2026</p>
      </div>
    </main>
  )
}
