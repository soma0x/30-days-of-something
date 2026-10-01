import fs from 'fs';import path from 'path';import crypto from 'crypto';
const F=path.join(process.cwd(),'data','db.json');
export const uid=()=>crypto.randomBytes(6).toString('hex');
export const money=n=>'$'+Number(n).toFixed(2);
export const hash=(p,salt=crypto.randomBytes(8).toString('hex'))=>salt+':'+crypto.scryptSync(p,salt,32).toString('hex');
const P=(name,price,emoji,category,description)=>({id:uid(),name,price,emoji,category,description,stock:50});
const seed=()=>({
 users:[{id:'admin',name:'Admin',email:'admin@shop.com',pw:hash('admin123'),role:'admin'}],
 products:[P('Studio Headphones',299,'🎧','Audio','Wireless over-ear headphones with adaptive noise cancelling and 40 hours of battery.'),
  P('Smart Watch',399,'⌚','Wearables','Always-on display, health sensors and a week of battery in a slim aluminium case.'),
  P('Laptop Pro 14',1499,'💻','Computers','14-inch display, all-day battery and a silent fanless design.'),
  P('Mirrorless Camera',899,'📷','Cameras','24MP sensor with fast autofocus and 4K video.'),
  P('Desk Lamp',89,'💡','Home','Dimmable LED lamp with warm to cool light and a wireless charging base.'),
  P('Mechanical Keyboard',129,'⌨️','Accessories','Low-profile switches, aluminium frame and hot-swappable keys.')],
 carts:{},orders:[]});
export function write(d){fs.mkdirSync(path.dirname(F),{recursive:true});fs.writeFileSync(F,JSON.stringify(d,null,2))}
export function read(){if(!fs.existsSync(F))write(seed());return JSON.parse(fs.readFileSync(F,'utf8'))}
export const cartItems=(d,id)=>Object.entries(d.carts[id]||{}).map(([pid,q])=>({p:d.products.find(p=>p.id===pid),q})).filter(i=>i.p);
export const total=items=>items.reduce((s,i)=>s+i.p.price*i.q,0);
