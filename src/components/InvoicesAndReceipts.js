import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import jsPDF from 'jspdf';
import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import Navigation from './Navigation';
import './InvoicesAndReceipts.css';

// Configure PDF.js worker - use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const InvoicesAndReceipts = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customization, setCustomization] = useState({
    businessLogo: null,
    businessName: '',
    businessAddress: '',
    businessEmail: '',
    businessPhone: '',
    businessWebsite: '',
    taxNumber: '',
    standardTerms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
    standardNotes: 'Thank you for your business!',
    footerText: 'For any queries regarding this invoice, please contact us.',
    colorScheme: 'professional'
  });
  const [currentPeriod, setCurrentPeriod] = useState(null);
  const [newInvoice, setNewInvoice] = useState({
    id: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'draft',
    invoiceImage: null,
    template: 'professional',
    businessName: '',
    businessAddress: '',
    businessEmail: '',
    businessPhone: '',
    taxNumber: '',
    paymentTerms: '30 days',
    notes: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    const savedExpenses = localStorage.getItem('expenses');
    const savedCustomization = localStorage.getItem('invoiceCustomization');
    const openExpensesTab = localStorage.getItem('openExpensesTab');
    
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedCustomization) {
      setCustomization(JSON.parse(savedCustomization));
    }
    
    // Check if we should open the expenses tab (coming from monthly-profit)
    if (openExpensesTab === 'true') {
      setActiveTab('expenses');
      localStorage.removeItem('openExpensesTab'); // Clear the flag
    }
    
    // Load current assessment period if coming from monthly-profit
    const savedPeriod = localStorage.getItem('currentAssessmentPeriod');
    if (savedPeriod) {
      setCurrentPeriod(JSON.parse(savedPeriod));
    }
  }, []);

  // Save data to localStorage whenever invoices or expenses change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('invoiceCustomization', JSON.stringify(customization));
  }, [customization]);

  // Initialize form with customization data when customization changes
  useEffect(() => {
    if (customization.businessName || customization.businessEmail || customization.businessPhone || 
        customization.businessAddress || customization.taxNumber) {
      setNewInvoice(prev => ({
        ...prev,
        businessName: customization.businessName || prev.businessName,
        businessEmail: customization.businessEmail || prev.businessEmail,
        businessPhone: customization.businessPhone || prev.businessPhone,
        businessAddress: customization.businessAddress || prev.businessAddress,
        taxNumber: customization.taxNumber || prev.taxNumber
      }));
    }
  }, [customization]);

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Handle invoice creation
  const handleCreateInvoice = () => {
    if (!newInvoice.clientName || !newInvoice.amount) {
      alert('Please fill in client name and amount');
      return;
    }

    const invoice = {
      ...newInvoice,
      id: generateId(),
      createdAt: new Date().toISOString()
    };

    setInvoices([...invoices, invoice]);
    setNewInvoice({
      id: '',
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      invoiceImage: null,
      template: 'professional',
      businessName: customization.businessName || '',
      businessAddress: customization.businessAddress || '',
      businessEmail: customization.businessEmail || '',
      businessPhone: customization.businessPhone || '',
      taxNumber: customization.taxNumber || '',
      paymentTerms: '30 days',
      notes: ''
    });
  };

  // Generate detailed professional PDF for invoice
  const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Color schemes
    const colorSchemes = {
      professional: {
        primary: [44, 62, 80],
        accent: [52, 152, 219],
        light: [245, 245, 245],
        dark: [33, 37, 41]
      },
      modern: {
        primary: [108, 117, 125],
        accent: [0, 123, 255],
        light: [248, 249, 250],
        dark: [52, 58, 64]
      },
      minimal: {
        primary: [73, 80, 87],
        accent: [108, 117, 125],
        light: [255, 255, 255],
        dark: [33, 37, 41]
      }
    };
    
    const colors = colorSchemes[customization.colorScheme] || colorSchemes.professional;
    
    // Header section with logo and business info
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 60, 'F');
    
    // Business logo (if available)
    if (customization.businessLogo) {
      try {
        doc.addImage(customization.businessLogo, 'PNG', 20, 15, 30, 30);
      } catch (error) {
        console.log('Logo could not be added to PDF');
      }
    }
    
    // Business name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    const businessName = customization.businessName || invoice.businessName || 'Your Business Name';
    doc.text(businessName, customization.businessLogo ? 60 : 20, 35);
    
    // Invoice title
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 80, 40);
    
    // Invoice details box
    doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.rect(pageWidth - 90, 70, 80, 50, 'F');
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(1);
    doc.rect(pageWidth - 90, 70, 80, 50, 'S');
    
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE DETAILS', pageWidth - 85, 85);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Invoice #:', pageWidth - 85, 95);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.id, pageWidth - 60, 95);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Date:', pageWidth - 85, 105);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.date, pageWidth - 60, 105);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Status:', pageWidth - 85, 115);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.status.toUpperCase(), pageWidth - 60, 115);
    
    // Business details section
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FROM:', 20, 85);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    let yPos = 95;
    
    if (businessName) {
      doc.setFont('helvetica', 'bold');
      doc.text(businessName, 20, yPos);
      yPos += 8;
    }
    
    if (customization.businessAddress || invoice.businessAddress) {
      doc.setFont('helvetica', 'normal');
      const address = customization.businessAddress || invoice.businessAddress;
      const addressLines = address.split('\n');
      addressLines.forEach((line, index) => {
        doc.text(line, 20, yPos + (index * 6));
      });
      yPos += addressLines.length * 6 + 4;
    }
    
    if (customization.businessEmail || invoice.businessEmail) {
      doc.text(`Email: ${customization.businessEmail || invoice.businessEmail}`, 20, yPos);
      yPos += 6;
    }
    
    if (customization.businessPhone || invoice.businessPhone) {
      doc.text(`Phone: ${customization.businessPhone || invoice.businessPhone}`, 20, yPos);
      yPos += 6;
    }
    
    if (customization.businessWebsite) {
      doc.text(`Website: ${customization.businessWebsite}`, 20, yPos);
      yPos += 6;
    }
    
    if (customization.taxNumber || invoice.taxNumber) {
      doc.text(`Tax/VAT #: ${customization.taxNumber || invoice.taxNumber}`, 20, yPos);
    }
    
    // Client details section
    yPos = Math.max(yPos + 20, 140);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 20, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    yPos += 10;
    
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.clientName, 20, yPos);
    yPos += 8;
    
    if (invoice.clientEmail) {
      doc.setFont('helvetica', 'normal');
      doc.text(`Email: ${invoice.clientEmail}`, 20, yPos);
      yPos += 6;
    }
    
    if (invoice.clientAddress) {
      const addressLines = invoice.clientAddress.split('\n');
      addressLines.forEach((line, index) => {
        doc.text(line, 20, yPos + (index * 6));
      });
      yPos += addressLines.length * 6 + 8;
    }
    
    // Line separator
    yPos += 10;
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(1);
    doc.line(20, yPos, pageWidth - 20, yPos);
    
    // Items table
    yPos += 15;
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.rect(20, yPos - 10, pageWidth - 40, 10, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('DESCRIPTION', 25, yPos - 3);
    doc.text('QUANTITY', pageWidth - 120, yPos - 3);
    doc.text('RATE', pageWidth - 80, yPos - 3);
    doc.text('AMOUNT', pageWidth - 40, yPos - 3);
    
    // Item details
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.setFont('helvetica', 'normal');
    yPos += 5;
    
    const description = invoice.description || 'Services rendered';
    const quantity = '1';
    const rate = `£${parseFloat(invoice.amount).toFixed(2)}`;
    const amount = `£${parseFloat(invoice.amount).toFixed(2)}`;
    
    // Description
    const descriptionLines = doc.splitTextToSize(description, pageWidth - 140);
    descriptionLines.forEach((line, index) => {
      doc.text(line, 25, yPos + (index * 6));
    });
    
    // Quantity, Rate, Amount
    doc.text(quantity, pageWidth - 120, yPos);
    doc.text(rate, pageWidth - 80, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(amount, pageWidth - 40, yPos);
    
    // Totals section
    yPos += Math.max(descriptionLines.length * 6, 15) + 20;
    
    // Subtotal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text('Subtotal:', pageWidth - 80, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text(amount, pageWidth - 40, yPos);
    
    // Tax (if applicable)
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('Tax (0%):', pageWidth - 80, yPos);
    doc.setFont('helvetica', 'bold');
    doc.text('£0.00', pageWidth - 40, yPos);
    
    // Total
    yPos += 12;
    doc.setFillColor(colors.light[0], colors.light[1], colors.light[2]);
    doc.rect(pageWidth - 90, yPos - 8, 70, 12, 'F');
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(1);
    doc.rect(pageWidth - 90, yPos - 8, 70, 12, 'S');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', pageWidth - 85, yPos);
    doc.setFontSize(14);
    doc.text(amount, pageWidth - 45, yPos);
    
    // Payment terms and notes
    yPos += 25;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT TERMS:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    const paymentTerms = invoice.paymentTerms || customization.standardTerms;
    const termsLines = doc.splitTextToSize(paymentTerms, pageWidth - 40);
    termsLines.forEach((line, index) => {
      doc.text(line, 20, yPos + 8 + (index * 6));
    });
    
    // Notes
    yPos += termsLines.length * 6 + 15;
    if (invoice.notes || customization.standardNotes) {
      doc.setFont('helvetica', 'bold');
      doc.text('NOTES:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      const notes = invoice.notes || customization.standardNotes;
      const notesLines = doc.splitTextToSize(notes, pageWidth - 40);
      notesLines.forEach((line, index) => {
        doc.text(line, 20, yPos + 8 + (index * 6));
      });
      yPos += notesLines.length * 6 + 10;
    }
    
    // Footer
    const footerY = pageHeight - 30;
    doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.setLineWidth(0.5);
    doc.line(20, footerY - 10, pageWidth - 20, footerY - 10);
    
    doc.setFontSize(9);
    doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.setFont('helvetica', 'normal');
    
    if (customization.footerText) {
      doc.text(customization.footerText, 20, footerY);
    }
    
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth - 60, footerY);
    
    // Save the PDF
    doc.save(`invoice-${invoice.id}.pdf`);
  };

  // Handle image upload for invoices
  const handleInvoiceImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewInvoice({...newInvoice, invoiceImage: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo upload for customization
  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomization({...customization, businessLogo: e.target.result});
      };
      reader.readAsDataURL(file);
    }
  };

  // Parse expense data from extracted text
  const parseExpenseData = (text) => {
    const data = {
      amount: '',
      date: '',
      description: '',
      category: 'uncategorized',
      vendor: ''
    };

    // Extract amount - look for various currency formats
    const amountPatterns = [
      /£\s*(\d+\.?\d*)/g,           // £123.45
      /(\d+\.?\d*)\s*£/g,           // 123.45£
      /total[:\s]*£?\s*(\d+\.?\d*)/gi,  // Total: £123.45
      /amount[:\s]*£?\s*(\d+\.?\d*)/gi, // Amount: £123.45
      /(\d+\.?\d*)\s*GBP/gi,        // 123.45 GBP
      /(\d+\.?\d*)\s*USD/gi,        // 123.45 USD
      /(\d+\.?\d*)\s*EUR/gi         // 123.45 EUR
    ];

    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        data.amount = match[0].replace(/[£$€GBPUSD\s]/gi, '');
        break;
      }
    }

    // Extract date - look for various date formats
    const datePatterns = [
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,  // DD/MM/YYYY or DD-MM-YYYY
      /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/g,    // YYYY/MM/DD or YYYY-MM-DD
      /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})/gi, // DD Mon YYYY
      /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{2,4})/gi // Mon DD, YYYY
    ];

    for (const pattern of datePatterns) {
      const match = text.match(pattern);
      if (match) {
        data.date = match[0];
        break;
      }
    }

    // Extract vendor/merchant name
    const vendorPatterns = [
      /(?:from|merchant|vendor|store)[:\s]*([A-Za-z\s&]+)/gi,
      /^([A-Za-z\s&]+)\s*(?:receipt|invoice|bill)/gi,
      /([A-Za-z\s&]{3,})\s*(?:ltd|limited|inc|corp|company)/gi
    ];

    for (const pattern of vendorPatterns) {
      const match = text.match(pattern);
      if (match && match[1].trim().length > 2) {
        data.vendor = match[1].trim();
        break;
      }
    }

    // Extract description - look for common expense keywords
    const expenseKeywords = [
      'fuel', 'petrol', 'diesel', 'gas',
      'office', 'stationery', 'supplies',
      'travel', 'transport', 'taxi', 'bus', 'train',
      'meal', 'food', 'restaurant', 'lunch', 'dinner',
      'hotel', 'accommodation', 'lodging',
      'phone', 'mobile', 'telephone',
      'internet', 'broadband', 'wifi',
      'insurance', 'premium', 'policy',
      'rent', 'lease', 'rental',
      'utilities', 'electricity', 'gas', 'water',
      'marketing', 'advertising', 'promotion',
      'training', 'course', 'education',
      'software', 'subscription', 'license'
    ];

    const textLower = text.toLowerCase();
    for (const keyword of expenseKeywords) {
      if (textLower.includes(keyword)) {
        data.category = keyword;
        break;
      }
    }

    // Extract description from first meaningful line
    const lines = text.split('\n').filter(line => line.trim().length > 5);
    if (lines.length > 0) {
      data.description = lines[0].trim().substring(0, 100);
    }

    return data;
  };

  // Handle file drop for receipts
  const onDrop = async (acceptedFiles) => {
    setIsProcessing(true);
    
    for (const file of acceptedFiles) {
      try {
        let text = '';
        let fileType = 'unknown';
        
        // Determine file type and process accordingly
        if (file.type.startsWith('image/')) {
          // Process image with OCR
          const { data: { text: ocrText } } = await Tesseract.recognize(file, 'eng');
          text = ocrText;
          fileType = 'image';
        } else if (file.type === 'application/pdf') {
          // Extract text from PDF using PDF.js
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          
          // Extract text from all pages
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }
          
          text = fullText.trim();
          fileType = 'pdf';
        } else if (file.type === 'text/html') {
          // For HTML files, we'll read the content
          const htmlContent = await file.text();
          // Extract text content from HTML (basic implementation)
          text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          fileType = 'html';
        } else {
          text = `File: ${file.name}\n\nPlease manually enter the amount and date below.`;
          fileType = 'other';
        }
        
        // Enhanced data extraction from text
        const extractedData = parseExpenseData(text);
        
        const expense = {
          id: generateId(),
          filename: file.name,
          amount: extractedData.amount || '0',
          date: extractedData.date || new Date().toISOString().split('T')[0],
          description: extractedData.description || text.substring(0, 100) + (text.length > 100 ? '...' : ''),
          fullText: text,
          category: extractedData.category || 'uncategorized',
          vendor: extractedData.vendor || '',
          fileType: fileType,
          createdAt: new Date().toISOString()
        };
        
        setExpenses(prev => [...prev, expense]);
      } catch (error) {
        console.error('Error processing file:', error);
        alert(`Error processing ${file.name}: ${error.message}`);
      }
    }
    
    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp'],
      'application/pdf': ['.pdf'],
      'text/html': ['.html', '.htm']
    }
  });

  // Export data for monthly profit calculations
  const exportData = () => {
    const data = {
      invoices: invoices.map(inv => ({
        id: inv.id,
        amount: parseFloat(inv.amount),
        date: inv.date,
        status: inv.status
      })),
      expenses: expenses.map(exp => ({
        id: exp.id,
        amount: parseFloat(exp.amount),
        date: exp.date,
        category: exp.category
      }))
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invoices-expenses-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="invoices-receipts-container">
      <div className="page-header">
        <h1>Invoices & Receipts</h1>
        <p>Digitally store and organize all your receipts and invoices, with automatic categorization for tax purposes.</p>
        {currentPeriod && (
          <div className="period-context">
            <h3>Current Assessment Period: {currentPeriod.month}</h3>
            <p>Period: {currentPeriod.start} - {currentPeriod.end}</p>
            <button 
              className="clear-period-btn"
              onClick={() => {
                setCurrentPeriod(null);
                localStorage.removeItem('currentAssessmentPeriod');
              }}
            >
              Clear Period Context
            </button>
          </div>
        )}
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices ({invoices.length})
        </button>
        <button 
          className={`tab ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          Expenses ({expenses.length})
        </button>
        <button 
          className={`tab ${activeTab === 'customization' ? 'active' : ''}`}
          onClick={() => setActiveTab('customization')}
        >
          Customization
        </button>
        <button 
          className={`tab ${activeTab === 'export' ? 'active' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          Export Data
        </button>
      </div>

      {activeTab === 'invoices' && (
        <div className="invoices-tab">
          <div className="create-invoice-section">
            <h3>Create Professional Invoice</h3>
            <div className="invoice-form">
              {/* Business Information Section */}
              <div className="form-section">
                <h4>Your Business Information</h4>
                <p className="form-help-text">
                  💡 Business information is automatically filled from your customization settings. 
                  You can override any field below or update your defaults in the Customization tab.
                </p>
                <div className="form-row">
                  <div className="form-group">
                    <label>Business Name *</label>
                    <input
                      type="text"
                      value={newInvoice.businessName}
                      onChange={(e) => setNewInvoice({...newInvoice, businessName: e.target.value})}
                      placeholder="Your Business Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Business Email</label>
                    <input
                      type="email"
                      value={newInvoice.businessEmail}
                      onChange={(e) => setNewInvoice({...newInvoice, businessEmail: e.target.value})}
                      placeholder="business@example.com"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Business Phone</label>
                    <input
                      type="tel"
                      value={newInvoice.businessPhone}
                      onChange={(e) => setNewInvoice({...newInvoice, businessPhone: e.target.value})}
                      placeholder="+44 123 456 7890"
                    />
                  </div>
                  <div className="form-group">
                    <label>Tax/VAT Number</label>
                    <input
                      type="text"
                      value={newInvoice.taxNumber}
                      onChange={(e) => setNewInvoice({...newInvoice, taxNumber: e.target.value})}
                      placeholder="GB123456789"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Business Address</label>
                  <textarea
                    value={newInvoice.businessAddress}
                    onChange={(e) => setNewInvoice({...newInvoice, businessAddress: e.target.value})}
                    placeholder="Enter your business address"
                    rows="3"
                  />
                </div>
              </div>

              {/* Client Information Section */}
              <div className="form-section">
                <h4>Client Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Client Name *</label>
                    <input
                      type="text"
                      value={newInvoice.clientName}
                      onChange={(e) => setNewInvoice({...newInvoice, clientName: e.target.value})}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Client Email</label>
                    <input
                      type="email"
                      value={newInvoice.clientEmail}
                      onChange={(e) => setNewInvoice({...newInvoice, clientEmail: e.target.value})}
                      placeholder="client@example.com"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Client Address</label>
                  <textarea
                    value={newInvoice.clientAddress}
                    onChange={(e) => setNewInvoice({...newInvoice, clientAddress: e.target.value})}
                    placeholder="Enter client address"
                    rows="3"
                  />
                </div>
              </div>

              {/* Invoice Details Section */}
              <div className="form-section">
                <h4>Invoice Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label>Amount *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={newInvoice.date}
                      onChange={(e) => setNewInvoice({...newInvoice, date: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Payment Terms</label>
                    <select
                      value={newInvoice.paymentTerms}
                      onChange={(e) => setNewInvoice({...newInvoice, paymentTerms: e.target.value})}
                    >
                      <option value="Due on receipt">Due on receipt</option>
                      <option value="7 days">7 days</option>
                      <option value="14 days">14 days</option>
                      <option value="30 days">30 days</option>
                      <option value="60 days">60 days</option>
                      <option value="90 days">90 days</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Invoice Template</label>
                    <select
                      value={newInvoice.template}
                      onChange={(e) => setNewInvoice({...newInvoice, template: e.target.value})}
                    >
                      <option value="professional">Professional</option>
                      <option value="modern">Modern</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Description of Services/Products *</label>
                  <textarea
                    value={newInvoice.description}
                    onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                    placeholder="Describe the services or products provided"
                    rows="4"
                  />
                </div>
                
                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({...newInvoice, notes: e.target.value})}
                    placeholder="Any additional notes or terms"
                    rows="3"
                  />
                </div>
              </div>

              {/* Invoice Image Upload */}
              <div className="form-section">
                <h4>Invoice Image (Optional)</h4>
                <div className="image-upload-section">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleInvoiceImageUpload}
                    id="invoice-image-upload"
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="invoice-image-upload" className="image-upload-btn">
                    {newInvoice.invoiceImage ? 'Change Image' : 'Upload Invoice Image'}
                  </label>
                  {newInvoice.invoiceImage && (
                    <div className="image-preview">
                      <img src={newInvoice.invoiceImage} alt="Invoice preview" />
                      <button 
                        type="button" 
                        className="remove-image-btn"
                        onClick={() => setNewInvoice({...newInvoice, invoiceImage: null})}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <button className="create-btn" onClick={handleCreateInvoice}>
                Create Professional Invoice
              </button>
            </div>
          </div>

          <div className="invoices-list">
            <h3>Your Invoices</h3>
            {invoices.length === 0 ? (
              <p className="no-data">No invoices created yet.</p>
            ) : (
              <div className="invoices-grid">
                {invoices.map(invoice => (
                  <div key={invoice.id} className="invoice-card">
                    <div className="invoice-header">
                      <span className="invoice-id">#{invoice.id}</span>
                      <span className={`status ${invoice.status}`}>{invoice.status}</span>
                    </div>
                    <div className="invoice-details">
                      <h4>{invoice.clientName}</h4>
                      <p>Amount: £{parseFloat(invoice.amount).toFixed(2)}</p>
                      <p>Date: {invoice.date}</p>
                    </div>
                    <div className="invoice-actions">
                      <button 
                        className="pdf-btn"
                        onClick={() => generateInvoicePDF(invoice)}
                      >
                        Generate PDF
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="expenses-tab">
          <div className="upload-section">
            <h3>Upload Receipts</h3>
            <div 
              {...getRootProps()} 
              className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              {isProcessing ? (
                <div className="processing">
                  <div className="spinner"></div>
                  <p>Processing receipt...</p>
                </div>
              ) : (
                <div className="dropzone-content">
                  <p>Drag & drop receipt files here, or click to select files</p>
                  <p className="dropzone-hint">Supports: Images (JPG, PNG, GIF, BMP, WebP), PDF, HTML</p>
                </div>
              )}
            </div>
          </div>

          <div className="expenses-list">
            <h3>Your Expenses</h3>
            {expenses.length === 0 ? (
              <p className="no-data">No expenses recorded yet. Upload some receipts to get started!</p>
            ) : (
              <div className="expenses-grid">
                {expenses.map(expense => (
                  <div key={expense.id} className="expense-card">
                    <div className="expense-header">
                      <div className="expense-amount-section">
                        <span className="expense-amount">£{parseFloat(expense.amount).toFixed(2)}</span>
                        <span className={`file-type-badge ${expense.fileType || 'unknown'}`}>
                          {expense.fileType === 'image' ? '📷' : 
                           expense.fileType === 'pdf' ? '📄' : 
                           expense.fileType === 'html' ? '🌐' : '📁'}
                          {expense.fileType?.toUpperCase() || 'FILE'}
                        </span>
                      </div>
                      <span className="expense-date">{expense.date}</span>
                    </div>
                    <div className="expense-details">
                      <h4>{expense.filename}</h4>
                      {expense.vendor && (
                        <p className="expense-vendor">
                          <strong>Vendor:</strong> {expense.vendor}
                        </p>
                      )}
                      <p className="expense-description">{expense.description}</p>
                      <select 
                        value={expense.category}
                        onChange={(e) => {
                          const updatedExpenses = expenses.map(exp => 
                            exp.id === expense.id ? {...exp, category: e.target.value} : exp
                          );
                          setExpenses(updatedExpenses);
                        }}
                        className="category-select"
                      >
                        <option value="uncategorized">Uncategorized</option>
                        <option value="office-supplies">Office Supplies</option>
                        <option value="travel">Travel</option>
                        <option value="meals">Meals</option>
                        <option value="equipment">Equipment</option>
                        <option value="utilities">Utilities</option>
                        <option value="marketing">Marketing</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'customization' && (
        <div className="customization-tab">
          <div className="customization-section">
            <h3>Invoice Customization</h3>
            <p>Customize your invoice templates with your business branding and standard text.</p>
            
            <div className="customization-form">
              {/* Business Branding Section */}
              <div className="form-section">
                <h4>Business Branding</h4>
                
                <div className="logo-upload-section">
                  <label>Business Logo</label>
                  <div className="logo-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      id="logo-upload"
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="logo-upload" className="logo-upload-btn">
                      {customization.businessLogo ? 'Change Logo' : 'Upload Logo'}
                    </label>
                    {customization.businessLogo && (
                      <div className="logo-preview">
                        <img src={customization.businessLogo} alt="Business logo preview" />
                        <button 
                          type="button" 
                          className="remove-logo-btn"
                          onClick={() => setCustomization({...customization, businessLogo: null})}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Business Name</label>
                    <input
                      type="text"
                      value={customization.businessName}
                      onChange={(e) => setCustomization({...customization, businessName: e.target.value})}
                      placeholder="Your Business Name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Business Email</label>
                    <input
                      type="email"
                      value={customization.businessEmail}
                      onChange={(e) => setCustomization({...customization, businessEmail: e.target.value})}
                      placeholder="business@example.com"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Business Phone</label>
                    <input
                      type="tel"
                      value={customization.businessPhone}
                      onChange={(e) => setCustomization({...customization, businessPhone: e.target.value})}
                      placeholder="+44 123 456 7890"
                    />
                  </div>
                  <div className="form-group">
                    <label>Business Website</label>
                    <input
                      type="url"
                      value={customization.businessWebsite}
                      onChange={(e) => setCustomization({...customization, businessWebsite: e.target.value})}
                      placeholder="https://www.yourbusiness.com"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Tax/VAT Number</label>
                    <input
                      type="text"
                      value={customization.taxNumber}
                      onChange={(e) => setCustomization({...customization, taxNumber: e.target.value})}
                      placeholder="GB123456789"
                    />
                  </div>
                  <div className="form-group">
                    <label>Color Scheme</label>
                    <select
                      value={customization.colorScheme}
                      onChange={(e) => setCustomization({...customization, colorScheme: e.target.value})}
                    >
                      <option value="professional">Professional</option>
                      <option value="modern">Modern</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Business Address</label>
                  <textarea
                    value={customization.businessAddress}
                    onChange={(e) => setCustomization({...customization, businessAddress: e.target.value})}
                    placeholder="Enter your business address"
                    rows="3"
                  />
                </div>
              </div>

              {/* Standard Text Section */}
              <div className="form-section">
                <h4>Standard Text & Terms</h4>
                
                <div className="form-group">
                  <label>Standard Payment Terms</label>
                  <textarea
                    value={customization.standardTerms}
                    onChange={(e) => setCustomization({...customization, standardTerms: e.target.value})}
                    placeholder="Payment is due within 30 days of invoice date. Late payments may incur additional charges."
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label>Standard Notes</label>
                  <textarea
                    value={customization.standardNotes}
                    onChange={(e) => setCustomization({...customization, standardNotes: e.target.value})}
                    placeholder="Thank you for your business!"
                    rows="3"
                  />
                </div>
                
                <div className="form-group">
                  <label>Footer Text</label>
                  <textarea
                    value={customization.footerText}
                    onChange={(e) => setCustomization({...customization, footerText: e.target.value})}
                    placeholder="For any queries regarding this invoice, please contact us."
                    rows="2"
                  />
                </div>
              </div>
              
              <div className="customization-actions">
                <button 
                  className="save-customization-btn"
                  onClick={() => {
                    // Apply customization to current invoice form
                    setNewInvoice(prev => ({
                      ...prev,
                      businessName: customization.businessName || prev.businessName,
                      businessEmail: customization.businessEmail || prev.businessEmail,
                      businessPhone: customization.businessPhone || prev.businessPhone,
                      businessAddress: customization.businessAddress || prev.businessAddress,
                      taxNumber: customization.taxNumber || prev.taxNumber
                    }));
                    alert('Customization saved and applied to invoice form!');
                  }}
                >
                  Save & Apply to Invoice Form
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div className="export-tab">
          <h3>Export Data for Monthly Profit Calculations</h3>
          <p>Export your invoices and expenses data to use in the monthly profit calculator.</p>
          
          <div className="export-summary">
            <div className="summary-item">
              <h4>Total Invoices</h4>
              <p>{invoices.length}</p>
            </div>
            <div className="summary-item">
              <h4>Total Invoice Value</h4>
              <p>£{invoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0).toFixed(2)}</p>
            </div>
            <div className="summary-item">
              <h4>Total Expenses</h4>
              <p>{expenses.length}</p>
            </div>
            <div className="summary-item">
              <h4>Total Expense Value</h4>
              <p>£{expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0).toFixed(2)}</p>
            </div>
          </div>
          
          <button className="export-btn" onClick={exportData}>
            Export Data as JSON
          </button>
        </div>
      )}
      
      <Navigation showRelatedTools={false} />
    </div>
  );
};

export default InvoicesAndReceipts;
