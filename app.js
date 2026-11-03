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
function seed(){let r=7;const rnd=()=>(r=(r*9301+49297)%233280)/233280;
const products=[['Indomie Goreng','Makanan Instan',2,5,2500],['Teh Botol','Minuman',10,5,4000],['Susu UHT','Minuman',8,5,6000],['Roti Tawar','Makanan Ringan',15,5,12000],['Minyak Goreng 1L','Bahan Pokok',3,5,16000]]
.map((a,i)=>({id:'P00'+(i+1),nama:a[0],kat:a[1],stok:a[2],min:a[3],harga:a[4]}));
const tx=[];let id=1;
for(let o=29;o>=0;o--){const d=dk(o),n=2+Math.floor(rnd()*3);
 for(let i=0;i<n;i++){const items=[];for(let j=0;j<1+Math.floor(rnd()*3);j++){const p=products[Math.floor(rnd()*5)];items.push({n:p.nama,q:5+Math.floor(rnd()*30),h:p.harga})}
  tx.push({id:id++,tgl:d,tipe:'Penjualan',ket:'Penjualan (Tunai)',jumlah:S(items,x=>x.q*x.h),items})}
 if(o%5===0)tx.push({id:id++,tgl:d,tipe:'Pembelian',ket:'Pembelian stok',jumlah:200000+Math.floor(rnd()*7)*100000});
 if(o%3===0)tx.push({id:id++,tgl:d,tipe:'Pengeluaran',ket:['Listrik','Transportasi','Gaji harian','Kebersihan'][o%4],jumlah:50000+Math.floor(rnd()*5)*25000});}
return{products,tx,nid:id,mv:[],
users:[{nama:'Andi Pratama',user:'pemilik',role:'Pemilik',aktif:1,pw:'pemilik123'},{nama:'Siti Rahma',user:'karyawan1',role:'Karyawan',aktif:1,pw:'karyawan123'},{nama:'Budi Santoso',user:'admin1',role:'Admin',aktif:1,pw:'admin123'}],
kategori:['Makanan Instan','Minuman','Makanan Ringan','Bahan Pokok'],supplier:['Toko Grosir Jaya','CV Sumber Makmur']}}
let db;try{db=JSON.parse(localStorage.getItem(KEY))}catch(e){}db=db||seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch(e){}};
let me=null,page='dashboard',tab={},cart=[],pay='Tunai',pq='',gq='',per=7,paid='';

