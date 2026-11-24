/* ===== FITUR MITRA, SETORAN HARIAN, KOMISI, WA, CABANG & ANALISIS (tahap 1) ===== */
let cabSel='Semua',mid=null,sd=dk(0);
const allp=()=>{ens();return db.mitra.flatMap(x=>x.produk)},prods=()=>{ens();return db.mitra.filter(inCab).flatMap(x=>x.produk)};
const canAll=()=>me.role!=='Karyawan';
function ens(){db.cabang=db.cabang||['Cidomba'];db.mitra=db.mitra||[];db.setoran=db.setoran||[];db.set=db.set||{harga:10000,plastik:1000};db.mid=db.mid||1;db.sid=db.sid||1;db.bayar=db.bayar||[];db.bid=db.bid||1;
 db.mv=db.mv||[];db.mitra.forEach(x=>x.produk.forEach(p=>{p.mid=x.id;p.uid='M'+x.id+'-'+p.id;if(p.stok==null)p.stok=0;if(p.min==null)p.min=5}));
 db.users.forEach(u=>{if(!u.cabang)u.cabang=u.role==='Karyawan'?db.cabang[0]:'Semua'});if(!db.v3)mig3()}
/* Migrasi sekali jalan ke sistem satu input: setoran otomatis lama dijadikan data setoran tetap; penjualan kasir lama diarsipkan (agar tidak terhitung ganda); pengeluaran lama diberi cabang. */
function mig3(){const g={};db.mv.forEach(v=>{if(!v.mitra)return;const k=v.mitra+'|'+v.tgl,o=g[k]=g[k]||{},r=o[v.uid]=o[v.uid]||{i:0,o:0};if(v.tipe==='Masuk')r.i+=v.qty;else r.o+=v.qty});
 const have=new Set(db.setoran.map(s=>s.mitra+'|'+s.tgl));
 Object.entries(g).forEach(([k,o])=>{if(have.has(k))return;const[mi,tgl]=k.split('|'),m=db.mitra.find(x=>x.id===+mi);if(!m)return;
  const items=m.produk.filter(p=>o[p.uid]).map(p=>{const r=o[p.uid],q=Math.max(r.i,r.o);return{pid:p.id,nama:p.nama,harga:p.harga,qty:q,sisa:(tgl===dk(0)&&r.o===0)?null:q-r.o}});
  if(items.length)db.setoran.push({id:db.sid++,mitra:m.id,cabang:m.cabang,tgl,komisi:m.komisi,extras:(m.extras||[]).map(e=>({...e})),items})});
 db.legacyTx=(db.legacyTx||[]).concat(db.tx.filter(x=>x.tipe==='Penjualan'));db.tx=db.tx.filter(x=>x.tipe!=='Penjualan');
 db.tx.forEach(x=>{if(!x.cabang)x.cabang=db.cabang[0]});db.v3=1;save()}
const cur=()=>{ens();return canAll()?cabSel:(me.cabang&&me.cabang!=='Semua'?me.cabang:db.cabang[0])};
const inCab=x=>cur()==='Semua'||x.cabang===cur();
const cabSelHTML=()=>{ens();return canAll()?`<select aria-label="Pilih cabang" onchange="if(this.value==='__new'){this.value=cabSel;cabForm();return}cabSel=this.value;mid=null;render()" class="cabsel"><option value="Semua" ${cabSel==='Semua'?'selected':''}>Semua cabang</option>${db.cabang.map(c=>`<option ${cabSel===c?'selected':''}>${esc(c)}</option>`).join('')}<option value="__new">+ Tambah cabang…</option></select>`:`<b class="cabtxt">${esc(cur())}</b>`};
const cabBadge=()=>`<span class="bd ok">${cur()==='Semua'?'Semua cabang':esc(cur())}</span>`;

/* Perhitungan: terjual = masuk (titip) - sisa. Selama sisa belum diisi, setoran berstatus 'menunggu sisa' dan belum dihitung.  Komisi 1000 = x semua titipan; 1500 = x yang terjual. Tidak ada yang laku = tidak ada potongan. */
const calc=s=>{const t=S(s.items,i=>+i.qty||0),done=s.items.length>0&&s.items.every(i=>i.sisa!=null&&i.sisa!==''),sisa=done?S(s.items,i=>+i.sisa||0):0,laku=done?t-sisa:0,
 gross=done?S(s.items,i=>((+i.qty||0)-(+i.sisa||0))*i.harga):0,komisi=laku>0?(+s.komisi===1000?t*1000:laku*1500):0,ex=laku>0?S(s.extras||[],e=>+e.nominal||0):0;
 return{t,sisa,laku,gross,komisi,ex,net:gross-komisi-ex,zc:komisi+ex,done}};
