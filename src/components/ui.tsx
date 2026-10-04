import {useState} from 'react'
import {Link} from 'react-router-dom'
import {Heart,ArrowRight} from 'lucide-react'
import {inr} from '../data'
import {useApp} from '../lib/store'
import {resolveImg,resolveVideo} from '../lib/images'
export const Logo=({className=''}:any)=><span className={`font-serif font-light tracking-[0.55em] pl-[0.55em] ${className}`}>CAD</span>
const isVid=(s?:string)=>!!s&&/\.(mp4|webm|mov)$/i.test(s)
export function Img({src,alt,className='',ratio='aspect-[4/5]'}:any){
const [badSrc,setBadSrc]=useState('');
const bad=!src||badSrc===src;const v=isVid(src)?src:resolveVideo(src)
if(bad)return <div role="img" aria-label={alt} className={`${ratio} ${className} bg-ink border border-line/60 flex flex-col items-center justify-center text-bone`}><Logo className="text-2xl"/><span className="label mt-3 text-mute text-[9px]">Image coming soon</span>{import.meta.env.DEV&&src&&<span className="mt-2 px-4 text-center text-[9px] text-gold break-all">Add file: public{src}</span>}</div>
if(v)return <video src={v} poster={isVid(src)?undefined:resolveImg(src)} autoPlay muted loop playsInline preload="metadata" aria-label={alt} onError={()=>setBadSrc(src)} className={`${ratio} ${className} w-full object-cover`}/>
return <img src={resolveImg(src)} alt={alt} loading="lazy" onError={()=>setBadSrc(src)} className={`${ratio} ${className} w-full object-cover`}/>}
export const More=({to,children}:any)=><Link to={to} className="label inline-flex items-center gap-2 border-b border-bone pb-1 hover:gap-4 transition-all duration-500">{children}<ArrowRight size={14}/></Link>
export function ProductCard({p}:any){
const {wish,toggle,add}=useApp();const on=wish.includes(p.id)
return <article className="group relative">
<Link to={`/product/${p.slug}`} className="block overflow-hidden bg-panel relative">
<Img src={p.images[0]} alt={`${p.brand} ${p.name}`} className="transition-all duration-[1200ms] group-hover:scale-105 group-hover:opacity-0"/>
<Img src={p.images[1]||p.images[0]} alt="" ratio="aspect-[4/5] absolute inset-0" className="opacity-0 group-hover:opacity-100 transition-opacity duration-700"/></Link>
<button onClick={()=>toggle(p.id)} aria-label="Add to wishlist" aria-pressed={on} className="absolute top-3 right-3 p-2"><Heart size={18} strokeWidth={1.2} fill={on?'#C9A961':'none'}/></button>
<button onClick={()=>add(p.id)} className="label absolute left-0 right-0 bottom-[4.5rem] mx-3 bg-ink/90 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 focus:opacity-100">Quick add</button>
<div className="pt-4"><p className="label text-mute">{p.brand}</p><h3 className="font-serif text-xl mt-1">{p.name}</h3><p className="text-sm mt-1">{inr(p.price)}</p></div></article>}
export const Grid=({items}:any)=><div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">{items.map((p:any)=><ProductCard key={p.id} p={p}/>)}</div>

export function DeliveryCheck(){const [pin,setPin]=useState('');const [msg,setMsg]=useState('')
const go=()=>{if(!/^\d{6}$/.test(pin))return setMsg('Enter a 6-digit pincode.');const d=new Date(Date.now()+4*864e5);setMsg(`Delivered by ${d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}. Complimentary over ₹50,000.`)}
return <div className="mt-6"><p className="label mb-2">Delivery</p><div className="flex gap-3 border-b border-bone"><input value={pin} onChange={e=>setPin(e.target.value)} maxLength={6} placeholder="Pincode" aria-label="Pincode" className="flex-1 bg-transparent py-2 outline-none"/><button onClick={go} className="label">Check</button></div>{msg&&<p className="text-sm text-mute mt-2">{msg}</p>}</div>}