/* ===== UTIL UI ===== */
function toast(t){const e=document.createElement('div');e.className='toast';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2200)}
function openForm(title,fields,cb,vals={}){const m=document.createElement('div');m.className='modal';
m.innerHTML=`<div class="box"><h3>${title}</h3>${fields.map(f=>`<label>${f.l}${f.o?`<select name="${f.k}">${f.o.map(o=>`<option ${vals[f.k]==o?'selected':''}>${esc(o)}</option>`).join('')}</select>`:`<input name="${f.k}" type="${f.t||'text'}" value="${esc(vals[f.k]??'')}">`}</label>`).join('')}<div class="row"><button class="btn ghost" onclick="this.closest('.modal').remove()">Batal</button><button class="btn" id="ok">Simpan</button></div></div>`;
m.querySelector('#ok').onclick=()=>{const v={};m.querySelectorAll('[name]').forEach(e=>v[e.name]=e.type==='number'?+e.value:e.value.trim());if(cb(v)!==false){m.remove();save();render()}};document.body.append(m)}
function exportCSV(head,rows){const csv=[head,...rows].map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');
const m=document.createElement('div');m.className='modal';m.innerHTML=`<div class="box"><h3>Export CSV</h3><textarea readonly>${esc(csv)}</textarea><div class="row"><button class="btn ghost" onclick="this.closest('.modal').remove()">Tutup</button><button class="btn" id="cp">Salin</button></div></div>`;
m.querySelector('#cp').onclick=()=>{m.querySelector('textarea').select();try{navigator.clipboard.writeText(csv)}catch(e){document.execCommand('copy')}toast('Data disalin')};document.body.append(m)}
const stat=(l,v,s,c)=>`<div class="stat" style="--c:${c}"><small>${l}</small><b>${v}</b><em>${s}</em></div>`;
const tbl=(h,rows)=>`<div class="tbl"><table><tr>${h.map(x=>`<th class="${x[0]=='>'?'r':''}">${x.replace('>','')}</th>`).join('')}</tr>${rows.length?rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${h[i][0]=='>'?'r':''}">${c}</td>`).join('')}</tr>`).join(''):`<tr><td colspan="${h.length}" style="color:var(--muted);text-align:center;padding:24px">Belum ada data.</td></tr>`}</table></div>`;
const tabs=(k,names,extra='')=>{const t=tab[k]||names[0];return `<div class="tabs">${names.map(n=>`<a class="${n==t?'on':''}" tabindex="0" onclick="tab['${k}']='${n}';render()">${n}</a>`).join('')}<span class="sp"></span>${extra}</div>`};
const tb=k=>tab[k]||({persediaan:'Stok Produk',keuangan:'Ringkasan',laporan:'Penjualan',pengaturan:'Pengguna'})[k];
const status=p=>p.stok<=0?['no','Stok Habis']:p.stok<=p.min?['lo','Stok Menipis']:['ok','Aman'];
const badge=p=>{const s=status(p);return `<span class="bd ${s[0]}">${s[1]}</span>`};
function bars(v,l,col='var(--primary)'){const W=600,H=230,L=58,B=26,mx=Math.max(...v,1)*1.1,bw=(W-L)/v.length;
let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Grafik batang">`;
for(let i=0;i<=4;i++){const y=(H-B)-(H-B-10)*i/4;s+=`<line x1="${L}" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${L-6}" y="${y+4}" text-anchor="end">${Math.round(mx*i/4/1000)*1000>=1e6?(mx*i/4/1e6).toFixed(1)+' jt':Math.round(mx*i/4/1000)+' rb'}</text>`}
v.forEach((x,i)=>{const h=(H-B-10)*x/mx,xx=L+i*bw+bw*.2;s+=`<rect x="${xx}" y="${H-B-h}" width="${bw*.6}" height="${h}" rx="3" fill="${col}"/>${v.length<=10||i%5==0?`<text x="${xx+bw*.3}" y="${H-8}" text-anchor="middle">${l[i]}</text>`:''}`});return s+'</svg>'}
function lines(a,b,l){const W=600,H=230,L=58,B=26,mx=Math.max(...a,...b,1)*1.1,st=(W-L-10)/(a.length-1||1);
const pt=v=>v.map((x,i)=>`${L+i*st},${(H-B)-(H-B-10)*x/mx}`).join(' ');let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Grafik arus kas">`;
for(let i=0;i<=4;i++){const y=(H-B)-(H-B-10)*i/4;s+=`<line x1="${L}" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="${L-6}" y="${y+4}" text-anchor="end">${Math.round(mx*i/4/1000)} rb</text>`}
s+=`<polyline points="${pt(a)}" fill="none" stroke="var(--green)" stroke-width="2"/><polyline points="${pt(b)}" fill="none" stroke="var(--red)" stroke-width="2"/>`;
l.forEach((x,i)=>{if(l.length<=10||i%5==0)s+=`<text x="${L+i*st}" y="${H-8}" text-anchor="middle">${x}</text>`});
return s+`</svg><div style="font-size:12px;color:var(--muted)"><span style="color:var(--green)">●</span> Pemasukan &nbsp; <span style="color:var(--red)">●</span> Pengeluaran</div>`}
const inc=d=>S(db.tx.filter(x=>x.tgl===d&&x.tipe==='Penjualan'),x=>x.jumlah),out=d=>S(db.tx.filter(x=>x.tgl===d&&x.tipe!=='Penjualan'),x=>x.jumlah);
const saldo=()=>S(db.tx,x=>x.tipe==='Penjualan'?x.jumlah:-x.jumlah);
const fd=k=>k.slice(8)+'/'+k.slice(5,7)+'/'+k.slice(0,4);
const txRows=a=>a.map(x=>[fd(x.tgl),esc(x.ket),x.tipe==='Penjualan'?`<span style="color:var(--green)">${rp(x.jumlah)}</span>`:`<span style="color:var(--red)">${rp(x.jumlah)}</span>`]);

/* ===== HALAMAN ===== */
const P={};
P.dashboard=()=>{const t=dk(0),y=dk(1),low=db.products.filter(x=>x.stok<=x.min).sort((a,b)=>a.stok-b.stok),d7=range(7);
return `<h1>Dashboard</h1><p class="sub">Ringkasan aktivitas usaha ${BRAND.name}</p>
<div class="stats">${stat('Total Penjualan (Hari Ini)',rp(inc(t)),pct(inc(t),inc(y))+' dari kemarin','var(--green)')}${stat('Total Pengeluaran (Hari Ini)',rp(out(t)),pct(out(t),out(y))+' dari kemarin','var(--red)')}${stat('Stok Menipis',low.length+' Produk','Perlu segera dipesan','var(--amber)')}${stat('Saldo Kas',rp(saldo()),'Total seluruh transaksi','var(--dark)')}</div>
<div class="g2"><div class="card"><h3>Grafik Penjualan (7 Hari Terakhir)</h3>${bars(d7.map(inc),d7.map(dn))}</div>
<div class="card"><h3>Stok Menipis <a style="float:right;font-size:12px;font-weight:500;color:var(--primary);cursor:pointer" onclick="go('persediaan')">Lihat semua</a></h3>${tbl(['Produk','>Stok Tersisa'],low.slice(0,6).map(p=>[esc(p.nama),`<b style="color:var(--red)">${p.stok}</b>`]))}</div></div>`};