const mname=id=>(db.mitra.find(m=>m.id===id)||{nama:'(dihapus)'}).nama;

/* WhatsApp: tombol membuka WA dengan pesan laporan terisi */
const waNum=h=>{h=String(h||'').replace(/\D/g,'');return h.startsWith('0')?'62'+h.slice(1):h};
function waMsg(s){const c=calc(s),l=s.items.filter(i=>i.qty>0).map(i=>`- ${i.nama}: titip ${i.qty}, laku ${i.qty-i.sisa}, sisa ${i.sisa}`).join('\n');
 return `Halo ${mname(s.mitra)}, laporan ${BRAND.name} ${s.cabang} tgl ${fd(s.tgl)}:\n${l}\nTotal titip ${c.t}, laku ${c.laku}, sisa ${c.sisa}\nPenjualan: ${rp(c.gross)}\nKomisi: ${rp(c.komisi)}${c.ex?'\nBiaya tambahan: '+rp(c.ex):''}\nTotal penghasilan Anda: ${rp(c.net)}\nTerima kasih.`}
const waBtn=s=>{const m=db.mitra.find(x=>x.id===s.mitra);if(!calc(s).done)return'<small style="color:var(--muted)">Menunggu sisa</small>';return m&&m.hp?`<a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/${waNum(m.hp)}?text=${encodeURIComponent(waMsg(s))}">Kirim WA</a>`:'<small style="color:var(--muted)">No. WA kosong</small>'};

/* Satu sumber data: setiap setoran = masuk (titip) per produk + sisa akhir. Terjual = masuk - sisa. */
const genSet=()=>{ens();return db.setoran};


/* ===== METODE PEMBAYARAN: QRIS / TUNAI (disetor) / TUNAI RECEH =====
   Dicatat per cabang per tanggal. Yang diinput hanya nominal QRIS.
   Tunai = Total pendapatan - QRIS. Tunai disetor = tunai dibulatkan ke bawah kelipatan (default Rp 100.000); sisanya = Tunai Receh.
   Contoh: tunai 3.446.000 -> setor 3.400.000, receh 46.000. Total keseluruhan tetap tampil. */
const kelSetor=()=>{const k=Math.round(+(db.set&&db.set.kelipatan));return k>0?k:100000};
const paySplit=(total,q,ms)=>{q=Math.max(0,Math.round(+q)||0);const qris=Math.min(q,total),tunai=total-qris,kel=kelSetor(),man=ms!=null&&ms!=='',m=man?Math.max(0,Math.round(+ms)||0):0,setor=man?Math.min(m,tunai):Math.floor(tunai/kel)*kel;
 return{qrisIn:q,qris,tunai,setor,receh:tunai-setor,over:q>total,manual:man,overS:man&&m>tunai,setorIn:m}};
const payCabs=()=>{ens();return cur()==='Semua'?db.cabang.slice():[cur()]};
const payOf=(tgl,cab)=>{ens();const total=S(db.setoran.filter(s=>s.tgl===tgl&&s.cabang===cab),s=>calc(s).gross),rec=db.bayar.find(b=>b.tgl===tgl&&b.cabang===cab);
 return{tgl,cabang:cab,total,rec,...paySplit(total,rec?rec.qris:0,rec?rec.setor:null)}};
const payRows=dates=>{const R=[];dates.forEach(t=>payCabs().forEach(c=>{const p=payOf(t,c);if(p.total>0||p.qrisIn>0)R.push(p)}));return R};
const payAgg=dates=>{const R=payRows(dates);return{R,total:S(R,x=>x.total),qris:S(R,x=>x.qris),tunai:S(R,x=>x.tunai),setor:S(R,x=>x.setor),receh:S(R,x=>x.receh)}};
const payStats=(a,sub)=>`${stat('Total Pendapatan',rp(a.total),sub,'var(--dark)')}${stat('QRIS',rp(a.qris),'Pembayaran non-tunai','var(--green)')}${stat('Tunai Disetor',rp(a.setor),'Bisa disetor tunai (kelipatan '+rp(kelSetor())+')','var(--amber)')}${stat('Tunai Receh',rp(a.receh),'Tidak bisa disetor tunai · total tunai '+rp(a.tunai),'var(--red)')}`;
const payNote=`<small style="color:var(--muted)">Total pendapatan = nilai penjualan setoran yang sisanya sudah diisi. Tunai = total − QRIS. Tunai disetor dalam kelipatan ${'${K}'}; sisanya Tunai Receh.</small>`;
const payNoteHTML=()=>payNote.replace('${K}',rp(kelSetor()));
const payAct=p=>`<a class="lnk" onclick="payForm('${p.tgl}',${db.cabang.indexOf(p.cabang)})">${p.rec?'Ubah':'Catat QRIS'}</a>`;
const payCells=p=>{const man=p.manual?`<br><small style="color:var(--muted)">diubah manual</small>`:'',w=p.overS?`<br><small style="color:var(--red)">setor tercatat ${rp(p.setorIn)} &gt; tunai</small>`:'';
 return[rp(p.total),rp(p.qris)+(p.over?`<br><small style="color:var(--red)">QRIS tercatat ${rp(p.qrisIn)} &gt; total</small>`:''),rp(p.tunai),`<b>${rp(p.setor)}</b>${man}${w}`,`<b>${rp(p.receh)}</b>${man}`]};
