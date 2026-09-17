let cart=JSON.parse(localStorage.getItem("dth_cart")||"[]");
const $=s=>document.querySelector(s);
const money=n=>`$${Number(n).toFixed(2)}`;
function save(){localStorage.setItem("dth_cart",JSON.stringify(cart));renderCart()}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function addToCart(p){cart.push({id:Number(p.id),name:p.name,price:Number(p.price),qty:1});save();toast(`${p.name} ajoute nan panier`);$("#checkout").scrollIntoView({behavior:"smooth"})}
function removeFromCart(i){cart.splice(i,1);save()}
function renderCart(){
  $("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
  const list=$("#cartList"), sum=$("#summaryItems");
  if(!cart.length){list.innerHTML='<p class="muted">Panier ou vid. Ajoute yon pwodwi pou kontinye.</p>';sum.innerHTML='<p class="muted">Pa gen pwodwi.</p>'}
  else{
    list.innerHTML=cart.map((x,i)=>`<div class="cart-item"><span><b>${x.name}</b><small>${money(x.price)} × ${x.qty}</small></span><span><b>${money(x.price*x.qty)}</b> <button onclick="removeFromCart(${i})">Retire</button></span></div>`).join("");
    sum.innerHTML=cart.map(x=>`<div class="cart-item"><span>${x.name} × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join("");
  }
  const total=cart.reduce((a,x)=>a+x.price*x.qty,0);
  $("#total").textContent=`${money(total)} USD`;$("#payAmount").textContent=money(total);
}
async function startCheckout(){
  if(!cart.length){toast("Ajoute yon pwodwi anvan ou peye.");return}
  $("#checkoutModal").classList.remove("hidden");$("#orderStatus").textContent="";
}
async function confirmOrder(){
  const name=$("#customerName").value.trim(),phone=$("#customerPhone").value.trim(),playerId=$("#playerId").value.trim();
  if(!name||!phone){$("#orderStatus").textContent="Tanpri mete non ak telefòn ou.";return}
  const paymentMethod=document.querySelector('input[name="pay"]:checked').value;
  $("#confirmOrder").disabled=true;$("#orderStatus").textContent="Kreye kòmand lan...";
  try{
    const r=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart,paymentMethod,customer:{name,phone},playerId})});
    const d=await r.json();if(!r.ok)throw new Error(d.error||"Kòmand pa kreye");
    const p=await fetch("/api/payments/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:d.order.id})});
    const pd=await p.json();if(!p.ok)throw new Error(pd.error||"Peman pa disponib");
    if(pd.checkout_url){window.location.href=pd.checkout_url;return}
    throw new Error("Checkout URL pa retounen");
  }catch(e){$("#orderStatus").textContent=e.message;$("#confirmOrder").disabled=false}
}
$("#payBtn").addEventListener("click",startCheckout);$("#confirmOrder").addEventListener("click",confirmOrder);
$("#closeModal").addEventListener("click",()=>$("#checkoutModal").classList.add("hidden"));
$("#cartBtn").addEventListener("click",()=>$("#checkout").scrollIntoView({behavior:"smooth"}));
$("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
$("#langBtn").addEventListener("click",()=>$("#langMenu").classList.toggle("open"));
document.addEventListener("click",e=>{if(!e.target.closest(".lang-wrap"))$("#langMenu").classList.remove("open")});
document.querySelectorAll(".add").forEach(b=>b.addEventListener("click",e=>{const c=e.currentTarget.closest(".product");addToCart({id:c.dataset.id,name:c.dataset.name,price:c.dataset.price})}));
$("#searchInput").addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.querySelectorAll(".product").forEach(c=>c.classList.toggle("hidden-search",q&&!c.dataset.name.toLowerCase().includes(q)))});
const translations={
ht:{home:"Akèy",games:"Jwèt",subs:"Abònman",cards:"Kat kado",wallet:"Wallet / Pòtfèy",orders:"Kòmand mwen yo",profile:"Pwofil",support:"Sipò"},
fr:{home:"Accueil",games:"Jeux",subs:"Abonnements",cards:"Cartes cadeaux",wallet:"Portefeuille",orders:"Mes commandes",profile:"Profil",support:"Support"},
en:{home:"Home",games:"Games",subs:"Subscriptions",cards:"Gift cards",wallet:"Wallet",orders:"My orders",profile:"Profile",support:"Support"},
es:{home:"Inicio",games:"Juegos",subs:"Suscripciones",cards:"Tarjetas regalo",wallet:"Billetera",orders:"Mis pedidos",profile:"Perfil",support:"Soporte"}};
const labels={ht:"Kreyòl Ayisyen",fr:"Français",en:"English",es:"Español"};
document.querySelectorAll("[data-lang]").forEach(b=>b.addEventListener("click",()=>{const l=b.dataset.lang;document.querySelectorAll("[data-i18n]").forEach(x=>x.textContent=translations[l][x.dataset.i18n]);$("#langLabel").textContent=labels[l];localStorage.setItem("dth_lang",l);$("#langMenu").classList.remove("open")}));
renderCart();