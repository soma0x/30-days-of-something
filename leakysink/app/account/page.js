import {requireUser} from '@/lib/auth';import {updateProfile} from '@/lib/actions';
export default function Account(){const u=requireUser();
 return <form action={updateProfile} className="card form narrow"><h1 style={{fontSize:'2rem'}}>Account</h1>
  <label className="muted">Name</label><input name="name" defaultValue={u.name} required/>
  <label className="muted">Email</label><input value={u.email} disabled readOnly/><button className="btn">Save changes</button></form>}
