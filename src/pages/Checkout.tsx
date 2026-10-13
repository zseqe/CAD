import {useState} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {motion,AnimatePresence} from 'framer-motion'
import {Check,ChevronRight,Lock,Package,CreditCard,Truck,ShieldCheck,Sparkles} from 'lucide-react'
import {inr} from '../data'
import {useApp} from '../lib/store'
import {lines,pricing,COUPONS,payments,orders} from '../lib/commerce'
import {Img,More} from '../components/ui'

/* ── Ambient background decoration ── */
function AmbientBg(){
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{background:'radial-gradient(circle,#C9A961 0%,transparent 70%)'}}/>
      <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{background:'radial-gradient(circle,#C9A961 0%,transparent 70%)'}}/>
      <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{background:'radial-gradient(circle,#b8a080 0%,transparent 70%)'}}/>
    </div>
  )
}

/* ── Glass Card ── */
function GlassCard({children,className='',glow=false}:any){
  return (
    <div className={`relative ${className}`} style={{
      background:'rgba(255,255,255,0.03)',
      backdropFilter:'blur(24px) saturate(1.4)',
      WebkitBackdropFilter:'blur(24px) saturate(1.4)',
      border:'1px solid rgba(201,169,97,0.15)',
      boxShadow: glow
        ? '0 8px 40px rgba(201,169,97,0.08), inset 0 1px 0 rgba(255,255,255,0.06)'
        : '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>
      {children}
    </div>
  )
}

/* ── Order Summary Sidebar ── */
function Summary({ls,t}:any){
  const {coupon,setCoupon}=useApp()
  const [code,setCode]=useState('');const [msg,setMsg]=useState('');const [open,setOpen]=useState(true)
  const apply=()=>{const c=code.trim().toUpperCase();if(COUPONS[c]){setCoupon(c);setMsg('');setCode('')}else setMsg('Invalid code.')}
  const row=(l:string,v:string,highlight=false)=><div className={`flex justify-between text-sm ${highlight?'text-gold':''}`}><span className="text-bone/60">{l}</span><span>{v}</span></div>
  return (
    <GlassCard glow>
      {/* header */}
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between p-6 border-b"
        style={{borderColor:'rgba(201,169,97,0.12)'}}>
        <span className="font-serif text-2xl">Order Summary</span>
        <span className="label text-mute text-xs">{open?'Hide':'Show'} ({ls.length} {ls.length===1?'item':'items'})</span>
      </button>
      <AnimatePresence>{open&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
        {/* items */}
        <div className="p-6 space-y-5 border-b" style={{borderColor:'rgba(201,169,97,0.12)'}}>
          {ls.map((i:any)=><div key={i.id} className="flex gap-4 items-start">
            <div className="relative shrink-0 w-20" style={{background:'rgba(12,9,8,0.8)'}}>
              <Img src={i.p.images[0]} alt={i.p.name} ratio="aspect-[3/4]"/>
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center font-medium text-[10px]"
                style={{background:'linear-gradient(135deg,#C9A961,#a88740)',color:'#0C0908'}}>
                {i.qty}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="label text-gold text-[10px] tracking-[0.2em]">{i.p.brand}</p>
              <p className="font-serif text-lg leading-tight mt-0.5">{i.p.name}</p>
              {i.color&&<p className="text-xs text-mute mt-1">{i.color}</p>}
            </div>
            <span className="text-sm shrink-0">{inr(i.p.price*i.qty)}</span>
          </div>)}
        </div>
        {/* promo */}
        <div className="p-6 border-b" style={{borderColor:'rgba(201,169,97,0.12)'}}>
          <div className="flex gap-3 pb-2" style={{borderBottom:'1px solid rgba(201,169,97,0.2)'}}>
            <input value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==='Enter'&&apply()}
              placeholder="Promotional code" aria-label="Promo code"
              className="flex-1 bg-transparent py-2 outline-none text-sm placeholder:text-mute"/>
            <button onClick={apply} className="label text-[10px] tracking-widest hover:text-gold transition-colors">Apply</button>
          </div>
          {msg&&<p className="text-xs text-red-400 mt-2">{msg}</p>}
          {coupon&&<p className="text-xs text-gold mt-2">{coupon} applied · {COUPONS[coupon]?.label} <button onClick={()=>setCoupon('')} className="underline text-mute ml-1">remove</button></p>}
          <p className="text-xs text-mute mt-2">Try <span className="text-bone/60">CAD10</span></p>
        </div>
        {/* totals */}
        <div className="p-6 space-y-2.5">
          {row('Subtotal',inr(t.subtotal))}
          {t.discount>0&&row('Promotional discount','−'+inr(t.discount),true)}
          {row('Delivery',t.shipping?inr(t.shipping):'Complimentary')}
          {t.giftFee>0&&row('Luxury gift wrapping',inr(t.giftFee))}
          <div className="mt-4 pt-4 flex justify-between items-baseline" style={{borderTop:'1px solid rgba(201,169,97,0.15)'}}>
            <span className="font-serif text-2xl">Total</span>
            <span className="font-serif text-2xl" style={{color:'#C9A961'}}>{inr(t.total)}</span>
          </div>
          <p className="text-[11px] text-mute">Incl. GST {inr(t.gst)}</p>
        </div>
        {/* trust bar */}
        <div className="px-6 pb-6 flex items-center gap-2 text-mute">
          <ShieldCheck size={13} className="text-gold/60"/>
          <p className="text-[11px]">256-bit SSL encryption · PCI DSS compliant</p>
        </div>
      </motion.div>}</AnimatePresence>
    </GlassCard>
  )
}

/* ── Step Indicator ── */
const steps=[{label:'Information',icon:Package},{label:'Delivery',icon:Truck},{label:'Payment',icon:CreditCard}]
function StepBar({step}:any){
  return (
    <ol className="flex items-center gap-0 mb-12">
      {steps.map((s,n)=><>
        <li key={s.label} className="flex items-center gap-2.5">
          <motion.span
            animate={n<step?{background:'linear-gradient(135deg,#C9A961,#a88740)',borderColor:'#C9A961',color:'#0C0908'}
              :n===step?{borderColor:'#E8DCC8',color:'#E8DCC8'}:{borderColor:'rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.3)'}}
            transition={{duration:.5}}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 shrink-0 font-medium"
            style={n<step?{background:'linear-gradient(135deg,#C9A961,#a88740)',borderColor:'#C9A961',color:'#0C0908'}
              :n===step?{background:'rgba(232,220,200,0.08)',borderColor:'#E8DCC8',color:'#E8DCC8'}
              :{background:'transparent',borderColor:'rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.25)'}}>
            {n<step?<Check size={13} strokeWidth={2.5}/>:n+1}
          </motion.span>
          <span className={`label text-[10px] tracking-widest hidden sm:block transition-colors duration-500 ${n===step?'text-bone':n<step?'text-gold':'text-mute'}`}>{s.label}</span>
        </li>
        {n<steps.length-1&&<div className="mx-3 flex-1 h-px" style={{background:`linear-gradient(90deg,${n<step?'rgba(201,169,97,0.6)':'rgba(255,255,255,0.08)'} 0%,${n+1<=step?'rgba(201,169,97,0.6)':'rgba(255,255,255,0.08)'} 100%)`}}/>}
      </>)}
    </ol>
  )
}

/* ── Field Component ── */
function Field({id,label,err,span,children}:any){
  return (
    <div className={span?'md:col-span-2':''}>
      <label htmlFor={id} className="label text-mute text-[10px] tracking-widest block mb-1">{label}</label>
      {children}
      {err&&<p className="text-xs text-red-400 mt-1">{err}</p>}
    </div>
  )
}

/* ── Glass Input ── */
const glassInp='w-full py-3 px-4 text-sm outline-none placeholder:text-mute/40 transition-all duration-300'

/* ── Radio Option ── */
function Radio({name,value,current,onChange,label,description,badge}:any){
  const selected=current===value
  return (
    <motion.label
      whileHover={{scale:1.005}}
      className="flex gap-4 p-5 cursor-pointer transition-all duration-300 group"
      style={{
        background: selected ? 'rgba(201,169,97,0.07)' : 'rgba(255,255,255,0.02)',
        border: selected ? '1px solid rgba(201,169,97,0.4)' : '1px solid rgba(255,255,255,0.08)',
        backdropFilter:'blur(12px)',
      }}>
      <div className="mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300"
        style={{borderColor:selected?'#C9A961':'rgba(255,255,255,0.2)'}}>
        {selected&&<motion.span initial={{scale:0}} animate={{scale:1}} className="w-1.5 h-1.5 rounded-full block" style={{background:'#C9A961'}}/>}
      </div>
      <input type="radio" name={name} className="sr-only" checked={selected} onChange={()=>onChange(value)}/>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="label text-sm">{label}</span>
          {badge&&<span className="label text-[9px] px-2 py-0.5" style={{border:'1px solid rgba(201,169,97,0.5)',color:'#C9A961'}}>{badge}</span>}
        </div>
        {description&&<p className="text-xs text-mute mt-1">{description}</p>}
      </div>
    </motion.label>
  )
}

/* ── Main Checkout ── */
export function Checkout(){
  const {cart,coupon,clear}=useApp();const nav=useNavigate()
  const [step,setStep]=useState(0);const [f,setF]=useState<any>({ship:'standard',method:'card'})
  const [err,setErr]=useState<any>({});const [busy,setBusy]=useState(false);const [fail,setFail]=useState('')
  const ls=lines(cart),t=pricing(ls,coupon,f.ship,f.gift),set=(k:string,v:any)=>setF({...f,[k]:v})

  const inp=`${glassInp} border-b`

  if(!ls.length)return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AmbientBg/>
      <div className="relative z-10 text-center max-w-lg px-5 py-32">
        <p className="label text-mute mb-6">Your bag is empty</p>
        <h1 className="font-serif text-6xl">Nothing here yet</h1>
        <div className="mt-10"><More to="/new-in">Explore new arrivals</More></div>
      </div>
    </div>
  )

  const req:any=[['email','name','phone','address','city','state','pin'],[],f.method==='card'?['number','exp','cvc']:f.method==='upi'?['upi']:[]]
  const next=async()=>{
    const e:any={};req[step].forEach((k:string)=>!(f[k]||'').trim()&&(e[k]='Required'))
    if(step===0){!e.email&&!/^\S+@\S+\.\S+$/.test(f.email)&&(e.email='Valid email required');!e.pin&&!/^\d{6}$/.test(f.pin)&&(e.pin='6-digit pincode required')}
    if(step===2&&f.method==='card'&&!e.number&&f.number.replace(/\s/g,'').length<12)e.number='Valid card number required'
    setErr(e);if(Object.keys(e).length)return;if(step<2)return setStep(step+1)
    setBusy(true);setFail('');const r=await payments.charge(t.total,f.method,f)
    if(!r.ok){setBusy(false);return setFail(r.error||'Payment failed. Please try again.')}
    const o=await orders.create({items:ls.map((i:any)=>({id:i.id,qty:i.qty,name:i.p.name,brand:i.p.brand,price:i.p.price,image:i.p.images[0]})),totals:t,customer:{name:f.name,email:f.email,phone:f.phone,address:`${f.address}, ${f.city}, ${f.state} ${f.pin}`},shipping:f.ship,method:f.method,ref:r.ref!,gift:f.gift?(f.giftMsg||'Gift'):''})
    clear();nav(`/order/${o.id}`)
  }

  return (
    <div className="relative min-h-screen">
      <AmbientBg/>
      <div className="relative z-10 max-w-[1320px] mx-auto px-5 md:px-10 py-14">
        {/* Header */}
        <div className="mb-12 flex items-center gap-4">
          <Link to="/" className="font-serif text-2xl tracking-widest hover:opacity-70 transition-opacity">CAD</Link>
          <ChevronRight size={14} className="text-mute" strokeWidth={1}/>
          <span className="label text-mute text-xs">Secure Checkout</span>
          <div className="flex items-center gap-1.5 ml-1 px-2.5 py-1" style={{background:'rgba(201,169,97,0.08)',border:'1px solid rgba(201,169,97,0.2)'}}>
            <Lock size={10} className="text-gold"/>
            <span className="label text-gold text-[9px]">SSL Secured</span>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-10 lg:gap-14">
          {/* Left: form */}
          <div className="md:col-span-3">
            <StepBar step={step}/>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}} transition={{duration:.35,ease:'easeOut'}}>

                {/* STEP 0: Information */}
                {step===0&&<GlassCard className="p-8">
                  <h2 className="font-serif text-3xl mb-8">Your information</h2>
                  <div className="grid md:grid-cols-2 gap-x-8 gap-y-7">
                    <Field id="email" label="Email address" err={err.email} span>
                      <input id="email" type="email" autoComplete="email" value={f.email||''} onChange={e=>set('email',e.target.value)}
                        className={inp} placeholder="your@email.com"
                        style={{borderColor:err.email?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                    <Field id="name" label="Full name" err={err.name}>
                      <input id="name" autoComplete="name" value={f.name||''} onChange={e=>set('name',e.target.value)}
                        className={inp} placeholder="As on ID"
                        style={{borderColor:err.name?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                    <Field id="phone" label="Phone" err={err.phone}>
                      <input id="phone" type="tel" autoComplete="tel" value={f.phone||''} onChange={e=>set('phone',e.target.value)}
                        className={inp} placeholder="+91"
                        style={{borderColor:err.phone?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                    <Field id="address" label="Street address" err={err.address} span>
                      <input id="address" autoComplete="address-line1" value={f.address||''} onChange={e=>set('address',e.target.value)}
                        className={inp} placeholder="Building, street"
                        style={{borderColor:err.address?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                    <Field id="city" label="City" err={err.city}>
                      <input id="city" autoComplete="address-level2" value={f.city||''} onChange={e=>set('city',e.target.value)}
                        className={inp}
                        style={{borderColor:err.city?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                    <Field id="state" label="State" err={err.state}>
                      <input id="state" autoComplete="address-level1" value={f.state||''} onChange={e=>set('state',e.target.value)}
                        className={inp}
                        style={{borderColor:err.state?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                    <Field id="pin" label="Pincode" err={err.pin}>
                      <input id="pin" inputMode="numeric" maxLength={6} value={f.pin||''} onChange={e=>set('pin',e.target.value)}
                        className={inp} placeholder="6 digits"
                        style={{borderColor:err.pin?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                  </div>
                </GlassCard>}

                {/* STEP 1: Delivery */}
                {step===1&&<GlassCard className="p-8">
                  <h2 className="font-serif text-3xl mb-8">Delivery options</h2>
                  <div className="space-y-3">
                    <Radio name="ship" value="standard" current={f.ship} onChange={(v:string)=>set('ship',v)} label="Standard insured delivery" description="3–5 working days · Complimentary on orders above ₹50,000"/>
                    <Radio name="ship" value="express" current={f.ship} onChange={(v:string)=>set('ship',v)} label="Express delivery" description="1–2 working days · ₹1,500" badge="Fastest"/>
                  </div>
                  <div className="mt-8 pt-6" style={{borderTop:'1px solid rgba(201,169,97,0.12)'}}>
                    <label className="flex items-start gap-4 cursor-pointer group p-5 transition-all duration-300"
                      style={{
                        background:f.gift?'rgba(201,169,97,0.05)':'rgba(255,255,255,0.01)',
                        border:f.gift?'1px solid rgba(201,169,97,0.3)':'1px solid rgba(255,255,255,0.06)',
                        backdropFilter:'blur(12px)'
                      }}>
                      <div className="mt-0.5 w-4 h-4 border-2 flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{borderColor:f.gift?'#C9A961':'rgba(255,255,255,0.2)',background:f.gift?'rgba(201,169,97,0.15)':'transparent'}}>
                        {f.gift&&<Check size={10} className="text-gold" strokeWidth={3}/>}
                      </div>
                      <input type="checkbox" className="sr-only" checked={!!f.gift} onChange={e=>set('gift',e.target.checked)}/>
                      <div>
                        <span className="label text-sm">Luxury gift wrapping</span>
                        <p className="text-xs text-mute mt-1">Presented in a CAD signature box with satin ribbon. +₹500</p>
                      </div>
                    </label>
                    {f.gift&&<textarea value={f.giftMsg||''} onChange={e=>set('giftMsg',e.target.value)}
                      placeholder="Personal gift message (optional)" rows={3}
                      className="w-full py-3 px-4 outline-none text-sm mt-3 placeholder:text-mute/40 transition-all duration-300 resize-none"
                      style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(201,169,97,0.2)'}}/>}
                  </div>
                </GlassCard>}

                {/* STEP 2: Payment */}
                {step===2&&<GlassCard className="p-8">
                  <h2 className="font-serif text-3xl mb-8">Payment</h2>
                  <div className="space-y-3">
                    <Radio name="method" value="card" current={f.method} onChange={(v:string)=>set('method',v)} label="Credit / Debit card" description="Visa, Mastercard, Amex, RuPay"/>
                    <Radio name="method" value="upi" current={f.method} onChange={(v:string)=>set('method',v)} label="UPI" description="Pay instantly via any UPI app"/>
                    <Radio name="method" value="cod" current={f.method} onChange={(v:string)=>set('method',v)} label="Cash on delivery" description="Available on orders under ₹1,00,000"/>
                  </div>
                  {f.method==='card'&&<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="grid md:grid-cols-2 gap-x-8 gap-y-7 mt-8 pt-6" style={{borderTop:'1px solid rgba(201,169,97,0.12)'}}>
                    <Field id="number" label="Card number" err={err.number} span>
                      <input id="number" inputMode="numeric" value={f.number||''} onChange={e=>set('number',e.target.value)}
                        className={inp} placeholder="4242 4242 4242 4242"
                        style={{borderColor:err.number?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                    <Field id="exp" label="Expiry" err={err.exp}>
                      <input id="exp" value={f.exp||''} onChange={e=>set('exp',e.target.value)}
                        className={inp} placeholder="MM/YY"
                        style={{borderColor:err.exp?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                    <Field id="cvc" label="CVC" err={err.cvc}>
                      <input id="cvc" maxLength={4} value={f.cvc||''} onChange={e=>set('cvc',e.target.value)}
                        className={inp} placeholder="···"
                        style={{borderColor:err.cvc?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                  </motion.div>}
                  {f.method==='upi'&&<motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="mt-8 pt-6" style={{borderTop:'1px solid rgba(201,169,97,0.12)'}}>
                    <Field id="upi" label="UPI ID" err={err.upi}>
                      <input id="upi" value={f.upi||''} onChange={e=>set('upi',e.target.value)}
                        className={inp} placeholder="name@bank"
                        style={{borderColor:err.upi?'rgba(248,113,113,0.6)':'rgba(201,169,97,0.2)',background:'transparent'}}/>
                    </Field>
                  </motion.div>}
                  <div className="flex items-center gap-2 mt-6 text-mute" style={{borderTop:'1px solid rgba(255,255,255,0.05)',paddingTop:'1rem'}}>
                    <Lock size={12} className="text-gold/60"/>
                    <p className="text-xs">Demo mode — no real payment is taken. A card ending 0002 simulates a decline.</p>
                  </div>
                </GlassCard>}

              </motion.div>
            </AnimatePresence>

            {fail&&<motion.p initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} role="alert"
              className="mt-6 text-red-400 text-sm px-4 py-3"
              style={{background:'rgba(153,27,27,0.1)',border:'1px solid rgba(153,27,27,0.3)'}}>
              {fail}
            </motion.p>}

            <div className="flex items-center gap-4 mt-8">
              {step>0&&<button onClick={()=>setStep(step-1)}
                className="px-8 py-4 text-[10.5px] tracking-[0.3em] uppercase transition-all duration-300 hover:opacity-70"
                style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.12)'}}>
                ← Back
              </button>}
              <motion.button
                whileTap={{scale:0.98}}
                disabled={busy} onClick={next}
                className="flex-1 py-4 text-[10.5px] tracking-[0.3em] uppercase font-medium transition-all duration-500 flex items-center justify-center gap-2"
                style={{background:busy?'rgba(201,169,97,0.4)':'linear-gradient(135deg,#C9A961 0%,#a88740 100%)',color:'#0C0908',border:'none',opacity:busy?0.7:1}}>
                {busy?<><span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin"/>Processing…</>
                  :step<2?<>Continue <ChevronRight size={14} className="inline"/></>
                  :<><Sparkles size={14}/>Pay {inr(t.total)}</>}
              </motion.button>
            </div>
          </div>

          {/* Right: summary */}
          <div className="md:col-span-2"><Summary ls={ls} t={t}/></div>
        </div>
      </div>
    </div>
  )
}

/* ── Order Confirmation ── */
export function OrderPage(){
  const {id}=useParams();const o=orders.get(id!)
  if(!o)return <div className="max-w-5xl mx-auto px-5 py-32"><p>Order not found.</p></div>
  const tl=['Order placed','Preparing your order','Dispatched','Delivered']
  return (
    <div className="relative min-h-screen">
      <AmbientBg/>
      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-10 py-20">

        {/* Hero confirmation */}
        <div className="text-center mb-16">
          <motion.div initial={{scale:0,rotate:-20}} animate={{scale:1,rotate:0}} transition={{type:'spring',damping:14,stiffness:200}}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{background:'radial-gradient(circle,rgba(201,169,97,0.15) 0%,transparent 70%)',border:'1px solid rgba(201,169,97,0.4)',boxShadow:'0 0 40px rgba(201,169,97,0.15)'}}>
            <Check size={28} className="text-gold" strokeWidth={1.5}/>
          </motion.div>
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:.25,duration:.6}}>
            <p className="label text-gold tracking-widest text-xs mb-3">Thank you, {o.customer.name.split(' ')[0]}</p>
            <h1 className="font-serif text-5xl md:text-7xl">Order confirmed</h1>
            <p className="text-mute mt-4 text-sm max-w-md mx-auto">Order {o.id} · Ref {o.ref} · A confirmation will be sent to {o.customer.email}</p>
          </motion.div>
        </div>

        {/* Tracking bar */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.4}}>
          <GlassCard className="p-8 mb-10">
            <p className="label text-mute text-[10px] tracking-widest mb-8">Order status</p>
            <ol className="relative flex justify-between">
              <div className="absolute top-3.5 left-0 right-0 h-px" style={{background:'rgba(255,255,255,0.08)'}}/>
              <motion.div className="absolute top-3.5 left-0 h-px"
                initial={{width:'0%'}} animate={{width:`${(o.status/3)*100}%`}} transition={{duration:1.2,delay:.6,ease:'easeOut'}}
                style={{background:'linear-gradient(90deg,#C9A961,#a88740)'}}/>
              {tl.map((s,n)=><li key={s} className="relative z-10 flex flex-col items-center gap-2 text-center w-1/4">
                <span className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500"
                  style={{background:'rgba(12,9,8,0.9)',borderColor:n<=o.status?'#C9A961':'rgba(255,255,255,0.15)'}}>
                  {n<o.status?<Check size={12} className="text-gold" strokeWidth={2.5}/>:<span className="w-2 h-2 rounded-full" style={{background:n===o.status?'#C9A961':'rgba(255,255,255,0.15)'}}/>}
                </span>
                <span className="label text-[10px] tracking-widest hidden sm:block" style={{color:n<=o.status?'#C9A961':'rgba(255,255,255,0.3)'}}>{s}</span>
              </li>)}
            </ol>
          </GlassCard>
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.55}} className="grid md:grid-cols-2 gap-8">
          {/* Items */}
          <GlassCard className="p-8">
            <p className="label text-mute text-xs tracking-widest mb-6">Your items</p>
            <ul className="space-y-0 divide-y" style={{borderColor:'rgba(201,169,97,0.1)'}}>
              {o.items.map((i:any)=><li key={i.id} className="flex gap-5 py-5 items-start">
                <div className="w-20 shrink-0" style={{background:'rgba(12,9,8,0.8)'}}>
                  <Img src={i.image} alt={i.name} ratio="aspect-[3/4]"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="label text-gold text-[10px] tracking-widest">{i.brand}</p>
                  <p className="font-serif text-xl leading-tight mt-1">{i.name}</p>
                  <p className="text-sm text-mute mt-1">Qty {i.qty}</p>
                </div>
                <span className="text-sm shrink-0">{inr(i.price*i.qty)}</span>
              </li>)}
            </ul>
          </GlassCard>

          {/* Delivery + Total */}
          <div className="space-y-6">
            <GlassCard className="p-8">
              <p className="label text-mute text-xs tracking-widest mb-3">Delivering to</p>
              <p className="font-serif text-2xl">{o.customer.name}</p>
              <p className="text-mute mt-1 text-sm leading-relaxed">{o.customer.address}</p>
              {o.gift&&<p className="text-sm mt-3 italic text-bone/70">"{o.gift}"</p>}
            </GlassCard>
            <GlassCard className="p-8" glow>
              <div className="flex justify-between items-baseline">
                <span className="label text-mute">Total paid</span>
                <span className="font-serif text-3xl" style={{color:'#C9A961'}}>{inr(o.totals.total)}</span>
              </div>
              <div className="mt-4 pt-4 flex items-center gap-2 text-mute" style={{borderTop:'1px solid rgba(201,169,97,0.1)'}}>
                <ShieldCheck size={13} className="text-gold/50"/>
                <p className="text-xs">Payment secure & confirmed</p>
              </div>
            </GlassCard>
            <Link to="/new-in"
              className="block text-center py-4 text-[10.5px] tracking-[0.3em] uppercase font-medium transition-all duration-500 hover:opacity-90"
              style={{background:'linear-gradient(135deg,#C9A961 0%,#a88740 100%)',color:'#0C0908'}}>
              Continue shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
