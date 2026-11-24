ZONA CEBAN - Sistem Informasi UMKM (VERSI 7.0)

=== PERUBAHAN VERSI 7 ===
1. TAMPILAN HP: header, menu samping (ada latar gelap, tombol Keluar selalu terlihat), kartu angka 2 kolom, grafik dengan huruf terbaca,
   tabel lebar otomatis jadi kartu per baris, form setoran muat di layar HP, input tidak membuat layar ter-zoom di iPhone.
2. PERSEDIAAN BISA DIEDIT: menu Persediaan punya 2 tab.
   - Rekap Produk: ringkasan per produk (titip, terjual, sisa, nilai). Tombol "Rincian / Edit" membuka baris harian produk itu; "Ubah Produk" mengubah nama/harga produk
     (mengganti nama ikut memperbarui riwayat).
   - Rincian Harian: tiap baris bisa Ubah (masuk, sisa, harga) atau Hapus. Rekap, Dashboard, Keuangan, dan Laporan ikut berubah otomatis.
   - Tombol "+ Input Setoran" untuk menambah barang masuk baru.
3. LAPORAN LANGSUNG EXPORT EXCEL: tombol "Excel Tab Ini" (sesuai tab yang dibuka) dan "Export Excel Lengkap" (semua sheet: Ringkasan, Penjualan Harian,
   Produk Terlaris, Keuangan Harian, Metode Bayar, Persediaan, Per Mitra). Periode dan cabang mengikuti pilihan di layar. Persediaan juga punya tombol Export Excel.
   Jika internet mati (library Excel tidak termuat), otomatis diunduh sebagai CSV.
4. DATA DEMO: saat pertama dibuka dan belum ada data, otomatis terisi 2 cabang (Cidomba, Telukjambe), 5 mitra, 35 hari setoran, pengeluaran, dan QRIS.
   Pengaturan > Parameter: "Muat Data Demo" (ganti semua data dengan contoh) dan "Kosongkan Data" (mulai dari nol untuk data asli). Pengguna & sandi tidak ikut terhapus.
5. Perbaikan kecil: Export CSV kini mengunduh file; pencarian di header berfungsi untuk Persediaan & Mitra (ada tombol x untuk menghapus); tombol Esc menutup form;
   tabel kecil tidak lagi terpotong; Karyawan hanya bisa menambah mitra di cabangnya dan tidak bisa menghapus mitra.

=== PERUBAHAN VERSI 6: METODE PEMBAYARAN (QRIS / TUNAI DISETOR / TUNAI RECEH) ===
- Dicatat per cabang per tanggal. Total pendapatan = nilai penjualan setoran yang sisanya sudah diisi.
- Yang diinput hanya nominal QRIS: menu Setoran Harian > bagian "Metode Pembayaran" > Catat QRIS / Ubah (kosong/0 = semua tunai).
- Tunai = Total pendapatan - QRIS. Tunai Disetor = tunai dibulatkan ke bawah per kelipatan (default Rp 100.000). Sisanya = Tunai Receh.
  Contoh: tunai Rp 3.446.000 -> disetor Rp 3.400.000, receh Rp 46.000. Total keseluruhan tetap ditampilkan.
- Kelipatan bisa diubah di Pengaturan > Parameter (berlaku juga untuk data lama).
- Tampil di: Setoran Harian, Keuangan > Ringkasan, Keuangan > tab Metode Bayar (rincian per hari/cabang), dan Export Excel (sheet baru "Metode Bayar" + ringkasan).
- QRIS, Tunai Disetor, dan Tunai Receh semuanya bisa diedit (tombol Catat QRIS / Ubah). Syarat: QRIS + disetor + receh = total. Mengubah QRIS menghitung ulang otomatis; mengubah disetor/receh menyesuaikan yang satunya; tombol "Hitung otomatis" mengembalikan ke perhitungan kelipatan.
- QRIS tidak boleh melebihi total pendapatan hari itu. Jika total berubah kemudian (mis. sisa diubah) dan QRIS jadi lebih besar, muncul peringatan merah dan perhitungan memakai batas total.
- Ganti nama cabang ikut mengubah data pembayaran; hapus cabang ikut menghapus data pembayarannya.


=== PERUBAHAN VERSI 3 (yang berlaku sekarang; bagian lama di bawah yang bertentangan sudah tidak dipakai) ===
1. SATU KALI INPUT: menu Setoran Harian > + Input Setoran. Pilih mitra, isi jumlah MASUK per produk, lalu isi SISA di akhir hari.
   Terjual = Masuk - Sisa, dihitung hanya setelah klik Simpan (tidak ada hitungan otomatis saat mengetik). Sisa boleh dikosongkan dulu dan diisi menyusul lewat tombol "Isi Sisa" (status "Menunggu sisa", belum dihitung).
   Menu Penjualan (kasir) dan Barang Masuk dihapus karena sudah tergantikan oleh input ini. Satu mitra hanya boleh satu setoran per tanggal.
2. DASHBOARD / KEUANGAN / LAPORAN / PERSEDIAAN mengikuti pilihan cabang di pojok kanan atas (Semua cabang atau cabang tertentu),
   termasuk grafik penjualan. Pengeluaran sekarang dicatat per cabang.
