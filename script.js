// Function to calculate the core formula component (part of the maturity formula)
// This implements the user's requested formula: ( (1+r)^n - 1 ) / ( 1 - (1+r)^-1 )
// Where r = Int. Per / 100 / 12 (effective monthly rate) and n = No. of Installments (Months)
function calculateSimpleAnnuityFormula(years, annualRatePercentage) {
    // Int. Per / 100 / 12 (Monthly Rate)
    // The user's formula implies the exponent 'n' is the number of installments (months).
    const monthlyRateDecimal = annualRatePercentage / 100 / 12; // r in the user's formula: (Int. Per / 100 * 12) -> should be Int. Per / 100 / 12 for monthly deposits
    const n_installments = years * 12; // No. of Installments (Months)

    // The user's formula, which simplifies to the Future Value of an Ordinary Annuity factor:
    // inst_amt * [ ( (1+r)^n - 1 ) / ( 1 - (1+r)^-1 ) ]
    // The denominator: 1 - (1+r)^-1 simplifies to r / (1+r)
    // So the factor is: ( (1+r)^n - 1 ) * (1+r) / r
    
    // We calculate the Factor: ( (1+r)^n - 1 ) / ( 1 - (1+r)^-1 )
    const r = monthlyRateDecimal;
    const n = n_installments;
    
    // Core Annuity Factor:
    const numerator = Math.pow((1 + r), n) - 1;
    const denominator = 1 - Math.pow((1 + r), -1);
    
    if (denominator === 0) {
        return 0;
    }

    // The user's formula has an *additional* implicit multiplication by (1+r)
    // that turns the Future Value of an Ordinary Annuity into the Future Value of an Annuity Due
    // or simply compensates for the factor structure.
    // Annuity Due Factor: [ ( (1+r)^n - 1 ) / r ] * (1+r)
    // Let's stick strictly to the formula structure provided by the user:
    // ( (1+r)^n - 1 ) / ( 1 - (1+r)^-1 )
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
        // *** TIERED RATE LOGIC IMPLEMENTED HERE ***
        // 10% for < 3 years, 12% for >= 3 years
        const annualRatePercentage = years < 3 ? 10 : 10.00;

        // *** CHANGE: Using the user's requested formula implementation ***
        const formulaValue = calculateSimpleAnnuityFormula(years, annualRatePercentage);
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
        // *** TIERED RATE LOGIC IMPLEMENTED HERE ***
        // 10% for < 3 years, 12% for >= 3 years
        const annualRatePercentage = years < 3 ? 10 : 10.00;

        // *** CHANGE: Using the user's requested formula implementation ***
        const formulaValue = calculateSimpleAnnuityFormula(years, annualRatePercentage);

        let requiredDeposit = 0;
        if (formulaValue > 0) {
            // Deposit = Target Amount / Formula Value
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
