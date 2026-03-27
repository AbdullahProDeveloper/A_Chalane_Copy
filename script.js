// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDt6mWwcbyw01jRXi837O0Jnn3rIYLp6PQ",
    authDomain: "abdullah-marketine.firebaseapp.com",
    databaseURL: "https://abdullah-marketine-default-rtdb.firebaseio.com/",
    projectId: "abdullah-marketine",
    storageBucket: "abdullah-marketine.firebasestorage.app",
    messagingSenderId: "798532908784",
    appId: "1:798532908784:web:3746f02fc64f48df06b435"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM Elements
const addProductBtn = document.getElementById('addProduct');
const productListDiv = document.getElementById('productList');
const grandTotalEl = document.getElementById('grandTotal');
const saveInvoiceBtn = document.getElementById('saveInvoice');
const invoiceListDiv = document.getElementById('invoiceList');
const invoiceNoEl = document.getElementById('invoiceNo');
const discountEl = document.getElementById('discount');
const taxEl = document.getElementById('tax');
const remarkEl = document.getElementById('remark');
const customerMobile = document.getElementById('customerMobile');
const customerAddress = document.getElementById('customerAddress');
const customerName = document.getElementById('customerName');
const shopNameInput = document.getElementById('shopName');
const paymentStatus = document.getElementById('paymentStatus');
const paymentMethod = document.getElementById('paymentMethod');

let invoiceCounter = 1;

// Load invoice counter from Firebase
db.ref('invoiceCounter').once('value', snap => {
    if (snap.exists()) invoiceCounter = snap.val() + 1;
    invoiceNoEl.value = 'INV-' + String(invoiceCounter).padStart(5, '0');
});

// Attach calculation events to product row
function attachCalculationEvents(row) {
    const qtyInput = row.querySelector('.productQty');
    const priceInput = row.querySelector('.productPrice');
    const totalInput = row.querySelector('.productTotal');
    
    const calculate = () => {
        let qty = parseFloat(qtyInput.value) || 0;
        let price = parseFloat(priceInput.value) || 0;
        totalInput.value = (qty * price).toFixed(2);
        calculateGrandTotal();
    };
    
    qtyInput.addEventListener('input', calculate);
    priceInput.addEventListener('input', calculate);
}

// Calculate grand total with discount and tax
function calculateGrandTotal() {
    let subtotal = 0;
    document.querySelectorAll('.productTotal').forEach(t => {
        subtotal += parseFloat(t.value) || 0;
    });
    
    let discount = parseFloat(discountEl.value) || 0;
    let taxPercent = parseFloat(taxEl.value) || 0;
    let afterDiscount = subtotal - discount;
    let totalWithTax = afterDiscount + (afterDiscount * taxPercent / 100);
    
    grandTotalEl.innerText = totalWithTax.toFixed(2);
    return totalWithTax;
}

// Attach remove product listeners
function attachRemoveListeners() {
    document.querySelectorAll('.removeProduct').forEach(btn => {
        btn.onclick = () => {
            if (document.querySelectorAll('.product-row').length > 1) {
                btn.closest('.product-row').remove();
                calculateGrandTotal();
            } else {
                alert("কমপক্ষে একটি পণ্য রাখতে হবে!");
            }
        };
    });
}

// Add new product row
addProductBtn.addEventListener('click', () => {
    const prototype = document.querySelector('.product-row');
    const newRow = prototype.cloneNode(true);
    newRow.querySelectorAll('input').forEach(inp => inp.value = '');
    productListDiv.appendChild(newRow);
    attachCalculationEvents(newRow);
    attachRemoveListeners();
});

// Initialize all product rows
function initProductRows() {
    document.querySelectorAll('.product-row').forEach(row => attachCalculationEvents(row));
    attachRemoveListeners();
}

discountEl.addEventListener('input', calculateGrandTotal);
taxEl.addEventListener('input', calculateGrandTotal);
initProductRows();

// Escape HTML special characters
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : m === '>' ? '&gt;' : m);
}

// Show loader
function showLoader(message = "প্রস্তুত হচ্ছে...") {
    let loader = document.getElementById('globalLoader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.className = 'loader-overlay';
        loader.innerHTML = `<div class="loader-spinner"></div><div class="loader-text">${message}</div>`;
        document.body.appendChild(loader);
    } else {
        loader.style.display = 'flex';
        loader.querySelector('.loader-text').innerText = message;
    }
}

// Hide loader
function hideLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'none';
}

// Company Logo SVG
const companyLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="70" height="70">
    <circle cx="50" cy="50" r="45" fill="url(#grad)" stroke="#d4af37" stroke-width="2.5"/>
    <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e3c72"/><stop offset="100%" stop-color="#2a5298"/>
    </linearGradient></defs>
    <text x="50" y="67" text-anchor="middle" fill="#d4af37" font-size="32" font-weight="bold">A</text>
    <text x="50" y="85" text-anchor="middle" fill="#e2e8f0" font-size="9">ENTERPRISE</text>
