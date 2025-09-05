import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import jsPDF from 'jspdf';
import Tesseract from 'tesseract.js';
import './InvoicesAndReceipts.css';

const InvoicesAndReceipts = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
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
    
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save data to localStorage whenever invoices or expenses change
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

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
      businessName: '',
      businessAddress: '',
      businessEmail: '',
      businessPhone: '',
      taxNumber: '',
      paymentTerms: '30 days',
      notes: ''
    });
  };

  // Generate professional PDF for invoice
  const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Colors
    const primaryColor = [44, 62, 80]; // Dark blue
    const accentColor = [52, 152, 219]; // Light blue
    const lightGray = [245, 245, 245];
    
    // Header with gradient effect
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Business name and logo area
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.businessName || 'Your Business Name', 20, 25);
    
    // Invoice title
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 60, 30);
    
    // Invoice details box
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(pageWidth - 80, 60, 70, 40, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Invoice #', pageWidth - 75, 70);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.id, pageWidth - 75, 78);
    
    doc.setFont('helvetica', 'normal');
    doc.text('Date', pageWidth - 75, 88);
    doc.setFont('helvetica', 'bold');
    doc.text(invoice.date, pageWidth - 75, 96);
    
    // Business details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('From:', 20, 70);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    let yPos = 78;
    if (invoice.businessName) {
      doc.text(invoice.businessName, 20, yPos);
      yPos += 8;
    }
    if (invoice.businessAddress) {
      const addressLines = invoice.businessAddress.split('\n');
      addressLines.forEach((line, index) => {
        doc.text(line, 20, yPos + (index * 6));
      });
      yPos += addressLines.length * 6 + 4;
    }
    if (invoice.businessEmail) {
      doc.text(invoice.businessEmail, 20, yPos);
      yPos += 6;
    }
    if (invoice.businessPhone) {
      doc.text(invoice.businessPhone, 20, yPos);
    }
    
    // Client details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, 120);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    
    yPos = 128;
    doc.text(invoice.clientName, 20, yPos);
    yPos += 8;
    
    if (invoice.clientEmail) {
      doc.text(invoice.clientEmail, 20, yPos);
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
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);
    
    // Items table header
    yPos += 15;
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(20, yPos - 8, pageWidth - 40, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, yPos - 2);
    doc.text('Amount', pageWidth - 45, yPos - 2);
    
    // Items
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    yPos += 5;
    
    // Description
    const description = invoice.description || 'Services rendered';
    const descriptionLines = doc.splitTextToSize(description, pageWidth - 80);
    descriptionLines.forEach((line, index) => {
      doc.text(line, 25, yPos + (index * 6));
    });
    
    // Amount
    const amount = `£${parseFloat(invoice.amount).toFixed(2)}`;
    doc.setFont('helvetica', 'bold');
    doc.text(amount, pageWidth - 45, yPos);
    
    // Total section
    yPos += Math.max(descriptionLines.length * 6, 15) + 20;
    
    // Total box
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.rect(pageWidth - 80, yPos, 60, 20, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total', pageWidth - 75, yPos + 8);
    doc.text(amount, pageWidth - 45, yPos + 8);
    
    // Payment terms
    if (invoice.paymentTerms) {
      yPos += 40;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Payment Terms: ${invoice.paymentTerms}`, 20, yPos);
    }
    
    // Notes
    if (invoice.notes) {
      yPos += 15;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Notes:', 20, yPos);
      const notesLines = doc.splitTextToSize(invoice.notes, pageWidth - 40);
      notesLines.forEach((line, index) => {
        doc.text(line, 20, yPos + 8 + (index * 6));
      });
    }
    
    // Footer
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Thank you for your business!', 20, footerY);
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

  // Handle file drop for receipts
  const onDrop = async (acceptedFiles) => {
    setIsProcessing(true);
    
    for (const file of acceptedFiles) {
      try {
        // Process image with OCR
        const { data: { text } } = await Tesseract.recognize(file, 'eng');
        
        // Extract amount and date from OCR text
        const amountMatch = text.match(/£?(\d+\.?\d*)/g);
        const dateMatch = text.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g);
        
        const expense = {
          id: generateId(),
          filename: file.name,
          amount: amountMatch ? amountMatch[0].replace('£', '') : '0',
          date: dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0],
          description: text.substring(0, 100) + '...',
          fullText: text,
          category: 'uncategorized',
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
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
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
                  <p>Drag & drop receipt images here, or click to select files</p>
                  <p className="dropzone-hint">Supports: JPG, PNG, GIF, BMP, WebP</p>
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
                      <span className="expense-amount">£{parseFloat(expense.amount).toFixed(2)}</span>
                      <span className="expense-date">{expense.date}</span>
                    </div>
                    <div className="expense-details">
                      <h4>{expense.filename}</h4>
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
    </div>
  );
};

export default InvoicesAndReceipts;
