import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
const base = resolve(fileURLToPath(new URL('..', import.meta.url)), process.argv[2] || '')
const port = Number(process.env.PORT || 5173)
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webp':'image/webp', '.mp4':'video/mp4', '.pdf':'application/pdf' }
http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost')
    const name = decodeURIComponent(url.pathname)
    const file = resolve(base, '.'+name, (name.endsWith('/')||!extname(name))?'index.html':'')
    if (file !== base && !file.startsWith(base + sep)) {res.writeHead(403);res.end('Forbidden');return}
    const data=await readFile(file)
    const headers={'Content-Type':mime[extname(file)] || 'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'}
    const requested=req.headers.range
    if(requested){
      const match=/^bytes=(\d*)-(\d*)$/.exec(requested)
      let start=0,end=data.length-1,valid=Boolean(match)
      if(valid){
        if(match[1]==='' && match[2]==='')valid=false
        else if(match[1]===''){
          const count=Number(match[2]);valid=Number.isSafeInteger(count)&&count>0
          start=Math.max(0,data.length-count)
        }else{
          start=Number(match[1]);valid=Number.isSafeInteger(start)
          if(match[2]!==''){end=Number(match[2]);valid=valid&&Number.isSafeInteger(end)}
        }
        if(valid)valid=start>=0 && start<data.length && end>=start
      }
      if(!valid){res.writeHead(416,{...headers,'Content-Range':`bytes */${data.length}`});res.end();return}
      end=Math.min(end,data.length-1)
      res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1})
      if(req.method==='HEAD'){res.end();return}
      res.end(data.subarray(start,end+1));return
    }
    res.writeHead(200,{...headers,'Content-Length':data.length})
    if(req.method==='HEAD'){res.end();return}
    res.end(data)
  } catch { res.writeHead(404);res.end('Not found') }
}).listen(port, '0.0.0.0', () => console.log(`Portfolio: http://localhost:${port}`))
