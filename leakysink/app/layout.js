import './globals.css';import Nav from '@/components/Nav';
export const metadata={title:'leakysink',description:'Simple things. Beautifully made.'};
export default function L({children}){return <html lang="en"><body><Nav/><main className="wrap">{children}</main>
 <footer className="wrap muted foot">© leakysink</footer></body></html>}