const plist=()=>db.products.filter(p=>p.nama.toLowerCase().includes(pq.toLowerCase())).map(p=>{const inC=(cart.find(c=>c.id===p.id)||{q:0}).q;
return `<div class="prow"><div class="ic">${esc(p.nama[0])}</div><div class="nm">${esc(p.nama)}<br><small>${rp(p.harga)} · Stok ${p.stok}</small></div><button class="plus" aria-label="Tambah ${esc(p.nama)}" ${inC>=p.stok?'disabled':''} onclick="addCart('${p.id}',1)">+</button></div>`}).join('')||'<p class="sub">Produk tidak ditemukan.</p>';
const kemb=()=>paid===''?'':(+paid>=cartTotal()?'Kembalian: '+rp(+paid-cartTotal()):'Kurang: '+rp(cartTotal()-paid));
const cartTotal=()=>S(cart,c=>c.q*db.products.find(p=>p.id===c.id).harga);
const cartHTML=()=>`<h3>Keranjang <a style="float:right;font-size:12px;color:var(--red);cursor:pointer;font-weight:500" onclick="cart=[];upd()">Hapus semua</a></h3>
${tbl(['Produk','Qty','>Subtotal'],cart.map(c=>{const p=db.products.find(x=>x.id===c.id);return [esc(p.nama),`<span class="qty"><button onclick="addCart('${c.id}',-1)">−</button>${c.q}<button onclick="addCart('${c.id}',1)">+</button></span>`,rp(c.q*p.harga)]}))}
<div class="tot"><span>Total</span><span>${rp(cartTotal())}</span></div>
<small style="color:var(--muted)">Metode Pembayaran</small><div class="pay">${['Tunai','Transfer','QRIS'].map(m=>`<label><input type="radio" name="pay" ${pay==m?'checked':''} onchange="pay='${m}';upd()">${m}</label>`).join('')}</div>
${pay==='Tunai'?`<label style="display:block;font-size:12px;color:var(--muted)">Uang diterima (opsional)<input type="number" min="0" value="${esc(paid)}" oninput="paid=this.value;$('#kb').textContent=kemb()" style="margin:4px 0"></label><div id="kb" style="font-weight:600;margin-bottom:12px">${kemb()}</div>`:''}
<div style="display:flex;gap:10px"><button class="btn" onclick="saveSale()">Simpan Transaksi</button><button class="btn ghost" onclick="cart=[];upd()">Batal</button></div>`;
const upd=()=>{$('#plist').innerHTML=plist();$('#cart').innerHTML=cartHTML()};
function addCart(id,d){const p=db.products.find(x=>x.id===id);let c=cart.find(x=>x.id===id);if(!c){if(d<0)return;c={id,q:0};cart.push(c)}
if(c.q+d>p.stok){toast('Stok tidak cukup');return}c.q+=d;if(c.q<=0)cart=cart.filter(x=>x!==c);upd()}
function saveSale(){if(!cart.length)return toast('Keranjang masih kosong');
const bad=cart.find(c=>c.q>db.products.find(p=>p.id===c.id).stok);if(bad)return toast('Stok tidak cukup untuk '+db.products.find(p=>p.id===bad.id).nama);
if(pay==='Tunai'&&paid!==''&&+paid<cartTotal())return toast('Uang diterima kurang dari total');
const items=cart.map(c=>{const p=db.products.find(x=>x.id===c.id);p.stok-=c.q;db.mv.unshift({tgl:dk(0),kode:p.id,nama:p.nama,tipe:'Keluar',qty:c.q,ket:'Penjualan'});return{n:p.nama,q:c.q,h:p.harga}});
const now=new Date(),t={id:db.nid++,tgl:dk(0),jam:p2(now.getHours())+':'+p2(now.getMinutes()),tipe:'Penjualan',ket:'Penjualan ('+pay+')',metode:pay,kasir:me.nama,bayar:(pay==='Tunai'&&paid!=='')?+paid:0,jumlah:S(items,x=>x.q*x.h),items};
db.tx.push(t);cart=[];paid='';save();toast('Transaksi tersimpan');render();showStruk(t.id)}
function showStruk(id){const t=db.tx.find(x=>x.id===id);if(!t||!t.items)return;
 const no='TRX-'+t.tgl.replace(/-/g,'')+'-'+String(t.id).padStart(4,'0'),m=t.ket.match(/\((.*)\)/),cara=t.metode||(m?m[1]:'Tunai');
 const rows=t.items.map(i=>`<div class="sr"><span>${esc(i.n)}</span></div><div class="sr"><span>&nbsp;&nbsp;${i.q} × ${rp(i.h)}</span><span>${rp(i.q*i.h)}</span></div>`).join('');
 const el=document.createElement('div');el.className='modal struk';
 el.innerHTML=`<div class="box"><div class="receipt">${BRAND.logo?`<img src="${BRAND.logo}" class="rlogo" alt="${BRAND.name}">`:`<div class="sc"><b>${BRAND.name}</b></div>`}<hr>
 <div class="sr"><span>No.</span><span>${no}</span></div><div class="sr"><span>Tanggal</span><span>${fd(t.tgl)} ${t.jam||''}</span></div><div class="sr"><span>Kasir</span><span>${esc(t.kasir||'-')}</span></div><hr>${rows}<hr>
 <div class="sr b"><span>TOTAL</span><span>${rp(t.jumlah)}</span></div><div class="sr"><span>Metode</span><span>${esc(cara)}</span></div>
 ${t.bayar?`<div class="sr"><span>Diterima</span><span>${rp(t.bayar)}</span></div><div class="sr"><span>Kembali</span><span>${rp(t.bayar-t.jumlah)}</span></div>`:''}<hr>
 <div class="sc">Terima kasih sudah berbelanja!<br>${esc(BRAND.slogan||'')}</div></div>
 <div class="row noprint"><button class="btn ghost" onclick="this.closest('.modal').remove()">Tutup</button><button class="btn" onclick="window.print()">Cetak Struk</button></div></div>`;document.body.append(el)}
