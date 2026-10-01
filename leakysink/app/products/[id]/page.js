import Link from 'next/link';import {notFound} from 'next/navigation';import {read,money} from '@/lib/db';import {addToCart} from '@/lib/actions';import Pic from '@/components/Pic';import ProductCard from '@/components/ProductCard';
export default function Product({params}){const {products}=read(),p=products.find(p=>p.id===params.id);if(!p)notFound();
 const more=products.filter(x=>x.id!==p.id).slice(0,3);
 return <><p className="muted"><Link href="/">Store</Link> / {p.category}</p><div className="detail"><div className="stage"><Pic p={p}/></div><div className="info">
  <h1>{p.name}</h1><div className="price">{money(p.price)}</div><p className="lead">{p.description}</p>
  <form action={addToCart.bind(null,p.id)}><button className="btn block" disabled={p.stock<1}>{p.stock>0?'Add to cart':'Out of stock'}</button></form>
  <ul className="feat"><li>Free delivery on orders over $100</li><li>30-day returns</li><li>{p.stock>0?`In stock · ${p.stock} available`:'Currently unavailable'}</li></ul></div></div>
  {more.length>0&&<section className="sec"><h2>You might also like</h2><div className="grid">{more.map(m=><ProductCard key={m.id} p={m}/>)}</div></section>}</>}
