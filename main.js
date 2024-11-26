document.addEventListener('DOMContentLoaded', function () {
    const expensesBtn = document.getElementById('expenses-btn');
    const popup = document.getElementById('expense-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const expenseForm = document.getElementById('expense-form');
    const expenseTrack = document.querySelector('.expense-track');

    const chartPlaceholder = document.querySelector('.chart-placeholder');

    // Function to get expenses from local storage
    function getExpensesFromLocalStorage() {
        return JSON.parse(localStorage.getItem("expenses")) || [];
    }

    window.addEventListener("DOMContentLoaded", () => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            window.location.href = "index.html";
        }
    });
    function calculateDateTotals(expenses) {
        const dateTotals = {};

        expenses.forEach(({ amount, date }) => {
            if (dateTotals[date]) {
                dateTotals[date] += parseFloat(amount);
            } else {
                dateTotals[date] = parseFloat(amount);
            }
        });

        return dateTotals;
    }

    function renderChart(data) {
        const ctx = document.createElement('canvas');
        chartPlaceholder.innerHTML = ''; 
        chartPlaceholder.appendChild(ctx);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(data), 
                datasets: [{
                    label: 'Expenses by Date',
                    data: Object.values(data), 
                    backgroundColor: '#FFB84D', 
                    borderRadius: 10, 
                    barThickness: 50, 
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { display: true, color: '#6c757d', font: { size: 9}  } 
                    },
                    y: {
                        grid: { display: false },

                        beginAtZero: true,
                        ticks: { display: false }
                    }
                },
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        top: 20,
                        bottom: 10,
                    }
                }
            }
        });
        
    }

    const today = new Date().toISOString().split('T')[0]; 

    document.getElementById('expense-date').setAttribute('max', today);

    function loadExpensesData() {
        const expenses = getExpensesFromLocalStorage();
        const dateTotals = calculateDateTotals(expenses);
        
        renderChart(dateTotals);
    }

    loadExpensesData();


    function loadExpenses() {
        const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        savedExpenses.forEach(expense => addExpenseToUI(expense));
    }

    function saveExpense(expense) {
        const savedExpenses = JSON.parse(localStorage.getItem('expenses')) || [];
        savedExpenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(savedExpenses));
    }

    function getExpensesFromLocalStorage() {
        return JSON.parse(localStorage.getItem("expenses")) || [];
    }
const themeStylesheet = document.getElementById("theme-stylesheet");
const switchThemeBtn = document.getElementById("switch-theme-btn");

window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme"); 
  
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (savedTheme) {
      themeStylesheet.setAttribute("href", savedTheme); 
    }
  
    if(user){
  
      document.getElementById('profile-name').innerHTML = user.name;
      document.getElementById('profile-email').innerHTML = user.email;
    }
  });
  

switchThemeBtn.addEventListener("click", () => {
  const currentTheme = themeStylesheet.getAttribute("href");

  const newTheme = currentTheme === "style.css" ? "styleLight.css" : "style.css";
  themeStylesheet.setAttribute("href", newTheme); 
  localStorage.setItem("theme", newTheme); 
});

    
    function renderExpensesTable() {
        const expensesData = getExpensesFromLocalStorage();
        const tbody = document.getElementById('expenses-tbody');
        tbody.innerHTML = '';  
        expensesData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
        const latestExpenses = expensesData.slice(0, 3);
    
        latestExpenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
            `;
            tbody.appendChild(row);
        });
    }

    renderExpensesTable();

    function addExpenseToUI({ amount, category }) {
        const existingItem = Array.from(expenseTrack.getElementsByClassName('expense-item'))
            .find(item => item.querySelector('.expense-label span').textContent.toLowerCase() === category.toLowerCase());
    
        if (existingItem) {
            const amountSpan = existingItem.querySelector('.expense-label span:nth-child(2)');
            const currentAmount = parseFloat(amountSpan.textContent.replace('₹', ''));
            const newAmount = currentAmount + parseFloat(amount);
            
            amountSpan.textContent = `₹${newAmount}`;
    
            const progressBar = existingItem.querySelector('.progress');
            progressBar.style.width = `${Math.min(newAmount / 1000 * 100, 100)}%`;
        } else {
            const trackItem = document.createElement('div');
            trackItem.classList.add('expense-item');
            trackItem.innerHTML = `
                <div class="expense-label">
                    <span>${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                    <span>₹${amount}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress ${category}" style="width: ${Math.min(amount / 1000 * 100, 100)}%;"></div>
                </div>
            `;
            expenseTrack.appendChild(trackItem);
        }
    }

    expensesBtn.addEventListener('click', function () {
        popup.style.display = 'flex';
    });

    closePopupBtn.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const amount = document.getElementById('expense-amount').value;
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;

        const expense = { amount, category, date };

        saveExpense(expense);
        addExpenseToUI(expense);

        popup.style.display = 'none';
        expenseForm.reset();
    });

    loadExpenses();
});

