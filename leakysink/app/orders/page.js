import Pic from '@/components/Pic';
import Link from 'next/link';import {requireUser} from '@/lib/auth';import {read,money} from '@/lib/db';
export default function Orders(){const u=requireUser(),os=read().orders.filter(o=>o.userId===u.id).reverse();
 return <><h2>Orders</h2>{!os.length&&<p className="muted">No orders yet. <Link href="/#products"><u>Start shopping</u></Link></p>}
 {os.map(o=><div className="card" key={o.id} style={{marginBottom:16}}><div className="row"><Link href={`/orders/${o.id}`}>
  <b>#{o.id}</b>
</Link><span className="badge">{o.status}</span></div>
  <p className="muted">{new Date(o.date).toLocaleDateString()} · {o.address}</p>
  {o.items.map((i,k)=><div className="row" key={k}><span className="inl"><Pic p={i} className="xs"/>{i.name} × {i.q}</span><span>{money(i.price*i.q)}</span></div>)}
  <hr style={{border:0,borderTop:'1px solid var(--line)'}}/><div className="row"><span>Total</span><b>{money(o.total)}</b></div></div>)}</>}
