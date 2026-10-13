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
      alert('Enter idea first my Prinz!')
      return
    }
    setLoading(true)
    setResultUrl('')
    setAudioUrl('')
    setResultType(finalType)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, type: finalType })
      })
      const ctype = res.headers.get('content-type') || ''
      if (ctype.includes('audio')) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setRecent((r:any)=>[{type:finalType,prompt:finalPrompt,url,isAudio:true},...r].slice(0,6))
        setLoading(false)
        return
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      if (data.url) {
        try {
          const imgRes = await fetch(data.url)
          const imgBlob = await imgRes.blob()
          const blobUrl = URL.createObjectURL(imgBlob)
          setResultUrl(blobUrl)
          setRecent((r:any)=>[{type:finalType,prompt:finalPrompt,url:blobUrl,isAudio:false},...r].slice(0,6))
        } catch {
          setResultUrl(data.url)
          setRecent((r:any)=>[{type:finalType,prompt:finalPrompt,url:data.url,isAudio:false},...r].slice(0,6))
        }
      }
    } catch (e:any) {
      alert('Zenith Error: ' + e.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#08070A] text-white px-4 py-4">
      <div className="max-w-7xl mx-auto border border-[#F5D76E]/20 rounded-2xl bg-black/40 px-6 py-4 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 border border-[#F5D76E] rotate-45 grid place-items-center"><div className="-rotate-45 text-[#F5D76E]">O</div></div>
          <div>
            <h1 className="text-xl tracking-[0.2em] font-light text-[#F5D76E]">ZENITH AI STUDIO</h1>
            <p className="text-[10px] tracking-[0.3em] opacity-60">AI VIDEO PRODUCTION PLATFORM</p>
          </div>
        </div>
        <div className="flex gap-4 text-[#F5D76E]/70"><span>Search</span><span>Bell</span></div>
      </div>

      <div className="max-w-7xl mx-auto mt-4 border border-white/10 rounded-2xl bg-white/[0.03] p-3 flex gap-2 overflow-x-auto">
        {tabs.map((t)=>(
          <button key={t} onClick={()=>setActiveTab(t)} className={`px-5 py-2.5 rounded-full text-sm whitespace-nowrap ${activeTab===t? 'bg-[#F5D76E] text-black font-bold' : 'bg-black border border-[#F5D76E]/30 text-white/70'}`}>{t}</button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex justify-between items-end mb-4">
          <div><h2 className="text-2xl font-light text-[#F5D76E]">Templates & Libraries</h2><p className="text-sm opacity-50">Create professional AI-generated media in seconds - Click to generate</p></div>
          <button onClick={()=>{setPrompt(''); setResultUrl(''); setAudioUrl('')}} className="bg-[#F5D76E] text-black px-4 py-2 rounded-lg text-sm font-bold">+ New Project</button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          <div onClick={()=>{const p='White luxury sneaker Ah Rell Luxe Edition on black marble with gold light, 8k studio'; setPrompt(p); setActiveTab('Product Shot Library'); handleGenerate(p,'Product Shot Library')}} className="rounded-2xl border border-[#F5D76E]/20 bg-black overflow-hidden cursor-pointer p-3">
            <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80" className="w-full h-48 object-cover rounded-xl" alt="template"/>
            <div className="p-3 text-center"><h3 className="text-[#F5D76E]">Product Shot Library</h3><p className="text-[11px] opacity-50">Click to generate</p></div>
          </div>
          <div onClick={()=>{const p='African luxury fashion model wearing white sneaker, Vogue style, black background gold light'; setPrompt(p); setActiveTab('Model Photoshoot'); handleGenerate(p,'Model Photoshoot')}} className="rounded-2xl border border-[#F5D76E]/20 bg-black overflow-hidden cursor-pointer p-3">
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80" className="w-full h-48 object-cover rounded-xl" alt="template"/>
            <div className="p-3 text-center"><h3 className="text-[#F5D76E]">Model Photoshoot</h3><p className="text-[11px] opacity-50">Click to generate</p></div>
          </div>
          <div onClick={()=>{const p='Luxury sneaker in modern mansion living room, cinematic lighting'; setPrompt(p); setActiveTab('Product to Lifestyle'); handleGenerate(p,'Product to Lifestyle')}} className="rounded-2xl border border-[#F5D76E]/20 bg-black overflow-hidden cursor-pointer p-3">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80" className="w-full h-48 object-cover rounded-xl" alt="template"/>
            <div className="p-3 text-center"><h3 className="text-[#F5D76E]">Product to Lifestyle</h3><p className="text-[11px] opacity-50">Click to generate</p></div>
          </div>
        </div>

        <div className="mt-8 border border-[#F5D76E]/20 rounded-2xl p-5 bg-black">
          <h3 className="text-[#F5D76E] mb-3">Generate Luxury Reel - {activeTab}</h3>
          <div className="flex gap-2 flex-col md:flex-row">
            <input value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Enter business idea..." className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" />
            <button onClick={()=>handleGenerate()} disabled={loading} className="bg-[#F5D76E] text-black px-8 py-3 rounded-xl font-black text-sm disabled:opacity-50">{loading? 'ZENITH COOKING...' : 'CREATE'}</button>
          </div>
        </div>

        {(resultUrl || audioUrl) && (
          <div className="mt-8 border border-[#F5D76E]/30 rounded-2xl p-5 bg-black">
            <h3 className="text-[#F5D76E] mb-3">✅ {resultType} Generated by Zenith</h3>
            {resultUrl && <div><img src={resultUrl} alt="Generated" className="w-full max-h-[600px] object-contain bg-zinc-900 rounded-xl" /><div className="mt-3"><a href={resultUrl} target="_blank" className="bg-[#F5D76E] text-black px-4 py-2 rounded-full text-xs font-bold">Download HD</a></div></div>}
            {audioUrl && <div><audio controls src={audioUrl} className="w-full" autoPlay /><a href={audioUrl} download className="bg-[#F5D76E] text-black px-4 py-2 rounded-full text-xs font-bold mt-3 inline-block">Download MP3</a></div>}
          </div>
        )}

        <div className="mt-6 border border-white/10 rounded-2xl p-4">
          <h3 className="text-[#F5D76E]">Recent Generations - {recent.length}</h3>
          <div className="grid md:grid-cols-3 gap-3 mt-3 text-xs">
            {recent.length===0? <p className="opacity-50">No generations yet - Click template or CREATE</p> : recent.map((r:any,i:number)=>(
              <div key={i} onClick={()=>{setResultType(r.type); r.isAudio? setAudioUrl(r.url) : setResultUrl(r.url)}} className="flex gap-2 items-center bg-white/5 p-2 rounded-lg cursor-pointer">
                <img src={r.isAudio? 'https://cdn-icons-png.flaticon.com/512/138/138817.png' : r.url} className="w-16 h-10 object-cover rounded" alt="recent"/><div className="truncate"><p>{r.type}</p><p className="opacity-50 truncate">{r.prompt.slice(0,20)}</p></div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] tracking-[0.3em] opacity-20">ZENITH AI STUDIO BY PRINZ40 2026</p>
      </div>
    </div>
  )
            }
