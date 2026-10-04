// Prints exactly which picture files the website is still waiting for.
import {readFileSync,readdirSync} from 'fs'
const sl=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const key=p=>p.replace(/\.[a-z0-9]+$/i,'').toLowerCase()
const have=new Set(JSON.parse(readFileSync('src/data/imageManifest.json','utf8')).map(key));const want=new Set()
for(const d of ['src/data','src/pages'])for(const f of readdirSync(d).filter(x=>/\.tsx?$/.test(x)&&x!=='editorial.ts')){const t=readFileSync(`${d}/${f}`,'utf8')
for(const m of t.matchAll(/\bP\('([^']+)','[^']+','[^']+','([^']+)'/g))want.add(`/images/products/${sl(m[1])}/${sl(m[2])}-01`)
for(const m of t.matchAll(/^b\('([^']+)'/gm))want.add(`/images/brands/${sl(m[1])}`)
for(const m of t.matchAll(/'(\/images\/[^'$]+?)\.(?:jpg|png|webp)'/g))want.add(m[1])}
const miss=[...want].filter(p=>!have.has(key(p)));console.log(miss.length?`\nStill missing ${miss.length} of ${want.size}. Put a .jpg (or .png/.webp) at:\n`+miss.map(p=>`  public${p}.jpg`).join('\n'):'All pictures are in place.')
