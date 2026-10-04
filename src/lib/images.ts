import manifest from '../data/imageManifest.json'
const files:string[]=manifest as any
const V=/\.(mp4|webm|mov)$/i,key=(p:string)=>p.replace(/\.[a-z0-9]+$/i,'').toLowerCase()
const imap=new Map(files.filter(f=>!V.test(f)).map(f=>[key(f),f])),vmap=new Map(files.filter(f=>V.test(f)).map(f=>[key(f),f]))
/** Finds a picture by name whatever its extension (jpg/png/webp). */
export const resolveImg=(src?:string)=>src?(imap.get(key(src))||src):src
/** If a video with the same name exists (e.g. campaign-01.mp4) it is used instead of the picture. */
export const resolveVideo=(src?:string)=>src?vmap.get(key(src)):undefined
/** Every file named <product-slug>-01, -02, -03... (pictures or videos, any count). */
export const imagesFor=(brandId:string,slug:string,fallback:string[])=>{const base=`/images/products/${brandId}/${slug}-`;const f=files.filter(x=>x.toLowerCase().startsWith(base)).sort();return f.length?f:fallback}
