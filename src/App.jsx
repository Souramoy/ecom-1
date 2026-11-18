import React,{createContext,useContext,useEffect,useState} from 'react';
import {Routes,Route,Link,NavLink,useNavigate,useParams,useSearchParams} from 'react-router-dom';
import {products,categories,faqs,reviews} from './data/products.js';
const Store=createContext();const useStore=()=>useContext(Store);
const load=(k)=>{try{return JSON.parse(localStorage.getItem(k))||[]}catch{return[]}};
const inr=n=>'₹'+n.toLocaleString('en-IN');
function Provider({children}){
 const [cart,setCart]=useState(()=>load('ss-cart'));const [wish,setWish]=useState(()=>load('ss-wish'));const [toast,setToast]=useState('');
 useEffect(()=>localStorage.setItem('ss-cart',JSON.stringify(cart)),[cart]);
 useEffect(()=>localStorage.setItem('ss-wish',JSON.stringify(wish)),[wish]);
 const say=m=>{setToast(m);setTimeout(()=>setToast(''),2200)};
 const addCart=(id,size,color,qty=1)=>{setCart(c=>{const k=id+'-'+size+'-'+color,f=c.find(x=>x.k===k);return f?c.map(x=>x.k===k?{...x,qty:x.qty+qty}:x):[...c,{k,id,size,color,qty}]});say('Added to cart')};
 const setQty=(k,q)=>setCart(c=>c.map(x=>x.k===k?{...x,qty:Math.max(1,q)}:x));
 const rmCart=k=>{setCart(c=>c.filter(x=>x.k!==k));say('Removed from cart')};
 const toggleWish=id=>setWish(w=>{const h=w.includes(id);say(h?'Removed from wishlist':'Added to wishlist');return h?w.filter(x=>x!==id):[...w,id]});
 return <Store.Provider value={{cart,wish,addCart,setQty,rmCart,toggleWish,say}}>{children}{toast&&<div className="toast" role="status">{toast}</div>}</Store.Provider>}
function Img({src,alt}){const [bad,setBad]=useState(false);return bad?<div className="imgfb" role="img" aria-label={alt}/>:<img src={src} alt={alt} loading="lazy" onError={()=>setBad(true)}/>}
function Stars({r}){return <span className="stars" aria-label={`${r} out of 5`}>★ {r}</span>}
function Card({p}){const {wish,toggleWish,addCart}=useStore();return <article className="card">
 <div className="cimg"><Link to={`/product/${p.id}`}><Img src={p.images[0]} alt={p.name}/></Link>
 {p.discount>0&&<span className="tag">-{p.discount}%</span>}
 <button className="heart" aria-label="Toggle wishlist" onClick={()=>toggleWish(p.id)}>{wish.includes(p.id)?'♥':'♡'}</button>
 <button className="quick" onClick={()=>addCart(p.id,p.sizes[2],p.colors[0][0])}>QUICK ADD</button></div>
 <small>{p.category}</small><h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
 <p><b>{inr(p.price)}</b> {p.discount>0&&<s>{inr(p.originalPrice)}</s>} <Stars r={p.rating}/></p></article>}
const Grid=({list})=>list.length?<div className="grid">{list.map(p=><Card key={p.id} p={p}/>)}</div>:<p className="empty">No products found.</p>;
function Header(){
 const {cart,wish}=useStore();const nav=useNavigate();const [open,setOpen]=useState(false);const [s,setS]=useState(false);const [q,setQ]=useState('');const [bar,setBar]=useState(true);
 const go=e=>{e.preventDefault();nav('/shop?q='+encodeURIComponent(q));setS(false)};
 return <>{bar&&<div className="ann">FREE SHIPPING ON ORDERS OVER ₹2,999<button aria-label="Dismiss" onClick={()=>setBar(false)}>×</button></div>}
 <header className="nav"><button className="burger" aria-label="Menu" onClick={()=>setOpen(!open)}>☰</button><Link to="/" className="logo">SOLE STUDIO</Link>
 <nav className={open?'links open':'links'} onClick={()=>setOpen(false)}><NavLink to="/">Home</NavLink><NavLink to="/shop">Shop</NavLink><NavLink to="/shop?gender=Men">Men</NavLink><NavLink to="/shop?gender=Women">Women</NavLink><NavLink to="/shop?sort=new">New Arrivals</NavLink><NavLink to="/about">About</NavLink></nav>
 <div className="icons"><button aria-label="Search" onClick={()=>setS(true)}>⌕</button><Link to="/contact" aria-label="Account">☺</Link><Link to="/wishlist" aria-label="Wishlist">♡<i>{wish.length}</i></Link><Link to="/cart" aria-label="Cart">👜<i>{cart.reduce((a,c)=>a+c.qty,0)}</i></Link></div></header>
 {s&&<div className="overlay" onClick={()=>setS(false)}><form onClick={e=>e.stopPropagation()} onSubmit={go}><input autoFocus aria-label="Search" placeholder="Search shoes or categories" value={q} onChange={e=>setQ(e.target.value)}/><button className="btn">SEARCH</button></form></div>}</>}
