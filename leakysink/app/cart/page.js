import Pic from '@/components/Pic';
import Link from 'next/link';import {requireUser} from '@/lib/auth';import {read,cartItems,total,money} from '@/lib/db';import {setQty,removeFromCart} from '@/lib/actions';
export default function Cart(){const u=requireUser(),items=cartItems(read(),u.id);
 if(!items.length)return <div className="hero"><h1 style={{fontSize:'2.4rem'}}>Your cart is empty</h1><Link href="/#products" className="btn">Browse products</Link></div>;
 return <><h2>Cart</h2><div className="two"><div>{items.map(({p,q})=><div className="item" key={p.id}>
  <div className="em"><Pic p={p}/></div><div className="grow"><b>{p.name}</b><div className="muted">{money(p.price)}</div></div>
  <div className="qty"><form action={setQty.bind(null,p.id,q-1)}><button>−</button></form>{q}<form action={setQty.bind(null,p.id,q+1)}><button>+</button></form></div>
  <form action={removeFromCart.bind(null,p.id)}><button className="link muted">Remove</button></form></div>)}</div>
  <div className="card"><h3>Summary</h3><div className="row"><span>Total</span><b>{money(total(items))}</b></div><br/>
  <Link href="/checkout" className="btn block">Checkout</Link></div></div></>}
