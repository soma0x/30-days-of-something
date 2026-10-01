import AuthForm from '@/components/AuthForm';import {login} from '@/lib/actions';
export default function P(){return <AuthForm action={login} mode="login"/>}
