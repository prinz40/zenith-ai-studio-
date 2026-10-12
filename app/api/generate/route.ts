import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { prompt, type, voice_id, duration } = await req.json();
    if (!prompt) return NextResponse.json({ error: 'Prompt required' }, { status: 400 });

    const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;

    // 1. SPEECH
    if (type === 'Speech') {
      const voice = voice_id || '21m00Tcm4TlvDq8ikWAM';
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?optimize_streaming_latency=0`, {
        method: 'POST',
        headers: { 'xi-api-key': ELEVENLABS_KEY!, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
        body: JSON.stringify({ text: prompt, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0.5 } })
      });
      if (!res.ok) throw new Error(await res.text());
      const audioBuffer = await res.arrayBuffer();
      return new NextResponse(audioBuffer, { headers: { 'Content-Type': 'audio/mpeg' } });
    }

    // 2. MUSIC
    if (type === 'Music') {
      const musicRes = await fetch('https://api.elevenlabs.io/v1/music', {
        method: 'POST',
        headers: { 'xi-api-key': ELEVENLABS_KEY!, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `luxury cinematic ${prompt}`, music_length_ms: (duration || 15) * 1000 })
      });
      if (musicRes.ok) return new NextResponse(await musicRes.arrayBuffer(), { headers: { 'Content-Type': 'audio/mpeg' } });
      const sfxRes = await fetch('https://api.elevenlabs.io/v1/sound-generation', {
        method: 'POST', headers: { 'xi-api-key': ELEVENLABS_KEY!, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: prompt, duration_seconds: duration || 10 })
      });
      if (!sfxRes.ok) throw new Error(await sfxRes.text());
      return new NextResponse(await sfxRes.arrayBuffer(), { headers: { 'Content-Type': 'audio/mpeg' } });
    }

    // 3-7. IMAGE / VIDEO / AVATAR - FREE UNLIMITED FLUX
    let enhancedPrompt = prompt;
    if (type === 'Product Shot Library') enhancedPrompt = `luxury product photography, studio lighting, 8k, ${prompt}, black background gold accents`;
    if (type === 'Model Photoshoot') enhancedPrompt = `high fashion model photoshoot, Vogue, luxury, ${prompt}, professional lighting, 8k`;
    if (type === 'Product to Lifestyle') enhancedPrompt = `luxury lifestyle scene, ${prompt}, cinematic lighting, photorealistic, 8k`;

    const encoded = encodeURIComponent(enhancedPrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&model=flux&nologo=true&seed=${Math.floor(Math.random()*1000000)}`;
    return NextResponse.json({ type: 'image', url: imageUrl, prompt: enhancedPrompt });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
  }
