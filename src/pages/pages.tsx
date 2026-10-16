import {useState,useEffect,useRef} from 'react'
import {Link,useParams,useSearchParams,useNavigate} from 'react-router-dom'
import {motion,AnimatePresence,useScroll,useTransform} from 'framer-motion'
import {SlidersHorizontal,Plus,Minus,Mail,MapPin,ChevronRight,User,Package,MapPinned,LogOut,Eye,Clock,Edit3,Trash2,Check,X,Save} from 'lucide-react'
import {getProducts,getProduct,getBrands,getBrand,getDepartments,brandsIn,deptsOf,related,slug,inr,campaigns,services} from '../data'
import {Img,More,Grid,Logo,ProductCard as ProductCardLazy,DeliveryCheck} from '../components/ui'
import {orders} from '../lib/commerce'
import {useApp} from '../lib/store'
import {currentUser,updateProfile,getAddresses,saveAddress,removeAddress,type Address} from '../lib/auth'

const Wrap=({children,className=''}:any)=><div className={`max-w-[1440px] mx-auto px-5 md:px-10 ${className}`}>{children}</div>
const Title=({children,sub}:any)=><div className="mb-10"><h2 className="font-serif text-4xl md:text-6xl">{children}</h2>{sub&&<p className="text-mute mt-3 max-w-xl">{sub}</p>}</div>
const PageHero=({title,text,image}:any)=><section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] min-h-[320px] md:min-h-[420px] overflow-hidden"><Img src={image} alt={title} ratio="h-full absolute inset-0"/><div className="absolute inset-0 bg-black/40"/><Wrap className="relative h-full flex flex-col justify-end pb-10 md:pb-14 text-bone"><h1 className="font-serif text-4xl sm:text-6xl md:text-8xl hero-text-mobile">{title}</h1><p className="mt-3 max-w-lg text-base md:text-lg">{text}</p></Wrap></section>

function Hero(){
const [i,setI]=useState(0);const ref=useRef(null);const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});const y=useTransform(scrollYProgress,[0,1],['0%','18%'])
useEffect(()=>{const t=setInterval(()=>setI(x=>(x+1)%campaigns.length),7000);return()=>clearInterval(t)},[]);const c=campaigns[i]
return <section ref={ref} className="relative h-[80vh] sm:h-[92vh] min-h-[480px] sm:min-h-[560px] overflow-hidden text-bone bg-bone"><AnimatePresence mode="sync">
<motion.div key={c.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:1.8}} style={{y}} className="absolute inset-0"><motion.div initial={{scale:1}} animate={{scale:1.08}} transition={{duration:9,ease:'linear'}} className="h-full"><Img src={c.image} alt={c.title} ratio="h-[115%]"/></motion.div></motion.div></AnimatePresence>
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10"/>
<Wrap className="relative h-full flex flex-col justify-end pb-10 sm:pb-16"><AnimatePresence mode="wait"><motion.div key={c.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:1}}>
<p className="label">{c.category}</p><h1 className="font-serif text-3xl sm:text-5xl md:text-8xl max-w-4xl mt-3 leading-[1.02] hero-text-mobile">{c.title}</h1><p className="mt-4 text-base sm:text-lg max-w-md">{c.text}</p>
<Link to={c.link} className="btn mt-6 sm:mt-8 border-bone hover:bg-bone hover:text-ink text-xs sm:text-[10.5px] px-6 sm:px-9 py-3 sm:py-4">{c.cta}</Link></motion.div></AnimatePresence>
<div className="flex gap-2 mt-8 sm:mt-10">{campaigns.map((x,n)=><button key={x.id} aria-label={`Slide ${n+1}`} onClick={()=>setI(n)} className={`h-px transition-all duration-700 ${n===i?'w-14 bg-ink':'w-6 bg-ink/50'}`}/>)}</div></Wrap></section>}

