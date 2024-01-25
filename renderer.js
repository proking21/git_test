// renderer.js

// Add this code at the top of renderer.js
const Chart = require('chart.js');
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const notifier = require('node-notifier');

const logFilePath = path.join(__dirname, 'app.log');
const INVESTMENT_API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts/1';

let portfolio = [];

// Function to add an investment to the portfolio
function addInvestment(investment) {
  portfolio.push(investment);
  updatePortfolioDisplay();
  updateInvestmentChart();
  showNotification('New investment added!');
}

// Function to remove an investment from the portfolio
function removeInvestment(index) {
  portfolio.splice(index, 1);
  updatePortfolioDisplay();
  updateInvestmentChart();
  showNotification('Investment removed.');
}

// Function to update the portfolio display
function updatePortfolioDisplay() {
  const portfolioContainer = document.getElementById('portfolio-container');
  portfolioContainer.innerHTML = '<h2>Portfolio</h2>';

  if (portfolio.length === 0) {
    portfolioContainer.innerHTML += '<p>No investments in the portfolio.</p>';
  } else {
    portfolio.forEach((investment, index) => {
      portfolioContainer.innerHTML += `
        <div>
          <p><strong>Investment Title:</strong> ${investment.title}</p>
          <p><strong>Investment Amount:</strong> ${investment.amount}</p>
          <button onclick="removeInvestment(${index})">Remove</button>
        </div>
      `;
    });
  }
}

// Function to create and update the investment chart
function updateInvestmentChart() {
  const chartContainer = document.getElementById('investment-chart');

  if (chartContainer) {
    const ctx = chartContainer.getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: portfolio.map((investment, index) => Investment ${index + 1}),
        datasets: [{
          label: 'Investment Amount',
          data: portfolio.map(investment => investment.amount),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
      },
    });
  }
}

// Function to display a desktop notification
function showNotification(title, message) {
  notifier.notify({
    title,
    message,
    icon: './path/to/icon.png', // Replace with the path to your app's icon
  });
}

// Mock API endpoint for investment data (replace with your actual endpoint)
function fetchInvestmentData() {
  return fetch(INVESTMENT_API_ENDPOINT)
    .then(response => response.json())
    .catch(error => {
      console.error('Error fetching investment data:', error);
      throw error;
    });
}

// Function to process investment data (replace with your actual logic)
function processInvestmentData(data) {
  return {
    title: data.title,
    body: data.body,
    chartData: [10, 20, 30, 40, 50], // Replace with actual investment data for the chart
  };
}

// Update fetchAndDisplayInsights function
async function fetchAndDisplayInsights() {
  try {
    const investmentData = await fetchInvestmentData();
    const insights = processInvestmentData(investmentData);
    displayInsights(insights);
    updateInvestmentChart();
    showNotification('Investment insights updated!');
  } catch (error) {
    console.error('Error fetching or processing data:', error);
  }
}

// Function to display investment insights
function displayInsights(insights) {
  const insightsContainer = document.getElementById('insights-container');
  insightsContainer.innerHTML = `
    <h2>Investment Insights</h2>
    <p><strong>Investment Title:</strong> ${insights.title}</p>
    <p><strong>Investment Body:</strong> ${insights.body}</p>
  `;
}

// Function to add an investment to the portfolio based on user input
function addInvestmentToPortfolio() {
  const investmentTitle = document.getElementById('investmentTitle').value;
  const investmentAmount = document.getElementById('investmentAmount').value;

  if (investmentTitle && investmentAmount) {
    const investment = {
      title: investmentTitle,
      amount: investmentAmount,
    };

    addInvestment(investment);
  } else {
    alert('Please enter both title and amount.');
  }
}

// Function to handle form submission
function submitForm() {
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
  };

  ipcRenderer.send('submit-form', formData);
}
