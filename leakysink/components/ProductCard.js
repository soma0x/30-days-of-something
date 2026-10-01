import Link from 'next/link';import {addToCart} from '@/lib/actions';import {money} from '@/lib/db';import Pic from './Pic';
export default function ProductCard({p}){return <div className="card product">
 <Link href={`/products/${p.id}`} className="thumb"><Pic p={p}/></Link>
 <div className="muted">{p.category}</div><h3>{p.name}</h3>
 <div className="row"><b>{money(p.price)}</b><form action={addToCart.bind(null,p.id)}><button className="btn sm" aria-label={`Add ${p.name} to cart`}>Add</button></form></div></div>}
