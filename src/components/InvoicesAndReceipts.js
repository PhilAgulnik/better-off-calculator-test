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
    status: 'draft'
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
      status: 'draft'
    });
  };

  // Generate PDF for invoice
  const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('INVOICE', 20, 30);
    
    // Invoice details
    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.id}`, 20, 50);
    doc.text(`Date: ${invoice.date}`, 20, 60);
    doc.text(`Status: ${invoice.status.toUpperCase()}`, 20, 70);
    
    // Client details
    doc.text('Bill To:', 20, 90);
    doc.text(invoice.clientName, 20, 100);
    if (invoice.clientEmail) {
      doc.text(invoice.clientEmail, 20, 110);
    }
    if (invoice.clientAddress) {
      const addressLines = invoice.clientAddress.split('\n');
      addressLines.forEach((line, index) => {
        doc.text(line, 20, 120 + (index * 10));
      });
    }
    
    // Description and amount
    doc.text('Description:', 20, 160);
    doc.text(invoice.description || 'Services rendered', 20, 170);
    
    doc.text('Amount:', 120, 190);
    doc.text(`£${parseFloat(invoice.amount).toFixed(2)}`, 150, 190);
    
    // Save the PDF
    doc.save(`invoice-${invoice.id}.pdf`);
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
            <h3>Create New Invoice</h3>
            <div className="invoice-form">
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
                  <label>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Client Email</label>
                  <input
                    type="email"
                    value={newInvoice.clientEmail}
                    onChange={(e) => setNewInvoice({...newInvoice, clientEmail: e.target.value})}
                    placeholder="client@example.com"
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
              
              <div className="form-group">
                <label>Client Address</label>
                <textarea
                  value={newInvoice.clientAddress}
                  onChange={(e) => setNewInvoice({...newInvoice, clientAddress: e.target.value})}
                  placeholder="Enter client address"
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newInvoice.description}
                  onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                  placeholder="Describe the services or products"
                  rows="3"
                />
              </div>
              
              <button className="create-btn" onClick={handleCreateInvoice}>
                Create Invoice
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