P.penjualan=()=>{cart=cart.filter(c=>db.products.some(p=>p.id===c.id));return `<h1>Penjualan</h1><p class="sub">Catat transaksi kasir dengan cepat.</p><div class="pos"><div class="card"><h3>Tambah Produk</h3><input placeholder="Cari produk..." value="${esc(pq)}" oninput="pq=this.value;$('#plist').innerHTML=plist()" aria-label="Cari produk"><div id="plist">${plist()}</div></div><div class="card" id="cart">${cartHTML()}</div></div>`};

const prodForm=(v,id)=>openForm(id?'Ubah Produk':'Tambah Produk',[{k:'nama',l:'Nama produk'},{k:'kat',l:'Kategori',o:db.kategori},{k:'stok',l:'Stok',t:'number'},{k:'min',l:'Stok minimum',t:'number'},{k:'harga',l:'Harga jual (Rp)',t:'number'}],r=>{if(!r.nama){toast('Nama produk wajib diisi');return false}
if(!(r.stok>=0)||!(r.min>=0)||!(r.harga>=0)){toast('Stok, stok minimum, dan harga tidak boleh negatif');return false}
if(id)Object.assign(db.products.find(p=>p.id===id),r);else db.products.push({id:'P'+String(Math.max(0,...db.products.map(q=>+q.id.slice(1)||0))+1).padStart(3,'0'),...r})},v);
P.persediaan=()=>{const t=tb('persediaan'),q=gq.toLowerCase();let body;
if(t==='Stok Produk')body=tbl(['Kode','Nama Produk','Kategori','>Stok','>Stok Min.','>Harga Jual','Status','Aksi'],db.products.filter(p=>p.nama.toLowerCase().includes(q)).map(p=>[p.id,esc(p.nama),esc(p.kat),`<b ${p.stok<=p.min?'style="color:var(--red)"':''}>${p.stok}</b>`,p.min,rp(p.harga),badge(p),`<a style="color:var(--primary);cursor:pointer" onclick="prodForm(db.products.find(x=>x.id==='${p.id}'),'${p.id}')">Ubah</a> <button class="btn red" onclick="if(confirm('Hapus produk ini?')){db.products=db.products.filter(x=>x.id!=='${p.id}');cart=cart.filter(c=>c.id!=='${p.id}');save();render()}">Hapus</button>`]));
else body=tbl(['Tanggal','Kode','Produk','Jenis','>Jumlah','Keterangan'],db.mv.filter(m=>t==='Riwayat'||m.tipe===(t==='Barang Masuk'?'Masuk':'Keluar')).map(m=>[fd(m.tgl),m.kode,esc(m.nama),m.tipe,m.qty,esc(m.ket)]));
return `<h1>Persediaan</h1><p class="sub">Pantau stok produk secara otomatis.</p>${tabs('persediaan',['Stok Produk','Barang Masuk','Barang Keluar','Riwayat'],'<button class="btn" onclick="prodForm()">+ Tambah Produk</button>')}<div class="card">${body}</div>`};

P.pembelian=()=>{const L=db.tx.filter(x=>x.tipe==='Pembelian').reverse();
return `<h1>Pembelian</h1><p class="sub">Catat barang masuk dari supplier. Stok bertambah otomatis.</p><div class="ctl"><span class="sp"></span><button class="btn" onclick="buyForm()">+ Catat Pembelian</button></div><div class="card">${tbl(['Tanggal','Keterangan','>Total'],L.map(x=>[fd(x.tgl),esc(x.ket),rp(x.jumlah)]))}</div>`};
const buyForm=()=>openForm('Catat Pembelian',[{k:'p',l:'Produk',o:db.products.map(p=>p.id+' – '+p.nama)},{k:'q',l:'Jumlah masuk',t:'number'},{k:'h',l:'Harga beli per satuan (Rp)',t:'number'},{k:'s',l:'Supplier',o:db.supplier}],v=>{
const p=db.products.find(x=>x.id===v.p.split(' ')[0]);if(!p){toast('Belum ada produk. Tambahkan produk dulu di menu Persediaan.');return false}
if(!(v.q>0)){toast('Jumlah masuk harus lebih dari 0');return false}if(!(v.h>0)){toast('Harga beli per satuan wajib diisi');return false}p.stok+=v.q;db.mv.unshift({tgl:dk(0),kode:p.id,nama:p.nama,tipe:'Masuk',qty:v.q,ket:'Pembelian – '+v.s});
db.tx.push({id:db.nid++,tgl:dk(0),tipe:'Pembelian',ket:`Pembelian ${p.nama} ×${v.q} (${v.s})`,jumlah:v.q*(v.h||0)})});

