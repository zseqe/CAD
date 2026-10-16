import {useState,useEffect} from 'react'
import {Link,Outlet,useLocation,useNavigate} from 'react-router-dom'
import {Search,User,ShoppingBag,Menu,Heart,X,Plus,Minus,MapPin,Mail,Instagram,ChevronDown,ChevronRight,Truck,LogOut} from 'lucide-react'
import {motion,AnimatePresence} from 'framer-motion'
import {getDepartments,brandsIn,search,inr} from '../data'
import {lines,FREE_SHIP_OVER} from '../lib/commerce'
import {useApp} from '../lib/store'
import {Logo,Img,More} from './ui'

function MegaMenu({d,close}:any){
return <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.35}} onMouseLeave={close} className="absolute left-0 right-0 top-full border-t border-line mega-menu-desktop" style={{background:'var(--bg-ink)'}}>
<div className="max-w-[1440px] mx-auto px-10 py-8 grid grid-cols-12 gap-10">
<div className="col-span-3"><p className="label text-mute mb-4">Shop {d.name}</p><ul className="space-y-2 text-sm"><li><Link onClick={close} to={`/${d.slug}`}>All {d.name}</Link></li>
{d.subcategories.map((s:any)=><li key={s.id}><Link onClick={close} to={`/products?department=${d.id}&sub=${s.id}`}>{s.name}</Link></li>)}</ul></div>
<div className="col-span-3"><p className="label text-mute mb-4">Featured houses</p><ul className="space-y-2 text-sm">{brandsIn(d.id).map(b=><li key={b.id}><Link onClick={close} to={`/products?department=${d.id}&brand=${b.id}`}>{b.name}</Link></li>)}</ul></div>
<div className="col-span-6 relative"><Img src={d.image} alt={d.name} ratio="aspect-[16/7]"/><div className="absolute bottom-4 left-4"><Link onClick={close} to={`/${d.slug}`} className="label px-4 py-3 inline-block" style={{background:'var(--bg-ink)'}}>Discover {d.name} →</Link></div></div></div></motion.div>}

