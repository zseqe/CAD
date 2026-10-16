import {useState} from 'react'
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import {ChevronDown,Shield,Truck,RotateCcw,HelpCircle} from 'lucide-react'

const Wrap=({children,className=''}:any)=><div className={`max-w-[1440px] mx-auto px-5 md:px-10 ${className}`}>{children}</div>
const PageTitle=({icon:Icon,title,subtitle}:any)=>(
  <div className="pt-16 pb-10 md:pt-20 md:pb-14 border-b border-line">
    <Wrap>
      <div className="flex items-center gap-3 mb-4"><Icon size={20} style={{color:'var(--gold)'}} strokeWidth={1.5}/><span className="label text-mute">CAD</span></div>
      <h1 className="font-serif text-5xl md:text-7xl">{title}</h1>
      {subtitle&&<p className="text-mute mt-3 max-w-xl text-lg">{subtitle}</p>}
    </Wrap>
  </div>
)

function Section({title,children}:any){
  return <section className="py-8 border-b border-line">
    <h2 className="font-serif text-2xl md:text-3xl mb-4">{title}</h2>
    <div className="text-mute text-sm leading-relaxed space-y-3">{children}</div>
  </section>
}

// ── Privacy Policy ──
export function PrivacyPage(){
  return <>
    <PageTitle icon={Shield} title="Privacy Policy" subtitle="How we handle your information at CAD."/>
    <Wrap className="py-10 max-w-3xl">
      <p className="text-xs text-mute mb-8 label">Last updated: October 2026 · This is a demonstration website. The following policy is a draft template.</p>

      <Section title="Information We Collect">
        <p>When you create an account or place an order, we collect your name, email address, phone number, and delivery address. This information is used solely to process your orders and manage your account.</p>
        <p>In this demonstration version, all data is stored locally in your browser (localStorage) and is never transmitted to external servers.</p>
      </Section>
      <Section title="How We Use Your Information">
        <p>Your information is used to: process and fulfil orders, manage your account, communicate order updates, and improve our services. We do not sell your personal information to third parties.</p>
      </Section>
      <Section title="Data Storage & Security">
        <p>This demonstration site stores data in your browser's localStorage. No data is transmitted to external servers. Passwords are hashed using SHA-256 before storage (note: this is a demo implementation; a production site would use PBKDF2 or bcrypt with proper salting).</p>
        <p>For a production deployment, data would be stored in encrypted databases with industry-standard security measures including SSL/TLS encryption, regular security audits, and compliance with applicable data protection regulations.</p>
      </Section>
      <Section title="Cookies">
        <p>This site uses essential browser storage (localStorage) to maintain your shopping cart, wishlist, and session. No third-party tracking cookies are used in this demonstration version.</p>
      </Section>
      <Section title="Your Rights">
        <p>You have the right to access, correct, or delete your personal data. Since all data is stored locally in your browser, you can clear it at any time by clearing your browser's site data.</p>
      </Section>
      <Section title="Contact">
        <p>For privacy-related enquiries, please <Link to="/contact" className="underline hover:text-bone">contact us</Link>.</p>
      </Section>
    </Wrap>
  </>
}

