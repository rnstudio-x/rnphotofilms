import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaFileInvoice, FaDownload, FaEnvelope, FaEye, FaEdit,
  FaUser, FaCalendarAlt, FaMoneyBillWave, FaPhone,
  FaTimes, FaSave, FaCheckCircle, FaPrint, FaPlus,
  FaCalculator, FaPercentage, FaReceipt
} from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' 

const InvoiceGenerator = () => {
  // ==================== STATE MANAGEMENT ====================
  const [events, setEvents] = useState([])
  const [leads, setLeads] = useState([]) // ✅ Already defined
  const [payments, setPayments] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedLead, setSelectedLead] = useState(null)
  const [pdfBlob, setPdfBlob] = useState(null)
  
  // Invoice Form State
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    eventType: '',
    eventDate: '',
    items: [
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    subtotal: 0,
    discount: 0,
    discountType: 'percentage',
    taxRate: 18,
    taxAmount: 0,
    totalAmount: 0,
    paidAmount: 0,
    balanceAmount: 0,
    paymentStatus: 'Pending',
    notes: '',
    terms: 'Payment due within 7 days. Late payments may incur additional charges.'
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyCFoBNyXT8fmTmlG9RwMO7QVgcuaVpgEUynu-hbG4Hl-zVJf09ArlCbSXNhBX9jDUcpg/exec'

  // ==================== DATA FETCHING ====================
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    calculateTotals()
  }, [invoiceData.items, invoiceData.discount, invoiceData.discountType, invoiceData.taxRate])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // ✅ FIXED: Fetch Leads
      const leadsResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getLeads' })
      })
      const leadsResult = await leadsResponse.json()
      if (leadsResult.success) {
        setLeads(leadsResult.leads || [])
      }

      const eventsResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getEvents' })
      })
      const eventsResult = await eventsResponse.json()
      if (eventsResult.success) {
        setEvents(eventsResult.events || [])
      }

      const paymentsResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getPayments' })
      })
      const paymentsResult = await paymentsResponse.json()
      if (paymentsResult.success) {
        setPayments(paymentsResult.payments || [])
      }

      const invoicesResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getInvoices' })
      })
      const invoicesResult = await invoicesResponse.json()
      if (invoicesResult.success) {
        setInvoices(invoicesResult.invoices || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // ==================== INVOICE NUMBER GENERATION ====================
  const generateInvoiceNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `INV-${year}${month}-${random}`
  }

  // ==================== AUTO-FILL FUNCTIONS ====================
  const handleSelectLead = (lead) => {
    const invoiceNumber = generateInvoiceNumber()
    
    setInvoiceData({
      ...invoiceData,
      invoiceNumber: invoiceNumber,
      clientName: lead['Client Name'] || '',
      clientEmail: lead.Email || '',
      clientPhone: lead.Phone || '',
      eventType: lead['Event Type'] || '',
      eventDate: lead['Event Date'] || '',
      items: [
        {
          description: `${lead['Event Type']} Photography & Videography Package`,
          quantity: 1,
          rate: 0,
          amount: 0
        }
      ]
    })
    
    setIsGenerateModalOpen(true)
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    
    const invoiceNumber = generateInvoiceNumber()
    
    setInvoiceData({
      ...invoiceData,
      invoiceNumber: invoiceNumber,
      clientName: event.clientName || '',
      clientEmail: event.email || '',
      clientPhone: event.phone || '',
      eventType: event.eventType || '',
      eventDate: event.eventDate || '',
      items: [
        {
          description: `${event.eventType} Photography & Videography Package`,
          quantity: 1,
          rate: parseFloat(event.amount || 0),
          amount: parseFloat(event.amount || 0)
        }
      ]
    })
    
    setIsGenerateModalOpen(true)
  }

  // ==================== CALCULATIONS ====================
  const calculateTotals = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.amount || 0), 0)
    
    let discountAmount = 0
    if (invoiceData.discountType === 'percentage') {
      discountAmount = (subtotal * (invoiceData.discount || 0)) / 100
    } else {
      discountAmount = invoiceData.discount || 0
    }
    
    const afterDiscount = subtotal - discountAmount
    const taxAmount = (afterDiscount * (invoiceData.taxRate || 0)) / 100
    const totalAmount = afterDiscount + taxAmount
    const balanceAmount = totalAmount - (invoiceData.paidAmount || 0)
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal: subtotal,
      taxAmount: taxAmount,
      totalAmount: totalAmount,
      balanceAmount: balanceAmount
    }))
  }

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    })
  }

  const removeItem = (index) => {
    const updatedItems = invoiceData.items.filter((_, i) => i !== index)
    setInvoiceData({ ...invoiceData, items: updatedItems })
  }

  const updateItem = (index, field, value) => {
    const updatedItems = [...invoiceData.items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate
    }
    
    setInvoiceData({ ...invoiceData, items: updatedItems })
  }

  const generateInvoicePDF = () => {
  const doc = new jsPDF()
  
  // Company Header
  doc.setFillColor(79, 70, 229)
  doc.rect(0, 0, 210, 50, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(32)
  doc.setFont('helvetica', 'bold')
  doc.text('RN PHOTOFILMS', 15, 25)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Professional Photography & Videography', 15, 32)
  doc.text('Email: rnstudio.x@gmail.com | Phone: +91 8239372489', 15, 38)
  
  // Invoice Title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('INVOICE', 150, 25)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, 150, 32)
  doc.text(`Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN')}`, 150, 38)
  
  // Bill To
  let yPos = 60
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('BILL TO:', 15, yPos)
  yPos += 8
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(invoiceData.clientName, 15, yPos)
  yPos += 6
  if (invoiceData.clientEmail) {
    doc.text(`Email: ${invoiceData.clientEmail}`, 15, yPos)
    yPos += 6
  }
  if (invoiceData.clientPhone) {
    doc.text(`Phone: ${invoiceData.clientPhone}`, 15, yPos)
    yPos += 6
  }
  if (invoiceData.clientAddress) {
    const addressLines = doc.splitTextToSize(invoiceData.clientAddress, 80)
    doc.text(addressLines, 15, yPos)
    yPos += (addressLines.length * 6)
  }
  
  yPos += 10
  
  // ✅ MANUAL TABLE (Without autoTable)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  
  // Table Header
  doc.setFillColor(79, 70, 229)
  doc.rect(15, yPos, 180, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text('Description', 20, yPos + 7)
  doc.text('Qty', 120, yPos + 7)
  doc.text('Rate', 145, yPos + 7)
  doc.text('Amount', 170, yPos + 7, { align: 'right' })
  yPos += 10
  
  // Table Body
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  
  let rowColor = true
  invoiceData.items.forEach((item, index) => {
    // Alternate row colors
    if (rowColor) {
      doc.setFillColor(245, 245, 245)
      doc.rect(15, yPos, 180, 8, 'F')
    }
    rowColor = !rowColor
    
    // Item data
    const descLines = doc.splitTextToSize(item.description, 90)
    doc.text(descLines[0], 20, yPos + 6)
    doc.text(item.quantity.toString(), 125, yPos + 6, { align: 'center' })
    doc.text(`₹${parseFloat(item.rate || 0).toLocaleString('en-IN')}`, 150, yPos + 6, { align: 'right' })
    doc.text(`₹${parseFloat(item.amount || 0).toLocaleString('en-IN')}`, 190, yPos + 6, { align: 'right' })
    
    yPos += 8
  })
  
  // Table border
  doc.setDrawColor(200, 200, 200)
  doc.rect(15, yPos - (invoiceData.items.length * 8), 180, invoiceData.items.length * 8)
  
  yPos += 10
  
  // Totals
  const totalsX = 130
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('Subtotal:', totalsX, yPos)
  doc.text(`₹${(invoiceData.subtotal || 0).toLocaleString('en-IN')}`, 190, yPos, { align: 'right' })
  yPos += 7
  
  if (invoiceData.discount > 0) {
    const discountText = invoiceData.discountType === 'percentage' 
      ? `Discount (${invoiceData.discount}%):`
      : 'Discount:'
    const discountAmount = invoiceData.discountType === 'percentage'
      ? (invoiceData.subtotal * invoiceData.discount) / 100
      : invoiceData.discount
    
    doc.text(discountText, totalsX, yPos)
    doc.text(`-₹${discountAmount.toLocaleString('en-IN')}`, 190, yPos, { align: 'right' })
    yPos += 7
  }
  
  if (invoiceData.taxRate > 0) {
    doc.text(`GST (${invoiceData.taxRate}%):`, totalsX, yPos)
    doc.text(`₹${(invoiceData.taxAmount || 0).toLocaleString('en-IN')}`, 190, yPos, { align: 'right' })
    yPos += 7
  }
  
  // Total Amount
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setFillColor(79, 70, 229)
  doc.rect(125, yPos - 5, 70, 10, 'F')
  doc.setTextColor(255, 255, 255)
  doc.text('Total Amount:', totalsX, yPos)
  doc.text(`₹${(invoiceData.totalAmount || 0).toLocaleString('en-IN')}`, 190, yPos, { align: 'right' })
  yPos += 12
  
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  
  if (invoiceData.paidAmount > 0) {
    doc.text('Paid Amount:', totalsX, yPos)
    doc.text(`₹${(invoiceData.paidAmount || 0).toLocaleString('en-IN')}`, 190, yPos, { align: 'right' })
    yPos += 7
    
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(220, 38, 38)
    doc.text('Balance Due:', totalsX, yPos)
    doc.text(`₹${(invoiceData.balanceAmount || 0).toLocaleString('en-IN')}`, 190, yPos, { align: 'right' })
  }
  
  // Notes
  yPos += 15
  if (invoiceData.notes) {
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Notes:', 15, yPos)
    yPos += 7
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const notesLines = doc.splitTextToSize(invoiceData.notes, 180)
    doc.text(notesLines, 15, yPos)
    yPos += (notesLines.length * 5) + 8
  }
  
  if (invoiceData.terms) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Terms & Conditions:', 15, yPos)
    yPos += 7
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const termsLines = doc.splitTextToSize(invoiceData.terms, 180)
    doc.text(termsLines, 15, yPos)
  }
  
  // Footer
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text('Thank you for your business!', 105, 285, { align: 'center' })
  doc.text('This is a computer-generated invoice.', 105, 290, { align: 'center' })
  
  return doc
}
    // ==================== HANDLERS ====================

  const handlePreviewInvoice = () => {
    const doc = generateInvoicePDF()
    const blob = doc.output('blob')
    setPdfBlob(blob)
    setIsPreviewModalOpen(true)
  }

  const handleDownloadInvoice = () => {
    const doc = generateInvoicePDF()
    const filename = `Invoice_${invoiceData.invoiceNumber}_${invoiceData.clientName.replace(/\s+/g, '_')}.pdf`
    doc.save(filename)
    alert('✅ Invoice downloaded successfully!')
  }

  const handleEmailInvoice = async () => {
    if (!invoiceData.clientEmail) {
      alert('⚠️ Client email is required!')
      return
    }

    const doc = generateInvoicePDF()
    const pdfBase64 = doc.output('dataurlstring').split(',')[1]

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'sendInvoiceEmail',
          invoiceNumber: invoiceData.invoiceNumber,
          clientName: invoiceData.clientName,
          clientEmail: invoiceData.clientEmail,
          totalAmount: invoiceData.totalAmount,
          balanceAmount: invoiceData.balanceAmount,
          pdfData: pdfBase64,
          filename: `Invoice_${invoiceData.invoiceNumber}.pdf`
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Invoice sent via email successfully!')
      } else {
        alert('❌ Failed to send email: ' + result.message)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('❌ Failed to send invoice via email')
    }
  }

  const handleSaveInvoice = async () => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'saveInvoice',
          ...invoiceData
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Invoice saved successfully!')
        setIsGenerateModalOpen(false)
        fetchData()
      } else {
        alert('❌ Failed to save invoice: ' + result.message)
      }
    } catch (error) {
      console.error('Error saving invoice:', error)
      alert('❌ Failed to save invoice')
    }
  }

  // ==================== HELPER FUNCTIONS ====================
  const formatCurrency = (amount) => {
    return '₹' + parseFloat(amount || 0).toLocaleString('en-IN')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // ==================== RENDER ====================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <FaFileInvoice className="text-blue-600" />
          Invoice Generator
        </h1>
        <p className="text-gray-600">Create and manage professional invoices for your clients</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* ✅ Select from Leads */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-blue-600" />
            Select from Leads
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {leads.filter(l => l.Status === 'Converted').slice(0, 10).map(lead => (
              <button
                key={lead.id}
                onClick={() => handleSelectLead(lead)}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="font-medium text-gray-900 text-sm">{lead['Client Name']}</div>
                <div className="text-xs text-gray-600">{lead['Event Type']} • {lead['Event Date']}</div>
              </button>
            ))}
            {leads.filter(l => l.Status === 'Converted').length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No converted leads</p>
            )}
          </div>
        </div>

        {/* Select from Events */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600" />
            Select from Events
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {events.slice(0, 10).map(event => (
              <button
                key={event.id}
                onClick={() => handleSelectEvent(event)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{event.clientName}</div>
                    <div className="text-sm text-gray-600">{event.eventType} • {event.eventDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-purple-600">{formatCurrency(event.amount)}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaReceipt className="text-green-600" />
            Recent Invoices
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {invoices.slice(0, 10).map(invoice => (
              <div
                key={invoice.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-600">{invoice.clientName} • {formatDate(invoice.invoiceDate)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">{formatCurrency(invoice.totalAmount)}</div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      invoice.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                      invoice.paymentStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate from Scratch */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <button
          onClick={() => {
            setInvoiceData({
              ...invoiceData,
              invoiceNumber: generateInvoiceNumber()
            })
            setIsGenerateModalOpen(true)
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-3 text-lg"
        >
          <FaFileInvoice className="text-2xl" />
          Generate New Invoice from Scratch
        </button>
      </div>
            {/* ==================== GENERATE INVOICE MODAL ==================== */}
      <AnimatePresence>
        {isGenerateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setIsGenerateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaFileInvoice />
                      Generate Invoice
                    </h2>
                    <p className="text-blue-100 mt-1">Invoice #{invoiceData.invoiceNumber}</p>
                  </div>
                  <button
                    onClick={() => setIsGenerateModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Invoice Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Invoice Number *
                      </label>
                      <input
                        type="text"
                        value={invoiceData.invoiceNumber}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Invoice Date *
                      </label>
                      <input
                        type="date"
                        value={invoiceData.invoiceDate}
                        onChange={(e) => setInvoiceData({...invoiceData, invoiceDate: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Client Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Client Name *
                        </label>
                        <input
                          type="text"
                          value={invoiceData.clientName}
                          onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter client name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={invoiceData.clientEmail}
                          onChange={(e) => setInvoiceData({...invoiceData, clientEmail: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="client@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={invoiceData.clientPhone}
                          onChange={(e) => setInvoiceData({...invoiceData, clientPhone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="9876543210"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={invoiceData.clientAddress}
                          onChange={(e) => setInvoiceData({...invoiceData, clientAddress: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Client address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Invoice Items */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Invoice Items</h3>
                      <button
                        onClick={addItem}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaPlus />
                        Add Item
                      </button>
                    </div>

                    <div className="space-y-3">
                      {invoiceData.items.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-12 md:col-span-5">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Description
                              </label>
                              <input
                                type="text"
                                value={item.description}
                                onChange={(e) => updateItem(index, 'description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Service description"
                              />
                            </div>

                            <div className="col-span-4 md:col-span-2">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Qty
                              </label>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                min="1"
                              />
                            </div>

                            <div className="col-span-4 md:col-span-2">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Rate (₹)
                              </label>
                              <input
                                type="number"
                                value={item.rate}
                                onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                min="0"
                              />
                            </div>

                            <div className="col-span-3 md:col-span-2">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Amount
                              </label>
                              <input
                                type="text"
                                value={formatCurrency(item.amount)}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-sm font-semibold"
                              />
                            </div>

                            <div className="col-span-1 flex items-end">
                              <button
                                onClick={() => removeItem(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                disabled={invoiceData.items.length === 1}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Calculations</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Type
                        </label>
                        <select
                          value={invoiceData.discountType}
                          onChange={(e) => setInvoiceData({...invoiceData, discountType: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (₹)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount {invoiceData.discountType === 'percentage' ? '(%)' : '(₹)'}
                        </label>
                        <input
                          type="number"
                          value={invoiceData.discount}
                          onChange={(e) => setInvoiceData({...invoiceData, discount: parseFloat(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tax Rate (%)
                        </label>
                        <input
                          type="number"
                          value={invoiceData.taxRate}
                          onChange={(e) => setInvoiceData({...invoiceData, taxRate: parseFloat(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>

                    {/* Totals Display */}
                    <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal:</span>
                          <span className="font-semibold">{formatCurrency(invoiceData.subtotal)}</span>
                        </div>
                        {invoiceData.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount:</span>
                            <span className="font-semibold text-red-600">
                              -{formatCurrency(
                                invoiceData.discountType === 'percentage'
                                  ? (invoiceData.subtotal * invoiceData.discount) / 100
                                  : invoiceData.discount
                              )}
                            </span>
                          </div>
                        )}
                        {invoiceData.taxRate > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax ({invoiceData.taxRate}%):</span>
                            <span className="font-semibold">{formatCurrency(invoiceData.taxAmount)}</span>
                          </div>
                        )}
                        <div className="border-t-2 border-gray-200 pt-2">
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-900">Total Amount:</span>
                            <span className="font-bold text-blue-600 text-lg">{formatCurrency(invoiceData.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Paid Amount (₹)
                        </label>
                        <input
                          type="number"
                          value={invoiceData.paidAmount}
                          onChange={(e) => setInvoiceData({...invoiceData, paidAmount: parseFloat(e.target.value) || 0})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Balance Due (₹)
                        </label>
                        <input
                          type="text"
                          value={formatCurrency(invoiceData.balanceAmount)}
                          readOnly
                          className="w-full px-4 py-3 border-2 border-red-300 rounded-lg bg-red-50 font-bold text-red-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes & Terms */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={invoiceData.notes}
                        onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        placeholder="Any additional notes..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Terms & Conditions
                      </label>
                      <textarea
                        value={invoiceData.terms}
                        onChange={(e) => setInvoiceData({...invoiceData, terms: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        placeholder="Payment terms..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 rounded-b-2xl flex flex-wrap gap-3">
                <button
                  onClick={handlePreviewInvoice}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaEye />
                  Preview
                </button>
                <button
                  onClick={handleDownloadInvoice}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaDownload />
                  Download
                </button>
                <button
                  onClick={handleEmailInvoice}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaEnvelope />
                  Email
                </button>
                <button
                  onClick={handleSaveInvoice}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaSave />
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== PREVIEW MODAL ==================== */}
      <AnimatePresence>
        {isPreviewModalOpen && pdfBlob && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setIsPreviewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col"
            >
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Invoice Preview</h2>
                  <p className="text-indigo-100 text-sm mt-1">#{invoiceData.invoiceNumber}</p>
                </div>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* PDF Viewer */}
              <div className="flex-1 overflow-auto p-6">
                <iframe
                  src={URL.createObjectURL(pdfBlob)}
                  className="w-full h-full min-h-[600px] border border-gray-300 rounded-lg"
                  title="Invoice Preview"
                />
              </div>

              {/* Preview Footer */}
              <div className="bg-gray-50 p-4 rounded-b-2xl flex gap-3">
                <button
                  onClick={handleDownloadInvoice}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaDownload />
                  Download
                </button>
                <button
                  onClick={handleEmailInvoice}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaEnvelope />
                  Send via Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default InvoiceGenerator

