import React from 'react';import {createRoot} from 'react-dom/client';import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {registerSW} from 'virtual:pwa-register';registerSW({immediate:true})
import './index.css';import {AppProvider} from './lib/store';import Layout from './components/Layout';import {Checkout,OrderPage} from './pages/Checkout';import * as P from './pages/pages';import {getDepartments} from './data'
createRoot(document.getElementById('root')!).render(<React.StrictMode><AppProvider><BrowserRouter><Routes><Route element={<Layout/>}>
<Route index element={<P.Home/>}/><Route path="new-in" element={<P.NewIn/>}/><Route path="products" element={<P.Listing/>}/>
{getDepartments().map(d=><Route key={d.id} path={d.slug} element={<P.Department dept={d}/>}/>)}
<Route path="brands" element={<P.Houses/>}/><Route path="brands/:id" element={<P.BrandPage/>}/><Route path="product/:slug" element={<P.ProductPage/>}/>
<Route path="about" element={<P.About/>}/><Route path="contact" element={<P.Contact/>}/>
<Route path="account" element={<P.Account/>}/><Route path="checkout" element={<Checkout/>}/><Route path="order/:id" element={<OrderPage/>}/><Route path="wishlist" element={<P.Wishlist/>}/></Route></Routes></BrowserRouter></AppProvider></React.StrictMode>)
