import { useState, useEffect, useCallback } from "react";

const STAFF = [
  { id:1, name:"Hyacinthe", role:"directeur", pin:"0000", photo:"👨🏽‍💼", label:"Directeur Général", admin:true },
  { id:2, name:"Samir", role:"secretaire", pin:"1111", photo:"👨🏽‍💻", label:"Secrétaire", admin:true },
  { id:3, name:"Zenab Guilavogui", role:"rh", pin:"2222", photo:"👩🏽‍💻", label:"Responsable RH", admin:true, isRH:true },
  { id:4, name:"Nadine", role:"planificatrice", pin:"3333", photo:"👩🏾‍📋", label:"Planificatrice", terrain:true },
  { id:5, name:"Awa", role:"cheffe", pin:"4444", photo:"👩🏾‍⚕️", label:"Cheffe Infirmières", salary:2600, contract:"CDI", terrain:true },
  { id:6, name:"Steffi", role:"infirmiere", pin:"5555", photo:"👩‍⚕️", label:"Infirmière", salary:2400, contract:"CDI" },
  { id:7, name:"Melissa", role:"infirmiere", pin:"6666", photo:"👩🏽‍⚕️", label:"Infirmière", salary:2400, contract:"CDI" },
  { id:8, name:"Rita", role:"infirmiere", pin:"7777", photo:"👩🏾‍⚕️", label:"Infirmière", salary:2400, contract:"CDI" },
  { id:9, name:"Farida", role:"aide_soignante", pin:"8888", photo:"👩🏽‍⚕️", label:"Aide-soignante", salary:1900, contract:"CDI" },
  { id:10, name:"Aimée", role:"aide_soignante", pin:"9999", photo:"👩🏾‍⚕️", label:"Aide-soignante", salary:1900, contract:"CDI" },
  { id:11, name:"Intérimaire", role:"aide_soignante", pin:"0101", photo:"👤", label:"Intérimaire", salary:0, contract:"Intérim" },
];

const ADMIN_SAL = [{sid:2,sal:2200,c:"CDI"},{sid:3,sal:2300,c:"CDI"},{sid:4,sal:2100,c:"CDI"}];
const PATIENTS_INIT = [
  { id:1, name:"M. Dupont Jean", address:"Rue de la Loi 42, Bruxelles", pathology:"Diabète type 2", doctor:"Dr. Verhoeven", mutuelle:"Partenamut", status:"actif" },
  { id:2, name:"Mme. Mbaye Adama", address:"Av. Louise 156, Ixelles", pathology:"Post-op hanche", doctor:"Dr. Claessens", mutuelle:"Mut. chrétienne", status:"actif" },
  { id:3, name:"M. Janssens Pierre", address:"Rue Haute 89, Bruxelles", pathology:"Soins palliatifs", doctor:"Dr. Fontaine", mutuelle:"Solidaris", status:"actif" },
  { id:4, name:"Mme. De Smet Claire", address:"Ch. Waterloo 340, St-Gilles", pathology:"Perfusion antibio.", doctor:"Dr. Peeters", mutuelle:"Partenamut", status:"actif" },
  { id:5, name:"M. Traoré Moussa", address:"Rue de Flandre 72, Bruxelles", pathology:"Pansement chronique", doctor:"Dr. Lambert", mutuelle:"Solidaris", status:"actif" },
];

const CARES = ["Pansement","Injection","Perfusion","Glycémie","Soins d'hygiène","Préparation médicament","Pousse seringue","Soins palliatifs","Éducation patient","Toilette","Bas de contention"];
const DAYS_W = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const PRIOS = [{k:"haute",l:"🔴 Haute",c:"#ff6b6b"},{k:"moyenne",l:"🟡 Moyenne",c:"#f59e0b"},{k:"basse",l:"🟢 Basse",c:"#00c9a7"}];
const TSTAT = [{k:"a_faire",l:"À faire",c:"#7a8ba3"},{k:"en_cours",l:"En cours",c:"#0891b2"},{k:"fait",l:"Fait",c:"#00c9a7"},{k:"bloque",l:"Bloqué",c:"#ff6b6b"}];
const LEAVE_T = ["Congé annuel","Congé maladie","Sans solde","Récupération","Maternité","Formation"];
const CHANNELS = [
  { id:"admin", name:"🏢 Direction & Admin", desc:"Hyacinthe, Samir, Zenab", members:[1,2,3], color:"#8b5cf6" },
  { id:"general", name:"📢 Équipe Générale", desc:"Toute l'équipe", members:[1,2,3,4,5,6,7,8,9,10,11], color:"#0891b2" },
  { id:"terrain", name:"👩‍⚕️ Équipe Terrain", desc:"Awa + soignants", members:[5,6,7,8,9,10,11], color:"#00c9a7" },
  { id:"planning", name:"📅 Planning", desc:"Nadine + terrain", members:[4,5,6,7,8,9,10,11], color:"#f59e0b" },
];
const POST_CATS = [{k:"all",l:"Tous",c:"#7a8ba3"},{k:"protocole",l:"📋 Protocole",c:"#8b5cf6"},{k:"patient",l:"🏥 Patient",c:"#0891b2"},{k:"planning",l:"📅 Planning",c:"#f59e0b"},{k:"admin",l:"🏢 Admin",c:"#00c9a7"},{k:"general",l:"💬 Général",c:"#7a8ba3"}];