// ── Terms & Conditions ──
export function TermsPage(){
  return <>
    <PageTitle icon={Shield} title="Terms & Conditions" subtitle="The terms governing your use of CAD."/>
    <Wrap className="py-10 max-w-3xl">
      <p className="text-xs text-mute mb-8 label">Last updated: October 2026 · This is a demonstration website. These terms are a draft template.</p>

      <Section title="1. Demonstration Website">
        <p>CAD is a demonstration e-commerce website. No real products are sold, no real payments are processed, and no real deliveries are made. All orders, payments, and tracking information shown on this site are simulated for demonstration purposes only.</p>
      </Section>
      <Section title="2. Account Registration">
        <p>You may create an account to access personalised features such as order history and saved addresses. You are responsible for maintaining the confidentiality of your account credentials. Account creation is optional — you may browse and use the demonstration checkout as a guest.</p>
      </Section>
      <Section title="3. Products & Pricing">
        <p>Product information, images, and prices are displayed for demonstration purposes. Prices are shown in Indian Rupees (INR) and include GST. Actual product availability, pricing, and specifications would be confirmed at the time of a real purchase.</p>
      </Section>
      <Section title="4. Orders & Payment">
        <p>All checkout and payment processes on this site are simulated. No real charges are made to any payment method. Card numbers entered are not validated against real payment networks. A card ending in 0002 is used to simulate a payment decline.</p>
      </Section>
      <Section title="5. Intellectual Property">
        <p>Brand names, logos, and product images displayed on this site belong to their respective owners. They are used here for demonstration purposes only and do not imply any endorsement or affiliation.</p>
      </Section>
      <Section title="6. Limitation of Liability">
        <p>This demonstration website is provided "as is" without any warranties. The site owners are not liable for any damages arising from the use of this demonstration platform.</p>
      </Section>
      <Section title="7. Contact">
        <p>For questions about these terms, please <Link to="/contact" className="underline hover:text-bone">contact us</Link>.</p>
      </Section>
    </Wrap>
  </>
}

// ── Shipping & Delivery ──
export function ShippingPage(){
  return <>
    <PageTitle icon={Truck} title="Shipping & Delivery" subtitle="How orders are delivered from CAD."/>
    <Wrap className="py-10 max-w-3xl">
      <p className="text-xs text-mute mb-8 label">Note: This is a demonstration website. No real deliveries are made.</p>

      <Section title="Delivery Options">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-5 border border-line">
            <h3 className="font-serif text-xl mb-2">Standard Delivery</h3>
            <p>3–5 working days</p>
            <p className="mt-1">Complimentary on orders over ₹50,000</p>
            <p>₹1,000 for orders under ₹50,000</p>
          </div>
          <div className="p-5 border border-line">
            <h3 className="font-serif text-xl mb-2">Express Delivery</h3>
            <p>1–2 working days</p>
            <p className="mt-1">₹1,500 flat rate</p>
          </div>
        </div>
      </Section>
      <Section title="Tracking Your Order">
        <p>Once your order is dispatched, you will receive a tracking reference. You can track your order status from your account dashboard under "My Orders".</p>
        <p>In this demonstration, order tracking uses simulated statuses to show how the tracking experience would work.</p>
      </Section>
      <Section title="Delivery Area">
        <p>Delivery is available across India. For this demonstration, you can enter any valid 6-digit pincode during checkout.</p>
      </Section>
      <Section title="Packaging">
        <p>Every CAD order arrives in signature packaging — a matte black box with embossed gold logo, satin ribbon, and tissue paper. Luxury gift wrapping is available for an additional ₹500 at checkout.</p>
      </Section>
    </Wrap>
  </>
}

// ── Returns & Refunds ──
export function ReturnsPage(){
  return <>
    <PageTitle icon={RotateCcw} title="Returns & Refunds" subtitle="Our return policy for peace of mind."/>
    <Wrap className="py-10 max-w-3xl">
      <p className="text-xs text-mute mb-8 label">Note: This is a demonstration website. No real returns are processed.</p>

      <Section title="Return Window">
        <p>Returns are accepted within 14 days of delivery. Items must be in their original, unworn condition with all tags and packaging intact.</p>
      </Section>
      <Section title="How to Return">
        <p>1. Log into your account and navigate to "My Orders".</p>
        <p>2. Select the order containing the item you wish to return.</p>
        <p>3. Follow the return instructions to schedule a pickup.</p>
        <p>In this demonstration, return functionality is not actively processed.</p>
      </Section>
      <Section title="Refund Process">
        <p>Once we receive and inspect your returned item, a refund will be issued to your original payment method within 7–10 working days.</p>
      </Section>
      <Section title="Non-Returnable Items">
        <p>Perfumes and fragrances that have been opened or used cannot be returned for hygiene reasons. Items marked as "Final Sale" are not eligible for return.</p>
      </Section>
      <Section title="Exchanges">
        <p>We currently do not offer direct exchanges. Please return the item and place a new order for the desired product.</p>
      </Section>
    </Wrap>
  </>
}

