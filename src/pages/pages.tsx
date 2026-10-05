import {useState,useEffect,useRef} from 'react'
import {Link,useParams,useSearchParams} from 'react-router-dom'
import {motion,AnimatePresence,useScroll,useTransform} from 'framer-motion'
import {SlidersHorizontal,Plus,Minus,Mail,MapPin,ChevronRight} from 'lucide-react'
import {getProducts,getProduct,getBrands,getBrand,getDepartments,brandsIn,deptsOf,related,slug,inr,campaigns,services} from '../data'
import {Img,More,Grid,Logo,ProductCard as ProductCardLazy,DeliveryCheck} from '../components/ui'
import {orders} from '../lib/commerce'
import {useApp} from '../lib/store'

const Wrap=({children,className=''}:any)=><div className={`max-w-[1440px] mx-auto px-5 md:px-10 ${className}`}>{children}</div>
const Title=({children,sub}:any)=><div className="mb-10"><h2 className="font-serif text-4xl md:text-6xl">{children}</h2>{sub&&<p className="text-mute mt-3 max-w-xl">{sub}</p>}</div>
const PageHero=({title,text,image}:any)=><section className="relative h-[60vh] min-h-[420px] overflow-hidden"><Img src={image} alt={title} ratio="h-full absolute inset-0"/><div className="absolute inset-0 bg-black/40"/><Wrap className="relative h-full flex flex-col justify-end pb-14 text-bone"><h1 className="font-serif text-6xl md:text-8xl">{title}</h1><p className="mt-3 max-w-lg text-lg">{text}</p></Wrap></section>

function Hero(){
const [i,setI]=useState(0);const ref=useRef(null);const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});const y=useTransform(scrollYProgress,[0,1],['0%','18%'])
useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%campaigns.length),7000);return()=>clearInterval(t)},[]);const c=campaigns[i]
return <section ref={ref} className="relative h-[92vh] min-h-[560px] overflow-hidden text-bone bg-bone"><AnimatePresence mode="sync">
<motion.div key={c.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1.8}} style={{y}} className="absolute inset-0"><motion.div initial={{scale:1}} animate={{scale:1.08}} transition={{duration:9,ease:'linear'}} className="h-full"><Img src={c.image} alt={c.title} ratio="h-[115%]"/></motion.div></motion.div></AnimatePresence>
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"/>
<Wrap className="relative h-full flex flex-col justify-end pb-16"><AnimatePresence mode="wait"><motion.div key={c.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:1}}>
<p className="label">{c.category}</p><h1 className="font-serif text-5xl md:text-8xl max-w-4xl mt-3 leading-[1.02]">{c.title}</h1><p className="mt-4 text-lg max-w-md">{c.text}</p>
<Link to={c.link} className="btn mt-8 border-bone hover:bg-bone hover:text-ink">{c.cta}</Link></motion.div></AnimatePresence>
<div className="flex gap-2 mt-10">{campaigns.map((x,n)=><button key={x.id} aria-label={`Slide ${n+1}`} onClick={()=>setI(n)} className={`h-px transition-all duration-700 ${n===i?'w-14 bg-ink':'w-6 bg-ink/50'}`}/>)}</div></Wrap></section>}