export function Home(){
const ps=getProducts(),depts=getDepartments(),hs=getBrands(),[hov,setHov]=useState<any>(null)
const fresh=ps.filter(p=>p.newArrival)
const [nlEmail,setNlEmail]=useState('');const [nlMsg,setNlMsg]=useState('')
const handleNl=(e:any)=>{e.preventDefault();if(!/^\S+@\S+\.\S+$/.test(nlEmail)){setNlMsg('Please enter a valid email.');return}setNlMsg('Thank you! You\'ve joined the CAD world.');setNlEmail('')}
return <>
<Hero/>
<Wrap className="mt-20 sm:mt-28"><Title sub="Discover what has just arrived at CAD.">New Arrivals</Title>
<div className="flex gap-4 sm:gap-5 overflow-x-auto noscroll snap-x pb-4">{fresh.map(p=><div key={p.id} className="snap-start shrink-0 w-[65vw] sm:w-[45vw] md:w-[22vw]"><ProductCardLazy p={p}/></div>)}</div></Wrap>
<Wrap className="mt-24 sm:mt-32"><Title>The Four Worlds of CAD</Title>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 md:gap-6">{depts.map((d,n)=><Link key={d.id} to={`/${d.slug}`} className={`group relative overflow-hidden ${[ 'md:col-span-7','md:col-span-5 md:mt-16','md:col-span-5','md:col-span-7 md:mt-16'][n]}`}>
<Img src={d.image} alt={d.name} ratio="aspect-[4/3] md:aspect-[5/4]" className="transition-transform duration-[1600ms] group-hover:scale-105"/><div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors duration-700"/>
<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 md:p-8 text-bone"><h3 className="font-serif text-3xl sm:text-4xl md:text-6xl">{d.name}</h3><p className="mt-1 text-sm sm:text-base">{d.tagline}</p><span className="label mt-3 sm:mt-4 inline-block border-b border-bone pb-1">Explore →</span></div></Link>)}</div></Wrap>
<section className="mt-24 sm:mt-32 py-16 sm:py-24" style={{background:'var(--bg-panel)'}}><Wrap><Title>The Houses</Title><div className="grid md:grid-cols-2 gap-10 items-center">
<ul>{hs.map(b=><li key={b.id} onMouseEnter={()=>setHov(b)}><Link to={`/brands/${b.id}`} className="block font-serif text-3xl sm:text-4xl md:text-6xl py-2 border-b border-line hover:pl-4 transition-all duration-500">{b.name}</Link></li>)}</ul>
<div className="hidden md:block sticky top-28"><Img src={(hov||hs[0]).heroImage} alt={(hov||hs[0]).name} ratio="aspect-[4/5]"/><div className="mt-4"><More to={`/brands/${(hov||hs[0]).id}`}>Discover house</More></div></div></div></Wrap></section>
<section className="mt-24 sm:mt-32 relative h-[60vh] sm:h-[80vh] overflow-hidden text-bone"><Img src="/images/editorial/fragrance-campaign.webp" alt="Fragrance campaign" ratio="h-full absolute inset-0"/><div className="absolute inset-0 bg-black/45"/><Wrap className="relative h-full flex flex-col justify-center max-w-3xl"><p className="label">Perfumes</p><h2 className="font-serif text-4xl sm:text-5xl md:text-7xl mt-3">The scent is the signature.</h2><div className="mt-6 sm:mt-8"><Link to="/perfumes" className="btn border-bone hover:bg-bone hover:text-ink">Discover perfumes</Link></div></Wrap></section>
<Wrap className="mt-24 sm:mt-32"><Title>The CAD Experience</Title><div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px" style={{background:'var(--line)'}}>{services.map(([t,d])=><div key={t} className="p-6 sm:p-8 md:p-10" style={{background:'var(--bg-ink)'}}><h3 className="font-serif text-2xl sm:text-3xl">{t}</h3><p className="text-mute mt-2 text-sm">{d}</p></div>)}</div></Wrap>
<section className="mt-24 sm:mt-32 py-16 sm:py-24 text-center" style={{background:'var(--bg-panel)'}}><Wrap><h2 className="font-serif text-4xl sm:text-5xl md:text-7xl">Enter the world of CAD</h2><p className="mt-4 max-w-md mx-auto text-sm md:text-base">Be the first to discover new arrivals, private edits and exceptional pieces.</p>
<form onSubmit={handleNl} className="mt-8 flex max-w-md mx-auto border-b" style={{borderColor:'var(--text-bone)'}}><label className="sr-only" htmlFor="nl">Email</label><input id="nl" type="email" required value={nlEmail} onChange={e=>setNlEmail(e.target.value)} placeholder="Email address" className="flex-1 bg-transparent py-3 outline-none placeholder:opacity-40 text-sm"/><button type="submit" className="label">Join CAD</button></form>
{nlMsg&&<p className="text-xs mt-3" style={{color:nlMsg.includes('Thank')?'var(--gold)':'#f87171'}}>{nlMsg}</p>}
<div className="mt-16 sm:mt-20"><p className="font-serif text-2xl sm:text-3xl">Private Client Services</p><p className="opacity-70 mt-2">For those seeking something exceptional.</p><div className="mt-5"><Link to="/contact" className="label border-b pb-1" style={{borderColor:'var(--text-bone)'}}>Discover private client →</Link></div></div></Wrap></section></>}


