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

  const tabs = [
    'Speech', 'Music', 'Voice Clone', 'Image', 'Video', 
    'Dubbing', 'Avatar', 'Product Shot Library', 
    'Model Photoshoot', 'Product to Lifestyle'
  ]

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
      
      // AUDIO BRANCH (ElevenLabs Stream Verification)
      if (ctype.includes('audio')) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setRecent((r: any) => [{ type: finalType, prompt: finalPrompt, url, isAudio: true }, ...r].slice(0, 6))
        setLoading(false)
        return
      }
      
      // IMAGE & TEMPLATE BRANCH
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      
      if (data.url) {
        // Optimized cache load framework avoiding CORS failures
        const imgTracker = new Image()
        imgTracker.src = data.url
        imgTracker.onload = () => {
          setResultUrl(data.url)
          setRecent((r: any) => [{ type: finalType, prompt: finalPrompt, url: data.url, isAudio: false }, ...r].slice(0, 6))
          setLoading(false)
        }
        imgTracker.onerror = () => {
          setResultUrl(data.url)
          setLoading(false)
        }
      }
    } catch (e: any) {
      alert('Zenith Error: ' + e.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#08070A] text-white px-4 py-4 font-sans">
      {/* Brand Header Stage */}
      <div className="max-w-7xl mx-auto border border-[#F5D76E]/20 rounded-2xl bg-black/40 px-6 py-4 flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 border border-[#F5D76E] rotate-45 grid place-items-center">
            <div className="-rotate-45 text-[#F5D76E] font-bold">O</div>
          </div>
          <div>
            <h1 className="text-xl tracking-[0.2em] font-light text-[#F5D76E]">ZENITH AI STUDIO</h1>
            <p className="text-[10px] tracking-[0.3em] opacity-60">AI VIDEO PRODUCTION PLATFORM</p>
          </div>
        </div>
        <div className="flex gap-4 text-[#F5D76E]/70 text-xs font-mono">
          <span className="cursor-pointer hover:text-white">SEARCH</span>
          <span className="cursor-pointer hover:text-white">NOTIFICATIONS</span>
        </div>
      </div>

      {/* Model Navigation Deck */}
      <div className="max-w-7xl mx-auto mt-4 border border-white/10 rounded-2xl bg-white/[0.03] p-3 flex gap-2 overflow-x-auto scrollbar-none">
        {tabs.map((t) => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)} 
            className={`px-5 py-2.5 rounded-full text-sm whitespace-nowrap transition-all ${
              activeTab === t 
                ? 'bg-[#F5D76E] text-black font-bold shadow-lg shadow-[#F5D76E]/10' 
                : 'bg-black border border-[#F5D76E]/30 text-white/70 hover:border-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Control Actions Panel */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-light text-[#F5D76E]">Templates & Libraries</h2>
            <p className="text-sm opacity-50">Create professional AI-generated media in seconds - Click to generate</p>
          </div>
          <button 
            onClick={() => { setPrompt(''); setResultUrl(''); setAudioUrl('') }} 
            className="bg-[#F5D76E] text-black px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#ebd065] transition"
          >
            + New Project
          </button>
        </div>

        {/* Cinematic Prompt Input Deck */}
        <div className="bg-black/60 border border-white/10 p-5 rounded-2xl mb-6 flex gap-4 items-center">
          <div className="flex-1">
            <label className="block text-[10px] tracking-wider text-[#F5D76E] uppercase mb-1.5 font-bold">
              Prompt Execution Matrix ({activeTab})
            </label>
            <input 
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-[#121115] border border-white/10 px-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#F5D76E] transition text-white"
              placeholder="Describe your cinematic concept vision..."
            />
          </div>
          <button
            onClick={() => handleGenerate()}
            disabled={loading}
            className="h-[46px] mt-5 bg-[#F5D76E] hover:bg-[#ebd065] text-black font-bold px-8 rounded-xl transition text-sm disabled:opacity-40"
          >
            {loading ? 'PROCESSING...' : 'RUN PIPELINE'}
          </button>
        </div>

        {/* Live Presentation Theatre Output Block */}
        {(loading || resultUrl || audioUrl) && (
          <div className="mb-8 border border-[#F5D76E]/30 bg-[#0d0c10] p-6 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
            {loading ? (
              <div className="text-center space-y-3">
                <div className="w-8 h-8 border-2 border-[#F5D76E] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs text-[#F5D76E]/70 font-mono tracking-widest">RENDERING MEDIA FLOW STREAM...</p>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center space-y-4">
                <span className="text-[10px] tracking-widest font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded border border-zinc-800 uppercase">
                  Output: {resultType}
                </span>
                
                {resultUrl && (
                  <img 
                    src={resultUrl} 
                    alt="Zenith AI Output asset" 
                    className="max-h-[450px] rounded-xl border border-white/10 object-contain shadow-2xl"
                  />
                )}
                
                {audioUrl && (
                  <div className="w-full max-w-md bg-black/40 border border-white/10 p-4 rounded-xl flex flex-col items-center space-y-2">
                    <p className="text-xs text-[#F5D76E] font-mono">Synthesized Voice Output Track</p>
                    <audio src={audioUrl} controls className="w-full filter invert brightness-90" autoPlay />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Studio Pipeline Templates Grid */}
        <div className="grid md:grid-cols-3 gap-5">
          <div 
            onClick={() => {
              const p = 'White luxury sneaker Ah Rell Luxe Edition on black marble with gold light, 8k studio'
              setPrompt(p)
              setActiveTab('Product Shot Library')
              handleGenerate(p, 'Product Shot Library')
            }} 
            className="rounded-2xl border border-white/10 hover:border-[#F5D76E]/40 bg-black overflow-hidden cursor-pointer p-3 transition"
          >
            <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80" className="w-full h-48 object-cover rounded-xl" alt="template"/>
            <div className="p-3 text-center"><h3 className="text-[#F5D76E] font-light">Product Shot Library</h3><p className="text-[11px] opacity-50">Click to execute production</p></div>
          </div>

          <div 
            onClick={() => {
              const p = 'African luxury fashion model wearing white sneaker, Vogue style, black background gold light'
              setPrompt(p)
              setActiveTab('Model Photoshoot')
              handleGenerate(p, 'Model Photoshoot')
            }} 
            className="rounded-2xl border border-white/10 hover:border-[#F5D76E]/40 bg-black overflow-hidden cursor-pointer p-3 transition"
          >
            <img src="https://unsplash.com" className="w-full h-48 object-cover rounded-xl" alt="template"/>
            <div className="p-3 text-center"><h3 className="text-[#F5D76E] font-light">Model Photoshoot</h3><p className="text-[11px] opacity-50">Click to execute production</p></div>
          </div>

          <div 
            onClick={() => {
              const p = 'Commercial luxury perfume bottle on premium crystal podium surrounded by soft ambient smoke, anamorphic lighting, cinematic studio shot'
              setPrompt(p)
              setActiveTab('Product to Lifestyle')
              handleGenerate(p, 'Product to Lifestyle')
            }} 
            className="rounded-2xl border border-white/10 hover:border-[#F5D76E]/40 bg-black overflow-hidden cursor-pointer p-3 transition"
          >
    