3. LABA BERSIH ZONA CEBAN (menu Keuangan > Ringkasan):
   Pendapatan Zona Ceban = komisi + biaya tambahan (plastik) dari mitra.
   Laba Bersih = Pendapatan Zona Ceban - Pengeluaran operasional.
   Uang penjualan milik mitra (Hak Mitra) ditampilkan terpisah dan TIDAK dihitung sebagai laba.
   Komisi 1.000 = 1.000 x semua barang masuk; komisi 1.500 = 1.500 x barang yang terjual. Tidak ada yang laku = tidak ada potongan.
4. Data lama otomatis dimigrasi saat halaman dibuka pertama kali: setoran otomatis lama menjadi data setoran tetap, penjualan kasir lama
   disimpan sebagai arsip (db.legacyTx) agar tidak terhitung ganda, pengeluaran lama diberi cabang pertama.
5. Export Excel (Keuangan) kini berisi sheet: Ringkasan (termasuk Laba Bersih), Setoran, Pengeluaran, Rekap Harian.

--- Catatan versi sebelumnya ---

Cara menjalankan:
1. Buka folder ini di VS Code.
2. Pasang ekstensi Live Server, lalu klik kanan index.html > Open with Live Server.
   (Atau klik dua kali index.html.) Butuh internet untuk font dan fitur Export Excel.

Akun login awal (bisa diganti di menu Pengaturan > Pengguna > Ubah Sandi):
  pemilik   / pemilik123
  admin1    / admin123
  karyawan1 / karyawan123

Ganti warna : style.css, blok :root paling atas (--primary, --dark, --dark-2)
Ganti logo  : ganti assets/logo.png (latar terang) dan assets/logo-white.png (latar gelap/merah)
Ganti nama  : app.js, objek BRAND di baris awal
Export Excel: menu Keuangan > Export Excel
Reset data  : Pengaturan > Parameter > Reset Data Demo
Struk      : muncul otomatis setelah Simpan Transaksi (Penjualan); bisa dicetak. Struk lama: Keuangan > Pemasukan > Lihat

=== FITUR BARU: MITRA & SETORAN HARIAN (tahap 1) ===
Menu baru : Setoran Harian dan Mitra (di bawah Dashboard).
Hitungan  : Terjual = titip - sisa.
            Komisi 1.000 = 1.000 x SEMUA barang titipan (laku atau tidak).
            Komisi 1.500 = 1.500 x barang yang LAKU saja.
            Plastik/biaya tambahan hanya dipotong jika ada produk yang laku.
            Jika tidak ada yang laku, tidak ada potongan sama sekali.
            Diterima mitra = nilai penjualan - komisi - biaya tambahan.
Mitra     : isi data mitra (cabang, no. WA, jenis komisi, rekening), produk beserta harga jual
            (default 10.000, bisa diubah per produk), dan biaya tambahan per mitra.
            Halaman detail mitra menampilkan analisis (tren, rata-rata, hari terbaik) per periode.
WhatsApp  : tombol "Kirim WA" membuka WhatsApp dengan pesan laporan sudah terisi (tinggal tekan kirim).
Excel     : Mitra > Export Excel = rekap setoran per periode dan per mitra.
Cabang    : pilih cabang atau "Semua cabang" di pojok kanan atas (Pemilik/Admin). Karyawan terkunci
            di cabangnya. Tambah cabang di Pengaturan > Cabang; atur cabang pengguna saat Tambah Pengguna.
CATATAN   : data masih tersimpan di browser (localStorage) per perangkat. Agar bisa dipakai lintas
            perangkat/cabang, perlu database online (Supabase) - menunggu Project URL dan anon key.

=== PERUBAHAN: PRODUK HANYA DARI MITRA ===
- Tidak ada lagi katalog produk umum. Produk yang bisa dijual = produk mitra yang didaftarkan di menu Mitra > Detail > + Produk.
- Barang masuk = penerimaan titipan dari mitra (menu Barang Masuk, atau Persediaan > + Terima Barang Mitra). Stok produk bertambah otomatis.
- Penjualan (kasir) hanya menampilkan produk mitra yang stoknya ada; stok berkurang otomatis dan tercatat per mitra.
- Barang masuk dari mitra tidak dicatat sebagai pengeluaran kas (sistem titip jual).
- Data demo lama (produk umum) dihapus; riwayat transaksi lama tetap ada. Untuk membersihkan: Pengaturan > Parameter > Reset Data Demo (menghapus semua data).

=== SETORAN OTOMATIS & CABANG BARU ===
- Setoran Harian dihitung otomatis per mitra per tanggal: titip = Barang Masuk hari itu, terjual = penjualan kasir hari itu, sisa = titip - terjual.
  Kolom "Harus Disetor ke Mitra" = nilai penjualan - komisi - biaya tambahan. Tidak perlu input manual lagi (setoran manual lama tetap tampil).
- Cabang baru: pilih "+ Tambah cabang..." di pojok kanan atas, atau Pengaturan > Cabang (tambah, ubah nama, hapus). Cabang yang masih dipakai mitra/pengguna tidak bisa dihapus.
  Setelah menambah cabang, daftarkan mitra untuk cabang itu di menu Mitra, dan atur cabang pengguna di Pengaturan > Pengguna.
