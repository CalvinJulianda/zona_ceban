/* ===== v7: PERSEDIAAN (bisa diedit) + EXPORT EXCEL LAPORAN ===== */

/* chip pencarian / filter aktif */
const chipHTML=()=>`${gq?`<span class="chip">Cari: ${esc(gq)} <a class="lnk" onclick="gq='';render()" aria-label="Hapus pencarian">✕</a></span>`:''}${pf&&page==='persediaan'&&tb('persediaan')==='Rincian Harian'?`<span class="chip">Produk: ${esc(pf.n)} – ${esc(mname(pf.m))} <a class="lnk" onclick="pf=null;render()" aria-label="Hapus filter produk">✕</a></span>`:''}`;

/* baris persediaan per produk per setoran (dipakai tab Rincian Harian) */
function stkLines(){ens();const d=range(per),q=gq.toLowerCase(),L=[];
 setL().filter(s=>d.includes(s.tgl)).forEach(s=>s.items.forEach((i,ix)=>L.push({s,i,ix})));
 return L.filter(x=>(!pf||(x.s.mitra===pf.m&&x.i.nama===pf.n))&&(!q||(x.i.nama+' '+mname(x.s.mitra)).toLowerCase().includes(q)))
  .sort((a,b)=>b.s.tgl.localeCompare(a.s.tgl)||mname(a.s.mitra).localeCompare(mname(b.s.mitra))||a.i.nama.localeCompare(b.i.nama))}
let _rk=[];
const lihatRinci=i=>{const r=_rk[i];if(!r)return;pf={m:r.mitra,n:r.nama};tab.persediaan='Rincian Harian';render()};

P.persediaan=()=>{ens();const t=tb('persediaan'),q=gq.toLowerCase();let body;
 const R=_rk=prodRekap(per).filter(r=>!q||(r.nama+' '+mname(r.mitra)).toLowerCase().includes(q));
 if(t==='Rincian Harian'){const L=stkLines(),MAX=150,V=L.slice(0,MAX);
  body=`<div class="card">${tbl(['Tanggal','Mitra','Produk','>Masuk','>Sisa','>Terjual','>Nilai','Status','Aksi'],V.map(x=>{const{s,i,ix}=x,has=i.sisa!=null&&i.sisa!=='',done=calc(s).done,lk=has?(+i.qty||0)-(+i.sisa||0):null;
   return[fd(s.tgl),esc(mname(s.mitra)),esc(i.nama),i.qty,has?i.sisa:'–',has?lk:'–',has&&done?rp(lk*i.harga):'–',done?'<span class="bd ok">Selesai</span>':'<span class="bd lo">Menunggu sisa</span>',
   `<a class="lnk" onclick="stokForm(${s.id},${ix})">Ubah</a><button class="btn red" onclick="delStok(${s.id},${ix})">Hapus</button>`]}))}${L.length>MAX?`<p class="sub" style="margin:10px 0 0">Menampilkan ${MAX} dari ${L.length} baris. Persempit dengan pencarian atau pilih periode lebih pendek.</p>`:''}</div>`}
 else{const T=S(R,r=>r.t),K=S(R,r=>r.laku),SS=S(R,r=>r.sisa),G=S(R,r=>r.gross);
  body=`<div class="stats">${stat('Total Titip',T+' pcs',`${per} hari terakhir`,'var(--dark)')}${stat('Terjual',K+' pcs',T?Math.round(K/T*100)+'% dari titipan':'–','var(--green)')}${stat('Sisa',SS+' pcs','Belum laku','var(--amber)')}${stat('Nilai Penjualan',rp(G),'Dari setoran selesai','var(--red)')}</div>
  <div class="card">${tbl(['Mitra','Produk','>Titip','>Terjual','>Sisa','>Nilai Penjualan','Aksi'],R.map((r,ri)=>{const m=db.mitra.find(x=>x.id===r.mitra),pr=m&&m.produk.find(p=>p.nama===r.nama);
   return[esc(mname(r.mitra)),esc(r.nama),r.t,r.laku,r.sisa,rp(r.gross),`<a class="lnk" onclick="lihatRinci(${ri})">Rincian / Edit</a>${pr?`<a class="lnk" onclick="produkForm(${m.id},${pr.id})">Ubah Produk</a>`:''}`]}))}</div>`}
 return `<h1>Persediaan ${cabBadge()}</h1><p class="sub">Terjual = masuk − sisa (dari Setoran Harian). Di tab <b>Rincian Harian</b> setiap baris bisa diubah (masuk, sisa, harga) atau dihapus; rekap otomatis ikut berubah.</p>
 ${tabs('persediaan',['Rekap Produk','Rincian Harian'])}<div class="ctl">${perSel()}${chipHTML()}<span class="sp"></span><button class="btn ghost" onclick="exportLaporanXlsx('Persediaan')">⬇ Export Excel</button><button class="btn" onclick="setoranForm()">+ Input Setoran</button></div>${body}`};

