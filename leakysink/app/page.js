import Link from 'next/link';import {read,money} from '@/lib/db';import {addToCart} from '@/lib/actions';import ProductCard from '@/components/ProductCard';import Pic from '@/components/Pic';
const Panel=({p,dark,wide})=><div className={`panel ${dark?'dark':''} ${wide?'wide':''}`}><div className="ptxt">
 <div className="muted">{p.category}</div><h2>{p.name}</h2><p>{p.description}</p>
 <div className="acts"><form action={addToCart.bind(null,p.id)}><button className="btn">Buy · {money(p.price)}</button></form><Link href={`/products/${p.id}`} className="lnk">Learn more ›</Link></div></div><Pic p={p}/></div>;
export default function Home({searchParams}){const {products}=read(),c=searchParams.c,cats=[...new Set(products.map(p=>p.category))],list=c?products.filter(p=>p.category===c):products,[a,b,d]=products;
 return <><section className="hero"><h1>leakysink.<br/></h1><p>A small, carefully chosen collection of everyday tech.</p>
  <Link href="/#products" className="btn">Shop the collection</Link><Link href="/register" className="btn alt">Create account</Link></section>
  {a&&<Panel p={a} dark wide/>}{(b||d)&&<div className="duo">{b&&<Panel p={b}/>}{d&&<Panel p={d}/>}</div>}
  <section id="products" className="sec"><h2>All products</h2>
  <div className="chips"><Link href="/#products" className={!c?'on':''}>All</Link>{cats.map(k=><Link key={k} href={`/?c=${encodeURIComponent(k)}#products`} className={c===k?'on':''}>{k}</Link>)}</div>
  {list.length?<div className="grid">{list.map(p=><ProductCard key={p.id} p={p}/>)}</div>:<p className="muted">No products yet.</p>}</section>
  <section className="perks"><div><b>Free shipping</b><span className="muted">On orders over $100</span></div><div><b>30-day returns</b><span className="muted">No questions asked</span></div><div><b>2-year warranty</b><span className="muted">On every product</span></div></section></>}