const sortFns:any={featured:()=>0,low:(a:any,b:any)=>a.price-b.price,high:(a:any,b:any)=>b.price-a.price,new:(a:any,b:any)=>+!!b.newArrival-+!!a.newArrival}
export function Listing({fixed={},title,text}:any){
const [sp,setSp]=useSearchParams();const [show,setShow]=useState(false);const [sort,setSort]=useState('featured')
const f:any={...Object.fromEntries(sp),...fixed}
let items=getProducts().filter(p=>(!f.department||p.department===f.department)&&(!f.brand||slug(p.brand)===f.brand)&&(!f.sub||p.subcategory===f.sub)&&(!f.material||p.material===f.material)&&(!f.gender||p.gender===f.gender)&&(!f.color||p.colors.includes(f.color))&&(!f.max||p.price<=+f.max)).sort(sortFns[sort])
const pool=getProducts().filter(p=>!f.department||p.department===f.department)
const facets=[['brand','Brand',[...new Set(pool.map(p=>slug(p.brand)))],(v:string)=>getBrand(v)?.name||v],['gender','Gender',[...new Set(pool.map(p=>p.gender).filter(Boolean))],(v:string)=>v],['material','Material',[...new Set(pool.map(p=>p.material).filter(Boolean))],(v:string)=>v],['color','Color',[...new Set(pool.flatMap(p=>p.colors))],(v:string)=>v]] as any[]
const set=(k:string,v:string)=>{const n=new URLSearchParams(sp);n.get(k)===v||!v?n.delete(k):n.set(k,v);setSp(n)}
return <Wrap className="py-10"><div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-line pb-4 mb-8 gap-4"><div><h1 className="font-serif text-4xl sm:text-5xl">{title||'All pieces'}</h1>{text&&<p className="text-mute mt-2 max-w-md text-sm">{text}</p>}<p className="label text-mute mt-3">{items.length} pieces</p></div>
<div className="flex items-center gap-4 sm:gap-6 label"><button onClick={()=>setShow(!show)} aria-expanded={show} className="flex items-center gap-2"><SlidersHorizontal size={14}/>Filter</button>
<label className="flex items-center gap-2">Sort<select value={sort} onChange={e=>setSort(e.target.value)} className="bg-transparent normal-case tracking-normal"><option value="featured">Featured</option><option value="new">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div></div>
<AnimatePresence>{show&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden"><div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 pb-8">{facets.filter(x=>x[2].length>1&&!fixed[x[0]]).map(([k,l,vals,fmt])=><div key={k}><p className="label text-mute mb-3">{l}</p>{vals.map((v:string)=><button key={v} onClick={()=>set(k,v)} className={`block text-sm py-1 ${f[k]===v?'underline':''}`}>{fmt(v)}</button>)}</div>)}
<div><p className="label text-mute mb-3">Price</p>{[50000,150000,500000].map(m=><button key={m} onClick={()=>set('max',String(m))} className={`block text-sm py-1 ${f.max==m?'underline':''}`}>Up to {inr(m)}</button>)}</div></div></motion.div>}</AnimatePresence>
{items.length?<Grid items={items}/>:<p className="text-mute py-20">No pieces match these filters. Clear a filter to see more.</p>}</Wrap>}

export function NewIn(){const items=getProducts().filter(p=>p.newArrival);return <Wrap className="py-16"><Title sub="Discover what has just arrived at CAD.">New Arrivals</Title><Grid items={items}/></Wrap>}

export function Department({dept}:any){
const ps=getProducts().filter(p=>p.department===dept.id)
return <><PageHero title={dept.name} text={dept.tagline} image={dept.image}/>
<Wrap className="mt-12"><div className="flex gap-4 sm:gap-6 overflow-x-auto noscroll label whitespace-nowrap border-b border-line pb-4"><Link to={`/${dept.slug}`}>All {dept.name}</Link>{dept.subcategories.filter((s:any)=>ps.some(p=>p.subcategory===s.id)).map((s:any)=><Link key={s.id} className="text-mute hover:text-bone" to={`/products?department=${dept.id}&sub=${s.id}`}>{s.name}</Link>)}</div>
<div className="mt-10 sm:mt-14"><p className="label text-mute mb-4">Featured houses</p><div className="flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-2 font-serif text-2xl sm:text-3xl">{brandsIn(dept.id).map(b=><Link key={b.id} to={`/products?department=${dept.id}&brand=${b.id}`} className="hover:opacity-60">{b.name}</Link>)}</div></div></Wrap>
<Listing fixed={{department:dept.id}} title={`New ${dept.name}`} text={dept.blurb}/></>}

export function Houses(){return <Wrap className="py-16"><Title sub="Seven houses, one curated destination.">The Houses</Title><ul>{getBrands().map(b=><li key={b.id} className="border-b border-line"><Link to={`/brands/${b.id}`} className="flex justify-between items-baseline py-5 sm:py-6 group"><span className="font-serif text-4xl sm:text-5xl md:text-7xl group-hover:pl-4 transition-all duration-500">{b.name}</span><span className="label hidden md:block">Discover house →</span></Link></li>)}</ul></Wrap>}

