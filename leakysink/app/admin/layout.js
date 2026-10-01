import Link from 'next/link';import {requireAdmin} from '@/lib/auth';
export default function A({children}){requireAdmin();
 return <><h2>Admin</h2><div className="tabs"><Link href="/admin">Overview</Link><Link href="/admin/products">Products</Link><Link href="/admin/orders">Orders</Link></div>{children}</>}
