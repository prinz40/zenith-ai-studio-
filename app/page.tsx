'use client'
import { useState } from 'react'

export default function Page() {
  const [activeTab, setActiveTab] = useState('Voice Clone')
  const [idea, setIdea] = useState('')
  const tabs = ['Speech','Music','Voice Clone','Image','Video','Dubbing','Avatar']

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
            {t==='Speech'?'🎙':t==='Music'?'🎵':t==='Voice Clone'?'〰':t==='Image'?'🖼':t==='Video'?'🎥':t==='Dubbing'?'⚙':'👤'} {t}
          </button>
        ))}
      </div>

      {/* TEMPLATES */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex justify-between items-end mb-4">
          <div><h2 className="text-2xl font-light text-[#F5D76E]">Templates & Libraries</h2><p className="text-sm opacity-50">Create professional AI-generated media in seconds</p></div>
          <button className="bg-[#F5D76E] text-black px-4 py-2 rounded-lg text-sm font-bold">+ New Project</button>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {title:'Product Shot Library', sub:'500+ product backdrops • 4K • Ready to generate', img:'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80', badge:'POPULAR', n:'124', r:'4.9', t:'1m'},
            {title:'Model Photoshoot', sub:'AI model generation • Lifestyle • Portrait', img:'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80', badge:'NEW', n:'89', r:'4.8', t:'2m'},
            {title:'Product to Lifestyle', sub:'Scene generation • Contextual • Natural lighting', img:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80', badge:'TRENDING', n:'210', r:'4.9', t:'1m'},
          ].map(c=>(
            <div key={c.title} className="rounded-2xl border border-[#F5D76E]/20 bg-black overflow-hidden group hover:border-[#F5D76E]/50 transition">
              <div className="relative p-3">
                <div className="absolute top-6 right-6 z-10 bg-[#F5D76E]/90 text-black text-[10px] px-2 py-1 rounded-full font-bold">{c.badge}</div>
                <img src={c.img} className="w-full h-48 object-cover rounded-xl" />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-[#F5D76E] font-light">{c.title}</h3>
                <p className="text-[11px] opacity-50 mt-1">{c.sub}</p>
                <div className="flex justify-center gap-6 mt-3 text-[12px] opacity-60"><span>🖼 {c.n}</span><span>☆ {c.r}</span><span>◷ {c.t}</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* GENERATE BOX - FUNCTIONAL */}
        <div className="mt-8 border border-[#F5D76E]/20 rounded-2xl p-5 bg-gradient-to-b from-[#F5D76E]/10 to-transparent">
          <h3 className="text-[#F5D76E] mb-3">⚡ Generate Luxury Reel — Connected to Brain</h3>
          <div className="flex gap-2">
            <input value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Enter business idea: e.g. White luxury sneaker Ah Rell Luxe Edition..." className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm" />
            <button onClick={async()=>{
              if(!idea) return alert('Enter idea');
              const res=await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idea,style:'luxury'})});
              const data=await res.json(); alert(`✅ SCRIPT: ${data.script.slice(0,120)}... +${data.points||15} Zenith Points`);
            }} className="bg-[#F5D76E] text-black px-6 py-3 rounded-xl font-black text-sm">CREATE</button>
          </div>
        </div>

        {/* RECENT */}
        <div className="mt-6 border border-white/10 rounded-2xl p-4">
          <div className="flex justify-between"><h3 className="text-[#F5D76E]">Recent Generations</h3><span className="text-sm opacity-60">View all →</span></div>
          <div className="grid md:grid-cols-3 gap-3 mt-4 text-xs">
            <div className="flex gap-3 items-center bg-white/[0.03] p-2 rounded-lg"><div className="w-16 h-10 bg-zinc-800 rounded"/> <div><p>Commercial Video</p><p className="opacity-50">45s • Ready</p></div><div className="w-2 h-2 bg-green-400 rounded-full ml-auto"/></div>
            <div className="flex gap-3 items-center bg-white/[0.03] p-2 rounded-lg"><div className="w-16 h-10 bg-zinc-800 rounded"/> <div><p>Voice Clone</p><p className="opacity-50">EN Male • Completed</p></div></div>
            <div className="flex gap-3 items-center bg-white/[0.03] p-2 rounded-lg"><div className="w-16 h-10 bg-zinc-800 rounded"/> <div><p>Avatar Shoot</p><p className="opacity-50">Scene 03 • Processing 78%</p></div></div>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] tracking-[0.3em] opacity-20">ZENITH AI STUDIO • BY PRINZ40 • 2026 • ENDLESS ZENITH POINTS</p>
      </div>
    </main>
  )
            }
