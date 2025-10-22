// Shoe Size Conversion Data
const shoeSizeData = {
    // Men's sizes (US, EU, UK, CM)
    men: [
        { US: 6, EU: 38.5, UK: 5.5, CM: 24.1 },
        { US: 6.5, EU: 39, UK: 6, CM: 24.4 },
        { US: 7, EU: 40, UK: 6.5, CM: 24.8 },
        { US: 7.5, EU: 40.5, UK: 7, CM: 25.2 },
        { US: 8, EU: 41, UK: 7.5, CM: 25.5 },
        { US: 8.5, EU: 42, UK: 8, CM: 25.9 },
        { US: 9, EU: 42.5, UK: 8.5, CM: 26.2 },
        { US: 9.5, EU: 43, UK: 9, CM: 26.6 },
        { US: 10, EU: 44, UK: 9.5, CM: 27 },
        { US: 10.5, EU: 44.5, UK: 10, CM: 27.3 },
        { US: 11, EU: 45, UK: 10.5, CM: 27.7 },
        { US: 11.5, EU: 45.5, UK: 11, CM: 28.1 },
        { US: 12, EU: 46, UK: 11.5, CM: 28.4 },
        { US: 13, EU: 47, UK: 12.5, CM: 29.2 }
    ],
    
    // Women's sizes (US, EU, UK, CM)
    women: [
        { US: 5, EU: 35, UK: 2.5, CM: 21.6 },
        { US: 5.5, EU: 35.5, UK: 3, CM: 22 },
        { US: 6, EU: 36, UK: 3.5, CM: 22.4 },
        { US: 6.5, EU: 37, UK: 4, CM: 22.8 },
        { US: 7, EU: 37.5, UK: 4.5, CM: 23.2 },
        { US: 7.5, EU: 38, UK: 5, CM: 23.6 },
        { US: 8, EU: 38.5, UK: 5.5, CM: 24 },
        { US: 8.5, EU: 39, UK: 6, CM: 24.4 },
        { US: 9, EU: 40, UK: 6.5, CM: 24.8 },
        { US: 9.5, EU: 40.5, UK: 7, CM: 25.2 },
        { US: 10, EU: 41, UK: 7.5, CM: 25.6 },
        { US: 10.5, EU: 42, UK: 8, CM: 26 },
        { US: 11, EU: 42.5, UK: 8.5, CM: 26.4 }
    ],
    
    // Kids' sizes (US, EU, UK, CM, Age)
    kids: [
        { US: 1, EU: 16, UK: 0, CM: 8.9, Age: "0-3m" },
        { US: 2, EU: 17, UK: 1, CM: 9.5, Age: "3-6m" },
        { US: 3, EU: 18, UK: 2, CM: 10.2, Age: "6-9m" },
        { US: 4, EU: 19, UK: 3, CM: 10.8, Age: "9-12m" },
        { US: 5, EU: 20, UK: 4, CM: 11.4, Age: "12-18m" },
        { US: 6, EU: 22, UK: 5, CM: 12.1, Age: "18-24m" },
        { US: 7, EU: 23, UK: 6, CM: 12.7, Age: "2 years" },
        { US: 8, EU: 24, UK: 7, CM: 13.3, Age: "2-3 years" },
        { US: 9, EU: 25, UK: 8, CM: 14, Age: "3 years" },
        { US: 10, EU: 27, UK: 9, CM: 14.6, Age: "3-4 years" },
        { US: 11, EU: 28, UK: 10, CM: 15.2, Age: "4 years" },
        { US: 12, EU: 29, UK: 11, CM: 15.9, Age: "4-5 years" },
        { US: 13, EU: 30, UK: 12, CM: 16.5, Age: "5-6 years" }
    ]
};

// Initialize charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    populateCharts();
    
    // Real-time conversion as user types
    const sizeInput = document.getElementById('shoeSize');
    if (sizeInput) {
        sizeInput.addEventListener('input', utils.debounce(function() {
            if (sizeInput.value && sizeInput.value >= 1) {
                convertShoeSize();
            }
        }, 500));
    }
});

// Populate conversion charts
function populateCharts() {
    populateChart('mensChartBody', shoeSizeData.men, ['US', 'EU', 'UK', 'CM']);
    populateChart('womensChartBody', shoeSizeData.women, ['US', 'EU', 'UK', 'CM']);
    populateChart('kidsChartBody', shoeSizeData.kids, ['US', 'EU', 'UK', 'CM', 'Age']);
}

