// Commerce logic. Every external service sits behind a small interface so a real provider (Razorpay, Stripe, Supabase, Shopify) can replace the mock.
import {getProduct} from '../data'
export const COUPONS:Record<string,{pct:number;label:string}>={CAD10:{pct:10,label:'10% off'},WELCOME5:{pct:5,label:'5% off'}}
export const FREE_SHIP_OVER=50000
export const lines=(cart:any[])=>cart.map(i=>({...i,p:getProduct(i.id)!})).filter(i=>i.p)
export const pricing=(ls:any[],coupon:string,ship='standard',gift=false)=>{
const subtotal=ls.reduce((a,i)=>a+i.p.price*i.qty,0),c=COUPONS[(coupon||'').toUpperCase()],discount=c?Math.round(subtotal*c.pct/100):0
const shipping=!ls.length?0:ship==='express'?1500:subtotal-discount>=FREE_SHIP_OVER?0:1000,giftFee=gift?500:0,total=subtotal-discount+shipping+giftFee
return{subtotal,discount,shipping,giftFee,total,gst:Math.round(total*18/118)}}
export interface PaymentProvider{name:string;charge(amount:number,method:string,details:any):Promise<{ok:boolean;ref?:string;error?:string}>}
const mock:PaymentProvider={name:'mock',async charge(_a,m,d){await new Promise(r=>setTimeout(r,1400))
if(m==='card'&&(d.number||'').replace(/\s/g,'').endsWith('0002'))return{ok:false,error:'Card declined. Try another card.'}
return{ok:true,ref:'PAY-'+Math.random().toString(36).slice(2,10).toUpperCase()}}}
export const payments:PaymentProvider=mock // ← swap for a Razorpay/Stripe provider
export interface Order{id:string;createdAt:string;items:any[];totals:any;customer:any;shipping:string;method:string;ref:string;status:number;gift?:string;userId?:string;estimatedDelivery?:string;statusHistory?:{status:number;label:string;date:string}[]}
const K='cad.orders',read=():Order[]=>{try{return JSON.parse(localStorage.getItem(K)||'[]')}catch{return[]}}
// Order repository (localStorage now). Replace with API/Supabase calls later; callers stay the same.

function generateStatusHistory(createdAt: string, status: number): {status:number;label:string;date:string}[] {
  const labels = ['Order placed','Order confirmed','Processing','Shipped','Out for delivery','Delivered']
  const history: {status:number;label:string;date:string}[] = []
  const base = new Date(createdAt)
  for (let i = 0; i <= Math.min(status, labels.length - 1); i++) {
    const d = new Date(base.getTime() + i * 24 * 60 * 60 * 1000)
    history.push({ status: i, label: labels[i], date: d.toISOString() })
  }
  return history
}

export const orders={
  list: (userId?: string) => {
    const all = read()
    if (!userId) return all
    return all.filter(o => o.userId === userId || (!o.userId && false))
  },
  listAll: read,
  get:(id:string)=>read().find(o=>o.id===id),
  async create(o:Omit<Order,'id'|'createdAt'|'status'>) {
    const estimatedDelivery = new Date(Date.now() + (o.shipping === 'express' ? 2 : 5) * 24 * 60 * 60 * 1000).toISOString()
    // Get current user ID if logged in
    let userId: string | undefined
    try {
      const session = localStorage.getItem('cad.session')
      if (session) userId = session
    } catch {}
    const full: Order = {
      ...o,
      id: 'CAD-' + Date.now().toString().slice(-8),
      createdAt: new Date().toISOString(),
      status: 0,
      userId,
      estimatedDelivery,
      statusHistory: generateStatusHistory(new Date().toISOString(), 0)
    }
    localStorage.setItem(K, JSON.stringify([full, ...read()]))
    return full
  },
  getUserOrders(userId: string): Order[] {
    return read().filter(o => o.userId === userId)
  }
}