const inRange=n=>{const d=range(n);return db.tx.filter(x=>d.includes(x.tgl))};
const perSel=()=>`<span style="color:var(--muted)">Periode</span><select onchange="per=+this.value;render()" aria-label="Periode"><option value="7" ${per==7?'selected':''}>7 Hari Terakhir</option><option value="30" ${per==30?'selected':''}>30 Hari Terakhir</option></select>`;
const expBtn=`<button class="btn ghost" onclick="exportCSV(['Tanggal','Jenis','Keterangan','Jumlah'],inRange(per).map(x=>[x.tgl,x.tipe,x.ket,x.jumlah]))">Export CSV</button>`;
const xlsBtn=`<button class="btn" onclick="exportXlsx()">⬇ Export Excel</button>`;
P.keuangan=()=>{const t=tb('keuangan'),L=inRange(per),d=range(per),pm=S(L.filter(x=>x.tipe==='Penjualan'),x=>x.jumlah),pg=S(L.filter(x=>x.tipe!=='Penjualan'),x=>x.jumlah);let body;
const addOut=`<button class="btn" onclick="outForm()">+ Catat Pengeluaran</button>`;
if(t==='Ringkasan')body=`<div class="stats">${stat('Total Pemasukan',rp(pm),`${per} hari terakhir`,'var(--green)')}${stat('Total Pengeluaran',rp(pg),`${per} hari terakhir`,'var(--red)')}${stat('Saldo Kas',rp(saldo()),'Seluruh transaksi','var(--dark)')}</div>
<div class="g2"><div class="card"><h3>Arus Kas</h3>${lines(d.map(inc),d.map(out),d.map(x=>x.slice(8)+'/'+x.slice(5,7)))}</div><div class="card"><h3>Transaksi Terbaru</h3>${tbl(['Tanggal','Keterangan','>Jumlah'],txRows(db.tx.slice().sort((a,b)=>b.tgl.localeCompare(a.tgl)||b.id-a.id).slice(0,6)))}</div></div>`;
else if(t==='Rekap Kas')body=`<div class="card">${tbl(['Tanggal','>Pemasukan','>Pengeluaran','>Selisih'],d.slice().reverse().map(k=>[fd(k),rp(inc(k)),rp(out(k)),rp(inc(k)-out(k))]))}</div>`;
else{const pem=t==='Pemasukan';const rs=L.filter(x=>(x.tipe==='Penjualan')===pem).sort((a,b)=>b.tgl.localeCompare(a.tgl)||b.id-a.id);
body=`<div class="card">${pem?tbl(['Tanggal','Keterangan','>Jumlah','>Struk'],txRows(rs).map((r,i)=>[...r,rs[i].items?`<a style="color:var(--primary);cursor:pointer" onclick="showStruk(${rs[i].id})">Lihat</a>`:'']))
:tbl(['Tanggal','Keterangan','>Jumlah'],txRows(rs))}</div>`}
return `<h1>Keuangan</h1><p class="sub">Pantau pemasukan, pengeluaran, dan kas.</p>${tabs('keuangan',['Ringkasan','Pemasukan','Pengeluaran','Rekap Kas'],addOut)}<div class="ctl">${perSel()}<span class="sp"></span>${expBtn}${xlsBtn}</div>${body}`};
const outForm=()=>openForm('Catat Pengeluaran',[{k:'k',l:'Keterangan'},{k:'j',l:'Jumlah (Rp)',t:'number'}],v=>{if(!v.k||!(v.j>0))return false;db.tx.push({id:db.nid++,tgl:dk(0),tipe:'Pengeluaran',ket:v.k,jumlah:v.j})});

P.laporan=()=>{const t=tb('laporan'),L=inRange(per),d=range(per);let body;
if(t==='Penjualan'){const top={};L.filter(x=>x.items).forEach(x=>x.items.forEach(i=>top[i.n]=(top[i.n]||0)+i.q));
body=`<div class="g2"><div class="card"><h3>Grafik Penjualan</h3>${bars(d.map(inc),d.map(per>7?x=>x.slice(8):dn))}</div><div class="card"><h3>Produk Terlaris</h3>${tbl(['No','Produk','>Jumlah'],Object.entries(top).sort((a,b)=>b[1]-a[1]).slice(0,5).map((e,i)=>[i+1,esc(e[0]),e[1]]))}</div></div>`}
else if(t==='Keuangan')body=`<div class="card">${tbl(['Tanggal','>Pemasukan','>Pengeluaran','>Laba Kotor'],d.slice().reverse().map(k=>[fd(k),rp(inc(k)),rp(out(k)),rp(inc(k)-out(k))]))}</div>`;
else if(t==='Persediaan')body=`<div class="card">${tbl(['Produk','>Stok','>Nilai Stok','Status'],db.products.map(p=>[esc(p.nama),p.stok,rp(p.stok*p.harga),badge(p)]))}</div>`;
else body=`<div class="stats">${stat('Jumlah Transaksi',L.filter(x=>x.tipe==='Penjualan').length,`${per} hari terakhir`,'var(--dark)')}${stat('Rata-rata / Hari',rp(S(d,inc)/per),'Penjualan','var(--green)')}${stat('Nilai Stok',rp(S(db.products,p=>p.stok*p.harga)),'Harga jual','var(--amber)')}</div>`;
return `<h1>Laporan</h1><p class="sub">Data untuk keputusan usaha yang lebih baik.</p>${tabs('laporan',['Penjualan','Keuangan','Persediaan','Lainnya'])}<div class="ctl">${perSel()}<span class="sp"></span>${expBtn}</div>${body}`};

