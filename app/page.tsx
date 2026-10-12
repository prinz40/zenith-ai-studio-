'use client'
import { useState } from 'react'

export default function Page() {
  const [activeTab, setActiveTab] = useState('Product Shot Library')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultUrl, setResultUrl] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [resultType, setResultType] = useState('')
  const [recent, setRecent] = useState<any[]>([])

  const tabs = ['Speech','Music','Voice Clone','Image','Video','Dubbing','Avatar','Product Shot Library','Model Photoshoot','Product to Lifestyle']

  const handleGenerate = async (customPrompt?: string, customType?: string) => {
    const finalPrompt = customPrompt || prompt
    const finalType = customType || activeTab
    if (!finalPrompt) return alert('Enter idea first my Prinz!')

    setLoading(true)
    setResultUrl('')
    setAudioUrl('')
    setResultType(finalType)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          type: finalType,
          duration: 15
        })
      })

      const contentType = res.headers.get('content-type')

      if (contentType?.includes('audio')) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setRecent(r => [{ type: finalType, prompt: finalPrompt, url, time: 'Just now', status: 'Ready' },...r].slice(0,6))
      } else {
        const data = await res.json()
        if (data.url) {
          setResultUrl(data.url)
          setRecent(r => [{ type: finalType, prompt: finalPrompt, url: data.url, time: 'Just now', status: 'Ready' },...r].slice(0,6))
        } else {
          alert(data.error || 'Failed')
        }
      }
    } catch (e: any) {
      alert('Zenith Brain Error: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#08070A] text-white px-4 py-4">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;600;900&display=swap'); *{font-family:Outfit}`}</style>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto border border-[#F5D76E]/20 rounded-2xl bg-black/40 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 border border-[#F5D76E] rotate-45 grid place-items-center"><div className="-rotate-45 text-[#F5D76E]">◊</div></div>
          <div>
            <h1 className="text-xl tracking-[0.2em] font-light text-[#F5D76E]">ZENITH AI STUDIO •</h1>
            <p className="text-[10px] tracking-[0.3em] opacity-60">AI VIDEO PRODUCTION PLATFORM</p>
          </div>
        </div>
        <div className="flex gap-4 text-[#F5D76E]/70">
          <span className="text-2xl">⌕</span><span className="text-2xl">🔔</span><span className="w-8 h-8 rounded-full border border-[#F5D76E]/50 grid place-items-center">◍</span>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto mt-4 border border-white/10 rounded-2xl bg-white/[0.03] p-3 flex gap-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={()=>setActiveTab(t)} className={`px-5 py-2.5 rounded-full text-sm whitespace-nowrap flex gap-2 items-center transition ${activeTab===t? 'bg-[#F5D76E] text-black font-bold shadow-[0_0_20px_#F5D76E]' : 'bg-black border border-[#F5D76E]/30 text-white/70'}`}>
            {t==='Speech'?'🎙':t==='Music'?'🎵':t==='Voice Clone'?'〰':t==='Image'?'🖼':t==='Video'?'🎥':t==='Dubbing'?'⚙':t==='Avatar'?'👤':'📦'} {t}
          </button>
        ))}
      </div>

      {/* TEMPLATES */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex justify-between items-end mb-4">
          <div><h2 className="text-2xl font-light text-[#F5D76E]">Templates & Libraries</h2><p className="text-sm opacity-50">Create professional AI-generated media in seconds — Click to generate</p></div>
          <button className="bg-[#F5D76E] text-black px-4 py-2 rounded-lg text-sm font-bold">+ New Project</button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {title:'Product Shot Library', prompt:'White luxury sneaker Ah Rell Luxe Edition on black marble with gold light, 8k studio', img:'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80', badge:'POPULAR', n:'124', r:'4.9', t:'1m'},
            {title:'Model Photoshoot', prompt:'African luxury fashion model wearing white sneaker, Vogue style, black background gold light', img:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80', badge:'NEW', n:'89', r:'4.8', t:'2m'},
            {title:'Product to Lifestyle', prompt:'Luxury sneaker in modern mansion living room, cinematic lighting, architectural digest', img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80', badge:'TRENDING', n:'210', r:'4.9', t:'1m'},
          ].map(c=>(
            <div key={c.title} onClick={()=>{ setPrompt(c.prompt); setActiveTab(c.title); handleGenerate(c.prompt, c.title) }} className="rounded-2xl border border-[#F5D76E]/20 bg-black overflow-hidden group hover:border-[#F5D76E]/50 transition cursor-pointer">
              <div className="relative p-3">
                <div className="absolute top-6 right-6 z-10 bg-[#F5D76E]/90 text-black text-[10px] px-2 py-1 rounded-full font-bold">{c.badge}</div>
                <img src={c.img} className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 grid place-items-center transition"><span className="bg-[#F5D76E] text-black px-4 py-2 rounded-full text-xs font-bold">CLICK TO GENERATE</span></div>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-[#F5D76E] font-light">{c.title}</h3>
                <p className="text-[11px] opacity-50 mt-1">Click to generate instantly</p>
                <div className="flex justify-center gap-6 mt-3 text-[12px] opacity-60"><span>🖼 {c.n}</span><span>☆ {c.r}</span><span>◷ {c.t}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* GENERATE BOX - WIRED TO REAL BRAIN */}
        <div className="mt-8 border border-[#F5D76E]/20 rounded-2xl p-5 bg-gradient-to-b from-[#F5D76E]/10 to-transparent">
          <h3 className="text-[#F5D76E] mb-3">⚡ Generate Luxury Reel — Connected to Real Brain ({activeTab})</h3>
          <div className="flex gap-2">
            <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Enter business idea: e.g. White luxury sneaker Ah Rell Luxe Edition on gold pedestal..." className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F5D76E]/50" />
            <button onClick={()=>handleGenerate()} disabled={loading} className="bg-[#F5D76E] text-black px-8 py-3 rounded-xl font-black text-sm shadow-[0_0_20px_#F5D76E]/30 disabled:opacity-50">
              {loading? 'COOKING...' : 'CREATE'}
            </button>
          </div>
          <p className="text-[11px] mt-3 opacity-40">Current mode: <span className="text-[#F5D76E]">{activeTab}</span> • Speech/Music uses ElevenLabs • Image/Video uses Flux Free Unlimited • Endless Power</p>
        </div>

        {/* RESULT DISPLAY */}
        {(resultUrl || audioUrl) && (
          <div className="mt-8 border border-[#F5D76E]/30 rounded-2xl p-5 bg-black animate-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#F5D76E]">✅ {resultType} Generated by Zenith</h3>
              <button onClick={()=>{setResultUrl(''); setAudioUrl('')}} className="text-xs opacity-50">Clear X</button>
            </div>

            {resultUrl && (
              <div className="rounded-xl overflow-hidden border border-white/10">
                <img src={resultUrl} alt="Generated" className="w-full max-h-[600px] object-contain bg-zinc-900" />
                <div className="p-4 flex justify-between bg-white/[0.03]">
                  <span className="text-xs opacity-60">{prompt}</span>
                  <a href={resultUrl} target="_blank" download className="bg-[#F5D76E] text-black px-4 py-1.5 rounded-full text-xs font-bold">Download HD</a>
                </div>
              </div>
            )}

            {audioUrl && (
              <div className="p-6 bg-white/[0.03] border border-white/10 rounded-xl">
                <p className="text-sm mb-3 text-white/80">🔊 {resultType} Audio Ready — {prompt}</p>
                <audio controls src={audioUrl} className="w-full" autoPlay />
                <div className="mt-4 flex gap-3">
                  <a href={audioUrl} download={`zenith-${resultType}.mp3`} className="bg-[#F5D76E] text-black px-4 py-2 rounded-full text-xs font-bold">Download MP3</a>
                  <span className="text-xs opacity-40 py-2">ElevenLabs • Luxury Voice</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RECENT */}
        <div className="mt-6 border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between"><h3 className="text-[#F5D76E]">Recent Generations • {recent.length}</h3><span className="text-sm opacity-60">View all →</span></div>
          <div className="grid md:grid-cols-3 gap-3 mt-4 text-xs">
            {recent.length===0? (
              <>
                <div className="flex gap-3 items-center bg-white/[0.03] p-2 rounded-lg"><div className="w-16 h-10 bg-zinc-800 rounded"/> <div><p>No generations yet</p><p className="opacity-50">Generate first</p></div><div className="w-2 h-2 bg-yellow-400 rounded-full ml-auto"/></div>
                <div className="flex gap-3 items-center bg-white/[0.03] p-2 rounded-lg"><div className="w-16 h-10 bg-zinc-800 rounded"/> <div><p>Voice Clone</p><p className="opacity-50">Ready to test</p></div></div>
                <div className="flex gap-3 items-center bg-white/[0.03] p-2 rounded-lg"><div className="w-16 h-10 bg-zinc-800 rounded"/> <div><p>Avatar Shoot</p><p className="opacity-50">Ready to test</p></div></div>
              </>
            ) : recent.map((r,i)=>(
              <div key={i} className="flex gap-3 items-center bg-white/[0.03] p-2 rounded-lg border border-[#F5D76E]/10">
                <img src={r.url?.includes('.mp3')? 'https://cdn-icons-png.flaticon.com/512/138/138817.png' : r.url} className="w-16 h-10 object-cover rounded bg-zinc-800" />
                <div className="flex-1 truncate"><p className="truncate">{r.type}</p><p className="opacity-50 truncate">{r.prompt.slice(0,20)}</p></div>
                <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"/>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] tracking-[0.3em] opacity-20">ZENITH AI STUDIO • BY PRINZ40 • 2026 • ENDLESS ZENITH POINTS • REAL BRAIN ACTIVE</p>
      </div>
    </main>
  )
  }
