'use client'
import { useState } from 'react'

export default function Page() {
  const [idea, setIdea] = useState('')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState('')
  const [points, setPoints] = useState(0)
  const [audioUrl, setAudioUrl] = useState('')

  const handleGenerate = async () => {
    if (!idea) return alert('Enter business idea!')
    setLoading(true)
    setScript('')
    setAudioUrl('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, style: 'luxury' })
      })
      const data = await res.json()
      setScript(data.script)
      setPoints(p => p + (data.points || 15))

      // Try voice
      const vRes = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.script.slice(0, 300) })
      })
      if (vRes.ok && vRes.headers.get('Content-Type')?.includes('audio')) {
        const blob = await vRes.blob()
        setAudioUrl(URL.createObjectURL(blob))
      }
    } catch (e) {
      alert('Brain error - check logs')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen hero-gradient text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <nav className="flex justify-between items-center mb-20">
          <h1 className="text-2xl font-black tracking-widest">ZENITH AI STUDIO</h1>
          <div className="flex gap-4 items-center">
            <div className="bg-white/10 px-4 py-2 rounded-full text-sm">⭐ {points} Zenith Points</div>
            <div className="text-sm opacity-60">LUXE EDITION V3</div>
          </div>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block glass px-4 py-1 rounded-full text-xs">ELEVENLABS RACHEL • MOVIEPY • EPIC MUSIC</div>
            <h2 className="text-6xl font-black leading-[0.9]">LUXURY<br/>MIRROR<br/>REELS</h2>
            <p className="text-lg opacity-70">Turn any business idea into a 60-second cinematic ad. Voice by Rachel, Ken Burns, Epic Music.</p>

            <div className="glass p-6 rounded-2xl space-y-4">
              <input value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Enter your business idea... e.g. Private jet charter for CEOs" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30" />
              <button onClick={handleGenerate} disabled={loading} className="w-full bg-white text-black font-black py-4 rounded-xl hover:scale-[1.02] transition">
                {loading? 'IGNITING...' : 'GENERATE LUXE REEL +15 ZENITH'}
              </button>
              <p className="text-xs opacity-40 text-center">Powered by ZENITH Engine + Python MoviePy + ElevenLabs</p>
            </div>

            {script && (
              <div className="glass p-6 rounded-2xl space-y-3 animate-in">
                <h3 className="font-bold">🔥 Script Generated:</h3>
                <p className="text-sm opacity-80 whitespace-pre-wrap">{script}</p>
                {audioUrl && <audio controls src={audioUrl} className="w-full mt-3" />}
                <div className="text-xs text-green-300">+15 Zenith Points Earned! Total: {points}</div>
              </div>
            )}
          </div>

          <div className="glass rounded-[2rem] p-2 aspect-[9/16] max-w-sm mx-auto w-full">
            <div className="bg-zinc-900 rounded-[1.5rem] h-full flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-5xl mb-5">🎬</div>
                <p className="font-bold">Preview</p>
                <p className="text-sm opacity-60 mt-2">Your 9:16 Reel will appear here with voice + music + Ken Burns</p>
                <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full w-1/3 bg-white animate-pulse" /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-6 text-center">
          <div className="glass p-6 rounded-2xl"><div className="text-2xl">🎙️</div><p className="font-bold mt-2">Rachel Voice</p><p className="text-xs opacity-60">ElevenLabs Luxury</p></div>
          <div className="glass p-6 rounded-2xl"><div className="text-2xl">🎥</div><p className="font-bold mt-2">Ken Burns</p><p className="text-xs opacity-60">Cinematic Zoom</p></div>
          <div className="glass p-6 rounded-2xl"><div className="text-2xl">🔥</div><p className="font-bold mt-2">Epic Music</p><p className="text-xs opacity-60">Viral Energy</p></div>
        </div>

        <p className="text-center mt-20 opacity-30 text-xs">zenith-ai-studio • Built by prinz40 • 2026 • Endless Points by Grace</p>
      </div>
    </main>
  )
                }