P.pengaturan=()=>{const t=tb('pengaturan');let body,btn='';
if(t==='Pengguna'){btn=`<button class="btn" onclick="userForm()">+ Tambah Pengguna</button>`;body=tbl(['Nama','Username','Role','Status','Aksi'],db.users.map((u,i)=>[esc(u.nama),esc(u.user),u.role,`<span class="bd ${u.aktif?'ok':'no'}">${u.aktif?'Aktif':'Nonaktif'}</span>`,`<a style="color:var(--primary);cursor:pointer" onclick="pwForm(${i})">Ubah Sandi</a>${u.user===me.user?'':` &nbsp; <a style="color:var(--primary);cursor:pointer" onclick="db.users[${i}].aktif^=1;save();render()">${u.aktif?'Nonaktifkan':'Aktifkan'}</a>`}`]))}
else if(t==='Parameter')body=`<p>Data tersimpan di browser ini. Menghapus data demo akan mengembalikan seluruh data ke contoh awal.</p><button class="btn" onclick="if(confirm('Reset semua data ke contoh awal?')){db=seed();save();cart=[];render()}">Reset Data Demo</button>`;
else{const k=t==='Kategori'?'kategori':'supplier';btn=`<button class="btn" onclick="listForm('${k}')">+ Tambah ${t}</button>`;body=tbl([t,'Aksi'],db[k].map((x,i)=>[esc(x),`<button class="btn red" onclick="db['${k}'].splice(${i},1);save();render()">Hapus</button>`]))}
return `<h1>Pengaturan</h1><p class="sub">Kelola pengguna, kategori, dan supplier.</p>${tabs('pengaturan',['Pengguna','Kategori','Supplier','Parameter'],btn)}<div class="card">${body}</div>`};
const userForm=()=>openForm('Tambah Pengguna',[{k:'nama',l:'Nama'},{k:'user',l:'Username'},{k:'role',l:'Role',o:['Pemilik','Admin','Karyawan']},{k:'pw',l:'Password (min. 6 karakter)',t:'password'}],v=>{if(!v.nama||!v.user)return false;
 if(db.users.some(u=>u.user===v.user)){toast('Username sudah dipakai');return false}if(v.pw.length<6){toast('Password minimal 6 karakter');return false}db.users.push({...v,aktif:1})});
const pwForm=i=>openForm('Ubah Sandi – '+db.users[i].nama,[{k:'pw',l:'Password baru (min. 6 karakter)',t:'password'}],v=>{if(v.pw.length<6){toast('Password minimal 6 karakter');return false}db.users[i].pw=v.pw;toast('Sandi diperbarui')});
const listForm=k=>openForm('Tambah '+k,[{k:'n',l:'Nama'}],v=>{if(!v.n)return false;db[k].push(v.n)});


