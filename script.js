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
    document.getElementById('downloadButton').style.display = principalAmount >= 1000 ? 'flex' : 'none';

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
    document.getElementById('downloadButton').style.display = targetAmount >= 1000 ? 'flex' : 'none';

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
    document.getElementById('downloadButton').style.display = 'none';
}


document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('monthlyDeposit').addEventListener('input', calculateAndDisplayMaturity);
    document.getElementById('targetAmount').addEventListener('input', calculateAndDisplayRequiredDeposit);
    document.getElementById('clearButton').addEventListener('click', clearResults);
    document.getElementById('downloadButton').addEventListener('click', downloadPresentation);
    
    clearResults(); 
});

// ----------------------------------------------------------------------
// 4. Download Presentation (Canvas-generated image, customer-facing)
// ----------------------------------------------------------------------

// Brand colors sampled from the Sangeeth Nidhi Limited logo
const BRAND_TEAL = '#01897F';
const BRAND_TEAL_DARK = '#015850';
const BRAND_LIME = '#95CB1F';
const BRAND_LIME_TEXT = '#5C8A16'; // darker shade of the lime for legible text on white

let brandLogoImg = null;
function getBrandLogo() {
    return new Promise((resolve) => {
        if (brandLogoImg) { resolve(brandLogoImg); return; }
        const img = new Image();
        img.onload = () => { brandLogoImg = img; resolve(img); };
        img.onerror = () => resolve(null);
        img.src = 'snl.jpg';
    });
}

function buildRdRows() {
    const rows = [];
    for (let years = 1; years <= 5; years++) {
        let annualRatePercentage;
        if (years === 1) annualRatePercentage = 10;
        else if (years === 2) annualRatePercentage = 11;
        else annualRatePercentage = 12;
        rows.push({ years, annualRatePercentage, formulaValue: calculateSimpleAnnuityFormula(years, annualRatePercentage) });
    }
    return rows;
}

function drawRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}