export function Header(){
const {cart,wish,open,user}=useApp();const [scrolled,setS]=useState(false);const [mega,setMega]=useState<any>(null);const depts=getDepartments()
const [accountDrop,setAccountDrop]=useState(false)
useEffect(()=>{const f=()=>setS(scrollY>40);f();addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[])
const n=cart.reduce((a:number,i:any)=>a+i.qty,0)
const {pathname}=useLocation();const home=pathname==='/';const solid=scrolled||!home||!!mega
const link='text-[11px] tracking-[0.18em] uppercase hover:opacity-60 transition-opacity'
return <header style={{top:home&&!scrolled?36:0}} className={`${home?'fixed inset-x-0':'sticky'} top-0 z-40 transition-all duration-500 ${solid?'backdrop-blur border-b border-line/50':'bg-transparent'}`} onMouseLeave={()=>{setMega(null);setAccountDrop(false)}}
  // eslint-disable-next-line
  {...{style:{top:home&&!scrolled?36:0,background:solid?'rgba(12,9,8,0.95)':'transparent'}}}>
<div className={`max-w-[1440px] mx-auto px-5 md:px-10 flex items-center justify-between transition-all duration-500 ${scrolled?'h-12':'h-16'}`}>
<button className="lg:hidden" aria-label="Open menu" onClick={()=>open('menu')}><Menu size={20} strokeWidth={1.3}/></button>
<Link to="/" aria-label="CAD home" className="lg:static absolute left-1/2 -translate-x-1/2 lg:translate-x-0 text-xl"><Logo/></Link>
<nav aria-label="Primary" className="hidden lg:flex gap-7 absolute left-1/2 -translate-x-1/2 translate-y-0 mt-0">
<Link className={link} to="/new-in" onMouseEnter={()=>setMega(null)}>New In</Link>
{depts.map(d=><Link key={d.id} to={`/${d.slug}`} className={link} onMouseEnter={()=>setMega(d)}>{d.name}</Link>)}
<Link className={link} to="/brands" onMouseEnter={()=>setMega(null)}>The Houses</Link></nav>
<div className="flex items-center gap-3 md:gap-5">
<button aria-label="Search" onClick={()=>open('search')}><Search size={18} strokeWidth={1.3}/></button>

{/* Account */}
<div className="relative hidden md:block" onMouseEnter={()=>setAccountDrop(true)} onMouseLeave={()=>setAccountDrop(false)}>
  <Link to="/account" aria-label="Account" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
    <User size={18} strokeWidth={1.3}/>
    {user && <span className="text-[10px] tracking-wider uppercase hidden lg:block max-w-[80px] truncate">{user.name.split(' ')[0]}</span>}
  </Link>
  <AnimatePresence>
    {accountDrop && <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="absolute right-0 top-full pt-2 z-50">
      <div className="min-w-[180px] py-2 border border-line shadow-xl" style={{background:'var(--bg-ink)'}}>
        {user ? <>
          <div className="px-4 py-2 border-b border-line">
            <p className="text-xs font-medium truncate">{user.name}</p>
            <p className="text-[10px] text-mute truncate">{user.email}</p>
          </div>
          <Link to="/account" className="block px-4 py-2.5 text-xs hover:opacity-70 transition-opacity">My Account</Link>
          <Link to="/account?tab=orders" className="block px-4 py-2.5 text-xs hover:opacity-70 transition-opacity">My Orders</Link>
          <Link to="/wishlist" className="block px-4 py-2.5 text-xs hover:opacity-70 transition-opacity">Wishlist</Link>
        </> : <>
          <Link to="/login" className="block px-4 py-2.5 text-xs hover:opacity-70 transition-opacity">Sign In</Link>
          <Link to="/signup" className="block px-4 py-2.5 text-xs hover:opacity-70 transition-opacity">Create Account</Link>
        </>}
      </div>
    </motion.div>}
  </AnimatePresence>
</div>

<Link aria-label="Wishlist" to="/wishlist" className="hidden md:block relative"><Heart size={18} strokeWidth={1.3}/>{wish.length>0&&<span className="absolute -top-1 -right-2 text-[9px]">{wish.length}</span>}</Link>
<button aria-label="Shopping bag" onClick={()=>open('cart')} className="relative"><ShoppingBag size={18} strokeWidth={1.3}/>{n>0&&<span className="absolute -top-1 -right-2 text-[9px]">{n}</span>}</button></div></div>
<AnimatePresence>{mega&&<MegaMenu key={mega.id} d={mega} close={()=>setMega(null)}/>}</AnimatePresence></header>}

function MobileMenu(){
const {ui,open,user,logoutUser}=useApp();const depts=getDepartments();const close=()=>open('menu',false);const nav=useNavigate()
return <AnimatePresence>{ui.menu&&<motion.div initial={{x:'-100%'}} animate={{x:0}} exit={{x:'-100%'}} transition={{duration:.5,ease:[.4,0,.2,1]}} className="fixed inset-0 z-50 overflow-auto" style={{background:'var(--bg-ink)'}}>
<div className="p-6">
<div className="flex justify-between items-center mb-12"><Logo className="text-2xl"/><button aria-label="Close menu" onClick={close}><X/></button></div>
<ul className="font-serif text-4xl space-y-5" onClick={close}><li><Link to="/new-in">New In</Link></li>{depts.map(d=><li key={d.id}><Link to={`/${d.slug}`}>{d.name}</Link></li>)}<li><Link to="/brands">The Houses</Link></li></ul>

<div className="mt-10 pt-6 border-t border-line">
  {user ? (
    <div className="space-y-3">
      <div className="mb-4"><p className="font-serif text-xl">{user.name}</p><p className="text-sm text-mute">{user.email}</p></div>
      <ul className="label space-y-4" onClick={close}>
        <li><Link to="/account">My Account</Link></li>
        <li><Link to="/account?tab=orders">My Orders</Link></li>
        <li><Link to="/wishlist">Wishlist</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><button onClick={()=>{logoutUser();close()}} className="flex items-center gap-2 text-mute hover:text-bone transition-colors"><LogOut size={12}/>Sign Out</button></li>
      </ul>
    </div>
  ) : (
    <ul className="label space-y-4">
      <li><button onClick={()=>{close();nav('/login')}} className="flex items-center gap-2"><User size={14}/>Sign In</button></li>
      <li><button onClick={()=>{close();nav('/signup')}}>Create Account</button></li>
      <li onClick={close}><Link to="/wishlist">Wishlist</Link></li>
      <li onClick={close}><Link to="/contact">Contact</Link></li>
    </ul>
  )}
</div>
</div></motion.div>}</AnimatePresence>}

function SearchOverlay(){
const {ui,open}=useApp();const [q,setQ]=useState('');const r=search(q);const close=()=>{open('search',false);setQ('')}
return <AnimatePresence>{ui.search&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 overflow-auto" role="dialog" aria-label="Search" style={{background:'var(--bg-ink)'}}>
<div className="max-w-5xl mx-auto px-6 py-10"><div className="flex justify-end"><button aria-label="Close search" onClick={close}><X/></button></div>
<p className="label text-mute mt-8">What are you looking for?</p>
<input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="w-full bg-transparent border-b font-serif text-5xl search-input-mobile py-4 outline-none placeholder:opacity-30" style={{borderColor:'var(--text-bone)'}}/>
{!q&&<div className="mt-8 flex flex-wrap gap-3">{['Gucci','Dior','Bags','Perfumes','New Arrivals'].map(t=><button key={t} onClick={()=>t==='New Arrivals'?(location.href='/new-in'):setQ(t)} className="label border border-line px-4 py-2 hover:bg-line transition-colors">{t}</button>)}</div>}
<ul className="mt-8 divide-y divide-line">{r.map(p=><li key={p.id}><Link onClick={close} to={`/product/${p.slug}`} className="flex gap-5 py-4 items-center"><Img src={p.images[0]} alt={p.name} className="w-16" ratio="aspect-[4/5]"/><div><p className="label text-mute">{p.brand}</p><p className="font-serif text-2xl">{p.name}</p></div><span className="ml-auto text-sm">{inr(p.price)}</span></Link></li>)}</ul>
{q&&!r.length&&<p className="mt-8 text-mute">No results for "{q}". Try a brand or department.</p>}</div></motion.div>}</AnimatePresence>}

function CartDrawer(){
const {ui,open,cart,remove,setQty}=useApp()
const items=lines(cart)
const sub=items.reduce((a:number,i:any)=>a+i.p.price*i.qty,0)
const close=()=>open('cart',false)
const left=Math.max(0,FREE_SHIP_OVER-sub)
const pct=Math.min(100,sub/FREE_SHIP_OVER*100)
return <AnimatePresence>{ui.cart&&<>
  <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"/>
  <motion.aside initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{duration:.55,ease:[.4,0,.2,1]}}
    className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-[480px] flex flex-col shadow-2xl border-l border-white/5"
    style={{background:'#0E0D0C'}}
    aria-label="Shopping bag">
    <div className="flex items-start justify-between px-6 sm:px-8 py-7 border-b" style={{borderColor:'rgba(255,255,255,0.08)'}}>
      <div>
        <h2 className="font-serif text-3xl tracking-tight">Shopping Bag</h2>
        <p className="label text-mute text-[10px] tracking-[0.2em] mt-1">{items.length} {items.length===1?'ITEM':'ITEMS'}</p>
      </div>
      <button aria-label="Close bag" onClick={close} className="mt-1 w-8 h-8 flex items-center justify-center border border-line hover:opacity-70 transition-opacity">
        <X size={14} strokeWidth={1.5}/>
      </button>
    </div>
    {items.length>0&&<div className="px-6 sm:px-8 py-4 border-b" style={{background:'rgba(255,255,255,0.02)',borderColor:'rgba(255,255,255,0.05)'}}>
      <div className="flex items-center gap-2 mb-2.5">
        <Truck size={12} className={left===0?'text-gold':'text-mute'} strokeWidth={1.5}/>
        <p className="label text-[10px] tracking-widest">
          {left===0?<span className="text-gold">Complimentary delivery unlocked</span>:<span className="text-mute">{inr(left)} more for free delivery</span>}
        </p>
      </div>
      <div className="h-px" style={{background:'rgba(255,255,255,0.1)'}}>
        <motion.div className="h-px" style={{background:'var(--gold)'}} animate={{width:`${pct}%`}} transition={{duration:.7,ease:'easeOut'}}/>
      </div>
    </div>}
    <div className="flex-1 overflow-y-auto overscroll-contain">
      {!items.length&&<div className="flex flex-col items-center justify-center h-full text-center px-8 py-20">
        <ShoppingBag size={48} strokeWidth={0.7} className="opacity-20 mb-6"/>
        <p className="font-serif text-3xl">Your bag is empty</p>
        <p className="text-mute text-sm mt-3 max-w-xs leading-relaxed">Discover exceptional pieces from the world's most distinctive houses.</p>
        <button onClick={close} className="btn btn-solid mt-8 text-xs tracking-widest px-8">Explore collection</button>
      </div>}
      <AnimatePresence initial={false}>
        {items.map((i:any)=><motion.div layout key={i.id}
          initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,x:60,transition:{duration:.25}}}
          className="flex gap-4 sm:gap-5 px-6 sm:px-8 py-6 group border-b transition-colors" style={{borderColor:'rgba(255,255,255,0.05)'}}>
          <Link to={`/product/${i.p.slug}`} onClick={close} className="shrink-0 w-20 sm:w-28 overflow-hidden block" style={{background:'rgba(12,9,8,0.3)'}}>
            <Img src={i.p.images[0]} alt={i.p.name} ratio="aspect-[3/4]" className="transition-transform duration-700 group-hover:scale-105"/>
          </Link>
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="label text-gold text-[9px] tracking-[0.25em] mb-1">{i.p.brand.toUpperCase()}</p>
                  <Link to={`/product/${i.p.slug}`} onClick={close}>
                    <p className="font-serif text-lg sm:text-xl leading-snug hover:opacity-60 transition-opacity">{i.p.name}</p>
                  </Link>
                </div>
                <button aria-label="Remove item" onClick={()=>remove(i.id)}
                  className="shrink-0 p-1 text-mute hover:text-bone transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100">
                  <X size={13} strokeWidth={1.5}/>
                </button>
              </div>
              {i.color&&<p className="text-xs text-mute mt-1.5">{i.color}</p>}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center border border-line">
                <button aria-label="Decrease quantity" onClick={()=>setQty(i.id,i.qty-1)}
                  className="w-8 h-8 flex items-center justify-center text-mute hover:text-bone transition-colors">
                  <Minus size={11} strokeWidth={2}/>
                </button>
                <span className="label text-xs w-7 text-center tabular-nums">{i.qty}</span>
                <button aria-label="Increase quantity" onClick={()=>setQty(i.id,i.qty+1)}
                  className="w-8 h-8 flex items-center justify-center text-mute hover:text-bone transition-colors">
                  <Plus size={11} strokeWidth={2}/>
                </button>
              </div>
              <span className="font-serif text-lg sm:text-xl">{inr(i.p.price*i.qty)}</span>
            </div>
          </div>
        </motion.div>)}
      </AnimatePresence>
    </div>
    {items.length>0&&<div className="border-t" style={{borderColor:'rgba(255,255,255,0.08)'}}>
      <div className="px-6 sm:px-8 pt-6 pb-3">
        <div className="flex justify-between items-baseline mb-1">
          <span className="label text-mute text-[10px] tracking-widest">SUBTOTAL</span>
          <span className="font-serif text-2xl">{inr(sub)}</span>
        </div>
        <p className="label text-mute text-[10px]">Taxes &amp; delivery calculated at checkout</p>
      </div>
      <div className="px-6 sm:px-8 pb-8 pt-3 space-y-2.5">
        <Link to="/checkout" onClick={close}
          className="btn btn-solid w-full justify-center text-xs tracking-[0.18em] flex items-center gap-2 py-4">
          PROCEED TO CHECKOUT <ChevronRight size={13} strokeWidth={1.5}/>
        </Link>
        <button onClick={close} className="btn w-full justify-center text-xs tracking-widest text-mute hover:text-bone py-3">
          CONTINUE SHOPPING
        </button>
      </div>
    </div>}
  </motion.aside>
