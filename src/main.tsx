import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {registerSW} from 'virtual:pwa-register';registerSW({immediate:true})
import './index.css';import {AppProvider} from './lib/store';import Layout from './components/Layout';import {Checkout,OrderPage} from './pages/Checkout';import * as P from './pages/pages';import {getDepartments} from './data'
import {LoginPage,SignupPage} from './pages/Auth'
import {PrivacyPage,TermsPage,ShippingPage,ReturnsPage,FAQPage} from './pages/InfoPages'

createRoot(document.getElementById('root')!).render(<React.StrictMode><AppProvider><BrowserRouter><Routes><Route element={<Layout/>}>
<Route index element={<P.Home/>}/>
<Route path="new-in" element={<P.NewIn/>}/>
<Route path="products" element={<P.Listing/>}/>
{getDepartments().map(d=><Route key={d.id} path={d.slug} element={<P.Department dept={d}/>}/>)}
<Route path="brands" element={<P.Houses/>}/>
<Route path="brands/:id" element={<P.BrandPage/>}/>
<Route path="product/:slug" element={<P.ProductPage/>}/>
<Route path="about" element={<P.About/>}/>
<Route path="contact" element={<P.Contact/>}/>
<Route path="account" element={<P.Account/>}/>
<Route path="checkout" element={<Checkout/>}/>
<Route path="order/:id" element={<OrderPage/>}/>
<Route path="wishlist" element={<P.Wishlist/>}/>
{/* Auth pages */}
<Route path="login" element={<LoginPage/>}/>
<Route path="signup" element={<SignupPage/>}/>
{/* Info pages */}
<Route path="privacy" element={<PrivacyPage/>}/>
<Route path="terms" element={<TermsPage/>}/>
<Route path="shipping" element={<ShippingPage/>}/>
<Route path="returns" element={<ReturnsPage/>}/>
<Route path="faq" element={<FAQPage/>}/>
{/* 404 fallback */}
<Route path="*" element={<NotFound/>}/>
</Route></Routes></BrowserRouter></AppProvider></React.StrictMode>)

function NotFound(){return <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center"><h1 className="font-serif text-6xl md:text-8xl">404</h1><p className="text-mute mt-4 text-lg">Page not found</p><a href="/" className="btn btn-solid mt-8">Return home</a></div>}
