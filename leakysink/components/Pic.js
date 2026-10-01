const K=[...Array(4)].map((_,r)=>[...Array(10)].map((_,c)=><rect key={r+'-'+c} x={28+c*15.2} y={68+r*17} width="12" height="13" rx="3" fill="#fff"/>));
const A={
'🎧':<><path d="M54 122V102a46 46 0 0 1 92 0v20" fill="none" stroke="url(#d)" strokeWidth="9" strokeLinecap="round"/><rect x="40" y="112" width="30" height="52" rx="15" fill="url(#d)"/><rect x="130" y="112" width="30" height="52" rx="15" fill="url(#d)"/><rect x="47" y="122" width="7" height="32" rx="3.5" fill="#fff" opacity=".2"/><rect x="146" y="122" width="7" height="32" rx="3.5" fill="#fff" opacity=".2"/></>,
'⌚':<><rect x="78" y="18" width="44" height="164" rx="16" fill="url(#s)"/><rect x="58" y="60" width="84" height="84" rx="24" fill="url(#d)"/><rect x="64" y="66" width="72" height="72" rx="19" fill="url(#g)"/><circle cx="100" cy="102" r="22" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="3"/><path d="M100 88v14l10 6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round"/><rect x="142" y="84" width="5" height="16" rx="2.5" fill="#8e8e93"/></>,
'💻':<><rect x="38" y="42" width="124" height="86" rx="9" fill="url(#d)"/><rect x="44" y="48" width="112" height="74" rx="5" fill="url(#g)"/><path d="M20 134h160l-8 14a8 8 0 0 1-7 4H35a8 8 0 0 1-7-4z" fill="url(#s)"/><rect x="84" y="134" width="32" height="4" rx="2" fill="#aeaeb2"/></>,
'📷':<><path d="M66 66l8-16h28l8 16z" fill="url(#d)"/><rect x="28" y="64" width="144" height="86" rx="18" fill="url(#d)"/><circle cx="100" cy="108" r="33" fill="url(#s)"/><circle cx="100" cy="108" r="26" fill="#1c1c1e"/><circle cx="100" cy="108" r="16" fill="url(#g)"/><circle cx="93" cy="101" r="4" fill="#fff" opacity=".5"/><circle cx="150" cy="82" r="5" fill="#8e8e93"/></>,
'💡':<><path d="M122 100l30 62H92z" fill="#fff4cc" opacity=".8"/><ellipse cx="82" cy="164" rx="36" ry="8" fill="url(#d)"/><path d="M82 160l-8-62 46-40" fill="none" stroke="url(#s)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/><circle cx="74" cy="98" r="6" fill="#8e8e93"/><rect x="104" y="40" width="50" height="26" rx="13" transform="rotate(38 129 53)" fill="url(#d)"/></>,
'⌨️':<><rect x="16" y="56" width="168" height="88" rx="14" fill="url(#s)"/>{K}</>,
box:<><rect x="46" y="60" width="108" height="90" rx="14" fill="url(#s)"/><rect x="92" y="60" width="16" height="90" fill="#d1d1d6"/></>};
export default function Pic({p,className=''}){
 if(p.image)return <img src={p.image} alt={p.name||''} className={'pic '+className}/>;
 return <svg viewBox="0 0 200 200" className={'pic '+className} role="img" aria-label={p.name||'Product'}>
  <defs><linearGradient id="d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4a4a4d"/><stop offset="1" stopColor="#1c1c1e"/></linearGradient>
  <linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fbfbfd"/><stop offset="1" stopColor="#c7c7cc"/></linearGradient>
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3a3a3f"/><stop offset="1" stopColor="#050506"/></linearGradient></defs>
  <ellipse cx="100" cy="174" rx="64" ry="7" fill="#000" opacity=".12"/>{A[p.emoji]||A.box}</svg>}
