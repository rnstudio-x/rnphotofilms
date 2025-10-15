import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaFileContract, FaDownload, FaEnvelope, FaEye, FaEdit,
  FaUser, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaMobileAlt,
  FaTimes, FaSave, FaCheckCircle, FaFileAlt, FaPrint, FaSearch
} from 'react-icons/fa'
import jsPDF from 'jspdf'

const ContractGenerator = () => {
  // ==================== STATE MANAGEMENT ====================
  const [leads, setLeads] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [pdfBlob, setPdfBlob] = useState(null)
  
  // Contract Form State
  const [contractData, setContractData] = useState({
    contractType: 'Wedding',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    eventType: '',
    eventDate: '',
    eventVenue: '',
    packageDetails: '',
    totalAmount: '',
    advanceAmount: '',
    balanceAmount: '',
    deliverables: '',
    deliveryTimeline: '45 days',
    termsAndConditions: '',
    additionalNotes: ''
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxi6nrVP676nRlRbIx3Bgm4MhMkkWWDUzR1m-gHGWa39PsyhOzmI8MMICo451w4LEjm/exec'

  // Contract Templates
  const contractTemplates = [
    { value: 'Wedding', label: 'Wedding Videography', icon: '💒' },
    { value: 'Event', label: 'Event Videography', icon: '🎉' },
    { value: 'Commercial', label: 'Commercial Shoot', icon: '🎬' },
    { value: 'Product', label: 'Product Photography', icon: '📦' },
    { value: 'RealEstate', label: 'Real Estate', icon: '🏠' },
    { value: 'Music', label: 'Music Video', icon: '🎵' }
  ]

  // ==================== DATA FETCHING ====================
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
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
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // ==================== AUTO-FILL FUNCTIONS ====================
  const handleSelectLead = (lead) => {
    setSelectedLead(lead)
    setContractData({
      ...contractData,
      contractType: lead['Event Type'] || 'Wedding',
      clientName: lead['Client Name'] || '',
      clientEmail: lead.Email || '',
      clientPhone: lead.Phone || '',
      eventType: lead['Event Type'] || '',
      eventDate: lead['Event Date'] || '',
      eventVenue: lead.Venue || ''
    })
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setContractData({
      ...contractData,
      contractType: event.eventType || 'Wedding',
      clientName: event.clientName || '',
      clientEmail: event.email || '',
      clientPhone: event.phone || '',
      eventType: event.eventType || '',
      eventDate: event.eventDate || '',
      eventVenue: event.venue || ''
    })
  }

  // ==================== PDF GENERATION ====================
  const generateContractPDF = () => {
    const doc = new jsPDF()
    
    // Company Header
    doc.setFillColor(79, 70, 229) // Indigo
    doc.rect(0, 0, 210, 40, 'F')
    
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(28)
    doc.setFont('helvetica', 'bold')
    doc.text('RN PHOTOFILMS', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Professional Photography & Videography Services', 105, 28, { align: 'center' })
    doc.text('Email: rnstudio.x@gmail.com | Phone: +91 XXXXXXXXXX', 105, 35, { align: 'center' })
    
    // Contract Title
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(`${contractData.contractType} VIDEOGRAPHY AGREEMENT`, 105, 55, { align: 'center' })
    
    // Date
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 15, 65)
    
    // Contract Content
    let yPos = 75
    
    // Section 1: Client Information
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(238, 242, 255)
    doc.rect(15, yPos, 180, 8, 'F')
    doc.text('1. CLIENT INFORMATION', 20, yPos + 6)
    yPos += 15
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Client Name: ${contractData.clientName}`, 20, yPos)
    yPos += 7
    doc.text(`Email: ${contractData.clientEmail}`, 20, yPos)
    yPos += 7
    doc.text(`Phone: ${contractData.clientPhone}`, 20, yPos)
    yPos += 7
    if (contractData.clientAddress) {
      doc.text(`Address: ${contractData.clientAddress}`, 20, yPos)
      yPos += 7
    }
    yPos += 5
    
    // Section 2: Event Details
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(238, 242, 255)
    doc.rect(15, yPos, 180, 8, 'F')
    doc.text('2. EVENT DETAILS', 20, yPos + 6)
    yPos += 15
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`Event Type: ${contractData.eventType}`, 20, yPos)
    yPos += 7
    doc.text(`Event Date: ${contractData.eventDate}`, 20, yPos)
    yPos += 7
    doc.text(`Venue: ${contractData.eventVenue}`, 20, yPos)
    yPos += 10
    
    // Section 3: Package & Pricing
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(238, 242, 255)
    doc.rect(15, yPos, 180, 8, 'F')
    doc.text('3. PACKAGE & PRICING', 20, yPos + 6)
    yPos += 15
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    
    if (contractData.packageDetails) {
      const packageLines = doc.splitTextToSize(`Package Details: ${contractData.packageDetails}`, 170)
      doc.text(packageLines, 20, yPos)
      yPos += (packageLines.length * 7) + 3
    }
    
    doc.text(`Total Amount: ₹${contractData.totalAmount}`, 20, yPos)
    yPos += 7
    doc.text(`Advance Paid: ₹${contractData.advanceAmount}`, 20, yPos)
    yPos += 7
    doc.text(`Balance Due: ₹${contractData.balanceAmount}`, 20, yPos)
    yPos += 10
    
    // Section 4: Deliverables
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(238, 242, 255)
    doc.rect(15, yPos, 180, 8, 'F')
    doc.text('4. DELIVERABLES', 20, yPos + 6)
    yPos += 15
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    
    if (contractData.deliverables) {
      const deliverableLines = doc.splitTextToSize(contractData.deliverables, 170)
      doc.text(deliverableLines, 20, yPos)
      yPos += (deliverableLines.length * 7) + 3
    }
    
    doc.text(`Delivery Timeline: ${contractData.deliveryTimeline}`, 20, yPos)
    yPos += 10
    
    // Check if new page needed
    if (yPos > 240) {
      doc.addPage()
      yPos = 20
    }
    
    // Section 5: Terms & Conditions
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(238, 242, 255)
    doc.rect(15, yPos, 180, 8, 'F')
    doc.text('5. TERMS & CONDITIONS', 20, yPos + 6)
    yPos += 15
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    const defaultTerms = [
      '1. The advance payment is non-refundable.',
      '2. Balance payment must be made before final delivery.',
      '3. All raw footage remains the property of RN PhotoFilms.',
      '4. Edited videos will be delivered within the specified timeline.',
      '5. Weather conditions or unforeseen circumstances may affect coverage.',
      '6. Client must provide meal and rest facilities for the crew if event exceeds 8 hours.',
      '7. Travel and accommodation charges (if applicable) will be billed separately.',
      '8. Copyright of all deliverables belongs to RN PhotoFilms unless otherwise agreed.'
    ]
    
    const termsToUse = contractData.termsAndConditions || defaultTerms.join('\n')
    const termsLines = doc.splitTextToSize(termsToUse, 170)
    doc.text(termsLines, 20, yPos)
    yPos += (termsLines.length * 5) + 10
    
    // Additional Notes
    if (contractData.additionalNotes) {
      if (yPos > 240) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('6. ADDITIONAL NOTES', 20, yPos)
      yPos += 10
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const notesLines = doc.splitTextToSize(contractData.additionalNotes, 170)
      doc.text(notesLines, 20, yPos)
      yPos += (notesLines.length * 5) + 15
    }
    
    // Signatures
    if (yPos > 220) {
      doc.addPage()
      yPos = 20
    }
    
    yPos += 20
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    
    // Client Signature
    doc.line(20, yPos, 80, yPos)
    doc.text('Client Signature', 20, yPos + 7)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text(contractData.clientName, 20, yPos + 12)
    
    // Company Signature
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.line(130, yPos, 190, yPos)
    doc.text('Authorized Signatory', 130, yPos + 7)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('RN PhotoFilms', 130, yPos + 12)
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.text(
        `This is a legally binding agreement. Please read carefully before signing.`,
        105,
        285,
        { align: 'center' }
      )
      doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' })
    }
    
    return doc
  }

  const handlePreviewContract = () => {
    const doc = generateContractPDF()
    const blob = doc.output('blob')
    setPdfBlob(blob)
    setIsPreviewModalOpen(true)
  }

  const handleDownloadContract = () => {
    const doc = generateContractPDF()
    const filename = `Contract_${contractData.clientName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`
    doc.save(filename)
    alert('✅ Contract downloaded successfully!')
  }

  const handleEmailContract = async () => {
    if (!contractData.clientEmail) {
      alert('⚠️ Client email is required!')
      return
    }

    // Generate PDF
    const doc = generateContractPDF()
    const pdfBase64 = doc.output('dataurlstring').split(',')[1]

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'sendContractEmail',
          clientName: contractData.clientName,
          clientEmail: contractData.clientEmail,
          contractType: contractData.contractType,
          pdfData: pdfBase64,
          filename: `Contract_${contractData.clientName.replace(/\s+/g, '_')}.pdf`
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Contract sent via email successfully!')
      } else {
        alert('❌ Failed to send email: ' + result.message)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('❌ Failed to send contract via email')
    }
  }

  // ==================== HELPER FUNCTIONS ====================
  const calculateBalance = () => {
    const total = parseFloat(contractData.totalAmount) || 0
    const advance = parseFloat(contractData.advanceAmount) || 0
    const balance = total - advance
    setContractData({ ...contractData, balanceAmount: balance.toString() })
  }

  useEffect(() => {
    calculateBalance()
  }, [contractData.totalAmount, contractData.advanceAmount])

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
          <FaFileContract className="text-blue-600" />
          Contract Generator
        </h1>
        <p className="text-gray-600">Generate professional contracts for your clients</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Select from Leads */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-blue-600" />
            Select from Leads
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {leads.filter(l => l.Status !== 'Converted').slice(0, 10).map(lead => (
              <button
                key={lead.id}
                onClick={() => {
                  handleSelectLead(lead)
                  setIsGenerateModalOpen(true)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="font-medium text-gray-900">{lead['Client Name']}</div>
                <div className="text-sm text-gray-600">{lead['Event Type']} • {lead['Event Date']}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Select from Events */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-purple-600" />
            Select from Events
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {events.slice(0, 10).map(event => (
              <button
                key={event.id}
                onClick={() => {
                  handleSelectEvent(event)
                  setIsGenerateModalOpen(true)
                }}
                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <div className="font-medium text-gray-900">{event.clientName}</div>
                <div className="text-sm text-gray-600">{event.eventType} • {event.eventDate}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate from Scratch */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-3 text-lg"
        >
          <FaFileContract className="text-2xl" />
          Generate New Contract from Scratch
        </button>
      </div>

      {/* ==================== GENERATE CONTRACT MODAL ==================== */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaFileContract />
                      Generate Contract
                    </h2>
                    <p className="text-blue-100 mt-1">Fill in the contract details</p>
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
                  {/* Contract Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contract Type *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {contractTemplates.map(template => (
                        <button
                          key={template.value}
                          onClick={() => setContractData({...contractData, contractType: template.value})}
                          className={`p-4 border-2 rounded-lg transition-all ${
                            contractData.contractType === template.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-3xl mb-2">{template.icon}</div>
                          <div className="text-sm font-medium text-gray-900">{template.label}</div>
                        </button>
                      ))}
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
                          value={contractData.clientName}
                          onChange={(e) => setContractData({...contractData, clientName: e.target.value})}
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
                          value={contractData.clientEmail}
                          onChange={(e) => setContractData({...contractData, clientEmail: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="client@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={contractData.clientPhone}
                          onChange={(e) => setContractData({...contractData, clientPhone: e.target.value})}
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
                          value={contractData.clientAddress}
                          onChange={(e) => setContractData({...contractData, clientAddress: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Client address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Event Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Type *
                        </label>
                        <input
                          type="text"
                          value={contractData.eventType}
                          onChange={(e) => setContractData({...contractData, eventType: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Wedding, Birthday"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Date *
                        </label>
                        <input
                          type="date"
                          value={contractData.eventDate}
                          onChange={(e) => setContractData({...contractData, eventDate: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Venue *
                        </label>
                        <input
                          type="text"
                          value={contractData.eventVenue}
                          onChange={(e) => setContractData({...contractData, eventVenue: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Event venue address"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Package & Pricing */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Package & Pricing</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Package Details
                        </label>
                        <textarea
                          value={contractData.packageDetails}
                          onChange={(e) => setContractData({...contractData, packageDetails: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows="3"
                          placeholder="Describe the package (e.g., Full day coverage, 2 photographers, drone shots...)"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Total Amount (₹) *
                          </label>
                          <input
                            type="number"
                            value={contractData.totalAmount}
                            onChange={(e) => setContractData({...contractData, totalAmount: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="50000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Advance Amount (₹)
                          </label>
                          <input
                            type="number"
                            value={contractData.advanceAmount}
                            onChange={(e) => setContractData({...contractData, advanceAmount: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="15000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Balance (₹)
                          </label>
                          <input
                            type="number"
                            value={contractData.balanceAmount}
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                            placeholder="Auto-calculated"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deliverables */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Deliverables</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Deliverables List
                        </label>
                        <textarea
                          value={contractData.deliverables}
                          onChange={(e) => setContractData({...contractData, deliverables: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows="3"
                          placeholder="List deliverables (e.g., Edited video (15-20 min), Highlight reel (3-5 min), All photos in HD...)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Timeline
                        </label>
                        <select
                          value={contractData.deliveryTimeline}
                          onChange={(e) => setContractData({...contractData, deliveryTimeline: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="30 days">30 days</option>
                          <option value="45 days">45 days</option>
                          <option value="60 days">60 days</option>
                          <option value="90 days">90 days</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={contractData.additionalNotes}
                      onChange={(e) => setContractData({...contractData, additionalNotes: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Any additional terms, special requests, or notes..."
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3">
                <button
                  onClick={handlePreviewContract}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaEye />
                  Preview Contract
                </button>
                <button
                  onClick={handleDownloadContract}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaDownload />
                  Download PDF
                </button>
                <button
                  onClick={handleEmailContract}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaEnvelope />
                  Email to Client
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
                <h2 className="text-2xl font-bold">Contract Preview</h2>
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
                  title="Contract Preview"
                />
              </div>

              {/* Preview Footer */}
              <div className="bg-gray-50 p-4 rounded-b-2xl flex gap-3">
                <button
                  onClick={handleDownloadContract}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaDownload />
                  Download
                </button>
                <button
                  onClick={handleEmailContract}
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

export default ContractGenerator

