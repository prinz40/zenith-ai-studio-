'use client'
import { useState } from 'react'

export default function Page() {
  const [activeTab, setActiveTab] = useState('Image')
  const [prompt, setPrompt] = useState('Generate a red luxury sneakers shoes')
  const [loading, setLoading] = useState(false)
  const [resultUrl, setResultUrl] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [resultType, setResultType] = useState('')
  const [recent, setRecent] = useState<any[]>([])

  const tabs = ['Speech','Music','Voice Clone','Image','Video','Dubbing','Avatar','Product Shot Library','Model Photoshoot','Product to Lifestyle']

  const handleGenerate = async (customPrompt?: string, customType?: string) => {
    const finalPrompt = customPrompt || prompt
    const finalType = customType || activeTab
    if (!finalPrompt || finalPrompt.trim() === '') {
      return alert('Enter idea first my Prinz!')
    }

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
        })
      })

      const contentType = res.headers.get('content-type') || ''

      // If audio returns directly
      if (contentType.includes('audio')) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setRecent(r => [{ type: finalType, prompt: finalPrompt, url, isAudio: true, time: 'Just now', status: 'Ready' },...r].slice(0,6))
        setLoading(false)
        return
      }

      // For image - handle JSON
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      if (data.url) {
        // STEALTH: Convert to blob on phone so it shows as Zenith blob, not external link
        try {
          const imgFetch = await fetch(data.url)
          const imgBlob = await imgFetch.blob()
          const blobUrl = URL.createObjectURL(imgBlob)
          setResultUrl(blobUrl)
          setRecent(r => [{ type: finalType, prompt: finalPrompt, url: blobUrl, isAudio: false, time: 'Just now', status: 'Ready' },...r].slice(0,6))
        } catch {
          // If blob conversion fails, use direct url (still works)
          setResultUrl(data.url)
          setRecent(r => [{ type: finalType, prompt: finalPrompt, url: data.url, isAudio: false, time: 'Just now', status: 'Ready' },...r].slice(0,6))
        }
      } else {
        alert(data.error || 'No image returned from Zenith Brain')
      }

    } catch (e: any) {
      console.error(e)
      alert('Zenith Brain Error: ' + (e.message || 'Unknown error - Check Vercel Logs'))
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
          <button onClick={()=>{ setPrompt(''); setResultUrl(''); setAudioUrl(''); window.scrollTo({top:0, behavior:'smooth'}) }} className="bg-[#F5D76E] text-black px-4 py-2 rounded-lg text-sm font-bold">+ New Project</button>
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
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 grid place-items-center transition"><span className="bg-[#F5D76E] text-black px-4 py-
