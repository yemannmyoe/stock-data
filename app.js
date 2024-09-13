// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC7q0mmjjSAJs4p7R7bF0xLtRoVBF3n_eY",
    authDomain: "stock-data-d30a8.firebaseapp.com",
    projectId: "stock-data-d30a8",
    storageBucket: "stock-data-d30a8.appspot.com",
    messagingSenderId: "175760609130",
    appId: "1:175760609130:web:ae5fb8d1022def92cd1f13",
    databaseURL: "https://stock-data-d30a8-default-rtdb.firebaseio.com/"  // Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Global variable to store data
let stockData = [];

// Function to fetch and store stock data from Firebase
function loadStockData(autoLoad = true) {
    const dbRef = ref(database, 'stocks');
    
    get(dbRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        stockData = snapshot.val();  // Store the fetched data globally
        console.log(stockData);
        if (autoLoad) { 
          filterAndDisplayStockData(stockData);  // Display without filter on page load
        } else {
          filterAndDisplayStockData();  // Filter and display data when "Find" is clicked
        }
      } else {
        console.log('No data available');
        document.getElementById('userTableBody').innerHTML = '<tr><td colspan="9">No records found</td></tr>';
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

// Function to filter and display data in the table
function filterAndDisplayStockData(data = stockData) {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const location = document.getElementById('location').value;
  const product = document.getElementById('product').value;

  const filteredStocks = Object.values(data).filter(stock => {
    const stockDate = new Date(stock.date);
    return (!startDate || stockDate >= new Date(startDate)) &&
           (!endDate || stockDate <= new Date(endDate)) &&
           (!location || stock.location === location) &&
           (!product || stock.product === product);
  });

  let output = '';
  if (filteredStocks.length > 0) {
    filteredStocks.forEach(function(stock, index) {
      output += `
        <tr>
          <td>${index + 1}</td>
          <td>${stock.date}</td>
          <td>${stock.receive_no}</td>
          <td>${stock.location}</td>
          <td>${stock.product}</td>
          <td>${stock.unit}</td>
          <td>${stock.qty}</td>
          <td>${stock.price}</td>
          <td>${stock.amount}</td>
        </tr>
      `;
    });
  } else {
    output = `<tr><td colspan="9">No records found</td></tr>`;
  }
  document.getElementById('userTableBody').innerHTML = output;
}

// Automatically load data when the page is ready
document.addEventListener('DOMContentLoaded', function() {
    loadStockData(); 
});

// Add event listener to "Find" button for filtering
document.getElementById('findBtn').addEventListener('click', function() {
    loadStockData(false); 
});
