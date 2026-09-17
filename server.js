require("dotenv").config();
const express=require("express"),path=require("path"),fs=require("fs"),crypto=require("crypto");
const app=express();app.use(express.json({limit:"100kb"}));app.use(express.static(path.join(__dirname,"public")));
const DATA=path.join(__dirname,"data"),ORDERS=path.join(DATA,"orders.json");fs.mkdirSync(DATA,{recursive:true});if(!fs.existsSync(ORDERS))fs.writeFileSync(ORDERS,"[]");
const products=[
{id:1,name:"Free Fire - Diamonds",price:2.50,category:"game"},{id:2,name:"PUBG Mobile - UC",price:3,category:"game"},
{id:3,name:"Blood Strike - Diamonds",price:2.50,category:"game"},{id:4,name:"Mobile Legends - Diamonds",price:2.50,category:"game"},
{id:5,name:"Netflix - Abònman",price:8.99,category:"subscription"},{id:6,name:"Disney+ - Abònman",price:7.99,category:"subscription"},
{id:7,name:"Spotify - Abònman",price:5.99,category:"subscription"},{id:8,name:"YouTube Premium",price:6.99,category:"subscription"},
{id:9,name:"Call of Duty Mobile - CP",price:4,category:"game"},{id:10,name:"Roblox - Robux",price:5,category:"game"}];
const allowed=["NatCash","MonCash","Visa"],read=()=>JSON.parse(fs.readFileSync(ORDERS,"utf8")),write=x=>fs.writeFileSync(ORDERS,JSON.stringify(x,null,2));
const admin=(req,res,next)=>{const token=req.headers.authorization?.replace("Bearer ","");if(!process.env.ADMIN_TOKEN||token!==process.env.ADMIN_TOKEN)return res.status(401).json({error:"Unauthorized"});next()};
app.get("/api/health",(req,res)=>res.json({ok:true,service:"demon-top-up-haiti"}));
app.get("/api/products",(req,res)=>res.json(products));
app.post("/api/orders",(req,res)=>{
 const {items,paymentMethod,customer,playerId}=req.body;
 if(!Array.isArray(items)||!items.length)return res.status(400).json({error:"Panier vid"});
 if(!allowed.includes(paymentMethod))return res.status(400).json({error:"Metòd peman pa aksepte"});
 const clean=items.map(i=>{const p=products.find(x=>x.id===Number(i.id));return p?{...p,qty:Math.min(99,Math.max(1,Number(i.qty||1)))}:null}).filter(Boolean);
 if(!clean.length)return res.status(400).json({error:"Pwodwi pa valide"});
 const total=Number(clean.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2));
 const order={id:"DTH-"+Date.now()+"-"+crypto.randomBytes(3).toString("hex"),status:"pending_payment",paymentMethod,customer:{name:String(customer?.name||"").slice(0,100),phone:String(customer?.phone||"").slice(0,40)},playerId:String(playerId||"").slice(0,100),items:clean,total,currency:"USD",createdAt:new Date().toISOString()};
 const orders=read();orders.push(order);write(orders);res.status(201).json({order});
});
app.post("/api/payments/create",async(req,res)=>{
 try{const {orderId}=req.body;const orders=read(),order=orders.find(x=>x.id===orderId);if(!order)return res.status(404).json({error:"Order not found"});
 if(order.paymentMethod==="Visa"){if(!process.env.VISA_CHECKOUT_URL)return res.status(503).json({error:"Visa PSP not configured"});const u=new URL(process.env.VISA_CHECKOUT_URL);u.searchParams.set("order_id",order.id);u.searchParams.set("amount",String(order.total));u.searchParams.set("currency",order.currency);return res.json({provider:"visa_psp",checkout_url:u.toString()})}
 if(!process.env.KOBARA_KEY)return res.status(503).json({error:"Kobara key not configured"});
 const provider=order.paymentMethod==="NatCash"?"natcash":"moncash";
 const r=await fetch("https://api.kobara.app/v1/payments",{method:"POST",headers:{"Authorization":`Bearer ${process.env.KOBARA_KEY}`,"Content-Type":"application/json","Idempotency-Key":crypto.randomUUID()},body:JSON.stringify({amount:Math.round(order.total*100),currency:"USD",provider,customer:{name:order.customer.name,phone:order.customer.phone},metadata:{order_id:order.id},success_url:`${process.env.PUBLIC_URL}/?payment=success&order_id=${order.id}`,cancel_url:`${process.env.PUBLIC_URL}/?payment=cancel&order_id=${order.id}`})});
 const data=await r.json();if(!r.ok)return res.status(502).json({error:"Payment provider error",details:data});order.payment_id=data?.data?.id||data?.id||null;order.updatedAt=new Date().toISOString();write(orders);res.json({provider:"kobara",checkout_url:data?.data?.checkout_url||data?.checkout_url});
 }catch(e){res.status(500).json({error:"Payment creation failed"})}
});
app.post("/api/webhooks/kobara",(req,res)=>{
 const event=req.body;if(event?.event_type!=="payment.succeeded")return res.json({received:true});
 const orderId=event?.data?.metadata?.order_id,orders=read(),order=orders.find(x=>x.id===orderId);if(!order)return res.status(404).json({error:"Order not found"});
 if(Number(event.data.amount)!==Math.round(order.total*100))return res.status(400).json({error:"Amount mismatch"});
 order.status="paid";order.payment_id=event.data.payment_id;order.paidAt=new Date().toISOString();write(orders);res.json({received:true});
});
app.get("/api/admin/orders",admin,(req,res)=>res.json(read().reverse()));
app.patch("/api/admin/orders/:id",admin,(req,res)=>{const statuses=["pending_payment","paid","processing","delivered","cancelled","failed"];if(!statuses.includes(req.body.status))return res.status(400).json({error:"Invalid status"});const orders=read(),o=orders.find(x=>x.id===req.params.id);if(!o)return res.status(404).json({error:"Not found"});o.status=req.body.status;o.updatedAt=new Date().toISOString();write(orders);res.json({order:o})});
app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(process.env.PORT||3000,()=>console.log("Demon Top Up Haiti running"));