</svg>`;

// Seal SVG
const sealSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="65" height="65">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#b87333" stroke-width="2.5"/>
    <circle cx="50" cy="50" r="38" fill="none" stroke="#b87333" stroke-width="1.5"/>
    <text x="50" y="58" text-anchor="middle" fill="#b87333" font-size="12" font-weight="bold">সিল</text>
    <text x="50" y="72" text-anchor="middle" fill="#b87333" font-size="8">ESTABLISHED</text>
</svg>`;

// Signature SVG
const signSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" width="85" height="60">
    <path d="M10,35 C25,25 35,30 45,32 C55,34 65,28 75,30 C85,32 95,38 105,36" stroke="#2c5f8a" fill="none" stroke-width="2.2"/>
    <path d="M15,45 L30,42 L45,44 L60,40 L75,42 L90,38 L105,40" stroke="#2c5f8a" fill="none" stroke-width="1.5"/>
    <text x="70" y="55" fill="#2c5f8a" font-size="9" font-style="italic">Authorized</text>
</svg>`;

// Generate Professional Invoice HTML for Print
function generatePrintInvoiceHTML(data) {
    const company = {
        name: "Abdullah Enterprise",
        phone: "01798383377",
        email: "shakea801@gmail.com",
        address: "ধনতলা, বেলগাছা - ২০২২, ইসলামপুর, জামালপুর",
        web: "www.abdullahelekte.com",
        tin: "TIN: 123456789012"
    };
    
    let subtotal = data.items.reduce((s, i) => s + i.total, 0);
    let afterDiscount = subtotal - data.discount;
    let taxAmount = afterDiscount * data.tax / 100;
    let finalTotal = afterDiscount + taxAmount;
    const printDate = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
    const qrId = 'qr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    
    const itemsHtml = data.items.map((item, idx) => `
        <tr>
            <td style="padding: 12px 10px; border: 1px solid #e2e8f0; text-align:center;">${idx + 1}</td>
            <td style="padding: 12px 10px; border: 1px solid #e2e8f0;">${escapeHtml(item.name)}</td>
            <td style="padding: 12px 10px; border: 1px solid #e2e8f0; text-align:center;">${item.qty}</td>
            <td style="padding: 12px 10px; border: 1px solid #e2e8f0; text-align:right;">${item.price.toFixed(2)}</td>
            <td style="padding: 12px 10px; border: 1px solid #e2e8f0; text-align:right; font-weight:600;">${item.total.toFixed(2)}</td>
        </tr>
    `).join('');
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>${data.shopName} - Invoice ${data.invoiceNo}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
            padding: 0.4in;
            background: white;
            font-size: 13px;
            line-height: 1.5;
        }
        @media print {
            body {
                padding: 0.3in;
                margin: 0;
            }
            @page {
                size: A4;
                margin: 0.3in;
            }
            .no-break {
                page-break-inside: avoid;
            }
        }
        .invoice-container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #d4af37;
            padding-bottom: 18px;
            margin-bottom: 20px;
        }
        .company-info h1 {
            color: #1e3c72;
            font-size: 28px;
            margin: 0;
        }
        .company-info p {
            color: #4a627a;
            font-size: 11px;
            margin-top: 5px;
        }
        .contact-row {
            display: flex;
            justify-content: space-between;
            background: #f8fafd;
            padding: 12px 18px;
            border-radius: 14px;
            margin-bottom: 20px;
            font-size: 11px;
            border: 1px solid #e9edf2;
            flex-wrap: wrap;
            gap: 8px;
        }
        .customer-section {
            background: #f9fbfd;
            padding: 18px 24px;
            border-radius: 20px;
            margin: 15px 0 20px;
            border: 1px solid #e9edf2;
        }
        .customer-flex {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 20px;
        }
        .customer-details {
            flex: 2;
        }
        .customer-details strong {
            color: #1e4a76;
            font-size: 14px;
            display: block;
            margin-bottom: 10px;
            border-left: 3px solid #d4af37;
            padding-left: 12px;
        }
        .shop-name {
            font-size: 18px;
            font-weight: 700;
            color: #0a2b3e;
            margin-bottom: 6px;
        }
        .invoice-badge {
            background: #1e4a76;
            padding: 12px 28px;
            border-radius: 60px;
            text-align: center;
        }
        .invoice-badge .inv-no {
            color: white;
            font-size: 18px;
            font-weight: 800;
        }
        .invoice-badge .inv-date {
            color: rgba(255,255,255,0.9);
            font-size: 10px;
            margin-top: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th {
            background: #eef2fa;
            padding: 12px 10px;
            border: 1px solid #e2e8f0;
            font-weight: 700;
        }
        td {
            padding: 10px 10px;
            border: 1px solid #e2e8f0;
        }
        .text-right {
            text-align: right;
        }
        .totals-table {
            width: 100%;
            max-width: 350px;
            margin-left: auto;
            margin-top: 15px;
            margin-bottom: 15px;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 10px 16px;
            border: 1px solid #e2e8f0;
        }
        .payment-status {
            display: flex;
            justify-content: space-between;
            background: #f1f5f9;
            padding: 12px 24px;
            border-radius: 50px;
            margin: 15px 0;
            font-size: 12px;
            flex-wrap: wrap;
            gap: 10px;
        }
        .remark-box {
            background: #fefce8;
            padding: 12px 18px;
            border-radius: 16px;
            margin-bottom: 18px;
            border-left: 4px solid #eab308;
        }
        .footer {
            margin-top: 25px;
        }
        .footer-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 2px solid #cbd5e1;
            padding-top: 22px;
            flex-wrap: wrap;
            gap: 20px;
        }
        .receiver-signature .sign-line {
            border-bottom: 1.5px solid #94a3b8;
            width: 160px;
            padding-bottom: 5px;
            margin-top: 5px;
        }
        .qr-code {
            text-align: center;
        }
        .stamp-area {
            text-align: right;
        }
        .stamp-group {
            display: flex;
            gap: 15px;
            justify-content: flex-end;
            margin-bottom: 8px;
        }
        .stamp-item {
            text-align: center;
        }
        .stamp-item img {
            width: 55px;
            height: auto;
        }
        .stamp-item small {
            font-size: 8px;
            display: block;
        }
        .footer-note {
            text-align: center;
            margin-top: 18px;
            font-size: 10px;
            color: #6c86a3;
            border-top: 1px solid #e9edf2;
            padding-top: 12px;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/qrious/dist/qrious.min.js"></script>
</head>
<body>
<div class="invoice-container">
    <div class="header">
        <div class="company-info">
            <h1>${company.name}</h1>
            <p>${company.address}</p>
        </div>
        <div>${companyLogo}</div>
    </div>
    <div class="contact-row">
        <div>📞 ${company.phone} (বিকাশ/নগদ) &nbsp;| ✉️ ${company.email}</div>
        <div>🌐 ${company.web} &nbsp;| ${company.tin}</div>
    </div>
    <div class="customer-section">
        <div class="customer-flex">
            <div class="customer-details">
                <strong>ক্রেতার তথ্য</strong>
                <div class="shop-name">${escapeHtml(data.shopName) || '——'}</div>
                <div>${escapeHtml(data.customerName) ? '👤 ' + escapeHtml(data.customerName) : ''} ${data.customerMobile ? '📞 ' + escapeHtml(data.customerMobile) : ''}</div>
                <div>📍 ${escapeHtml(data.customerAddress) || '——'}</div>
            </div>
            <div class="invoice-badge">
                <div class="inv-no">${data.invoiceNo}</div>
                <div class="inv-date">${data.date} | ${data.time.replace(/-/g, ':')}</div>
            </div>
        </div>
    </div>
    <table class="no-break">
        <thead>
            <tr>
                <th style="width:8%">ক্রম</th>
                <th style="width:52%">পণ্যের বিবরণ</th>
                <th style="width:12%">পরিমাণ</th>
                <th style="width:14%">দাম (৳)</th>
                <th style="width:14%">মোট (৳)</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHtml}
        </tbody>
    </table>
    <table class="totals-table no-break">
        <tr><td style="width:65%">সাব-টোটাল</td><td class="text-right">${subtotal.toFixed(2)} ৳</td></tr>
        ${data.discount > 0 ? `<tr><td style="color:#b91c1c;">ডিসকাউন্ট</td><td class="text-right" style="color:#b91c1c;">- ${data.discount} ৳</td></tr>` : ''}
        ${data.tax > 0 ? `<tr><td style="color:#1e4a76;">ভ্যাট / ট্যাক্স (${data.tax}%)</td><td class="text-right">+ ${taxAmount.toFixed(2)} ৳</td></tr>` : ''}
        <tr style="background:#eef2fa;"><td style="font-weight:800; font-size:18px;">মোট প্রদেয়</td><td class="text-right" style="font-weight:800; font-size:20px; color:#1e4a76;">${finalTotal.toFixed(2)} ৳</td></tr>
    </table>
    <div class="payment-status no-break">
        <span><strong>পরিশোধ অবস্থা:</strong> ${data.paymentStatus}</span>
        <span><strong>পেমেন্ট মাধ্যম:</strong> ${data.paymentMethod}</span>
    </div>
    ${data.remark ? `<div class="remark-box no-break"><strong>নোট:</strong> ${escapeHtml(data.remark)}</div>` : ''}
    <div class="footer no-break">
        <div class="footer-flex">
            <div class="receiver-signature">
                <strong>প্রাপকের স্বাক্ষর</strong>
                <div class="sign-line">____________________</div>
                <small>(রিসিভ করলো)</small>
            </div>
            <div class="qr-code">
                <canvas id="${qrId}" width="80" height="80"></canvas>
                <div><small>ভেরিফিকেশন কোড</small></div>
            </div>
            <div class="stamp-area">
                <div class="stamp-group">
                    <div class="stamp-item"><img src="data:image/svg+xml,${encodeURIComponent(sealSvg)}" alt="সিল"><small>সিল</small></div>
                    <div class="stamp-item"><img src="data:image/svg+xml,${encodeURIComponent(signSvg)}" alt="স্বাক্ষর"><small>স্বাক্ষর</small></div>
                </div>
                <small>তারিখ: ${printDate}</small>
            </div>
        </div>
        <div class="footer-note">${company.web} | হটলাইন: ${company.phone} | ধন্যবাদান্তে</div>
    </div>
</div>
<script>
    (function() {
        var canvas = document.getElementById('${qrId}');
        if(canvas) {
            var sub = ${subtotal};
            var disc = ${data.discount};
            var tax = ${data.tax};
            var after = sub - disc;
            var taxAmt = after * tax / 100;
            var total = after + taxAmt;
            var qrValue = '${data.shopName} | ${data.invoiceNo} | ${data.date} | Total: ' + total.toFixed(2) + ' BDT';
            new QRious({ element: canvas, size: 80, value: qrValue, foreground: "#1e4a76" });
        }
    })();
</script>
</body>
</html>`;
}

