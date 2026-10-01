import AuthForm from '@/components/AuthForm';import {register} from '@/lib/actions';
export default function P(){return <AuthForm action={register} mode="register"/>}
