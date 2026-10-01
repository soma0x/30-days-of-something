import Pic from '@/components/Pic';
import {redirect} from 'next/navigation';import {requireUser} from '@/lib/auth';import {read,cartItems,total,money} from '@/lib/db';import {checkout} from '@/lib/actions';
export default function Checkout(){const u=requireUser(),items=cartItems(read(),u.id);if(!items.length)redirect('/cart');
 return <><h2>Checkout</h2><div className="two"><form action={checkout} className="form">
  <input name="address" placeholder="Street address" required/><input name="city" placeholder="City" required/>
  <input name="card" placeholder="Card number (demo, not stored)" required/><button className="btn">Place order · {money(total(items))}</button></form>
  <div className="card">{items.map(({p,q})=><div className="row" key={p.id}><span className="inl"><Pic p={p} className="xs"/>{p.name} × {q}</span><span>{money(p.price*q)}</span></div>)}</div></div></>}