export function BrandPage(){
const {id}=useParams();const b=getBrand(id!);if(!b)return <Wrap className="py-24"><p>House not found.</p></Wrap>
const ds=deptsOf(b.id)
return <><PageHero title={b.name} text={b.description} image={b.heroImage}/>
<Wrap className="mt-12"><p className="label text-mute mb-4">Available at CAD</p><div className="flex flex-wrap gap-x-6 sm:gap-x-10 font-serif text-3xl sm:text-4xl">{ds.map(d=><Link key={d.id} to={`/products?department=${d.id}&brand=${b.id}`}>{d.name}</Link>)}</div></Wrap>
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
      <Wrap className="pt-6 sm:pt-8 pb-0">
        <nav className="label text-mute text-[10px] tracking-widest flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-bone transition-colors">Home</Link>
          <ChevronRight size={10}/>
          <Link to={`/${p.department}`} className="hover:text-bone transition-colors capitalize">{p.department}</Link>
          <ChevronRight size={10}/>
          <span className="text-bone truncate max-w-[150px] sm:max-w-none">{p.name}</span>
        </nav>
      </Wrap>
      <Wrap className="py-6 sm:py-10">
        <div className="grid md:grid-cols-12 gap-6 lg:gap-14">
          <div className="md:col-span-7 lg:col-span-7">
            <div className="relative bg-stone-950 overflow-hidden group cursor-zoom-in">
              <AnimatePresence mode="wait">
                <motion.div key={active} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.5}}>
                  <Img src={p.images[active]} alt={`${p.brand} ${p.name}`} ratio="aspect-[4/5]" className="transition-transform duration-[2000ms] group-hover:scale-105"/>
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-4 sm:top-5 left-4 sm:left-5"><span className="label text-bone/60 text-[9px] tracking-[0.3em] bg-ink/20 backdrop-blur-sm px-3 py-1.5">{p.brand.toUpperCase()}</span></div>
              {p.newArrival&&<div className="absolute top-4 sm:top-5 right-4 sm:right-5"><span className="label text-ink text-[9px] tracking-widest py-1.5 px-3" style={{background:'var(--gold)'}}>New Arrival</span></div>}
            </div>
            {p.images.length>1&&<div className="flex gap-2 mt-3 overflow-x-auto noscroll">
              {p.images.map((im:string,n:number)=><button key={n} onClick={()=>setAct(n)} aria-label={`View image ${n+1}`}
                className={`relative w-14 sm:w-16 aspect-[3/4] overflow-hidden bg-stone-950 border-b-2 transition-all duration-300 shrink-0 ${active===n?'border-bone opacity-100':'border-transparent opacity-50 hover:opacity-80'}`}>
                <Img src={im} alt="" ratio="h-full absolute inset-0"/>
              </button>)}
            </div>}
          </div>
          <div className="md:col-span-5 lg:col-span-5 product-info-mobile">
            <div className="md:sticky md:top-24 space-y-0">
              <Link to={`/brands/${slug(p.brand)}`} className="label text-[10px] tracking-[0.3em] hover:opacity-70 transition-opacity" style={{color:'var(--gold)'}}>{p.brand.toUpperCase()}</Link>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl mt-2 leading-[1.1]">{p.name}</h1>
              <div className="mt-5 flex items-baseline gap-4">
                <span className="font-serif text-2xl sm:text-3xl">{inr(p.price)}</span>
                <span className="label text-mute text-[10px]">Incl. GST</span>
              </div>
              <p className="mt-5 text-mute text-sm leading-relaxed border-t border-line/40 pt-5">{p.description}</p>
              {p.colors.length>0&&<div className="mt-6">
                <div className="flex items-center justify-between mb-3"><p className="label text-xs tracking-widest">Colour</p><span className="label text-mute text-xs">{color||p.colors[0]}</span></div>
                <div className="flex gap-2 flex-wrap">{p.colors.map((c:string)=><button key={c} onClick={()=>setC(c)}
                  className={`label text-xs px-3 sm:px-4 py-2 sm:py-2.5 border transition-all duration-300 ${(color||p.colors[0])===c?'border-bone bg-bone text-ink':'border-line hover:border-bone/50'}`}>{c}</button>)}</div>
              </div>}
              {p.sizes.length>0&&<div className="mt-6">
                <div className="flex items-center justify-between mb-3"><p className="label text-xs tracking-widest">Size</p><button className="label text-mute text-xs underline underline-offset-2">Size guide</button></div>
                <div className="flex gap-2 flex-wrap">{p.sizes.map((sz:string)=><button key={sz} onClick={()=>setSz(sz)}
                  className={`label text-xs w-11 h-11 sm:w-12 sm:h-12 border transition-all duration-300 ${size===sz?'border-bone bg-bone text-ink':'border-line hover:border-bone/50'}`}>{sz}</button>)}</div>
              </div>}
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-4 border border-line/40 w-fit px-4 py-2">
                  <button aria-label="Decrease" onClick={()=>setQ(Math.max(1,qty-1))} className="text-mute hover:text-bone transition-colors w-6 text-center"><Minus size={14}/></button>
                  <span className="label text-sm w-4 text-center">{qty}</span>
                  <button aria-label="Increase" onClick={()=>setQ(qty+1)} className="text-mute hover:text-bone transition-colors w-6 text-center"><Plus size={14}/></button>
                </div>
                <button onClick={handleAdd} className={`btn btn-solid w-full justify-center text-sm transition-all duration-500 ${added?'!bg-green-900/80 !border-green-900':''}`}>
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
                    className="label w-full flex justify-between items-center py-4 text-xs tracking-widest hover:opacity-70 transition-opacity" style={{color:openS===k?'var(--gold)':'inherit'}}>
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
        <div className="mt-20 sm:mt-28">
          <div className="mb-10 border-t border-line/40 pt-10 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl">You may also like</h2>
            <Link to={`/${p.department}`} className="label text-mute text-xs tracking-widest hover:text-bone transition-colors">View all {p.department} →</Link>
          </div>
          <Grid items={related(p)}/>
        </div>
      </Wrap>
    </div>
  )}

export function Wishlist(){const {wish}=useApp();const items=wish.map((i:string)=>getProduct(i)).filter(Boolean)
return <Wrap className="py-16"><Title>My Wishlist</Title>{items.length?<Grid items={items}/>:<div className="py-16"><p className="font-serif text-3xl sm:text-4xl">Your collection is waiting.</p><div className="mt-6"><More to="/new-in">Explore new arrivals</More></div></div>}</Wrap>}