function populateChart(elementId, data, columns) {
    const tbody = document.getElementById(elementId);
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    data.forEach(row => {
        const tr = document.createElement('tr');
        
        columns.forEach(col => {
            const td = document.createElement('td');
            td.textContent = row[col];
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
}

// Main conversion function
function convertShoeSize() {
    const size = parseFloat(document.getElementById('shoeSize').value);
    const fromSystem = document.getElementById('fromSystem').value;
    const toSystem = document.getElementById('toSystem').value;
    
    if (!size || size < 1) {
        utils.showNotification('Please enter a valid shoe size', 'error');
        return;
    }
    
    // Track conversion for analytics
    window.trackConversion('shoe-size', fromSystem, toSystem);
    
    // Determine gender based on selected systems
    const gender = fromSystem === 'US_W' || toSystem === 'US_W' ? 'women' : 'men';
    const sizeData = shoeSizeData[gender];
    
    // Find closest match in the data
    const convertedSizes = findConvertedSizes(size, fromSystem, sizeData);
    
    if (convertedSizes) {
        displayResults(convertedSizes, toSystem);
    } else {
        utils.showNotification('Size not found in conversion table. Try a different size.', 'error');
    }
}

function findConvertedSizes(inputSize, fromSystem, sizeData) {
    // Handle US Women to US Men conversion
    if (fromSystem === 'US_W') {
        const menSizeData = shoeSizeData.men.find(item => {
            const womenEquivalent = item.US + 1.5; // Approximate conversion
            return Math.abs(womenEquivalent - inputSize) < 0.3;
        });
        if (menSizeData) return menSizeData;
    }
    
    // Handle CM conversion (more flexible matching)
    if (fromSystem === 'CM') {
        return sizeData.reduce((closest, current) => {
            const currentDiff = Math.abs(current.CM - inputSize);
            const closestDiff = Math.abs(closest.CM - inputSize);
            return currentDiff < closestDiff ? current : closest;
        });
    }
    
    // Standard conversion for other systems
    return sizeData.find(item => {
        const referenceSize = item[getSystemKey(fromSystem)];
        return referenceSize && Math.abs(referenceSize - inputSize) < 0.3;
    });
}

function getSystemKey(system) {
    const systemMap = {
        'US': 'US',
        'US_W': 'US',
        'EU': 'EU',
        'UK': 'UK',
        'CM': 'CM'
    };
    return systemMap[system] || system;
}

function displayResults(convertedSizes, targetSystem) {
    const resultsGrid = document.getElementById('resultsGrid');
    const resultsSection = document.getElementById('resultsSection');
    
    if (!resultsGrid || !resultsSection) return;
    
    resultsGrid.innerHTML = '';
    
    // Display all size systems for reference
    const systems = [
        { key: 'US', label: 'US Men', emoji: '🇺🇸' },
        { key: 'EU', label: 'EU', emoji: '🇪🇺' },
        { key: 'UK', label: 'UK', emoji: '🇬🇧' },
        { key: 'CM', label: 'CM', emoji: '📏' }
    ];
    
    systems.forEach(system => {
        const value = convertedSizes[system.key];
        if (value !== undefined) {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            
            const isTarget = system.key === getSystemKey(targetSystem);
            if (isTarget) {
                resultItem.style.borderLeftColor = 'var(--secondary)';
                resultItem.style.background = 'var(--light)';
            }
            
            resultItem.innerHTML = `
                <div class="result-value">${value}</div>
                <div class="result-label">${system.emoji} ${system.label} ${isTarget ? '🎯' : ''}</div>
            `;
            
            resultsGrid.appendChild(resultItem);
        }
    });
    
    // Show women's equivalent if relevant
    if (targetSystem === 'US_W' || targetSystem === 'US') {
        const womenSize = findWomensEquivalent(convertedSizes.US, targetSystem === 'US_W');
        if (womenSize) {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.style.borderLeftColor = 'var(--accent)';
            
            resultItem.innerHTML = `
                <div class="result-value">${womenSize}</div>
                <div class="result-label">👩 US Women ${targetSystem === 'US_W' ? '🎯' : ''}</div>
            `;
            
            resultsGrid.appendChild(resultItem);
        }
    }
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function findWomensEquivalent(mensSize, toWomens = true) {
    const conversion = toWomens ? mensSize + 1.5 : mensSize - 1.5;
    return Math.round(conversion * 2) / 2; // Round to nearest 0.5
}

// Quick conversion functions
function quickConvert(from, to) {
    document.getElementById('fromSystem').value = from;
    document.getElementById('toSystem').value = to;
    
    const sizeInput = document.getElementById('shoeSize');
    if (sizeInput.value) {
        convertShoeSize();
    } else {
        utils.showNotification('Please enter a size first', 'info');
        sizeInput.focus();
    }
}

// Chart tab functionality
function openChartTab(tabName) {
    // Hide all chart contents
    document.querySelectorAll('.chart-pane').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.chart-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show the specific tab content
    document.getElementById(tabName + 'Chart').classList.add('active');
    
    // Add active class to the clicked tab
    event.currentTarget.classList.add('active');
}
