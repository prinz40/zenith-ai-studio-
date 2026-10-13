import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, type } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    // Ensure type is safely handled as a string
    const cleanType = (type || 'Image').toLowerCase();

    // AUDIO BRANCH - Speech, Music, Voice Clone, Dubbing
    if (
      cleanType.includes('speech') || 
      cleanType.includes('music') || 
      cleanType.includes('voice') || 
      cleanType.includes('dubbing')
    ) {
      const KEY = process.env.ELEVENLABS_API_KEY;
      if (!KEY) {
        return NextResponse.json({ error: 'Add ELEVENLABS_API_KEY in Vercel Env Variables' }, { status: 400 });
      }

      const response = await fetch('https://elevenlabs.io', {
        method: 'POST',
        headers: {
          'xi-api-key': KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: prompt,
          model_id: 'eleven_multilingual_v2',
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return NextResponse.json({ error: `ElevenLabs Error: ${errText.slice(0, 200)}` }, { status: 500 });
      }

      // Convert stream safely to an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Return raw audio binary stream to frontend instead of JSON string
      return new Response(buffer, {
        headers: {
          'Content-Type': 'audio/mpeg',
        },
      });
    }

    // IMAGE BRANCH - Product Shot, Model, Lifestyle, Image, Avatar, Video
    const safePrompt = encodeURIComponent(`${prompt}, luxury, 8k, photorealistic, studio lighting, ${type}`);
    const seed = Math.floor(Math.random() * 9999999);
    const zenithImageUrl = `https://pollinations.ai{safePrompt}?width=1024&height=1024&seed=${seed}&nologo=true`;

    return NextResponse.json({
      url: zenithImageUrl,
      type: type,
      engine: 'Zenith-Flux-Ultra-v1',
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
}
