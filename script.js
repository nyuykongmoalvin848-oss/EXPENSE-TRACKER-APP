/* global localStorage */
const balance = document.querySelector(".balance");
const moneyAdded = document.querySelector(".money-added");
const moneyDeducted = document.querySelector(".money-deducted");
const list = document.querySelector(".list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const dateInput = document.getElementById("date");
const filter = document.getElementById("filter");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions"),
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

function deleteTransaction(id) {
  const numericId = Number(id);

  transactions = transactions.filter(
    (transaction) => transaction.id !== numericId,
  );

  updateLocalStorage();

  updateDOM();
}

function addTransaction(e) {
  e.preventDefault();

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    date: dateInput.value,
  };

  transactions.push(transaction);

  updateDOM();

  updateValues();
  updateLocalStorage();

  form.reset();
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" data-id="${transaction.id}">x</button>
  `;

  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  moneyAdded.innerText = `+$${income}`;
  moneyDeducted.innerText = `-$${expense}`;
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateDOM() {
  list.innerHTML = "";

  const filterValue = filter.value;

  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0);
  balance.innerText = `$${total.toFixed(2)}`;

  transactions.forEach((transaction) => {
    if (filterValue === "all") {
      addTransactionDOM(transaction);
    } else if (filterValue === "income" && transaction.amount > 0) {
      addTransactionDOM(transaction);
    } else if (filterValue === "expense" && transaction.amount < 0) {
      addTransactionDOM(transaction);
    }
  });

  updateValues();
}

form.addEventListener("submit", addTransaction);

filter.addEventListener("change", updateDOM);

list.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const transactionId = Number(e.target.dataset.id);
    deleteTransaction(transactionId);
  }
});

updateDOM();
