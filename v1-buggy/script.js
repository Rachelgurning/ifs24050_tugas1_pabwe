// Expense Tracker - v1 (VERSI AWAL, MENGANDUNG BUG)
// Kode ini sengaja dibuat bermasalah untuk keperluan dokumentasi tugas.

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const form = document.getElementById("expense-form");
const listEl = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const filterEl = document.getElementById("filter");

function saveExpenses() {
  localStorage.setItem("expense", JSON.stringify(expenses));
}

function addExpense(e) {
  e.preventDefault();

  const expense = {
    id: Date.now(),
    date: document.getElementById("date").value,
    description: document.getElementById("description").value,
    category: document.getElementById("category").value,
    amount: document.getElementById("amount").value
  };

  expenses.push(expense);
  saveExpenses();
  renderExpenses();
  updateTotal();
  form.reset();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
}

function updateTotal() {
  let total = 0;
  expenses.forEach(function (item) {
    total += item.amount;
  });
  totalEl.textContent = "Rp " + total.toLocaleString("id-ID");
}

function renderExpenses() {
  const selected = filterEl.value;
  const filtered = expenses.filter(function (item) {
    return selected === "Semua" || item.category === selected;
  });

  listEl.innerHTML = "";

  if (filtered.length === 0) {
    listEl.innerHTML = '<li class="empty">Belum ada transaksi.</li>';
    return;
  }

  filtered.forEach(function (item, index) {
    listEl.innerHTML += `
      <li>
        <div>
          <div class="item-desc">${item.description}</div>
          <div class="item-meta">${item.date} · ${item.category}</div>
        </div>
        <div class="item-right">
          <span>Rp ${item.amount}</span>
          <button class="btn-delete" onclick="deleteExpense(${index})">Hapus</button>
        </div>
      </li>`;
  });
}

form.addEventListener("submit", addExpense);
filterEl.addEventListener("change", renderExpenses);

renderExpenses();
updateTotal();
