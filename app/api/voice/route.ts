import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: 'Text required' }, { status: 400 })
    }

    const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY
    const VOICE_ID = '21m00Tcm4TlvDq8ikWAM' // Rachel - luxury female

    if (!ELEVEN_KEY) {
      return NextResponse.json({
        success: false,
        mock: true,
        message: 'ElevenLabs key not set yet - Add in Vercel Env',
        text: text.slice(0, 100)
      })
    }

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.75, similarity_boost: 0.75 }
      })
    })

    if (!response.ok) {
      throw new Error('ElevenLabs failed')
    }

    const audioBuffer = await response.arrayBuffer()
    
    return new NextResponse(audioBuffer, {
      headers: { 'Content-Type': 'audio/mpeg' }
    })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ voice: 'Rachel - Luxury', status: 'Ready for Zenith' })
}