function stokForm(sid,ix){const s=db.setoran.find(x=>x.id===sid),it=s&&s.items[ix];if(!it)return;
 const el=document.createElement('div');el.className='modal';
 el.innerHTML=`<div class="box"><h3>Ubah Persediaan</h3><p class="sub" style="margin:0">${fd(s.tgl)} · ${esc(mname(s.mitra))} · <b>${esc(it.nama)}</b></p>
 <label>Barang masuk / titip (pcs)<input type="number" min="0" inputmode="numeric" id="sq" value="${+it.qty||0}"></label>
 <label>Sisa akhir (pcs) – kosongkan jika belum dihitung<input type="number" min="0" inputmode="numeric" id="ss" value="${it.sisa==null||it.sisa===''?'':it.sisa}"></label>
 <label>Harga jual (Rp)<input type="number" min="0" inputmode="numeric" id="sh" value="${+it.harga||0}"></label>
 <small style="color:var(--muted)">Terjual dihitung (masuk − sisa) setelah klik Simpan.</small>
 <div class="row"><button class="btn ghost" id="bt">Batal</button><button class="btn" id="ok">Simpan</button></div></div>`;
 const g=k=>el.querySelector(k);g('#bt').onclick=()=>el.remove();
 g('#ok').onclick=()=>{const q=Math.round(+g('#sq').value),sv=g('#ss').value.trim(),h=Math.round(+g('#sh').value);
  if(!(q>0))return toast('Barang masuk harus lebih dari 0 (untuk membuang baris, pakai Hapus)');
  if(!(h>0))return toast('Harga jual harus lebih dari 0');
  let sisa=null;if(sv!==''){sisa=Math.round(+sv);if(!(sisa>=0))return toast('Sisa tidak valid');if(sisa>q)return toast('Sisa tidak boleh lebih besar dari barang masuk ('+q+')')}
  it.qty=q;it.sisa=sisa;it.harga=h;el.remove();save();toast('Persediaan diperbarui');render()};
 document.body.append(el);g('#sq').focus()}
function delStok(sid,ix){const s=db.setoran.find(x=>x.id===sid),it=s&&s.items[ix];if(!it)return;
 if(!confirm('Hapus '+it.nama+' pada setoran '+fd(s.tgl)+' ('+mname(s.mitra)+')?'+(s.items.length===1?'\nIni baris terakhir, seluruh setoran tanggal tersebut ikut terhapus.':'')))return;
 s.items.splice(ix,1);if(!s.items.length)db.setoran=db.setoran.filter(x=>x.id!==sid);save();toast('Baris dihapus');render()}

