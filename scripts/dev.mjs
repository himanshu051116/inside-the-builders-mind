import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
const base = resolve(fileURLToPath(new URL('..', import.meta.url)), process.argv[2] || '')
const port = Number(process.env.PORT || 5173)
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.pdf':'application/pdf' }
http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost')
    const name = decodeURIComponent(url.pathname)
    const file = resolve(base, '.'+name, name.endsWith('/')?'index.html':'')
    if (file !== base && !file.startsWith(base + sep)) {res.writeHead(403);res.end('Forbidden');return}
    const data=await readFile(file)
    res.writeHead(200, {'Content-Type':mime[extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'})
    res.end(data)
  } catch { res.writeHead(404);res.end('Not found') }
}).listen(port, '0.0.0.0', () => console.log(`Portfolio: http://localhost:${port}`))
