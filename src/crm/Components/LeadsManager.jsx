import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash,
  FaPhone, FaEnvelope, FaCalendar, FaMapMarkerAlt,
  FaTimes, FaCheck, FaClock, FaMoneyBillWave, FaUser
} from 'react-icons/fa'

const LeadsManager = () => {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedLead, setSelectedLead] = useState(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbwKBxSj_Qb0_Zoo4OZ7EA9tlZhGBRjXfoCwGpmwUFqKhLxV52AcTUmwzkgfecOc3ZT8dg/exec' // Replace with your actual URL

  // Status colors
  const statusColors = {
    'New Lead': 'bg-blue-100 text-blue-800',
    'Contacted': 'bg-yellow-100 text-yellow-800',
    'Proposal Sent': 'bg-purple-100 text-purple-800',
    'Negotiating': 'bg-orange-100 text-orange-800',
    'Converted': 'bg-green-100 text-green-800',
    'Lost': 'bg-red-100 text-red-800',
    'Event Completed': 'bg-teal-100 text-teal-800'
  }

  // Fetch leads from Google Sheets
  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getLeads' })
      })

      const result = await response.json()
      
      if (result.success) {
        setLeads(result.leads || [])
      } else {
        console.error('Failed to fetch leads:', result.error)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update lead status
  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateLead',
          leadId: leadId,
          status: newStatus
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Update local state
        setLeads(leads.map(lead => 
          lead['Lead ID'] === leadId 
            ? { ...lead, Status: newStatus }
            : lead
        ))
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead['Client Name']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.Phone?.includes(searchTerm) ||
      lead['Event Type']?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'All' || lead.Status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Stats calculation
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.Status === 'New Lead').length,
    converted: leads.filter(l => l.Status === 'Converted').length,
    conversionRate: leads.length > 0 
      ? Math.round((leads.filter(l => l.Status === 'Converted').length / leads.length) * 100)
      : 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Lead Management</h1>
          <p className="text-gray-600">Manage and track all your photography leads</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Leads</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.total}</h3>
              </div>
              <FaUser className="text-4xl text-blue-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">New Leads</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.new}</h3>
              </div>
              <FaClock className="text-4xl text-yellow-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Converted</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.converted}</h3>
              </div>
              <FaCheck className="text-4xl text-green-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Conversion Rate</p>
                <h3 className="text-3xl font-bold text-gray-800">{stats.conversionRate}%</h3>
              </div>
              <FaMoneyBillWave className="text-4xl text-purple-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="All">All Status</option>
                <option value="New Lead">New Lead</option>
                <option value="Contacted">Contacted</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Negotiating">Negotiating</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
                <option value="Event Completed">Event Completed</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Refresh Leads'}
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Lead ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Client</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Event</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead['Lead ID'] || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                        {lead['Lead ID']?.substring(0, 15)}...
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{lead['Client Name']}</p>
                          <p className="text-sm text-gray-500">{lead.Email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <a href={`tel:${lead.Phone}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                            <FaPhone className="text-xs" /> {lead.Phone}
                          </a>
                          <a href={`mailto:${lead.Email}`} className="text-sm text-gray-600 hover:underline flex items-center gap-1">
                            <FaEnvelope className="text-xs" /> Email
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{lead['Event Type']}</p>
                        <p className="text-sm text-gray-500">{lead['Package Category']}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead['Event Date']}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={lead.Status}
                          onChange={(e) => updateLeadStatus(lead['Lead ID'], e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[lead.Status] || 'bg-gray-100 text-gray-800'}`}
                        >
                          <option value="New Lead">New Lead</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Negotiating">Negotiating</option>
                          <option value="Converted">Converted</option>
                          <option value="Lost">Lost</option>
                          <option value="Event Completed">Event Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedLead(lead)
                              setIsViewModalOpen(true)
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Lead Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsViewModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedLead['Client Name']}</h3>
                    <p className="text-blue-100">{selectedLead['Lead ID']}</p>
                  </div>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                
                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaUser /> Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="font-medium text-gray-800">{selectedLead.Email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="font-medium text-gray-800">{selectedLead.Phone}</p>
                    </div>
                    {selectedLead['Alternate Phone'] && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Alternate Phone</p>
                        <p className="font-medium text-gray-800">{selectedLead['Alternate Phone']}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Information */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaCalendar /> Event Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Event Type</p>
                      <p className="font-medium text-gray-800">{selectedLead['Event Type']}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Event Date</p>
                      <p className="font-medium text-gray-800">{selectedLead['Event Date']}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Event Time</p>
                      <p className="font-medium text-gray-800">{selectedLead['Event Time']}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Guest Count</p>
                      <p className="font-medium text-gray-800">{selectedLead['Guest Count'] || 'N/A'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                      <p className="text-sm text-gray-500 mb-1">Venue</p>
                      <p className="font-medium text-gray-800">{selectedLead.Venue}</p>
                      {selectedLead['Venue Address'] && (
                        <p className="text-sm text-gray-600 mt-1">{selectedLead['Venue Address']}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Package & Budget */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <FaMoneyBillWave /> Package & Budget
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Package</p>
                      <p className="font-medium text-gray-800">{selectedLead['Package Category'] || 'Not selected'}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500 mb-1">Budget</p>
                      <p className="font-medium text-gray-800">{selectedLead.Budget || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Custom Requirements */}
                {selectedLead['Custom Requirements'] && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Custom Requirements</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedLead['Custom Requirements']}</p>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Current Status</h4>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${statusColors[selectedLead.Status]}`}>
                    {selectedLead.Status}
                  </span>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3">
                <a
                  href={`tel:${selectedLead.Phone}`}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
                >
                  Call Client
                </a>
                <a
                  href={`mailto:${selectedLead.Email}`}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
                >
                  Send Email
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LeadsManager