/* ===== EXPORT EXCEL (butuh koneksi internet untuk memuat library ExcelJS) ===== */
async function exportXlsx(){
 if(typeof ExcelJS==='undefined')return toast('Library Excel belum termuat. Periksa koneksi internet.');
 const wb=new ExcelJS.Workbook();wb.creator=BRAND.name;wb.created=new Date();
 const d=range(per),L=inRange(per).sort((a,b)=>a.tgl.localeCompare(b.tgl)||a.id-b.id),n=L.length,lastR=4+n;
 const C={red:'FFD81616',dark:'FF7A0D0D',soft:'FFFDECEC',grn:'FF15803D',grnS:'FFE8F5EC',gry:'FFF8F3F3',bd:'FFE3CFCF',wh:'FFFFFFFF',tx:'FF2A1414'};
 const fill=c=>({type:'pattern',pattern:'solid',fgColor:{argb:c}});
 const sd={style:'thin',color:{argb:C.bd}},box={top:sd,left:sd,bottom:sd,right:sd};
 const FMT='"Rp" #,##0',DF='dd/mm/yyyy',ud=k=>new Date(Date.UTC(+k.slice(0,4),+k.slice(5,7)-1,+k.slice(8)));
 const put=(ws,ref,v,o={})=>{const c=ws.getCell(ref);c.value=v;c.font={name:'Calibri',size:o.size||11,bold:!!o.bold,italic:!!o.it,color:{argb:o.color||C.tx}};
  if(o.bg)c.fill=fill(o.bg);c.alignment={vertical:'middle',horizontal:o.al||'left'};if(o.fmt)c.numFmt=o.fmt;if(o.box)c.border=box;return c};
 const subt=`Periode ${fd(d[0])} s/d ${fd(d[d.length-1])}   •   Dicetak ${fd(dk(0))}`;
 const head=(ws,last,t)=>{ws.mergeCells(`A1:${last}1`);put(ws,'A1',t,{size:16,bold:1,color:C.wh,bg:C.dark,al:'center'});ws.getRow(1).height=34;
  ws.mergeCells(`A2:${last}2`);put(ws,'A2',subt,{color:'FF7A6666',bg:C.soft,al:'center'});ws.getRow(2).height=20};
 const widths=(ws,a)=>a.forEach((w,i)=>ws.getColumn(i+1).width=w);
 const page=(ws,o)=>ws.pageSetup={orientation:o,fitToPage:true,fitToWidth:1,fitToHeight:0,horizontalCentered:true};
 const pm=S(L.filter(x=>x.tipe==='Penjualan'),x=>x.jumlah),pg=S(L.filter(x=>x.tipe!=='Penjualan'),x=>x.jumlah);
 const fx=(f,v)=>n?{formula:f,result:v}:v;

 /* Sheet 1: Ringkasan */
 const ws=wb.addWorksheet('Ringkasan',{views:[{showGridLines:false}]});widths(ws,[18,18,18,18,18,18]);head(ws,'F','LAPORAN KEUANGAN '+BRAND.name);
 const card=(a,b,lab,val,color,bg)=>{ws.mergeCells(`${a}4:${b}4`);ws.mergeCells(`${a}5:${b}5`);put(ws,a+'4',lab,{bold:1,color,bg,al:'center'});put(ws,a+'5',val,{size:16,bold:1,color,bg,al:'center',fmt:FMT})};
 ws.getRow(3).height=10;ws.getRow(4).height=22;ws.getRow(5).height=36;
 card('A','B','Total Pemasukan',fx(`Transaksi!E${5+n}`,pm),C.grn,C.grnS);card('C','D','Total Pengeluaran',fx(`Transaksi!F${5+n}`,pg),C.red,C.soft);
 card('E','F','Selisih (Pemasukan − Pengeluaran)',{formula:'A5-C5',result:pm-pg},C.dark,'FFF1E3E3');
 ws.getRow(6).height=10;ws.mergeCells('A7:C7');ws.mergeCells('D7:F7');
 put(ws,'A7','Saldo kas keseluruhan (semua periode)',{bold:1,bg:C.gry,box:1});put(ws,'D7',saldo(),{bold:1,size:13,bg:C.gry,box:1,fmt:FMT,al:'right'});ws.getRow(7).height=26;
 ws.mergeCells('A9:F9');put(ws,'A9','RINGKASAN PER JENIS TRANSAKSI',{bold:1,color:C.wh,bg:C.red,al:'center'});ws.getRow(9).height=24;
 [['A','B','Jenis'],['C','D','Jumlah Transaksi'],['E','F','Total Nilai']].forEach(([a,b,t])=>{ws.mergeCells(`${a}10:${b}10`);put(ws,a+'10',t,{bold:1,bg:C.soft,al:'center',box:1})});
 [['Penjualan','E'],['Pembelian','F'],['Pengeluaran','F']].forEach(([j,col],i)=>{const r=11+i,rows=L.filter(x=>x.tipe===j),bg=i%2?C.gry:C.wh;
  ['A:B','C:D','E:F'].forEach(m=>ws.mergeCells(`${m[0]}${r}:${m[2]}${r}`));
  put(ws,'A'+r,j,{bold:1,bg,box:1,color:j==='Penjualan'?C.grn:C.red});
  put(ws,'C'+r,fx(`COUNTIF(Transaksi!$C$5:$C$${lastR},"${j}")`,rows.length),{bg,box:1,al:'center'});
  put(ws,'E'+r,fx(`SUMIF(Transaksi!$C$5:$C$${lastR},"${j}",Transaksi!$${col}$5:$${col}$${lastR})`,S(rows,x=>x.jumlah)),{bg,box:1,fmt:FMT,al:'right'})});
 ws.mergeCells('A15:F15');put(ws,'A15',`Dibuat otomatis oleh ${BRAND.name}`,{it:1,color:'FF9A8585',al:'center'});page(ws,'portrait');

 /* Sheet 2: Transaksi */
 const wt=wb.addWorksheet('Transaksi',{views:[{state:'frozen',ySplit:4,showGridLines:false}]});widths(wt,[6,14,16,48,20,20]);head(wt,'F','DAFTAR TRANSAKSI');
 ['No','Tanggal','Jenis','Keterangan','Pemasukan','Pengeluaran'].forEach((h,i)=>put(wt,String.fromCharCode(65+i)+'4',h,{bold:1,color:C.wh,bg:C.red,al:'center',box:1}));wt.getRow(4).height=24;
 L.forEach((x,i)=>{const r=5+i,bg=i%2?C.gry:C.wh,ip=x.tipe==='Penjualan';
  put(wt,'A'+r,i+1,{al:'center',bg,box:1});put(wt,'B'+r,ud(x.tgl),{al:'center',bg,box:1,fmt:DF});put(wt,'C'+r,x.tipe,{bg,box:1,bold:1,color:ip?C.grn:C.red});put(wt,'D'+r,x.ket,{bg,box:1});
  put(wt,'E'+r,ip?x.jumlah:null,{bg,box:1,fmt:FMT,al:'right'});put(wt,'F'+r,ip?null:x.jumlah,{bg,box:1,fmt:FMT,al:'right'})});
 const tr=5+n;wt.mergeCells(`A${tr}:D${tr}`);put(wt,'A'+tr,'TOTAL',{bold:1,color:C.wh,bg:C.dark,al:'center'});
 put(wt,'E'+tr,fx(`SUM(E5:E${lastR})`,pm),{bold:1,color:C.wh,bg:C.dark,fmt:FMT,al:'right'});put(wt,'F'+tr,fx(`SUM(F5:F${lastR})`,pg),{bold:1,color:C.wh,bg:C.dark,fmt:FMT,al:'right'});wt.getRow(tr).height=24;
 if(n)wt.autoFilter=`A4:F${lastR}`;page(wt,'landscape');

 /* Sheet 3: Rekap Harian */
 const wr=wb.addWorksheet('Rekap Harian',{views:[{state:'frozen',ySplit:4,showGridLines:false}]});widths(wr,[14,10,22,22,22]);head(wr,'E','REKAP KAS HARIAN');
 ['Tanggal','Hari','Pemasukan','Pengeluaran','Selisih'].forEach((h,i)=>put(wr,String.fromCharCode(65+i)+'4',h,{bold:1,color:C.wh,bg:C.red,al:'center',box:1}));wr.getRow(4).height=24;
 d.forEach((k,i)=>{const r=5+i,bg=i%2?C.gry:C.wh;put(wr,'A'+r,ud(k),{al:'center',bg,box:1,fmt:DF});put(wr,'B'+r,dn(k),{al:'center',bg,box:1});
  put(wr,'C'+r,inc(k),{bg,box:1,fmt:FMT,al:'right'});put(wr,'D'+r,out(k),{bg,box:1,fmt:FMT,al:'right'});put(wr,'E'+r,{formula:`C${r}-D${r}`,result:inc(k)-out(k)},{bg,box:1,fmt:FMT,al:'right',bold:1})});
 const rl=4+d.length,rt=rl+1;wr.mergeCells(`A${rt}:B${rt}`);put(wr,'A'+rt,'TOTAL',{bold:1,color:C.wh,bg:C.dark,al:'center'});
 [['C',S(d,inc)],['D',S(d,out)],['E',S(d,inc)-S(d,out)]].forEach(([c,v])=>put(wr,c+rt,{formula:`SUM(${c}5:${c}${rl})`,result:v},{bold:1,color:C.wh,bg:C.dark,fmt:FMT,al:'right'}));wr.getRow(rt).height=24;
 wr.addConditionalFormatting({ref:`E5:E${rl}`,rules:[{type:'cellIs',operator:'lessThan',formulae:[0],style:{font:{color:{argb:'FFB91C1C'}}}},{type:'cellIs',operator:'greaterThan',formulae:[0],style:{font:{color:{argb:C.grn}}}}]});
 page(wr,'portrait');

 try{const buf=await wb.xlsx.writeBuffer(),a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  a.download=`Laporan-Keuangan-${BRAND.name.replace(/\s+/g,'-')}-${dk(0)}.xlsx`;document.body.append(a);a.click();a.remove();toast('File Excel diunduh')}
 catch(e){toast('Gagal membuat file Excel')}}