function payPanel(){const rows=payCabs().map(c=>payOf(sd,c)),a=payAgg([sd]);
 return `<div class="stats">${payStats(a,fd(sd))}</div><div class="card"><h3>Metode Pembayaran – ${fd(sd)}</h3>${tbl(['Cabang','>Total Pendapatan','>QRIS','>Tunai','>Tunai Disetor','>Tunai Receh','Aksi'],rows.map(p=>[esc(p.cabang),...payCells(p),p.total>0||p.rec?payAct(p):'<small style="color:var(--muted)">Belum ada penjualan</small>']))}${payNoteHTML()}</div>`}
function payForm(tgl,ci){ens();const cab=db.cabang[ci];if(cab==null)return;if(!canAll()&&cab!==cur())return toast('Tidak bisa mengubah cabang lain');
 const p=payOf(tgl,cab);if(p.total<=0&&!p.rec)return toast('Belum ada penjualan yang sisanya sudah diisi pada tanggal ini');
 const T=p.total;let manual=p.manual,sv=p.manual?p.setorIn:0;
 const el=document.createElement('div');el.className='modal';
 el.innerHTML=`<div class="box"><h3>Metode Pembayaran – ${esc(cab)}</h3><p class="sub" style="margin:0 0 6px">${fd(tgl)} · Total pendapatan <b>${rp(T)}</b>. Ketiga kolom boleh diubah: QRIS + Tunai Disetor + Tunai Receh harus sama dengan total. Mengubah QRIS menghitung ulang tunai otomatis (disetor per kelipatan ${rp(kelSetor())}); mengubah Tunai Disetor atau Tunai Receh menyesuaikan yang satunya.</p>
 <label>Pembayaran QRIS (Rp)<input type="number" min="0" inputmode="numeric" id="pq" value="${p.qrisIn||''}"></label>
 <label>Tunai Disetor (Rp)<input type="number" min="0" inputmode="numeric" id="ps"></label>
 <label>Tunai Receh (Rp)<input type="number" min="0" inputmode="numeric" id="pr"></label>
 <div id="pv" style="font-size:13px;line-height:1.6"></div>
 <div class="row"><button class="btn ghost" id="pa">Hitung otomatis</button><button class="btn ghost" id="bt">Batal</button><button class="btn" id="ok">Simpan</button></div></div>`;
 const g=id=>el.querySelector(id),num=e=>Math.max(0,Math.round(+e.value)||0),tun=()=>T-Math.min(num(g('#pq')),T);
 const info=()=>{const q=num(g('#pq')),t=tun(),s=+g('#ps').value||0,r=+g('#pr').value||0,w=[];
  if(q>T)w.push('QRIS melebihi total pendapatan.');if(manual&&(sv<0||sv>t))w.push('Tunai disetor harus antara 0 dan total tunai '+rp(t)+'.');
  g('#pv').innerHTML=`Total tunai: <b>${rp(t)}</b> · ${manual?'diatur manual':'dihitung otomatis'}<br>Jumlah: ${rp(Math.min(q,T)+s+r)} dari total ${rp(T)}${w.map(x=>`<br><span style="color:var(--red)">${x}</span>`).join('')}`};
 const fill=skip=>{const t=tun(),x=paySplit(T,g('#pq').value,manual?sv:null);if(skip!=='ps')g('#ps').value=manual?sv:x.setor;if(skip!=='pr')g('#pr').value=manual?t-sv:x.receh;info()};
 g('#pq').oninput=()=>{manual=false;fill()};
 g('#ps').oninput=()=>{manual=true;sv=Math.round(+g('#ps').value)||0;fill('ps')};
 g('#pr').oninput=()=>{manual=true;sv=tun()-(Math.round(+g('#pr').value)||0);fill('pr')};
 g('#pa').onclick=()=>{manual=false;fill()};g('#bt').onclick=()=>el.remove();fill();
 g('#ok').onclick=()=>{const q=num(g('#pq')),t=T-Math.min(q,T);if(q>T)return toast('QRIS tidak boleh melebihi total pendapatan '+rp(T));
  if(manual&&(sv<0||sv>t))return toast('Tunai disetor harus antara 0 dan '+rp(t)+' (receh tidak boleh minus)');
  const i=db.bayar.findIndex(b=>b.tgl===tgl&&b.cabang===cab);
  if(q===0&&!manual){if(i>=0)db.bayar.splice(i,1)}
  else{const r=i>=0?db.bayar[i]:{id:db.bid++,tgl,cabang:cab};r.qris=q;if(manual)r.setor=sv;else delete r.setor;if(i<0)db.bayar.push(r)}
  el.remove();save();toast('Metode pembayaran tersimpan');render()};
 document.body.append(el);g('#pq').focus()}