/* ===== EXPORT EXCEL LAPORAN (langsung dari menu Laporan / Persediaan) ===== */
function laporanSheets(){ens();const d=range(per),m=sum(per),pa=payAgg(d),R=prodRekap(per),cb=cabName(),
 days=d.map(k=>{const ss=setD(k),C=ss.map(calc);return{k,n:ss.length,laku:S(C,c=>c.laku),g:inc(k)}});
 const sh={};
 sh['Ringkasan']={name:'Ringkasan',title:'RINGKASAN LAPORAN',head:['Keterangan','Nilai'],w:[38,24],rows:[
  ['Periode',{v:`${fd(d[0])} s/d ${fd(d[d.length-1])}`,t:'t'}],['Cabang',{v:cb,t:'t'}],['Jumlah Setoran',{v:m.ss.length,t:'n'}],['Total Penjualan',{v:m.g,t:'rp'}],
  ['Rata-rata Penjualan per Hari',{v:m.g/per,t:'rp',f:'B8/'+per}],['Produk Terjual (pcs)',{v:S(m.C,c=>c.laku),t:'n'}],['Komisi Zona Ceban',{v:m.k,t:'rp'}],['Biaya Tambahan (plastik, dll.)',{v:m.b,t:'rp'}],
  ['Pendapatan Zona Ceban',{v:m.zc,t:'rp',f:'B11+B12'}],['Pengeluaran Operasional',{v:m.p,t:'rp'}],['LABA BERSIH',{v:m.lb,t:'rp',f:'B13-B14',b:1}],['Hak Mitra (disetor ke mitra)',{v:m.m,t:'rp'}],
  ['Pembayaran QRIS',{v:pa.qris,t:'rp'}],['Tunai Disetor',{v:pa.setor,t:'rp'}],['Tunai Receh',{v:pa.receh,t:'rp'}]]};
 sh['Penjualan Harian']={name:'Penjualan Harian',title:'PENJUALAN HARIAN',head:['Tanggal','Hari','Jumlah Setoran','Produk Terjual','Nilai Penjualan'],t:['d','c','c','c','rp'],w:[14,10,16,16,20],sum:[2,3,4],
  rows:days.map(x=>[x.k,dn(x.k),x.n,x.laku,x.g])};
 sh['Produk Terlaris']={name:'Produk Terlaris',title:'PRODUK TERLARIS',head:['No','Mitra','Produk','Terjual','Nilai Penjualan'],t:['c','t','t','c','rp'],w:[6,26,28,12,20],sum:[3,4],
  rows:R.slice().sort((a,b)=>b.laku-a.laku).map((r,i)=>[i+1,mname(r.mitra),r.nama,r.laku,r.gross])};
 sh['Keuangan Harian']={name:'Keuangan Harian',title:'KEUANGAN HARIAN',head:['Tanggal','Penjualan','Hak Mitra','Pendapatan Zona Ceban','Pengeluaran','Laba Bersih'],t:['d','rp','rp','rp','rp','rp'],w:[14,18,18,24,18,18],sum:[1,2,3,4,5],fx:{5:r=>`D${r}-E${r}`},
  rows:d.map(k=>[k,inc(k),mtr(k),zc(k),out(k),lb(k)])};
 sh['Metode Bayar']={name:'Metode Bayar',title:'METODE PEMBAYARAN (QRIS / TUNAI)',head:['Tanggal','Cabang','Total Pendapatan','QRIS','Tunai','Tunai Disetor','Tunai Receh'],t:['d','t','rp','rp','rp','rp','rp'],w:[14,16,20,18,18,18,18],sum:[2,3,4,5,6],fx:{4:r=>`C${r}-D${r}`,6:r=>`E${r}-F${r}`},
  rows:pa.R.slice().sort((a,b)=>a.tgl.localeCompare(b.tgl)||a.cabang.localeCompare(b.cabang)).map(p=>[p.tgl,p.cabang,p.total,p.qris,p.tunai,p.setor,p.receh])};
 sh['Persediaan']={name:'Persediaan',title:'PERSEDIAAN (REKAP PRODUK)',head:['Mitra','Produk','Titip','Terjual','Sisa','Nilai Penjualan'],t:['t','t','c','c','c','rp'],w:[26,28,10,10,10,20],sum:[2,3,4,5],
  rows:R.map(r=>[mname(r.mitra),r.nama,r.t,r.laku,r.sisa,r.gross])};
 const ms=[...new Set(m.ss.map(s=>s.mitra))];
 sh['Per Mitra']={name:'Per Mitra',title:'REKAP PER MITRA',head:['Mitra','Cabang','Hari Setoran','Terjual','Nilai Penjualan','Komisi','Biaya Tambahan','Hak Mitra'],t:['t','t','c','c','rp','rp','rp','rp'],w:[26,14,14,10,20,16,16,18],sum:[2,3,4,5,6,7],
  rows:ms.map(mi=>{const q=m.ss.filter(s=>s.mitra===mi),C=q.map(calc),mm=db.mitra.find(x=>x.id===mi);return[mname(mi),mm?mm.cabang:'',new Set(q.map(s=>s.tgl)).size,S(C,c=>c.laku),S(C,c=>c.gross),S(C,c=>c.komisi),S(C,c=>c.ex),S(C,c=>c.net)]})};
 return sh}
const LAP_TAB={Penjualan:['Penjualan Harian','Produk Terlaris'],Keuangan:['Keuangan Harian','Metode Bayar'],Persediaan:['Persediaan'],Ringkasan:['Ringkasan']};
const LAP_ALL=['Ringkasan','Penjualan Harian','Produk Terlaris','Keuangan Harian','Metode Bayar','Persediaan','Per Mitra'];

