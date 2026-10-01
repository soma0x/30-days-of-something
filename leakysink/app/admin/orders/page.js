import {read,money} from '@/lib/db';import {setStatus} from '@/lib/actions';
export default function AO(){const d=read(),name=id=>d.users.find(u=>u.id===id)?.name||'—';
 return <table><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead><tbody>{[...d.orders].reverse().map(o=><tr key={o.id}>
  <td>#{o.id}</td><td>{name(o.userId)}</td><td>{money(o.total)}</td><td><form action={setStatus.bind(null,o.id)} style={{display:'flex',gap:8}}>
  <select name="status" defaultValue={o.status}>{['Processing','Shipped','Delivered','Cancelled'].map(s=><option key={s}>{s}</option>)}</select><button className="btn sm">Save</button></form></td></tr>)}</tbody></table>}
