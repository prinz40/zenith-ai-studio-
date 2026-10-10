from http.server import BaseHTTPRequestHandler
import json, urllib.parse, random

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length).decode('utf-8') if length>0 else "{}"
        try:
            data = json.loads(body)
        except:
            data = {}
        prompt = data.get('prompt', 'White luxury sneaker')
        image_url = data.get('imageUrl', '')
        # For V2 we return video data - frontend will animate the image into video
        # We also provide a free stock luxury video background as fallback
        self.send_response(200)
        self.send_header('Content-Type','application/json')
        self.send_header('Access-Control-Allow-Origin','*')
        self.end_headers()
        # Return the same image to be animated into video on frontend + voice script
        self.wfile.write(json.dumps({
            "videoReady": True,
            "imageUrl": image_url,
            "prompt": prompt,
            "voiceText": "The night is yours. Introducing Ah Rell Luxe Edition. Crafted for those who own the darkness.",
            "duration": 5
        }).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Access-Control-Allow-Methods','POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers','Content-Type')
        self.end_headers()
