import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaFileAlt, FaDownload, FaEnvelope, FaEye, FaImage,
  FaUser, FaCalendarAlt, FaMapMarkerAlt, FaPhone,
  FaTimes, FaSave, FaCheckCircle, FaStar, FaAward,
  FaCamera, FaVideo, FaEdit, FaPlus, FaMinus
} from 'react-icons/fa'
import jsPDF from 'jspdf'

const ProposalGenerator = () => {
  // ==================== STATE MANAGEMENT ====================
  const [leads, setLeads] = useState([])
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [pdfBlob, setPdfBlob] = useState(null)
  
  // Proposal Form State
  const [proposalData, setProposalData] = useState({
    proposalNumber: '',
    proposalDate: new Date().toISOString().split('T')[0],
    validUntil: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventType: '',
    eventDate: '',
    eventVenue: '',
    packages: [
      {
        name: 'Basic Package',
        price: 0,
        features: [
          'Full day coverage',
          'Professional photographer',
          'Edited photos (200+)',
          'Online gallery'
        ],
        selected: false
      }
    ],
    customization: '',
    additionalServices: '',
    portfolioHighlights: 'Over 500+ successful projects completed',
    aboutUs: 'RN PhotoFilms is a leading photography and videography service provider with years of experience in capturing precious moments.',
    terms: 'Payment terms: 30% advance, 40% on event day, 30% on delivery. Cancellation charges apply.',
    notes: ''
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyCFoBNyXT8fmTmlG9RwMO7QVgcuaVpgEUynu-hbG4Hl-zVJf09ArlCbSXNhBX9jDUcpg/exec'

  // Package Templates
  const packageTemplates = {
    Wedding: [
      {
        name: 'Silver Package',
        price: 45000,
        features: [
          'Full day coverage (12 hours)',
          '1 Professional photographer',
          '1 Videographer',
          'Edited photos (400+)',
          'Highlight video (5-7 min)',
          'Online gallery',
          'USB drive with all files'
        ],
        selected: false
      },
      {
        name: 'Gold Package',
        price: 75000,
        features: [
          '2 day coverage',
          '2 Professional photographers',
          '2 Videographers',
          'Edited photos (800+)',
          'Cinematic video (15-20 min)',
          'Highlight reel (5-7 min)',
          'Drone shots',
          'Photo album (40 pages)',
          'Online gallery',
          'USB drive + cloud storage'
        ],
        selected: false
      },
      {
        name: 'Platinum Package',
        price: 125000,
        features: [
          'Complete wedding coverage (3 days)',
          '3 Professional photographers',
          '3 Videographers',
          'Edited photos (1500+)',
          'Full movie (30-40 min)',
          'Highlight reel (8-10 min)',
          'Drone shots',
          'Pre-wedding shoot',
          'Photo album (60 pages)',
          'Photobook',
          'Same day edit video',
          'Online gallery',
          'Premium packaging'
        ],
        selected: false
      }
    ],
    Event: [
      {
        name: 'Basic Event Package',
        price: 25000,
        features: [
          '6 hours coverage',
          '1 Photographer',
          'Edited photos (300+)',
          'Online gallery'
        ],
        selected: false
      },
      {
        name: 'Premium Event Package',
        price: 50000,
        features: [
          'Full day coverage',
          '2 Photographers',
          '1 Videographer',
          'Edited photos (600+)',
          'Event video (10-15 min)',
          'Drone coverage',
          'Online gallery'
        ],
        selected: false
      }
    ],
    Commercial: [
      {
        name: 'Product Photography',
        price: 15000,
        features: [
          'Up to 50 products',
          'White background',
          'Retouched images',
          '3 day delivery'
        ],
        selected: false
      },
      {
        name: 'Commercial Video',
        price: 35000,
        features: [
          '2 day shoot',
          'Professional crew',
          'Edited video (2-3 min)',
          'Music & color grading',
          '4K resolution'
        ],
        selected: false
      }
    ]
  }

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

      const proposalsResponse = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getProposals' })
      })
      const proposalsResult = await proposalsResponse.json()
      if (proposalsResult.success) {
        setProposals(proposalsResult.proposals || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // ==================== PROPOSAL NUMBER GENERATION ====================
  const generateProposalNumber = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `PROP-${year}${month}-${random}`
  }

  // ==================== AUTO-FILL FUNCTIONS ====================
  const handleSelectLead = (lead) => {
    setSelectedLead(lead)
    
    const proposalNumber = generateProposalNumber()
    const validUntil = new Date()
    validUntil.setDate(validUntil.getDate() + 15) // Valid for 15 days
    
    // Get package templates for event type
    const eventType = lead['Event Type'] || 'Wedding'
    const templates = packageTemplates[eventType] || packageTemplates.Wedding
    
    setProposalData({
      ...proposalData,
      proposalNumber: proposalNumber,
      validUntil: validUntil.toISOString().split('T')[0],
      clientName: lead['Client Name'] || '',
      clientEmail: lead.Email || '',
      clientPhone: lead.Phone || '',
      eventType: eventType,
      eventDate: lead['Event Date'] || '',
      eventVenue: lead.Venue || '',
      packages: templates
    })
    
    setIsGenerateModalOpen(true)
  }

  // ==================== PACKAGE MANAGEMENT ====================
  const togglePackageSelection = (index) => {
    const updatedPackages = [...proposalData.packages]
    updatedPackages[index].selected = !updatedPackages[index].selected
    setProposalData({ ...proposalData, packages: updatedPackages })
  }

  const addCustomPackage = () => {
    const newPackage = {
      name: 'Custom Package',
      price: 0,
      features: ['Custom feature 1', 'Custom feature 2'],
      selected: false
    }
    setProposalData({
      ...proposalData,
      packages: [...proposalData.packages, newPackage]
    })
  }

  const updatePackage = (index, field, value) => {
    const updatedPackages = [...proposalData.packages]
    updatedPackages[index][field] = value
    setProposalData({ ...proposalData, packages: updatedPackages })
  }

  const addFeature = (packageIndex) => {
    const updatedPackages = [...proposalData.packages]
    updatedPackages[packageIndex].features.push('New feature')
    setProposalData({ ...proposalData, packages: updatedPackages })
  }

  const updateFeature = (packageIndex, featureIndex, value) => {
    const updatedPackages = [...proposalData.packages]
    updatedPackages[packageIndex].features[featureIndex] = value
    setProposalData({ ...proposalData, packages: updatedPackages })
  }

  const removeFeature = (packageIndex, featureIndex) => {
    const updatedPackages = [...proposalData.packages]
    updatedPackages[packageIndex].features.splice(featureIndex, 1)
    setProposalData({ ...proposalData, packages: updatedPackages })
  }

  // ==================== PDF GENERATION ====================
  const generateProposalPDF = () => {
    const doc = new jsPDF()
    
    // Cover Page
    doc.setFillColor(79, 70, 229)
    doc.rect(0, 0, 210, 297, 'F')
    
    // Company Logo/Name
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(48)
    doc.setFont('helvetica', 'bold')
    doc.text('RN PHOTOFILMS', 105, 80, { align: 'center' })
    
    doc.setFontSize(16)
    doc.setFont('helvetica', 'normal')
    doc.text('Professional Photography & Videography', 105, 95, { align: 'center' })
    
    // Proposal Title
    doc.setFontSize(36)
    doc.setFont('helvetica', 'bold')
    doc.text('PROPOSAL', 105, 140, { align: 'center' })
    
    // Client Name
    doc.setFontSize(20)
    doc.setFont('helvetica', 'normal')
    doc.text(`For ${proposalData.clientName}`, 105, 160, { align: 'center' })
    
    // Event Type
    doc.setFontSize(16)
    doc.text(proposalData.eventType, 105, 175, { align: 'center' })
    
    // Proposal Details
    doc.setFontSize(12)
    doc.text(`Proposal #: ${proposalData.proposalNumber}`, 105, 230, { align: 'center' })
    doc.text(`Date: ${new Date(proposalData.proposalDate).toLocaleDateString('en-IN')}`, 105, 240, { align: 'center' })
    doc.text(`Valid Until: ${new Date(proposalData.validUntil).toLocaleDateString('en-IN')}`, 105, 250, { align: 'center' })
    
    // Page 2: About Us
    doc.addPage()
    doc.setTextColor(0, 0, 0)
    
    let yPos = 30
    
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(79, 70, 229)
    doc.text('About RN PhotoFilms', 15, yPos)
    yPos += 15
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    const aboutLines = doc.splitTextToSize(proposalData.aboutUs, 180)
    doc.text(aboutLines, 15, yPos)
    yPos += (aboutLines.length * 6) + 15
    
    // Portfolio Highlights
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(79, 70, 229)
    doc.text('Our Achievements', 15, yPos)
    yPos += 10
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    const highlightLines = doc.splitTextToSize(proposalData.portfolioHighlights, 180)
    doc.text(highlightLines, 15, yPos)
    
    // Page 3+: Packages
    proposalData.packages.forEach((pkg, index) => {
      doc.addPage()
      yPos = 30
      
      // Package Header
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(79, 70, 229)
      doc.text(pkg.name, 15, yPos)
      yPos += 15
      
      // Price
      doc.setFontSize(32)
      doc.setTextColor(212, 165, 116)
      doc.text(`₹${parseFloat(pkg.price).toLocaleString('en-IN')}`, 15, yPos)
      yPos += 20
      
      // Features
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Package Includes:', 15, yPos)
      yPos += 10
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      pkg.features.forEach(feature => {
        doc.circle(18, yPos - 2, 1.5, 'F')
        doc.text(feature, 25, yPos)
        yPos += 7
      })
      
      if (pkg.selected) {
        doc.setFillColor(34, 197, 94)
        doc.rect(15, yPos + 10, 180, 10, 'F')
        doc.setTextColor(255, 255, 255)
        doc.setFont('helvetica', 'bold')
        doc.text('✓ RECOMMENDED PACKAGE', 105, yPos + 17, { align: 'center' })
      }
    })
    
    // Last Page: Terms & Contact
    doc.addPage()
    yPos = 30
    
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(79, 70, 229)
    doc.text('Terms & Conditions', 15, yPos)
    yPos += 12
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    const termsLines = doc.splitTextToSize(proposalData.terms, 180)
    doc.text(termsLines, 15, yPos)
    yPos += (termsLines.length * 5) + 15
    
    // Contact Info
    doc.setFillColor(245, 245, 245)
    doc.rect(15, yPos, 180, 40, 'F')
    yPos += 10
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Contact Us', 20, yPos)
    yPos += 10
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('📧 Email: rnstudio.x@gmail.com', 20, yPos)
    yPos += 6
    doc.text('📱 Phone: +91 XXXXXXXXXX', 20, yPos)
    yPos += 6
    doc.text('🌐 Website: www.rnphotofilms.com', 20, yPos)
    
    return doc
  }

  const handlePreviewProposal = () => {
    const doc = generateProposalPDF()
    const blob = doc.output('blob')
    setPdfBlob(blob)
    setIsPreviewModalOpen(true)
  }

  const handleDownloadProposal = () => {
    const doc = generateProposalPDF()
    const filename = `Proposal_${proposalData.proposalNumber}_${proposalData.clientName.replace(/\s+/g, '_')}.pdf`
    doc.save(filename)
    alert('✅ Proposal downloaded successfully!')
  }

  const handleEmailProposal = async () => {
    if (!proposalData.clientEmail) {
      alert('⚠️ Client email is required!')
      return
    }

    const doc = generateProposalPDF()
    const pdfBase64 = doc.output('dataurlstring').split(',')[1]

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'sendProposalEmail',
          proposalNumber: proposalData.proposalNumber,
          clientName: proposalData.clientName,
          clientEmail: proposalData.clientEmail,
          eventType: proposalData.eventType,
          pdfData: pdfBase64,
          filename: `Proposal_${proposalData.proposalNumber}.pdf`
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Proposal sent via email successfully!')
      } else {
        alert('❌ Failed to send email: ' + result.message)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('❌ Failed to send proposal via email')
    }
  }

  const handleSaveProposal = async () => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'saveProposal',
          ...proposalData
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ Proposal saved successfully!')
        setIsGenerateModalOpen(false)
        fetchData()
      } else {
        alert('❌ Failed to save proposal: ' + result.message)
      }
    } catch (error) {
      console.error('Error saving proposal:', error)
      alert('❌ Failed to save proposal')
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
          <FaFileAlt className="text-blue-600" />
          Proposal Generator
        </h1>
        <p className="text-gray-600">Create stunning proposals to win more clients</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Select from Leads */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaUser className="text-blue-600" />
            Select from Leads
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {leads.filter(l => l.Status === 'New Lead').slice(0, 15).map(lead => (
              <button
                key={lead.id}
                onClick={() => handleSelectLead(lead)}
                className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{lead['Client Name']}</div>
                    <div className="text-sm text-gray-600">{lead['Event Type']} • {lead['Event Date']}</div>
                  </div>
                  <div className="text-right">
                    <FaAward className="text-blue-600 text-xl" />
                  </div>
                </div>
              </button>
            ))}
            {leads.filter(l => l.Status === 'New Lead').length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No new leads</p>
            )}
          </div>
        </div>

        {/* Recent Proposals */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaFileAlt className="text-purple-600" />
            Recent Proposals
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {proposals.slice(0, 10).map(proposal => (
              <div
                key={proposal.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{proposal.proposalNumber}</div>
                    <div className="text-sm text-gray-600">{proposal.clientName} • {formatDate(proposal.proposalDate)}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded ${
                      proposal.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                      proposal.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {proposal.status || 'Sent'}
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
            setProposalData({
              ...proposalData,
              proposalNumber: generateProposalNumber(),
              validUntil: new Date(Date.now() + 15*24*60*60*1000).toISOString().split('T')[0]
            })
            setIsGenerateModalOpen(true)
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 rounded-lg transition-all flex items-center justify-center gap-3 text-lg"
        >
          <FaFileAlt className="text-2xl" />
          Create New Proposal from Scratch
        </button>
      </div>

      {/* ==================== GENERATE PROPOSAL MODAL ==================== */}
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
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full my-8"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <FaFileAlt />
                      Create Proposal
                    </h2>
                    <p className="text-blue-100 mt-1">{proposalData.proposalNumber}</p>
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
                  {/* Basic Information */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proposal Number *
                        </label>
                        <input
                          type="text"
                          value={proposalData.proposalNumber}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Proposal Date *
                        </label>
                        <input
                          type="date"
                          value={proposalData.proposalDate}
                          onChange={(e) => setProposalData({...proposalData, proposalDate: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valid Until *
                        </label>
                        <input
                          type="date"
                          value={proposalData.validUntil}
                          onChange={(e) => setProposalData({...proposalData, validUntil: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
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
                          value={proposalData.clientName}
                          onChange={(e) => setProposalData({...proposalData, clientName: e.target.value})}
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
                          value={proposalData.clientEmail}
                          onChange={(e) => setProposalData({...proposalData, clientEmail: e.target.value})}
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
                          value={proposalData.clientPhone}
                          onChange={(e) => setProposalData({...proposalData, clientPhone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="9876543210"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Type
                        </label>
                        <select
                          value={proposalData.eventType}
                          onChange={(e) => setProposalData({...proposalData, eventType: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Wedding">Wedding</option>
                          <option value="Event">Event</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Product">Product</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Date
                        </label>
                        <input
                          type="date"
                          value={proposalData.eventDate}
                          onChange={(e) => setProposalData({...proposalData, eventDate: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Venue
                        </label>
                        <input
                          type="text"
                          value={proposalData.eventVenue}
                          onChange={(e) => setProposalData({...proposalData, eventVenue: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Venue location"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Packages */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">Packages</h3>
                      <button
                        onClick={addCustomPackage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                        <FaPlus />
                        Add Package
                      </button>
                    </div>

                    <div className="space-y-4">
                      {proposalData.packages.map((pkg, pkgIndex) => (
                        <div key={pkgIndex} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                          <div className="grid grid-cols-12 gap-4 mb-3">
                            <div className="col-span-7">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Package Name
                              </label>
                              <input
                                type="text"
                                value={pkg.name}
                                onChange={(e) => updatePackage(pkgIndex, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="col-span-4">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Price (₹)
                              </label>
                              <input
                                type="number"
                                value={pkg.price}
                                onChange={(e) => updatePackage(pkgIndex, 'price', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              />
                            </div>

                            <div className="col-span-1 flex items-end">
                              <button
                                onClick={() => togglePackageSelection(pkgIndex)}
                                className={`p-2 rounded-lg transition-colors ${
                                  pkg.selected
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                                }`}
                                title="Mark as recommended"
                              >
                                <FaStar />
                              </button>
                            </div>
                          </div>

                          <label className="block text-xs font-medium text-gray-600 mb-2">
                            Features
                          </label>
                          <div className="space-y-2">
                            {pkg.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={feature}
                                  onChange={(e) => updateFeature(pkgIndex, featureIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                  placeholder="Feature description"
                                />
                                <button
                                  onClick={() => removeFeature(pkgIndex, featureIndex)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <FaMinus />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={() => addFeature(pkgIndex)}
                              className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                            >
                              <FaPlus /> Add Feature
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        About Us
                      </label>
                      <textarea
                        value={proposalData.aboutUs}
                        onChange={(e) => setProposalData({...proposalData, aboutUs: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Company description..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio Highlights
                      </label>
                      <textarea
                        value={proposalData.portfolioHighlights}
                        onChange={(e) => setProposalData({...proposalData, portfolioHighlights: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        placeholder="Key achievements and stats..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Terms & Conditions
                      </label>
                      <textarea
                        value={proposalData.terms}
                        onChange={(e) => setProposalData({...proposalData, terms: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Payment terms, cancellation policy..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 rounded-b-2xl flex flex-wrap gap-3">
                <button
                  onClick={handlePreviewProposal}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaEye />
                  Preview
                </button>
                <button
                  onClick={handleDownloadProposal}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaDownload />
                  Download
                </button>
                <button
                  onClick={handleEmailProposal}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaEnvelope />
                  Email
                </button>
                <button
                  onClick={handleSaveProposal}
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
                  <h2 className="text-2xl font-bold">Proposal Preview</h2>
                  <p className="text-indigo-100 text-sm mt-1">{proposalData.proposalNumber}</p>
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
                  title="Proposal Preview"
                />
              </div>

              {/* Preview Footer */}
              <div className="bg-gray-50 p-4 rounded-b-2xl flex gap-3">
                <button
                  onClick={handleDownloadProposal}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaDownload />
                  Download
                </button>
                <button
                  onClick={handleEmailProposal}
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

export default ProposalGenerator

