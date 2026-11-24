/* ===== GANTI NAMA, TEKS & LOGO DI SINI ===== */
const BRAND={name:'ZONA CEBAN',slogan:'Makan Puas Harga Pas',hero:'Solusi Mudah untuk Kelola Usaha Anda',
desc:'Sistem informasi penjualan, pembukuan, dan persediaan untuk UMKM Zona Ceban.',
logo:'assets/logo.png',logoWhite:'assets/logo-white.png' /* logo merah (latar terang) & logo putih (latar gelap); kosongkan 'logo' untuk ikon bawaan */};

const KEY='zc_db_v2',p2=n=>String(n).padStart(2,'0'),$=s=>document.querySelector(s);
const dk=o=>{const d=new Date();d.setDate(d.getDate()-o);return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())};
const rp=n=>'Rp '+Math.round(n).toLocaleString('id-ID'),S=(a,f)=>a.reduce((x,y)=>x+f(y),0);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const range=n=>Array.from({length:n},(_,i)=>dk(n-1-i));
const DAY=['Min','Sen','Sel','Rab','Kam','Jum','Sab'],dn=k=>DAY[new Date(k+'T00:00').getDay()];
const pct=(a,b)=>b?((a>=b?'↑ ':'↓ ')+Math.abs(Math.round((a-b)/b*100))+'%'):'–';
const ICO={dashboard:'<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
penjualan:'<path d="M3 4h2l2.5 11h10l2-8H6.5"/><circle cx="9" cy="19" r="1"/><circle cx="17" cy="19" r="1"/>',
persediaan:'<path d="M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10"/>',
keuangan:'<path d="M3 7h18v12H3zM3 7l2-3h14M16 13h3"/>',pembelian:'<path d="M5 8h14l-1 12H6zM9 8a3 3 0 016 0"/>',
laporan:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',pengaturan:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>'};
const ic=(k,s=18)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
const logo=(s,w)=>BRAND.logo?`<img src="${w&&BRAND.logoWhite?BRAND.logoWhite:BRAND.logo}" style="height:${s}px;width:auto" alt="${BRAND.name}">`:`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9c0 1.7 1.3 3 2.7 3S9.3 10.7 9.3 9c0 1.7 1.3 3 2.7 3s2.7-1.3 2.7-3c0 1.7 1.3 3 2.7 3S20 10.7 20 9M10 20v-5h4v5"/></svg>`;

/* ===== DATA ===== */
const USERS0=()=>[{nama:'Andi Pratama',user:'pemilik',role:'Pemilik',aktif:1,pw:'pemilik123',cabang:'Semua'},{nama:'Siti Rahma',user:'karyawan1',role:'Karyawan',aktif:1,pw:'karyawan123',cabang:'Cidomba'},{nama:'Budi Santoso',user:'admin1',role:'Admin',aktif:1,pw:'admin123',cabang:'Semua'}];
/* Data kosong (untuk mulai memakai data asli) */
function seedEmpty(){return{products:[],tx:[],nid:1,mv:[],users:USERS0(),cabang:['Cidomba'],mitra:[],setoran:[],set:{harga:10000,plastik:1000},mid:1,sid:1,bayar:[],bid:1,v3:1}}
/* Data DEMO: 2 cabang, 5 mitra, 35 hari setoran, pengeluaran & QRIS. Dibuat tetap (deterministik) agar selalu sama. */
function seed(){let r=20261124;const rnd=()=>(r=(r*1664525+1013904223)%4294967296)/4294967296,ri=(a,b)=>a+Math.floor(rnd()*(b-a+1));
 const d=seedEmpty();d.demo=1;d.cabang=['Cidomba','Telukjambe'];
 const MT=[['Dapur Bu Sari','081234567801','Cidomba',1500,'BCA','1234567801',['Nasi Ayam Geprek','Nasi Telur Balado','Mie Goreng Spesial']],
 ['Kedai Mang Ujang','081234567802','Cidomba',1000,'BRI','2234567802',['Batagor','Siomay','Cilok Bumbu']],
 ['Es Teh Mba Ria','081234567803','Cidomba',1500,'DANA','081234567803',['Es Teh Manis','Es Jeruk','Es Kopi Susu']],
 ['Kue Bu Wati','081234567804','Telukjambe',1000,'Mandiri','3234567804',['Risol Mayo','Pastel Isi','Bolu Kukus']],
 ['Seblak Teh Neng','081234567805','Telukjambe',1500,'BNI','4234567805',['Seblak Ceker','Seblak Kerupuk','Basreng Pedas']]];
 MT.forEach((m,mi)=>{d.mitra.push({id:d.mid++,nama:m[0],hp:m[1],cabang:m[2],komisi:m[3],bank:m[4],rek:m[5],extras:[{nama:'Plastik/Kresek',nominal:1000}],produk:m[6].map((n,pi)=>({id:(mi+1)*10+pi+1,nama:n,harga:10000}))})});
 for(let o=34;o>=0;o--){const tgl=dk(o);d.mitra.forEach(m=>{if(rnd()<.12)return;
  const base=ri(14,30),items=m.produk.map((p,pi)=>{const q=Math.max(6,base+ri(-6,8)-pi*2),sisa=Math.min(q,Math.round(q*(.08+rnd()*.3)));return{pid:p.id,nama:p.nama,harga:p.harga,qty:q,sisa:(o===0&&(m.id===2||m.id===5))?null:sisa}});
  d.setoran.push({id:d.sid++,mitra:m.id,cabang:m.cabang,tgl,komisi:m.komisi,extras:m.extras.map(e=>({...e})),items})});}
 d.cabang.forEach(c=>{for(let o=34;o>=1;o--){const tgl=dk(o),tot=d.setoran.filter(s=>s.tgl===tgl&&s.cabang===c).reduce((a,s)=>a+s.items.reduce((x,i)=>x+((+i.qty||0)-(+i.sisa||0))*i.harga,0),0);
  if(tot>0&&rnd()<.7)d.bayar.push({id:d.bid++,tgl,cabang:c,qris:Math.round(tot*(.2+rnd()*.25)/1000)*1000})}});
 const EX=[['Gas LPG 3 kg',22000,1],['Bensin antar barang',35000,1],['Beli plastik/kresek',45000,1],['Uang kebersihan lapak',10000,1],['Listrik & air lapak',60000,1],['Perlengkapan (nampan, tisu)',38000,1]];
 for(let o=34;o>=0;o-=2){const e=EX[ri(0,EX.length-1)];d.tx.push({id:d.nid++,tgl:dk(o),tipe:'Pengeluaran',ket:e[0],jumlah:e[1]+ri(0,3)*5000,cabang:d.cabang[ri(0,1)]})}
 d.tx.push({id:d.nid++,tgl:dk(20),tipe:'Pengeluaran',ket:'Sewa lapak bulanan',jumlah:500000,cabang:'Cidomba'},{id:d.nid++,tgl:dk(20),tipe:'Pengeluaran',ket:'Sewa lapak bulanan',jumlah:450000,cabang:'Telukjambe'});
 return d}
