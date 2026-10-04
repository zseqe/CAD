import {useState} from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import {inr} from '../data'
import {useApp} from '../lib/store'
import {lines,pricing,COUPONS,payments,orders} from '../lib/commerce'
import {Img,More} from '../components/ui'
const Wrap=({children}:any)=><div className="max-w-[1200px] mx-auto px-5 md:px-10 py-14">{children}</div>
const steps=['Information','Delivery','Payment']

function Summary({ls,t}:any){const {coupon,setCoupon}=useApp();const [code,setCode]=useState('');const [msg,setMsg]=useState('')
const apply=()=>{const c=code.trim().toUpperCase();if(COUPONS[c]){setCoupon(c);setMsg('');setCode('')}else setMsg('That code is not valid.')}
const row=(l:string,v:string)=><div className="flex justify-between text-sm"><span>{l}</span><span>{v}</span></div>
return <aside className="bg-panel p-6 md:p-8 h-fit space-y-5"><h2 className="font-serif text-3xl">Your bag</h2>
{ls.map((i:any)=><div key={i.id} className="flex gap-4"><Img src={i.p.images[0]} alt={i.p.name} className="w-16"/><div className="flex-1"><p className="label text-mute">{i.p.brand}</p><p className="font-serif text-lg">{i.p.name}</p><p className="text-sm text-mute">Qty {i.qty}</p></div><span className="text-sm">{inr(i.p.price*i.qty)}</span></div>)}
<div className="flex gap-3 border-b border-bone"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Promo code (try CAD10)" aria-label="Promo code" className="flex-1 bg-transparent py-2 outline-none"/><button onClick={apply} className="label">Apply</button></div>
{msg&&<p className="text-xs text-red-800">{msg}</p>}{coupon&&<p className="text-xs">Applied: {coupon} · {COUPONS[coupon]?.label} <button onClick={()=>setCoupon('')} className="underline">remove</button></p>}
<div className="space-y-2 border-t border-line pt-4">{row('Subtotal',inr(t.subtotal))}{t.discount>0&&row('Discount','−'+inr(t.discount))}{row('Delivery',t.shipping?inr(t.shipping):'Complimentary')}{t.giftFee>0&&row('Luxury gift wrapping',inr(t.giftFee))}
<div className="flex justify-between font-serif text-2xl pt-2"><span>Total</span><span>{inr(t.total)}</span></div><p className="text-xs text-mute">Includes GST of {inr(t.gst)}</p></div></aside>}