/* ===== LOGIN & SHELL ===== */
const MENU=[['dashboard','Dashboard'],['penjualan','Penjualan'],['persediaan','Persediaan'],['keuangan','Keuangan'],['pembelian','Pembelian'],['laporan','Laporan'],['pengaturan','Pengaturan']];
const allowed=()=>me.role==='Karyawan'?['dashboard','penjualan','persediaan']:MENU.map(m=>m[0]);
function go(p){location.hash=p}
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
$('#app').innerHTML=`<div class="shell"><aside class="side" id="side"><div class="brand">${BRAND.logo?logo(76,1):logo(26)+BRAND.name}</div><nav class="nav">${MENU.filter(m=>allowed().includes(m[0])).map(m=>`<a href="#${m[0]}" class="${m[0]==page?'on':''}" onclick="$('#side').classList.remove('open')">${ic(m[0])}${m[1]}</a>`).join('')}</nav>
<div class="sfoot"><span>${BRAND.name}<br>v1.0.0</span><button onclick="me=null;cart=[];paid='';go('');render()">Keluar</button></div></aside>
<div class="main"><header class="top"><button class="burger" aria-label="Menu" onclick="$('#side').classList.toggle('open')">☰</button><input placeholder="Cari produk..." value="${esc(gq)}" aria-label="Cari produk" onkeydown="if(event.key==='Enter'){gq=this.value;tab.persediaan='Stok Produk';go('persediaan');render()}"><span class="sp"></span>
<div class="av">${esc(me.nama[0])}</div><div class="who"><b>${esc(me.nama)}</b><br><small>${me.role}</small></div></header><div id="view">${P[page]()}</div></div></div>`}
window.addEventListener('hashchange',()=>{if(me)render()});render();
