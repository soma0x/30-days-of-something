'use client';
import {useFormState} from 'react-dom';import Link from 'next/link';
export default function AuthForm({action,mode}){const [s,a]=useFormState(action,null),reg=mode==='register';
 return <form action={a} className="card form narrow">
  <h1>{reg?'Create account':'Sign in'}</h1>
  {reg&&<input name="name" placeholder="Full name" required/>}
  <input name="email" type="email" placeholder="Email" required/>
  <input name="password" type="password" placeholder="Password" required/>
  {s?.error&&<p className="err">{s.error}</p>}
  <button className="btn">{reg?'Create account':'Sign in'}</button>
  <p className="muted">{reg?<>Have an account? <Link href="/login">Sign in</Link></>:<>New here? <Link href="/register">Create an account</Link></>}</p>
 </form>}