function Footer(){return <footer className="foot"><div><h2>SOLE STUDIO</h2><p>Premium sneakers and lifestyle footwear for everyday movement.</p></div>
 <div><h4>Shop</h4><Link to="/shop?cat=Sneakers">Sneakers</Link><Link to="/shop?cat=Running">Running</Link><Link to="/shop?cat=Casual">Casual</Link></div>
 <div><h4>Help</h4><Link to="/faq">FAQ</Link><Link to="/contact">Contact</Link><Link to="/cart">Cart</Link></div>
 <div><h4>About</h4><Link to="/about">Our Story</Link><p>Instagram · X · YouTube</p><p>VISA · UPI · Mastercard</p></div><small>© 2026 SOLE STUDIO. Demo project.</small></footer>}
function Home(){const [sent,setSent]=useState(false);const {say}=useStore();
 return <>
 <section className="hero"><div><h1>STEP INTO YOUR OWN STYLE.</h1><p>Designed for movement. Built for everyday life.</p><Link className="btn" to="/shop?gender=Men">SHOP MEN</Link> <Link className="btn ghost" to="/shop?gender=Women">SHOP WOMEN</Link></div><Img src={products[0].images[0]} alt="Campaign sneaker"/></section>
 <section className="sec"><h2>SHOP BY CATEGORY</h2><div className="grid">{categories.map(c=><Link key={c.name} to={`/shop?cat=${c.name}`} className="cat"><Img src={c.img} alt={c.name}/><div><h3>{c.name}</h3><p>{c.desc}</p><b>Shop Now →</b></div></Link>)}</div></section>
 <section className="sec"><h2>BEST SELLERS</h2><Grid list={products.filter(p=>p.isBestSeller).slice(0,4)}/></section>
 <section className="sec"><h2>FRESH OFF THE GROUND</h2><Grid list={products.filter(p=>p.isNew).slice(0,4)}/></section>
 <section className="promo"><h2>MADE TO MOVE DIFFERENT.</h2><p>Find your everyday essential. Discover footwear designed to keep up with you.</p><Link className="btn" to="/shop">EXPLORE THE COLLECTION</Link></section>
 <section className="sec split"><Img src={products[5].images[0]} alt="Featured collection"/><div><h2>THE AERO COLLECTION</h2><p>Lightweight uppers, responsive cushioning and a lime-accent finish.</p><Link className="btn" to="/shop?cat=Sports">VIEW COLLECTION</Link></div></section>
 <section className="sec split"><div><h2>MORE THAN JUST SHOES.</h2><p>We believe great footwear should feel as good as it looks. Every step, every journey, every moment — make it yours.</p><Link className="btn" to="/about">ABOUT US</Link></div><Img src={products[9].images[0]} alt="Brand story"/></section>
 <section className="sec"><h2>LOVED BY YOU</h2><div className="grid3">{reviews.map(r=><blockquote key={r[0]}><Stars r={r[2]}/><p>{r[3]}</p><b>{r[0]}</b><small> — {r[1]}</small></blockquote>)}</div></section>
 <section className="promo dark"><h2>GET FIRST ACCESS.</h2><p>Sign up for exclusive releases, new collections and special offers.</p>
 {sent?<p>Thanks for subscribing!</p>:<form className="row" onSubmit={e=>{e.preventDefault();setSent(true);say('Subscribed!')}}><input required type="email" aria-label="Email" placeholder="Email address"/><button className="btn">SUBSCRIBE</button></form>}</section></>}