export function Checkout(){
const {cart,coupon,clear}=useApp();const nav=useNavigate();const [step,setStep]=useState(0);const [f,setF]=useState<any>({ship:'standard',method:'card'});const [err,setErr]=useState<any>({});const [busy,setBusy]=useState(false);const [fail,setFail]=useState('')
const ls=lines(cart),t=pricing(ls,coupon,f.ship,f.gift),set=(k:string,v:any)=>setF({...f,[k]:v})
if(!ls.length)return <Wrap><h1 className="font-serif text-5xl">Your bag is empty</h1><div className="mt-6"><More to="/new-in">Explore new arrivals</More></div></Wrap>
const F=(k:string,l:string,p:any={})=><div className={p.span?'md:col-span-2':''}><label htmlFor={k} className="label text-mute">{l}</label><input id={k} value={f[k]||''} onChange={e=>set(k,e.target.value)} className="w-full bg-transparent border-b border-bone py-3 outline-none" {...p}/>{err[k]&&<p className="text-xs text-red-800 mt-1">{err[k]}</p>}</div>
const req:any=[['email','name','phone','address','city','state','pin'],[],f.method==='card'?['number','exp','cvc']:f.method==='upi'?['upi']:[]]
const next=async()=>{const e:any={};req[step].forEach((k:string)=>!(f[k]||'').trim()&&(e[k]='Required'))
if(step===0){!e.email&&!/^\S+@\S+\.\S+$/.test(f.email)&&(e.email='Enter a valid email');!e.pin&&!/^\d{6}$/.test(f.pin)&&(e.pin='Enter a 6-digit pincode')}
if(step===2&&f.method==='card'&&!e.number&&f.number.replace(/\s/g,'').length<12)e.number='Enter a valid card number'
setErr(e);if(Object.keys(e).length)return;if(step<2)return setStep(step+1)
setBusy(true);setFail('');const r=await payments.charge(t.total,f.method,f);if(!r.ok){setBusy(false);return setFail(r.error||'Payment failed.')}
const o=await orders.create({items:ls.map((i:any)=>({id:i.id,qty:i.qty,name:i.p.name,brand:i.p.brand,price:i.p.price,image:i.p.images[0]})),totals:t,customer:{name:f.name,email:f.email,phone:f.phone,address:`${f.address}, ${f.city}, ${f.state} ${f.pin}`},shipping:f.ship,method:f.method,ref:r.ref!,gift:f.gift?(f.giftMsg||'Gift'):''})
clear();nav(`/order/${o.id}`)}
const radio=(k:string,v:string,l:string,d?:string)=><label className={`flex gap-3 border p-4 cursor-pointer ${f[k]===v?'border-bone':'border-line'}`}><input type="radio" name={k} checked={f[k]===v} onChange={()=>set(k,v)}/><span><span className="block">{l}</span>{d&&<span className="text-sm text-mute">{d}</span>}</span></label>
return <Wrap><h1 className="font-serif text-5xl mb-8">Checkout</h1><ol className="flex gap-6 label mb-10">{steps.map((s,n)=><li key={s}><button disabled={n>step} onClick={()=>setStep(n)} className={n===step?'border-b border-bone pb-1':'text-mute'}>{s}</button></li>)}</ol>
<div className="grid md:grid-cols-5 gap-12"><div className="md:col-span-3 space-y-8">
{step===0&&<div className="grid md:grid-cols-2 gap-6">{F('email','Email',{type:'email',span:1,autoComplete:'email'})}{F('name','Full name')}{F('phone','Phone',{type:'tel'})}{F('address','Address',{span:1})}{F('city','City')}{F('state','State')}{F('pin','Pincode',{maxLength:6,inputMode:'numeric'})}</div>}
{step===1&&<div className="space-y-3">{radio('ship','standard','Standard insured delivery','3–5 days · complimentary over ₹50,000, otherwise ₹1,000')}{radio('ship','express','Express delivery','1–2 days · ₹1,500')}
<label className="flex gap-3 pt-4"><input type="checkbox" checked={!!f.gift} onChange={e=>set('gift',e.target.checked)}/>Luxury gift wrapping (+₹500)</label>{f.gift&&<textarea value={f.giftMsg||''} onChange={e=>set('giftMsg',e.target.value)} placeholder="Gift message (optional)" rows={3} className="w-full bg-transparent border border-line p-3 outline-none"/>}</div>}
{step===2&&<div className="space-y-3">{radio('method','card','Credit / debit card')}{radio('method','upi','UPI')}{radio('method','cod','Cash on delivery','Available on orders under ₹1,00,000')}
{f.method==='card'&&<div className="grid md:grid-cols-2 gap-6 pt-4">{F('number','Card number',{span:1,inputMode:'numeric',placeholder:'4242 4242 4242 4242'})}{F('exp','Expiry',{placeholder:'MM/YY'})}{F('cvc','CVC',{maxLength:4})}</div>}{f.method==='upi'&&<div className="pt-4">{F('upi','UPI ID',{placeholder:'name@bank'})}</div>}
<p className="text-xs text-mute">Demo mode: no real payment is taken. A card ending 0002 simulates a decline.</p></div>}
{fail&&<p role="alert" className="text-red-800">{fail}</p>}
<div className="flex gap-3">{step>0&&<button onClick={()=>setStep(step-1)} className="btn">Back</button>}<button disabled={busy} onClick={next} className="btn btn-solid">{busy?'Processing…':step<2?'Continue':`Pay ${inr(t.total)}`}</button></div></div>
<div className="md:col-span-2"><Summary ls={ls} t={t}/></div></div></Wrap>}

export function OrderPage(){
const {id}=useParams();const o=orders.get(id!);if(!o)return <Wrap><p>Order not found.</p></Wrap>
const tl=['Order placed','Preparing','Dispatched','Delivered']
return <Wrap><p className="label text-mute">Thank you, {o.customer.name.split(' ')[0]}</p><h1 className="font-serif text-5xl md:text-7xl mt-2">Your order is confirmed</h1><p className="mt-3 text-mute">Order {o.id} · Payment ref {o.ref} · Confirmation sent to {o.customer.email}</p>
<ol className="grid grid-cols-4 gap-2 mt-10 label">{tl.map((s,n)=><li key={s} className={`border-t pt-3 ${n<=o.status?'border-bone':'border-line text-mute'}`}>{s}</li>)}</ol>
<div className="grid md:grid-cols-2 gap-12 mt-12"><ul className="divide-y divide-line">{o.items.map((i:any)=><li key={i.id} className="flex gap-4 py-4"><Img src={i.image} alt={i.name} className="w-20"/><div className="flex-1"><p className="label text-mute">{i.brand}</p><p className="font-serif text-xl">{i.name}</p><p className="text-sm text-mute">Qty {i.qty}</p></div><span>{inr(i.price*i.qty)}</span></li>)}</ul>
<div className="space-y-3"><p className="label text-mute">Delivering to</p><p>{o.customer.name}<br/>{o.customer.address}</p>{o.gift&&<p className="text-sm">Gift note: {o.gift}</p>}<p className="font-serif text-3xl pt-4">Total {inr(o.totals.total)}</p><Link to="/new-in" className="btn mt-4">Continue shopping</Link></div></div></Wrap>}