export function Home(){
const ps=getProducts(),depts=getDepartments(),hs=getBrands(),[hov,setHov]=useState<any>(null)
const fresh=ps.filter(p=>p.newArrival)
return <>
<Hero/>
<Wrap className="mt-28"><Title sub="Discover what has just arrived at CAD.">New Arrivals</Title>
<div className="flex gap-5 overflow-x-auto noscroll snap-x pb-4">{fresh.map(p=><div key={p.id} className="snap-start shrink-0 w-[60vw] md:w-[22vw]"><ProductCardLazy p={p}/></div>)}</div></Wrap>
<Wrap className="mt-32"><Title>The Four Worlds of CAD</Title>
<div className="grid md:grid-cols-12 gap-4 md:gap-6">{depts.map((d,n)=><Link key={d.id} to={`/${d.slug}`} className={`group relative overflow-hidden ${[ 'md:col-span-7','md:col-span-5 md:mt-16','md:col-span-5','md:col-span-7 md:mt-16'][n]}`}>
<Img src={d.image} alt={d.name} ratio="aspect-[4/3] md:aspect-[5/4]" className="transition-transform duration-[1600ms] group-hover:scale-105"/><div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-700"/>
<div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-bone"><h3 className="font-serif text-4xl md:text-6xl">{d.name}</h3><p className="mt-1">{d.tagline}</p><span className="label mt-4 inline-block border-b border-bone pb-1">Explore →</span></div></Link>)}</div></Wrap>
<section className="mt-32 bg-panel py-24"><Wrap><Title>The Houses</Title><div className="grid md:grid-cols-2 gap-10 items-center">
<ul>{hs.map(b=><li key={b.id} onMouseEnter={()=>setHov(b)}><Link to={`/brands/${b.id}`} className="block font-serif text-4xl md:text-6xl py-2 border-b border-line hover:pl-4 transition-all duration-500">{b.name}</Link></li>)}</ul>
<div className="hidden md:block sticky top-28"><Img src={(hov||hs[0]).heroImage} alt={(hov||hs[0]).name} ratio="aspect-[4/5]"/><div className="mt-4"><More to={`/brands/${(hov||hs[0]).id}`}>Discover house</More></div></div></div></Wrap></section>
<section className="mt-32 relative h-[80vh] overflow-hidden text-bone"><Img src="/images/editorial/fragrance-campaign.webp" alt="Fragrance campaign" ratio="h-full absolute inset-0"/><div className="absolute inset-0 bg-black/45"/><Wrap className="relative h-full flex flex-col justify-center max-w-3xl"><p className="label">Perfumes</p><h2 className="font-serif text-5xl md:text-7xl mt-3">The scent is the signature.</h2><div className="mt-8"><Link to="/perfumes" className="btn border-bone hover:bg-bone hover:text-ink">Discover perfumes</Link></div></Wrap></section>
<Wrap className="mt-32"><Title>The CAD Experience</Title><div className="grid md:grid-cols-3 gap-px bg-line">{services.map(([t,d])=><div key={t} className="bg-ink p-8 md:p-10"><h3 className="font-serif text-3xl">{t}</h3><p className="text-mute mt-2">{d}</p></div>)}</div></Wrap>
<section className="mt-32 bg-panel text-bone py-24 text-center"><Wrap><h2 className="font-serif text-5xl md:text-7xl">Enter the world of CAD</h2><p className="mt-4 max-w-md mx-auto">Be the first to discover new arrivals, private edits and exceptional pieces.</p>
<form onSubmit={e=>e.preventDefault()} className="mt-8 flex max-w-md mx-auto border-b border-bone"><label className="sr-only" htmlFor="nl">Email</label><input id="nl" type="email" required placeholder="Email address" className="flex-1 bg-transparent py-3 outline-none placeholder:text-bone/50"/><button className="label">Join CAD</button></form>
<div className="mt-20"><p className="font-serif text-3xl">Private Client Services</p><p className="text-bone/70 mt-2">For those seeking something exceptional.</p><div className="mt-5"><Link to="/contact" className="label border-b border-bone pb-1">Discover private client →</Link></div></div></Wrap></section></>}



const sortFns:any={featured:()=>0,low:(a:any,b:any)=>a.price-b.price,high:(a:any,b:any)=>b.price-a.price,new:(a:any,b:any)=>+!!b.newArrival-+!!a.newArrival}
export function Listing({fixed={},title,text}:any){
const [sp,setSp]=useSearchParams();const [show,setShow]=useState(false);const [sort,setSort]=useState('featured')
const f:any={...Object.fromEntries(sp),...fixed}
let items=getProducts().filter(p=>(!f.department||p.department===f.department)&&(!f.brand||slug(p.brand)===f.brand)&&(!f.sub||p.subcategory===f.sub)&&(!f.material||p.material===f.material)&&(!f.gender||p.gender===f.gender)&&(!f.color||p.colors.includes(f.color))&&(!f.max||p.price<=+f.max)).sort(sortFns[sort])
const pool=getProducts().filter(p=>!f.department||p.department===f.department)
const facets=[['brand','Brand',[...new Set(pool.map(p=>slug(p.brand)))],(v:string)=>getBrand(v)?.name||v],['gender','Gender',[...new Set(pool.map(p=>p.gender).filter(Boolean))],(v:string)=>v],['material','Material',[...new Set(pool.map(p=>p.material).filter(Boolean))],(v:string)=>v],['color','Color',[...new Set(pool.flatMap(p=>p.colors))],(v:string)=>v]] as any[]
const set=(k:string,v:string)=>{const n=new URLSearchParams(sp);n.get(k)===v||!v?n.delete(k):n.set(k,v);setSp(n)}
return <Wrap className="py-10"><div className="flex items-end justify-between border-b border-line pb-4 mb-8"><div><h1 className="font-serif text-5xl">{title||'All pieces'}</h1>{text&&<p className="text-mute mt-2 max-w-md">{text}</p>}<p className="label text-mute mt-3">{items.length} pieces</p></div>
<div className="flex items-center gap-6 label"><button onClick={()=>setShow(!show)} aria-expanded={show} className="flex items-center gap-2"><SlidersHorizontal size={14}/>Filter</button>
<label className="flex items-center gap-2">Sort<select value={sort} onChange={e=>setSort(e.target.value)} className="bg-transparent normal-case tracking-normal"><option value="featured">Featured</option><option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div></div>
<AnimatePresence>{show&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8">{facets.filter(x=>x[2].length>1&&!fixed[x[0]]).map(([k,l,vals,fmt])=><div key={k}><p className="label text-mute mb-3">{l}</p>{vals.map((v:string)=><button key={v} onClick={()=>set(k,v)} className={`block text-sm py-1 ${f[k]===v?'underline':''}`}>{fmt(v)}</button>)}</div>)}
<div><p className="label text-mute mb-3">Price</p>{[50000,150000,500000].map(m=><button key={m} onClick={()=>set('max',String(m))} className={`block text-sm py-1 ${f.max==m?'underline':''}`}>Up to {inr(m)}</button>)}</div></div></motion.div>}</AnimatePresence>
{items.length?<Grid items={items}/>:<p className="text-mute py-20">No pieces match these filters. Clear a filter to see more.</p>}</Wrap>}

export function NewIn(){const items=getProducts().filter(p=>p.newArrival);return <Wrap className="py-16"><Title sub="Discover what has just arrived at CAD.">New Arrivals</Title><Grid items={items}/></Wrap>}

export function Department({dept}:any){
const ps=getProducts().filter(p=>p.department===dept.id)
return <><PageHero title={dept.name} text={dept.tagline} image={dept.image}/>
<Wrap className="mt-12"><div className="flex gap-6 overflow-x-auto noscroll label whitespace-nowrap border-b border-line pb-4"><Link to={`/${dept.slug}`}>All {dept.name}</Link>{dept.subcategories.filter((s:any)=>ps.some(p=>p.subcategory===s.id)).map((s:any)=><Link key={s.id} className="text-mute hover:text-bone" to={`/products?department=${dept.id}&sub=${s.id}`}>{s.name}</Link>)}</div>
<div className="mt-14"><p className="label text-mute mb-4">Featured houses</p><div className="flex flex-wrap gap-x-10 gap-y-2 font-serif text-3xl">{brandsIn(dept.id).map(b=><Link key={b.id} to={`/products?department=${dept.id}&brand=${b.id}`} className="hover:opacity-60">{b.name}</Link>)}</div></div></Wrap>
<Listing fixed={{department:dept.id}} title={`New ${dept.name}`} text={dept.blurb}/></>}

export function Houses(){return <Wrap className="py-16"><Title sub="Seven houses, one curated destination.">The Houses</Title><ul>{getBrands().map(b=><li key={b.id} className="border-b border-line"><Link to={`/brands/${b.id}`} className="flex justify-between items-baseline py-6 group"><span className="font-serif text-5xl md:text-7xl group-hover:pl-4 transition-all duration-500">{b.name}</span><span className="label hidden md:block">Discover house →</span></Link></li>)}</ul></Wrap>}

export function BrandPage(){
const {id}=useParams();const b=getBrand(id!);if(!b)return <Wrap className="py-24"><p>House not found.</p></Wrap>
const ds=deptsOf(b.id)
return <><PageHero title={b.name} text={b.description} image={b.heroImage}/>
<Wrap className="mt-12"><p className="label text-mute mb-4">Available at CAD</p><div className="flex flex-wrap gap-x-10 font-serif text-4xl">{ds.map(d=><Link key={d.id} to={`/products?department=${d.id}&brand=${b.id}`}>{d.name}</Link>)}</div></Wrap>
<Listing fixed={{brand:b.id}} title={`New from ${b.name}`}/></>}

export function ProductPage(){
  const {slug:s}=useParams();const p=getProduct(s!);const {add,toggle,wish,view}=useApp()
  const [color,setC]=useState('');const [size,setSz]=useState('');const [qty,setQ]=useState(1)
  const [active,setAct]=useState(0);const [openS,setO]=useState('Description');const [added,setAdded]=useState(false)
  useEffect(()=>{p&&view(p.id)},[p?.id]);if(!p)return <Wrap className="py-24"><p>Product not found.</p></Wrap>
  const info:any={
    Description:p.description,
    Details:`${p.material?`Material: ${p.material}. `:''}${p.colors.length?`Colour: ${p.colors.join(', ')}.`:''}` ||'Details to follow.',
    Shipping:'Complimentary insured delivery across India. Dispatched within 2 business days with full tracking.',
    Returns:'Returns accepted within 14 days in original, unworn condition with all packaging.',
    Authenticity:'Every piece at CAD is authenticated by our specialists before dispatch. Certificate of authenticity included.'
  }
  const handleAdd=()=>{add(p.id,qty);setAdded(true);setTimeout(()=>setAdded(false),2500)}
  const wished=wish.includes(p.id)
  return (
    <div className="min-h-screen">
      <Wrap className="pt-8 pb-0">
        <nav className="label text-mute text-[10px] tracking-widest flex items-center gap-2">
          <Link to="/" className="hover:text-bone transition-colors">Home</Link>
          <ChevronRight size={10}/>
          <Link to={`/${p.department}`} className="hover:text-bone transition-colors capitalize">{p.department}</Link>
          <ChevronRight size={10}/>
          <span className="text-bone">{p.name}</span>
        </nav>
      </Wrap>
      <Wrap className="py-10">
        <div className="grid md:grid-cols-12 gap-6 lg:gap-14">
          <div className="md:col-span-7 lg:col-span-7">
            <div className="relative bg-stone-950 overflow-hidden group cursor-zoom-in">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.5}}>
                  <Img src={p.images[active]} alt={`${p.brand} ${p.name}`} ratio="aspect-[4/5]" className="transition-transform duration-[2000ms] group-hover:scale-105"/>
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-5 left-5"><span className="label text-bone/60 text-[9px] tracking-[0.3em] bg-ink/20 backdrop-blur-sm px-3 py-1.5">{p.brand.toUpperCase()}</span></div>
              {p.newArrival&&<div className="absolute top-5 right-5"><span className="label text-ink text-[9px] tracking-widest bg-gold px-3 py-1.5">New Arrival</span></div>}
            </div>
            {p.images.length>1&&<div className="flex gap-2 mt-3">
              {p.images.map((im:string,n:number)=><button key={n} onClick={()=>setAct(n)} aria-label={`View image ${n+1}`}
                className={`relative w-16 aspect-[3/4] overflow-hidden bg-stone-950 border-b-2 transition-all duration-300 ${active===n?'border-bone opacity-100':'border-transparent opacity-50 hover:opacity-80'}`}>
                <Img src={im} alt="" ratio="h-full absolute inset-0"/>
              </button>)}
            </div>}
          </div>
          <div className="md:col-span-5 lg:col-span-5">
            <div className="md:sticky md:top-24 space-y-0">
              <Link to={`/brands/${slug(p.brand)}`} className="label text-gold text-[10px] tracking-[0.3em] hover:opacity-70 transition-opacity">{p.brand.toUpperCase()}</Link>
              <h1 className="font-serif text-4xl lg:text-5xl mt-2 leading-[1.1]">{p.name}</h1>
              <div className="mt-5 flex items-baseline gap-4">
                <span className="font-serif text-3xl">{inr(p.price)}</span>
                <span className="label text-mute text-[10px]">Incl. GST</span>
              </div>
              <p className="mt-5 text-mute text-sm leading-relaxed border-t border-line/40 pt-5">{p.description}</p>
              {p.colors.length>0&&<div className="mt-6">
                <div className="flex items-center justify-between mb-3"><p className="label text-xs tracking-widest">Colour</p><span className="label text-mute text-xs">{color||p.colors[0]}</span></div>
                <div className="flex gap-2 flex-wrap">{p.colors.map((c:string)=><button key={c} onClick={()=>setC(c)}
                  className={`label text-xs px-4 py-2.5 border transition-all duration-300 ${(color||p.colors[0])===c?'border-bone bg-bone text-ink':'border-line hover:border-bone/50'}`}>{c}</button>)}
                </div>
              </div>}
              {p.sizes.length>0&&<div className="mt-6">
                <div className="flex items-center justify-between mb-3"><p className="label text-xs tracking-widest">Size</p><button className="label text-mute text-xs underline underline-offset-2">Size guide</button></div>
                <div className="flex gap-2 flex-wrap">{p.sizes.map((sz:string)=><button key={sz} onClick={()=>setSz(sz)}
                  className={`label text-xs w-12 h-12 border transition-all duration-300 ${size===sz?'border-bone bg-bone text-ink':'border-line hover:border-bone/50'}`}>{sz}</button>)}
                </div>
              </div>}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-4 border border-line/40 w-fit px-4 py-2">
                  <button aria-label="Decrease" onClick={()=>setQ(Math.max(1,qty-1))} className="text-mute hover:text-bone transition-colors w-6 text-center"><Minus size={14}/></button>
                  <span className="label text-sm w-4 text-center">{qty}</span>
                  <button aria-label="Increase" onClick={()=>setQ(qty+1)} className="text-mute hover:text-bone transition-colors w-6 text-center"><Plus size={14}/></button>
                </div>
                <button onClick={handleAdd} className={`btn btn-solid w-full justify-center text-sm transition-all duration-500 ${added?'bg-green-900/80 border-green-900':''}`}>
                  {added?'✓ Added to bag':'Add to bag'}
                </button>
                <button onClick={()=>toggle(p.id)} className={`btn w-full justify-center text-sm transition-all duration-300 ${wished?'border-bone/60':'border-line'}`}>
                  {wished?'Saved to wishlist':'Save to wishlist'}
                </button>
              </div>
              <DeliveryCheck/>
              <div className="mt-8 border-t border-line/40">
                {Object.keys(info).map(k=><div key={k} className="border-b border-line/40">
                  <button onClick={()=>setO(openS===k?'':k)} aria-expanded={openS===k}
                    className="label w-full flex justify-between items-center py-4 text-xs tracking-widest hover:text-gold transition-colors">
                    {k}<motion.span animate={{rotate:openS===k?45:0}} transition={{duration:.2}} className="block"><Plus size={13}/></motion.span>
                  </button>
                  <AnimatePresence>{openS===k&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.25}} className="overflow-hidden">
                    <p className="pb-5 text-mute text-sm leading-relaxed">{info[k]}</p>
                  </motion.div>}</AnimatePresence>
                </div>)}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-28">
          <div className="mb-10 border-t border-line/40 pt-10 flex items-baseline justify-between">
            <h2 className="font-serif text-4xl md:text-5xl">You may also like</h2>
            <Link to={`/${p.department}`} className="label text-mute text-xs tracking-widest hover:text-bone transition-colors hidden md:block">View all {p.department} →</Link>
          </div>
          <Grid items={related(p)}/>
        </div>
      </Wrap>
    </div>
  )}

