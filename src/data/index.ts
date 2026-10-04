// Data access layer. Swap these functions for Supabase/Sanity/Shopify calls later; UI never imports raw arrays.
import {products} from './products';import {brands} from './brands';import {departments} from './departments'
export {campaigns} from './campaigns';export{edits,journal,services} from './editorial'
export type {Product,Brand,Department} from './types'
export const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-')
export const inr=(n:number)=>'₹'+n.toLocaleString('en-IN')
import {imagesFor} from '../lib/images'
const all=products.map(p=>({...p,images:imagesFor(slug(p.brand),p.slug,p.images)}))
export const getProducts=()=>all
export const getProduct=(k:string)=>all.find(p=>p.slug===k||p.id===k)
export const getBrands=()=>brands
export const getBrand=(id:string)=>brands.find(b=>b.id===id)
export const getDepartments=()=>departments
export const getDepartment=(s:string)=>departments.find(d=>d.slug===s)
export const brandsIn=(dept?:string)=>brands.filter(b=>products.some(p=>slug(p.brand)===b.id&&(!dept||p.department===dept)))
export const deptsOf=(brandId:string)=>departments.filter(d=>products.some(p=>slug(p.brand)===brandId&&p.department===d.id))
export const search=(q:string)=>{const t=q.toLowerCase().trim();return t?all.filter(p=>[p.name,p.brand,p.department,p.subcategory].join(' ').toLowerCase().includes(t)):[]}
export const related=(p:any)=>all.filter(x=>x.id!==p.id&&(x.department===p.department)).slice(0,4)