function Shop(){
 const [sp,setSp]=useSearchParams();const q=(sp.get('q')||'').toLowerCase(),cat=sp.get('cat')||'',gender=sp.get('gender')||'',sort=sp.get('sort')||'featured';
 const [size,setSize]=useState(0),[color,setColor]=useState(''),[max,setMax]=useState(10000),[rate,setRate]=useState(0),[drawer,setDrawer]=useState(false);
 const set=(k,v)=>{const n=new URLSearchParams(sp);v?n.set(k,v):n.delete(k);setSp(n)};
 let list=products.filter(p=>(!q||(p.name+p.category).toLowerCase().includes(q))&&(!cat||p.category===cat)&&(!gender||p.gender===gender)&&(!size||p.sizes.includes(+size))&&(!color||p.colors.some(c=>c[0]===color))&&p.price<=max&&p.rating>=rate);
 list=[...list].sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:sort==='rated'?b.rating-a.rating:sort==='new'?b.isNew-a.isNew:a.id-b.id);
 const clear=()=>{setSp({});setSize(0);setColor('');setMax(10000);setRate(0)};
 return <main className="sec"><small>Home / Shop</small><h1>{gender||cat||'All Shoes'}</h1><p>{list.length} products</p>
 <div className="shop"><aside className={drawer?'filters open':'filters'}>
 <label>Category<select value={cat} onChange={e=>set('cat',e.target.value)}><option value="">All</option>{categories.map(c=><option key={c.name}>{c.name}</option>)}</select></label>
 <label>Gender<select value={gender} onChange={e=>set('gender',e.target.value)}><option value="">All</option><option>Men</option><option>Women</option></select></label>
 <label>Size<select value={size} onChange={e=>setSize(e.target.value)}><option value={0}>All</option>{[6,7,8,9,10,11].map(s=><option key={s}>{s}</option>)}</select></label>
 <label>Color<select value={color} onChange={e=>setColor(e.target.value)}><option value="">All</option>{['White','Black','Grey','Lime'].map(c=><option key={c}>{c}</option>)}</select></label>
 <label>Max price: {inr(max)}<input type="range" min="2000" max="10000" step="500" value={max} onChange={e=>setMax(+e.target.value)}/></label>
 <label>Min rating<select value={rate} onChange={e=>setRate(+e.target.value)}><option value={0}>Any</option><option value={4.3}>4.3+</option><option value={4.6}>4.6+</option></select></label>
 <button className="btn ghost" onClick={clear}>CLEAR ALL</button><button className="btn drawerx" onClick={()=>setDrawer(false)}>APPLY</button></aside>
 <div><div className="bar"><button className="btn ghost fbtn" onClick={()=>setDrawer(true)}>FILTERS</button>
 <select aria-label="Sort" value={sort} onChange={e=>set('sort',e.target.value)}><option value="featured">Featured</option><option value="new">Newest</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rated">Best Rated</option></select></div><Grid list={list}/></div></div></main>}
function Product(){
 const {id}=useParams();const p=products.find(x=>x.id==id);const {addCart,toggleWish,wish,say}=useStore();const nav=useNavigate();
 const [img,setImg]=useState(0),[size,setSize]=useState(0),[col,setCol]=useState(0),[qty,setQty]=useState(1),[guide,setGuide]=useState(false);
 if(!p)return <NotFound/>;
 const add=()=>{if(!size){say('Please select a size');return false}addCart(p.id,size,p.colors[col][0],qty);return true};
 return <main className="sec"><div className="pdp"><div><div className="main"><Img src={p.images[img]} alt={p.name}/></div><div className="thumbs">{p.images.map((s,i)=><button key={i} onClick={()=>setImg(i)} aria-label={`Image ${i+1}`}><Img src={s} alt=""/></button>)}</div></div>
 <div><small>{p.category} · {p.gender}</small><h1>{p.name}</h1><p><b>{inr(p.price)}</b> {p.discount>0&&<><s>{inr(p.originalPrice)}</s> <span className="tag">-{p.discount}%</span></>} <Stars r={p.rating}/> ({p.reviewCount} reviews)</p><p>{p.description}</p>
 <h4>Color: {p.colors[col][0]}</h4><div className="opts">{p.colors.map((c,i)=><button key={c[0]} aria-label={c[0]} className={'sw'+(i===col?' on':'')} style={{background:c[1]}} onClick={()=>setCol(i)}/>)}</div>
 <h4>Size <button className="link" onClick={()=>setGuide(true)}>Size guide</button></h4><div className="opts">{p.sizes.map(s=><button key={s} className={'sz'+(s===size?' on':'')} onClick={()=>setSize(s)}>UK {s}</button>)}</div>
 <h4>Quantity</h4><div className="qty"><button aria-label="Less" onClick={()=>setQty(Math.max(1,qty-1))}>−</button><span>{qty}</span><button aria-label="More" onClick={()=>setQty(qty+1)}>+</button></div>
 <div className="row"><button className="btn" onClick={add}>ADD TO CART</button><button className="btn ghost" onClick={()=>add()&&nav('/cart')}>BUY NOW</button></div>
 <button className="btn ghost full" onClick={()=>toggleWish(p.id)}>{wish.includes(p.id)?'REMOVE FROM WISHLIST':'ADD TO WISHLIST'}</button>
 <details open><summary>Specifications</summary><p>Breathable mesh upper · EVA midsole · Rubber outsole · Weight ~290g</p></details>
 <details><summary>Shipping & Returns</summary><p>Free shipping over ₹2,999. 30-day easy returns on unworn pairs.</p></details></div></div>
 <h2>YOU MAY ALSO LIKE</h2><Grid list={products.filter(x=>x.category===p.category&&x.id!==p.id).slice(0,4)}/>
 {guide&&<div className="overlay" onClick={()=>setGuide(false)}><div className="modal" onClick={e=>e.stopPropagation()}><h3>Size Guide</h3><table><tbody><tr><th>UK</th><th>EU</th><th>CM</th></tr>{[[6,40,25],[7,41,26],[8,42,27],[9,43,28],[10,44,29],[11,45,30]].map(r=><tr key={r[0]}>{r.map((c,i)=><td key={i}>{c}</td>)}</tr>)}</tbody></table><button className="btn" onClick={()=>setGuide(false)}>CLOSE</button></div></div>}</main>}
