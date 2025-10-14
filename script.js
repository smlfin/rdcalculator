// Function to calculate the core formula component (part of the maturity formula)
function calculateFormulaComponent(years, annualRatePercentage) {
    // I3 from your formula
    const r = annualRatePercentage / 400;
    // ... (rest of the formula logic) ...
    const n_quarters = (years * 12) / 3;
    const numerator = Math.pow((1 + r), n_quarters) - 1;
    const denominator = 1 - Math.pow((1 + r), -1/3);
    
    if (denominator === 0) {
        return 0;
    }

    return numerator / denominator;
}

// ----------------------------------------------------------------------
// 1. Calculate Maturity Amount
// ----------------------------------------------------------------------
function calculateAndDisplayMaturity() {
    const monthlyDepositInput = document.getElementById('monthlyDeposit');
    const principalAmount = parseFloat(monthlyDepositInput.value);
    const resultsContainer = document.getElementById('maturityResultsTableContainer');
    const targetInput = document.getElementById('targetAmount');
    
    // Clear other input/results and reset goal fund heading
    targetInput.value = '';
    document.getElementById('depositResultsTableContainer').innerHTML = '';
    // Target the specific ID for the heading
    document.getElementById('goalFundHeading').textContent = 'Required Monthly Deposit (1 to 5 Years)';
    
    document.getElementById('clearButton').style.display = principalAmount >= 1000 ? 'block' : 'none';


    if (isNaN(principalAmount) || principalAmount < 1000) {
        resultsContainer.innerHTML = '';
        return;
    }

    const annualRatePercentage = 12.12;
    let tableHTML = `
        <table class="maturity-table">
            <thead>
                <tr>
                    <th>Period (Years)</th>
                    <th>Maturity Amount</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let years = 1; years <= 5; years++) {
        const formulaValue = calculateFormulaComponent(years, annualRatePercentage);
        const maturityAmount = principalAmount * formulaValue;
        const roundedMaturity = Math.round(maturityAmount);

        tableHTML += `
            <tr>
                <td>${years} Year${years > 1 ? 's' : ''}</td>
                <td>₹ ${roundedMaturity.toLocaleString('en-IN')}</td>
            </tr>
        `;
    }

    tableHTML += `
            </tbody>
        </table>
    `;

    resultsContainer.innerHTML = tableHTML;
}

// ----------------------------------------------------------------------
// 2. Calculate Required Monthly Deposit (New Logic with Custom Heading)
// ----------------------------------------------------------------------
function calculateAndDisplayRequiredDeposit() {
    const targetAmountInput = document.getElementById('targetAmount');
    const targetAmount = parseFloat(targetAmountInput.value);
    const resultsContainer = document.getElementById('depositResultsTableContainer');
    const monthlyInput = document.getElementById('monthlyDeposit');
    // Target the specific ID for the heading
    const goalFundHeading = document.getElementById('goalFundHeading');


    // Clear other input/results
    monthlyInput.value = '';
    document.getElementById('maturityResultsTableContainer').innerHTML = '';

    document.getElementById('clearButton').style.display = targetAmount >= 1000 ? 'block' : 'none';

    if (isNaN(targetAmount) || targetAmount < 1000) {
        resultsContainer.innerHTML = '';
        goalFundHeading.textContent = 'Required Monthly Deposit (1 to 5 Years)'; // Reset generic heading
        return;
    }

    // --- 🌟 CUSTOM HEADING LOGIC 🌟 ---
    const formattedTarget = targetAmount.toLocaleString('en-IN');
    // Polished wording for the heading
    goalFundHeading.textContent = `Goal of ₹ ${formattedTarget}: Monthly RD Contribution`;
    
    const annualRatePercentage = 12.12;
    let tableHTML = `
        <table class="maturity-table">
            <thead>
                <tr>
                    <th>Period (Years)</th>
                    <th>Monthly Deposit</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let years = 1; years <= 5; years++) {
        const formulaValue = calculateFormulaComponent(years, annualRatePercentage);

        let requiredDeposit = 0;
        if (formulaValue > 0) {
            requiredDeposit = targetAmount / formulaValue;
        }

        const roundedDeposit = Math.ceil(requiredDeposit);

        tableHTML += `
            <tr>
                <td>${years} Year${years > 1 ? 's' : ''}</td>
                <td>₹ ${roundedDeposit.toLocaleString('en-IN')}</td>
            </tr>
        `;
    }

    tableHTML += `
            </tbody>
        </table>
    `;

    resultsContainer.innerHTML = tableHTML;
}

// ----------------------------------------------------------------------
// 3. Clear Function and Event Listeners
// ----------------------------------------------------------------------
function clearResults() {
    document.getElementById('monthlyDeposit').value = '';
    document.getElementById('targetAmount').value = '';
    document.getElementById('maturityResultsTableContainer').innerHTML = '';
    document.getElementById('depositResultsTableContainer').innerHTML = '';
    // Target the specific ID for the heading
    document.getElementById('goalFundHeading').textContent = 'Required Monthly Deposit (1 to 5 Years)';
    document.getElementById('clearButton').style.display = 'none';
}


// Attach the functions to the input event of the respective fields
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('monthlyDeposit').addEventListener('input', calculateAndDisplayMaturity);
    document.getElementById('targetAmount').addEventListener('input', calculateAndDisplayRequiredDeposit);
    document.getElementById('clearButton').addEventListener('click', clearResults);
    
    // Initial cleanup of the page on load
    clearResults(); 
});
