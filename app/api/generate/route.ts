import { NextRequest, NextResponse } from 'next/server';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'No prompt' }, { status: 400 });
    const cleanType = (type || 'Image').toLowerCase();

    // 1. AUDIO — Speech / Voice Clone / Music / Dubbing
    if (cleanType.includes('speech') || cleanType.includes('voice') || cleanType.includes('dub') || cleanType.includes('music')) {
      const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;
      if (!ELEVEN_KEY) return NextResponse.json({ error: 'Add ELEVENLABS_API_KEY in Vercel' }, { status: 500 });
      const voiceId = "21m00Tcm4TlvDq8ikWAM";
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: { 'xi-api-key': ELEVEN_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.8 } })
      });
      if (!r.ok) {
        const t = await r.text();
        return NextResponse.json({ error: 'Audio Engine Error: ' + t.slice(0,150) }, { status: 500 });
      }
      const buf = await r.arrayBuffer();
      return new NextResponse(buf, { headers: { 'Content-Type': 'audio/mpeg', 'X-Engine': 'Zenith-Audio-v1' } });
    }

    // 2. IMAGE — Product Shot / Model / Lifestyle / Image / Avatar / Video — STEALTH MODE
    // Zenith fetches from engine server-side, returns as its own image — no external URL exposed
    const enhancedPrompt = encodeURIComponent(`${prompt}, luxury studio, 8k, ultra detailed, photorealistic, cinematic lighting, ${type}`);
    const seed = Math.floor(Math.random() * 999999);
    const externalUrl = `https://image.pollinations.ai/p/${enhancedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true&model=flux`;

    const imageRes = await fetch(externalUrl, { cache: 'no-store' });
    if (!imageRes.ok) return NextResponse.json({ error: 'Zenith Render Failed' }, { status: 500 });
    
    const imageBuffer = await imageRes.arrayBuffer();

    // Return as Zenith's own image — 100% branded as Zenith AI Studio
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000',
        'X-Engine': 'Zenith-Flux-Ultra-v1',
        'X-Generated-By': 'Zenith AI Studio by Prinz40'
      }
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 });
  }
}
