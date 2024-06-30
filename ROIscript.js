function toggleInput(inputId) {
    const input = document.getElementById(inputId);
    input.disabled = !input.disabled;
}

function toggleOutsourcing() {
    const outsourcingFields = document.getElementById('outsourcingFields');
    const outsourcingToggle = document.getElementById('outsourcingToggle');

    if (outsourcingToggle.checked) {
        outsourcingFields.style.display = 'block';
    } else {
        outsourcingFields.style.display = 'none';
    }
}

function isValidNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateROI() {
    const numDevelopers = document.getElementById('numDevelopers').value;
    const avgSalary = document.getElementById('avgSalary').value;
    const recruitmentCostPct = document.getElementById('recruitmentCostPct').value;
    const hrCost = document.getElementById('hrCost').value;
    const technicalDebtPct = document.getElementById('technicalDebtPct').value;
    const discountRate = document.getElementById('discountRate').value;
    const lifespan = document.getElementById('lifespan').value;

    if (!isValidNumber(numDevelopers) || !isValidNumber(avgSalary) || !isValidNumber(recruitmentCostPct) ||
        !isValidNumber(hrCost) || !isValidNumber(technicalDebtPct) || !isValidNumber(discountRate) ||
        !isValidNumber(lifespan)) {
        alert('Please enter valid numeric values for all fields.');
        return;
    }

    const codeChurnReduction = document.getElementById('codeChurnReductionToggle').checked
        ? document.getElementById('codeChurnReduction').value
        : 0;

    const productivityImprovement = document.getElementById('productivityImprovementToggle').checked
        ? document.getElementById('productivityImprovement').value
        : 0;

    const outsourcingPct = document.getElementById('outsourcingToggle').checked
        ? document.getElementById('outsourcingPct').value
        : 0;

    const outsourcingCostReduction = document.getElementById('outsourcingToggle').checked
        ? document.getElementById('outsourcingCostReduction').value
        : 0;

    if ((document.getElementById('codeChurnReductionToggle').checked && !isValidNumber(codeChurnReduction)) ||
        (document.getElementById('productivityImprovementToggle').checked && !isValidNumber(productivityImprovement)) ||
        (document.getElementById('outsourcingToggle').checked && (!isValidNumber(outsourcingPct) || !isValidNumber(outsourcingCostReduction)))) {
        alert('Please enter valid numeric values for enabled fields.');
        return;
    }

    // Perform calculations
    const totalCost = parseFloat(numDevelopers) * (parseFloat(avgSalary) + (parseFloat(avgSalary) * parseFloat(recruitmentCostPct) / 100) + parseFloat(hrCost));
    const codeChurnSavings = totalCost * (parseFloat(codeChurnReduction) / 100);
    const technicalDebtSavings = totalCost * (parseFloat(technicalDebtPct) / 100);
    const productivityGains = totalCost * (parseFloat(productivityImprovement) / 100);
    const outsourcingSavings = totalCost * (parseFloat(outsourcingPct) / 100) * (parseFloat(outsourcingCostReduction) / 100);
    const totalSavingsGains = codeChurnSavings + technicalDebtSavings + productivityGains + outsourcingSavings;

    const roi = (totalSavingsGains / totalCost) * 100;
    const roiRatio = totalSavingsGains / totalCost;
    const paybackPeriod = (totalCost / totalSavingsGains) * 12; // Convert to months

    // Calculate Net Present Value (NPV)
    const npv = calculateNPV(totalSavingsGains, parseFloat(discountRate), parseFloat(lifespan));

    // Display results
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
    <p><strong>Total Cost:</strong> $${addCommas(totalCost.toFixed(2))}</p>
    <p><strong>Code Churn Savings:</strong> $${addCommas(codeChurnSavings.toFixed(2))}</p>
    <p><strong>Technical Debt Savings:</strong> $${addCommas(technicalDebtSavings.toFixed(2))}</p>
    <p><strong>Productivity Gains:</strong> $${addCommas(productivityGains.toFixed(2))}</p>
    <p><strong>Outsourcing Savings:</strong> $${addCommas(outsourcingSavings.toFixed(2))}</p>
    <p><strong>Total Savings and Gains:</strong> $${addCommas(totalSavingsGains.toFixed(2))}</p>
    <p><strong>ROI:</strong> ${roi.toFixed(2)}%</p>
    <p><strong>ROI Ratio:</strong> ${roiRatio.toFixed(2)}</p>
    <p><strong>Payback Period:</strong> ${paybackPeriod.toFixed(2)} months</p>
    <p><strong>Net Present Value (NPV):</strong> $${addCommas(npv.toFixed(2))}</p>
  `;
}

function calculateNPV(savingsGains, discountRate, lifespan) {
    let npv = 0;
    for (let i = 1; i <= lifespan; i++) {
        npv += savingsGains / Math.pow(1 + discountRate / 100, i);
    }
    return npv;
}