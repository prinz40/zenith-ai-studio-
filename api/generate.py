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
        safe = urllib.parse.quote(prompt + ", ultra sharp 8K crystal clear professional")
        image_url = f"https://image.pollinations.ai/p/{safe}?model=flux&width=1280&height=1280&enhance=true&nologo=true&seed={random.randint(1,999999)}"
        self.send_response(200)
        self.send_header('Content-Type','application/json')
        self.send_header('Access-Control-Allow-Origin','*')
        self.end_headers()
        self.wfile.write(json.dumps({"imageUrl": image_url}).encode())
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Access-Control-Allow-Methods','POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers','Content-Type')
        self.end_headers()
    def do_GET(self):
        self.do_POST()
