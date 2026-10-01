'use server';
import {redirect} from 'next/navigation';import {revalidatePath} from 'next/cache';
import {read,write,hash,uid,cartItems,total} from './db';
import {getUser,requireUser,requireAdmin,setSession,clearSession,check} from './auth';
const refresh=()=>revalidatePath('/','layout');

export async function register(_,f){const d=read(),email=f.get('email').toLowerCase().trim();
 if(f.get('password').length<6)return{error:'Password must be at least 6 characters.'};
 if(d.users.some(u=>u.email===email))return{error:'That email is already registered.'};
 const u={id:uid(),name:f.get('name'),email,pw:hash(f.get('password')),role:'user'};d.users.push(u);write(d);setSession(u.id);redirect('/')}
export async function login(_,f){const u=read().users.find(u=>u.email===f.get('email').toLowerCase().trim());
 if(!u||!check(f.get('password'),u.pw))return{error:'Incorrect email or password.'};setSession(u.id);redirect(u.role==='admin'?'/admin':'/')}
export async function logout(){clearSession();redirect('/')}

export async function addToCart(pid){const u=requireUser(),d=read(),c=d.carts[u.id]||={};c[pid]=(c[pid]||0)+1;write(d);refresh()}
export async function setQty(pid,q){const u=requireUser(),d=read(),c=d.carts[u.id]||={};q>0?c[pid]=q:delete c[pid];write(d);refresh()}
export async function removeFromCart(pid){return setQty(pid,0)}

export async function checkout(f){const u=requireUser(),d=read(),items=cartItems(d,u.id);if(!items.length)redirect('/cart');
 d.orders.push({id:uid().toUpperCase(),userId:u.id,date:new Date().toISOString(),status:'Processing',
  address:`${f.get('address')}, ${f.get('city')}`,items:items.map(i=>({name:i.p.name,emoji:i.p.emoji,image:i.p.image||'',price:i.p.price,q:i.q})),total:total(items)});
 d.carts[u.id]={};write(d);refresh();redirect('/orders')}
export async function updateProfile(f){const u=requireUser(),d=read(),x=d.users.find(x=>x.id===u.id);x.name=f.get('name');write(d);refresh()}

export async function saveProduct(f){requireAdmin();const d=read();
 d.products.push({id:uid(),name:f.get('name'),price:+f.get('price'),emoji:'📦',image:f.get('image')||'',category:f.get('category')||'General',description:f.get('description'),stock:+f.get('stock')||0});write(d);refresh()}
export async function deleteProduct(id){requireAdmin();const d=read();d.products=d.products.filter(p=>p.id!==id);write(d);refresh()}
export async function setStatus(id,f){requireAdmin();const d=read();d.orders.find(o=>o.id===id).status=f.get('status');write(d);refresh()}
