// Expense Tracker - v2 (VERSI PERBAIKAN)
// Setiap perbaikan diberi penanda [FIX-n] sesuai tabel di docs/BUG_LOG.md

const STORAGE_KEY = "expenses"; // [FIX-1] satu konstanta dipakai untuk simpan DAN baca

const form = document.getElementById("expense-form");
const listEl = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const filterEl = document.getElementById("filter");
const errorEl = document.getElementById("form-error");

function loadExpenses() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(data)) return [];
    // [FIX-2] pastikan amount selalu bertipe number, termasuk data lama
    return data.map(function (item) {
      return Object.assign({}, item, { amount: Number(item.amount) });
    });
  } catch (err) {
    return []; // data rusak -> mulai dari kosong, aplikasi tidak crash
  }
}

let expenses = loadExpenses();

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses)); // [FIX-1]
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearError() {
  errorEl.textContent = "";
  errorEl.hidden = true;
}

// [FIX-5] validasi input sebelum data disimpan
function validate(date, description, amount) {
  if (!date) return "Tanggal wajib diisi.";
  if (!description) return "Deskripsi wajib diisi.";
  if (!Number.isFinite(amount) || amount <= 0) {
    return "Jumlah harus berupa angka lebih dari 0.";
  }
  return null;
}

function formatRupiah(value) {
  return "Rp " + value.toLocaleString("id-ID");
}

function addExpense(e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const description = document.getElementById("description").value.trim();
  const category = document.getElementById("category").value;
  const amount = Number(document.getElementById("amount").value); // [FIX-2]

  const message = validate(date, description, amount);
  if (message) {
    showError(message);
    return;
  }
  clearError();

  expenses.push({
    id: Date.now(),
    date: date,
    description: description,
    category: category,
    amount: amount
  });

  saveExpenses();
  renderExpenses();
  form.reset();
}

// [FIX-3] hapus berdasarkan id unik, bukan indeks pada daftar yang difilter
function deleteExpense(id) {
  expenses = expenses.filter(function (item) {
    return item.id !== id;
  });
  saveExpenses();
  renderExpenses(); // [FIX-4] render juga memperbarui total
}

function updateTotal() {
  const total = expenses.reduce(function (sum, item) {
    return sum + item.amount; // [FIX-2] penjumlahan angka, bukan penggabungan teks
  }, 0);
  totalEl.textContent = formatRupiah(total);
}

function createItem(item) {
  // [FIX-6] elemen dibuat dengan DOM API + textContent, bukan innerHTML
  const li = document.createElement("li");

  const info = document.createElement("div");
  const desc = document.createElement("div");
  desc.className = "item-desc";
  desc.textContent = item.description;
  const meta = document.createElement("div");
  meta.className = "item-meta";
  meta.textContent = item.date + " · " + item.category;
  info.append(desc, meta);

  const right = document.createElement("div");
  right.className = "item-right";
  const amount = document.createElement("span");
  amount.textContent = formatRupiah(item.amount);
  const btn = document.createElement("button");
  btn.className = "btn-delete";
  btn.type = "button";
  btn.textContent = "Hapus";
  btn.addEventListener("click", function () {
    deleteExpense(item.id); // [FIX-3]
  });
  right.append(amount, btn);

  li.append(info, right);
  return li;
}

function renderExpenses() {
  const selected = filterEl.value;
  const filtered = expenses.filter(function (item) {
    return selected === "Semua" || item.category === selected;
  });

  listEl.replaceChildren();

  if (filtered.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Belum ada transaksi.";
    listEl.append(empty);
  } else {
    filtered.forEach(function (item) {
      listEl.append(createItem(item));
    });
  }

  updateTotal(); // [FIX-4] total selalu sinkron dengan data
}

form.addEventListener("submit", addExpense);
filterEl.addEventListener("change", renderExpenses);

renderExpenses();