const kelBox=()=>{ens();return `<div style="margin-bottom:18px"><b>Setor Tunai &amp; Tunai Receh</b><p class="sub" style="margin:4px 0 8px">Tunai disetor dalam kelipatan nominal ini; sisanya menjadi Tunai Receh (contoh kelipatan Rp 100.000: tunai Rp 3.446.000 → setor Rp 3.400.000, receh Rp 46.000). Perubahan berlaku juga untuk data lama.</p><label>Kelipatan setor tunai (Rp)<input type="number" id="kel" min="1000" step="1000" value="${kelSetor()}" style="max-width:220px"></label><button class="btn" style="margin-top:8px" onclick="saveKel()">Simpan</button></div>`};
const saveKel=()=>{const v=Math.round(+$('#kel').value);if(!(v>=1000))return toast('Kelipatan minimal Rp 1.000');db.set.kelipatan=v;save();toast('Kelipatan disimpan');render()};

/* ===== CABANG ===== */
const cabForm=i=>{ens();const old=i!=null?db.cabang[i]:'';openForm(i!=null?'Ubah Cabang':'Tambah Cabang Baru',[{k:'n',l:'Nama cabang'}],v=>{if(!v.n){toast('Nama cabang wajib diisi');return false}
 if(db.cabang.some((c,j)=>c.toLowerCase()===v.n.toLowerCase()&&j!==i)){toast('Nama cabang sudah ada');return false}
 if(i!=null){db.cabang[i]=v.n;db.mitra.forEach(m=>{if(m.cabang===old)m.cabang=v.n});db.users.forEach(u=>{if(u.cabang===old)u.cabang=v.n});db.setoran.forEach(s=>{if(s.cabang===old)s.cabang=v.n});db.tx.forEach(x=>{if(x.cabang===old)x.cabang=v.n});db.bayar.forEach(b=>{if(b.cabang===old)b.cabang=v.n});if(cabSel===old)cabSel=v.n}else db.cabang.push(v.n)},{n:old})};
const delCab=i=>{const c=db.cabang[i];if(db.cabang.length<2)return toast('Minimal harus ada satu cabang');if(db.mitra.some(x=>x.cabang===c)||db.users.some(u=>u.cabang===c)||db.tx.some(x=>x.cabang===c))return toast('Cabang masih dipakai mitra/pengguna/pengeluaran. Pindahkan dulu.');if(confirm('Hapus cabang '+c+'?')){db.cabang.splice(i,1);db.bayar=(db.bayar||[]).filter(b=>b.cabang!==c);if(cabSel===c)cabSel='Semua';save();render()}};

/* ===== FORM MITRA / PRODUK / BIAYA ===== */
const mitraForm=id=>{ens();const m=id?db.mitra.find(x=>x.id===id):null;
 openForm(m?'Ubah Mitra':'Tambah Mitra',[{k:'nama',l:'Nama mitra'},{k:'hp',l:'No. WhatsApp (08xxx)',t:'tel'},{k:'cabang',l:'Cabang',o:canAll()?db.cabang:[cur()]},{k:'komisi',l:'Komisi per produk (1000 = semua titipan dihitung, 1500 = hanya yang laku)',o:['1000','1500']},{k:'bank',l:'Bank / E-wallet'},{k:'rek',l:'No. rekening'}],
 v=>{if(!v.nama){toast('Nama mitra wajib diisi');return false}v.komisi=+v.komisi;if(m)Object.assign(m,v);else db.mitra.push({id:db.mid++,...v,produk:[],extras:[{nama:'Plastik/Kresek',nominal:db.set.plastik}]})},
 m?{...m,komisi:String(m.komisi)}:{cabang:cur()==='Semua'?db.cabang[0]:cur(),komisi:'1000'})};