// Generate Professional PDF HTML with Auto Download
function generatePDFInvoiceHTML(data) {
    const company = {
        name: "Abdullah Enterprise",
        phone: "01798383377",
        email: "shakea801@gmail.com",
        address: "ধনতলা, বেলগাছা - ২০২২, ইসলামপুর, জামালপুর",
        web: "www.abdullahelekte.com",
        tin: "TIN: 123456789012"
    };
    
    let subtotal = data.items.reduce((s, i) => s + i.total, 0);
    let afterDiscount = subtotal - data.discount;
    let taxAmount = afterDiscount * data.tax / 100;
    let finalTotal = afterDiscount + taxAmount;
    const printDate = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
    const qrId = 'qr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    const fileName = `Invoice_${data.shopName.replace(/[^a-zA-Z0-9]/g, '_')}_${data.invoiceNo}.pdf`;
    
    const itemsHtml = data.items.map((item, idx) => `
        <tr>
            <td style="padding: 8px 6px; border: 1px solid #ddd; text-align:center;">${idx + 1}</td>
            <td style="padding: 8px 6px; border: 1px solid #ddd;">${escapeHtml(item.name)}</td>
            <td style="padding: 8px 6px; border: 1px solid #ddd; text-align:center;">${item.qty}</td>
            <td style="padding: 8px 6px; border: 1px solid #ddd; text-align:right;">${item.price.toFixed(2)}</td>
            <td style="padding: 8px 6px; border: 1px solid #ddd; text-align:right; font-weight:600;">${item.total.toFixed(2)}</td>
        </tr>
    `).join('');
    
    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.shopName} - Invoice ${data.invoiceNo}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', 'Roboto', 'Arial', sans-serif;
            padding: 0.2in;
            background: white;
            font-size: 12px;
            line-height: 1.4;
        }
        @media print {
            body {
                padding: 0.2in;
                margin: 0;
            }
            @page {
                size: A4;
                margin: 0.2in;
            }
        }
        .invoice-container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #d4af37;
            padding-bottom: 12px;
            margin-bottom: 15px;
        }
        .company-info h1 {
            color: #1e3c72;
            font-size: 22px;
            margin: 0;
        }
        .company-info p {
            color: #4a627a;
            font-size: 9px;
            margin-top: 3px;
        }
        .contact-row {
            display: flex;
            justify-content: space-between;
            background: #f8fafd;
            padding: 8px 12px;
            border-radius: 10px;
            margin-bottom: 15px;
            font-size: 9px;
            border: 1px solid #e9edf2;
            flex-wrap: wrap;
            gap: 6px;
        }
        .customer-section {
            background: #f9fbfd;
            padding: 12px 18px;
            border-radius: 12px;
            margin: 12px 0 15px;
            border: 1px solid #e9edf2;
        }
        .customer-flex {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 15px;
        }
        .customer-details {
            flex: 2;
        }
        .customer-details strong {
            color: #1e4a76;
            font-size: 12px;
            display: block;
            margin-bottom: 6px;
            border-left: 2px solid #d4af37;
            padding-left: 8px;
        }
        .shop-name {
            font-size: 14px;
            font-weight: 700;
            color: #0a2b3e;
            margin-bottom: 4px;
        }
        .invoice-badge {
            background: #1e4a76;
            padding: 8px 20px;
            border-radius: 40px;
            text-align: center;
        }
        .invoice-badge .inv-no {
            color: white;
            font-size: 14px;
            font-weight: 800;
        }
        .invoice-badge .inv-date {
            color: rgba(255,255,255,0.9);
            font-size: 9px;
            margin-top: 3px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th {
            background: #eef2fa;
            padding: 8px 6px;
            border: 1px solid #ddd;
            font-weight: 700;
            font-size: 11px;
        }
        td {
            padding: 6px 6px;
            border: 1px solid #ddd;
            font-size: 11px;
        }
        .text-right {
            text-align: right;
        }
        .totals-table {
            width: 100%;
            max-width: 300px;
            margin-left: auto;
            margin-top: 12px;
            margin-bottom: 12px;
            border-collapse: collapse;
        }
        .totals-table td {
            padding: 6px 12px;
            border: 1px solid #ddd;
        }
        .payment-status {
            display: flex;
            justify-content: space-between;
            background: #f1f5f9;
            padding: 8px 16px;
            border-radius: 40px;
            margin: 12px 0;
            font-size: 11px;
            flex-wrap: wrap;
            gap: 8px;
        }
        .remark-box {
            background: #fefce8;
            padding: 8px 12px;
            border-radius: 10px;
            margin-bottom: 12px;
            border-left: 3px solid #eab308;
            font-size: 10px;
        }
        .footer {
            margin-top: 20px;
        }
        .footer-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #cbd5e1;
            padding-top: 15px;
            flex-wrap: wrap;
            gap: 15px;
        }
        .receiver-signature .sign-line {
            border-bottom: 1px solid #94a3b8;
            width: 130px;
            padding-bottom: 3px;
            margin-top: 3px;
        }
        .qr-code {
            text-align: center;
        }
        .stamp-area {
            text-align: right;
        }
        .stamp-group {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-bottom: 5px;
        }
        .stamp-item img {
            width: 45px;
            height: auto;
        }
        .stamp-item small {
            font-size: 7px;
            display: block;
        }
        .footer-note {
            text-align: center;
            margin-top: 12px;
            font-size: 9px;
            color: #6c86a3;
            border-top: 1px solid #e9edf2;
            padding-top: 8px;
        }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/qrious/dist/qrious.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
