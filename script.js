// Function to calculate the core formula component (part of the maturity formula)
function calculateSimpleAnnuityFormula(years, annualRatePercentage) {
    const monthlyRateDecimal = annualRatePercentage / 100 / 12;
    const n_installments = years * 12;
    
    const r = monthlyRateDecimal;
    const n = n_installments;
    
    const numerator = Math.pow((1 + r), n) - 1;
    const denominator = 1 - Math.pow((1 + r), -1);
    
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
    
    targetInput.value = '';
    document.getElementById('depositResultsTableContainer').innerHTML = '';
    document.getElementById('goalFundHeading').textContent = 'Required Monthly Deposit (1 to 5 Years)';
    
    document.getElementById('clearButton').style.display = principalAmount >= 1000 ? 'block' : 'none';

    if (isNaN(principalAmount) || principalAmount < 1000) {
        resultsContainer.innerHTML = '';
        return;
    }

    let tableHTML = `
        <table class="maturity-table">
            <thead>
                <tr>
                    <th>Period (Years)</th>
                    <th>Rate</th>
                    <th>Maturity Amount</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let years = 1; years <= 5; years++) {
        // 1 Year: 10%, 2 Years: 11%, 3-5 Years: 12%
        let annualRatePercentage;
        if (years === 1) annualRatePercentage = 10;
        else if (years === 2) annualRatePercentage = 11;
        else annualRatePercentage = 12;

        const formulaValue = calculateSimpleAnnuityFormula(years, annualRatePercentage);
        const maturityAmount = principalAmount * formulaValue;
        const roundedMaturity = Math.round(maturityAmount);

        tableHTML += `
            <tr>
                <td>${years} Year${years > 1 ? 's' : ''}</td>
                <td>${annualRatePercentage}%</td>
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
// 2. Calculate Required Monthly Deposit
// ----------------------------------------------------------------------
function calculateAndDisplayRequiredDeposit() {
    const targetAmountInput = document.getElementById('targetAmount');
    const targetAmount = parseFloat(targetAmountInput.value);
    const resultsContainer = document.getElementById('depositResultsTableContainer');
    const monthlyInput = document.getElementById('monthlyDeposit');
    const goalFundHeading = document.getElementById('goalFundHeading');

    monthlyInput.value = '';
    document.getElementById('maturityResultsTableContainer').innerHTML = '';

    document.getElementById('clearButton').style.display = targetAmount >= 1000 ? 'block' : 'none';

    if (isNaN(targetAmount) || targetAmount < 1000) {
        resultsContainer.innerHTML = '';
        goalFundHeading.textContent = 'Required Monthly Deposit (1 to 5 Years)';
        return;
    }

    const formattedTarget = targetAmount.toLocaleString('en-IN');
    goalFundHeading.textContent = `Goal of ₹ ${formattedTarget}: Monthly RD Contribution`;
    
    let tableHTML = `
        <table class="maturity-table">
            <thead>
                <tr>
                    <th>Period (Years)</th>
                    <th>Rate</th>
                    <th>Monthly Deposit</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let years = 1; years <= 5; years++) {
        // 1 Year: 10%, 2 Years: 11%, 3-5 Years: 12%
        let annualRatePercentage;
        if (years === 1) annualRatePercentage = 10;
        else if (years === 2) annualRatePercentage = 11;
        else annualRatePercentage = 12;

        const formulaValue = calculateSimpleAnnuityFormula(years, annualRatePercentage);

        let requiredDeposit = 0;
        if (formulaValue > 0) {
            requiredDeposit = targetAmount / formulaValue;
        }

        const roundedDeposit = Math.ceil(requiredDeposit);

        tableHTML += `
            <tr>
                <td>${years} Year${years > 1 ? 's' : ''}</td>
                <td>${annualRatePercentage}%</td>
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
    document.getElementById('goalFundHeading').textContent = 'Required Monthly Deposit (1 to 5 Years)';
    document.getElementById('clearButton').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('monthlyDeposit').addEventListener('input', calculateAndDisplayMaturity);
    document.getElementById('targetAmount').addEventListener('input', calculateAndDisplayRequiredDeposit);
    document.getElementById('clearButton').addEventListener('click', clearResults);
    
    clearResults(); 
});