const produkForm=(mi,pi)=>{const m=db.mitra.find(x=>x.id===mi),p=pi!=null?m.produk.find(x=>x.id===pi):null;
 openForm(p?'Ubah Produk Mitra':'Tambah Produk Mitra',[{k:'nama',l:'Nama produk'},{k:'harga',l:'Harga jual ke pembeli (Rp)',t:'number'}],
 v=>{if(!v.nama||!(v.harga>0)){toast('Nama dan harga jual wajib diisi');return false}if(p){const old=p.nama;Object.assign(p,v);if(old!==v.nama)db.setoran.forEach(s=>{if(s.mitra===m.id)s.items.forEach(i=>{if(i.pid===p.id)i.nama=v.nama})})}else m.produk.push({id:Date.now(),...v})},p||{harga:db.set.harga})};
const extraForm=(mi,ei)=>{const m=db.mitra.find(x=>x.id===mi),e=ei!=null?m.extras[ei]:null;
 openForm(e?'Ubah Biaya Tambahan':'Tambah Biaya Tambahan',[{k:'nama',l:'Keterangan (mis. Plastik)'},{k:'nominal',l:'Nominal (Rp) – hanya dipotong jika ada produk laku',t:'number'}],
 v=>{if(!v.nama||!(v.nominal>=0)){toast('Isi keterangan dan nominal');return false}if(e)Object.assign(e,v);else m.extras.push(v)},e||{nominal:db.set.plastik})};
const delMitra=id=>{if(confirm('Hapus mitra beserta produk dan seluruh riwayat setorannya?')){db.mitra=db.mitra.filter(x=>x.id!==id);db.setoran=db.setoran.filter(x=>x.mitra!==id);mid=null;save();render()}};

/* ===== FORM SETORAN HARIAN ===== */
function setoranForm(id){ens();const s0=id?db.setoran.find(x=>x.id===id):null,ms=db.mitra.filter(inCab);
 if(!s0&&!ms.length)return toast('Tambahkan mitra dulu di menu Mitra');
 let s;const load=mi=>{const m=db.mitra.find(x=>x.id===mi),same=s0&&s0.mitra===mi;
  s={id:s0&&s0.id,tgl:(s&&s.tgl)||(s0&&s0.tgl)||sd,mitra:mi,cabang:m.cabang,komisi:same?s0.komisi:m.komisi,extras:same?s0.extras.map(e=>({...e})):m.extras.map(e=>({...e})),
  items:m.produk.map(p=>{const o=same&&s0.items.find(i=>i.pid===p.id);return{pid:p.id,nama:p.nama,harga:o?o.harga:p.harga,qty:o?o.qty:0,sisa:o?o.sisa:null}}).concat(same?s0.items.filter(i=>!m.produk.some(p=>p.id===i.pid)).map(i=>({...i})):[])}};
 load(s0?s0.mitra:ms[0].id);
 const el=document.createElement('div');el.className='modal';
 const body=()=>`<div class="box wide"><h3>${s0?'Ubah / Isi Sisa':'Input'} Setoran Harian</h3>
 <p class="sub" style="margin:0 0 10px">Cukup satu kali input: isi <b>Masuk</b> dari mitra, lalu isi <b>Sisa</b> di akhir hari (boleh menyusul lewat tombol Ubah). Terjual dan penghasilan baru dihitung setelah Anda klik <b>Simpan</b>.</p>
 <label>Mitra<select id="sm" ${s0?'disabled':''}>${(s0?db.mitra.filter(x=>x.id===s0.mitra):ms).map(m=>`<option value="${m.id}" ${m.id===s.mitra?'selected':''}>${esc(m.nama)}${cur()==='Semua'?' – '+esc(m.cabang):''}</option>`).join('')}</select></label>
 <label>Tanggal<input type="date" id="st" value="${s.tgl}"></label>
 <label>Komisi<select id="sk"><option value="1000" ${+s.komisi===1000?'selected':''}>1.000 per produk (semua titipan)</option><option value="1500" ${+s.komisi===1500?'selected':''}>1.500 per produk (yang laku saja)</option></select></label>
 ${s.items.length?`<div class="tbl"><table class="stbl"><colgroup><col><col class="hm w"><col class="w"><col class="w"></colgroup><tr><th>Produk</th><th class="r hm">Harga</th><th class="c">Masuk</th><th class="c">Sisa</th></tr>${s.items.map((i,x)=>`<tr><td>${esc(i.nama)}<small class="hd-only">${rp(i.harga)}</small></td><td class="r hm">${rp(i.harga)}</td><td class="c"><input type="number" min="0" inputmode="numeric" data-i="${x}" data-f="qty" value="${i.qty||''}" aria-label="Masuk ${esc(i.nama)}"></td><td class="c"><input type="number" min="0" inputmode="numeric" data-i="${x}" data-f="sisa" value="${i.sisa==null?'':i.sisa}" aria-label="Sisa ${esc(i.nama)}"></td></tr>`).join('')}</table></div>`:'<p class="sub">Mitra ini belum punya produk. Tambahkan dulu di menu Mitra.</p>'}
 <div class="row"><button class="btn ghost" id="bt">Batal</button><button class="btn" id="ok">Simpan</button></div></div>`;
 const cs=()=>calc({...s,items:s.items.filter(i=>i.qty>0)});
 const draw=()=>{el.innerHTML=body();el.querySelector('#bt').onclick=()=>el.remove();const sm=el.querySelector('#sm');if(sm&&!s0)sm.onchange=()=>{load(+sm.value);draw()};
  el.querySelector('#st').onchange=e=>{s.tgl=e.target.value};el.querySelector('#sk').onchange=e=>{s.komisi=+e.target.value};
  el.querySelectorAll('[data-i]').forEach(e=>e.oninput=()=>{const it=s.items[+e.dataset.i];it[e.dataset.f]=(e.dataset.f==='sisa'&&e.value==='')?null:Math.max(0,+e.value||0)});
  el.querySelector('#ok').onclick=()=>{const bad=s.items.find(i=>i.qty>0&&i.sisa!=null&&i.sisa>i.qty);if(bad)return toast('Sisa melebihi barang masuk: '+bad.nama);if(!s.items.some(i=>i.qty>0))return toast('Isi jumlah masuk minimal satu produk');if(!s.tgl)return toast('Tanggal wajib diisi');
   if(db.setoran.some(x=>x.mitra===s.mitra&&x.tgl===s.tgl&&x.id!==(s0&&s0.id)))return toast('Setoran mitra ini di tanggal tersebut sudah ada. Gunakan tombol Ubah.');
   const r={...s,items:s.items.filter(i=>i.qty>0)};sd=r.tgl;if(s0)Object.assign(s0,r);else db.setoran.push({...r,id:db.sid++});el.remove();save();toast(cs().done?'Setoran tersimpan':'Tersimpan – menunggu sisa');render()}};
 draw();document.body.append(el)}
