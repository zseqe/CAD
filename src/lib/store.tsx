import {createContext,useContext,useState,useEffect,useCallback} from 'react'
import {currentUser, logout as authLogout, linkGuestOrders, type User} from './auth'

const Ctx=createContext<any>(null)
export const useApp=()=>useContext(Ctx)

function usePersist<T>(k:string,d:T){
  const [v,s]=useState<T>(()=>{try{return JSON.parse(localStorage.getItem(k)||'')??d}catch{return d}})
  useEffect(()=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}},[k,v])
  return [v,s] as const
}

export function AppProvider({children}:any){
  const [cart,setCart]=usePersist<any[]>('cad.cart',[])
  const [wish,setWish]=usePersist<string[]>('cad.wish',[])
  const [recent,setRecent]=usePersist<string[]>('cad.recent',[])
  const [coupon,setCoupon]=usePersist('cad.coupon','')

  // Theme - locked to dark luxury aesthetic
  useEffect(()=>{
    document.documentElement.setAttribute('data-theme','dark')
    try{localStorage.removeItem('cad.theme')}catch{}
  },[])
  const theme = 'dark'
  const toggleTheme = useCallback(()=>{},[])

  // Auth
  const [user,setUser]=useState<User|null>(()=>currentUser())
  const refreshUser=useCallback(()=>{
    const u=currentUser()
    setUser(u)
    if(u) linkGuestOrders(u.email)
  },[])
  const logoutUser=useCallback(()=>{authLogout();setUser(null)},[])

  const [ui,setUi]=useState({search:false,cart:false,menu:false,concierge:false})
  const open=(k:string,v=true)=>setUi(u=>({...u,[k]:v}))
  const add=(id:string,qty=1)=>{setCart(c=>c.find(i=>i.id===id)?c.map(i=>i.id===id?{...i,qty:i.qty+qty}:i):[...c,{id,qty}]);open('cart')}
  const setQty=(id:string,q:number)=>setCart(c=>q<1?c.filter(i=>i.id!==id):c.map(i=>i.id===id?{...i,qty:q}:i))
  const remove=(id:string)=>setCart(c=>c.filter(i=>i.id!==id))
  const clear=()=>{setCart([]);setCoupon('')}
  const toggle=(id:string)=>setWish(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id])
  const view=(id:string)=>setRecent(r=>[id,...r.filter(x=>x!==id)].slice(0,8))

  return <Ctx.Provider value={{cart,wish,recent,coupon,setCoupon,ui,open,add,setQty,remove,clear,toggle,view,user,refreshUser,logoutUser,theme,toggleTheme}}>{children}</Ctx.Provider>
}
