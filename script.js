const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const stList = document.getElementById('MonthlySpendings');

// const dummyTransactions = [
//     {
//         id: 1, text: 'Flower', amount: -20
//     },
//     {
//         id: 2, text: 'Flower', amount: +20
//     },
//     {
//         id: 3, text: 'Flower', amount: -20
//     },
//     {
//         id: 4, text: 'Flower', amount: -20
//     }

// ];

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') != null? localStorageTransactions: [];
const localGroupStorageTransactions = JSON.parse(localStorage.getItem('groupTransactions'));
let groupTransactions = localStorage.getItem('groupTransactions') != null? localGroupStorageTransactions: [];

function addTransaction(e){
    e.preventDefault();
    if(text.value.trim() === '' || amount.value.trim() === ''){
        alert("Please enter a text and/or amount");
        
    }else{
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };
        transactions.push(transaction);
        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        text.value = '';
        amount.value = '';
    }
}

function addGroupTransaction(){
    var m = [];
    let groupName = prompt('Enter your transaction name');
    if(groupName === null){
        return;
    }
    else if (groupName === "") {
        alert("Please enter a title for your transaction");
        addGroupTransaction();
    } else {
        transactions.forEach( transaction => {
            m.push(transaction);
        })
        const groupTransaction = {
            id: generateID(),
            name: groupName,
            myList: m
        };
        groupTransactions.push(groupTransaction);
        saveAllDOM(groupTransaction);
        updateGroupLocalStorage();
    }  

}

function saveAllDOM(groupTransaction){
    var ulitem = document.createElement('ul');
    const groupTransactions = groupTransaction.myList;
    const div = document.createElement('div');
    div.innerHTML = `
        <h2>${groupTransaction.name}</h2>
        <button class="delete-btn-tra" onclick="removeGroupTransaction(${groupTransaction.id})">Remove</button>
    `;
    ulitem.appendChild(div);
;    groupTransactions.forEach(transaction => {
        const sign = transaction.amount < 0 ? '-' : '+';
        const item = document.createElement('li');
        item.classList.add(transaction.amount < 0 ? 'minus': 'plus');
        item.innerHTML = `
        ${transaction.text} 
        <span>${sign}${Math.abs(transaction.amount)}</span>
        `;
        ulitem.appendChild(item);
    });
    stList.appendChild(ulitem);
    
}

function generateID(){
    return Math.floor(Math.random() * 100000000);
}


function addTransactionDOM(transaction){
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    
    item.classList.add(transaction.amount < 0 ? 'minus': 'plus');
    item.innerHTML = `
        ${transaction.text} 
        <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button>
    `;
    list.appendChild(item);
}


function updateValues(){
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = amounts
    .filter(item => item < 0)
    .reduce((acc, item) => (acc += item), 0).toFixed(2) * 1;
    balance.innerHTML = `$${total}`;
    money_plus.innerHTML = `$${income}`;
    money_minus.innerHTML = `$${expense}`;
}

function removeTransaction(id){
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    init();
}

function removeGroupTransaction(id){
    groupTransactions = groupTransactions.filter(groupTransaction => groupTransaction.id !== id);
    updateGroupLocalStorage();
    init();
}

function updateLocalStorage(){
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateGroupLocalStorage(){
    localStorage.setItem('groupTransactions', JSON.stringify(groupTransactions));
}

function init(){
    list.innerHTML = '';
    stList.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    groupTransactions.forEach(saveAllDOM);
    updateValues();
}

function clearAll(){
    transactions = [];
    text.value = '';
    amount.value = '';
    updateLocalStorage();
    init();
}

init();
form.addEventListener('submit', addTransaction);
//localStorage.clear();


// to-do lists
document.addEventListener('DOMContentLoaded', getList);

$(".addone").on("click",function(event){
	event.preventDefault();
	var enterText=$("input[type='text']").val();
		$("input[type='text']").val("");
		$(".ul-todo").append("<li><span><i class='fa fa-trash'></i></span>" + enterText + "</li>");
		saveNewTodos(enterText);
});

$(".ul-todo").on("click", "span", function(e){
	const item=$(this).parent()[0].lastChild.data;
	$(this).parent().fadeOut(400, function(){
	$(this).remove();
	});
	deleteItem(item);
})

$(".addtodo input[type='text']").keypress(function(event){
	if(event.which === 13){
		var enterText=$(this).val();
		$(this).val("");
		$(".ul-todo").append("<li><span><i class='fa fa-trash'></i></span>" + enterText + "</li>");
		saveNewTodos(enterText);
	}
})

$(".fa-plus").click(function(){
	$("input[type='text']").fadeToggle();
	$(".addone").fadeToggle();
})

function saveNewTodos(item){
	let items;
		if(localStorage.getItem('items') === null){
			items = [];
		}
		else{
			items = JSON.parse(localStorage.getItem('items'));
		}
		items.push(item);
		localStorage.setItem('items', JSON.stringify(items));		
}

function getList(){
	let items;
		if(localStorage.getItem('items') === null){
			items = [];
		}
		else{
			items = JSON.parse(localStorage.getItem('items'));
		}
	console.log(items);
	items.forEach(function(item){
        console.log(item);
		$(".ul-todo").append("<li><span><i class='fa fa-trash'></i></span>" + item + "</li>");	
	})
}

function deleteItem(item){
	let items;
		if(localStorage.getItem('items') === null){
			items = [];
		}
		else{
			items = JSON.parse(localStorage.getItem('items'));
		}	
		items.splice(items.indexOf(item), 1);
		localStorage.setItem('items', JSON.stringify(items));

}