const delSetoran=id=>{if(confirm('Hapus setoran ini?')){db.setoran=db.setoran.filter(x=>x.id!==id);save();render()}};

/* ===== HALAMAN SETORAN HARIAN ===== */
P.setoran=()=>{ens();const L=genSet().filter(x=>x.tgl===sd&&inCab(x)),C=L.map(calc),wait=C.filter(c=>!c.done).length;
 return `<h1>Setoran Harian ${cabBadge()}</h1><p class="sub">Satu kali input per mitra: produk masuk dan sisa akhir. Terjual = masuk − sisa, lalu penjualan, komisi, dan setoran ke mitra dihitung otomatis.</p>
 <div class="ctl"><span style="color:var(--muted)">Tanggal</span><input type="date" value="${sd}" onchange="sd=this.value||dk(0);render()" style="width:auto"><span class="sp"></span><button class="btn" onclick="setoranForm()">+ Input Setoran</button></div>
 ${wait?`<p class="sub" style="color:var(--red)">${wait} setoran masih menunggu sisa. Klik Ubah / Isi Sisa untuk melengkapi.</p>`:''}
 <div class="stats">${stat('Produk Terjual',S(C,c=>c.laku)+' pcs',S(C,c=>c.t)+' masuk','var(--dark)')}${stat('Nilai Penjualan',rp(S(C,c=>c.gross)),fd(sd),'var(--green)')}${stat('Pendapatan Zona Ceban',rp(S(C,c=>c.zc)),'Komisi + biaya tambahan','var(--amber)')}${stat('Total Untuk Mitra',rp(S(C,c=>c.net)),'Perlu ditransfer','var(--red)')}</div>
 ${payPanel()}
 <div class="card">${tbl(['Mitra','Cabang','>Masuk','>Sisa','>Terjual','>Komisi','>Biaya Tambahan','>Harus Disetor ke Mitra','Aksi'],L.map((s,i)=>{const c=C[i];return [esc(mname(s.mitra)),esc(s.cabang),c.t,c.done?c.sisa:'–',c.done?c.laku:'–',c.done?rp(c.komisi)+`<br><small>${+s.komisi===1000?'1.000 × masuk':'1.500 × laku'}</small>`:'–',c.done?rp(c.ex):'–',c.done?`<b>${rp(c.net)}</b>`:'<span class="bd lo">Menunggu sisa</span>',
 `${waBtn(s)} <a class="lnk" onclick="setoranForm(${s.id})">${c.done?'Ubah':'Isi Sisa'}</a> <button class="btn red" onclick="delSetoran(${s.id})">Hapus</button>`]}))}</div>`};

