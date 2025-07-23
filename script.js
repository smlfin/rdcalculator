function calculateAndDisplayMaturity() {
    const principalAmount = parseFloat(document.getElementById('amount').value);
    const resultsContainer = document.getElementById('maturityResultsTableContainer');

    // Check for valid inputs, ensuring amount is greater than 1000
    if (isNaN(principalAmount) || principalAmount < 1000) {
        resultsContainer.innerHTML = '<p class="placeholder-text">Please enter a monthly deposit amount (₹1000 or more) to see maturity details.</p>';
        return;
    }

    const annualRatePercentage = 12.12; // I3 from your formula

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

    // Loop from 1 to 5 years
    for (let years = 1; years <= 5; years++) {
        // Calculate r = (I3 / 400)
        const r = annualRatePercentage / 400;

        // Calculate H3 = (B3 * 12) / 3
        const n_quarters = (years * 12) / 3;

        // Implement the main maturity formula: A3 * (((1 + r)^H3 - 1) / (1 - ((1 + r)^(-1/3))))
        const numerator = Math.pow((1 + r), n_quarters) - 1;
        const denominator = 1 - Math.pow((1 + r), -1/3);

        let maturityAmount = 0;
        if (denominator !== 0) { // Avoid division by zero
            maturityAmount = principalAmount * (numerator / denominator);
        }

        // Round to the nearest whole number (avoid decimals)
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

// Attach the function to the input event of the amount field
document.addEventListener('DOMContentLoaded', () => {
    // No initial call here, as we want the placeholder to show first
    document.getElementById('amount').addEventListener('input', calculateAndDisplayMaturity);
});