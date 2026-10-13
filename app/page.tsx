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
    if (!finalPrompt.trim()) {
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
        setResultUrl(data.url)
        setRecent((r:any)=>[{type:finalType,prompt:finalPrompt,url:data.url,isAudio:false},...r].slice(0,6))
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
            <h1 className="text-xl tracking-[0.2em] text-[#F5D76E]">ZENITH AI STUDIO</h1>
            <p className="text-[10px] tracking-[0.3em] opacity-60">AI VIDEO PRODUCTION PLATFORM</p>
          </div>
        </div>
        <div className="flex gap-4 text-xs text-[#F5D76E]/70"><span>SEARCH</span><span>NOTIF</span></div>
      </div>

      <div className="max-w-7xl mx-auto mt-4 border border-white/10 rounded-2xl bg-white/[0.03] p-3 flex gap-2 overflow-x-auto">
        {tabs.map((t)=>(
          <button key={t} onClick={()=>setActiveTab(t)} className={`px-5 py-2.5 rounded-full text-sm whitespace-nowrap ${activeTab===t? 'bg-[#F5D76E] text-black font-bold' : 'bg-black border border-[#F5D76E]/30 text-white/70'}`}>{t}</button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex justify-between items-end mb-4">
          <div><h2 className="text-2xl text-[#F5D76E]">Templates & Libraries</h2><p className="text-sm opacity-50">Click to generate - Instant</p></div>
          <button onClick={()=>{setPrompt(''); setResultUrl(''); setAudioUrl('')}} className="bg-[#F5D76E] text-black px-4 py-2 rounded-lg text-sm font-bold">+ New Project</button>
        </div>

        <div className="bg-black/60 border border-white/10 p-5 rounded-2xl mb-6 flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-[10px] text-[#F5D76E] uppercase mb-1 font-bold">Prompt - {activeTab}</label>
            <input value={prompt} onChange={(e)=>setPrompt(e.target.value)} className="w-full bg-[#121115] border border-white/10 px-4 py-3 rounded-xl text-sm outline-none text-white" placeholder="Describe vision..." />
          </div>
          <button onClick={()=>handleGenerate()} disabled={loading} className="h-[46px] mt-5 bg-[#F5D76E] text-black font-bold px-8 rounded-xl text-sm disabled:opacity-40">{loading? 'PROCESSING...' : 'RUN PIPELINE'}</button>
        </div>

        {(loading || resultUrl || audioUrl) && (
          <div className="mb-8 border border-[#F5D76E]/30 bg-[#0d0c10] p-6 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
            {loading? <div className="text-center"><div className="w-8 h-8 border-2 border-[#F5D76E] border-t-transparent rounded-full animate-spin mx-auto"></div><p className="text-xs text-[#F5D76E]/70 mt-2">RENDERING...</p></div> :
              <div className="w-full flex flex-col items-center space-y-4">
                <span className="text-[10px] text-zinc-400 bg-zinc-900 px-3 py-1 rounded border border-zinc-800">Output: {resultType}</span>
                {resultUrl && <img src={resultUrl} alt="Output" className="max-h-[450px] rounded-xl border border-white/10 object-contain" />}
                {audioUrl && <div className="w-full max-w-md bg-black/40 border border-white/10 p-4 rounded-xl"><audio src={audioUrl} controls className="w-full" autoPlay /></div>}
                {resultUrl && <a href={resultUrl} target="_blank" className="bg-[#F5D76E] text-black px-4 py-2 rounded-full text-xs font-bold mt-2">Download HD</a>}
                {audioUrl && <a href={audioUrl} download className="bg-[#F5D76E] text-black px-4 py-2 rounded-full text-xs font-bold mt-2">Download MP3</a>}
              </div>
            }
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-5">
          <div onClick={()=>{const p='White luxury sneaker Ah Rell Luxe Edition on black marble with gold light, 8k studio'; setPrompt(p); setActiveTab('Product Shot Library'); handleGenerate(p,'Product Shot Library')}} className="rounded-2xl border border-white/10 bg-black p-3 cursor-pointer">
            <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=400" className="w-full h-48 object-cover rounded-xl" alt="template"/>
            <div className="p-3 text-center"><h3 className="text-[#F5D76E]">Product Shot Library</h3><p className="text-[11px] opacity-50">Click to generate</p></div>
          </div>
          <div onClick={()=>{const p='African luxury fashion model wearing white sneaker, Vogue style, black background gold light'; setPrompt(p); setActiveTab('Model Photoshoot'); handleGenerate(p,'Model Photoshoot')}} className="rounded-2xl border border-white/10 bg-black p-3 cursor-pointer">
            <img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400" className="w-full h-48 object-cover rounded-xl" alt="template"/>
            <div className="p-3 text-center"><h3 className="text-[#F5D76E]">Model Photoshoot</h3><p className="text-[11px] opacity-50">Click to generate</p></div>
          </div>
          <div onClick={()=>{const p='Luxury sneaker in modern mansion living room, cinematic lighting'; setPrompt(p); setActiveTab('Product to Lifestyle'); handleGenerate(p,'Product to Lifestyle')}} className="rounded-2xl border border-white/10 bg-black p-3 cursor-pointer">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400" className="w-full h-48 object-cover rounded-xl" alt="template"/>
            <div className="p-3 text-center"><h3 className="text-[#F5D76E]">Product to Lifestyle</h3><p className="text-[11px] opacity-50">Click to generate</p></div>
          </div>
        </div>

        <div className="mt-6 border border-white/10 rounded-2xl p-4">
          <h3 className="text-[#F5D76E]">Recent - {recent.length}</h3>
          <div className="grid md:grid-cols-3 gap-3 mt-3 text-xs">
            {recent.length===0? <p className="opacity-50">No generations yet</p> : recent.map((r:any,i:number)=>(
              <div key={i} onClick={()=>{setResultType(r.type); r.isAudio? setAudioUrl(r.url) : setResultUrl(r.url)}} className="flex gap-2 items-center bg-white/5 p-2 rounded-lg cursor-pointer">
                <div className="w-16 h-10 bg-zinc-800 rounded grid place-items-center text-[10px]">{r.isAudio? 'AUDIO' : 'IMG'}</div><div className="truncate"><p>{r.type}</p><p className="opacity-50 truncate">{r.prompt.slice(0,20)}</p></div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center mt-8 text-[10px] tracking-[0.3em] opacity-20">ZENITH AI STUDIO BY PRINZ40 2026</p>
      </div>
    </div>
  )
                             }
