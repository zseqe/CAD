import {useState} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {motion,AnimatePresence} from 'framer-motion'
import {Check,ChevronRight,Lock,Package,CreditCard,Truck} from 'lucide-react'
import {inr} from '../data'
import {useApp} from '../lib/store'
import {lines,pricing,COUPONS,payments,orders} from '../lib/commerce'
import {Img,More} from '../components/ui'

const Wrap=({children,className=''}:any)=><div className={`max-w-[1320px] mx-auto px-5 md:px-10 ${className}`}>{children}</div>

/* ── Order Summary Sidebar ── */
function Summary({ls,t}:any){
  const {coupon,setCoupon}=useApp()
  const [code,setCode]=useState('');const [msg,setMsg]=useState('');const [open,setOpen]=useState(true)
  const apply=()=>{const c=code.trim().toUpperCase();if(COUPONS[c]){setCoupon(c);setMsg('');setCode('')}else setMsg('Invalid code.')}
  const row=(l:string,v:string,highlight=false)=><div className={`flex justify-between text-sm ${highlight?'text-gold':''}`}><span className="text-bone/70">{l}</span><span>{v}</span></div>
  return (
    <aside className="bg-panel border border-line/40 h-fit">
      {/* header */}
      <button onClick={()=>setOpen(!open)} className="w-full flex items-center justify-between p-6 border-b border-line/40">
        <span className="font-serif text-2xl">Order Summary</span>
        <span className="label text-mute text-xs">{open?'Hide':'Show'} ({ls.length} {ls.length===1?'item':'items'})</span>
      </button>
      <AnimatePresence>{open&&<motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden">
        {/* items */}
        <div className="p-6 space-y-5 border-b border-line/40">
          {ls.map((i:any)=><div key={i.id} className="flex gap-4 items-start">
            <div className="relative shrink-0 w-20 bg-stone-950">
              <Img src={i.p.images[0]} alt={i.p.name} ratio="aspect-[3/4]"/>
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold text-ink text-[10px] flex items-center justify-center font-medium">{i.qty}</span>
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
        <div className="p-6 border-b border-line/40">
          <div className="flex gap-3 border-b border-bone/40 pb-2">
            <input value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==='Enter'&&apply()} placeholder="Promotional code" aria-label="Promo code" className="flex-1 bg-transparent py-2 outline-none text-sm placeholder:text-mute"/>
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
          <div className="border-t border-line/40 mt-4 pt-4 flex justify-between items-baseline">
            <span className="font-serif text-2xl">Total</span>
            <span className="font-serif text-2xl">{inr(t.total)}</span>
          </div>
          <p className="text-[11px] text-mute">Incl. GST {inr(t.gst)}</p>
        </div>
      </motion.div>}</AnimatePresence>
    </aside>
  )
}

/* ── Step Indicator ── */
const steps=[{label:'Information',icon:Package},{label:'Delivery',icon:Truck},{label:'Payment',icon:CreditCard}]
function StepBar({step}:any){
  return (
    <ol className="flex items-center gap-0 mb-12">
      {steps.map((s,n)=><>
        <li key={s.label} className="flex items-center gap-2">
          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border transition-all duration-500 ${n<step?'bg-gold border-gold text-ink':n===step?'border-bone text-bone':'border-line text-mute'}`}>
            {n<step?<Check size={12} strokeWidth={2.5}/>:n+1}
          </span>
          <span className={`label text-[10px] tracking-widest hidden sm:block transition-colors ${n===step?'text-bone':n<step?'text-gold':'text-mute'}`}>{s.label}</span>
        </li>
        {n<steps.length-1&&<ChevronRight size={14} className="mx-3 text-line" strokeWidth={1}/>}
      </>)}
    </ol>
  )
}

/* ── Field Component ── */
function Field({id,label,err,span,children}:any){
  return (
    <div className={span?'md:col-span-2':''}>
      <label htmlFor={id} className="label text-mute text-[10px] tracking-widest">{label}</label>
      {children}
      {err&&<p className="text-xs text-red-400 mt-1">{err}</p>}
    </div>
  )
}

/* ── Radio Option ── */
function Radio({name,value,current,onChange,label,description,badge}:any){
  const selected=current===value
  return (
    <label className={`flex gap-4 p-5 border cursor-pointer transition-all duration-300 group ${selected?'border-bone bg-panel':'border-line hover:border-bone/40'}`}>
      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${selected?'border-bone':'border-line group-hover:border-bone/40'}`}>
        {selected&&<span className="w-1.5 h-1.5 rounded-full bg-bone block"/>}
      </div>
      <input type="radio" name={name} className="sr-only" checked={selected} onChange={()=>onChange(value)}/>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <span className="label text-sm">{label}</span>
          {badge&&<span className="label text-[9px] border border-gold text-gold px-2 py-0.5">{badge}</span>}
        </div>
        {description&&<p className="text-xs text-mute mt-1">{description}</p>}
      </div>
    </label>
  )
}

/* ── Main Checkout ── */
export function Checkout(){
  const {cart,coupon,clear}=useApp();const nav=useNavigate()
  const [step,setStep]=useState(0);const [f,setF]=useState<any>({ship:'standard',method:'card'})
  const [err,setErr]=useState<any>({});const [busy,setBusy]=useState(false);const [fail,setFail]=useState('')
  const ls=lines(cart),t=pricing(ls,coupon,f.ship,f.gift),set=(k:string,v:any)=>setF({...f,[k]:v})
  const inp='w-full bg-transparent border-b border-bone/30 py-3 outline-none text-sm focus:border-bone transition-colors placeholder:text-mute/50'

  if(!ls.length)return <Wrap className="py-32 text-center"><p className="label text-mute mb-6">Your bag is empty</p><h1 className="font-serif text-6xl">Nothing here yet</h1><div className="mt-10"><More to="/new-in">Explore new arrivals</More></div></Wrap>

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
    <Wrap className="py-14">
      <div className="mb-10 flex items-center gap-4">
        <Link to="/" className="font-serif text-2xl tracking-widest">CAD</Link>
        <ChevronRight size={14} className="text-mute" strokeWidth={1}/>
        <span className="label text-mute text-xs">Secure Checkout</span>
        <Lock size={12} className="text-mute ml-1"/>
      </div>

      <div className="grid md:grid-cols-5 gap-14">
        <div className="md:col-span-3">
          <StepBar step={step}/>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} transition={{duration:.3}}>

              {/* STEP 0: Information */}
              {step===0&&<div>
                <h2 className="font-serif text-3xl mb-8">Your information</h2>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-7">
                  <Field id="email" label="Email address" err={err.email} span>
                    <input id="email" type="email" autoComplete="email" value={f.email||''} onChange={e=>set('email',e.target.value)} className={inp} placeholder="your@email.com"/>
                  </Field>
                  <Field id="name" label="Full name" err={err.name}>
                    <input id="name" autoComplete="name" value={f.name||''} onChange={e=>set('name',e.target.value)} className={inp} placeholder="As on ID"/>
                  </Field>
                  <Field id="phone" label="Phone" err={err.phone}>
                    <input id="phone" type="tel" autoComplete="tel" value={f.phone||''} onChange={e=>set('phone',e.target.value)} className={inp} placeholder="+91"/>
                  </Field>
                  <Field id="address" label="Street address" err={err.address} span>
                    <input id="address" autoComplete="address-line1" value={f.address||''} onChange={e=>set('address',e.target.value)} className={inp} placeholder="Building, street"/>
                  </Field>
                  <Field id="city" label="City" err={err.city}>
                    <input id="city" autoComplete="address-level2" value={f.city||''} onChange={e=>set('city',e.target.value)} className={inp}/>
                  </Field>
                  <Field id="state" label="State" err={err.state}>
                    <input id="state" autoComplete="address-level1" value={f.state||''} onChange={e=>set('state',e.target.value)} className={inp}/>
                  </Field>
                  <Field id="pin" label="Pincode" err={err.pin}>
                    <input id="pin" inputMode="numeric" maxLength={6} value={f.pin||''} onChange={e=>set('pin',e.target.value)} className={inp} placeholder="6 digits"/>
                  </Field>
                </div>
              </div>}

              {/* STEP 1: Delivery */}
              {step===1&&<div>
                <h2 className="font-serif text-3xl mb-8">Delivery options</h2>
                <div className="space-y-3">
                  <Radio name="ship" value="standard" current={f.ship} onChange={(v:string)=>set('ship',v)} label="Standard insured delivery" description="3–5 working days · Complimentary on orders above ₹50,000"/>
                  <Radio name="ship" value="express" current={f.ship} onChange={(v:string)=>set('ship',v)} label="Express delivery" description="1–2 working days · ₹1,500" badge="Fastest"/>
                </div>
                <div className="mt-8 border-t border-line/40 pt-6">
                  <label className="flex items-start gap-4 cursor-pointer group">
                    <div className={`mt-0.5 w-4 h-4 border-2 flex items-center justify-center shrink-0 transition-all ${f.gift?'border-bone bg-bone':'border-line group-hover:border-bone/40'}`}>
                      {f.gift&&<Check size={10} className="text-ink" strokeWidth={3}/>}
                    </div>
                    <input type="checkbox" className="sr-only" checked={!!f.gift} onChange={e=>set('gift',e.target.checked)}/>
                    <div>
                      <span className="label text-sm">Luxury gift wrapping</span>
                      <p className="text-xs text-mute mt-1">Presented in a CAD signature box with satin ribbon. +₹500</p>
                    </div>
                  </label>
                  {f.gift&&<textarea value={f.giftMsg||''} onChange={e=>set('giftMsg',e.target.value)} placeholder="Personal gift message (optional)" rows={3} className="w-full bg-transparent border border-line/40 focus:border-bone p-4 outline-none text-sm mt-4 transition-colors placeholder:text-mute/50"/>}
                </div>
              </div>}

              {/* STEP 2: Payment */}
              {step===2&&<div>
                <h2 className="font-serif text-3xl mb-8">Payment</h2>
                <div className="space-y-3">
                  <Radio name="method" value="card" current={f.method} onChange={(v:string)=>set('method',v)} label="Credit / Debit card" description="Visa, Mastercard, Amex, RuPay"/>
                  <Radio name="method" value="upi" current={f.method} onChange={(v:string)=>set('method',v)} label="UPI" description="Pay instantly via any UPI app"/>
                  <Radio name="method" value="cod" current={f.method} onChange={(v:string)=>set('method',v)} label="Cash on delivery" description="Available on orders under ₹1,00,000"/>
                </div>
                {f.method==='card'&&<div className="grid md:grid-cols-2 gap-x-8 gap-y-7 mt-8 border-t border-line/40 pt-6">
                  <Field id="number" label="Card number" err={err.number} span>
                    <input id="number" inputMode="numeric" value={f.number||''} onChange={e=>set('number',e.target.value)} className={inp} placeholder="4242 4242 4242 4242"/>
                  </Field>
                  <Field id="exp" label="Expiry" err={err.exp}>
                    <input id="exp" value={f.exp||''} onChange={e=>set('exp',e.target.value)} className={inp} placeholder="MM/YY"/>
                  </Field>
                  <Field id="cvc" label="CVC" err={err.cvc}>
                    <input id="cvc" maxLength={4} value={f.cvc||''} onChange={e=>set('cvc',e.target.value)} className={inp} placeholder="···"/>
                  </Field>
                </div>}
                {f.method==='upi'&&<div className="mt-8 border-t border-line/40 pt-6">
                  <Field id="upi" label="UPI ID" err={err.upi}>
                    <input id="upi" value={f.upi||''} onChange={e=>set('upi',e.target.value)} className={inp} placeholder="name@bank"/>
                  </Field>
                </div>}
                <div className="flex items-center gap-2 mt-6 text-mute">
                  <Lock size={12}/>
                  <p className="text-xs">Demo mode — no real payment is taken. A card ending 0002 simulates a decline.</p>
                </div>
              </div>}

            </motion.div>
          </AnimatePresence>

          {fail&&<p role="alert" className="mt-6 text-red-400 text-sm border border-red-900/40 bg-red-900/10 px-4 py-3">{fail}</p>}

          <div className="flex items-center gap-4 mt-10">
            {step>0&&<button onClick={()=>setStep(step-1)} className="btn text-sm">← Back</button>}
            <button disabled={busy} onClick={next} className="btn btn-solid text-sm flex-1 justify-center">
              {busy?<span className="flex items-center gap-2"><span className="w-4 h-4 border border-ink/40 border-t-ink rounded-full animate-spin"/>Processing…</span>:step<2?<span>Continue <ChevronRight size={14} className="inline"/></span>:`Pay ${inr(t.total)}`}
            </button>
          </div>
        </div>

        <div className="md:col-span-2"><Summary ls={ls} t={t}/></div>
      </div>
    </Wrap>
  )
}

