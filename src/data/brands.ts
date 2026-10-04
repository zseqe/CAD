import type {Brand} from './types'
// Add a brand = add an object. Images live in /public/images/brands.
const b=(name:string,description:string,featured=true,heroImage?:string):Brand=>{const id=name.toLowerCase().replace(/ /g,'-');return{id,name,logo:`/images/brands/${id}.svg`,heroImage:heroImage||`/images/brands/${id}.jpg`,description,featured}}
export const brands:Brand[]=[
b('Gucci','Eclectic, romantic and unmistakably Florentine.',true,'/images/brands/gucci.avif'),
b('Louis Vuitton','Travel heritage, reimagined for every era.',true,'/images/brands/louis-vuitton.webp'),
b('Fendi','Roman craft, playful luxury and fur-room precision.',true,'/images/brands/fendi.avif'),
b('Dior','Couture elegance from Avenue Montaigne.',true,'/images/brands/dior.webp'),
b('Zara','Contemporary wardrobe essentials, tailored with intent.',false,'/images/brands/zara.jpg'),
b('Parfums de Marly','Fragrance inspired by the eighteenth-century court.'),
b('Maison Crivelli','Niche perfumery built on rare, radiant raw materials.')]