export function Wishlist(){const {wish}=useApp();const items=wish.map((i:string)=>getProduct(i)).filter(Boolean)
return <Wrap className="py-16"><Title>My Wishlist</Title>{items.length?<Grid items={items}/>:<div className="py-16"><p className="font-serif text-4xl">Your collection is waiting.</p><div className="mt-6"><More to="/new-in">Explore new arrivals</More></div></div>}</Wrap>}

export function Account(){const tabs=['Orders','Wishlist','Personal Information','Addresses','Payment Methods','Recently Viewed'];const [t,setT]=useState(tabs[0]);const {recent}=useApp();const os=orders.list();const rv=recent.map((i:string)=>getProduct(i)).filter(Boolean)
return <Wrap className="py-16"><Title>My Account</Title><div className="grid md:grid-cols-4 gap-10"><ul className="space-y-3">{tabs.map(x=><li key={x}><button onClick={()=>setT(x)} className={`label ${t===x?'border-b border-bone':'text-mute'}`}>{x}</button></li>)}</ul>
<div className="md:col-span-3"><h2 className="font-serif text-3xl mb-4">{t}</h2>
{t==='Orders'&&(os.length?<ul className="divide-y divide-line">{os.map(o=><li key={o.id}><Link to={`/order/${o.id}`} className="flex justify-between py-4"><span>{o.id}<span className="text-mute"> · {new Date(o.createdAt).toLocaleDateString('en-IN')}</span></span><span>{inr(o.totals.total)}</span></Link></li>)}</ul>:<p className="text-mute">No orders yet. Your first order will appear here.</p>)}
{t==='Recently Viewed'&&(rv.length?<Grid items={rv}/>:<p className="text-mute">Nothing viewed yet.</p>)}
{t==='Wishlist'&&<More to="/wishlist">View wishlist</More>}
{!['Orders','Recently Viewed','Wishlist'].includes(t)&&<p className="text-mute">Sign in to manage your {t.toLowerCase()}.</p>}</div></div></Wrap>}

