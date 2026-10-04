// Lists every file in public/images into src/data/imageManifest.json so any extension (jpg/png/webp) is found automatically.
import {readdirSync,statSync,writeFileSync,existsSync} from 'fs';import {join} from 'path'
const out=[];const walk=d=>{for(const f of readdirSync(d)){const p=join(d,f);statSync(p).isDirectory()?walk(p):/\.(jpe?g|png|webp|avif|svg|mp4|webm|mov)$/i.test(f)&&out.push('/'+p.replace(/\\/g,'/').slice(7))}}
if(existsSync('public/images'))walk('public/images')
writeFileSync('src/data/imageManifest.json',JSON.stringify(out.sort(),null,1));console.log(`CAD images found: ${out.length}`)
