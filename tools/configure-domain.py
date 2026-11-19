from pathlib import Path
from urllib.parse import urlparse
import sys,re,json
if len(sys.argv)!=2:
    raise SystemExit('Usage: python tools/configure-domain.py https://your-domain.example')
u=sys.argv[1].rstrip('/')
p=urlparse(u)
if p.scheme!='https' or not p.netloc or p.path or p.params or p.query or p.fragment or p.username or p.password:
    raise SystemExit('Enter your HTTPS origin without a path.')
if not re.fullmatch(r'https://[A-Za-z0-9.-]+(?::[0-9]+)?',u):
    raise SystemExit('Invalid origin.')
f=Path(__file__).resolve().parent.parent/'index.html'
s=f.read_text(encoding='utf-8')
s=re.sub(r'\s*<link rel="canonical"[^>]*>','',s)
s=re.sub(r'\s*<meta property="og:url"[^>]*>','',s)
s=re.sub(r'(<meta (?:property="og:image"|name="twitter:image") content=")[^"]+("\s*/?>)',lambda m:m[1]+u+'/assets/images/social-preview.jpg'+m[2],s)
s=re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)',lambda m:m[1]+json.dumps(dict(json.loads(m[2]),url=u+'/'),ensure_ascii=False,separators=(',',':'))+m[3],s, count=1)
s=s.replace('</head>',f'<link rel="canonical" href="{u}/">\n<meta property="og:url" content="{u}/">\n</head>')
f.write_text(s,encoding='utf-8')
print('Social preview and canonical URL configured:',u)