function Cart(){
 const {cart,setQty,rmCart,say}=useStore();const items=cart.map(c=>({...c,p:products.find(p=>p.id===c.id)}));
 const sub=items.reduce((a,i)=>a+i.p.price*i.qty,0),ship=sub>2999||!sub?0:149,disc=sub>10000?Math.round(sub*.05):0;
 if(!items.length)return <main className="sec center"><h1>Your bag is empty 👜</h1><Link className="btn" to="/shop">CONTINUE SHOPPING</Link></main>;
 return <main className="sec"><h1>Your Bag</h1><div className="shop"><div>{items.map(i=><div className="line" key={i.k}><Img src={i.p.images[0]} alt={i.p.name}/><div><h3>{i.p.name}</h3><small>Size UK {i.size} · {i.color}</small><p>{inr(i.p.price)}</p>
 <div className="qty"><button aria-label="Less" onClick={()=>setQty(i.k,i.qty-1)}>−</button><span>{i.qty}</span><button aria-label="More" onClick={()=>setQty(i.k,i.qty+1)}>+</button></div></div><div><b>{inr(i.p.price*i.qty)}</b><br/><button className="link" onClick={()=>rmCart(i.k)}>Remove</button></div></div>)}</div>
 <aside className="sum"><h3>Order Summary</h3><p>Subtotal <b>{inr(sub)}</b></p><p>Shipping <b>{ship?inr(ship):'Free'}</b></p><p>Discount <b>-{inr(disc)}</b></p><p className="tot">Total <b>{inr(sub+ship-disc)}</b></p>
 <button className="btn full" onClick={()=>say('Demo only: payments are not enabled.')}>PROCEED TO CHECKOUT</button><Link className="btn ghost full" to="/shop">CONTINUE SHOPPING</Link><small>Checkout is a demo; no payment is processed.</small></aside></div></main>}
function Wishlist(){const {wish,toggleWish,addCart}=useStore();const l=products.filter(p=>wish.includes(p.id));
 return <main className="sec"><h1>Wishlist</h1>{l.length?<div className="grid">{l.map(p=><div key={p.id}><Card p={p}/><button className="btn ghost full" onClick={()=>addCart(p.id,p.sizes[2],p.colors[0][0])}>ADD TO CART</button><button className="link" onClick={()=>toggleWish(p.id)}>Remove</button></div>)}</div>:<p className="empty">Your wishlist is empty. <Link to="/shop">Browse shoes</Link></p>}</main>}
function About(){return <main className="sec"><h1>About SOLE STUDIO</h1><div className="split"><Img src={products[3].images[0]} alt="Our studio"/><div><p>SOLE STUDIO makes premium footwear for people who never stand still.</p><h3>Philosophy</h3><p>Great shoes should feel as good as they look.</p><h3>Design approach</h3><p>Minimal silhouettes, considered materials, zero excess.</p><h3>Values</h3><p>Comfort · Craft · Everyday confidence</p><Link className="btn" to="/shop">SHOP NOW</Link></div></div></main>}
function Contact(){const {say}=useStore();return <main className="sec"><h1>Contact</h1><p>hello@solestudio.demo · Mon–Sat, 10am–7pm IST</p>
 <form className="cform" onSubmit={e=>{e.preventDefault();e.target.reset();say('Message sent!')}}>{['Name','Email','Subject'].map(f=><label key={f}>{f}<input required type={f==='Email'?'email':'text'}/></label>)}<label>Message<textarea required rows="5"/></label><button className="btn">SEND</button></form></main>}
function FAQ(){return <main className="sec"><h1>FAQ</h1>{faqs.map(f=><details key={f[0]}><summary>{f[0]}</summary><p>{f[1]}</p></details>)}</main>}
function NotFound(){return <main className="sec center"><h1>404</h1><Link className="btn" to="/">GO HOME</Link></main>}
export default function App(){
 useEffect(()=>{window.scrollTo(0,0)});
 return <Provider><Header/><Routes><Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/><Route path="/product/:id" element={<Product/>}/><Route path="/cart" element={<Cart/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/faq" element={<FAQ/>}/><Route path="*" element={<NotFound/>}/></Routes><Footer/></Provider>}
