import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { read, money } from '@/lib/db';

export default function Order({ params }) {
  const u = requireUser();
  const order = read().orders.find(o => o.id === params.id);

  if (!order) notFound();

  // render order...
}