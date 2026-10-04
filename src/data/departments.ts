import type {Department} from './types'
const s=(...n:string[])=>n.map(x=>({id:x.toLowerCase().replace(/ /g,'-'),name:x}))
// Only four departments. Replace /public/images/departments/<slug>.jpg to change imagery.
export const departments:Department[]=[
{id:'watches',name:'Watches',slug:'watches',image:'/images/departments/watches.mp4',tagline:'Time, refined.',blurb:'Considered timepieces from the houses we trust.',subcategories:s('Dress Watches','Sport Watches','Chronographs')},
{id:'clothing',name:'Clothing',slug:'clothing',image:'/images/departments/clothing.avif',tagline:'Defined by the house.',blurb:'Modern silhouettes from the world\'s most distinctive houses.',subcategories:s('Outerwear','Shirts','T-Shirts','Trousers','Dresses','Jackets','Knitwear')},
{id:'bags',name:'Bags',slug:'bags',image:'/images/departments/bags.webp',tagline:'Icons of craftsmanship.',blurb:'Leather, hardware and heritage, shaped by hand.',subcategories:s('Handbags','Shoulder Bags','Crossbody Bags','Tote Bags','Mini Bags','Clutches','Travel Bags')},
{id:'perfumes',name:'Perfumes',slug:'perfumes',image:'/images/departments/perfumes.webp',tagline:'The art of scent.',blurb:'Signature houses and niche ateliers, side by side.',subcategories:s('Eau de Parfum','Eau de Toilette','Niche Fragrance','Discovery Sets')}]