// ── FAQ ──
export function FAQPage(){
  const [openQ,setOpenQ]=useState<number|null>(0)
  const faqs=[
    {q:'Is this a real store?',a:'CAD is a demonstration e-commerce website. No real products are sold, no real payments are processed, and no real deliveries are made. All functionality is simulated for demonstration purposes.'},
    {q:'Do I need to create an account to shop?',a:'No. You can browse all products, add items to your cart, and complete the demonstration checkout as a guest. Creating an account is entirely optional and gives you access to features like order history, saved addresses, and a personal dashboard.'},
    {q:'How does the demo payment work?',a:'The checkout process simulates a payment flow. No real charges are made. You can use any card number (e.g., 4242 4242 4242 4242) for a successful transaction. A card ending in 0002 simulates a declined payment. Try the promo code CAD10 for a 10% demo discount.'},
    {q:'How do I track my order?',a:'After placing an order, you can view its status on the order confirmation page or from your account dashboard under "My Orders". Order statuses are simulated and progress automatically for demonstration purposes.'},
    {q:'What brands are featured?',a:'CAD features curated selections from Gucci, Louis Vuitton, Fendi, Dior, Zara, Parfums de Marly, Maison Crivelli, and Amouage. Brand names and images are used for demonstration purposes only.'},
    {q:'How does the wishlist work?',a:'Click the heart icon on any product to save it to your wishlist. Your wishlist persists across browser sessions using local storage.'},
    {q:'Is my data secure?',a:'All data in this demonstration is stored locally in your browser (localStorage). No data is transmitted to external servers. Passwords are hashed before storage. For more details, see our Privacy Policy.'},
    {q:'Can I use this on mobile?',a:'Yes. CAD is fully responsive and works on all devices including mobile phones, tablets, and desktops.'},
    {q:'What payment methods are supported?',a:'The demo supports Credit/Debit Card, UPI, and Cash on Delivery as simulated payment options.'},
    {q:'How do I contact support?',a:'Visit our Contact page to send a message, or use the CAD Concierge widget in the bottom-right corner for quick assistance.'},
  ]

  return <>
    <PageTitle icon={HelpCircle} title="Frequently Asked Questions" subtitle="Everything you need to know about CAD."/>
    <Wrap className="py-10 max-w-3xl">
      <div className="divide-y divide-line">
        {faqs.map((f,i)=>(
          <div key={i}>
            <button onClick={()=>setOpenQ(openQ===i?null:i)} aria-expanded={openQ===i}
              className="w-full flex justify-between items-center py-5 text-left group">
              <span className="font-serif text-xl md:text-2xl pr-4 group-hover:opacity-70 transition-opacity">{f.q}</span>
              <motion.span animate={{rotate:openQ===i?180:0}} transition={{duration:.2}}>
                <ChevronDown size={18} strokeWidth={1.5}/>
              </motion.span>
            </button>
            <motion.div initial={false} animate={{height:openQ===i?'auto':0,opacity:openQ===i?1:0}} transition={{duration:.25}} className="overflow-hidden">
              <p className="pb-5 text-mute text-sm leading-relaxed">{f.a}</p>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 text-center glass-card">
        <h2 className="font-serif text-3xl">Still have questions?</h2>
        <p className="text-mute mt-2">Our team is here to help.</p>
        <div className="mt-6">
          <Link to="/contact" className="btn btn-solid">Contact us</Link>
        </div>
      </div>
    </Wrap>
  </>
}
