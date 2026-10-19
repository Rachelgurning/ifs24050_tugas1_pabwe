# Log Prompt ke AI

Dokumen ini mencatat instruksi yang dikirim ke AI (Claude) beserta tujuan dan bukti screenshot-nya.

## Prompt 1 - Instruksi awal

```text
Kamu adalah asisten pemrograman web. Buatkan aplikasi Expense Tracker sederhana
menggunakan HTML, CSS, dan Vanilla JavaScript (tanpa framework).
Fitur: (1) form tambah pengeluaran: tanggal, deskripsi, kategori, jumlah;
(2) daftar transaksi; (3) total pengeluaran; (4) filter berdasarkan kategori;
(5) hapus transaksi; (6) data disimpan di localStorage.
Pisahkan menjadi tiga file: index.html, style.css, script.js.
```

**Tujuan:** menghasilkan versi awal aplikasi dengan batasan teknologi yang jelas.

Bukti: `screenshots/bukti-ai/01_prompt_awal.png` dan `02_respons_ai_tiga_file.png`.

## Prompt perbaikan per bug

### Prompt 2 - Bug 1: Data hilang saat halaman di-refresh

```text
Setelah refresh, semua transaksi hilang. Di DevTools → Application → Local Storage
ada kunci "expense", sementara kode membaca "expenses". Perbaiki agar kunci tidak
bisa salah lagi, dan buat proses membaca data aman jika datanya rusak.
```

**Penyebab menurut analisis:** Terjadi salah ketik satu huruf pada kunci localStorage. Kunci ditulis manual di dua tempat, sehingga konsistensinya tidak terjaga. Kesalahan ini sulit terlihat karena aplikasi tetap berjalan normal selama halaman tidak di-refresh.

Bukti: `screenshots/bukti-ai/05_prompt_bug1.png` (prompt) dan `06_hasil_bug1.png` (kode hasil perbaikan).

### Prompt 3 - Bug 2: Total pengeluaran menjadi gabungan teks

```text
Total pengeluaran saya tampil 'Rp 0250001500050000150000' padahal transaksinya
25.000, 15.000, 50.000, dan 150.000. Berikut fungsi addExpense dan updateTotal: [kode].
Jelaskan penyebabnya, lalu perbaiki dengan perubahan sekecil mungkin.
```

**Penyebab menurut analisis:** Nilai `input.value` di JavaScript selalu berupa string. Operator `+=` pada angka dan string melakukan penggabungan teks, bukan penjumlahan. AI tidak mengonversi tipe data sehingga total yang dihasilkan salah.

Bukti: `screenshots/bukti-ai/07_prompt_bug2.png` (prompt) dan `08_hasil_bug2.png` (kode hasil perbaikan).

### Prompt 4 - Bug 3: Hapus pada daftar terfilter menghapus transaksi yang salah

```text
Saat filter 'Belanja' aktif, tombol Hapus pada 'Beli buku' malah menghapus 'Makan siang'.
Berikut renderExpenses dan deleteExpense: [kode]. Jelaskan akar masalahnya dan
perbaiki agar penghapusan selalu mengenai transaksi yang dipilih.
```

**Penyebab menurut analisis:** Indeks berasal dari array hasil filter, tetapi dipakai untuk menghapus dari array asli. Saat filter aktif, posisi item di dua array itu berbeda sehingga item yang terhapus salah.

Bukti: `screenshots/bukti-ai/09_prompt_bug3.png` (prompt) dan `10_hasil_bug3.png` (kode hasil perbaikan).

### Prompt 5 - Bug 4: Total tidak berubah setelah transaksi dihapus

```text
Total tidak berkurang setelah saya menghapus transaksi. Tolong perbaiki dengan cara yang
membuat total selalu sinkron dengan data, bukan sekadar menambah satu panggilan lagi di
deleteExpense.
```

**Penyebab menurut analisis:** `updateTotal()` hanya dipanggil di `addExpense`. Jalur lain yang mengubah data (hapus) lupa memanggilnya. Pola ini rawan karena setiap fitur baru harus ingat memanggil fungsi yang sama.

Bukti: `screenshots/bukti-ai/11_prompt_bug4.png` (prompt) dan `12_hasil_bug4.png` (kode hasil perbaikan).

### Prompt 6 - Bug 5: Form menerima input kosong atau tidak valid

```text
Tambahkan validasi pada form: tanggal dan deskripsi wajib diisi, jumlah harus angka lebih besar
dari 0. Tampilkan pesan error di bawah form dan jangan simpan data jika tidak valid.
```

**Penyebab menurut analisis:** AI membuat jalur yang sempurna (happy path) saja dan tidak memikirkan input yang salah. Tanpa validasi, data kosong atau negatif bisa masuk dan merusak total serta tampilan.

Bukti: `screenshots/bukti-ai/13_prompt_bug5.png` (prompt) dan `14_hasil_bug5.png` (kode hasil perbaikan).

### Prompt 7 - Bug 6: Celah XSS karena pemakaian innerHTML

```text
Kode saya memakai innerHTML dengan data dari input pengguna. Saya mengetes dengan
<img src=x onerror=alert(1)> dan alert muncul. Tolong ubah agar data pengguna tidak pernah
diperlakukan sebagai HTML.
```

**Penyebab menurut analisis:** Data dari pengguna dimasukkan ke string HTML lalu diberikan ke `innerHTML`, sehingga browser menganggapnya sebagai markup. Ini adalah kerentanan Cross-Site Scripting (XSS). Kode AI sering memakai pola template literal seperti ini karena singkat, tetapi tidak aman.

Bukti: `screenshots/bukti-ai/15_prompt_bug6.png` (prompt) dan `16_hasil_bug6.png` (kode hasil perbaikan).

## Pola yang dipakai

| Unsur | Tujuan |
|---|---|
| Gejala dengan angka nyata | AI tahu persis apa yang salah |
| Kode terkait saja | Fokus, tidak mengubah bagian lain |
| Minta penyebab dulu | Penulis ikut memahami, bukan sekadar menempel |
| Batasan: perubahan kecil, tetap Vanilla JS | Hasil sesuai ketentuan tugas |