</>}</AnimatePresence>}

function Concierge(){
const {ui,open}=useApp();const nav=useNavigate();const go=(to:string)=>{open('concierge',false);nav(to)}
const opts=[['Find a fragrance','/perfumes'],['Find a gift','/new-in'],['Find a handbag','/bags'],['Find something under ₹50,000','/products?max=50000'],['Speak to a stylist','/contact']]
return <div className="fixed bottom-5 right-5 z-30">
<AnimatePresence>{ui.concierge&&<motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="border border-bone mb-3 w-72 p-5" style={{background:'var(--bg-ink)'}}><p className="font-serif text-2xl mb-3">How may we help?</p>
{opts.map(([l,t])=><button key={l} onClick={()=>go(t)} className="label block w-full text-left py-3 border-t border-line hover:pl-2 transition-all">{l}</button>)}</motion.div>}</AnimatePresence>
<button onClick={()=>open('concierge',!ui.concierge)} aria-expanded={ui.concierge} className="label px-5 py-3 sm:px-6 sm:py-4 flex items-center gap-2 text-[9px] sm:text-[10.5px]" style={{background:'var(--gold)',color:'#0C0908'}}>CAD Concierge <ChevronDown size={14}/></button></div>}

export function Footer(){
const col=(t:string,l:[string,string][])=><div><p className="label mb-5" style={{color:'var(--gold)'}}>{t}</p><ul className="space-y-3 text-sm">{l.map(([n,h])=><li key={n}><Link className="hover:opacity-70 transition-opacity" to={h}>{n}</Link></li>)}</ul></div>
const [nlEmail,setNlEmail]=useState('')
const [nlMsg,setNlMsg]=useState('')
const handleNl=(e:any)=>{e.preventDefault();if(!/^\S+@\S+\.\S+$/.test(nlEmail)){setNlMsg('Please enter a valid email.');return}setNlMsg('Thank you! You\'ve joined the CAD world.');setNlEmail('')}

return <footer className="mt-32" style={{background:'var(--bg-panel)'}}>
<div className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 md:py-20 grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12 footer-grid">
<div className="col-span-2 footer-brand"><Logo className="text-4xl"/><p className="font-serif text-xl md:text-2xl mt-6">Curated luxury. Without compromise.</p>
  {/* Newsletter */}
  <form onSubmit={handleNl} className="mt-6 flex border-b" style={{borderColor:'var(--text-bone)'}}>
    <label className="sr-only" htmlFor="footer-nl">Email</label>
    <input id="footer-nl" type="email" value={nlEmail} onChange={e=>setNlEmail(e.target.value)} placeholder="Email address" className="flex-1 bg-transparent py-3 outline-none text-sm placeholder:opacity-40"/>
    <button type="submit" className="label text-xs">Join CAD</button>
  </form>
  {nlMsg&&<p className="text-xs mt-2" style={{color:nlMsg.includes('Thank')?'var(--gold)':'#f87171'}}>{nlMsg}</p>}
</div>
{col('Shop',[['New In','/new-in'],['Watches','/watches'],['Clothing','/clothing'],['Bags','/bags'],['Perfumes','/perfumes']])}
{col('The World of CAD',[['About','/about'],['The Houses','/brands'],['Contact Us','/contact']])}
{col('Client Services',[['Account','/account'],['Shipping & Delivery','/shipping'],['Returns & Refunds','/returns'],['FAQ','/faq'],['Authenticity','/about']])}
{col('Legal',[['Privacy Policy','/privacy'],['Terms & Conditions','/terms'],['Cookies','/privacy']])}</div>

{/* Social & bottom bar */}
<div className="border-t px-6 md:px-10 py-6 flex flex-wrap gap-4 justify-between items-center label" style={{borderColor:'var(--line)',opacity:0.7}}>
<span>© 2026 CAD</span>
<span className="flex gap-5 items-center">
  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"><Instagram size={14}/>Instagram</a>
  <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">Pinterest</a>
</span>
<span>India | INR</span></div></footer>}

export default function Layout(){
const {pathname}=useLocation();useEffect(()=>{scrollTo(0,0)},[pathname])
return <><div className="label text-center py-2.5" style={{background:'var(--bg-panel)'}}>Complimentary insured delivery across India</div>
<Header/><AnimatePresence mode="wait"><motion.main key={pathname} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.6}}><Outlet/></motion.main></AnimatePresence>
<Footer/><MobileMenu/><SearchOverlay/><CartDrawer/><Concierge/></>}
