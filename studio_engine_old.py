import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS
from moviepy.editor import *
from PIL import Image, ImageDraw, ImageFont
from gtts import gTTS
import numpy as np, wave, os

W,H=1080,1920
LINK="zenith-mall.vercel.app"
slides=[("s1.jpg","THE NIGHT IS YOURS"),("s2.jpg","AH-RELL // LUXE"),("s3.jpg",f"ONLY ON\n{LINK}")]

def make(txt):
    img=Image.new("RGBA",(W,800),(0,0,0,0))
    d=ImageDraw.Draw(img)
    try:
        b=ImageFont.truetype("/system/fonts/DroidSans-Bold.ttf", 110)
        s=ImageFont.truetype("/system/fonts/DroidSans-Bold.ttf", 70)
    except:
        b=ImageFont.load_default(); s=b
    y=30
    for line in txt.split("\n"):
        is_link = LINK in line
        font = s if is_link else b
        fill = "#FFD60A" if is_link else "white"
        bb=d.textbbox((0,0),line,font=font,stroke_width=30)
        d.text(((W-(bb[2]-bb[0]))//2,y),line,font=font,fill=fill,stroke_width=30,stroke_fill="black")
        y+=bb[3]-bb[1]+35
    img.save("tmp.png")
    return "tmp.png"

# ENDLESS POSSIBILITY: Correct pronunciation Ah-Rell
text = "The night is yours. Introducing... Ah Rell... Luxe Edition. Crafted for legends. Only on... Zenith Mall... dot... vercel... dot... app."
gTTS(text, lang='en', tld='co.uk', slow=False).save("voice.mp3")
voice=AudioFileClip("voice.mp3")

sr=44100; dur=voice.duration; samples=int(sr*dur)
t=np.linspace(0,dur,samples)
bass=(0.4*np.sin(2*np.pi*55*t)*np.exp(-0.08*t)).astype(np.float32)
boom=np.zeros(samples,dtype=np.float32)
for hit in [0,3.2,6.5,10.0]:
    start=int(hit*sr); end=int((hit+0.6)*sr)
    if end<samples:
        dt=np.linspace(0,0.6,end-start)
        boom[start:end]+=(0.8*np.sin(2*np.pi*40*dt)*np.exp(-5*dt)).astype(np.float32)
music_data=((bass+boom)*0.3*32767).astype(np.int16)
with wave.open("epic.wav","w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
    w.writeframes(music_data.tobytes())

music=AudioFileClip("epic.wav").volumex(0.8)
final_audio=CompositeAudioClip([music, voice.volumex(1.4)]).set_duration(dur)
per=dur/3
clips=[]
for p,txt in slides:
    base=ImageClip(p).set_duration(per).resize(height=H).resize(lambda t: 1+0.12*t/per).set_position("center")
    txt_c=ImageClip(make(txt)).set_duration(per).set_position(("center", H-850))
    top=ColorClip((W,180),(0,0,0)).set_duration(per).set_position((0,0))
    bottom=ColorClip((W,180),(0,0,0)).set_duration(per).set_position((0,H-180))
    clips.append(CompositeVideoClip([base,top,bottom,txt_c],size=(W,H)).set_duration(per))

final=concatenate_videoclips(clips,method="compose").set_audio(final_audio)
final.write_videofile("ZENITH_STUDIO_V1.mp4",fps=24,codec="libx264",audio_codec="aac")
os.system("cp ZENITH_STUDIO_V1.mp4 ~/storage/shared/partnership/cinematic/ && cp ZENITH_STUDIO_V1.mp4 ~/storage/shared/Movies/ && cp ZENITH_STUDIO_V1.mp4 ~/storage/shared/DCIM/ && echo 'DONE V1 READY FOR ENDLESS!'")