export function About(){
const sec=[['Curation','Four worlds, seven houses, nothing superfluous.'],['Craftsmanship','We choose pieces for how they are made.'],['Authenticity','Every item is verified before it reaches you.']]
return <><PageHero title="The World of CAD" text="A curated destination for luxury fashion, timepieces, bags and fragrance." image="/images/editorial/about.jpg"/>
<Wrap className="py-24 grid md:grid-cols-3 gap-12">{sec.map(([t,d])=><div key={t}><h2 className="font-serif text-4xl">{t}</h2><p className="text-mute mt-3">{d}</p></div>)}</Wrap>
<Wrap><Img src="/images/editorial/about-02.jpg" alt="CAD atelier" ratio="aspect-[21/9]"/></Wrap></>}

export function Contact(){const [sent,setSent]=useState(false);const inp='w-full bg-transparent border-b border-bone py-3 outline-none'
return <Wrap className="py-16 grid md:grid-cols-2 gap-16"><div><Title>Contact CAD</Title><ul className="space-y-4"><li className="flex gap-3"><Mail size={16}/>care@cad.example</li><li>Customer Care: +91 00000 00000</li><li className="flex gap-3"><MapPin size={16}/>Store information to follow</li><li>Instagram · Pinterest</li></ul></div>
<form onSubmit={e=>{e.preventDefault();setSent(true)}} className="space-y-6">{['Name','Email','Subject'].map(l=><div key={l}><label className="label text-mute">{l}</label><input required className={inp}/></div>)}<div><label className="label text-mute">Message</label><textarea required rows={4} className={inp}/></div><button className="btn btn-solid">Send enquiry</button>{sent&&<p role="status">Thank you. Our team will reply within one business day.</p>}</form></Wrap>}
