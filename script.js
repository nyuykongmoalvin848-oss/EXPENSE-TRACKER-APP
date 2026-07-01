const balance = document.querySelector('.balance')
const moneyAdded = document.querySelector('.money-added')
const moneyDeducted = document.querySelector('.money-deducted')
const list = document.querySelector('.list')
const form = document.getElementById('form')
const text = document.getElementById('text')
const amount = document.getElementById('amount')
const dateInput = document.getElementById('date')
const filter = document.getElementById('filter')

const transactions = JSON.parse(localStorage.getItem('transactions')) || []

function addTransaction (e) {
  e.preventDefault()

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
    date: dateInput.value
  }

  transactions.push(transaction)
  updateDOM()
  updateLocalStorage()
  form.reset()
}

function generateID () {
  return Math.floor(Math.random() * 100000000)
}

function updateDOM () {
  const currentFilter = filter.value
  list.innerHTML = ''

  const filteredTransactions = transactions.filter((t) => {
    if (currentFilter === 'income') return t.amount > 0
    if (currentFilter === 'expense') return t.amount < 0
    return true
  })

  filteredTransactions.forEach((t) => {
    const sign = t.amount < 0 ? '-' : '+'
    const itemClass = t.amount < 0 ? 'minus' : 'plus'
    const li = document.createElement('li')

    li.className = itemClass
    li.innerHTML = `
      ${t.text} <span>${t.date}</span> <span>${sign}$${Math.abs(t.amount).toFixed(2)}</span>
      <button class="delete-btn" onclick="deleteTransaction(${t.id})">x</button>
    `
    list.appendChild(li)
  })

  const amounts = transactions.map((t) => t.amount)
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2)

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2)

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2)

  balance.innerText = `${total < 0 ? '-' : ''}$${Math.abs(total).toFixed(2)}`
  moneyAdded.innerText = `+$${income}`
  moneyDeducted.innerText = `-$${expense}`
}

function updateLocalStorage () {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

form.addEventListener('submit', addTransaction)
filter.addEventListener('change', updateDOM)

updateDOM()
