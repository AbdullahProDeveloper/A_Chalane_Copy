// Auto Download Script - শুধুমাত্র PDF ডাউনলোডের জন্য (完全修复版)
(function() {
    // 确保 html2pdf 库已加载
    if (typeof html2pdf === 'undefined') {
        console.error('html2pdf library not loaded! Please include html2pdf.bundle.min.js');
    }
    if (typeof QRious === 'undefined') {
        console.error('QRious library not loaded! Please include qrious.min.js');
    }
    
    // 公司信息
    const company = {
        name: "Abdullah Enterprise",
        phone: "01798383377",
        email: "shakea801@gmail.com",
        address: "ধনতলা, বেলগাছা - ২০২২, ইসলামপুর, জামালপুর",
        web: "www.abdullahelekte.com",
        tin: "TIN: 123456789012"
    };
    
    // Logo SVG
    const companyLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="70" height="70">
        <circle cx="50" cy="50" r="45" fill="url(#grad)" stroke="#d4af37" stroke-width="2.5"/>
        <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e3c72"/><stop offset="100%" stop-color="#2a5298"/></linearGradient></defs>
        <text x="50" y="67" text-anchor="middle" fill="#d4af37" font-size="32" font-weight="bold">A</text>
        <text x="50" y="85" text-anchor="middle" fill="#e2e8f0" font-size="9">ENTERPRISE</text>
    </svg>`;
    
    const sealSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="65" height="65"><circle cx="50" cy="50" r="45" fill="none" stroke="#b87333" stroke-width="2.5"/><circle cx="50" cy="50" r="38" fill="none" stroke="#b87333" stroke-width="1.5"/><text x="50" y="58" text-anchor="middle" fill="#b87333" font-size="12" font-weight="bold">সিল</text><text x="50" y="72" text-anchor="middle" fill="#b87333" font-size="8">ESTABLISHED</text></svg>`;
    const signSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 60" width="85" height="60"><path d="M10,35 C25,25 35,30 45,32 C55,34 65,28 75,30 C85,32 95,38 105,36" stroke="#2c5f8a" fill="none" stroke-width="2.2"/><path d="M15,45 L30,42 L45,44 L60,40 L75,42 L90,38 L105,40" stroke="#2c5f8a" fill="none" stroke-width="1.5"/><text x="70" y="55" fill="#2c5f8a" font-size="9" font-style="italic">Authorized</text></svg>`;
    
    function escapeHtml(str) { 
        if (!str) return ''; 
        return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : m === '>' ? '&gt;' : m); 
    }
    
    // 生成完整的发票 HTML
    function generateInvoiceHTML(data) {
        let subtotal = data.items.reduce((s, i) => s + i.total, 0);
        let afterDiscount = subtotal - data.discount;
        let taxAmount = afterDiscount * data.tax / 100;
        let finalTotal = afterDiscount + taxAmount;
        const printDate = new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' });
        const qrId = 'qr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
        
        const itemsHtml = data.items.map((item, idx) => `
            <tr style="border-bottom: 1px solid #e9edf2;">
                <td style="padding: 12px 10px; border: 1px solid #e2e8f0; text-align:center;">${idx + 1}<\/td>
                <td style="padding: 12px 10px; border: 1px solid #e2e8f0;">${escapeHtml(item.name)}<\/td>
                <td style="padding: 12px 10px; border: 1px solid #e2e8f0; text-align:right;">${item.qty}<\/td>
                <td style="padding: 12px 10px; border: 1px solid #e2e8f0; text-align:right;">${item.price.toFixed(2)}<\/td>
                <td style="padding: 12px 10px; border: 1px solid #e2e8f0; text-align:right; font-weight:600;">${item.total.toFixed(2)}<\/td>
            <\/tr>
        `).join('');
        
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.shopName} - Invoice ${data.invoiceNo}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', 'Inter', 'Arial', sans-serif;
            padding: 0.5in;
            background: white;
            font-size: 13px;
            line-height: 1.5;
        }
        .invoice-container { max-width: 100%; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #d4af37; padding-bottom: 18px; margin-bottom: 20px; }
        .company-info h1 { color: #1e3c72; font-size: 30px; margin: 0; }
        .company-info p { color: #4a627a; font-size: 11px; margin-top: 5px; }
        .contact-row { display: flex; justify-content: space-between; background: #f8fafd; padding: 12px 18px; border-radius: 14px; margin-bottom: 20px; font-size: 11px; border: 1px solid #e9edf2; }
        .customer-section { background: #f9fbfd; padding: 18px 24px; border-radius: 20px; margin: 15px 0 20px; border: 1px solid #e9edf2; }
        .customer-flex { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
        .customer-details strong { color: #1e4a76; font-size: 14px; display: block; margin-bottom: 10px; border-left: 3px solid #d4af37; padding-left: 12px; }
        .shop-name { font-size: 18px; font-weight: 700; color: #0a2b3e; margin-bottom: 6px; }
        .invoice-badge { background: #1e4a76; padding: 12px 28px; border-radius: 60px; text-align: center; }
        .invoice-badge .inv-no { color: white; font-size: 20px; font-weight: 800; }
        .invoice-badge .inv-date { color: rgba(255,255,255,0.9); font-size: 11px; margin-top: 5px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .items-table th { background: #eef2fa; padding: 12px 10px; border: 1px solid #e2e8f0; font-weight: 700; }
        .items-table td { padding: 10px 10px; border: 1px solid #e2e8f0; }
        .text-right { text-align: right; }
        .totals-table { width: 100%; margin: 15px 0; border-collapse: collapse; }
        .totals-table td { padding: 12px 18px; border: 1px solid #e2e8f0; }
        .payment-status { display: flex; justify-content: space-between; background: #f1f5f9; padding: 12px 24px; border-radius: 50px; margin: 15px 0; font-size: 13px; }
        .remark-box { background: #fefce8; padding: 12px 18px; border-radius: 16px; margin-bottom: 18px; border-left: 4px solid #eab308; }
        .footer { margin-top: 30px; }
        .footer-flex { display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #cbd5e1; padding-top: 22px; }
        .receiver-signature .sign-line { border-bottom: 1.5px solid #94a3b8; width: 75%; padding-bottom: 5px; margin-top: 5px; }
        .qr-code { text-align: center; }
        .stamp-area { text-align: right; }
        .stamp-group { display: flex; gap: 15px; justify-content: flex-end; margin-bottom: 8px; }
        .stamp-item { text-align: center; }
        .stamp-item img { width: 60px; height: auto; }
        .stamp-item small { font-size: 9px; display: block; }
        .footer-note { text-align: center; margin-top: 20px; font-size: 10px; color: #6c86a3; border-top: 1px solid #e9edf2; padding-top: 12px; }
    </style>
</head>
<body>
<div class="invoice-container">
    <div class="header">
        <div class="company-info"><h1>${company.name}</h1><p>${company.address}</p></div>
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
    <table class="items-table">
        <thead><tr><th style="width:7%">ক্রম</th><th style="width:48%">পণ্যের বিবরণ</th><th style="width:12%">পরিমাণ</th><th style="width:15%">দাম (৳)</th><th style="width:18%">মোট (৳)</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
    追赶
    <table class="totals-table">
        <tr><td style="width:70%">সাব-টোটাল<\/td><td class="text-right">${subtotal.toFixed(2)} ৳<\/td><\/tr>
        <tr><td style="color:#b91c1c;">ডিসকাউন্ট<\/td><td class="text-right" style="color:#b91c1c;">- ${data.discount} ৳<\/td><\/tr>
        <tr><td>ভ্যাট / ট্যাক্স (${data.tax}%)<\/td><td class="text-right">+ ${taxAmount.toFixed(2)} ৳<\/td><\/tr>
        <tr style="background:#eef2fa;"><td style="font-weight:800; font-size:18px;">মোট প্রদেয়<\/td><td class="text-right" style="font-weight:800; font-size:22px; color:#1e4a76;">${finalTotal.toFixed(2)} ৳<\/td><\/tr>
    <\/table>
    <div class="payment-status"><span><strong>পরিশোধ অবস্থা:</strong> ${data.paymentStatus}</span><span><strong>পেমেন্ট মাধ্যম:</strong> ${data.paymentMethod}</span></div>
    ${data.remark ? `<div class="remark-box"><strong>নোট:</strong> ${escapeHtml(data.remark)}</div>` : ''}
    <div class="footer">
        <div class="footer-flex">
            <div class="receiver-signature"><strong>প্রাপকের স্বাক্ষর</strong><div class="sign-line">____________________</div><small>(রিসিভ করলো)</small></div>
            <div class="qr-code"><canvas id="${qrId}" width="95" height="95"></canvas><div><small>ভেরিফিকেশন কোড</small></div></div>
            <div class="stamp-area"><div class="stamp-group"><div class="stamp-item"><img src="data:image/svg+xml,${encodeURIComponent(sealSvg)}" alt="সিল"><small>সিল</small></div><div class="stamp-item"><img src="data:image/svg+xml,${encodeURIComponent(signSvg)}" alt="স্বাক্ষর"><small>স্বাক্ষর</small></div></div><small>তারিখ: ${printDate}</small></div>
        </div>
        <div class="footer-note">${company.web} | হটলাইন: ${company.phone} | ধন্যবাদান্তে</div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/qrious/dist/qrious.min.js"><\/script>
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
            new QRious({ element: canvas, size: 95, value: qrValue, foreground: "#1e4a76" });
        }
    })();
<\/script>
</body>
</html>`;
    }
    
    // 显示加载器
    function showLoader(message = "PDF তৈরি হচ্ছে, দয়া করে অপেক্ষা করুন...") {
        let loader = document.getElementById('pdfLoader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'pdfLoader';
            loader.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;justify-content:center;align-items:center;z-index:999999;flex-direction:column;backdrop-filter:blur(4px);';
            loader.innerHTML = `
                <div style="width:70px;height:70px;border:5px solid #e2e8f0;border-top-color:#1e4a76;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
                <div style="color:white;margin-top:20px;font-size:18px;font-weight:500;">${message}</div>
                <div style="color:rgba(255,255,255,0.7);margin-top:10px;font-size:14px;">QR কোড জেনারেট হচ্ছে...</div>
                <style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style>
            `;
            document.body.appendChild(loader);
        } else {
            loader.style.display = 'flex';
            const msgDiv = loader.querySelector('div:nth-child(2)');
            if (msgDiv) msgDiv.innerText = message;
        }
    }
    
    function hideLoader() {
        const loader = document.getElementById('pdfLoader');
        if (loader) loader.style.display = 'none';
    }
    
    // 更新加载状态
    function updateLoaderStatus(message) {
        const loader = document.getElementById('pdfLoader');
        if (loader) {
            const statusDiv = loader.querySelector('div:nth-child(2)');
            if (statusDiv) statusDiv.innerText = message;
        }
    }
    
    // 主下载函数
    async function autoDownloadInvoice(data) {
        return new Promise(async (resolve) => {
            try {
                showLoader("PDF তৈরি হচ্ছে, দয়া করে অপেক্ষা করুন...");
                
                // 创建容器
                const container = document.createElement('div');
                container.style.position = 'absolute';
                container.style.top = '-9999px';
                container.style.left = '-9999px';
                container.style.width = '210mm';
                container.style.backgroundColor = 'white';
                container.style.padding = '0';
                container.style.margin = '0';
                document.body.appendChild(container);
                
                updateLoaderStatus("চালান তৈরি হচ্ছে...");
                
                // 设置HTML内容
                const html = generateInvoiceHTML(data);
                container.innerHTML = html;
                
                // 等待DOM渲染
                await new Promise(r => setTimeout(r, 800));
                
                updateLoaderStatus("QR কোড জেনারেট হচ্ছে...");
                
                // 等待QR码生成
                await new Promise(r => setTimeout(r, 1500));
                
                // 查找QR canvas并确保已渲染
                const qrCanvas = container.querySelector('canvas');
                if (qrCanvas) {
                    await new Promise(r => setTimeout(r, 1000));
                }
                
                updateLoaderStatus("PDF তৈরি হচ্ছে, প্রায় শেষ...");
                
                // PDF选项
                const opt = {
                    margin: [0.45, 0.4, 0.45, 0.4],
                    filename: `Invoice_${data.shopName}_${data.invoiceNo}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { 
                        scale: 2.8, 
                        letterRendering: true, 
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff'
                    },
                    jsPDF: { 
                        unit: 'in', 
                        format: 'a4', 
                        orientation: 'portrait'
                    }
                };
                
                // 生成PDF
                await html2pdf().set(opt).from(container).save();
                
                // 清理
                document.body.removeChild(container);
                hideLoader();
                console.log("PDF ডাউনলোড সফল!");
                resolve(true);
                
            } catch (err) {
                console.error('PDF Error:', err);
                hideLoader();
                alert("PDF তৈরি ব্যর্থ! আবার চেষ্টা করুন।");
                resolve(false);
            }
        });
    }
    
    // 导出函数
    window.autoDownloadInvoice = autoDownloadInvoice;
    window.generateInvoiceHTML = generateInvoiceHTML;
    window.downloadInvoicePDF = autoDownloadInvoice;
})();