/* ── Order Confirmation ── */
export function OrderPage(){
  const {id}=useParams();const o=orders.get(id!)
  if(!o)return <div className="max-w-5xl mx-auto px-5 py-32"><p>Order not found.</p></div>
  const tl=['Order placed','Preparing your order','Dispatched','Delivered']
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-10 py-20">
      {/* Hero confirmation */}
      <div className="text-center mb-16">
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',damping:12}} className="w-16 h-16 rounded-full bg-gold/10 border border-gold flex items-center justify-center mx-auto mb-6">
          <Check size={24} className="text-gold" strokeWidth={1.5}/>
        </motion.div>
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.2}}>
          <p className="label text-gold tracking-widest text-xs mb-3">Thank you, {o.customer.name.split(' ')[0]}</p>
          <h1 className="font-serif text-5xl md:text-7xl">Order confirmed</h1>
          <p className="text-mute mt-4 text-sm max-w-md mx-auto">Order {o.id} · Ref {o.ref} · A confirmation will be sent to {o.customer.email}</p>
        </motion.div>
      </div>

      {/* Tracking bar */}
      <div className="mb-16">
        <ol className="relative flex justify-between">
          <div className="absolute top-3.5 left-0 right-0 h-px bg-line z-0"/>
          <div className="absolute top-3.5 left-0 h-px bg-gold z-0 transition-all duration-1000" style={{width:`${(o.status/3)*100}%`}}/>
          {tl.map((s,n)=><li key={s} className="relative z-10 flex flex-col items-center gap-2 text-center w-1/4">
            <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center bg-ink transition-all ${n<=o.status?'border-gold':'border-line'}`}>
              {n<o.status?<Check size={12} className="text-gold" strokeWidth={2.5}/>:<span className={`w-2 h-2 rounded-full ${n===o.status?'bg-gold':'bg-line'}`}/>}
            </span>
            <span className={`label text-[10px] tracking-widest hidden sm:block ${n<=o.status?'text-bone':'text-mute'}`}>{s}</span>
          </li>)}
        </ol>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Items */}
        <div>
          <p className="label text-mute text-xs tracking-widest mb-6">Your items</p>
          <ul className="divide-y divide-line/40">
            {o.items.map((i:any)=><li key={i.id} className="flex gap-5 py-5 items-start">
              <div className="w-20 shrink-0 bg-stone-950">
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
        </div>
        {/* Delivery + Total */}
        <div className="space-y-8">
          <div>
            <p className="label text-mute text-xs tracking-widest mb-3">Delivering to</p>
            <p className="font-serif text-2xl">{o.customer.name}</p>
            <p className="text-mute mt-1 text-sm leading-relaxed">{o.customer.address}</p>
            {o.gift&&<p className="text-sm mt-3 italic text-bone/70">"{o.gift}"</p>}
          </div>
          <div className="border-t border-line/40 pt-6">
            <div className="flex justify-between items-baseline">
              <span className="label text-mute">Total paid</span>
              <span className="font-serif text-3xl">{inr(o.totals.total)}</span>
            </div>
          </div>
          <Link to="/new-in" className="btn btn-solid w-full justify-center text-sm">Continue shopping</Link>
        </div>
      </div>
    </div>
  )
}