let db;try{db=JSON.parse(localStorage.getItem(KEY))}catch(e){}
/* Jika belum ada data sama sekali (pertama kali dibuka), isi otomatis dengan data demo */
if(!db||!db.users||(!(db.mitra||[]).length&&!(db.setoran||[]).length&&!db.demoCleared)){const old=db;db=seed();if(old&&old.users&&old.users.length){db.users=old.users;db.users.forEach(u=>{if(u.cabang&&u.cabang!=='Semua'&&!db.cabang.includes(u.cabang))u.cabang=db.cabang[0]})}}
delete db.products;db.mv=(db.mv||[]).filter(m=>m.uid);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}};
let me=null,page='dashboard',tab={},cart=[],pay='Tunai',pq='',gq='',per=7,paid='',pf=null;

/* ===== UTIL UI ===== */
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2200)}
function openForm(title,fields,cb,vals={}){const m=document.createElement('div');m.className='modal';
m.innerHTML=`<div class="box"><h3>${title}</h3>${fields.map(f=>`<label>${f.l}${f.o?`<select name="${f.k}">${f.o.map(o=>`<option ${vals[f.k]==o?'selected':''}>${esc(o)}</option>`).join('')}</select>`:`<input name="${f.k}" type="${f.t||'text'}" value="${esc(vals[f.k]??'')}">`}</label>`).join('')}<div class="row"><button class="btn ghost" onclick="this.closest('.modal').remove()">Batal</button><button class="btn" id="ok">Simpan</button></div></div>`;
m.querySelector('#ok').onclick=()=>{const v={};m.querySelectorAll('[name]').forEach(e=>v[e.name]=e.type==='number'?+e.value:e.value.trim());if(cb(v)!==false){m.remove();save();render()}};document.body.append(m)}
function dlBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000)}
function exportCSV(head,rows,name){const csv=[head,...rows].map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\r\n');
try{dlBlob(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}),(name||'export')+'-'+dk(0)+'.csv');toast('File CSV diunduh')}catch(e){
const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="box"><h3>Export CSV</h3><textarea readonly>${esc(csv)}</textarea><div class="row"><button class="btn ghost" onclick="this.closest('.modal').remove()">Tutup</button><button class="btn" id="cp">Salin</button></div></div>`;
m.querySelector('#cp').onclick=()=>{m.querySelector('textarea').select();try{navigator.clipboard.writeText(csv)}catch(e){document.execCommand('copy')}toast('Data disalin')};document.body.append(m)}}
const stat=(l,v,s,c)=>`<div class="stat" style="--c:${c}"><small>${l}</small><b>${v}</b><em>${s}</em></div>`;
const tbl=(h,rows)=>`<div class="tbl${h.length>3?' cd':''}"><table><tr class="hd">${h.map(x=>`<th class="${x[0]=='>'?'r':''}">${x.replace('>','')}</th>`).join('')}</tr>${rows.length?rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${h[i][0]=='>'?'r':''}" data-l="${esc(h[i].replace('>',''))}"><div class="cv">${c}</div></td>`).join('')}</tr>`).join(''):`<tr><td colspan="${h.length}" style="color:var(--muted);text-align:center;padding:24px">Belum ada data.</td></tr>`}</table></div>`;
const tabs=(k,names,extra='')=>{const t=tab[k]||names[0];return `<div class="tabs">${names.map(n=>`<a class="${n==t?'on':''}" tabindex="0" onclick="tab['${k}']='${n}';render()">${n}</a>`).join('')}<span class="sp"></span>${extra}</div>`};
const tb=k=>tab[k]||({keuangan:'Ringkasan',laporan:'Penjualan',pengaturan:'Pengguna',persediaan:'Rekap Produk'})[k];
const axl=x=>x>=1e6?(x/1e6).toFixed(1).replace('.0','')+' jt':Math.round(x/1000)+' rb';
function bars(v,l,col='var(--primary)'){const W=600,H=230,L=58,B=26,mx=Math.max(...v,1)*1.1,bw=(W-L)/v.length;
let s=`<svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Grafik batang">`;
for(let i=0;i<=4;i++){const y=(H-B)-(H-B-10)*i/4;s+=`<line x1="${L}" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${L-6}" y="${y+4}" text-anchor="end">${axl(mx*i/4)}</text>`}
v.forEach((x,i)=>{const h=(H-B-10)*x/mx,xx=L+i*bw+bw*.2;s+=`<rect x="${xx}" y="${H-B-h}" width="${bw*.6}" height="${h}" rx="3" fill="${col}"/>${v.length<=10||i%5==0?`<text x="${xx+bw*.3}" y="${H-8}" text-anchor="middle">${l[i]}</text>`:''}`});return s+'</svg>'}
function lines(a,b,l,na='Pemasukan',nb='Pengeluaran'){const W=600,H=230,L=58,B=26,mx=Math.max(...a,...b,1)*1.1,st=(W-L-10)/(a.length-1||1);
const pt=v=>v.map((x,i)=>`${L+i*st},${(H-B)-(H-B-10)*x/mx}`).join(' ');let s=`<svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Grafik arus kas">`;
for(let i=0;i<=4;i++){const y=(H-B)-(H-B-10)*i/4;s+=`<line x1="${L}" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${L-6}" y="${y+4}" text-anchor="end">${axl(mx*i/4)}</text>`}
s+=`<polyline points="${pt(a)}" fill="none" stroke="var(--green)" stroke-width="2"/><polyline points="${pt(b)}" fill="none" stroke="var(--red)" stroke-width="2"/>`;
l.forEach((x,i)=>{if(l.length<=10||i%5==0)s+=`<text x="${L+i*st}" y="${H-8}" text-anchor="middle">${x}</text>`});
return s+`</svg><div style="font-size:12px;color:var(--muted)"><span style="color:var(--green)">●</span> ${na} &nbsp; <span style="color:var(--red)">●</span> ${nb}</div>`}
/* ===== DATA KEUANGAN (semua mengikuti pilihan cabang di pojok kanan atas) ===== */
const setL=()=>{ens();return db.setoran.filter(inCab)};
const setD=d=>setL().filter(s=>s.tgl===d);
const expL=()=>{ens();return db.tx.filter(x=>x.tipe!=='Penjualan'&&inCab(x))};
const inc=d=>S(setD(d),s=>calc(s).gross),zc=d=>S(setD(d),s=>calc(s).zc),mtr=d=>S(setD(d),s=>calc(s).net),out=d=>S(expL().filter(x=>x.tgl===d),x=>x.jumlah),lb=d=>zc(d)-out(d);
const sum=n=>{const d=range(n),ss=setL().filter(s=>d.includes(s.tgl)),C=ss.map(calc),ex=expL().filter(x=>d.includes(x.tgl)),g=S(C,c=>c.gross),k=S(C,c=>c.komisi),b=S(C,c=>c.ex),m=S(C,c=>c.net),p=S(ex,x=>x.jumlah);
 return{ss,C,ex,g,k,b,m,p,zc:k+b,lb:k+b-p}};
const prodRekap=n=>{const d=range(n),R={};setL().filter(s=>d.includes(s.tgl)).forEach(s=>{const dn=calc(s).done;s.items.forEach(i=>{const k=s.mitra+'|'+i.nama,r=R[k]=R[k]||{mitra:s.mitra,nama:i.nama,t:0,laku:0,sisa:0,gross:0},q=+i.qty||0;
 r.t+=q;if(dn){r.sisa+=+i.sisa||0;r.laku+=q-(+i.sisa||0);r.gross+=(q-(+i.sisa||0))*i.harga}})});return Object.values(R).sort((a,b)=>b.laku-a.laku)};
const fd=k=>k.slice(8)+'/'+k.slice(5,7)+'/'+k.slice(0,4);
const cabName=()=>cur()==='Semua'?'Semua cabang':cur();

/* ===== HALAMAN ===== */
const P={};
P.dashboard=()=>{const t=dk(0),y=dk(1),d7=range(7),adm=canAll(),top=prodRekap(7).filter(r=>r.laku>0).slice(0,6);
const st=[stat('Penjualan Hari Ini',rp(inc(t)),pct(inc(t),inc(y))+' dari kemarin','var(--green)'),stat('Produk Terjual Hari Ini',S(setD(t),s=>calc(s).laku)+' pcs',S(setD(t),s=>calc(s).t)+' titipan masuk','var(--dark)')];
if(adm)st.push(stat('Pendapatan Zona Ceban',rp(zc(t)),'Komisi + biaya tambahan','var(--amber)'),stat('Laba Bersih Hari Ini',rp(lb(t)),'Pendapatan − pengeluaran '+rp(out(t)),lb(t)>=0?'var(--green)':'var(--red)'));
return `<h1>Dashboard ${cabBadge()}</h1><p class="sub">Ringkasan aktivitas usaha ${BRAND.name} – ${esc(cabName())}</p>
<div class="stats">${st.join('')}</div>
<div class="g2"><div class="card"><h3>Grafik Penjualan – ${esc(cabName())} (7 Hari Terakhir)</h3>${bars(d7.map(inc),d7.map(dn))}</div>
<div class="card"><h3>Produk Terlaris (7 Hari) <a style="float:right;font-size:12px;font-weight:500;color:var(--primary);cursor:pointer" onclick="go('persediaan')">Lihat semua</a></h3>${tbl(['Produk','Mitra','>Terjual'],top.map(r=>[esc(r.nama),esc(mname(r.mitra)),`<b>${r.laku}</b>`]))}</div></div>`};

const perSel=()=>`<span style="color:var(--muted)">Periode</span><select onchange="per=+this.value;render()" aria-label="Periode"><option value="7" ${per==7?'selected':''}>7 Hari Terakhir</option><option value="30" ${per==30?'selected':''}>30 Hari Terakhir</option></select>`;
function exportKeuCSV(){const m=sum(per);exportCSV(['Tanggal','Jenis','Mitra / Keterangan','Terjual','Nilai Penjualan','Komisi','Biaya Tambahan','Hak Mitra / Pengeluaran'],
 [...m.ss.map((s,i)=>{const c=m.C[i];return[s.tgl,'Setoran',mname(s.mitra)+' – '+s.cabang,c.laku,c.gross,c.komisi,c.ex,c.net]}),...m.ex.map(x=>[x.tgl,'Pengeluaran',x.ket+' ('+x.cabang+')','','','','',x.jumlah])],'Keuangan-'+cabName().replace(/\s+/g,'-'))}
const expBtn=`<button class="btn ghost" onclick="exportKeuCSV()">Export CSV</button>`;
const xlsBtn=`<button class="btn" onclick="exportXlsx()">⬇ Export Excel</button>`;
const stDone=c=>c.done?'<span class="bd ok">Selesai</span>':'<span class="bd lo">Menunggu sisa</span>';
P.keuangan=()=>{const t=tb('keuangan'),m=sum(per),d=range(per),ord=(a,b)=>b.tgl.localeCompare(a.tgl)||(b.id||0)-(a.id||0);let body;
const addOut=`<button class="btn" onclick="outForm()">+ Catat Pengeluaran</button>`;
if(t==='Ringkasan'){const rec=m.ss.map((s,i)=>({s,c:m.C[i]})).sort((a,b)=>ord(a.s,b.s)).slice(0,6);
 body=`<div class="stats">${stat('Total Penjualan',rp(m.g),`${per} hari terakhir`,'var(--dark)')}${stat('Hak Mitra',rp(m.m),'Disetor ke mitra','var(--amber)')}${stat('Pendapatan Zona Ceban',rp(m.zc),'Komisi '+rp(m.k)+' + biaya tambahan '+rp(m.b),'var(--green)')}${stat('Pengeluaran',rp(m.p),'Biaya operasional','var(--red)')}${stat('Laba Bersih Zona Ceban',rp(m.lb),'Pendapatan − pengeluaran',m.lb>=0?'var(--green)':'var(--red)')}</div>
<div class="stats">${payStats(payAgg(d),per+' hari terakhir')}</div>
<div class="g2"><div class="card"><h3>Pendapatan Zona Ceban vs Pengeluaran</h3>${lines(d.map(zc),d.map(out),d.map(x=>x.slice(8)+'/'+x.slice(5,7)),'Pendapatan Zona Ceban','Pengeluaran')}</div><div class="card"><h3>Setoran Terbaru</h3>${tbl(['Tanggal','Mitra','>Pendapatan ZC'],rec.map(r=>[fd(r.s.tgl),esc(mname(r.s.mitra)),r.c.done?rp(r.c.zc):'–']))}</div></div>`}
else if(t==='Rekap Kas')body=`<div class="card">${tbl(['Tanggal','>Penjualan','>Hak Mitra','>Pendapatan ZC','>Pengeluaran','>Laba Bersih'],d.slice().reverse().map(k=>[fd(k),rp(inc(k)),rp(mtr(k)),rp(zc(k)),rp(out(k)),`<b style="color:var(${lb(k)>=0?'--green':'--red'})">${rp(lb(k))}</b>`]))}</div>`;
else if(t==='Pemasukan'){const rec=m.ss.map((s,i)=>({s,c:m.C[i]})).sort((a,b)=>ord(a.s,b.s));
 body=`<div class="card">${tbl(['Tanggal','Mitra','Cabang','>Terjual','>Penjualan','>Komisi','>Biaya Tambahan','>Hak Mitra','Status'],rec.map(r=>[fd(r.s.tgl),esc(mname(r.s.mitra)),esc(r.s.cabang),r.c.done?r.c.laku:'–',rp(r.c.gross),rp(r.c.komisi),rp(r.c.ex),rp(r.c.net),stDone(r.c)]))}</div>`}
else if(t==='Metode Bayar'){const pa=payAgg(d),rows=pa.R.slice().sort((a,b)=>b.tgl.localeCompare(a.tgl)||a.cabang.localeCompare(b.cabang));
 body=`<div class="stats">${payStats(pa,per+' hari terakhir')}</div><div class="card">${tbl(['Tanggal','Cabang','>Total Pendapatan','>QRIS','>Tunai','>Tunai Disetor','>Tunai Receh','Aksi'],rows.map(p=>[fd(p.tgl),esc(p.cabang),...payCells(p),payAct(p)]))}${payNoteHTML()}</div>`}
else body=`<div class="card">${tbl(['Tanggal','Cabang','Keterangan','>Jumlah'],m.ex.slice().sort(ord).map(x=>[fd(x.tgl),esc(x.cabang||'-'),esc(x.ket),`<span style="color:var(--red)">${rp(x.jumlah)}</span>`]))}</div>`;
return `<h1>Keuangan ${cabBadge()}</h1><p class="sub">Laba bersih Zona Ceban = komisi + biaya tambahan dari mitra − pengeluaran operasional. Uang penjualan milik mitra tidak dihitung sebagai laba.</p>${tabs('keuangan',['Ringkasan','Pemasukan','Metode Bayar','Pengeluaran','Rekap Kas'],addOut)}<div class="ctl">${perSel()}<span class="sp"></span>${expBtn}${xlsBtn}</div>${body}`};
const outForm=()=>{ens();openForm('Catat Pengeluaran',[{k:'k',l:'Keterangan'},{k:'j',l:'Jumlah (Rp)',t:'number'},{k:'c',l:'Cabang',o:db.cabang}],v=>{if(!v.k||!(v.j>0))return false;db.tx.push({id:db.nid++,tgl:dk(0),tipe:'Pengeluaran',ket:v.k,jumlah:v.j,cabang:v.c})},{c:cur()==='Semua'?db.cabang[0]:cur()})};

P.laporan=()=>{const t=tb('laporan'),m=sum(per),d=range(per);let body;
if(t==='Penjualan'){const R=prodRekap(per).filter(r=>r.laku>0).slice(0,5);
 body=`<div class="g2"><div class="card"><h3>Grafik Penjualan – ${esc(cabName())}</h3>${bars(d.map(inc),d.map(per>7?x=>x.slice(8):dn))}</div><div class="card"><h3>Produk Terlaris</h3>${tbl(['No','Produk','>Terjual'],R.map((r,i)=>[i+1,esc(r.nama),r.laku]))}</div></div>`}
else if(t==='Keuangan')body=`<div class="card">${tbl(['Tanggal','>Penjualan','>Pendapatan ZC','>Pengeluaran','>Laba Bersih'],d.slice().reverse().map(k=>[fd(k),rp(inc(k)),rp(zc(k)),rp(out(k)),rp(lb(k))]))}</div>`;
else if(t==='Persediaan')body=`<div class="card">${tbl(['Mitra','Produk','>Titip','>Terjual','>Sisa','>Nilai Penjualan'],prodRekap(per).map(r=>[esc(mname(r.mitra)),esc(r.nama),r.t,r.laku,r.sisa,rp(r.gross)]))}</div>`;
else body=`<div class="stats">${stat('Jumlah Setoran',m.ss.length,`${per} hari terakhir`,'var(--dark)')}${stat('Rata-rata Penjualan / Hari',rp(m.g/per),'Nilai penjualan','var(--green)')}${stat('Produk Terjual',S(m.C,c=>c.laku)+' pcs',`${per} hari terakhir`,'var(--amber)')}${stat('Pendapatan Zona Ceban',rp(m.zc),`${per} hari terakhir`,'var(--dark)')}${stat('Pengeluaran',rp(m.p),`${per} hari terakhir`,'var(--red)')}${stat('Laba Bersih',rp(m.lb),`${per} hari terakhir`,m.lb>=0?'var(--green)':'var(--red)')}</div>`;
return `<h1>Laporan ${cabBadge()}</h1><p class="sub">Data untuk keputusan usaha yang lebih baik. Export Excel langsung dari halaman ini (periode &amp; cabang sesuai pilihan).</p>${tabs('laporan',['Penjualan','Keuangan','Persediaan','Ringkasan'])}<div class="ctl">${perSel()}<span class="sp"></span><button class="btn ghost" onclick="exportLaporanXlsx('${t}')">⬇ Excel Tab Ini</button><button class="btn" onclick="exportLaporanXlsx()">⬇ Export Excel Lengkap</button></div>${body}`};
P.pengaturan=()=>{const t=tb('pengaturan');let body,btn='';
if(t==='Pengguna'){btn=`<button class="btn" onclick="userForm()">+ Tambah Pengguna</button>`;body=tbl(['Nama','Username','Role','Status','Aksi'],db.users.map((u,i)=>[esc(u.nama),esc(u.user),u.role,`<span class="bd ${u.aktif?'ok':'no'}">${u.aktif?'Aktif':'Nonaktif'}</span>`,`<a class="lnk" onclick="pwForm(${i})">Ubah Sandi</a>${u.user===me.user?'':` &nbsp; <a class="lnk" onclick="db.users[${i}].aktif^=1;save();render()">${u.aktif?'Nonaktifkan':'Aktifkan'}</a>`}`]))}
else if(t==='Cabang'){btn=`<button class="btn" onclick="cabForm()">+ Tambah Cabang</button>`;body=tbl(['Cabang','>Mitra','>Pengguna','Aksi'],db.cabang.map((c,i)=>[esc(c),db.mitra.filter(x=>x.cabang===c).length,db.users.filter(u=>u.cabang===c).length,`<a class="lnk" onclick="cabForm(${i})">Ubah</a> <button class="btn red" onclick="delCab(${i})">Hapus</button>`]))}
else if(t==='Parameter')body=`${kelBox()}<p>Data tersimpan di browser ini (per perangkat). Pakai <b>Muat Data Demo</b> untuk mencoba semua fitur, dan <b>Kosongkan Data</b> saat siap memakai data asli usaha.</p><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" onclick="loadDemo()">Muat Data Demo</button><button class="btn ghost" onclick="clearData()">Kosongkan Data (mulai dari nol)</button></div>`;
else{const k=t==='Kategori'?'kategori':t==='Cabang'?'cabang':'supplier';btn=`<button class="btn" onclick="listForm('${k}')">+ Tambah ${t}</button>`;body=tbl([t,'Aksi'],db[k].map((x,i)=>[esc(x),`<button class="btn red" onclick="db['${k}'].splice(${i},1);save();render()">Hapus</button>`]))}
return `<h1>Pengaturan</h1><p class="sub">Kelola pengguna, cabang, dan parameter.</p>${tabs('pengaturan',['Pengguna','Cabang','Parameter'],btn)}<div class="card">${body}</div>`};
const userForm=()=>openForm('Tambah Pengguna',[{k:'nama',l:'Nama'},{k:'user',l:'Username'},{k:'role',l:'Role',o:['Pemilik','Admin','Karyawan']},{k:'cabang',l:'Cabang (Pemilik/Admin boleh Semua)',o:['Semua',...db.cabang]},{k:'pw',l:'Password (min. 6 karakter)',t:'password'}],v=>{if(!v.nama||!v.user)return false;
 if(db.users.some(u=>u.user===v.user)){toast('Username sudah dipakai');return false}if(v.pw.length<6){toast('Password minimal 6 karakter');return false}db.users.push({...v,aktif:1})});
const pwForm=i=>openForm('Ubah Sandi – '+db.users[i].nama,[{k:'pw',l:'Password baru (min. 6 karakter)',t:'password'}],v=>{if(v.pw.length<6){toast('Password minimal 6 karakter');return false}db.users[i].pw=v.pw;toast('Sandi diperbarui')});
const listForm=k=>openForm('Tambah '+k,[{k:'n',l:'Nama'}],v=>{if(!v.n)return false;db[k].push(v.n)});


/* ===== EXPORT EXCEL (butuh koneksi internet untuk memuat library ExcelJS) ===== */
async function exportXlsx(){
 if(typeof ExcelJS==='undefined')return toast('Library Excel belum termuat. Periksa koneksi internet.');
 const wb=new ExcelJS.Workbook();wb.creator=BRAND.name;wb.created=new Date();
 const d=range(per),m=sum(per),SS=m.ss.map((s,i)=>({s,c:m.C[i]})).sort((a,b)=>a.s.tgl.localeCompare(b.s.tgl)||(a.s.id||0)-(b.s.id||0)),EX=m.ex.slice().sort((a,b)=>a.tgl.localeCompare(b.tgl)||a.id-b.id),n=SS.length,ne=EX.length,cb=cabName();
 const C={red:'FFD81616',dark:'FF7A0D0D',soft:'FFFDECEC',grn:'FF15803D',grnS:'FFE8F5EC',gry:'FFF8F3F3',bd:'FFE3CFCF',wh:'FFFFFFFF',tx:'FF2A1414'};
 const fill=c=>({type:'pattern',pattern:'solid',fgColor:{argb:c}});
 const sd={style:'thin',color:{argb:C.bd}},box={top:sd,left:sd,bottom:sd,right:sd};
 const FMT='"Rp" #,##0',DF='dd/mm/yyyy',ud=k=>new Date(Date.UTC(+k.slice(0,4),+k.slice(5,7)-1,+k.slice(8)));
 const put=(ws,ref,v,o={})=>{const c=ws.getCell(ref);c.value=v;c.font={name:'Calibri',size:o.size||11,bold:!!o.bold,italic:!!o.it,color:{argb:o.color||C.tx}};
  if(o.bg)c.fill=fill(o.bg);c.alignment={vertical:'middle',horizontal:o.al||'left'};if(o.fmt)c.numFmt=o.fmt;if(o.box)c.border=box;return c};
 const subt=`${cb}   •   Periode ${fd(d[0])} s/d ${fd(d[d.length-1])}   •   Dicetak ${fd(dk(0))}`;
 const head=(ws,last,t)=>{ws.mergeCells(`A1:${last}1`);put(ws,'A1',t,{size:16,bold:1,color:C.wh,bg:C.dark,al:'center'});ws.getRow(1).height=34;
  ws.mergeCells(`A2:${last}2`);put(ws,'A2',subt,{color:'FF7A6666',bg:C.soft,al:'center'});ws.getRow(2).height=20};
 const widths=(ws,a)=>a.forEach((w,i)=>ws.getColumn(i+1).width=w);
 const page=(ws,o)=>ws.pageSetup={orientation:o,fitToPage:true,fitToWidth:1,fitToHeight:0,horizontalCentered:true};
 const th=(ws,r,arr)=>{arr.forEach((h,i)=>put(ws,String.fromCharCode(65+i)+r,h,{bold:1,color:C.wh,bg:C.red,al:'center',box:1}));ws.getRow(r).height=24};
 const PA=payAgg(d),PR=PA.R.slice().sort((a,b)=>a.tgl.localeCompare(b.tgl)||a.cabang.localeCompare(b.cabang)),np=PR.length,pT=5+np,pL=4+np,kel=kelSetor();
 const fxS=(f,v)=>n?{formula:f,result:v}:v,fxE=(f,v)=>ne?{formula:f,result:v}:v,fxP=(f,v)=>np?{formula:f,result:v}:v;
 const sT=5+n,eT=5+ne,sL=4+n,eL=4+ne;

 /* Sheet 1: Ringkasan */
 const ws=wb.addWorksheet('Ringkasan',{views:[{showGridLines:false}]});widths(ws,[16,16,16,16,16,16,16,16]);head(ws,'H','LAPORAN KEUANGAN '+BRAND.name);
 const card=(a,b,lab,val,color,bg)=>{ws.mergeCells(`${a}4:${b}4`);ws.mergeCells(`${a}5:${b}5`);put(ws,a+'4',lab,{bold:1,color,bg,al:'center'});put(ws,a+'5',val,{size:15,bold:1,color,bg,al:'center',fmt:FMT})};
 ws.getRow(3).height=10;ws.getRow(4).height=22;ws.getRow(5).height=36;
 card('A','B','Total Penjualan',fxS(`Setoran!H${sT}`,m.g),C.dark,'FFF1E3E3');
 card('C','D','Pendapatan Zona Ceban',fxS(`Setoran!I${sT}+Setoran!J${sT}`,m.zc),C.grn,C.grnS);
 card('E','F','Pengeluaran',fxE(`Pengeluaran!E${eT}`,m.p),C.red,C.soft);
 card('G','H','LABA BERSIH',{formula:'C5-E5',result:m.lb},C.wh,C.red);
 ws.getRow(6).height=10;
 [['Komisi Zona Ceban',fxS(`Setoran!I${sT}`,m.k)],['Biaya tambahan (plastik, dll.)',fxS(`Setoran!J${sT}`,m.b)],['Hak mitra (disetor ke mitra)',fxS(`Setoran!K${sT}`,m.m)],['Pembayaran QRIS',fxP(`'Metode Bayar'!E${pT}`,PA.qris)],['Tunai disetor (kelipatan '+rp(kel)+')',fxP(`'Metode Bayar'!G${pT}`,PA.setor)],['Tunai receh (tidak bisa disetor)',fxP(`'Metode Bayar'!H${pT}`,PA.receh)]].forEach(([l,v],i)=>{const r=7+i;ws.mergeCells(`A${r}:D${r}`);ws.mergeCells(`E${r}:F${r}`);
  put(ws,'A'+r,l,{bold:1,bg:C.gry,box:1});put(ws,'E'+r,v,{bg:C.gry,box:1,fmt:FMT,al:'right'});ws.getRow(r).height=22});
 ws.mergeCells('A14:H14');put(ws,'A14','Laba bersih = komisi + biaya tambahan dari mitra − pengeluaran operasional. Uang penjualan milik mitra tidak dihitung sebagai laba.',{it:1,color:'FF7A6666',al:'center'});
 ws.mergeCells('A15:H15');put(ws,'A15',`Dibuat otomatis oleh ${BRAND.name}`,{it:1,color:'FF9A8585',al:'center'});page(ws,'portrait');

 /* Sheet 2: Setoran (masuk − sisa = terjual) */
 const wt=wb.addWorksheet('Setoran',{views:[{state:'frozen',ySplit:4,showGridLines:false}]});widths(wt,[6,13,14,24,10,10,10,18,16,16,18]);head(wt,'K','SETORAN MITRA (MASUK − SISA = TERJUAL)');
 th(wt,4,['No','Tanggal','Cabang','Mitra','Masuk','Sisa','Terjual','Nilai Penjualan','Komisi','Biaya Tambahan','Hak Mitra']);
 SS.forEach(({s,c},i)=>{const r=5+i,bg=i%2?C.gry:C.wh,o={bg,box:1,fmt:FMT,al:'right'};
  put(wt,'A'+r,i+1,{al:'center',bg,box:1});put(wt,'B'+r,ud(s.tgl),{al:'center',bg,box:1,fmt:DF});put(wt,'C'+r,s.cabang,{bg,box:1});put(wt,'D'+r,mname(s.mitra),{bg,box:1});
  put(wt,'E'+r,c.t,{bg,box:1,al:'center'});
  if(c.done){put(wt,'F'+r,c.sisa,{bg,box:1,al:'center'});put(wt,'G'+r,{formula:`E${r}-F${r}`,result:c.laku},{bg,box:1,al:'center',bold:1})}
  else{put(wt,'F'+r,'menunggu',{bg,box:1,al:'center',it:1,color:'FF9A8585'});put(wt,'G'+r,0,{bg,box:1,al:'center'})}
  put(wt,'H'+r,c.gross,o);put(wt,'I'+r,c.komisi,o);put(wt,'J'+r,c.ex,o);put(wt,'K'+r,{formula:`H${r}-I${r}-J${r}`,result:c.net},{...o,bold:1})});
 wt.mergeCells(`A${sT}:D${sT}`);put(wt,'A'+sT,'TOTAL',{bold:1,color:C.wh,bg:C.dark,al:'center'});
 [['E',S(SS,x=>x.c.t),'center'],['F',S(SS,x=>x.c.sisa),'center'],['G',S(SS,x=>x.c.laku),'center'],['H',m.g,'right'],['I',m.k,'right'],['J',m.b,'right'],['K',m.m,'right']].forEach(([k,v,al])=>put(wt,k+sT,fxS(`SUM(${k}5:${k}${sL})`,v),{bold:1,color:C.wh,bg:C.dark,fmt:'HIJK'.includes(k)?FMT:undefined,al}));wt.getRow(sT).height=24;
 if(n)wt.autoFilter=`A4:K${sL}`;page(wt,'landscape');

 /* Sheet 3: Pengeluaran */
 const wp=wb.addWorksheet('Pengeluaran',{views:[{state:'frozen',ySplit:4,showGridLines:false}]});widths(wp,[6,14,16,48,20]);head(wp,'E','PENGELUARAN OPERASIONAL');th(wp,4,['No','Tanggal','Cabang','Keterangan','Jumlah']);
 EX.forEach((x,i)=>{const r=5+i,bg=i%2?C.gry:C.wh;put(wp,'A'+r,i+1,{al:'center',bg,box:1});put(wp,'B'+r,ud(x.tgl),{al:'center',bg,box:1,fmt:DF});put(wp,'C'+r,x.cabang||'-',{bg,box:1});put(wp,'D'+r,x.ket,{bg,box:1});put(wp,'E'+r,x.jumlah,{bg,box:1,fmt:FMT,al:'right'})});
 wp.mergeCells(`A${eT}:D${eT}`);put(wp,'A'+eT,'TOTAL',{bold:1,color:C.wh,bg:C.dark,al:'center'});put(wp,'E'+eT,fxE(`SUM(E5:E${eL})`,m.p),{bold:1,color:C.wh,bg:C.dark,fmt:FMT,al:'right'});wp.getRow(eT).height=24;page(wp,'landscape');

 /* Sheet: Metode Bayar */
 const wq=wb.addWorksheet('Metode Bayar',{views:[{state:'frozen',ySplit:4,showGridLines:false}]});widths(wq,[6,13,14,20,18,18,18,18]);head(wq,'H','METODE PEMBAYARAN (QRIS • TUNAI • TUNAI RECEH)');th(wq,4,['No','Tanggal','Cabang','Total Pendapatan','QRIS','Tunai','Tunai Disetor','Tunai Receh']);
 PR.forEach((p,i)=>{const r=5+i,bg=i%2?C.gry:C.wh,o={bg,box:1,fmt:FMT,al:'right'};put(wq,'A'+r,i+1,{al:'center',bg,box:1});put(wq,'B'+r,ud(p.tgl),{al:'center',bg,box:1,fmt:DF});put(wq,'C'+r,p.cabang,{bg,box:1});
  put(wq,'D'+r,p.total,o);put(wq,'E'+r,p.qris,o);put(wq,'F'+r,{formula:`D${r}-E${r}`,result:p.tunai},o);put(wq,'G'+r,p.manual?p.setor:{formula:`FLOOR(F${r},${kel})`,result:p.setor},o);put(wq,'H'+r,{formula:`F${r}-G${r}`,result:p.receh},{...o,bold:1})});
 wq.mergeCells(`A${pT}:C${pT}`);put(wq,'A'+pT,'TOTAL',{bold:1,color:C.wh,bg:C.dark,al:'center'});
 [['D',PA.total],['E',PA.qris],['F',PA.tunai],['G',PA.setor],['H',PA.receh]].forEach(([k,v])=>put(wq,k+pT,fxP(`SUM(${k}5:${k}${pL})`,v),{bold:1,color:C.wh,bg:C.dark,fmt:FMT,al:'right'}));wq.getRow(pT).height=24;page(wq,'landscape');

 /* Sheet 4: Rekap Harian */
 const wr=wb.addWorksheet('Rekap Harian',{views:[{state:'frozen',ySplit:4,showGridLines:false}]});widths(wr,[14,10,20,22,20,20]);head(wr,'F','REKAP HARIAN');th(wr,4,['Tanggal','Hari','Penjualan','Pendapatan Zona Ceban','Pengeluaran','Laba Bersih']);
 d.forEach((k,i)=>{const r=5+i,bg=i%2?C.gry:C.wh,o={bg,box:1,fmt:FMT,al:'right'};put(wr,'A'+r,ud(k),{al:'center',bg,box:1,fmt:DF});put(wr,'B'+r,dn(k),{al:'center',bg,box:1});
  put(wr,'C'+r,inc(k),o);put(wr,'D'+r,zc(k),o);put(wr,'E'+r,out(k),o);put(wr,'F'+r,{formula:`D${r}-E${r}`,result:lb(k)},{...o,bold:1})});
 const rl=4+d.length,rt=rl+1;wr.mergeCells(`A${rt}:B${rt}`);put(wr,'A'+rt,'TOTAL',{bold:1,color:C.wh,bg:C.dark,al:'center'});
 [['C',S(d,inc)],['D',S(d,zc)],['E',S(d,out)],['F',S(d,lb)]].forEach(([c,v])=>put(wr,c+rt,{formula:`SUM(${c}5:${c}${rl})`,result:v},{bold:1,color:C.wh,bg:C.dark,fmt:FMT,al:'right'}));wr.getRow(rt).height=24;
 wr.addConditionalFormatting({ref:`F5:F${rl}`,rules:[{type:'cellIs',operator:'lessThan',formulae:[0],style:{font:{color:{argb:'FFB91C1C'}}}},{type:'cellIs',operator:'greaterThan',formulae:[0],style:{font:{color:{argb:C.grn}}}}]});
 page(wr,'portrait');

 try{const buf=await wb.xlsx.writeBuffer(),a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  a.download=`Laporan-Keuangan-${BRAND.name.replace(/\s+/g,'-')}-${cb.replace(/\s+/g,'-')}-${dk(0)}.xlsx`;document.body.append(a);a.click();a.remove();toast('File Excel diunduh')}
 catch(e){toast('Gagal membuat file Excel')}}
/* ===== LOGIN & SHELL ===== */
const MENU=[['dashboard','Dashboard'],['persediaan','Persediaan'],['keuangan','Keuangan'],['laporan','Laporan'],['pengaturan','Pengaturan']];
const allowed=()=>me.role==='Karyawan'?['dashboard','setoran','mitra','persediaan']:MENU.map(m=>m[0]);
function go(p){location.hash=p}
function menu(o){const s=$('#side'),c=$('#scrim');if(!s)return;const on=o===undefined?!s.classList.contains('open'):o;s.classList.toggle('open',on);if(c)c.classList.toggle('on',on)}
function doSearch(v){gq=(v||'').trim();if(page!=='mitra'&&page!=='persediaan'){tab.persediaan='Rekap Produk';go('persediaan')}render()}
function loadDemo(){if(!confirm('Muat data demo? Semua data saat ini (mitra, setoran, pengeluaran) akan diganti data contoh. Pengguna & sandi tetap.'))return;const u=db.users;db=seed();db.users=u.map(x=>({...x,cabang:x.cabang&&x.cabang!=='Semua'&&!db.cabang.includes(x.cabang)?db.cabang[0]:x.cabang}));cabSel='Semua';mid=null;pf=null;gq='';save();toast('Data demo dimuat');render()}
function clearData(){if(!confirm('Kosongkan SEMUA data (mitra, setoran, pengeluaran)? Pengguna & sandi tetap. Tidak bisa dibatalkan.'))return;const u=db.users,c=db.cabang[0]||'Cidomba';db=seedEmpty();db.users=u;db.cabang=[c];db.users.forEach(x=>{if(x.cabang&&x.cabang!=='Semua')x.cabang=c});db.demoCleared=1;cabSel='Semua';mid=null;pf=null;gq='';save();toast('Data dikosongkan');render()}
function login(){const u=$('#u').value.trim(),w=$('#w').value,a=db.users.find(x=>x.user===u&&x.aktif);
if(!a||w!==a.pw){$('#err').textContent='Username atau password salah, atau akun nonaktif.';return}
try{$('#rm').checked?localStorage.setItem('zc_u',u):localStorage.removeItem('zc_u')}catch(e){}me=a;go('dashboard');render()}
function render(){const h=location.hash.slice(1);if(P[h])page=h;
if(!me){let ru='';try{ru=localStorage.getItem('zc_u')||''}catch(e){}
$('#app').innerHTML=`<div class="login"><div class="hero"><div style="color:#fff">${logo(BRAND.logo?180:84,1)}</div>${BRAND.logo?'':`<div style="font-size:30px;font-weight:800">${BRAND.name}</div>`}<h2>${BRAND.hero}</h2><p>${BRAND.desc}</p><div class="feat"><span>${ic('penjualan',22)}Penjualan</span><span>${ic('pembelian',22)}Pembukuan</span><span>${ic('persediaan',22)}Stok</span><span>${ic('laporan',22)}Laporan</span></div></div>
<div class="lform"><div class="mlogo">${BRAND.logo?logo(100):logo(30)+BRAND.name}</div><h1>Selamat Datang!</h1><p class="sub">Silakan login untuk melanjutkan</p>
<label for="u">Username</label><input id="u" placeholder="Masukkan username" value="${esc(ru)}" autocomplete="username">
<label for="w">Password</label><input id="w" type="password" placeholder="Masukkan password" autocomplete="current-password" onkeydown="if(event.key==='Enter')login()">
<label style="font-weight:400;display:flex;gap:6px;align-items:center"><input id="rm" type="checkbox" style="width:auto" ${ru?'checked':''}>Ingat saya</label><div class="err" id="err"></div>
<button class="btn" onclick="login()">Login</button></div></div>`;return}
if(!allowed().includes(page))page='dashboard';
$('#app').innerHTML=`<div class="shell"><aside class="side" id="side"><div class="brand">${BRAND.logo?logo(76,1):logo(26)+BRAND.name}</div><nav class="nav">${MENU.filter(m=>allowed().includes(m[0])).map(m=>`<a href="#${m[0]}" class="${m[0]==page?'on':''}" onclick="menu(false)">${ic(m[0])}${m[1]}</a>`).join('')}</nav>
<div class="sfoot"><span>${BRAND.name}<br>v7.0.0</span><button onclick="me=null;cart=[];paid='';go('');render()">Keluar</button></div></aside><div class="scrim" id="scrim" onclick="menu(false)"></div>
<div class="main"><header class="top"><button class="burger" aria-label="Menu" onclick="menu()">☰</button><input type="search" placeholder="Cari…" value="${esc(gq)}" aria-label="Cari produk atau mitra" enterkeyhint="search" onkeydown="if(event.key==='Enter')doSearch(this.value)" onsearch="doSearch(this.value)"><span class="sp"></span>${cabSelHTML()}<div class="av">${esc(me.nama[0])}</div><div class="who"><b>${esc(me.nama)}</b><br><small>${me.role}</small></div></header><div id="view">${P[page]()}</div></div></div>`}
window.addEventListener('hashchange',()=>{if(me)render()});
