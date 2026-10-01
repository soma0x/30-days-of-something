import Link from 'next/link';import {getUser} from '@/lib/auth';import {read} from '@/lib/db';import {logout} from '@/lib/actions';
export default function Nav(){const u=getUser(),n=u?Object.values(read().carts[u.id]||{}).reduce((a,b)=>a+b,0):0;
 return <nav className="nav"><div className="wrap row">
  <Link href="/" className="logo">leakysink</Link>
  <div className="row gap"><Link href="/#products">Store</Link>{u?.role==='admin'&&<Link href="/admin">Admin</Link>}
   {u?<><Link href="/orders">Orders</Link><Link href="/account">{u.name.split(' ')[0]}</Link>
    <form action={logout}><button className="link">Sign out</button></form></>:<Link href="/login">Sign in</Link>}
   <Link href="/cart" className="pill">Cart · {n}</Link></div></div></nav>}
