# Log Bug dan Perbaikan

| ID | Bug (v1) | Penyebab | Perbaikan (v2) | Alasan keputusan |
|----|----------|----------|----------------|------------------|
| 1 | Data hilang saat refresh | `setItem("expense")` tetapi `getItem("expenses")` | Konstanta `STORAGE_KEY` dipakai di simpan dan baca; `loadExpenses()` dengan `try/catch` | Satu sumber kebenaran mencegah typo; parsing aman agar data rusak tidak membuat aplikasi crash |
| 2 | Total `Rp 0250001500050000150000` | `input.value` berupa string, `+=` menyambung teks | `Number(...)` saat input, normalisasi saat load, `reduce` untuk total | Tipe data harus benar sejak sumbernya; normalisasi saat load menjaga kompatibilitas data lama |
| 3 | Hapus pada filter menghapus item lain | `index` dari array hasil filter dipakai pada array asli | Hapus berdasarkan `id` unik dengan `filter` | Indeks bergeser jika daftar berubah; id bersifat stabil |
| 4 | Total tidak berubah setelah hapus | `updateTotal()` tidak dipanggil di `deleteExpense` | `updateTotal()` dipanggil di dalam `renderExpenses()` | Satu titik render menjamin tampilan selalu sinkron dengan data |
| 5 | Form kosong tetap tersimpan | Tidak ada validasi | Fungsi `validate()` dan pesan error; `min="1"` pada input jumlah | Validasi di JavaScript tetap wajib karena atribut HTML bisa dilewati |
| 6 | Input HTML dieksekusi (XSS) | `innerHTML` dengan data pengguna | Elemen dibuat dengan DOM API dan `textContent` | `textContent` memperlakukan input sebagai teks biasa sehingga tidak bisa menyisipkan skrip |

## Hasil uji otomatis (Playwright, 4 transaksi: 25.000 + 15.000 + 50.000 + 150.000)

| Skenario | v1 | v2 |
|----------|----|----|
| Total | `Rp 0250001500050000150000` | `Rp 240.000` |
| Item setelah refresh | 0 | 4 |
| Hapus "Beli buku" saat filter Belanja | "Makan siang" yang terhapus | "Beli buku" terhapus |
| Total setelah hapus | Tidak berubah | `Rp 190.000` |
| Submit form kosong | 1 transaksi kosong tersimpan | 0 (muncul pesan error) |
| Input `<img onerror=alert>` | `alert("XSS")` muncul | Tampil sebagai teks, tidak ada alert |