async function exportLaporanXlsx(only){
 const all=laporanSheets(),names=only?(LAP_TAB[only]||LAP_ALL):LAP_ALL,specs=names.map(n=>all[n]),d=range(per),cb=cabName(),
  label=only?only:'Lengkap',fname=`Laporan-${label}-${BRAND.name.replace(/\s+/g,'-')}-${cb.replace(/\s+/g,'-')}`;
 const val=(x,t)=>x&&typeof x==='object'?x.v:x;
 if(typeof ExcelJS==='undefined'){ /* tanpa internet: unduh CSV sebagai cadangan */
  const rows=[];specs.forEach(sp=>{rows.push([],[sp.title+' – '+cb+' ('+fd(d[0])+' s/d '+fd(d[d.length-1])+')'],sp.head);sp.rows.forEach(r=>rows.push(r.map((c,i)=>{const v=val(c);return(sp.t&&sp.t[i]==='d')?fd(v):v})))});
  toast('Library Excel belum termuat (butuh internet) – diunduh sebagai CSV');return exportCSV(['LAPORAN '+BRAND.name],rows,fname)}
 const wb=new ExcelJS.Workbook();wb.creator=BRAND.name;wb.created=new Date();
 const C={red:'FFD81616',dark:'FF7A0D0D',soft:'FFFDECEC',gry:'FFF8F3F3',bd:'FFE3CFCF',wh:'FFFFFFFF',tx:'FF2A1414'},FMT='"Rp" #,##0',DF='dd/mm/yyyy',fill=c=>({type:'pattern',pattern:'solid',fgColor:{argb:c}}),
  sd_={style:'thin',color:{argb:C.bd}},box={top:sd_,left:sd_,bottom:sd_,right:sd_},ud=k=>new Date(Date.UTC(+k.slice(0,4),+k.slice(5,7)-1,+k.slice(8))),
  sub=`${cb}   •   Periode ${fd(d[0])} s/d ${fd(d[d.length-1])}   •   Dicetak ${fd(dk(0))}`,col=i=>String.fromCharCode(65+i);
 const put=(ws,ref,v,o={})=>{const c=ws.getCell(ref);c.value=v;c.font={name:'Calibri',size:o.size||11,bold:!!o.bold,color:{argb:o.color||C.tx}};if(o.bg)c.fill=fill(o.bg);c.alignment={vertical:'middle',horizontal:o.al||'left'};if(o.fmt)c.numFmt=o.fmt;if(o.box)c.border=box;return c};
 specs.forEach(sp=>{const n=sp.head.length,L=col(n-1),ws=wb.addWorksheet(sp.name,{views:[{state:'frozen',ySplit:4,showGridLines:false}]});
  sp.w.forEach((w,i)=>ws.getColumn(i+1).width=w);
  ws.mergeCells(`A1:${L}1`);put(ws,'A1',sp.title+' '+BRAND.name,{size:15,bold:1,color:C.wh,bg:C.dark,al:'center'});ws.getRow(1).height=32;
  ws.mergeCells(`A2:${L}2`);put(ws,'A2',sub,{color:'FF7A6666',bg:C.soft,al:'center'});ws.getRow(2).height=20;
  sp.head.forEach((h,i)=>put(ws,col(i)+4,h,{bold:1,color:C.wh,bg:C.red,al:'center',box:1}));ws.getRow(4).height=24;
  const nr=sp.rows.length;
  sp.rows.forEach((row,ri)=>{const r=5+ri,bg=ri%2?C.gry:C.wh;
   row.forEach((cell,i)=>{const o=cell&&typeof cell==='object'?cell:{v:cell},t=o.t||(sp.t&&sp.t[i])||(i?'n':'t'),ref=col(i)+r;let v=o.v,f=o.f||(sp.fx&&sp.fx[i]&&sp.fx[i](r));
    const st={bg,box:1,bold:!!o.b};
    if(t==='d')put(ws,ref,ud(v),{...st,al:'center',fmt:DF});
    else if(t==='rp')put(ws,ref,f?{formula:f,result:v}:v,{...st,al:'right',fmt:FMT});
    else if(t==='c')put(ws,ref,v,{...st,al:'center'});
    else if(t==='n')put(ws,ref,f?{formula:f,result:v}:v,{...st,al:sp.name==='Ringkasan'?'right':'center',fmt:'#,##0'});
    else put(ws,ref,v,{...st,al:sp.name==='Ringkasan'&&i===1?'right':'left'})})});
  if(sp.sum){const tr=5+nr,last=4+nr;ws.getRow(tr).height=24;
   for(let i=0;i<n;i++){const ref=col(i)+tr,st={bold:1,color:C.wh,bg:C.dark};
    if(i===0)put(ws,ref,'TOTAL',{...st,al:'center'});
    else if(sp.sum.includes(i)){const tt=sp.t[i],v=S(sp.rows,r=>+val(r[i])||0),fm=nr?{formula:`SUM(${col(i)}5:${col(i)}${last})`,result:v}:0;put(ws,ref,fm,{...st,al:tt==='rp'?'right':'center',fmt:tt==='rp'?FMT:'#,##0'})}
    else put(ws,ref,'',st)}}
  if(nr&&!sp.sum&&sp.name!=='Ringkasan')ws.autoFilter=`A4:${L}${4+nr}`;
  ws.pageSetup={orientation:n>6?'landscape':'portrait',fitToPage:true,fitToWidth:1,fitToHeight:0,horizontalCentered:true}});
 try{const buf=await wb.xlsx.writeBuffer();dlBlob(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),fname+'-'+dk(0)+'.xlsx');toast('File Excel diunduh')}catch(e){console.error(e);toast('Gagal membuat file Excel')}}

/* tutup modal dengan tombol Esc */
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const m=document.querySelectorAll('.modal');if(m.length)m[m.length-1].remove()}});