/* ===== HALAMAN MITRA ===== */
const anal=m=>{const d=range(per),ss=genSet().filter(x=>x.mitra===m.id),at=k=>ss.filter(x=>x.tgl===k),nets=d.map(k=>S(at(k),x=>calc(x).net)),laku=d.map(k=>S(at(k),x=>calc(x).laku)),
 h=Math.floor(d.length/2),a=S(nets.slice(0,h),x=>x),b=S(nets.slice(h),x=>x),act=d.filter(k=>at(k).length),tot=S(nets,x=>x),bi=nets.indexOf(Math.max(...nets));
 return `<div class="stats">${stat('Total Terjual',S(laku,x=>x)+' pcs',per+' hari terakhir','var(--dark)')}${stat('Total Penghasilan Mitra',rp(tot),per+' hari terakhir','var(--green)')}${stat('Rata-rata / Hari Aktif',rp(act.length?tot/act.length:0),act.length+' hari ada setoran','var(--amber)')}${stat('Tren Penghasilan',pct(b,a),'paruh akhir vs awal periode','var(--red)')}</div>
 <div class="g2"><div class="card"><h3>Penghasilan per Hari</h3>${bars(nets.map(x=>Math.max(x,0)),d.map(per>7?x=>x.slice(8):dn))}${act.length?`<p class="sub">Tertinggi ${fd(d[bi])} (${rp(nets[bi])}). Hari dengan setoran: ${act.length} dari ${per}.</p>`:''}</div>
 <div class="card"><h3>Rincian per Hari</h3>${tbl(['Tanggal','>Terjual','>Penghasilan'],act.slice().reverse().map(k=>[fd(k),S(at(k),x=>calc(x).laku),rp(S(at(k),x=>calc(x).net))]))}</div></div>`};
P.mitra=()=>{ens();const m=db.mitra.find(x=>x.id===mid);
 if(!m){const L=db.mitra.filter(inCab).filter(x=>x.nama.toLowerCase().includes(gq.toLowerCase()));
  return `<h1>Mitra ${cabBadge()}</h1><p class="sub">Daftar mitra penitip produk. Pilih mitra untuk mengatur produk, biaya tambahan, dan melihat analisis.</p><div class="ctl">${chipHTML()}<span class="sp"></span><button class="btn ghost" onclick="exportMitra()">⬇ Export Excel</button><button class="btn" onclick="mitraForm()">+ Tambah Mitra</button></div>
  <div class="card">${tbl(['Nama','Cabang','No. WA','Komisi','>Produk','Rekening','Aksi'],L.map(x=>[esc(x.nama),esc(x.cabang),esc(x.hp||'-'),x.komisi===1000?'1.000 (semua titipan)':'1.500 (yang laku)',x.produk.length,esc((x.bank||'')+' '+(x.rek||'')),`<a class="lnk" onclick="mid=${x.id};render()">Detail</a>`]))}</div>`}
 const H=genSet().filter(x=>x.mitra===m.id).sort((a,b)=>b.tgl.localeCompare(a.tgl)).slice(0,10);
 return `<h1>${esc(m.nama)}</h1><p class="sub"><a class="lnk" onclick="mid=null;render()">← Semua mitra</a> · Cabang ${esc(m.cabang)} · Komisi ${m.komisi===1000?'1.000 × semua titipan':'1.500 × produk laku'} · WA ${esc(m.hp||'-')} · ${esc((m.bank||'')+' '+(m.rek||''))}</p>
 <div class="ctl"><button class="btn ghost" onclick="mitraForm(${m.id})">Ubah Data Mitra</button>${canAll()?`<button class="btn red" onclick="delMitra(${m.id})">Hapus Mitra</button>`:''}<span class="sp"></span>${perSel()}</div>
 ${anal(m)}
 <div class="g2"><div class="card"><h3>Produk Mitra <button class="btn" style="float:right" onclick="produkForm(${m.id})">+ Produk</button></h3>${tbl(['Produk','>Harga Jual','Aksi'],m.produk.map(p=>[esc(p.nama),rp(p.harga),`<a class="lnk" onclick="produkForm(${m.id},${p.id})">Ubah</a> <button class="btn red" onclick="if(confirm('Hapus produk?')){db.mitra.find(x=>x.id===${m.id}).produk=db.mitra.find(x=>x.id===${m.id}).produk.filter(q=>q.id!==${p.id});save();render()}">Hapus</button>`]))}</div>
 <div class="card"><h3>Biaya Tambahan <button class="btn" style="float:right" onclick="extraForm(${m.id})">+ Biaya</button></h3>${tbl(['Keterangan','>Nominal','Aksi'],m.extras.map((e,i)=>[esc(e.nama),rp(e.nominal),`<a class="lnk" onclick="extraForm(${m.id},${i})">Ubah</a> <button class="btn red" onclick="db.mitra.find(x=>x.id===${m.id}).extras.splice(${i},1);save();render()">Hapus</button>`]))}<small style="color:var(--muted)">Dipotong dari penghasilan mitra hanya pada hari ada produk yang laku.</small></div></div>
 <div class="card"><h3>Setoran Terakhir &amp; Laporan WhatsApp</h3>${tbl(['Tanggal','>Masuk','>Terjual','>Diterima Mitra','Aksi'],H.map(s=>{const c=calc(s);return [fd(s.tgl),c.t,c.done?c.laku:'–',c.done?rp(c.net):'Menunggu sisa',waBtn(s)]}))}</div>`};

