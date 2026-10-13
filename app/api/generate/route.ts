import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const cleanType = (type || 'Image').toLowerCase();

    // AUDIO - Speech, Music, Voice Clone, Dubbing
    if (
      cleanType.includes('speech') ||
      cleanType.includes('music') ||
      cleanType.includes('voice') ||
      cleanType.includes('dubbing')
    ) {
      const KEY = process.env.ELEVENLABS_API_KEY;
      if (!KEY) {
        return NextResponse.json({ error: 'Add ELEVENLABS_API_KEY in Vercel Env Variables for Speech/Music. Image works without key!' }, { status: 400 });
      }

      const r = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt, model_id: 'eleven_multilingual_v2' })
      });

      if (!r.ok) {
        const t = await r.text();
        return NextResponse.json({ error: 'ElevenLabs: ' + t.slice(0, 200) }, { status: 500 });
      }

      const buf = await r.arrayBuffer();
      return new NextResponse(buf, { headers: { 'Content-Type': 'audio/mpeg' } });
    }

    // IMAGE - Product Shot, Model, Lifestyle, Image, Avatar, Video - NO KEY NEEDED
    const safePrompt = encodeURIComponent(`${prompt}, luxury, 8k, photorealistic, studio lighting, ${type}`);
    const seed = Math.floor(Math.random() * 9999999);
    const zenithImageUrl = `https://image.pollinations.ai/p/${safePrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true&model=flux`;

    return NextResponse.json({
      url: zenithImageUrl,
      type: type,
      engine: 'Zenith-Flux-Ultra-v1'
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
