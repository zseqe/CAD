import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import {execSync} from 'child_process'
import {VitePWA} from 'vite-plugin-pwa'
// Drop a file into public/images and the site picks it up automatically (no restart needed).
const images=()=>({name:'cad-images',configureServer(s:any){s.watcher.add('public/images');s.watcher.on('add',(f:string)=>{if(/public.images/.test(f)){execSync('node scripts/scan-images.mjs');s.ws.send({type:'full-reload'})}})}})
export default defineConfig({plugins:[react(),images(),VitePWA({registerType:'autoUpdate',manifest:{name:'CAD',short_name:'CAD',description:'Modern Luxury Fashion',theme_color:'#0B0B0A',background_color:'#0B0B0A',display:'standalone',icons:[{src:'/icon-192x192.jpg',sizes:'192x192',type:'image/jpeg'},{src:'/icon-512x512.jpg',sizes:'512x512',type:'image/jpeg',purpose:'any maskable'}]}})]});