/* ===== EXPORT EXCEL (rekap setoran per periode & per mitra) ===== */
async function exportMitra(){if(typeof ExcelJS==='undefined')return toast('Library Excel belum termuat. Periksa koneksi internet.');ens();
 const d=range(per),R=genSet().filter(x=>d.includes(x.tgl)&&inCab(x)).sort((a,b)=>a.tgl.localeCompare(b.tgl)||a.id-b.id),wb=new ExcelJS.Workbook(),ws=wb.addWorksheet('Rekap Setoran',{views:[{state:'frozen',ySplit:3}]}),
 fill=c=>({type:'pattern',pattern:'solid',fgColor:{argb:c}}),F='"Rp" #,##0';
 ws.mergeCells('A1:J1');ws.getCell('A1').value=`REKAP SETORAN MITRA ${BRAND.name} – ${cur()==='Semua'?'Semua Cabang':cur()} (${fd(d[0])} s/d ${fd(d[d.length-1])})`;ws.getCell('A1').font={bold:true,size:14,color:{argb:'FFFFFFFF'}};ws.getCell('A1').fill=fill('FF7A0D0D');
 ['Tanggal','Cabang','Mitra','Masuk','Sisa','Terjual','Nilai Penjualan','Komisi','Biaya Tambahan','Diterima Mitra'].forEach((h,i)=>{const c=ws.getCell(3,i+1);c.value=h;c.font={bold:true,color:{argb:'FFFFFFFF'}};c.fill=fill('FFD81616');c.alignment={horizontal:'center'}});
 R.forEach((s,i)=>{const r=4+i,c=calc(s);ws.getRow(r).values=[new Date(s.tgl+'T00:00:00Z'),s.cabang,mname(s.mitra),c.t,c.done?c.sisa:'menunggu',c.done?{formula:`D${r}-E${r}`,result:c.laku}:0,c.gross,c.komisi,c.ex,{formula:`G${r}-H${r}-I${r}`,result:c.net}];ws.getCell('A'+r).numFmt='dd/mm/yyyy';['G','H','I','J'].forEach(k=>ws.getCell(k+r).numFmt=F)});
 const e=3+R.length,t=e+1;ws.getCell('A'+t).value='TOTAL';ws.getRow(t).font={bold:true};
 ['D','E','F','G','H','I','J'].forEach(k=>{const c=ws.getCell(k+t);c.value=R.length?{formula:`SUM(${k}4:${k}${e})`}:0;if('GHIJ'.includes(k))c.numFmt=F});
 [12,14,24,8,8,10,18,16,16,18].forEach((w,i)=>ws.getColumn(i+1).width=w);
 const w2=wb.addWorksheet('Per Mitra');w2.addRow(['Mitra','Cabang','Hari Setoran','Terjual','Diterima Mitra']).font={bold:true};
 [...new Set(R.map(s=>s.mitra))].forEach(mi=>{const q=R.filter(s=>s.mitra===mi),m=db.mitra.find(x=>x.id===mi);w2.addRow([mname(mi),m?m.cabang:'',new Set(q.map(s=>s.tgl)).size,S(q,s=>calc(s).laku),S(q,s=>calc(s).net)]).getCell(5).numFmt=F});
 [24,14,14,10,20].forEach((w,i)=>w2.getColumn(i+1).width=w);
 try{const buf=await wb.xlsx.writeBuffer();dlBlob(new Blob([buf],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),`Rekap-Mitra-${dk(0)}.xlsx`);toast('File Excel diunduh')}catch(x){toast('Gagal membuat file Excel')}}

/* ===== PASANG KE MENU ===== */
ICO.mitra='<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5a3 3 0 010 6M18 14c2 .6 3 2.4 3 6"/>';
ICO.setoran='<path d="M4 4h16v16H4zM8 9h8M8 13h8M8 17h5"/>';
MENU.splice(1,0,['setoran','Setoran Harian'],['mitra','Mitra']);
render();
