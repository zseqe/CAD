import {useState} from 'react'
import {Link,useNavigate} from 'react-router-dom'
import {motion} from 'framer-motion'
import {Eye,EyeOff,Mail,Lock,ArrowRight,User as UserIcon,Check} from 'lucide-react'
import {login,signup} from '../lib/auth'
import {useApp} from '../lib/store'
import {Logo} from '../components/ui'

const Wrap=({children}:any)=><div className="min-h-screen flex items-center justify-center px-5 py-16 md:py-24" style={{background:'var(--bg-ink)'}}>
  {/* Ambient glow */}
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-[0.06]" style={{background:'radial-gradient(circle,var(--gold) 0%,transparent 70%)'}}/>
    <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{background:'radial-gradient(circle,var(--gold) 0%,transparent 70%)'}}/>
  </div>
  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="relative z-10 w-full max-w-md">{children}</motion.div>
</div>

const inputCls="w-full py-3 px-4 pl-11 bg-transparent text-sm outline-none placeholder:opacity-40 transition-all duration-300"
const fieldWrap="relative group"

function InputField({id,label,icon:Icon,type='text',value,onChange,error,placeholder,autoComplete,right}:any){
  return <div className={fieldWrap}>
    <label htmlFor={id} className="label text-mute text-[10px] tracking-widest block mb-1">{label}</label>
    <div className="relative">
      <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" strokeWidth={1.5}/>
      <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
        className={inputCls}
        style={{borderBottom:'1px solid',borderColor:error?'rgba(248,113,113,0.6)':'var(--border-input)',background:'var(--bg-input)'}}/>
      {right&&<div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
    {error&&<p className="text-xs mt-1" style={{color:'#f87171'}}>{error}</p>}
  </div>
}

export function LoginPage(){
  const nav=useNavigate();const {refreshUser}=useApp()
  const [email,setEmail]=useState('');const [pw,setPw]=useState('')
  const [showPw,setShowPw]=useState(false);const [err,setErr]=useState<any>({})
  const [loading,setLoading]=useState(false);const [msg,setMsg]=useState('')
  const [forgotMode,setForgotMode]=useState(false);const [forgotMsg,setForgotMsg]=useState('')

  const handleSubmit=async(e:any)=>{
    e.preventDefault();setMsg('');setErr({})
    const errors:any={}
    if(!email.trim()) errors.email='Email is required'
    else if(!/^\S+@\S+\.\S+$/.test(email)) errors.email='Enter a valid email'
    if(!pw.trim()) errors.pw='Password is required'
    if(Object.keys(errors).length){setErr(errors);return}

    setLoading(true)
    const res=await login(email,pw)
    setLoading(false)
    if(!res.ok){setMsg(res.error||'Login failed.');return}
    refreshUser()
    nav('/account')
  }

  const handleForgot=(e:any)=>{
    e.preventDefault()
    if(!email.trim()||!/^\S+@\S+\.\S+$/.test(email)){setForgotMsg('Enter your email above first.');return}
    setForgotMsg('Demo mode: Password reset emails are not sent. Please create a new account or try remembering your password.')
  }

  return <Wrap>
    <div className="text-center mb-10">
      <Link to="/"><Logo className="text-2xl"/></Link>
      <h1 className="font-serif text-4xl md:text-5xl mt-6">Welcome Back</h1>
      <p className="text-mute mt-2 text-sm">Sign in to your CAD account</p>
    </div>
    <div className="glass-card p-8 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField id="login-email" label="Email address" icon={Mail} type="email" value={email} onChange={(e:any)=>setEmail(e.target.value)} error={err.email} placeholder="your@email.com" autoComplete="email"/>
        <InputField id="login-pw" label="Password" icon={Lock} type={showPw?'text':'password'} value={pw} onChange={(e:any)=>setPw(e.target.value)} error={err.pw} placeholder="Your password" autoComplete="current-password"
          right={<button type="button" onClick={()=>setShowPw(!showPw)} aria-label={showPw?'Hide password':'Show password'} className="text-mute hover:text-bone transition-colors">{showPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>}/>

        {msg&&<motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm px-3 py-2" style={{background:'rgba(153,27,27,0.1)',border:'1px solid rgba(153,27,27,0.3)',color:'#f87171'}}>{msg}</motion.p>}

        <motion.button type="submit" disabled={loading} whileTap={{scale:0.98}}
          className="w-full py-4 text-[10.5px] tracking-[0.3em] uppercase font-medium flex items-center justify-center gap-2 transition-all duration-500"
          style={{background:loading?'rgba(201,169,97,0.4)':'linear-gradient(135deg,#C9A961 0%,#a88740 100%)',color:'#0C0908',opacity:loading?0.7:1}}>
          {loading?<><span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin"/>Signing in…</>:<>Sign in <ArrowRight size={14}/></>}
        </motion.button>
      </form>

      <div className="mt-6 text-center">
        <button onClick={handleForgot} className="label text-mute text-[10px] hover:text-bone transition-colors">Forgot your password?</button>
        {forgotMsg&&<p className="text-xs text-mute mt-2">{forgotMsg}</p>}
      </div>
    </div>

    <p className="text-center mt-8 text-sm text-mute">Don't have an account? <Link to="/signup" className="underline underline-offset-2 hover:text-bone transition-colors">Create one</Link></p>
    <p className="text-center mt-3"><Link to="/" className="label text-mute text-[10px] hover:text-bone transition-colors">← Continue shopping</Link></p>
  </Wrap>
}

export function SignupPage(){
  const nav=useNavigate();const {refreshUser}=useApp()
  const [name,setName]=useState('');const [email,setEmail]=useState('')
  const [pw,setPw]=useState('');const [pw2,setPw2]=useState('')
  const [showPw,setShowPw]=useState(false);const [agree,setAgree]=useState(false)
  const [err,setErr]=useState<any>({});const [loading,setLoading]=useState(false)
  const [msg,setMsg]=useState('')

  const pwStrength=()=>{
    if(pw.length<6)return{label:'Too short',color:'#f87171',pct:20}
    if(pw.length<8)return{label:'Weak',color:'#fbbf24',pct:40}
    if(/[A-Z]/.test(pw)&&/\d/.test(pw)&&pw.length>=10)return{label:'Strong',color:'#34d399',pct:100}
    if(/[A-Z]/.test(pw)||/\d/.test(pw))return{label:'Moderate',color:'#fbbf24',pct:70}
    return{label:'Moderate',color:'#fbbf24',pct:60}
  }
  const strength=pwStrength()

  const handleSubmit=async(e:any)=>{
    e.preventDefault();setMsg('');setErr({})
    const errors:any={}
    if(!name.trim()) errors.name='Name is required'
    if(!email.trim()) errors.email='Email is required'
    else if(!/^\S+@\S+\.\S+$/.test(email)) errors.email='Enter a valid email'
    if(!pw) errors.pw='Password is required'
    else if(pw.length<6) errors.pw='At least 6 characters'
    if(pw2!==pw) errors.pw2='Passwords do not match'
    if(!agree) errors.agree='You must agree to the terms'
    if(Object.keys(errors).length){setErr(errors);return}

    setLoading(true)
    const res=await signup(name,email,pw)
    setLoading(false)
    if(!res.ok){setMsg(res.error||'Signup failed.');return}
    refreshUser()
    nav('/account')
  }

  return <Wrap>
    <div className="text-center mb-10">
      <Link to="/"><Logo className="text-2xl"/></Link>
      <h1 className="font-serif text-4xl md:text-5xl mt-6">Create Account</h1>
      <p className="text-mute mt-2 text-sm">Join the world of CAD</p>
    </div>
    <div className="glass-card p-8 md:p-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField id="signup-name" label="Full name" icon={UserIcon} value={name} onChange={(e:any)=>setName(e.target.value)} error={err.name} placeholder="Your full name" autoComplete="name"/>
        <InputField id="signup-email" label="Email address" icon={Mail} type="email" value={email} onChange={(e:any)=>setEmail(e.target.value)} error={err.email} placeholder="your@email.com" autoComplete="email"/>
        <div>
          <InputField id="signup-pw" label="Password" icon={Lock} type={showPw?'text':'password'} value={pw} onChange={(e:any)=>setPw(e.target.value)} error={err.pw} placeholder="At least 6 characters" autoComplete="new-password"
            right={<button type="button" onClick={()=>setShowPw(!showPw)} aria-label={showPw?'Hide password':'Show password'} className="text-mute hover:text-bone transition-colors">{showPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>}/>
          {pw&&<div className="mt-2">
            <div className="h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.1)'}}>
              <motion.div className="h-full rounded-full" initial={{width:0}} animate={{width:`${strength.pct}%`}} style={{background:strength.color}}/>
            </div>
            <p className="text-[10px] mt-1" style={{color:strength.color}}>{strength.label}</p>
          </div>}
        </div>
        <InputField id="signup-pw2" label="Confirm password" icon={Lock} type={showPw?'text':'password'} value={pw2} onChange={(e:any)=>setPw2(e.target.value)} error={err.pw2} placeholder="Re-enter your password" autoComplete="new-password"/>

        {/* Terms agreement */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="mt-0.5 w-4 h-4 border-2 flex items-center justify-center shrink-0 transition-all duration-300"
            style={{borderColor:agree?'var(--gold)':'var(--line)',background:agree?'rgba(201,169,97,0.15)':'transparent'}}>
            {agree&&<Check size={10} style={{color:'var(--gold)'}} strokeWidth={3}/>}
          </div>
          <input type="checkbox" className="sr-only" checked={agree} onChange={e=>setAgree(e.target.checked)}/>
          <span className="text-xs text-mute leading-relaxed">I agree to the <Link to="/terms" className="underline hover:text-bone">Terms & Conditions</Link> and <Link to="/privacy" className="underline hover:text-bone">Privacy Policy</Link></span>
        </label>
        {err.agree&&<p className="text-xs" style={{color:'#f87171'}}>{err.agree}</p>}

        {msg&&<motion.p initial={{opacity:0}} animate={{opacity:1}} className="text-sm px-3 py-2" style={{background:'rgba(153,27,27,0.1)',border:'1px solid rgba(153,27,27,0.3)',color:'#f87171'}}>{msg}</motion.p>}

        <motion.button type="submit" disabled={loading} whileTap={{scale:0.98}}
          className="w-full py-4 text-[10.5px] tracking-[0.3em] uppercase font-medium flex items-center justify-center gap-2 transition-all duration-500"
          style={{background:loading?'rgba(201,169,97,0.4)':'linear-gradient(135deg,#C9A961 0%,#a88740 100%)',color:'#0C0908',opacity:loading?0.7:1}}>
          {loading?<><span className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin"/>Creating account…</>:<>Create account <ArrowRight size={14}/></>}
        </motion.button>
      </form>
    </div>

    <p className="text-center mt-8 text-sm text-mute">Already have an account? <Link to="/login" className="underline underline-offset-2 hover:text-bone transition-colors">Sign in</Link></p>
    <p className="text-center mt-3"><Link to="/" className="label text-mute text-[10px] hover:text-bone transition-colors">← Continue shopping</Link></p>
  </Wrap>
}