</head>
<body>
<div class="invoice-container" id="invoiceContent">
    <div class="header">
        <div class="company-info">
            <h1>${company.name}</h1>
            <p>${company.address}</p>
        </div>
        <div>${companyLogo}</div>
    </div>
    <div class="contact-row">
        <div>📞 ${company.phone} &nbsp;| ✉️ ${company.email}</div>
        <div>🌐 ${company.web} &nbsp;| ${company.tin}</div>
    </div>
    <div class="customer-section">
        <div class="customer-flex">
            <div class="customer-details">
                <strong>ক্রেতার তথ্য</strong>
                <div class="shop-name">${escapeHtml(data.shopName) || '——'}</div>
                <div>${escapeHtml(data.customerName) ? '👤 ' + escapeHtml(data.customerName) : ''} ${data.customerMobile ? '📞 ' + escapeHtml(data.customerMobile) : ''}</div>
                <div>📍 ${escapeHtml(data.customerAddress) || '——'}</div>
            </div>
            <div class="invoice-badge">
                <div class="inv-no">${data.invoiceNo}</div>
                <div class="inv-date">${data.date}</div>
            </div>
        </div>
    </div>
    <table>
        <thead>
            <tr>
                <th style="width:8%">ক্রম</th>
                <th style="width:52%">পণ্যের বিবরণ</th>
                <th style="width:12%">পরিমাণ</th>
                <th style="width:14%">দাম (৳)</th>
                <th style="width:14%">মোট (৳)</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHtml}
        </tbody>
    </table>
    <table class="totals-table">
        <tr><td style="width:65%">সাব-টোটাল</td><td class="text-right">${subtotal.toFixed(2)} ৳</td></tr>
        ${data.discount > 0 ? `<tr><td style="color:#b91c1c;">ডিসকাউন্ট</td><td class="text-right" style="color:#b91c1c;">- ${data.discount} ৳</td></tr>` : ''}
        ${data.tax > 0 ? `<tr><td style="color:#1e4a76;">ভ্যাট (${data.tax}%)</td><td class="text-right">+ ${taxAmount.toFixed(2)} ৳</td></tr>` : ''}
        <tr style="background:#eef2fa;"><td style="font-weight:800; font-size:14px;">মোট প্রদেয়</td><td class="text-right" style="font-weight:800; font-size:16px; color:#1e4a76;">${finalTotal.toFixed(2)} ৳</td></tr>
    </table>
    <div class="payment-status">
        <span><strong>পরিশোধ:</strong> ${data.paymentStatus}</span>
        <span><strong>মাধ্যম:</strong> ${data.paymentMethod}</span>
    </div>
    ${data.remark ? `<div class="remark-box"><strong>নোট:</strong> ${escapeHtml(data.remark)}</div>` : ''}
    <div class="footer">
        <div class="footer-flex">
            <div class="receiver-signature">
                <strong>প্রাপকের স্বাক্ষর</strong>
                <div class="sign-line"></div>
                <small>(রিসিভ করলো)</small>
            </div>
            <div class="qr-code">
                <canvas id="${qrId}" width="70" height="70"></canvas>
                <div><small>ভেরিফিকেশন</small></div>
            </div>
            <div class="stamp-area">
                <div class="stamp-group">
                    <div class="stamp-item"><img src="data:image/svg+xml,${encodeURIComponent(sealSvg)}" alt="সিল"><small>সিল</small></div>
                    <div class="stamp-item"><img src="data:image/svg+xml,${encodeURIComponent(signSvg)}" alt="স্বাক্ষর"><small>স্বাক্ষর</small></div>
                </div>
                <small>তারিখ: ${printDate}</small>
            </div>
        </div>
        <div class="footer-note">${company.web} | হটলাইন: ${company.phone} | ধন্যবাদান্তে</div>
    </div>