const gL = () => ({ lat:50.8466+(Math.random()-.5)*.01, lng:4.3528+(Math.random()-.5)*.01, acc:Math.floor(Math.random()*15)+5 });
const fT = d => new Date(d).toLocaleTimeString('fr-BE',{hour:'2-digit',minute:'2-digit'});
const fD = d => new Date(d).toLocaleDateString('fr-BE',{weekday:'long',day:'numeric',month:'long'});
const fS = d => new Date(d).toLocaleDateString('fr-BE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
const staff = id => STAFF.find(s=>s.id===id);
const field = STAFF.filter(s=>["infirmiere","aide_soignante"].includes(s.role)||s.terrain);
const allNoDir = STAFF.filter(s=>s.id!==1);

export default function App() {
  const [page,setPage] = useState("login");
  const [user,setUser] = useState(null);
  const [pin,setPin] = useState("");
  const [err,setErr] = useState("");
  const [tab,setTab] = useState("");
  const [now,setNow] = useState(new Date());

  // Clock
  const [cIn,setCIn] = useState(false);
  const [cTime,setCTime] = useState(null);
  const [cLoc,setCLoc] = useState(null);
  const [clocks,setClocks] = useState([
    {sid:4,t:"in",time:new Date(Date.now()-36e5*2.5).toISOString(),loc:gL()},
    {sid:5,t:"in",time:new Date(Date.now()-36e5*3.5).toISOString(),loc:gL()},
    {sid:6,t:"in",time:new Date(Date.now()-36e5*3).toISOString(),loc:gL()},
    {sid:7,t:"in",time:new Date(Date.now()-36e5*2).toISOString(),loc:gL()},
    {sid:8,t:"in",time:new Date(Date.now()-36e5*4).toISOString(),loc:gL()},
    {sid:9,t:"in",time:new Date(Date.now()-36e5).toISOString(),loc:gL()},
    {sid:10,t:"in",time:new Date(Date.now()-36e5*1.5).toISOString(),loc:gL()},
  ]);

  // Data
  const [patients,setPatients] = useState(PATIENTS_INIT);
  const [reports,setReports] = useState([
    {id:1,sid:6,pid:1,cares:["Glycémie","Injection"],notes:"Glycémie 1.45g/L. Insuline administrée.",dur:25,vitals:{ta:"13/8",temp:"36.8",p:"72"},time:new Date(Date.now()-36e5*2).toISOString(),loc:gL(),valid:true},
    {id:2,sid:7,pid:2,cares:["Pansement","Surveillance post-op"],notes:"Pansement changé. Cicatrisation OK.",dur:40,vitals:{ta:"12/7",temp:"37.1",p:"68"},time:new Date(Date.now()-36e5*1.5).toISOString(),loc:gL(),valid:false},
    {id:3,sid:8,pid:5,cares:["Pansement","Soins d'hygiène"],notes:"Pansement refait. Toilette partielle.",dur:35,vitals:{ta:"11/7",temp:"36.5",p:"70"},time:new Date(Date.now()-36e5).toISOString(),loc:gL(),valid:false},
  ]);
  const [sched,setSched] = useState([
    {sid:4,d:0,sh:"Matin",pts:[3]},{sid:4,d:3,sh:"AM",pts:[1,4]},
    {sid:5,d:0,sh:"Matin",pts:[2,5]},{sid:5,d:2,sh:"Matin",pts:[3]},
    {sid:6,d:0,sh:"Matin",pts:[1,4]},{sid:6,d:1,sh:"Matin",pts:[1,2]},
    {sid:7,d:0,sh:"Matin",pts:[2,3]},{sid:7,d:2,sh:"AM",pts:[5]},
    {sid:8,d:0,sh:"Matin",pts:[5]},{sid:8,d:1,sh:"AM",pts:[3,5]},
    {sid:9,d:0,sh:"AM",pts:[3]},{sid:9,d:2,sh:"Matin",pts:[1]},
    {sid:10,d:0,sh:"Matin",pts:[2]},{sid:10,d:1,sh:"AM",pts:[5]},
  ]);
  const [invs] = useState([
    {id:1,pid:1,amt:156.80,st:"payée",date:"25/02",mut:"Partenamut"},
    {id:2,pid:2,amt:234.50,st:"en attente",date:"26/02",mut:"Mut. chrétienne"},
    {id:3,pid:3,amt:312.00,st:"en attente",date:"27/02",mut:"Solidaris"},
    {id:4,pid:5,amt:89.00,st:"payée",date:"24/02",mut:"Solidaris"},
    {id:5,pid:4,amt:178.50,st:"rejetée",date:"20/02",mut:"Partenamut"},
  ]);
  const [leaves,setLeaves] = useState([
    {id:1,sid:6,type:"Congé annuel",from:"16/03",to:"20/03",days:5,reason:"Vacances",st:"approuvé",by:3},
    {id:2,sid:9,type:"Congé maladie",from:"27/02",to:"28/02",days:2,reason:"Grippe",st:"approuvé",by:3},
    {id:3,sid:7,type:"Congé annuel",from:"07/04",to:"11/04",days:5,reason:"Voyage",st:"en_attente",by:null},
    {id:4,sid:8,type:"Récupération",from:"07/03",to:"07/03",days:1,reason:"Heures sup.",st:"en_attente",by:null},
    {id:5,sid:5,type:"Formation",from:"24/03",to:"25/03",days:2,reason:"Soins palliatifs CHU",st:"approuvé",by:3},
  ]);
  const [salaries,setSalaries] = useState([
    {id:1,m:"Fév",sid:6,base:2400,bonus:150,ded:320,net:2230,st:"payé"},
    {id:2,m:"Fév",sid:7,base:2400,bonus:0,ded:320,net:2080,st:"payé"},
    {id:3,m:"Fév",sid:8,base:1900,bonus:100,ded:250,net:1750,st:"payé"},
    {id:4,m:"Fév",sid:9,base:1900,bonus:0,ded:250,net:1650,st:"en_attente"},
    {id:5,m:"Fév",sid:5,base:2600,bonus:200,ded:350,net:2450,st:"payé"},
    {id:10,m:"Fév",sid:10,base:1900,bonus:0,ded:250,net:1650,st:"payé"},
    {id:6,m:"Fév",sid:4,base:2100,bonus:0,ded:280,net:1820,st:"payé"},
    {id:7,m:"Fév",sid:2,base:2200,bonus:0,ded:290,net:1910,st:"payé"},
    {id:8,m:"Fév",sid:3,base:2300,bonus:0,ded:305,net:1995,st:"payé"},
  ]);

  // Tasks
  const [tasks,setTasks] = useState([
    {id:1,ch:"admin",title:"Renouvellement Partenamut",desc:"Contrat expire fin mars.",auth:1,to:2,pr:"haute",st:"en_cours",comments:[{a:3,t:"Barème reçu cette semaine.",time:"27/02"}]},
    {id:2,ch:"admin",title:"Recrutement infirmière",desc:"Volume en hausse.",auth:3,to:3,pr:"haute",st:"a_faire",comments:[{a:1,t:"Budget validé.",time:"26/02"}]},
    {id:3,ch:"general",title:"Réunion mars",desc:"Ordre du jour.",auth:1,to:1,pr:"moyenne",st:"en_cours",comments:[]},
    {id:4,ch:"terrain",title:"Réévaluation Janssens",desc:"RDV Dr. Fontaine.",auth:5,to:6,pr:"haute",st:"en_cours",comments:[{a:6,t:"Confirmé jeudi 14h.",time:"27/02"}]},
    {id:5,ch:"terrain",title:"Stock gants/masques",desc:"Commander.",auth:5,to:7,pr:"moyenne",st:"fait",comments:[]},
    {id:6,ch:"planning",title:"Redistribution Steffi S12",desc:"Congé semaine 12.",auth:4,to:4,pr:"haute",st:"en_cours",comments:[]},
  ]);

  // Shared board
  const [posts,setPosts] = useState([
    {id:1,auth:1,title:"Nouveau protocole COVID — Mars 2026",body:"Masque FFP2 obligatoire chez patients immunodéprimés. Documents au bureau. Signez l'accusé de réception.",cat:"protocole",pin:true,time:new Date(Date.now()-864e5).toISOString(),comments:[{a:5,t:"Noté, je distribue lundi.",time:new Date(Date.now()-36e5*12).toISOString()},{a:6,t:"Reçu merci !",time:new Date(Date.now()-36e5*8).toISOString()}]},
    {id:2,auth:5,title:"Point M. Janssens — Soins palliatifs",body:"État dégradé. RDV Dr. Fontaine jeudi. Steffi et Melissa, préparez vos observations.",cat:"patient",pin:false,time:new Date(Date.now()-36e5*6).toISOString(),comments:[{a:6,t:"Baisse appétit et fatigue. Rapport en cours.",time:new Date(Date.now()-36e5*4).toISOString()}]},
    {id:3,auth:3,title:"Fiches de paie février",body:"Fiches prêtes. Passez au bureau pour signature. Farida, virement en cours.",cat:"admin",pin:false,time:new Date(Date.now()-36e5*3).toISOString(),comments:[]},
    {id:4,auth:4,title:"Planning mars — Modifications",body:"Mis à jour suite congé Steffi S12. Melissa prend patients 1 et 4. Farida patient 2. Vérifiez vos horaires.",cat:"planning",pin:false,time:new Date(Date.now()-36e5*2).toISOString(),comments:[{a:7,t:"Noté, pas de souci.",time:new Date(Date.now()-36e5).toISOString()},{a:9,t:"OK pour patient 2.",time:new Date(Date.now()-18e5).toISOString()}]},
  ]);

  // UI states
  const [modal,setModal] = useState(null);
  const [subView,setSubView] = useState(null); // {type:"channel",id} | {type:"task",id} | {type:"post",id}
  const [filter,setFilter] = useState("all");
  const [comment,setComment] = useState("");

  // Form states
  const [rForm,setRForm] = useState({pid:"",cares:[],notes:"",dur:"30",ta:"",temp:"",pulse:""});
  const [pForm,setPForm] = useState({name:"",address:"",pathology:"",doctor:"",mutuelle:""});
  const [sForm,setSForm] = useState({sid:"",d:0,sh:""});
  const [tForm,setTForm] = useState({ch:"",title:"",desc:"",to:"",pr:"moyenne"});
  const [lForm,setLForm] = useState({sid:"",type:"",from:"",to2:"",days:"",reason:""});
  const [bForm,setBForm] = useState({title:"",body:"",cat:"general"});

  useEffect(()=>{if(tab==="pointage"){const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);}else{setNow(new Date());}},[tab]);

  // Helpers
  const getSt = useCallback(id=>{const r=clocks.filter(c=>c.sid===id);const l=r[r.length-1];if(!l)return{s:"off",t:null,loc:null};return{s:l.t==="in"?"on":"off",t:l.time,loc:l.loc};},[clocks]);
  const actives = field.filter(n=>getSt(n.id).s==="on").length;
  const todayR = reports.filter(r=>new Date(r.time).toDateString()===now.toDateString());
  const pendR = reports.filter(r=>!r.valid);
  const totMin = todayR.reduce((s,r)=>s+r.dur,0);
  const paidI = invs.filter(i=>i.st==="payée").reduce((s,i)=>s+i.amt,0);
  const pendI = invs.filter(i=>i.st==="en attente").reduce((s,i)=>s+i.amt,0);
  const myCh = user ? CHANNELS.filter(ch=>ch.members.includes(user.id)) : [];
  const pendL = leaves.filter(l=>l.st==="en_attente").length;
  const totPay = salaries.reduce((s,p)=>s+p.net,0);
  const paidPay = salaries.filter(s=>s.st==="payé").reduce((s,p)=>s+p.net,0);
  const lvBal = id=>{const u=leaves.filter(l=>l.sid===id&&l.st==="approuvé"&&l.type==="Congé annuel").reduce((s,l)=>s+l.days,0);return{tot:20,u,r:20-u};};

  const login=()=>{const s=STAFF.find(x=>x.pin===pin);if(!s){setErr("Code PIN incorrect");return;}setUser(s);setPage("app");setErr("");setPin("");if(s.admin)setTab("dashboard");else if(s.role==="planificatrice")setTab("pointage");else if(s.role==="cheffe")setTab("pointage");else setTab("pointage");const lr=clocks.filter(c=>c.sid===s.id).pop();if(lr&&lr.t==="in"){setCIn(true);setCTime(lr.time);setCLoc(lr.loc);}};
  const logout=()=>{setPage("login");setUser(null);setCIn(false);setCTime(null);setTab("");setPin("");setSubView(null);setModal(null);};

  const switchTab=(t)=>{setTab(t);setSubView(null);setFilter("all");setComment("");};

  // STYLES
  const bg = "linear-gradient(170deg,#0a1628,#0f2027 40%,#162a3a)";
  const teal = "#00c9a7";
  const cyan = "#0891b2";
  const red = "#ff6b6b";
  const yellow = "#f59e0b";
  const purple = "#8b5cf6";
  const gray = "#5a7089";
  const dark = "#1e3348";
  const light = "#e8edf3";
  const cardBg = "rgba(255,255,255,0.04)";
  const border = "1px solid rgba(255,255,255,0.06)";

  const css = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Outfit',sans-serif}@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes pop{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}input::placeholder,textarea::placeholder{color:#3a5068}select option{background:#0f2027;color:#e8edf3}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1e3348;border-radius:3px}input[type=date]{color-scheme:dark}`;

  const Card = ({children,style:s}) => <div style={{background:cardBg,borderRadius:16,border,padding:18,marginBottom:12,...s}}>{children}</div>;
  const Label = ({children}) => <div style={{fontSize:13,fontWeight:600,color:gray,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{children}</div>;
  const Inp = (props) => <input {...props} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${dark}`,background:"rgba(255,255,255,0.04)",color:light,fontSize:15,marginBottom:14,outline:"none",boxSizing:"border-box",...(props.style||{})}}/>;
  const Sel = (props) => <select {...props} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${dark}`,background:"rgba(255,255,255,0.04)",color:light,fontSize:15,marginBottom:14,outline:"none",boxSizing:"border-box",...(props.style||{})}}>{props.children}</select>;
  const Ta = (props) => <textarea {...props} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${dark}`,background:"rgba(255,255,255,0.04)",color:light,fontSize:15,minHeight:80,resize:"vertical",outline:"none",fontFamily:"inherit",marginBottom:14,boxSizing:"border-box",...(props.style||{})}}/>;
  const Chip = ({on,children,onClick,color:cc}) => <span onClick={onClick} style={{padding:"8px 14px",borderRadius:16,fontSize:13,fontWeight:600,cursor:"pointer",border:`1px solid ${on?(cc||teal):dark}`,background:on?`${cc||teal}20`:"transparent",color:on?(cc||teal):"#7a8ba3"}}>{children}</span>;
  const Btn = ({disabled:d,children,onClick,danger,small}) => <button onClick={d?undefined:onClick} style={{width:small?"auto":"100%",padding:small?"8px 18px":"14px 0",borderRadius:small?10:12,border:"none",background:d?dark:danger?`linear-gradient(135deg,${red},#ee5a24)`:`linear-gradient(135deg,${teal},${cyan})`,color:d?gray:danger?"#fff":"#0a1628",fontSize:small?13:16,fontWeight:700,cursor:d?"not-allowed":"pointer",flexShrink:0}}>{children}</button>;
  const Badge = ({on,children}) => <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 12px",borderRadius:16,fontSize:12,fontWeight:600,background:on?`${teal}20`:`${red}20`,color:on?teal:red}}>{children}</span>;
  const Dot = ({on}) => <span style={{width:10,height:10,borderRadius:"50%",background:on?teal:red,flexShrink:0}}/>;
  const StatBox = ({v,l,c}) => <div style={{padding:14,borderRadius:14,background:`${c}12`,border:`1px solid ${c}25`,textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:c,lineHeight:1}}>{v}</div><div style={{fontSize:11,color:gray,marginTop:3,textTransform:"uppercase"}}>{l}</div></div>;
  const Count = ({n}) => n>0?<span style={{background:red,color:"#fff",fontSize:10,fontWeight:700,borderRadius:12,padding:"2px 8px",marginLeft:6}}>{n}</span>:null;
  const Back = ({onClick}) => <button onClick={onClick} style={{padding:"8px 16px",borderRadius:10,border:`1px solid #2a3f55`,background:"transparent",color:"#7a8ba3",fontSize:13,cursor:"pointer",marginBottom:12}}>← Retour</button>;
  const Avatar = ({e}) => <span style={{fontSize:26,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,background:`${teal}15`,flexShrink:0}}>{e}</span>;
  const InvBadge = ({s}) => <span style={{padding:"3px 10px",borderRadius:10,fontSize:12,fontWeight:600,background:(s==="payée"||s==="payé")?`${teal}20`:(s==="en attente"||s==="en_attente")?`${yellow}20`:`${red}20`,color:(s==="payée"||s==="payé")?teal:(s==="en attente"||s==="en_attente")?yellow:red}}>{s}</span>;
  const PrBadge = ({k}) => {const p=PRIOS.find(x=>x.k===k);return <span style={{padding:"3px 10px",borderRadius:12,fontSize:11,fontWeight:600,background:`${p?.c||gray}20`,color:p?.c||gray}}>{p?.l||k}</span>};
  const StBadge = ({k,onClick}) => {const s=TSTAT.find(x=>x.k===k)||TSTAT[0];return <span onClick={onClick} style={{padding:"4px 12px",borderRadius:12,fontSize:11,fontWeight:700,background:`${s.c}20`,color:s.c,cursor:onClick?"pointer":"default"}}>{s.l}</span>};

  // ===== LOGIN =====
  if(page==="login") return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:bg,minHeight:"100vh",color:light,maxWidth:500,margin:"0 auto"}}>
      <style>{css}</style>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
        <div style={{width:90,height:90,borderRadius:22,background:`linear-gradient(135deg,${teal},${cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,marginBottom:18,boxShadow:`0 8px 32px ${teal}50`}}>🏥</div>
        <div style={{fontSize:32,fontWeight:700,background:`linear-gradient(135deg,${teal},${cyan})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>HHC Services</div>
        <div style={{fontSize:14,color:gray,marginBottom:36,letterSpacing:2,textTransform:"uppercase"}}>Soins infirmiers à domicile</div>
        <div style={{display:"flex",gap:14,marginBottom:28}}>{[0,1,2,3].map(i=><div key={i} style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${pin.length>i?teal:"#2a3f55"}`,background:pin.length>i?teal:"transparent"}}/>)}</div>
        {err&&<div style={{color:red,fontSize:15,marginBottom:14}}>{err}</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,width:"100%",maxWidth:300,marginBottom:24}}>
          {[1,2,3,4,5,6,7,8,9,"⌫",0,"→"].map((k,i)=>(
            <button key={i} style={{height:60,borderRadius:14,border:k==="→"?"none":`1px solid ${dark}`,background:k==="→"?`linear-gradient(135deg,${teal},${cyan})`:"rgba(255,255,255,0.04)",color:k==="→"?"#0a1628":k==="⌫"?red:light,fontSize:k==="→"?16:24,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{if(k==="⌫"){setPin(p=>p.slice(0,-1));setErr("");}else if(k==="→")login();else if(pin.length<4)setPin(p=>p+k);}}>{k}</button>
          ))}
        </div>
        <div style={{fontSize:12,color:"#3a5068",textAlign:"center",marginTop:8}}>Entrez votre code PIN</div>
      </div>
    </div>
  );

  // TAB CONFIG
  const getTabs = () => {
    if(!user) return [];
    if(user.isRH) return [{k:"dashboard",l:"📊 Board"},{k:"pointages",l:"⏱ Pointages"},{k:"conges",l:"🏖️ Congés"},{k:"salaires",l:"💰 Salaires"},{k:"equipe",l:"👥 Équipe"},{k:"board",l:"📢 Commun"},{k:"jira",l:"📌 Tâches"}];
    if(user.admin) return [{k:"dashboard",l:"📊 Board"},{k:"pointages",l:"⏱ Pointages"},{k:"equipe",l:"👥 Équipe"},{k:"rapports",l:"📋 Visites"},{k:"patients",l:"🏥 Patients"},{k:"finances",l:"💰 Finance"},{k:"board",l:"📢 Commun"},{k:"jira",l:"📌 Tâches"}];
    if(user.role==="planificatrice") return [{k:"pointage",l:"⏱ Pointage"},{k:"rapport",l:"📋 Rapport"},{k:"planning",l:"📅 Planning"},{k:"board",l:"📢 Commun"},{k:"jira",l:"📌 Tâches"}];
    if(user.role==="cheffe") return [{k:"pointage",l:"⏱ Pointage"},{k:"rapport",l:"📋 Rapport"},{k:"supervision",l:"🔴 Live"},{k:"rapports",l:"📋 Visites"},{k:"equipe",l:"👥 Équipe"},{k:"board",l:"📢 Commun"},{k:"jira",l:"📌 Tâches"}];
    return [{k:"pointage",l:"⏱ Pointage"},{k:"rapport",l:"📋 Rapport"},{k:"planning",l:"📅 Planning"},{k:"board",l:"📢 Commun"},{k:"conges",l:"🏖️ Congés"},{k:"jira",l:"📌 Tâches"}];
  };

  // ===== RENDER CONTENT =====
  const renderContent = () => {
    // DASHBOARD
    if(tab==="dashboard") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <StatBox v={`${actives}/${field.length}`} l="En service" c={teal}/>
          <StatBox v={todayR.length} l="Visites" c={cyan}/>
          <StatBox v={`${totMin}m`} l="Temps soins" c={purple}/>
          <StatBox v={pendR.length} l="À valider" c={yellow}/>
        </div>
        {!user.isRH&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <StatBox v={`€${paidI.toFixed(0)}`} l="Encaissé" c={teal}/>
          <StatBox v={`€${pendI.toFixed(0)}`} l="En attente" c={yellow}/>
        </div>}
        <Card><div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>📍 Localisation temps réel</div>
          {field.map(n=>{const st=getSt(n.id);return(
            <div key={n.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,0.03)",borderRadius:12,border,marginBottom:8}}>
              <Avatar e={n.photo}/>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:600}}>{n.name}</div>
                <div style={{fontSize:13,color:st.s==="on"?teal:red,fontWeight:600}}>● {st.s==="on"?"En service":"Hors service"}{st.t&&` · ${fT(st.t)}`}</div>
                {st.loc&&<div style={{fontSize:12,color:gray}}>📍 {st.loc.lat.toFixed(4)}, {st.loc.lng.toFixed(4)}</div>}
              </div>
              <Dot on={st.s==="on"}/>
            </div>);})}
        </Card>
      </div>
    );

    // POINTAGES (Admin view)
    if(tab==="pointages") {
      const today = clocks.filter(c=>new Date(c.time).toDateString()===now.toDateString());
      return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{fontSize:20,fontWeight:700,marginBottom:12}}>⏱ Pointages du jour</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <StatBox v={field.filter(n=>getSt(n.id).s==="on").length} l="En service" c={teal}/>
          <StatBox v={field.filter(n=>getSt(n.id).s==="off").length} l="Hors service" c={red}/>
        </div>
        {field.map(s=>{const st=getSt(s.id);const recs=clocks.filter(c=>c.sid===s.id).slice().reverse();return(
          <Card key={s.id}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <Avatar e={s.photo}/>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:600}}>{s.name}</div>
                <div style={{fontSize:13,color:gray}}>{s.label}</div>
              </div>
              <Badge on={st.s==="on"}><Dot on={st.s==="on"}/>{st.s==="on"?"En service":"Absent"}</Badge>
            </div>
            {st.loc&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:`${teal}12`,borderRadius:10,marginBottom:8,fontSize:12,color:"#7a8ba3"}}>📍 {st.loc.lat.toFixed(4)}, {st.loc.lng.toFixed(4)} (±{st.loc.acc}m)</div>}
            {recs.length>0&&<div style={{borderTop:"1px solid rgba(255,255,255,0.04)",paddingTop:8}}>
              <div style={{fontSize:12,fontWeight:700,color:gray,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Historique</div>
              {recs.slice(0,4).map((c,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>{c.t==="in"?"🟢":"🔴"}</span>
                    <span style={{fontSize:14,fontWeight:600,color:c.t==="in"?teal:red}}>{c.t==="in"?"Entrée":"Sortie"}</span>
                  </div>
                  <span style={{fontSize:13,color:gray}}>{fT(c.time)}</span>
                </div>
              ))}
            </div>}
          </Card>);})}
      </div>);
    }

    // EQUIPE
    if(tab==="equipe") return (
      <div style={{animation:"slideUp .3s ease"}}>
        {(user.admin?allNoDir:field).map(s=>{const st=getSt(s.id);const sR=reports.filter(r=>r.sid===s.id);return(
          <Card key={s.id}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <Avatar e={s.photo}/>
              <div style={{flex:1}}><div style={{fontSize:16,fontWeight:600}}>{s.name}</div><div style={{fontSize:13,color:teal}}>{s.label}</div></div>
              {["infirmiere","aide_soignante"].includes(s.role)&&<Dot on={st.s==="on"}/>}
            </div>
            {["infirmiere","aide_soignante"].includes(s.role)&&<div style={{display:"flex",gap:8}}>
              <div style={{flex:1,textAlign:"center",padding:8,background:`${teal}10`,borderRadius:8}}><div style={{fontSize:20,fontWeight:700,color:teal}}>{sR.length}</div><div style={{fontSize:11,color:gray}}>VISITES</div></div>
              <div style={{flex:1,textAlign:"center",padding:8,background:`${cyan}10`,borderRadius:8}}><div style={{fontSize:20,fontWeight:700,color:cyan}}>{sR.reduce((a,r)=>a+r.dur,0)}m</div><div style={{fontSize:11,color:gray}}>DURÉE</div></div>
            </div>}
          </Card>);})}
      </div>
    );

    // RAPPORTS VISITES
    if(tab==="rapports") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
          {["all","pending","valid"].map(f=><Chip key={f} on={filter===f} onClick={()=>setFilter(f)}>{f==="all"?"Tous":f==="pending"?"En attente":"Validés"}</Chip>)}
        </div>
        {reports.filter(r=>filter==="all"?true:filter==="pending"?!r.valid:r.valid).slice().reverse().map(r=>{const n=staff(r.sid);const p=patients.find(x=>x.id===r.pid);return(
          <Card key={r.id}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div><div style={{fontSize:15,fontWeight:600}}>{n?.photo} {n?.name}</div><div style={{fontSize:14,color:teal}}>→ {p?.name}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:13,color:gray}}>{fT(r.time)}</div><div style={{fontSize:12,color:cyan}}>{r.dur}min</div></div></div>
            <div style={{marginBottom:6}}>{r.cares.map(c=><span key={c} style={{padding:"3px 10px",borderRadius:8,fontSize:12,background:`${cyan}20`,color:cyan,display:"inline-block",marginRight:4,marginBottom:4}}>{c}</span>)}</div>
            <div style={{fontSize:14,color:"#7a8ba3",lineHeight:1.6}}>{r.notes}</div>
            {r.vitals&&<div style={{display:"flex",gap:14,fontSize:13,color:gray,paddingTop:6,borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:6}}>{r.vitals.ta&&<span>TA: <b style={{color:light}}>{r.vitals.ta}</b></span>}{r.vitals.temp&&<span>T°: <b style={{color:light}}>{r.vitals.temp}°C</b></span>}{r.vitals.p&&<span>P: <b style={{color:light}}>{r.vitals.p}</b></span>}</div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <Badge on={r.valid}>{r.valid?"✓ Validé":"⏳ En attente"}</Badge>
              {!r.valid&&(user.admin||user.role==="cheffe")&&<Btn small onClick={()=>setReports(p=>p.map(x=>x.id===r.id?{...x,valid:true}:x))}>Valider</Btn>}
            </div>
          </Card>);})}
      </div>
    );

    // PATIENTS
    if(tab==="patients") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{marginBottom:12}}><Btn small onClick={()=>setModal("patient")}>+ Nouveau patient</Btn></div>
        {patients.map(p=>(
          <Card key={p.id}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div><div style={{fontSize:16,fontWeight:600}}>{p.name}</div><div style={{fontSize:14,color:teal}}>{p.pathology}</div></div><Badge on={p.status==="actif"}>{p.status}</Badge></div>
            <div style={{fontSize:14,color:"#7a8ba3",lineHeight:1.8}}>📍 {p.address}<br/>👨‍⚕️ {p.doctor} · 🏥 {p.mutuelle}</div>
          </Card>))}
      </div>
    );

    // FINANCES
    if(tab==="finances") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <StatBox v={`€${paidI.toFixed(0)}`} l="Encaissé" c={teal}/><StatBox v={`€${pendI.toFixed(0)}`} l="En attente" c={yellow}/>
        </div>
        <Card><div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Factures</div>
          {invs.map(inv=>{const p=patients.find(x=>x.id===inv.pid);return(
            <div key={inv.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div><div style={{fontSize:15,fontWeight:600}}>{p?.name}</div><div style={{fontSize:13,color:gray}}>{inv.date} · {inv.mut}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:700}}>€{inv.amt.toFixed(2)}</div><InvBadge s={inv.st}/></div>
            </div>);})}
        </Card>
      </div>
    );

    // CONGÉS
    if(tab==="conges"){
      const isRH=user.isRH;const myL=isRH?leaves:leaves.filter(l=>l.sid===user.id);const filt=filter==="all"?myL:myL.filter(l=>l.st===filter);
      return(
      <div style={{animation:"slideUp .3s ease"}}>
        {isRH&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}><StatBox v={pendL} l="En attente" c={yellow}/><StatBox v={leaves.filter(l=>l.st==="approuvé").length} l="Approuvés" c={teal}/></div>}
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}><Chip on={filter==="all"} onClick={()=>setFilter("all")}>Tous</Chip><Chip on={filter==="en_attente"} color={yellow} onClick={()=>setFilter("en_attente")}>⏳ Attente</Chip></div>
          <Btn small onClick={()=>setModal("leave")}>+ Demande</Btn>
        </div>
        {isRH&&<Card><div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Solde congés annuels</div>
          {allNoDir.map(s=>{const b=lvBal(s.id);return(
            <div key={s.id} style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:15,fontWeight:600}}>{s.photo} {s.name}</span><span style={{fontSize:14,color:teal,fontWeight:700}}>{b.r}j restants</span></div>
              <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",width:`${(b.u/b.tot)*100}%`,borderRadius:4,background:b.r<5?red:teal}}/></div>
            </div>);})}
        </Card>}
        {filt.map(l=>{const s=staff(l.sid);const ap=l.by?staff(l.by):null;return(
          <Card key={l.id}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div><div style={{fontSize:16,fontWeight:600}}>{s?.photo} {s?.name}</div><div style={{fontSize:14,color:cyan}}>{l.type}</div></div>
              <span style={{padding:"4px 12px",borderRadius:12,fontSize:12,fontWeight:700,background:l.st==="approuvé"?`${teal}20`:l.st==="en_attente"?`${yellow}20`:`${red}20`,color:l.st==="approuvé"?teal:l.st==="en_attente"?yellow:red}}>{l.st==="en_attente"?"⏳ En attente":l.st==="approuvé"?"✓ Approuvé":"✗ Refusé"}</span>
            </div>
            <div style={{fontSize:14,color:"#7a8ba3",lineHeight:1.8}}>📅 {l.from} → {l.to} <b style={{color:light}}>({l.days}j)</b><br/>💬 {l.reason}</div>
            {ap&&<div style={{fontSize:13,color:gray,marginTop:4}}>Par {ap.photo} {ap.name}</div>}
            {l.st==="en_attente"&&isRH&&<div style={{display:"flex",gap:10,marginTop:10}}>
              <Btn small onClick={()=>setLeaves(p=>p.map(x=>x.id===l.id?{...x,st:"approuvé",by:user.id}:x))}>✓ Approuver</Btn>
              <Btn small danger onClick={()=>setLeaves(p=>p.map(x=>x.id===l.id?{...x,st:"refusé",by:user.id}:x))}>✗ Refuser</Btn>
            </div>}
          </Card>);})}
      </div>);
    }

    // SALAIRES
    if(tab==="salaires") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}><StatBox v={`€${totPay.toLocaleString()}`} l="Masse salariale" c={purple}/><StatBox v={`€${paidPay.toLocaleString()}`} l="Payé" c={teal}/></div>
        <Card><div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Fiches de paie — Février 2026</div>
          {salaries.map(sp=>{const s=staff(sp.sid);return(
            <div key={sp.id} style={{padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{s?.photo}</span><div><div style={{fontSize:15,fontWeight:600}}>{s?.name}</div><div style={{fontSize:12,color:gray}}>{s?.label}</div></div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:700}}>€{sp.net}</div><InvBadge s={sp.st}/></div>
              </div>
              <div style={{display:"flex",gap:16,fontSize:13,color:gray}}><span>Brut: <b style={{color:light}}>€{sp.base}</b></span>{sp.bonus>0&&<span>Prime: <b style={{color:teal}}>+€{sp.bonus}</b></span>}<span>Ret.: <b style={{color:red}}>-€{sp.ded}</b></span></div>
              {sp.st!=="payé"&&<div style={{marginTop:8}}><Btn small onClick={()=>setSalaries(p=>p.map(x=>x.id===sp.id?{...x,st:"payé"}:x))}>💳 Marquer payé</Btn></div>}
            </div>);})}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:12,marginTop:8,borderTop:`2px solid rgba(255,255,255,0.1)`}}><span style={{fontSize:16,fontWeight:700}}>TOTAL</span><span style={{fontSize:20,fontWeight:700,color:purple}}>€{totPay.toLocaleString()}</span></div>
        </Card>
      </div>
    );

    // SUPERVISION
    if(tab==="supervision") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}><StatBox v={actives} l="En service" c={teal}/><StatBox v={pendR.length} l="À valider" c={yellow}/></div>
        <Card><div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Équipe terrain — Live</div>
          {field.map(n=>{const st=getSt(n.id);return(
            <div key={n.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,0.03)",borderRadius:12,border,marginBottom:8}}>
              <Avatar e={n.photo}/><div style={{flex:1}}><div style={{fontSize:16,fontWeight:600}}>{n.name} <span style={{fontSize:13,color:gray}}>({n.label})</span></div><div style={{fontSize:13,color:st.s==="on"?teal:red,fontWeight:600}}>● {st.s==="on"?"En service":"Hors service"}{st.t&&` · ${fT(st.t)}`}</div>{st.loc&&<div style={{fontSize:12,color:gray}}>📍 {st.loc.lat.toFixed(4)}, {st.loc.lng.toFixed(4)}</div>}</div><Dot on={st.s==="on"}/>
            </div>);})}
        </Card>
      </div>
    );

    // PLANNING
    if(tab==="planning") return (
      <div style={{animation:"slideUp .3s ease"}}>
        {user.role==="planificatrice"&&<div style={{marginBottom:12}}><Btn small onClick={()=>setModal("schedule")}>+ Créneau</Btn></div>}
        {(["infirmiere","aide_soignante"].includes(user.role)?field.filter(s=>s.id===user.id):field).map(s=>{const entries=sched.filter(e=>e.sid===s.id);return(
          <Card key={s.id}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{fontSize:22}}>{s.photo}</span><div><div style={{fontSize:16,fontWeight:600}}>{s.name}</div><div style={{fontSize:12,color:gray}}>{s.label}</div></div></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
              {DAYS_W.map((d,i)=><div key={i} style={{fontSize:11,fontWeight:700,color:gray,textAlign:"center",padding:3}}>{d}</div>)}
              {DAYS_W.map((_,i)=>{const e=entries.find(e=>e.d===i);return <div key={i} style={{padding:6,textAlign:"center",borderRadius:6,fontSize:11,background:e?`${teal}18`:"rgba(255,255,255,0.02)",color:e?teal:"#3a5068",border:`1px solid ${e?`${teal}30`:"rgba(255,255,255,0.04)"}`}}>{e?<>{e.sh}<br/><span style={{fontSize:10}}>{e.pts.length}p</span></>:"—"}</div>;})}
            </div>
          </Card>);})}
      </div>
    );

    // POINTAGE
    if(tab==="pointage") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <Card>
          <div style={{fontSize:52,fontWeight:300,textAlign:"center",letterSpacing:-2,lineHeight:1}}>{now.toLocaleTimeString('fr-BE',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</div>
          <div style={{textAlign:"center",fontSize:15,color:gray,marginBottom:14,textTransform:"capitalize"}}>{fD(now)}</div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><Badge on={cIn}><Dot on={cIn}/>{cIn?"En service":"Hors service"}</Badge></div>
          {cIn&&cTime&&<div style={{textAlign:"center",fontSize:14,color:gray,marginBottom:12}}>Début: {fT(cTime)} — {Math.floor((now-new Date(cTime))/60000)}min</div>}
          <button style={{width:"100%",padding:"18px 0",borderRadius:14,border:"none",background:cIn?`linear-gradient(135deg,${red},#ee5a24)`:`linear-gradient(135deg,${teal},${cyan})`,color:cIn?"#fff":"#0a1628",fontSize:18,fontWeight:700,cursor:"pointer"}} onClick={()=>{
            const l=gL(),t=new Date().toISOString();
            if(cIn){setCIn(false);setCTime(null);setCLoc(null);setClocks(p=>[...p,{sid:user.id,t:"out",time:t,loc:l}]);}
            else{setCIn(true);setCTime(t);setCLoc(l);setClocks(p=>[...p,{sid:user.id,t:"in",time:t,loc:l}]);}
          }}>{cIn?"🔴  POINTER LA SORTIE":"🟢  POINTER L'ENTRÉE"}</button>
          {cLoc&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:`${teal}12`,borderRadius:10,marginTop:10,fontSize:12,color:"#7a8ba3"}}>📍 {cLoc.lat.toFixed(4)}, {cLoc.lng.toFixed(4)} (±{cLoc.acc}m)</div>}
        </Card>
      </div>
    );

    // RAPPORT (terrain)
    if(tab==="rapport") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <Card>
          <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Nouveau rapport de visite</div>
          <Label>Patient</Label>
          <Sel value={rForm.pid} onChange={e=>setRForm(p=>({...p,pid:e.target.value}))}><option value="">Sélectionner...</option>{patients.filter(p=>p.status==="actif").map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</Sel>
          <Label>Soins</Label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>{CARES.map(c=><Chip key={c} on={rForm.cares.includes(c)} onClick={()=>setRForm(p=>({...p,cares:p.cares.includes(c)?p.cares.filter(x=>x!==c):[...p.cares,c]}))}>{c}</Chip>)}</div>
          <Label>Durée</Label>
          <div style={{display:"flex",gap:6,marginBottom:14}}>{["15","25","30","45","60"].map(d=><div key={d} style={{flex:1,padding:"10px 0",textAlign:"center",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",border:`1px solid ${rForm.dur===d?teal:dark}`,background:rForm.dur===d?`${teal}20`:"transparent",color:rForm.dur===d?teal:gray}} onClick={()=>setRForm(p=>({...p,dur:d}))}>{d}m</div>)}</div>
          <Label>Signes vitaux</Label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
            {[["ta","Tension","13/8"],["temp","Temp °C","36.8"],["pulse","Pouls","72"]].map(([k,l,ph])=><div key={k}><Inp placeholder={ph} style={{textAlign:"center",marginBottom:4}} value={rForm[k]} onChange={e=>setRForm(p=>({...p,[k]:e.target.value}))}/><div style={{fontSize:11,color:gray,textAlign:"center"}}>{l}</div></div>)}
          </div>
          <Label>Observations</Label>
          <Ta placeholder="État du patient..." value={rForm.notes} onChange={e=>setRForm(p=>({...p,notes:e.target.value}))}/>
          <Btn disabled={!rForm.pid||rForm.cares.length===0} onClick={()=>{
            setReports(p=>[...p,{id:p.length+1,sid:user.id,pid:parseInt(rForm.pid),cares:[...rForm.cares],notes:rForm.notes,dur:parseInt(rForm.dur),vitals:{ta:rForm.ta,temp:rForm.temp,p:rForm.pulse},time:new Date().toISOString(),loc:gL(),valid:false}]);
            setRForm({pid:"",cares:[],notes:"",dur:"30",ta:"",temp:"",pulse:""});
          }}>📤 Envoyer le rapport</Btn>
        </Card>
      </div>
    );

    // SHARED BOARD
    if(tab==="board"){
      // Post detail
      if(subView?.type==="post"){
        const p=posts.find(x=>x.id===subView.id);if(!p)return null;
        const auth=staff(p.auth);const cat=POST_CATS.find(c=>c.k===p.cat);
        return(<div style={{animation:"slideUp .3s ease"}}>
          <Back onClick={()=>setSubView(null)}/>
          <Card>
            {p.pin&&<div style={{fontSize:13,color:purple,fontWeight:700,marginBottom:8}}>📌 Épinglé</div>}
            <div style={{fontSize:20,fontWeight:700,marginBottom:8}}>{p.title}</div>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}><span style={{fontSize:14}}>{auth?.photo} {auth?.name}</span><span style={{fontSize:12,color:gray}}>{fS(p.time)}</span>{cat&&<span style={{padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:600,background:`${cat.c}20`,color:cat.c}}>{cat.l}</span>}</div>
            <div style={{fontSize:15,color:"#c0ccda",lineHeight:1.7}}>{p.body}</div>
          </Card>
          <Card>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Commentaires ({p.comments.length})</div>
            {p.comments.map((c,i)=>{const a=staff(c.a);return(
              <div key={i} style={{padding:12,borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.04)",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:14,fontWeight:600}}>{a?.photo} {a?.name}</span><span style={{fontSize:12,color:gray}}>{fS(c.time)}</span></div>
                <div style={{fontSize:14,color:"#c0ccda",lineHeight:1.6}}>{c.t}</div>
              </div>);})}
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <Inp placeholder="Commentaire..." style={{marginBottom:0,flex:1}} value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&comment.trim()){setPosts(pp=>pp.map(x=>x.id===p.id?{...x,comments:[...x.comments,{a:user.id,t:comment,time:new Date().toISOString()}]}:x));setComment("");}}}/>
              <Btn small onClick={()=>{if(!comment.trim())return;setPosts(pp=>pp.map(x=>x.id===p.id?{...x,comments:[...x.comments,{a:user.id,t:comment,time:new Date().toISOString()}]}:x));setComment("");}}>Envoyer</Btn>
            </div>
          </Card>
        </div>);
      }
      // Board list
      const filt=filter==="all"?posts:posts.filter(p=>p.cat===filter);
      const sorted=[...filt].sort((a,b)=>(b.pin?1:0)-(a.pin?1:0)||new Date(b.time)-new Date(a.time));
      return(<div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:20,fontWeight:700}}>📢 Tableau commun</div>
          <Btn small onClick={()=>setModal("post")}>+ Publier</Btn>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{POST_CATS.map(c=><Chip key={c.k} on={filter===c.k} color={c.c} onClick={()=>setFilter(c.k)}>{c.l}</Chip>)}</div>
        {sorted.map(p=>{const auth=staff(p.auth);const cat=POST_CATS.find(c=>c.k===p.cat);return(
          <div key={p.id} onClick={()=>setSubView({type:"post",id:p.id})} style={{padding:16,borderRadius:14,border:p.pin?`1px solid ${purple}40`:border,background:p.pin?`${purple}08`:cardBg,marginBottom:10,cursor:"pointer"}}>
            {p.pin&&<div style={{fontSize:12,color:purple,fontWeight:700,marginBottom:6}}>📌 Épinglé</div>}
            <div style={{fontSize:17,fontWeight:700,marginBottom:6}}>{p.title}</div>
            <div style={{fontSize:14,color:"#7a8ba3",lineHeight:1.6,marginBottom:8}}>{p.body.length>100?p.body.slice(0,100)+"…":p.body}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13}}>{auth?.photo} {auth?.name}</span>{cat&&<span style={{padding:"2px 8px",borderRadius:10,fontSize:11,background:`${cat.c}20`,color:cat.c}}>{cat.l}</span>}</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>{p.comments.length>0&&<span style={{fontSize:13,color:gray}}>💬{p.comments.length}</span>}<span style={{fontSize:12,color:gray}}>{fS(p.time)}</span></div></div>
          </div>);})}
      </div>);
    }

    // JIRA TASKS
    if(tab==="jira"){
      // Task detail
      if(subView?.type==="task"){
        const t=tasks.find(x=>x.id===subView.id);if(!t)return null;
        const auth=staff(t.auth);const asgn=staff(t.to);
        return(<div style={{animation:"slideUp .3s ease"}}>
          <Back onClick={()=>{setSubView({type:"channel",id:t.ch});setComment("");}}/>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{fontSize:18,fontWeight:700,flex:1,marginRight:10}}>{t.title}</div><PrBadge k={t.pr}/></div>
            <div style={{fontSize:15,color:"#7a8ba3",lineHeight:1.6,marginBottom:12}}>{t.desc}</div>
            <div style={{fontSize:14,color:gray,marginBottom:12}}>Par {auth?.photo} {auth?.name} → {asgn?.photo} {asgn?.name}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{TSTAT.map(st=>(
              <span key={st.k} onClick={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,st:st.k}:x))} style={{padding:"5px 14px",borderRadius:12,fontSize:12,fontWeight:700,background:`${st.c}20`,color:st.c,cursor:"pointer",outline:t.st===st.k?`2px solid ${st.c}`:"none",outlineOffset:2}}>{st.l}</span>
            ))}</div>
          </Card>
          <Card>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Commentaires ({t.comments.length})</div>
            {t.comments.length===0&&<div style={{textAlign:"center",color:"#3a5068",padding:12,fontSize:14}}>Aucun commentaire</div>}
            {t.comments.map((c,i)=>{const a=staff(c.a);return(
              <div key={i} style={{padding:12,borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.04)",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:14,fontWeight:600}}>{a?.photo} {a?.name}</span><span style={{fontSize:12,color:gray}}>{c.time}</span></div>
                <div style={{fontSize:14,color:"#c0ccda",lineHeight:1.6}}>{c.t}</div>
              </div>);})}
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <Inp placeholder="Commentaire..." style={{marginBottom:0,flex:1}} value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&comment.trim()){setTasks(p=>p.map(x=>x.id===t.id?{...x,comments:[...x.comments,{a:user.id,t:comment,time:fS(new Date())}]}:x));setComment("");}}}/>
              <Btn small onClick={()=>{if(!comment.trim())return;setTasks(p=>p.map(x=>x.id===t.id?{...x,comments:[...x.comments,{a:user.id,t:comment,time:fS(new Date())}]}:x));setComment("");}}>Envoyer</Btn>
            </div>
          </Card>
        </div>);
      }
      // Channel view
      if(subView?.type==="channel"){
        const ch=CHANNELS.find(c=>c.id===subView.id);const chT=tasks.filter(t=>t.ch===subView.id);const filt=filter==="all"?chT:chT.filter(t=>t.st===filter);
        return(<div style={{animation:"slideUp .3s ease"}}>
          <Back onClick={()=>{setSubView(null);setFilter("all");}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontSize:18,fontWeight:700}}>{ch?.name}</div>
            <Btn small onClick={()=>{setTForm(p=>({...p,ch:subView.id}));setModal("task");}}>+ Tâche</Btn>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            <Chip on={filter==="all"} onClick={()=>setFilter("all")}>Tous ({chT.length})</Chip>
            {TSTAT.map(st=><Chip key={st.k} on={filter===st.k} color={st.c} onClick={()=>setFilter(st.k)}>{st.l} ({chT.filter(t=>t.st===st.k).length})</Chip>)}
          </div>
          {filt.length===0&&<div style={{textAlign:"center",color:"#3a5068",padding:24,fontSize:15}}>Aucune tâche</div>}
          {filt.map(t=>{const a=staff(t.to);return(
            <div key={t.id} onClick={()=>setSubView({type:"task",id:t.id})} style={{padding:14,borderRadius:12,border,background:cardBg,marginBottom:8,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:15,fontWeight:600,flex:1,marginRight:8}}>{t.title}</div><StBadge k={t.st}/></div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><PrBadge k={t.pr}/><span style={{fontSize:13,color:gray}}>{a?.photo} {a?.name}</span></div>{t.comments.length>0&&<span style={{fontSize:13,color:gray}}>💬{t.comments.length}</span>}</div>
            </div>);})}
        </div>);
      }
      // Channels list
      return(<div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:20,fontWeight:700}}>📌 Tâches</div>
          <Btn small onClick={()=>setModal("task")}>+ Nouvelle</Btn>
        </div>
        {myCh.map(ch=>{const chT=tasks.filter(t=>t.ch===ch.id);const pend=chT.filter(t=>t.st!=="fait").length;return(
          <div key={ch.id} onClick={()=>setSubView({type:"channel",id:ch.id})} style={{padding:16,borderRadius:14,border,background:cardBg,marginBottom:10,cursor:"pointer",borderLeft:`4px solid ${ch.color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:16,fontWeight:700}}>{ch.name}</div><Count n={pend}/></div>
            <div style={{fontSize:13,color:"#7a8ba3",marginBottom:8}}>{ch.desc}</div>
            <div style={{display:"flex",gap:10,fontSize:13}}><span style={{color:gray}}>📋 {chT.length}</span><span style={{color:teal}}>✓ {chT.filter(t=>t.st==="fait").length}</span><span style={{color:yellow}}>⏳ {chT.filter(t=>t.st==="en_cours").length}</span></div>
            <div style={{display:"flex",gap:3,marginTop:8}}>{ch.members.map(mid=>{const m=staff(mid);return <span key={mid} style={{fontSize:18}} title={m?.name}>{m?.photo}</span>;})}</div>
          </div>);})}
      </div>);
    }

    return null;
  };

  // ===== MAIN =====
  const myTabs = getTabs();

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:bg,minHeight:"100vh",color:light,maxWidth:500,margin:"0 auto"}}>
      <style>{css}</style>

      {/* MODALS */}
      {modal&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16}} onClick={()=>setModal(null)}>
        <div style={{background:"#0f2027",borderRadius:16,padding:20,width:"100%",maxWidth:440,maxHeight:"85vh",overflow:"auto",border:"1px solid rgba(255,255,255,0.1)"}} onClick={e=>e.stopPropagation()}>
          {modal==="patient"&&<>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:16}}>Nouveau patient</div>
            {[["name","Nom"],["address","Adresse"],["pathology","Pathologie"],["doctor","Médecin"],["mutuelle","Mutuelle"]].map(([f,l])=><div key={f}><Label>{l}</Label><Inp value={pForm[f]} onChange={e=>setPForm(p=>({...p,[f]:e.target.value}))}/></div>)}
            <Btn onClick={()=>{if(!pForm.name)return;setPatients(p=>[...p,{...pForm,id:p.length+1,status:"actif"}]);setPForm({name:"",address:"",pathology:"",doctor:"",mutuelle:""});setModal(null);}}>Ajouter</Btn>
          </>}
          {modal==="schedule"&&<>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:16}}>Ajouter créneau</div>
            <Label>Personnel</Label><Sel value={sForm.sid} onChange={e=>setSForm(p=>({...p,sid:e.target.value}))}><option value="">Choisir...</option>{field.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Sel>
            <Label>Jour</Label><div style={{display:"flex",gap:4,marginBottom:14}}>{DAYS_W.map((d,i)=><Chip key={i} on={sForm.d===i} onClick={()=>setSForm(p=>({...p,d:i}))}>{d}</Chip>)}</div>
            <Label>Horaire</Label><Sel value={sForm.sh} onChange={e=>setSForm(p=>({...p,sh:e.target.value}))}><option value="">Choisir...</option><option>Matin</option><option>AM</option><option>Nuit</option></Sel>
            <Btn onClick={()=>{if(!sForm.sid)return;setSched(p=>[...p,{sid:parseInt(sForm.sid),d:sForm.d,sh:sForm.sh,pts:[]}]);setSForm({sid:"",d:0,sh:""});setModal(null);}}>Ajouter</Btn>
          </>}
          {modal==="task"&&<>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:16}}>Nouvelle tâche</div>
            <Label>Canal</Label><Sel value={tForm.ch} onChange={e=>setTForm(p=>({...p,ch:e.target.value}))}><option value="">Choisir...</option>{myCh.map(ch=><option key={ch.id} value={ch.id}>{ch.name}</option>)}</Sel>
            <Label>Titre</Label><Inp value={tForm.title} onChange={e=>setTForm(p=>({...p,title:e.target.value}))}/>
            <Label>Description</Label><Ta value={tForm.desc} onChange={e=>setTForm(p=>({...p,desc:e.target.value}))}/>
            <Label>Assigné à</Label><Sel value={tForm.to} onChange={e=>setTForm(p=>({...p,to:e.target.value}))}><option value="">Moi-même</option>{STAFF.map(s=><option key={s.id} value={s.id}>{s.photo} {s.name}</option>)}</Sel>
            <Label>Priorité</Label><div style={{display:"flex",gap:8,marginBottom:14}}>{PRIOS.map(p=><span key={p.k} onClick={()=>setTForm(pr=>({...pr,pr:p.k}))} style={{padding:"6px 14px",borderRadius:12,fontSize:13,fontWeight:600,background:`${p.c}20`,color:p.c,cursor:"pointer",outline:tForm.pr===p.k?`2px solid ${p.c}`:"none",outlineOffset:2}}>{p.l}</span>)}</div>
            <Btn disabled={!tForm.title||!tForm.ch} onClick={()=>{setTasks(p=>[{id:p.length+1,ch:tForm.ch,title:tForm.title,desc:tForm.desc,auth:user.id,to:parseInt(tForm.to)||user.id,pr:tForm.pr,st:"a_faire",comments:[]},...p]);setTForm({ch:"",title:"",desc:"",to:"",pr:"moyenne"});setModal(null);}}>Créer</Btn>
          </>}
          {modal==="leave"&&<>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:16}}>Demande de congé</div>
            {(user.isRH||user.admin)&&<><Label>Employé</Label><Sel value={lForm.sid} onChange={e=>setLForm(p=>({...p,sid:e.target.value}))}><option value="">Choisir...</option>{allNoDir.map(s=><option key={s.id} value={s.id}>{s.photo} {s.name}</option>)}</Sel></>}
            <Label>Type</Label><Sel value={lForm.type} onChange={e=>setLForm(p=>({...p,type:e.target.value}))}><option value="">Choisir...</option>{LEAVE_T.map(t=><option key={t}>{t}</option>)}</Sel>
            <Label>Début</Label><Inp type="date" value={lForm.from} onChange={e=>setLForm(p=>({...p,from:e.target.value}))}/>
            <Label>Fin</Label><Inp type="date" value={lForm.to2} onChange={e=>setLForm(p=>({...p,to2:e.target.value}))}/>
            <Label>Jours</Label><Inp type="number" value={lForm.days} onChange={e=>setLForm(p=>({...p,days:e.target.value}))}/>
            <Label>Motif</Label><Ta value={lForm.reason} onChange={e=>setLForm(p=>({...p,reason:e.target.value}))}/>
            <Btn onClick={()=>{if(!lForm.type||!lForm.from)return;const sid=(user.isRH||user.admin)?parseInt(lForm.sid)||user.id:user.id;setLeaves(p=>[...p,{id:p.length+1,sid,type:lForm.type,from:lForm.from,to:lForm.to2||lForm.from,days:parseInt(lForm.days)||1,reason:lForm.reason,st:"en_attente",by:null}]);setLForm({sid:"",type:"",from:"",to2:"",days:"",reason:""});setModal(null);}}>Soumettre</Btn>
          </>}
          {modal==="post"&&<>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:16}}>Publier une annonce</div>
            <Label>Catégorie</Label>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>{POST_CATS.filter(c=>c.k!=="all").map(c=><span key={c.k} onClick={()=>setBForm(p=>({...p,cat:c.k}))} style={{padding:"6px 14px",borderRadius:12,fontSize:13,fontWeight:600,background:`${c.c}20`,color:c.c,cursor:"pointer",outline:bForm.cat===c.k?`2px solid ${c.c}`:"none",outlineOffset:2}}>{c.l}</span>)}</div>
            <Label>Titre</Label><Inp placeholder="Ex: Mise à jour protocole..." value={bForm.title} onChange={e=>setBForm(p=>({...p,title:e.target.value}))}/>
            <Label>Contenu</Label><Ta style={{minHeight:120}} placeholder="Détails..." value={bForm.body} onChange={e=>setBForm(p=>({...p,body:e.target.value}))}/>
            <Btn disabled={!bForm.title} onClick={()=>{setPosts(p=>[{id:p.length+1,auth:user.id,title:bForm.title,body:bForm.body,cat:bForm.cat,pin:false,time:new Date().toISOString(),comments:[]},...p]);setBForm({title:"",body:"",cat:"general"});setModal(null);}}>Publier</Btn>
          </>}
        </div>
      </div>}

      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",background:"rgba(10,22,40,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:28}}>{user?.photo}</span><div><div style={{fontSize:16,fontWeight:600}}>{user?.name}</div><div style={{fontSize:11,color:teal,textTransform:"uppercase",letterSpacing:1}}>{user?.label}</div></div></div>
        <button onClick={logout} style={{padding:"8px 16px",borderRadius:10,border:"1px solid #2a3f55",background:"transparent",color:"#7a8ba3",fontSize:13,cursor:"pointer"}}>Sortir</button>
      </div>

      {/* TABS */}
      <div style={{display:"flex",padding:"8px 12px",gap:4,background:"rgba(10,22,40,0.6)",overflowX:"auto"}}>
        {myTabs.map(t=>(
          <div key={t.k} onClick={()=>switchTab(t.k)} style={{padding:"10px 12px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:.4,textTransform:"uppercase",whiteSpace:"nowrap",background:tab===t.k?`linear-gradient(135deg,${teal},${cyan})`:"transparent",color:tab===t.k?"#0a1628":gray,flexShrink:0,display:"flex",alignItems:"center"}}>
            {t.l}{t.k==="conges"&&user.isRH&&<Count n={pendL}/>}
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{padding:"14px 16px",paddingBottom:120}}>
        {renderContent()}
      </div>
    </div>
  );
}
import { useState, useEffect, useCallback } from "react";

const STAFF = [
  { id:1, name:"Hyacinthe", role:"directeur", pin:"0000", photo:"👨🏽‍💼", label:"Directeur Général", admin:true },
  { id:2, name:"Samir", role:"secretaire", pin:"1111", photo:"👨🏽‍💻", label:"Secrétaire", admin:true },
  { id:3, name:"Zenab Guilavogui", role:"rh", pin:"2222", photo:"👩🏽‍💻", label:"Responsable RH", admin:true, isRH:true },
  { id:4, name:"Nadine", role:"planificatrice", pin:"3333", photo:"👩🏾‍📋", label:"Planificatrice", terrain:true },
  { id:5, name:"Awa", role:"cheffe", pin:"4444", photo:"👩🏾‍⚕️", label:"Cheffe Infirmières", salary:2600, contract:"CDI", terrain:true },
  { id:6, name:"Steffi", role:"infirmiere", pin:"5555", photo:"👩‍⚕️", label:"Infirmière", salary:2400, contract:"CDI" },
  { id:7, name:"Melissa", role:"infirmiere", pin:"6666", photo:"👩🏽‍⚕️", label:"Infirmière", salary:2400, contract:"CDI" },
  { id:8, name:"Rita", role:"infirmiere", pin:"7777", photo:"👩🏾‍⚕️", label:"Infirmière", salary:2400, contract:"CDI" },
  { id:9, name:"Farida", role:"aide_soignante", pin:"8888", photo:"👩🏽‍⚕️", label:"Aide-soignante", salary:1900, contract:"CDI" },
  { id:10, name:"Aimée", role:"aide_soignante", pin:"9999", photo:"👩🏾‍⚕️", label:"Aide-soignante", salary:1900, contract:"CDI" },
  { id:11, name:"Intérimaire", role:"aide_soignante", pin:"0101", photo:"👤", label:"Intérimaire", salary:0, contract:"Intérim" },
];

const ADMIN_SAL = [{sid:2,sal:2200,c:"CDI"},{sid:3,sal:2300,c:"CDI"},{sid:4,sal:2100,c:"CDI"}];
const PATIENTS_INIT = [
  { id:1, name:"M. Dupont Jean", address:"Rue de la Loi 42, Bruxelles", pathology:"Diabète type 2", doctor:"Dr. Verhoeven", mutuelle:"Partenamut", status:"actif" },
  { id:2, name:"Mme. Mbaye Adama", address:"Av. Louise 156, Ixelles", pathology:"Post-op hanche", doctor:"Dr. Claessens", mutuelle:"Mut. chrétienne", status:"actif" },
  { id:3, name:"M. Janssens Pierre", address:"Rue Haute 89, Bruxelles", pathology:"Soins palliatifs", doctor:"Dr. Fontaine", mutuelle:"Solidaris", status:"actif" },
  { id:4, name:"Mme. De Smet Claire", address:"Ch. Waterloo 340, St-Gilles", pathology:"Perfusion antibio.", doctor:"Dr. Peeters", mutuelle:"Partenamut", status:"actif" },
  { id:5, name:"M. Traoré Moussa", address:"Rue de Flandre 72, Bruxelles", pathology:"Pansement chronique", doctor:"Dr. Lambert", mutuelle:"Solidaris", status:"actif" },
];

const CARES = ["Pansement","Injection","Perfusion","Glycémie","Soins d'hygiène","Préparation médicament","Pousse seringue","Soins palliatifs","Éducation patient","Toilette","Bas de contention"];
const DAYS_W = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const PRIOS = [{k:"haute",l:"🔴 Haute",c:"#ff6b6b"},{k:"moyenne",l:"🟡 Moyenne",c:"#f59e0b"},{k:"basse",l:"🟢 Basse",c:"#00c9a7"}];
const TSTAT = [{k:"a_faire",l:"À faire",c:"#7a8ba3"},{k:"en_cours",l:"En cours",c:"#0891b2"},{k:"fait",l:"Fait",c:"#00c9a7"},{k:"bloque",l:"Bloqué",c:"#ff6b6b"}];
const LEAVE_T = ["Congé annuel","Congé maladie","Sans solde","Récupération","Maternité","Formation"];
const CHANNELS = [
  { id:"admin", name:"🏢 Direction & Admin", desc:"Hyacinthe, Samir, Zenab", members:[1,2,3], color:"#8b5cf6" },
  { id:"general", name:"📢 Équipe Générale", desc:"Toute l'équipe", members:[1,2,3,4,5,6,7,8,9,10,11], color:"#0891b2" },
  { id:"terrain", name:"👩‍⚕️ Équipe Terrain", desc:"Awa + soignants", members:[5,6,7,8,9,10,11], color:"#00c9a7" },
  { id:"planning", name:"📅 Planning", desc:"Nadine + terrain", members:[4,5,6,7,8,9,10,11], color:"#f59e0b" },
];
const POST_CATS = [{k:"all",l:"Tous",c:"#7a8ba3"},{k:"protocole",l:"📋 Protocole",c:"#8b5cf6"},{k:"patient",l:"🏥 Patient",c:"#0891b2"},{k:"planning",l:"📅 Planning",c:"#f59e0b"},{k:"admin",l:"🏢 Admin",c:"#00c9a7"},{k:"general",l:"💬 Général",c:"#7a8ba3"}];

const gL = () => ({ lat:50.8466+(Math.random()-.5)*.01, lng:4.3528+(Math.random()-.5)*.01, acc:Math.floor(Math.random()*15)+5 });
const fT = d => new Date(d).toLocaleTimeString('fr-BE',{hour:'2-digit',minute:'2-digit'});
const fD = d => new Date(d).toLocaleDateString('fr-BE',{weekday:'long',day:'numeric',month:'long'});
const fS = d => new Date(d).toLocaleDateString('fr-BE',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
const staff = id => STAFF.find(s=>s.id===id);
const field = STAFF.filter(s=>["infirmiere","aide_soignante"].includes(s.role)||s.terrain);
const allNoDir = STAFF.filter(s=>s.id!==1);

export default function App() {
  const [page,setPage] = useState("login");
  const [user,setUser] = useState(null);
  const [pin,setPin] = useState("");
  const [err,setErr] = useState("");
  const [tab,setTab] = useState("");
  const [now,setNow] = useState(new Date());

  // Clock
  const [cIn,setCIn] = useState(false);
  const [cTime,setCTime] = useState(null);
  const [cLoc,setCLoc] = useState(null);
  const [clocks,setClocks] = useState([
    {sid:4,t:"in",time:new Date(Date.now()-36e5*2.5).toISOString(),loc:gL()},
    {sid:5,t:"in",time:new Date(Date.now()-36e5*3.5).toISOString(),loc:gL()},
    {sid:6,t:"in",time:new Date(Date.now()-36e5*3).toISOString(),loc:gL()},
    {sid:7,t:"in",time:new Date(Date.now()-36e5*2).toISOString(),loc:gL()},
    {sid:8,t:"in",time:new Date(Date.now()-36e5*4).toISOString(),loc:gL()},
    {sid:9,t:"in",time:new Date(Date.now()-36e5).toISOString(),loc:gL()},
    {sid:10,t:"in",time:new Date(Date.now()-36e5*1.5).toISOString(),loc:gL()},
  ]);

  // Data
  const [patients,setPatients] = useState(PATIENTS_INIT);
  const [reports,setReports] = useState([
    {id:1,sid:6,pid:1,cares:["Glycémie","Injection"],notes:"Glycémie 1.45g/L. Insuline administrée.",dur:25,vitals:{ta:"13/8",temp:"36.8",p:"72"},time:new Date(Date.now()-36e5*2).toISOString(),loc:gL(),valid:true},
    {id:2,sid:7,pid:2,cares:["Pansement","Surveillance post-op"],notes:"Pansement changé. Cicatrisation OK.",dur:40,vitals:{ta:"12/7",temp:"37.1",p:"68"},time:new Date(Date.now()-36e5*1.5).toISOString(),loc:gL(),valid:false},
    {id:3,sid:8,pid:5,cares:["Pansement","Soins d'hygiène"],notes:"Pansement refait. Toilette partielle.",dur:35,vitals:{ta:"11/7",temp:"36.5",p:"70"},time:new Date(Date.now()-36e5).toISOString(),loc:gL(),valid:false},
  ]);
  const [sched,setSched] = useState([
    {sid:4,d:0,sh:"Matin",pts:[3]},{sid:4,d:3,sh:"AM",pts:[1,4]},
    {sid:5,d:0,sh:"Matin",pts:[2,5]},{sid:5,d:2,sh:"Matin",pts:[3]},
    {sid:6,d:0,sh:"Matin",pts:[1,4]},{sid:6,d:1,sh:"Matin",pts:[1,2]},
    {sid:7,d:0,sh:"Matin",pts:[2,3]},{sid:7,d:2,sh:"AM",pts:[5]},
    {sid:8,d:0,sh:"Matin",pts:[5]},{sid:8,d:1,sh:"AM",pts:[3,5]},
    {sid:9,d:0,sh:"AM",pts:[3]},{sid:9,d:2,sh:"Matin",pts:[1]},
    {sid:10,d:0,sh:"Matin",pts:[2]},{sid:10,d:1,sh:"AM",pts:[5]},
  ]);
  const [invs] = useState([
    {id:1,pid:1,amt:156.80,st:"payée",date:"25/02",mut:"Partenamut"},
    {id:2,pid:2,amt:234.50,st:"en attente",date:"26/02",mut:"Mut. chrétienne"},
    {id:3,pid:3,amt:312.00,st:"en attente",date:"27/02",mut:"Solidaris"},
    {id:4,pid:5,amt:89.00,st:"payée",date:"24/02",mut:"Solidaris"},
    {id:5,pid:4,amt:178.50,st:"rejetée",date:"20/02",mut:"Partenamut"},
  ]);
  const [leaves,setLeaves] = useState([
    {id:1,sid:6,type:"Congé annuel",from:"16/03",to:"20/03",days:5,reason:"Vacances",st:"approuvé",by:3},
    {id:2,sid:9,type:"Congé maladie",from:"27/02",to:"28/02",days:2,reason:"Grippe",st:"approuvé",by:3},
    {id:3,sid:7,type:"Congé annuel",from:"07/04",to:"11/04",days:5,reason:"Voyage",st:"en_attente",by:null},
    {id:4,sid:8,type:"Récupération",from:"07/03",to:"07/03",days:1,reason:"Heures sup.",st:"en_attente",by:null},
    {id:5,sid:5,type:"Formation",from:"24/03",to:"25/03",days:2,reason:"Soins palliatifs CHU",st:"approuvé",by:3},
  ]);
  const [salaries,setSalaries] = useState([
    {id:1,m:"Fév",sid:6,base:2400,bonus:150,ded:320,net:2230,st:"payé"},
    {id:2,m:"Fév",sid:7,base:2400,bonus:0,ded:320,net:2080,st:"payé"},
    {id:3,m:"Fév",sid:8,base:1900,bonus:100,ded:250,net:1750,st:"payé"},
    {id:4,m:"Fév",sid:9,base:1900,bonus:0,ded:250,net:1650,st:"en_attente"},
    {id:5,m:"Fév",sid:5,base:2600,bonus:200,ded:350,net:2450,st:"payé"},
    {id:10,m:"Fév",sid:10,base:1900,bonus:0,ded:250,net:1650,st:"payé"},
    {id:6,m:"Fév",sid:4,base:2100,bonus:0,ded:280,net:1820,st:"payé"},
    {id:7,m:"Fév",sid:2,base:2200,bonus:0,ded:290,net:1910,st:"payé"},
    {id:8,m:"Fév",sid:3,base:2300,bonus:0,ded:305,net:1995,st:"payé"},
  ]);

  // Tasks
  const [tasks,setTasks] = useState([
    {id:1,ch:"admin",title:"Renouvellement Partenamut",desc:"Contrat expire fin mars.",auth:1,to:2,pr:"haute",st:"en_cours",comments:[{a:3,t:"Barème reçu cette semaine.",time:"27/02"}]},
    {id:2,ch:"admin",title:"Recrutement infirmière",desc:"Volume en hausse.",auth:3,to:3,pr:"haute",st:"a_faire",comments:[{a:1,t:"Budget validé.",time:"26/02"}]},
    {id:3,ch:"general",title:"Réunion mars",desc:"Ordre du jour.",auth:1,to:1,pr:"moyenne",st:"en_cours",comments:[]},
    {id:4,ch:"terrain",title:"Réévaluation Janssens",desc:"RDV Dr. Fontaine.",auth:5,to:6,pr:"haute",st:"en_cours",comments:[{a:6,t:"Confirmé jeudi 14h.",time:"27/02"}]},
    {id:5,ch:"terrain",title:"Stock gants/masques",desc:"Commander.",auth:5,to:7,pr:"moyenne",st:"fait",comments:[]},
    {id:6,ch:"planning",title:"Redistribution Steffi S12",desc:"Congé semaine 12.",auth:4,to:4,pr:"haute",st:"en_cours",comments:[]},
  ]);

  // Shared board
  const [posts,setPosts] = useState([
    {id:1,auth:1,title:"Nouveau protocole COVID — Mars 2026",body:"Masque FFP2 obligatoire chez patients immunodéprimés. Documents au bureau. Signez l'accusé de réception.",cat:"protocole",pin:true,time:new Date(Date.now()-864e5).toISOString(),comments:[{a:5,t:"Noté, je distribue lundi.",time:new Date(Date.now()-36e5*12).toISOString()},{a:6,t:"Reçu merci !",time:new Date(Date.now()-36e5*8).toISOString()}]},
    {id:2,auth:5,title:"Point M. Janssens — Soins palliatifs",body:"État dégradé. RDV Dr. Fontaine jeudi. Steffi et Melissa, préparez vos observations.",cat:"patient",pin:false,time:new Date(Date.now()-36e5*6).toISOString(),comments:[{a:6,t:"Baisse appétit et fatigue. Rapport en cours.",time:new Date(Date.now()-36e5*4).toISOString()}]},
    {id:3,auth:3,title:"Fiches de paie février",body:"Fiches prêtes. Passez au bureau pour signature. Farida, virement en cours.",cat:"admin",pin:false,time:new Date(Date.now()-36e5*3).toISOString(),comments:[]},
    {id:4,auth:4,title:"Planning mars — Modifications",body:"Mis à jour suite congé Steffi S12. Melissa prend patients 1 et 4. Farida patient 2. Vérifiez vos horaires.",cat:"planning",pin:false,time:new Date(Date.now()-36e5*2).toISOString(),comments:[{a:7,t:"Noté, pas de souci.",time:new Date(Date.now()-36e5).toISOString()},{a:9,t:"OK pour patient 2.",time:new Date(Date.now()-18e5).toISOString()}]},
  ]);

  // UI states
  const [modal,setModal] = useState(null);
  const [subView,setSubView] = useState(null); // {type:"channel",id} | {type:"task",id} | {type:"post",id}
  const [filter,setFilter] = useState("all");
  const [comment,setComment] = useState("");

  // Form states
  const [rForm,setRForm] = useState({pid:"",cares:[],notes:"",dur:"30",ta:"",temp:"",pulse:""});
  const [pForm,setPForm] = useState({name:"",address:"",pathology:"",doctor:"",mutuelle:""});
  const [sForm,setSForm] = useState({sid:"",d:0,sh:""});
  const [tForm,setTForm] = useState({ch:"",title:"",desc:"",to:"",pr:"moyenne"});
  const [lForm,setLForm] = useState({sid:"",type:"",from:"",to2:"",days:"",reason:""});
  const [bForm,setBForm] = useState({title:"",body:"",cat:"general"});

  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);

  // Helpers
  const getSt = useCallback(id=>{const r=clocks.filter(c=>c.sid===id);const l=r[r.length-1];if(!l)return{s:"off",t:null,loc:null};return{s:l.t==="in"?"on":"off",t:l.time,loc:l.loc};},[clocks]);
  const actives = field.filter(n=>getSt(n.id).s==="on").length;
  const todayR = reports.filter(r=>new Date(r.time).toDateString()===now.toDateString());
  const pendR = reports.filter(r=>!r.valid);
  const totMin = todayR.reduce((s,r)=>s+r.dur,0);
  const paidI = invs.filter(i=>i.st==="payée").reduce((s,i)=>s+i.amt,0);
  const pendI = invs.filter(i=>i.st==="en attente").reduce((s,i)=>s+i.amt,0);
  const myCh = user ? CHANNELS.filter(ch=>ch.members.includes(user.id)) : [];
  const pendL = leaves.filter(l=>l.st==="en_attente").length;
  const totPay = salaries.reduce((s,p)=>s+p.net,0);
  const paidPay = salaries.filter(s=>s.st==="payé").reduce((s,p)=>s+p.net,0);
  const lvBal = id=>{const u=leaves.filter(l=>l.sid===id&&l.st==="approuvé"&&l.type==="Congé annuel").reduce((s,l)=>s+l.days,0);return{tot:20,u,r:20-u};};

  const login=()=>{const s=STAFF.find(x=>x.pin===pin);if(!s){setErr("Code PIN incorrect");return;}setUser(s);setPage("app");setErr("");setPin("");if(s.admin)setTab("dashboard");else if(s.role==="planificatrice")setTab("pointage");else if(s.role==="cheffe")setTab("pointage");else setTab("pointage");const lr=clocks.filter(c=>c.sid===s.id).pop();if(lr&&lr.t==="in"){setCIn(true);setCTime(lr.time);setCLoc(lr.loc);}};
  const logout=()=>{setPage("login");setUser(null);setCIn(false);setCTime(null);setTab("");setPin("");setSubView(null);setModal(null);};

  const switchTab=(t)=>{setTab(t);setSubView(null);setFilter("all");setComment("");};

  // STYLES
  const bg = "linear-gradient(170deg,#0a1628,#0f2027 40%,#162a3a)";
  const teal = "#00c9a7";
  const cyan = "#0891b2";
  const red = "#ff6b6b";
  const yellow = "#f59e0b";
  const purple = "#8b5cf6";
  const gray = "#5a7089";
  const dark = "#1e3348";
  const light = "#e8edf3";
  const cardBg = "rgba(255,255,255,0.04)";
  const border = "1px solid rgba(255,255,255,0.06)";

  const css = `@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Outfit',sans-serif}@keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes pop{0%{transform:scale(.3);opacity:0}60%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}input::placeholder,textarea::placeholder{color:#3a5068}select option{background:#0f2027;color:#e8edf3}::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:#1e3348;border-radius:3px}input[type=date]{color-scheme:dark}`;

  const Card = ({children,style:s}) => <div style={{background:cardBg,borderRadius:16,border,padding:18,marginBottom:12,...s}}>{children}</div>;
  const Label = ({children}) => <div style={{fontSize:13,fontWeight:600,color:gray,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{children}</div>;
  const Inp = (props) => <input {...props} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${dark}`,background:"rgba(255,255,255,0.04)",color:light,fontSize:15,marginBottom:14,outline:"none",boxSizing:"border-box",...(props.style||{})}}/>;
  const Sel = (props) => <select {...props} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${dark}`,background:"rgba(255,255,255,0.04)",color:light,fontSize:15,marginBottom:14,outline:"none",boxSizing:"border-box",...(props.style||{})}}>{props.children}</select>;
  const Ta = (props) => <textarea {...props} style={{width:"100%",padding:"12px 14px",borderRadius:10,border:`1px solid ${dark}`,background:"rgba(255,255,255,0.04)",color:light,fontSize:15,minHeight:80,resize:"vertical",outline:"none",fontFamily:"inherit",marginBottom:14,boxSizing:"border-box",...(props.style||{})}}/>;
  const Chip = ({on,children,onClick,color:cc}) => <span onClick={onClick} style={{padding:"8px 14px",borderRadius:16,fontSize:13,fontWeight:600,cursor:"pointer",border:`1px solid ${on?(cc||teal):dark}`,background:on?`${cc||teal}20`:"transparent",color:on?(cc||teal):"#7a8ba3"}}>{children}</span>;
  const Btn = ({disabled:d,children,onClick,danger,small}) => <button onClick={d?undefined:onClick} style={{width:small?"auto":"100%",padding:small?"8px 18px":"14px 0",borderRadius:small?10:12,border:"none",background:d?dark:danger?`linear-gradient(135deg,${red},#ee5a24)`:`linear-gradient(135deg,${teal},${cyan})`,color:d?gray:danger?"#fff":"#0a1628",fontSize:small?13:16,fontWeight:700,cursor:d?"not-allowed":"pointer",flexShrink:0}}>{children}</button>;
  const Badge = ({on,children}) => <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 12px",borderRadius:16,fontSize:12,fontWeight:600,background:on?`${teal}20`:`${red}20`,color:on?teal:red}}>{children}</span>;
  const Dot = ({on}) => <span style={{width:10,height:10,borderRadius:"50%",background:on?teal:red,flexShrink:0}}/>;
  const StatBox = ({v,l,c}) => <div style={{padding:14,borderRadius:14,background:`${c}12`,border:`1px solid ${c}25`,textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:c,lineHeight:1}}>{v}</div><div style={{fontSize:11,color:gray,marginTop:3,textTransform:"uppercase"}}>{l}</div></div>;
  const Count = ({n}) => n>0?<span style={{background:red,color:"#fff",fontSize:10,fontWeight:700,borderRadius:12,padding:"2px 8px",marginLeft:6}}>{n}</span>:null;
  const Back = ({onClick}) => <button onClick={onClick} style={{padding:"8px 16px",borderRadius:10,border:`1px solid #2a3f55`,background:"transparent",color:"#7a8ba3",fontSize:13,cursor:"pointer",marginBottom:12}}>← Retour</button>;
  const Avatar = ({e}) => <span style={{fontSize:26,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,background:`${teal}15`,flexShrink:0}}>{e}</span>;
  const InvBadge = ({s}) => <span style={{padding:"3px 10px",borderRadius:10,fontSize:12,fontWeight:600,background:(s==="payée"||s==="payé")?`${teal}20`:(s==="en attente"||s==="en_attente")?`${yellow}20`:`${red}20`,color:(s==="payée"||s==="payé")?teal:(s==="en attente"||s==="en_attente")?yellow:red}}>{s}</span>;
  const PrBadge = ({k}) => {const p=PRIOS.find(x=>x.k===k);return <span style={{padding:"3px 10px",borderRadius:12,fontSize:11,fontWeight:600,background:`${p?.c||gray}20`,color:p?.c||gray}}>{p?.l||k}</span>};
  const StBadge = ({k,onClick}) => {const s=TSTAT.find(x=>x.k===k)||TSTAT[0];return <span onClick={onClick} style={{padding:"4px 12px",borderRadius:12,fontSize:11,fontWeight:700,background:`${s.c}20`,color:s.c,cursor:onClick?"pointer":"default"}}>{s.l}</span>};

  // ===== LOGIN =====
  if(page==="login") return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:bg,minHeight:"100vh",color:light,maxWidth:500,margin:"0 auto"}}>
      <style>{css}</style>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
        <div style={{width:90,height:90,borderRadius:22,background:`linear-gradient(135deg,${teal},${cyan})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,marginBottom:18,boxShadow:`0 8px 32px ${teal}50`}}>🏥</div>
        <div style={{fontSize:32,fontWeight:700,background:`linear-gradient(135deg,${teal},${cyan})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>HHC Services</div>
        <div style={{fontSize:14,color:gray,marginBottom:36,letterSpacing:2,textTransform:"uppercase"}}>Soins infirmiers à domicile</div>
        <div style={{display:"flex",gap:14,marginBottom:28}}>{[0,1,2,3].map(i=><div key={i} style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${pin.length>i?teal:"#2a3f55"}`,background:pin.length>i?teal:"transparent"}}/>)}</div>
        {err&&<div style={{color:red,fontSize:15,marginBottom:14}}>{err}</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,width:"100%",maxWidth:300,marginBottom:24}}>
          {[1,2,3,4,5,6,7,8,9,"⌫",0,"→"].map((k,i)=>(
            <button key={i} style={{height:60,borderRadius:14,border:k==="→"?"none":`1px solid ${dark}`,background:k==="→"?`linear-gradient(135deg,${teal},${cyan})`:"rgba(255,255,255,0.04)",color:k==="→"?"#0a1628":k==="⌫"?red:light,fontSize:k==="→"?16:24,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>{if(k==="⌫"){setPin(p=>p.slice(0,-1));setErr("");}else if(k==="→")login();else if(pin.length<4)setPin(p=>p+k);}}>{k}</button>
          ))}
        </div>
        <div style={{fontSize:12,color:"#3a5068",textAlign:"center",marginTop:8}}>Entrez votre code PIN</div>
      </div>
    </div>
  );

  // TAB CONFIG
  const getTabs = () => {
    if(!user) return [];
    if(user.isRH) return [{k:"dashboard",l:"📊 Board"},{k:"pointages",l:"⏱ Pointages"},{k:"conges",l:"🏖️ Congés"},{k:"salaires",l:"💰 Salaires"},{k:"equipe",l:"👥 Équipe"},{k:"board",l:"📢 Commun"},{k:"jira",l:"📌 Tâches"}];
    if(user.admin) return [{k:"dashboard",l:"📊 Board"},{k:"pointages",l:"⏱ Pointages"},{k:"equipe",l:"👥 Équipe"},{k:"rapports",l:"📋 Visites"},{k:"patients",l:"🏥 Patients"},{k:"finances",l:"💰 Finance"},{k:"board",l:"📢 Commun"},{k:"jira",l:"📌 Tâches"}];
    if(user.role==="planificatrice") return [{k:"pointage",l:"⏱ Pointage"},{k:"rapport",l:"📋 Rapport"},{k:"planning",l:"📅 Planning"},{k:"board",l:"📢 Commun"},{k:"jira",l:"📌 Tâches"}];
    if(user.role==="cheffe") return [{k:"pointage",l:"⏱ Pointage"},{k:"rapport",l:"📋 Rapport"},{k:"supervision",l:"🔴 Live"},{k:"rapports",l:"📋 Visites"},{k:"equipe",l:"👥 Équipe"},{k:"board",l:"📢 Commun"},{k:"jira",l:"📌 Tâches"}];
    return [{k:"pointage",l:"⏱ Pointage"},{k:"rapport",l:"📋 Rapport"},{k:"planning",l:"📅 Planning"},{k:"board",l:"📢 Commun"},{k:"conges",l:"🏖️ Congés"},{k:"jira",l:"📌 Tâches"}];
  };

  // ===== RENDER CONTENT =====
  const renderContent = () => {
    // DASHBOARD
    if(tab==="dashboard") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <StatBox v={`${actives}/${field.length}`} l="En service" c={teal}/>
          <StatBox v={todayR.length} l="Visites" c={cyan}/>
          <StatBox v={`${totMin}m`} l="Temps soins" c={purple}/>
          <StatBox v={pendR.length} l="À valider" c={yellow}/>
        </div>
        {!user.isRH&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <StatBox v={`€${paidI.toFixed(0)}`} l="Encaissé" c={teal}/>
          <StatBox v={`€${pendI.toFixed(0)}`} l="En attente" c={yellow}/>
        </div>}
        <Card><div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>📍 Localisation temps réel</div>
          {field.map(n=>{const st=getSt(n.id);return(
            <div key={n.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,0.03)",borderRadius:12,border,marginBottom:8}}>
              <Avatar e={n.photo}/>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:600}}>{n.name}</div>
                <div style={{fontSize:13,color:st.s==="on"?teal:red,fontWeight:600}}>● {st.s==="on"?"En service":"Hors service"}{st.t&&` · ${fT(st.t)}`}</div>
                {st.loc&&<div style={{fontSize:12,color:gray}}>📍 {st.loc.lat.toFixed(4)}, {st.loc.lng.toFixed(4)}</div>}
              </div>
              <Dot on={st.s==="on"}/>
            </div>);})}
        </Card>
      </div>
    );

    // POINTAGES (Admin view)
    if(tab==="pointages") {
      const today = clocks.filter(c=>new Date(c.time).toDateString()===now.toDateString());
      return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{fontSize:20,fontWeight:700,marginBottom:12}}>⏱ Pointages du jour</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <StatBox v={field.filter(n=>getSt(n.id).s==="on").length} l="En service" c={teal}/>
          <StatBox v={field.filter(n=>getSt(n.id).s==="off").length} l="Hors service" c={red}/>
        </div>
        {field.map(s=>{const st=getSt(s.id);const recs=clocks.filter(c=>c.sid===s.id).slice().reverse();return(
          <Card key={s.id}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <Avatar e={s.photo}/>
              <div style={{flex:1}}>
                <div style={{fontSize:16,fontWeight:600}}>{s.name}</div>
                <div style={{fontSize:13,color:gray}}>{s.label}</div>
              </div>
              <Badge on={st.s==="on"}><Dot on={st.s==="on"}/>{st.s==="on"?"En service":"Absent"}</Badge>
            </div>
            {st.loc&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 12px",background:`${teal}12`,borderRadius:10,marginBottom:8,fontSize:12,color:"#7a8ba3"}}>📍 {st.loc.lat.toFixed(4)}, {st.loc.lng.toFixed(4)} (±{st.loc.acc}m)</div>}
            {recs.length>0&&<div style={{borderTop:"1px solid rgba(255,255,255,0.04)",paddingTop:8}}>
              <div style={{fontSize:12,fontWeight:700,color:gray,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Historique</div>
              {recs.slice(0,4).map((c,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>{c.t==="in"?"🟢":"🔴"}</span>
                    <span style={{fontSize:14,fontWeight:600,color:c.t==="in"?teal:red}}>{c.t==="in"?"Entrée":"Sortie"}</span>
                  </div>
                  <span style={{fontSize:13,color:gray}}>{fT(c.time)}</span>
                </div>
              ))}
            </div>}
          </Card>);})}
      </div>);
    }

    // EQUIPE
    if(tab==="equipe") return (
      <div style={{animation:"slideUp .3s ease"}}>
        {(user.admin?allNoDir:field).map(s=>{const st=getSt(s.id);const sR=reports.filter(r=>r.sid===s.id);return(
          <Card key={s.id}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <Avatar e={s.photo}/>
              <div style={{flex:1}}><div style={{fontSize:16,fontWeight:600}}>{s.name}</div><div style={{fontSize:13,color:teal}}>{s.label}</div></div>
              {["infirmiere","aide_soignante"].includes(s.role)&&<Dot on={st.s==="on"}/>}
            </div>
            {["infirmiere","aide_soignante"].includes(s.role)&&<div style={{display:"flex",gap:8}}>
              <div style={{flex:1,textAlign:"center",padding:8,background:`${teal}10`,borderRadius:8}}><div style={{fontSize:20,fontWeight:700,color:teal}}>{sR.length}</div><div style={{fontSize:11,color:gray}}>VISITES</div></div>
              <div style={{flex:1,textAlign:"center",padding:8,background:`${cyan}10`,borderRadius:8}}><div style={{fontSize:20,fontWeight:700,color:cyan}}>{sR.reduce((a,r)=>a+r.dur,0)}m</div><div style={{fontSize:11,color:gray}}>DURÉE</div></div>
            </div>}
          </Card>);})}
      </div>
    );

    // RAPPORTS VISITES
    if(tab==="rapports") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
          {["all","pending","valid"].map(f=><Chip key={f} on={filter===f} onClick={()=>setFilter(f)}>{f==="all"?"Tous":f==="pending"?"En attente":"Validés"}</Chip>)}
        </div>
        {reports.filter(r=>filter==="all"?true:filter==="pending"?!r.valid:r.valid).slice().reverse().map(r=>{const n=staff(r.sid);const p=patients.find(x=>x.id===r.pid);return(
          <Card key={r.id}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div><div style={{fontSize:15,fontWeight:600}}>{n?.photo} {n?.name}</div><div style={{fontSize:14,color:teal}}>→ {p?.name}</div></div><div style={{textAlign:"right"}}><div style={{fontSize:13,color:gray}}>{fT(r.time)}</div><div style={{fontSize:12,color:cyan}}>{r.dur}min</div></div></div>
            <div style={{marginBottom:6}}>{r.cares.map(c=><span key={c} style={{padding:"3px 10px",borderRadius:8,fontSize:12,background:`${cyan}20`,color:cyan,display:"inline-block",marginRight:4,marginBottom:4}}>{c}</span>)}</div>
            <div style={{fontSize:14,color:"#7a8ba3",lineHeight:1.6}}>{r.notes}</div>
            {r.vitals&&<div style={{display:"flex",gap:14,fontSize:13,color:gray,paddingTop:6,borderTop:"1px solid rgba(255,255,255,0.04)",marginTop:6}}>{r.vitals.ta&&<span>TA: <b style={{color:light}}>{r.vitals.ta}</b></span>}{r.vitals.temp&&<span>T°: <b style={{color:light}}>{r.vitals.temp}°C</b></span>}{r.vitals.p&&<span>P: <b style={{color:light}}>{r.vitals.p}</b></span>}</div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <Badge on={r.valid}>{r.valid?"✓ Validé":"⏳ En attente"}</Badge>
              {!r.valid&&(user.admin||user.role==="cheffe")&&<Btn small onClick={()=>setReports(p=>p.map(x=>x.id===r.id?{...x,valid:true}:x))}>Valider</Btn>}
            </div>
          </Card>);})}
      </div>
    );

    // PATIENTS
    if(tab==="patients") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{marginBottom:12}}><Btn small onClick={()=>setModal("patient")}>+ Nouveau patient</Btn></div>
        {patients.map(p=>(
          <Card key={p.id}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div><div style={{fontSize:16,fontWeight:600}}>{p.name}</div><div style={{fontSize:14,color:teal}}>{p.pathology}</div></div><Badge on={p.status==="actif"}>{p.status}</Badge></div>
            <div style={{fontSize:14,color:"#7a8ba3",lineHeight:1.8}}>📍 {p.address}<br/>👨‍⚕️ {p.doctor} · 🏥 {p.mutuelle}</div>
          </Card>))}
      </div>
    );

    // FINANCES
    if(tab==="finances") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <StatBox v={`€${paidI.toFixed(0)}`} l="Encaissé" c={teal}/><StatBox v={`€${pendI.toFixed(0)}`} l="En attente" c={yellow}/>
        </div>
        <Card><div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Factures</div>
          {invs.map(inv=>{const p=patients.find(x=>x.id===inv.pid);return(
            <div key={inv.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div><div style={{fontSize:15,fontWeight:600}}>{p?.name}</div><div style={{fontSize:13,color:gray}}>{inv.date} · {inv.mut}</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:700}}>€{inv.amt.toFixed(2)}</div><InvBadge s={inv.st}/></div>
            </div>);})}
        </Card>
      </div>
    );

    // CONGÉS
    if(tab==="conges"){
      const isRH=user.isRH;const myL=isRH?leaves:leaves.filter(l=>l.sid===user.id);const filt=filter==="all"?myL:myL.filter(l=>l.st===filter);
      return(
      <div style={{animation:"slideUp .3s ease"}}>
        {isRH&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}><StatBox v={pendL} l="En attente" c={yellow}/><StatBox v={leaves.filter(l=>l.st==="approuvé").length} l="Approuvés" c={teal}/></div>}
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}><Chip on={filter==="all"} onClick={()=>setFilter("all")}>Tous</Chip><Chip on={filter==="en_attente"} color={yellow} onClick={()=>setFilter("en_attente")}>⏳ Attente</Chip></div>
          <Btn small onClick={()=>setModal("leave")}>+ Demande</Btn>
        </div>
        {isRH&&<Card><div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Solde congés annuels</div>
          {allNoDir.map(s=>{const b=lvBal(s.id);return(
            <div key={s.id} style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:15,fontWeight:600}}>{s.photo} {s.name}</span><span style={{fontSize:14,color:teal,fontWeight:700}}>{b.r}j restants</span></div>
              <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",width:`${(b.u/b.tot)*100}%`,borderRadius:4,background:b.r<5?red:teal}}/></div>
            </div>);})}
        </Card>}
        {filt.map(l=>{const s=staff(l.sid);const ap=l.by?staff(l.by):null;return(
          <Card key={l.id}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div><div style={{fontSize:16,fontWeight:600}}>{s?.photo} {s?.name}</div><div style={{fontSize:14,color:cyan}}>{l.type}</div></div>
              <span style={{padding:"4px 12px",borderRadius:12,fontSize:12,fontWeight:700,background:l.st==="approuvé"?`${teal}20`:l.st==="en_attente"?`${yellow}20`:`${red}20`,color:l.st==="approuvé"?teal:l.st==="en_attente"?yellow:red}}>{l.st==="en_attente"?"⏳ En attente":l.st==="approuvé"?"✓ Approuvé":"✗ Refusé"}</span>
            </div>
            <div style={{fontSize:14,color:"#7a8ba3",lineHeight:1.8}}>📅 {l.from} → {l.to} <b style={{color:light}}>({l.days}j)</b><br/>💬 {l.reason}</div>
            {ap&&<div style={{fontSize:13,color:gray,marginTop:4}}>Par {ap.photo} {ap.name}</div>}
            {l.st==="en_attente"&&isRH&&<div style={{display:"flex",gap:10,marginTop:10}}>
              <Btn small onClick={()=>setLeaves(p=>p.map(x=>x.id===l.id?{...x,st:"approuvé",by:user.id}:x))}>✓ Approuver</Btn>
              <Btn small danger onClick={()=>setLeaves(p=>p.map(x=>x.id===l.id?{...x,st:"refusé",by:user.id}:x))}>✗ Refuser</Btn>
            </div>}
          </Card>);})}
      </div>);
    }

    // SALAIRES
    if(tab==="salaires") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}><StatBox v={`€${totPay.toLocaleString()}`} l="Masse salariale" c={purple}/><StatBox v={`€${paidPay.toLocaleString()}`} l="Payé" c={teal}/></div>
        <Card><div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Fiches de paie — Février 2026</div>
          {salaries.map(sp=>{const s=staff(sp.sid);return(
            <div key={sp.id} style={{padding:"12px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:22}}>{s?.photo}</span><div><div style={{fontSize:15,fontWeight:600}}>{s?.name}</div><div style={{fontSize:12,color:gray}}>{s?.label}</div></div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:700}}>€{sp.net}</div><InvBadge s={sp.st}/></div>
              </div>
              <div style={{display:"flex",gap:16,fontSize:13,color:gray}}><span>Brut: <b style={{color:light}}>€{sp.base}</b></span>{sp.bonus>0&&<span>Prime: <b style={{color:teal}}>+€{sp.bonus}</b></span>}<span>Ret.: <b style={{color:red}}>-€{sp.ded}</b></span></div>
              {sp.st!=="payé"&&<div style={{marginTop:8}}><Btn small onClick={()=>setSalaries(p=>p.map(x=>x.id===sp.id?{...x,st:"payé"}:x))}>💳 Marquer payé</Btn></div>}
            </div>);})}
          <div style={{display:"flex",justifyContent:"space-between",paddingTop:12,marginTop:8,borderTop:`2px solid rgba(255,255,255,0.1)`}}><span style={{fontSize:16,fontWeight:700}}>TOTAL</span><span style={{fontSize:20,fontWeight:700,color:purple}}>€{totPay.toLocaleString()}</span></div>
        </Card>
      </div>
    );

    // SUPERVISION
    if(tab==="supervision") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}><StatBox v={actives} l="En service" c={teal}/><StatBox v={pendR.length} l="À valider" c={yellow}/></div>
        <Card><div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Équipe terrain — Live</div>
          {field.map(n=>{const st=getSt(n.id);return(
            <div key={n.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:"rgba(255,255,255,0.03)",borderRadius:12,border,marginBottom:8}}>
              <Avatar e={n.photo}/><div style={{flex:1}}><div style={{fontSize:16,fontWeight:600}}>{n.name} <span style={{fontSize:13,color:gray}}>({n.label})</span></div><div style={{fontSize:13,color:st.s==="on"?teal:red,fontWeight:600}}>● {st.s==="on"?"En service":"Hors service"}{st.t&&` · ${fT(st.t)}`}</div>{st.loc&&<div style={{fontSize:12,color:gray}}>📍 {st.loc.lat.toFixed(4)}, {st.loc.lng.toFixed(4)}</div>}</div><Dot on={st.s==="on"}/>
            </div>);})}
        </Card>
      </div>
    );

    // PLANNING
    if(tab==="planning") return (
      <div style={{animation:"slideUp .3s ease"}}>
        {user.role==="planificatrice"&&<div style={{marginBottom:12}}><Btn small onClick={()=>setModal("schedule")}>+ Créneau</Btn></div>}
        {(["infirmiere","aide_soignante"].includes(user.role)?field.filter(s=>s.id===user.id):field).map(s=>{const entries=sched.filter(e=>e.sid===s.id);return(
          <Card key={s.id}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{fontSize:22}}>{s.photo}</span><div><div style={{fontSize:16,fontWeight:600}}>{s.name}</div><div style={{fontSize:12,color:gray}}>{s.label}</div></div></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
              {DAYS_W.map((d,i)=><div key={i} style={{fontSize:11,fontWeight:700,color:gray,textAlign:"center",padding:3}}>{d}</div>)}
              {DAYS_W.map((_,i)=>{const e=entries.find(e=>e.d===i);return <div key={i} style={{padding:6,textAlign:"center",borderRadius:6,fontSize:11,background:e?`${teal}18`:"rgba(255,255,255,0.02)",color:e?teal:"#3a5068",border:`1px solid ${e?`${teal}30`:"rgba(255,255,255,0.04)"}`}}>{e?<>{e.sh}<br/><span style={{fontSize:10}}>{e.pts.length}p</span></>:"—"}</div>;})}
            </div>
          </Card>);})}
      </div>
    );

    // POINTAGE
    if(tab==="pointage") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <Card>
          <div style={{fontSize:52,fontWeight:300,textAlign:"center",letterSpacing:-2,lineHeight:1}}>{now.toLocaleTimeString('fr-BE',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}</div>
          <div style={{textAlign:"center",fontSize:15,color:gray,marginBottom:14,textTransform:"capitalize"}}>{fD(now)}</div>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}><Badge on={cIn}><Dot on={cIn}/>{cIn?"En service":"Hors service"}</Badge></div>
          {cIn&&cTime&&<div style={{textAlign:"center",fontSize:14,color:gray,marginBottom:12}}>Début: {fT(cTime)} — {Math.floor((now-new Date(cTime))/60000)}min</div>}
          <button style={{width:"100%",padding:"18px 0",borderRadius:14,border:"none",background:cIn?`linear-gradient(135deg,${red},#ee5a24)`:`linear-gradient(135deg,${teal},${cyan})`,color:cIn?"#fff":"#0a1628",fontSize:18,fontWeight:700,cursor:"pointer"}} onClick={()=>{
            const l=gL(),t=new Date().toISOString();
            if(cIn){setCIn(false);setCTime(null);setCLoc(null);setClocks(p=>[...p,{sid:user.id,t:"out",time:t,loc:l}]);}
            else{setCIn(true);setCTime(t);setCLoc(l);setClocks(p=>[...p,{sid:user.id,t:"in",time:t,loc:l}]);}
          }}>{cIn?"🔴  POINTER LA SORTIE":"🟢  POINTER L'ENTRÉE"}</button>
          {cLoc&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:`${teal}12`,borderRadius:10,marginTop:10,fontSize:12,color:"#7a8ba3"}}>📍 {cLoc.lat.toFixed(4)}, {cLoc.lng.toFixed(4)} (±{cLoc.acc}m)</div>}
        </Card>
      </div>
    );

    // RAPPORT (terrain)
    if(tab==="rapport") return (
      <div style={{animation:"slideUp .3s ease"}}>
        <Card>
          <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Nouveau rapport de visite</div>
          <Label>Patient</Label>
          <Sel value={rForm.pid} onChange={e=>setRForm(p=>({...p,pid:e.target.value}))}><option value="">Sélectionner...</option>{patients.filter(p=>p.status==="actif").map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</Sel>
          <Label>Soins</Label>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>{CARES.map(c=><Chip key={c} on={rForm.cares.includes(c)} onClick={()=>setRForm(p=>({...p,cares:p.cares.includes(c)?p.cares.filter(x=>x!==c):[...p.cares,c]}))}>{c}</Chip>)}</div>
          <Label>Durée</Label>
          <div style={{display:"flex",gap:6,marginBottom:14}}>{["15","25","30","45","60"].map(d=><div key={d} style={{flex:1,padding:"10px 0",textAlign:"center",borderRadius:10,fontSize:14,fontWeight:600,cursor:"pointer",border:`1px solid ${rForm.dur===d?teal:dark}`,background:rForm.dur===d?`${teal}20`:"transparent",color:rForm.dur===d?teal:gray}} onClick={()=>setRForm(p=>({...p,dur:d}))}>{d}m</div>)}</div>
          <Label>Signes vitaux</Label>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:14}}>
            {[["ta","Tension","13/8"],["temp","Temp °C","36.8"],["pulse","Pouls","72"]].map(([k,l,ph])=><div key={k}><Inp placeholder={ph} style={{textAlign:"center",marginBottom:4}} value={rForm[k]} onChange={e=>setRForm(p=>({...p,[k]:e.target.value}))}/><div style={{fontSize:11,color:gray,textAlign:"center"}}>{l}</div></div>)}
          </div>
          <Label>Observations</Label>
          <Ta placeholder="État du patient..." value={rForm.notes} onChange={e=>setRForm(p=>({...p,notes:e.target.value}))}/>
          <Btn disabled={!rForm.pid||rForm.cares.length===0} onClick={()=>{
            setReports(p=>[...p,{id:p.length+1,sid:user.id,pid:parseInt(rForm.pid),cares:[...rForm.cares],notes:rForm.notes,dur:parseInt(rForm.dur),vitals:{ta:rForm.ta,temp:rForm.temp,p:rForm.pulse},time:new Date().toISOString(),loc:gL(),valid:false}]);
            setRForm({pid:"",cares:[],notes:"",dur:"30",ta:"",temp:"",pulse:""});
          }}>📤 Envoyer le rapport</Btn>
        </Card>
      </div>
    );

    // SHARED BOARD
    if(tab==="board"){
      // Post detail
      if(subView?.type==="post"){
        const p=posts.find(x=>x.id===subView.id);if(!p)return null;
        const auth=staff(p.auth);const cat=POST_CATS.find(c=>c.k===p.cat);
        return(<div style={{animation:"slideUp .3s ease"}}>
          <Back onClick={()=>setSubView(null)}/>
          <Card>
            {p.pin&&<div style={{fontSize:13,color:purple,fontWeight:700,marginBottom:8}}>📌 Épinglé</div>}
            <div style={{fontSize:20,fontWeight:700,marginBottom:8}}>{p.title}</div>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}><span style={{fontSize:14}}>{auth?.photo} {auth?.name}</span><span style={{fontSize:12,color:gray}}>{fS(p.time)}</span>{cat&&<span style={{padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:600,background:`${cat.c}20`,color:cat.c}}>{cat.l}</span>}</div>
            <div style={{fontSize:15,color:"#c0ccda",lineHeight:1.7}}>{p.body}</div>
          </Card>
          <Card>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Commentaires ({p.comments.length})</div>
            {p.comments.map((c,i)=>{const a=staff(c.a);return(
              <div key={i} style={{padding:12,borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.04)",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:14,fontWeight:600}}>{a?.photo} {a?.name}</span><span style={{fontSize:12,color:gray}}>{fS(c.time)}</span></div>
                <div style={{fontSize:14,color:"#c0ccda",lineHeight:1.6}}>{c.t}</div>
              </div>);})}
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <Inp placeholder="Commentaire..." style={{marginBottom:0,flex:1}} value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&comment.trim()){setPosts(pp=>pp.map(x=>x.id===p.id?{...x,comments:[...x.comments,{a:user.id,t:comment,time:new Date().toISOString()}]}:x));setComment("");}}}/>
              <Btn small onClick={()=>{if(!comment.trim())return;setPosts(pp=>pp.map(x=>x.id===p.id?{...x,comments:[...x.comments,{a:user.id,t:comment,time:new Date().toISOString()}]}:x));setComment("");}}>Envoyer</Btn>
            </div>
          </Card>
        </div>);
      }
      // Board list
      const filt=filter==="all"?posts:posts.filter(p=>p.cat===filter);
      const sorted=[...filt].sort((a,b)=>(b.pin?1:0)-(a.pin?1:0)||new Date(b.time)-new Date(a.time));
      return(<div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:20,fontWeight:700}}>📢 Tableau commun</div>
          <Btn small onClick={()=>setModal("post")}>+ Publier</Btn>
        </div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>{POST_CATS.map(c=><Chip key={c.k} on={filter===c.k} color={c.c} onClick={()=>setFilter(c.k)}>{c.l}</Chip>)}</div>
        {sorted.map(p=>{const auth=staff(p.auth);const cat=POST_CATS.find(c=>c.k===p.cat);return(
          <div key={p.id} onClick={()=>setSubView({type:"post",id:p.id})} style={{padding:16,borderRadius:14,border:p.pin?`1px solid ${purple}40`:border,background:p.pin?`${purple}08`:cardBg,marginBottom:10,cursor:"pointer"}}>
            {p.pin&&<div style={{fontSize:12,color:purple,fontWeight:700,marginBottom:6}}>📌 Épinglé</div>}
            <div style={{fontSize:17,fontWeight:700,marginBottom:6}}>{p.title}</div>
            <div style={{fontSize:14,color:"#7a8ba3",lineHeight:1.6,marginBottom:8}}>{p.body.length>100?p.body.slice(0,100)+"…":p.body}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:13}}>{auth?.photo} {auth?.name}</span>{cat&&<span style={{padding:"2px 8px",borderRadius:10,fontSize:11,background:`${cat.c}20`,color:cat.c}}>{cat.l}</span>}</div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>{p.comments.length>0&&<span style={{fontSize:13,color:gray}}>💬{p.comments.length}</span>}<span style={{fontSize:12,color:gray}}>{fS(p.time)}</span></div></div>
          </div>);})}
      </div>);
    }

    // JIRA TASKS
    if(tab==="jira"){
      // Task detail
      if(subView?.type==="task"){
        const t=tasks.find(x=>x.id===subView.id);if(!t)return null;
        const auth=staff(t.auth);const asgn=staff(t.to);
        return(<div style={{animation:"slideUp .3s ease"}}>
          <Back onClick={()=>{setSubView({type:"channel",id:t.ch});setComment("");}}/>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{fontSize:18,fontWeight:700,flex:1,marginRight:10}}>{t.title}</div><PrBadge k={t.pr}/></div>
            <div style={{fontSize:15,color:"#7a8ba3",lineHeight:1.6,marginBottom:12}}>{t.desc}</div>
            <div style={{fontSize:14,color:gray,marginBottom:12}}>Par {auth?.photo} {auth?.name} → {asgn?.photo} {asgn?.name}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{TSTAT.map(st=>(
              <span key={st.k} onClick={()=>setTasks(p=>p.map(x=>x.id===t.id?{...x,st:st.k}:x))} style={{padding:"5px 14px",borderRadius:12,fontSize:12,fontWeight:700,background:`${st.c}20`,color:st.c,cursor:"pointer",outline:t.st===st.k?`2px solid ${st.c}`:"none",outlineOffset:2}}>{st.l}</span>
            ))}</div>
          </Card>
          <Card>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:12}}>Commentaires ({t.comments.length})</div>
            {t.comments.length===0&&<div style={{textAlign:"center",color:"#3a5068",padding:12,fontSize:14}}>Aucun commentaire</div>}
            {t.comments.map((c,i)=>{const a=staff(c.a);return(
              <div key={i} style={{padding:12,borderRadius:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.04)",marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:14,fontWeight:600}}>{a?.photo} {a?.name}</span><span style={{fontSize:12,color:gray}}>{c.time}</span></div>
                <div style={{fontSize:14,color:"#c0ccda",lineHeight:1.6}}>{c.t}</div>
              </div>);})}
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <Inp placeholder="Commentaire..." style={{marginBottom:0,flex:1}} value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&comment.trim()){setTasks(p=>p.map(x=>x.id===t.id?{...x,comments:[...x.comments,{a:user.id,t:comment,time:fS(new Date())}]}:x));setComment("");}}}/>
              <Btn small onClick={()=>{if(!comment.trim())return;setTasks(p=>p.map(x=>x.id===t.id?{...x,comments:[...x.comments,{a:user.id,t:comment,time:fS(new Date())}]}:x));setComment("");}}>Envoyer</Btn>
            </div>
          </Card>
        </div>);
      }
      // Channel view
      if(subView?.type==="channel"){
        const ch=CHANNELS.find(c=>c.id===subView.id);const chT=tasks.filter(t=>t.ch===subView.id);const filt=filter==="all"?chT:chT.filter(t=>t.st===filter);
        return(<div style={{animation:"slideUp .3s ease"}}>
          <Back onClick={()=>{setSubView(null);setFilter("all");}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
            <div style={{fontSize:18,fontWeight:700}}>{ch?.name}</div>
            <Btn small onClick={()=>{setTForm(p=>({...p,ch:subView.id}));setModal("task");}}>+ Tâche</Btn>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
            <Chip on={filter==="all"} onClick={()=>setFilter("all")}>Tous ({chT.length})</Chip>
            {TSTAT.map(st=><Chip key={st.k} on={filter===st.k} color={st.c} onClick={()=>setFilter(st.k)}>{st.l} ({chT.filter(t=>t.st===st.k).length})</Chip>)}
          </div>
          {filt.length===0&&<div style={{textAlign:"center",color:"#3a5068",padding:24,fontSize:15}}>Aucune tâche</div>}
          {filt.map(t=>{const a=staff(t.to);return(
            <div key={t.id} onClick={()=>setSubView({type:"task",id:t.id})} style={{padding:14,borderRadius:12,border,background:cardBg,marginBottom:8,cursor:"pointer"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:15,fontWeight:600,flex:1,marginRight:8}}>{t.title}</div><StBadge k={t.st}/></div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:8,alignItems:"center"}}><PrBadge k={t.pr}/><span style={{fontSize:13,color:gray}}>{a?.photo} {a?.name}</span></div>{t.comments.length>0&&<span style={{fontSize:13,color:gray}}>💬{t.comments.length}</span>}</div>
            </div>);})}
        </div>);
      }
      // Channels list
      return(<div style={{animation:"slideUp .3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:20,fontWeight:700}}>📌 Tâches</div>
          <Btn small onClick={()=>setModal("task")}>+ Nouvelle</Btn>
        </div>
        {myCh.map(ch=>{const chT=tasks.filter(t=>t.ch===ch.id);const pend=chT.filter(t=>t.st!=="fait").length;return(
          <div key={ch.id} onClick={()=>setSubView({type:"channel",id:ch.id})} style={{padding:16,borderRadius:14,border,background:cardBg,marginBottom:10,cursor:"pointer",borderLeft:`4px solid ${ch.color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:16,fontWeight:700}}>{ch.name}</div><Count n={pend}/></div>
            <div style={{fontSize:13,color:"#7a8ba3",marginBottom:8}}>{ch.desc}</div>
            <div style={{display:"flex",gap:10,fontSize:13}}><span style={{color:gray}}>📋 {chT.length}</span><span style={{color:teal}}>✓ {chT.filter(t=>t.st==="fait").length}</span><span style={{color:yellow}}>⏳ {chT.filter(t=>t.st==="en_cours").length}</span></div>
            <div style={{display:"flex",gap:3,marginTop:8}}>{ch.members.map(mid=>{const m=staff(mid);return <span key={mid} style={{fontSize:18}} title={m?.name}>{m?.photo}</span>;})}</div>
          </div>);})}
      </div>);
    }

    return null;
  };

  // ===== MAIN =====
  const myTabs = getTabs();

  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:bg,minHeight:"100vh",color:light,maxWidth:500,margin:"0 auto"}}>
      <style>{css}</style>

      {/* MODALS */}
      {modal&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:16}} onClick={()=>setModal(null)}>
        <div style={{background:"#0f2027",borderRadius:16,padding:20,width:"100%",maxWidth:440,maxHeight:"85vh",overflow:"auto",border:"1px solid rgba(255,255,255,0.1)"}} onClick={e=>e.stopPropagation()}>
          {modal==="patient"&&<>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:16}}>Nouveau patient</div>
            {[["name","Nom"],["address","Adresse"],["pathology","Pathologie"],["doctor","Médecin"],["mutuelle","Mutuelle"]].map(([f,l])=><div key={f}><Label>{l}</Label><Inp value={pForm[f]} onChange={e=>setPForm(p=>({...p,[f]:e.target.value}))}/></div>)}
            <Btn onClick={()=>{if(!pForm.name)return;setPatients(p=>[...p,{...pForm,id:p.length+1,status:"actif"}]);setPForm({name:"",address:"",pathology:"",doctor:"",mutuelle:""});setModal(null);}}>Ajouter</Btn>
          </>}
          {modal==="schedule"&&<>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:16}}>Ajouter créneau</div>
            <Label>Personnel</Label><Sel value={sForm.sid} onChange={e=>setSForm(p=>({...p,sid:e.target.value}))}><option value="">Choisir...</option>{field.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Sel>
            <Label>Jour</Label><div style={{display:"flex",gap:4,marginBottom:14}}>{DAYS_W.map((d,i)=><Chip key={i} on={sForm.d===i} onClick={()=>setSForm(p=>({...p,d:i}))}>{d}</Chip>)}</div>
            <Label>Horaire</Label><Sel value={sForm.sh} onChange={e=>setSForm(p=>({...p,sh:e.target.value}))}><option value="">Choisir...</option><option>Matin</option><option>AM</option><option>Nuit</option></Sel>
            <Btn onClick={()=>{if(!sForm.sid)return;setSched(p=>[...p,{sid:parseInt(sForm.sid),d:sForm.d,sh:sForm.sh,pts:[]}]);setSForm({sid:"",d:0,sh:""});setModal(null);}}>Ajouter</Btn>
          </>}
          {modal==="task"&&<>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:16}}>Nouvelle tâche</div>
            <Label>Canal</Label><Sel value={tForm.ch} onChange={e=>setTForm(p=>({...p,ch:e.target.value}))}><option value="">Choisir...</option>{myCh.map(ch=><option key={ch.id} value={ch.id}>{ch.name}</option>)}</Sel>
            <Label>Titre</Label><Inp value={tForm.title} onChange={e=>setTForm(p=>({...p,title:e.target.value}))}/>
            <Label>Description</Label><Ta value={tForm.desc} onChange={e=>setTForm(p=>({...p,desc:e.target.value}))}/>
            <Label>Assigné à</Label><Sel value={tForm.to} onChange={e=>setTForm(p=>({...p,to:e.target.value}))}><option value="">Moi-même</option>{STAFF.map(s=><option key={s.id} value={s.id}>{s.photo} {s.name}</option>)}</Sel>
            <Label>Priorité</Label><div style={{display:"flex",gap:8,marginBottom:14}}>{PRIOS.map(p=><span key={p.k} onClick={()=>setTForm(pr=>({...pr,pr:p.k}))} style={{padding:"6px 14px",borderRadius:12,fontSize:13,fontWeight:600,background:`${p.c}20`,color:p.c,cursor:"pointer",outline:tForm.pr===p.k?`2px solid ${p.c}`:"none",outlineOffset:2}}>{p.l}</span>)}</div>
            <Btn disabled={!tForm.title||!tForm.ch} onClick={()=>{setTasks(p=>[{id:p.length+1,ch:tForm.ch,title:tForm.title,desc:tForm.desc,auth:user.id,to:parseInt(tForm.to)||user.id,pr:tForm.pr,st:"a_faire",comments:[]},...p]);setTForm({ch:"",title:"",desc:"",to:"",pr:"moyenne"});setModal(null);}}>Créer</Btn>
          </>}
          {modal==="leave"&&<>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:16}}>Demande de congé</div>
            {(user.isRH||user.admin)&&<><Label>Employé</Label><Sel value={lForm.sid} onChange={e=>setLForm(p=>({...p,sid:e.target.value}))}><option value="">Choisir...</option>{allNoDir.map(s=><option key={s.id} value={s.id}>{s.photo} {s.name}</option>)}</Sel></>}
            <Label>Type</Label><Sel value={lForm.type} onChange={e=>setLForm(p=>({...p,type:e.target.value}))}><option value="">Choisir...</option>{LEAVE_T.map(t=><option key={t}>{t}</option>)}</Sel>
            <Label>Début</Label><Inp type="date" value={lForm.from} onChange={e=>setLForm(p=>({...p,from:e.target.value}))}/>
            <Label>Fin</Label><Inp type="date" value={lForm.to2} onChange={e=>setLForm(p=>({...p,to2:e.target.value}))}/>
            <Label>Jours</Label><Inp type="number" value={lForm.days} onChange={e=>setLForm(p=>({...p,days:e.target.value}))}/>
            <Label>Motif</Label><Ta value={lForm.reason} onChange={e=>setLForm(p=>({...p,reason:e.target.value}))}/>
            <Btn onClick={()=>{if(!lForm.type||!lForm.from)return;const sid=(user.isRH||user.admin)?parseInt(lForm.sid)||user.id:user.id;setLeaves(p=>[...p,{id:p.length+1,sid,type:lForm.type,from:lForm.from,to:lForm.to2||lForm.from,days:parseInt(lForm.days)||1,reason:lForm.reason,st:"en_attente",by:null}]);setLForm({sid:"",type:"",from:"",to2:"",days:"",reason:""});setModal(null);}}>Soumettre</Btn>
          </>}
          {modal==="post"&&<>
            <div style={{fontSize:14,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:gray,marginBottom:16}}>Publier une annonce</div>
            <Label>Catégorie</Label>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>{POST_CATS.filter(c=>c.k!=="all").map(c=><span key={c.k} onClick={()=>setBForm(p=>({...p,cat:c.k}))} style={{padding:"6px 14px",borderRadius:12,fontSize:13,fontWeight:600,background:`${c.c}20`,color:c.c,cursor:"pointer",outline:bForm.cat===c.k?`2px solid ${c.c}`:"none",outlineOffset:2}}>{c.l}</span>)}</div>
            <Label>Titre</Label><Inp placeholder="Ex: Mise à jour protocole..." value={bForm.title} onChange={e=>setBForm(p=>({...p,title:e.target.value}))}/>
            <Label>Contenu</Label><Ta style={{minHeight:120}} placeholder="Détails..." value={bForm.body} onChange={e=>setBForm(p=>({...p,body:e.target.value}))}/>
            <Btn disabled={!bForm.title} onClick={()=>{setPosts(p=>[{id:p.length+1,auth:user.id,title:bForm.title,body:bForm.body,cat:bForm.cat,pin:false,time:new Date().toISOString(),comments:[]},...p]);setBForm({title:"",body:"",cat:"general"});setModal(null);}}>Publier</Btn>
          </>}
        </div>
      </div>}

      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",background:"rgba(10,22,40,0.95)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",position:"sticky",top:0,zIndex:100}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:28}}>{user?.photo}</span><div><div style={{fontSize:16,fontWeight:600}}>{user?.name}</div><div style={{fontSize:11,color:teal,textTransform:"uppercase",letterSpacing:1}}>{user?.label}</div></div></div>
        <button onClick={logout} style={{padding:"8px 16px",borderRadius:10,border:"1px solid #2a3f55",background:"transparent",color:"#7a8ba3",fontSize:13,cursor:"pointer"}}>Sortir</button>
      </div>

      {/* TABS */}
      <div style={{display:"flex",padding:"8px 12px",gap:4,background:"rgba(10,22,40,0.6)",overflowX:"auto"}}>
        {myTabs.map(t=>(
          <div key={t.k} onClick={()=>switchTab(t.k)} style={{padding:"10px 12px",borderRadius:10,fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:.4,textTransform:"uppercase",whiteSpace:"nowrap",background:tab===t.k?`linear-gradient(135deg,${teal},${cyan})`:"transparent",color:tab===t.k?"#0a1628":gray,flexShrink:0,display:"flex",alignItems:"center"}}>
            {t.l}{t.k==="conges"&&user.isRH&&<Count n={pendL}/>}
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{padding:"14px 16px",paddingBottom:120}}>
        {renderContent()}
      </div>
    </div>
  );
}
