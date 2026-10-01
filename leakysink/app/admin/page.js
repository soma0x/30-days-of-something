import {read,money} from '@/lib/db';
export default function Overview(){const d=read(),rev=d.orders.reduce((s,o)=>s+o.total,0);
 return <div className="stats">{[['Revenue',money(rev)],['Orders',d.orders.length],['Products',d.products.length],['Customers',d.users.filter(u=>u.role==='user').length]]
  .map(([k,v])=><div className="card" key={k}><span className="muted">{k}</span><b>{v}</b></div>)}</div>}
