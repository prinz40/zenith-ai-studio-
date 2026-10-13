import { NextRequest, NextResponse } from 'next/server';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'No prompt' }, { status: 400 });
    const cleanType = (type || 'Image').toLowerCase();

    // AUDIO — needs ElevenLabs key only for these
    if (cleanType.includes('speech') || cleanType.includes('voice') || cleanType.includes('music') || cleanType.includes('dub')) {
      const KEY = process.env.ELEVENLABS_API_KEY;
      if (!KEY) return NextResponse.json({ error: 'Please add ELEVENLABS_API_KEY in Vercel > Settings > Env Variables' }, { status: 500 });
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
        method: 'POST',
        headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt, model_id: 'eleven_multilingual_v2' })
      });
      if (!r.ok) {
        const t = await r.text();
        return NextResponse.json({ error: t.slice(0,200) }, { status: 500 });
      }
      const buf = await r.arrayBuffer();
      return new NextResponse(buf, { headers: { 'Content-Type': 'audio/mpeg' } });
    }

    // IMAGE — ALL other types — INSTANT, NO TIMEOUT, NO KEY NEEDED
    const safePrompt = encodeURIComponent(`${prompt}, luxury, 8k, studio, photorealistic, cinematic, ${type}`);
    const seed = Math.floor(Math.random() * 9999999);
    const zenithImageUrl = `https://image.pollinations.ai/p/${safePrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true&model=flux`;

    // Return instantly — frontend will convert to Zenith blob so no pollinations shows
    return NextResponse.json({
      url: zenithImageUrl,
      type: type,
      engine: 'Zenith-Flux-Ultra-v1',
      brandedBy: 'Zenith AI Studio by Prinz40'
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
