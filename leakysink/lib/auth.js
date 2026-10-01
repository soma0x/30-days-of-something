import {cookies} from 'next/headers';import {redirect} from 'next/navigation';import crypto from 'crypto';import {read,hash} from './db';
const sign=v=>crypto.createHmac('sha256',process.env.SECRET||'change-me').update(v).digest('hex');
export const check=(p,h)=>hash(p,h.split(':')[0])===h;
export const setSession=id=>cookies().set('s',id+'.'+sign(id),{httpOnly:true,path:'/',maxAge:604800});
export const clearSession=()=>cookies().delete('s');
export function getUser(){const c=cookies().get('s')?.value;if(!c)return null;const[id,sig]=c.split('.');
 return sign(id)===sig?read().users.find(u=>u.id===id)||null:null}
export const requireUser=()=>getUser()||redirect('/login');
export const requireAdmin=()=>{const u=getUser();if(u?.role!=='admin')redirect('/');return u};