async function downloadPresentation() {
    const monthlyDepositInput = document.getElementById('monthlyDeposit');
    const targetAmountInput = document.getElementById('targetAmount');

    const principalAmount = parseFloat(monthlyDepositInput.value);
    const targetAmount = parseFloat(targetAmountInput.value);

    let mode, headlineLabel, headlineValue, colLastHeader, dataRows;

    if (!isNaN(principalAmount) && principalAmount >= 1000) {
        mode = 'maturity';
        headlineLabel = 'MONTHLY RD DEPOSIT';
        headlineValue = '\u20B9 ' + Math.round(principalAmount).toLocaleString('en-IN');
        colLastHeader = 'Maturity Amount';
        dataRows = buildRdRows().map(r => ({
            years: r.years,
            rate: r.annualRatePercentage,
            value: Math.round(principalAmount * r.formulaValue)
        }));
    } else if (!isNaN(targetAmount) && targetAmount >= 1000) {
        mode = 'deposit';
        headlineLabel = 'TARGET MATURITY GOAL';
        headlineValue = '\u20B9 ' + Math.round(targetAmount).toLocaleString('en-IN');
        colLastHeader = 'Monthly Deposit';
        dataRows = buildRdRows().map(r => ({
            years: r.years,
            rate: r.annualRatePercentage,
            value: Math.ceil(targetAmount / r.formulaValue)
        }));
    } else {
        return; // nothing valid to render
    }

    const logo = await getBrandLogo();

    const scale = 2;
    const W = 1080, H = 1400;
    const canvas = document.createElement('canvas');
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#eef2f6');
    bgGrad.addColorStop(1, '#f8f9fa');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Header band
    const headerH = 240;
    const headerGrad = ctx.createLinearGradient(0, 0, W, headerH);
    headerGrad.addColorStop(0, BRAND_TEAL_DARK);
    headerGrad.addColorStop(1, BRAND_TEAL);
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, W, headerH);

    // Lime accent strip under header
    ctx.fillStyle = BRAND_LIME;
    ctx.fillRect(0, headerH - 6, W, 6);

    // Logo (top-left, circular)
    const logoSize = 76;
    const logoX = 55, logoY = 50;
    if (logo) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        ctx.restore();
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 26px Arial';
    ctx.fillText('SANGEETH NIDHI LIMITED', logoX + logoSize + 20, logoY + 32);
    ctx.font = '600 17px Arial';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText('A Secure Way to Grow Your Savings', logoX + logoSize + 20, logoY + 58);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px Arial';
    ctx.fillText('RECURRING DEPOSIT PLAN', W / 2, headerH - 40);

    // White card
    const cardX = 50, cardY = headerH + 40, cardW = W - 100, cardH = H - (headerH + 40) - 90;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#ffffff';
    drawRoundRect(ctx, cardX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.restore();

    // Headline amount block
    ctx.fillStyle = '#495057';
    ctx.font = '800 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(headlineLabel, W / 2, cardY + 60);

    ctx.fillStyle = BRAND_TEAL_DARK;
    ctx.font = '900 60px Arial';
    ctx.fillText(headlineValue, W / 2, cardY + 125);

    // Divider
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 40, cardY + 155);
    ctx.lineTo(cardX + cardW - 40, cardY + 155);
    ctx.stroke();

    // Table
    const tableX = cardX + 40, tableW = cardW - 80;
    let tableY = cardY + 195;
    const rowH = 90;
    const col1W = tableW * 0.32, col2W = tableW * 0.24;

    // Table header
    ctx.fillStyle = '#e3f2ee';
    drawRoundRect(ctx, tableX, tableY, tableW, 60, 10);
    ctx.fill();

    ctx.fillStyle = BRAND_TEAL_DARK;
    ctx.font = '800 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('PERIOD', tableX + 25, tableY + 37);
    ctx.textAlign = 'center';
    ctx.fillText('RATE', tableX + col1W + col2W / 2, tableY + 37);
    ctx.textAlign = 'right';
    ctx.fillText(colLastHeader.toUpperCase(), tableX + tableW - 25, tableY + 37);

    tableY += 60;

    dataRows.forEach((row, idx) => {
        const y = tableY + idx * rowH;
        const isBest = idx === dataRows.length - 1;

        ctx.fillStyle = isBest ? '#f4f9ea' : (idx % 2 === 0 ? '#ffffff' : '#fafcfb');
        ctx.fillRect(tableX, y, tableW, rowH);
        if (isBest) {
            ctx.strokeStyle = BRAND_LIME;
            ctx.lineWidth = 2;
            ctx.strokeRect(tableX + 1, y + 1, tableW - 2, rowH - 2);
        }

        ctx.fillStyle = '#212529';
        ctx.font = '800 22px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(row.years + (row.years > 1 ? ' Years' : ' Year'), tableX + 25, y + rowH / 2 + 8);

        ctx.fillStyle = '#495057';
        ctx.font = '700 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(row.rate + '%', tableX + col1W + col2W / 2, y + rowH / 2 + 7);

        ctx.fillStyle = BRAND_LIME_TEXT;
        ctx.font = '900 26px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('\u20B9 ' + row.value.toLocaleString('en-IN'), tableX + tableW - 25, y + rowH / 2 + 9);

        if (isBest) {
            const badgeText = 'BEST RETURNS';
            ctx.font = '800 13px Arial';
            const badgeW = ctx.measureText(badgeText).width + 24;
            const badgeX = tableX + 25, badgeY = y + rowH - 32, badgeH = 22;
            ctx.fillStyle = BRAND_LIME;
            drawRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 11);
            ctx.fill();
            ctx.fillStyle = BRAND_TEAL_DARK;
            ctx.textAlign = 'left';
            ctx.fillText(badgeText, badgeX + 12, badgeY + 15);
        }

        // row divider
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tableX, y + rowH);
        ctx.lineTo(tableX + tableW, y + rowH);
        ctx.stroke();
    });

    const afterTableY = tableY + dataRows.length * rowH + 45;

    ctx.fillStyle = '#868e96';
    ctx.font = 'italic 600 15px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Indicative values based on current RD interest rates. Terms & conditions apply.', W / 2, afterTableY);

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    ctx.fillStyle = '#adb5bd';
    ctx.font = '600 14px Arial';
    ctx.fillText('Generated on ' + dateStr, W / 2, afterTableY + 26);

    // Footer band
    const footerY = H - 90;
    const footerGrad = ctx.createLinearGradient(0, footerY, W, H);
    footerGrad.addColorStop(0, BRAND_TEAL_DARK);
    footerGrad.addColorStop(1, BRAND_TEAL);
    ctx.fillStyle = footerGrad;
    ctx.fillRect(0, footerY, W, 90);
    ctx.fillStyle = BRAND_LIME;
    ctx.fillRect(0, footerY, W, 4);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Visit your nearest branch to start this RD today!', W / 2, footerY + 52);

    // Trigger download
    const filenameAmount = mode === 'maturity' ? Math.round(principalAmount) : Math.round(targetAmount);
    const filename = 'RD_Plan_' + filenameAmount + '.png';

    canvas.toBlob(function (blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, 'image/png');
}