</div>
<script>
    (function() {
        var canvas = document.getElementById('${qrId}');
        if(canvas) {
            var sub = ${subtotal};
            var disc = ${data.discount};
            var tax = ${data.tax};
            var after = sub - disc;
            var taxAmt = after * tax / 100;
            var total = after + taxAmt;
            var qrValue = '${data.shopName} | ${data.invoiceNo} | ${data.date} | Total: ' + total.toFixed(2) + ' BDT';
            new QRious({ element: canvas, size: 70, value: qrValue, foreground: "#1e4a76" });
        }
        
        // Auto download PDF without print dialog
        setTimeout(function() {
            var element = document.getElementById('invoiceContent');
            var opt = {
                margin: [0.2, 0.2, 0.2, 0.2],
                filename: '${fileName}',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2.5, letterRendering: true, useCORS: true, logging: false, backgroundColor: '#ffffff' },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save().then(function() {
                setTimeout(function() { window.close(); }, 1000);
            }).catch(function(err) {
                console.error('PDF Error:', err);
                setTimeout(function() { window.close(); }, 500);
            });
        }, 1000);
    })();
</script>
</body>
</html>`;
}

// ========== প্রিন্ট ফাংশন ==========
async function printInvoice(data) {
    showLoader("চালান প্রস্তুত হচ্ছে...");
    
    const html = generatePrintInvoiceHTML(data);
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
        alert("পপ-আপ ব্লকার সক্রিয়! দয়া করে ব্রাউজার সেটিংসে পপ-আপ অনুমতি দিন।");
        hideLoader();
        return;
    }
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        hideLoader();
        printWindow.onafterprint = () => {
            printWindow.close();
        };
        setTimeout(() => {
            if (!printWindow.closed) printWindow.close();
        }, 10000);
    }, 1000);
}

// ========== PDF ডাউনলোড - Auto Download Without Print Dialog ==========
async function downloadInvoicePDF(data) {
    showLoader("PDF তৈরি হচ্ছে, দয়া করে অপেক্ষা করুন...");
    
    try {
        // Open a new window with PDF-optimized design
        const pdfWindow = window.open('', '_blank');
        
        if (!pdfWindow) {
            alert("পপ-আপ ব্লকার সক্রিয়! দয়া করে অনুমতি দিন।");
            hideLoader();
            return false;
        }
        
        // Generate PDF-specific HTML with auto-download
        const html = generatePDFInvoiceHTML(data);
        pdfWindow.document.write(html);
        pdfWindow.document.close();
        
        // The PDF will auto-download via html2pdf in the new window
        hideLoader();
        
        return true;
    } catch (err) {
        console.error('PDF Error:', err);
        hideLoader();
        alert("PDF তৈরি ব্যর্থ! আবার চেষ্টা করুন।");
        return false;
    }
}

// ========== সেভ ইনভয়েস ==========
saveInvoiceBtn.addEventListener('click', () => {
    const shopName = shopNameInput.value.trim();
    if (!shopName) {
        alert("দোকানের নাম লিখুন!");
        return;
    }
    
    const items = [];
    let hasValid = false;
    document.querySelectorAll('.product-row').forEach(row => {
        const name = row.querySelector('.productName').value.trim();
        const qty = parseFloat(row.querySelector('.productQty').value);
        const price = parseFloat(row.querySelector('.productPrice').value);
        if (name && !isNaN(qty) && qty > 0 && !isNaN(price) && price > 0) {
            hasValid = true;
            items.push({ name, qty, price, total: qty * price });
        }
    });
    
    if (!hasValid || items.length === 0) {
        alert("কমপক্ষে একটি পণ্য যোগ করুন!");
        return;
    }
    
    const discount = parseFloat(discountEl.value) || 0;
    const taxPercent = parseFloat(taxEl.value) || 0;
    let subtotal = 0;
    items.forEach(i => subtotal += i.total);
    let afterDiscount = subtotal - discount;
    let grandTotal = afterDiscount + (afterDiscount * taxPercent / 100);
    
    const now = new Date();
    const bdTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
    const dateKey = bdTime.toISOString().split('T')[0];
    const timeKey = bdTime.toTimeString().split(' ')[0].replace(/:/g, '-');
    
    const invoiceData = {
        shopName: shopName,
        invoiceNo: invoiceNoEl.value.trim(),
        customerName: customerName.value.trim(),
        customerMobile: customerMobile.value.trim(),
        customerAddress: customerAddress.value.trim(),
        items: items,
        grandTotal: parseFloat(grandTotal.toFixed(2)),
        discount: discount,
        tax: taxPercent,
        remark: remarkEl.value.trim(),
        paymentStatus: paymentStatus.value,
        paymentMethod: paymentMethod.value,
        date: dateKey,
        time: timeKey,
        updatedAt: Date.now()
    };
    
    const newRef = db.ref(`invoices/${shopName}/${dateKey}/${timeKey}`);
    newRef.set(invoiceData, async (err) => {
        if (err) {
            alert("সেভ ব্যর্থ! ইন্টারনেট চেক করুন।");
        } else {
            alert("✅ ইনভয়েস সংরক্ষিত হয়েছে!");
            await printInvoice(invoiceData);
            db.ref('invoiceCounter').set(invoiceCounter);
            invoiceCounter++;
            invoiceNoEl.value = 'INV-' + String(invoiceCounter).padStart(5, '0');
            loadInvoices();
            
            document.querySelectorAll('.product-row').forEach((r, i) => { if (i > 0) r.remove(); });
            document.querySelector('.product-row').querySelectorAll('input').forEach(i => i.value = '');
            discountEl.value = '';
            taxEl.value = '';
            remarkEl.value = '';
            paymentStatus.value = 'ফুল পেইড';
            paymentMethod.value = 'বিকাশ';
            calculateGrandTotal();
        }
    });
});

// ========== লোড ইনভয়েস ==========
function loadInvoices() {
    invoiceListDiv.innerHTML = '<div class="text-center py-4"><i class="fas fa-spinner fa-spin"></i> লোড হচ্ছে...</div>';
    db.ref('invoices').once('value', (snapshot) => {
        invoiceListDiv.innerHTML = '';
        if (!snapshot.exists()) {
            invoiceListDiv.innerHTML = '<div class="alert alert-info text-center">কোনো ইনভয়েস নেই</div>';
            return;
        }
        
        const invoices = [];
        snapshot.forEach(shopSnap => {
            shopSnap.forEach(dateSnap => {
                dateSnap.forEach(timeSnap => {
                    invoices.push({ shop: shopSnap.key, date: dateSnap.key, time: timeSnap.key, data: timeSnap.val() });
                });
            });
        });
        
        invoices.sort((a, b) => (b.data.updatedAt || 0) - (a.data.updatedAt || 0));
        
        invoices.forEach(({ shop, date, time, data }) => {
            const card = document.createElement('div');
            card.className = 'invoice-card';
            card.innerHTML = `
                <div class="d-flex flex-wrap justify-content-between align-items-start">
                    <div><strong><i class="fas fa-store"></i> ${escapeHtml(data.shopName)}</strong><span class="badge bg-secondary ms-2">${data.date}</span><br><small>${data.invoiceNo} | ${data.customerName ? '👤 ' + escapeHtml(data.customerName) : ''} ${data.customerMobile || ''}</small><br><span class="fw-bold fs-5 text-success">${data.grandTotal} ৳</span><span class="badge bg-info text-white">${data.paymentStatus}</span><span class="badge bg-light">${data.paymentMethod}</span></div>
                    <div class="action-buttons mt-2 mt-md-0">
                        <button class="btn btn-sm btn-primary printBtn"><i class="fas fa-print"></i> প্রিন্ট</button>
                        <button class="btn btn-sm btn-success downloadBtn"><i class="fas fa-download"></i> ডাউন</button>
                        <button class="btn btn-sm btn-warning editBtn"><i class="fas fa-edit"></i> এডিট</button>
                        <button class="btn btn-sm btn-outline-danger deleteBtn"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            invoiceListDiv.appendChild(card);
            
            card.querySelector('.printBtn').onclick = () => printInvoice(data);
            card.querySelector('.downloadBtn').onclick = () => downloadInvoicePDF(data);
            card.querySelector('.deleteBtn').onclick = () => {
                if (confirm("ইনভয়েস মুছে ফেলবেন?")) db.ref(`invoices/${shop}/${date}/${time}`).remove().then(() => loadInvoices());
            };
            card.querySelector('.editBtn').onclick = () => {
                shopNameInput.value = data.shopName;
                customerName.value = data.customerName || '';
                customerMobile.value = data.customerMobile || '';
                customerAddress.value = data.customerAddress || '';
                invoiceNoEl.value = data.invoiceNo;
                discountEl.value = data.discount;
                taxEl.value = data.tax;
                remarkEl.value = data.remark || '';
                paymentStatus.value = data.paymentStatus;
                paymentMethod.value = data.paymentMethod;
                
                document.querySelectorAll('.product-row').forEach((r, i) => { if (i > 0) r.remove(); });
                const firstRow = document.querySelector('.product-row');
                firstRow.querySelectorAll('input').forEach(i => i.value = '');
                data.items.forEach((item, idx) => {
                    if (idx === 0) {
                        firstRow.querySelector('.productName').value = item.name;
                        firstRow.querySelector('.productQty').value = item.qty;
                        firstRow.querySelector('.productPrice').value = item.price;
                        firstRow.querySelector('.productTotal').value = item.total;
                    } else {
                        const newRow = firstRow.cloneNode(true);
                        newRow.querySelectorAll('input').forEach(i => i.value = '');
                        newRow.querySelector('.productName').value = item.name;
                        newRow.querySelector('.productQty').value = item.qty;
                        newRow.querySelector('.productPrice').value = item.price;
                        newRow.querySelector('.productTotal').value = item.total;
                        productListDiv.appendChild(newRow);
                        attachCalculationEvents(newRow);
                    }
                });
                attachRemoveListeners();
                calculateGrandTotal();
                
                const oldRef = db.ref(`invoices/${shop}/${date}/${time}`);
                const originalHandler = saveInvoiceBtn.onclick;
                saveInvoiceBtn.onclick = async () => {
                    await oldRef.remove();
                    const newShop = shopNameInput.value.trim();
                    if (!newShop) { alert("দোকানের নাম দিন!"); saveInvoiceBtn.onclick = originalHandler; return; }
                    
                    const newItems = [];
                    document.querySelectorAll('.product-row').forEach(r => {
                        const n = r.querySelector('.productName').value.trim();
                        const q = parseFloat(r.querySelector('.productQty').value);
                        const p = parseFloat(r.querySelector('.productPrice').value);
                        if (n && !isNaN(q) && q > 0 && !isNaN(p) && p > 0) newItems.push({ name: n, qty: q, price: p, total: q * p });
                    });
                    if (newItems.length === 0) { alert("পণ্য দিন!"); return; }
                    
                    const ndisc = parseFloat(discountEl.value) || 0;
                    const ntax = parseFloat(taxEl.value) || 0;
                    let s = 0; newItems.forEach(i => s += i.total);
                    let a = s - ndisc;
                    let ng = a + (a * ntax / 100);
                    const nowE = new Date(), bdE = new Date(nowE.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }));
                    const ndt = bdE.toISOString().split('T')[0], ntm = bdE.toTimeString().split(' ')[0].replace(/:/g, '-');
                    const updatedData = {
                        shopName: newShop, invoiceNo: invoiceNoEl.value.trim(),
                        customerName: customerName.value.trim(), customerMobile: customerMobile.value.trim(),
                        customerAddress: customerAddress.value.trim(), items: newItems,
                        grandTotal: parseFloat(ng.toFixed(2)), discount: ndisc, tax: ntax,
                        remark: remarkEl.value.trim(), paymentStatus: paymentStatus.value,
                        paymentMethod: paymentMethod.value, date: ndt, time: ntm, updatedAt: Date.now()
                    };
                    db.ref(`invoices/${newShop}/${ndt}/${ntm}`).set(updatedData, err => {
                        if (err) alert("এডিট ব্যর্থ!");
                        else {
                            alert("এডিট সম্পূর্ণ!");
                            saveInvoiceBtn.onclick = originalHandler;
                            loadInvoices();
                            document.querySelectorAll('.product-row').forEach((r, i) => { if (i > 0) r.remove(); });
                            document.querySelector('.product-row').querySelectorAll('input').forEach(i => i.value = '');
                            discountEl.value = ''; taxEl.value = ''; remarkEl.value = '';
                            paymentStatus.value = 'ফুল পেইড'; paymentMethod.value = 'বিকাশ';
                            calculateGrandTotal();
                        }
                    });
                };
                alert("এডিট মোড: পরিবর্তন করে 'সংরক্ষণ ও প্রিন্ট' চাপুন।");
            };
        });
    });
}

// Initial load
loadInvoices();