// ── Account Dashboard ──
export function Account(){
  const {user,logoutUser,recent}=useApp()
  const nav=useNavigate()
  const [sp]=useSearchParams()
  const initialTab=sp.get('tab')||'overview'
  const tabs=[
    {id:'overview',label:'Overview',icon:User},
    {id:'orders',label:'My Orders',icon:Package},
    {id:'profile',label:'Personal Information',icon:Edit3},
    {id:'addresses',label:'Saved Addresses',icon:MapPinned},
    {id:'viewed',label:'Recently Viewed',icon:Eye},
  ]
  const [t,setT]=useState(initialTab)

  // If not logged in, show prompt
  if(!user) return <Wrap className="py-16">
    <div className="max-w-lg mx-auto text-center py-16">
      <h1 className="font-serif text-4xl sm:text-5xl mb-4">My Account</h1>
      <p className="text-mute mb-8">Sign in to access your account, view orders, and manage your personal information.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/login" className="btn btn-solid justify-center">Sign In</Link>
        <Link to="/signup" className="btn justify-center">Create Account</Link>
      </div>
      <div className="mt-10 border-t border-line pt-8">
        <h2 className="font-serif text-2xl mb-4">Guest Features</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <Link to="/wishlist" className="p-4 border border-line hover:border-bone/50 transition-colors"><p className="label text-xs mb-1">Wishlist</p><p className="text-sm text-mute">View your saved items</p></Link>
          <Link to="/new-in" className="p-4 border border-line hover:border-bone/50 transition-colors"><p className="label text-xs mb-1">New Arrivals</p><p className="text-sm text-mute">Browse latest pieces</p></Link>
        </div>
      </div>
    </div>
  </Wrap>

  const os=orders.getUserOrders(user.id)
  const rv=recent.map((i:string)=>getProduct(i)).filter(Boolean)

  return <Wrap className="py-10 sm:py-16">
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-10 gap-4">
      <div>
        <p className="label text-mute mb-2">Welcome back</p>
        <h1 className="font-serif text-4xl sm:text-5xl">{user.name}</h1>
      </div>
      <button onClick={()=>{logoutUser();nav('/')}} className="flex items-center gap-2 label text-mute hover:text-bone transition-colors"><LogOut size={14}/>Sign Out</button>
    </div>

    <div className="grid md:grid-cols-4 gap-8 md:gap-10 account-grid">
      {/* Sidebar */}
      <ul className="space-y-1 account-sidebar">
        {tabs.map(x=><li key={x.id}>
          <button onClick={()=>setT(x.id)} className={`flex items-center gap-2 w-full text-left px-3 py-2.5 label text-xs transition-all duration-300 ${t===x.id?'border-l-2 pl-4 sm:border-l-2 sm:pl-4':'text-mute hover:text-bone'}`}
            style={t===x.id?{borderColor:'var(--gold)',color:'var(--gold)'}:{}}>
            <x.icon size={14} strokeWidth={1.5}/>{x.label}
          </button>
        </li>)}
      </ul>

      {/* Content */}
      <div className="md:col-span-3">
        <AnimatePresence mode="wait">
          <motion.div key={t} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.25}}>

            {/* Overview */}
            {t==='overview'&&<div>
              <h2 className="font-serif text-2xl sm:text-3xl mb-6">Account Overview</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 sm:p-6 border border-line"><p className="label text-mute text-xs mb-2">Personal Info</p><p className="font-serif text-xl">{user.name}</p><p className="text-sm text-mute mt-1">{user.email}</p>{user.phone&&<p className="text-sm text-mute">{user.phone}</p>}</div>
                <div className="p-5 sm:p-6 border border-line"><p className="label text-mute text-xs mb-2">Orders</p><p className="font-serif text-xl">{os.length} {os.length===1?'order':'orders'}</p>{os.length>0&&<button onClick={()=>setT('orders')} className="label text-xs mt-2 hover:opacity-70 transition-opacity" style={{color:'var(--gold)'}}>View all →</button>}</div>
              </div>
              {os.length>0&&<div className="mt-8">
                <h3 className="font-serif text-xl mb-4">Recent Orders</h3>
                <ul className="divide-y divide-line">{os.slice(0,3).map(o=><li key={o.id}><Link to={`/order/${o.id}`} className="flex flex-col sm:flex-row sm:justify-between py-4 gap-2 hover:opacity-70 transition-opacity">
                  <div><span className="font-medium">{o.id}</span><span className="text-mute text-sm ml-2">{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></div>
                  <div className="flex items-center gap-4"><span className="label text-xs" style={{color:o.status>=3?'var(--gold)':'var(--text-mute)'}}>{['Placed','Confirmed','Processing','Shipped','Out for delivery','Delivered'][Math.min(o.status,5)]}</span><span>{inr(o.totals.total)}</span></div>
                </Link></li>)}</ul>
              </div>}
            </div>}

            {/* Orders */}
            {t==='orders'&&<div>
              <h2 className="font-serif text-2xl sm:text-3xl mb-6">My Orders</h2>
              {os.length?<div className="space-y-4">{os.map(o=><Link key={o.id} to={`/order/${o.id}`} className="block p-4 sm:p-6 border border-line hover:border-bone/30 transition-colors group">
                <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3">
                  <div><span className="font-serif text-lg">{o.id}</span><span className="text-mute text-sm ml-2">{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></div>
                  <div className="flex items-center gap-3"><span className="label text-[10px] px-2 py-1 border" style={{borderColor:'var(--gold)',color:'var(--gold)'}}>{['Placed','Confirmed','Processing','Shipped','Out for delivery','Delivered'][Math.min(o.status,5)]}</span><span className="font-serif text-lg">{inr(o.totals.total)}</span></div>
                </div>
                <div className="flex gap-3 overflow-x-auto noscroll">{o.items.slice(0,4).map((item:any,idx:number)=><div key={idx} className="shrink-0 w-16 sm:w-20"><Img src={item.image} alt={item.name} ratio="aspect-[3/4]"/></div>)}{o.items.length>4&&<div className="shrink-0 w-16 sm:w-20 flex items-center justify-center border border-line"><span className="text-xs text-mute">+{o.items.length-4}</span></div>}</div>
                {o.estimatedDelivery&&<p className="text-xs text-mute mt-3">Est. delivery: {new Date(o.estimatedDelivery).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</p>}
              </Link>)}</div>
              :<div className="py-12 text-center"><p className="font-serif text-3xl mb-3">No orders yet</p><p className="text-mute mb-6">Your first order will appear here.</p><More to="/new-in">Start shopping</More></div>}
            </div>}

            {/* Profile */}
            {t==='profile'&&<ProfileSection/>}

            {/* Addresses */}
            {t==='addresses'&&<AddressSection/>}

            {/* Recently Viewed */}
            {t==='viewed'&&<div>
              <h2 className="font-serif text-2xl sm:text-3xl mb-6">Recently Viewed</h2>
              {rv.length?<Grid items={rv}/>:<p className="text-mute">Nothing viewed yet. Start browsing to see your history here.</p>}
            </div>}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </Wrap>
}

function ProfileSection(){
  const {user,refreshUser}=useApp()
  const [editing,setEditing]=useState(false)
  const [name,setName]=useState(user?.name||'')
  const [phone,setPhone]=useState(user?.phone||'')
  const [msg,setMsg]=useState('')

  const handleSave=()=>{
    if(!name.trim()){setMsg('Name is required.');return}
    updateProfile({name:name.trim(),phone:phone.trim()})
    refreshUser()
    setEditing(false)
    setMsg('Profile updated successfully.')
    setTimeout(()=>setMsg(''),3000)
  }

  return <div>
    <div className="flex items-baseline justify-between mb-6">
      <h2 className="font-serif text-2xl sm:text-3xl">Personal Information</h2>
      {!editing&&<button onClick={()=>setEditing(true)} className="label text-xs flex items-center gap-1 hover:opacity-70 transition-opacity" style={{color:'var(--gold)'}}><Edit3 size={12}/>Edit</button>}
    </div>
    {msg&&<p className="text-sm mb-4 px-3 py-2" style={{background:'rgba(201,169,97,0.1)',border:'1px solid rgba(201,169,97,0.2)',color:'var(--gold)'}}>{msg}</p>}
    {editing?(
      <div className="space-y-5 max-w-md">
        <div><label className="label text-mute text-[10px] block mb-1">Full Name</label><input value={name} onChange={e=>setName(e.target.value)} className="w-full bg-transparent border-b py-3 outline-none text-sm" style={{borderColor:'var(--border-input)'}}/></div>
        <div><label className="label text-mute text-[10px] block mb-1">Email</label><input value={user?.email} disabled className="w-full bg-transparent border-b py-3 outline-none text-sm opacity-50 cursor-not-allowed" style={{borderColor:'var(--border-input)'}}/><p className="text-[10px] text-mute mt-1">Email cannot be changed in demo mode</p></div>
        <div><label className="label text-mute text-[10px] block mb-1">Phone</label><input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-transparent border-b py-3 outline-none text-sm" style={{borderColor:'var(--border-input)'}} placeholder="+91"/></div>
        <div className="flex gap-3 pt-4">
          <button onClick={handleSave} className="btn btn-solid text-xs flex items-center gap-2"><Save size={13}/>Save changes</button>
          <button onClick={()=>setEditing(false)} className="btn text-xs">Cancel</button>
        </div>
      </div>
    ):(
      <div className="space-y-4 max-w-md">
        <div className="flex justify-between py-3 border-b border-line"><span className="text-mute text-sm">Name</span><span className="text-sm">{user?.name}</span></div>
        <div className="flex justify-between py-3 border-b border-line"><span className="text-mute text-sm">Email</span><span className="text-sm">{user?.email}</span></div>
        <div className="flex justify-between py-3 border-b border-line"><span className="text-mute text-sm">Phone</span><span className="text-sm">{user?.phone||'Not set'}</span></div>
        <div className="flex justify-between py-3 border-b border-line"><span className="text-mute text-sm">Member since</span><span className="text-sm">{user?.createdAt?new Date(user.createdAt).toLocaleDateString('en-IN',{month:'long',year:'numeric'}):'-'}</span></div>
      </div>
    )}
  </div>
}

function AddressSection(){
  const [addrs,setAddrs]=useState<Address[]>(()=>getAddresses())
  const [editing,setEditing]=useState<Address|null>(null)
  const [adding,setAdding]=useState(false)
  const empty:Address={id:'',label:'',name:'',phone:'',line1:'',city:'',state:'',pin:'',isDefault:false}

  const handleSave=(addr:Address)=>{
    const updated=saveAddress(addr)
    setAddrs(updated)
    setEditing(null);setAdding(false)
  }
  const handleRemove=(id:string)=>{const updated=removeAddress(id);setAddrs(updated)}

  return <div>
    <div className="flex items-baseline justify-between mb-6">
      <h2 className="font-serif text-2xl sm:text-3xl">Saved Addresses</h2>
      {!adding&&!editing&&<button onClick={()=>{setAdding(true);setEditing(empty)}} className="label text-xs flex items-center gap-1 hover:opacity-70 transition-opacity" style={{color:'var(--gold)'}}><Plus size={12}/>Add New</button>}
    </div>
    {(adding||editing)?<AddressForm addr={editing!} onSave={handleSave} onCancel={()=>{setEditing(null);setAdding(false)}}/>:
    addrs.length?<div className="grid sm:grid-cols-2 gap-4">{addrs.map(a=><div key={a.id} className="p-5 border border-line relative">
      {a.isDefault&&<span className="label text-[9px] absolute top-3 right-3 px-2 py-0.5" style={{border:'1px solid var(--gold)',color:'var(--gold)'}}>Default</span>}
      <p className="label text-xs text-mute mb-2">{a.label||'Address'}</p>
      <p className="font-serif text-lg">{a.name}</p>
      <p className="text-sm text-mute mt-1">{a.line1}</p>
      <p className="text-sm text-mute">{a.city}, {a.state} {a.pin}</p>
      <p className="text-sm text-mute">{a.phone}</p>
      <div className="flex gap-3 mt-3 pt-3 border-t border-line">
        <button onClick={()=>setEditing(a)} className="label text-[10px] flex items-center gap-1 hover:opacity-70 transition-opacity"><Edit3 size={11}/>Edit</button>
        <button onClick={()=>handleRemove(a.id)} className="label text-[10px] flex items-center gap-1 text-mute hover:text-red-400 transition-colors"><Trash2 size={11}/>Remove</button>
      </div>
    </div>)}</div>
    :<div className="py-8 text-center"><p className="text-mute mb-4">No saved addresses yet.</p><button onClick={()=>{setAdding(true);setEditing(empty)}} className="btn btn-solid text-xs">Add your first address</button></div>}
  </div>
}

function AddressForm({addr,onSave,onCancel}:{addr:Address,onSave:(a:Address)=>void,onCancel:()=>void}){
  const [f,setF]=useState(addr)
  const [err,setErr]=useState<any>({})
  const set=(k:string,v:any)=>setF({...f,[k]:v})
  const inp="w-full bg-transparent border-b py-3 outline-none text-sm"

  const handle=()=>{
    const e:any={};
    if(!f.name.trim())e.name='Required';if(!f.line1.trim())e.line1='Required';if(!f.city.trim())e.city='Required';if(!f.state.trim())e.state='Required';if(!/^\d{6}$/.test(f.pin))e.pin='6-digit pincode'
    setErr(e);if(Object.keys(e).length)return
    onSave(f)
  }

  return <div className="space-y-5 max-w-lg">
    <div><label className="label text-mute text-[10px] block mb-1">Label (e.g. Home, Office)</label><input value={f.label} onChange={e=>set('label',e.target.value)} className={inp} style={{borderColor:'var(--border-input)'}} placeholder="Home"/></div>
    <div><label className="label text-mute text-[10px] block mb-1">Full Name</label><input value={f.name} onChange={e=>set('name',e.target.value)} className={inp} style={{borderColor:err.name?'#f87171':'var(--border-input)'}}/>{err.name&&<p className="text-xs text-red-400 mt-1">{err.name}</p>}</div>
    <div><label className="label text-mute text-[10px] block mb-1">Phone</label><input value={f.phone} onChange={e=>set('phone',e.target.value)} className={inp} style={{borderColor:'var(--border-input)'}} placeholder="+91"/></div>
    <div><label className="label text-mute text-[10px] block mb-1">Street Address</label><input value={f.line1} onChange={e=>set('line1',e.target.value)} className={inp} style={{borderColor:err.line1?'#f87171':'var(--border-input)'}}/>{err.line1&&<p className="text-xs text-red-400 mt-1">{err.line1}</p>}</div>
    <div className="grid grid-cols-2 gap-4">
      <div><label className="label text-mute text-[10px] block mb-1">City</label><input value={f.city} onChange={e=>set('city',e.target.value)} className={inp} style={{borderColor:err.city?'#f87171':'var(--border-input)'}}/>{err.city&&<p className="text-xs text-red-400 mt-1">{err.city}</p>}</div>
      <div><label className="label text-mute text-[10px] block mb-1">State</label><input value={f.state} onChange={e=>set('state',e.target.value)} className={inp} style={{borderColor:err.state?'#f87171':'var(--border-input)'}}/>{err.state&&<p className="text-xs text-red-400 mt-1">{err.state}</p>}</div>
    </div>
    <div className="max-w-[200px]"><label className="label text-mute text-[10px] block mb-1">Pincode</label><input value={f.pin} onChange={e=>set('pin',e.target.value)} maxLength={6} inputMode="numeric" className={inp} style={{borderColor:err.pin?'#f87171':'var(--border-input)'}}/>{err.pin&&<p className="text-xs text-red-400 mt-1">{err.pin}</p>}</div>
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="w-4 h-4 border-2 flex items-center justify-center shrink-0 transition-all" style={{borderColor:f.isDefault?'var(--gold)':'var(--line)',background:f.isDefault?'rgba(201,169,97,0.15)':'transparent'}}>
        {f.isDefault&&<Check size={10} style={{color:'var(--gold)'}} strokeWidth={3}/>}
      </div>
      <input type="checkbox" className="sr-only" checked={!!f.isDefault} onChange={e=>set('isDefault',e.target.checked)}/>
      <span className="text-sm text-mute">Set as default address</span>
    </label>
    <div className="flex gap-3 pt-4">
      <button onClick={handle} className="btn btn-solid text-xs flex items-center gap-2"><Save size={13}/>Save address</button>
      <button onClick={onCancel} className="btn text-xs">Cancel</button>
    </div>
  </div>
}

export function About(){
const sec=[['Curation','Four worlds, seven houses, nothing superfluous.'],['Craftsmanship','We choose pieces for how they are made.'],['Authenticity','Every item is verified before it reaches you.']]
return <><PageHero title="The World of CAD" text="A curated destination for luxury fashion, timepieces, bags and fragrance." image="/images/editorial/about.jpg"/>
<Wrap className="py-16 sm:py-24 grid sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">{sec.map(([t,d])=><div key={t}><h2 className="font-serif text-3xl sm:text-4xl">{t}</h2><p className="text-mute mt-3 text-sm">{d}</p></div>)}</Wrap>
<Wrap><Img src="/images/editorial/about-02.jpg" alt="CAD atelier" ratio="aspect-[21/9]"/></Wrap></>}

export function Contact(){const [sent,setSent]=useState(false);const [err,setErr]=useState<any>({});const inp='w-full bg-transparent border-b py-3 outline-none text-sm';const [f,setF]=useState({name:'',email:'',subject:'',message:''})
const validate=()=>{const e:any={};if(!f.name.trim())e.name='Required';if(!f.email.trim())e.email='Required';else if(!/^\S+@\S+\.\S+$/.test(f.email))e.email='Valid email required';if(!f.subject.trim())e.subject='Required';if(!f.message.trim())e.message='Required';setErr(e);return!Object.keys(e).length}
return <Wrap className="py-16 grid md:grid-cols-2 gap-12 md:gap-16"><div><Title>Contact CAD</Title><ul className="space-y-4 text-sm"><li className="flex gap-3 items-center"><Mail size={16}/>
<a href="mailto:care@cad.example" className="hover:opacity-70 transition-opacity">care@cad.example</a></li>
<li><a href="tel:+910000000000" className="hover:opacity-70 transition-opacity">Customer Care: +91 00000 00000</a></li>
<li className="flex gap-3 items-center"><MapPin size={16}/>Store information to follow</li><li>
<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">Instagram</a> · <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">Pinterest</a></li></ul></div>
<form onSubmit={e=>{e.preventDefault();if(validate()){setSent(true);setF({name:'',email:'',subject:'',message:''})}}} className="space-y-6">
  <div><label className="label text-mute text-[10px]">Name</label><input value={f.name} onChange={e=>setF({...f,name:e.target.value})} required className={inp} style={{borderColor:err.name?'#f87171':'var(--border-input)'}}/>{err.name&&<p className="text-xs text-red-400 mt-1">{err.name}</p>}</div>
  <div><label className="label text-mute text-[10px]">Email</label><input value={f.email} onChange={e=>setF({...f,email:e.target.value})} type="email" required className={inp} style={{borderColor:err.email?'#f87171':'var(--border-input)'}}/>{err.email&&<p className="text-xs text-red-400 mt-1">{err.email}</p>}</div>
  <div><label className="label text-mute text-[10px]">Subject</label><input value={f.subject} onChange={e=>setF({...f,subject:e.target.value})} required className={inp} style={{borderColor:err.subject?'#f87171':'var(--border-input)'}}/>{err.subject&&<p className="text-xs text-red-400 mt-1">{err.subject}</p>}</div>
  <div><label className="label text-mute text-[10px]">Message</label><textarea value={f.message} onChange={e=>setF({...f,message:e.target.value})} required rows={4} className={`${inp} resize-none`} style={{borderColor:err.message?'#f87171':'var(--border-input)'}}/>{err.message&&<p className="text-xs text-red-400 mt-1">{err.message}</p>}</div>
  <button type="submit" className="btn btn-solid">Send enquiry</button>
  {sent&&<motion.p initial={{opacity:0}} animate={{opacity:1}} role="status" className="text-sm" style={{color:'var(--gold)'}}>Thank you. Our team will reply within one business day.</motion.p>}
</form></Wrap>}
