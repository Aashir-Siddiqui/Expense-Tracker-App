var balance = document.getElementById('balance');
var situation = document.getElementById('situation');
var money_plus = document.getElementById('money-plus');
var money_minus = document.getElementById('money-minus');
var list = document.getElementById('list');
var form = document.getElementById('form');
var text = document.getElementById('text');
var clear = document.getElementById('clear');
var amount = document.getElementById('amount');
var submitBtn = document.querySelector('.btn');

var transactions = JSON.parse(localStorage.getItem('transactions')) || [];
var editingId = null;

function addTransaction(e) {
    e.preventDefault();
    if (text.value.trim() === "" || amount.value.trim() === "") {
        alert("Please Enter Text And Value");
        return;
    }

    if (editingId !== null) {
        transactions = transactions.map(t =>
            t.id === editingId ? { ...t, text: text.value, amount: +amount.value } : t
        );
        editingId = null;
        submitBtn.textContent = "Add Transaction";
    } else {
        transactions.push({
            id: generateID(),
            text: text.value,
            amount: +amount.value
        });
    }

    updateLocalStorage();
    Init();
    text.value = "";
    amount.value = "";
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function editTransaction(id) {
    const transaction = transactions.find(t => t.id === id);
    text.value = transaction.text;
    amount.value = transaction.amount;
    editingId = id;
    submitBtn.textContent = "Update Transaction";
}

function addTransactionDOM(transaction) {
    var sign = transaction.amount < 0 ? "-" : "+";
    var item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
        ${transaction.text} 
        <span>${sign}${Math.abs(transaction.amount)}</span>
        <div class="btns">
            <button class="up-btn" onclick="editTransaction(${transaction.id})">
                <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="del-btn" onclick="removeTransaction(${transaction.id})">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </div>
    `;
    list.appendChild(item);
    clear.style.display = "block"
}

function clearAll() {
    if (transactions.length === 0) return;

    transactions = [];
    updateLocalStorage();
    Init();
    clear.style.display = "none";
    situation.style.display = "none";
}

function updateValues() {
    var amounts = transactions.map(transaction => transaction.amount);
    var total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    var income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    var expense = (
        amounts
            .filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`;

    if (total > 0) {
        situation.innerText = "Profit";
        situation.style.display = "block";
        situation.style.color = "#2ecc71";
    }
    else if (total < 0) {
        situation.innerText = "Debted";
        situation.style.display = "block";
        situation.style.color = "#c0392b";
    }
    else {
        situation.style.display = "none";
    }
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function Init() {
    list.innerHTML = "";
    transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.forEach(addTransactionDOM);
    updateValues();
    clear.style.display = transactions.length ? "block" : "none";
}

Init();
form.addEventListener("submit", addTransaction);