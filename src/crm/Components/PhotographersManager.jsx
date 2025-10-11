import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCamera, FaPlus, FaEdit, FaTrash, FaEye, FaSearch,
  FaUser, FaPhone, FaEnvelope, FaIdCard, FaMoneyBillWave,
  FaTimes, FaSave, FaCheckCircle, FaExclamationTriangle,
  FaUserCircle, FaBriefcase, FaCalendar, FaMapMarkerAlt
} from 'react-icons/fa'

const PhotographersManager = () => {
  const [photographers, setPhotographers] = useState([])
  const [filteredPhotographers, setFilteredPhotographers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedPhotographer, setSelectedPhotographer] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    aadharNumber: '',
    dailyRate: '',
    specialization: 'Wedding',
    experience: '',
    address: '',
    status: 'Active'
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzX0rollFXcrI5d8qKhWlLslCX71JDSnlwAVtLLsqmDze2Jhi9_FbpMg-wIvELxe83fZQ/exec' // Replace with your actual URL

  useEffect(() => {
    fetchPhotographers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [photographers, searchTerm])

  // ==================== FETCH (READ) ====================
  const fetchPhotographers = async () => {
    try {
      setLoading(true)
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ 
          action: 'getPhotographers'
        })
      })

      const result = await response.json()
      
      if (result.success && result.photographers) {
        setPhotographers(result.photographers)
      }
    } catch (error) {
      console.error('Error fetching photographers:', error)
      alert('Failed to fetch photographers. Please check console.')
    } finally {
      setLoading(false)
    }
  }

  // ==================== CREATE ====================
  const handleAddPhotographer = async () => {
    // Validation
    if (!formData.name || !formData.phone) {
      alert('⚠️ Name and Phone are required!')
      return
    }

    try {
      const photographerData = {
        action: 'addPhotographer',
        ...formData,
        id: 'PH-' + new Date().getTime(),
        joinedDate: new Date().toISOString().split('T')[0]
      }

      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(photographerData)
      })

      const result = await response.json()
      
      if (result.success) {
        alert('✅ Photographer added successfully!')
        setIsAddModalOpen(false)
        resetForm()
        fetchPhotographers()
      } else {
        alert('❌ Failed to add photographer: ' + result.error)
      }
    } catch (error) {
      console.error('Error adding photographer:', error)
      alert('❌ Error adding photographer. Check console.')
    }
  }

  // ==================== UPDATE ====================
  const handleUpdatePhotographer = async () => {
    if (!formData.name || !formData.phone) {
      alert('⚠️ Name and Phone are required!')
      return
    }

    try {
      const updateData = {
        action: 'updatePhotographer',
        id: selectedPhotographer.id,
        ...formData
      }

      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(updateData)
      })

      const result = await response.json()
      
      if (result.success) {
        alert('✅ Photographer updated successfully!')
        setIsEditModalOpen(false)
        resetForm()
        fetchPhotographers()
      } else {
        alert('❌ Failed to update photographer: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating photographer:', error)
      alert('❌ Error updating photographer. Check console.')
    }
  }

  // ==================== DELETE ====================
  const handleDeletePhotographer = async (photographer) => {
    const confirmed = window.confirm(
      `⚠️ Are you sure you want to delete ${photographer.name}?\n\nThis action cannot be undone!`
    )

    if (!confirmed) return

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'deletePhotographer',
          id: photographer.id
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert('✅ Photographer deleted successfully!')
        fetchPhotographers()
      } else {
        alert('❌ Failed to delete photographer: ' + result.error)
      }
    } catch (error) {
      console.error('Error deleting photographer:', error)
      alert('❌ Error deleting photographer. Check console.')
    }
  }

  // ==================== HELPERS ====================
  const applyFilters = () => {
    if (!searchTerm) {
      setFilteredPhotographers(photographers)
      return
    }

    const filtered = photographers.filter(p =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPhotographers(filtered)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      aadharNumber: '',
      dailyRate: '',
      specialization: 'Wedding',
      experience: '',
      address: '',
      status: 'Active'
    })
    setSelectedPhotographer(null)
  }

  const openEditModal = (photographer) => {
    setSelectedPhotographer(photographer)
    setFormData({
      name: photographer.name || '',
      phone: photographer.phone || '',
      email: photographer.email || '',
      aadharNumber: photographer.aadharNumber || '',
      dailyRate: photographer.dailyRate || '',
      specialization: photographer.specialization || 'Wedding',
      experience: photographer.experience || '',
      address: photographer.address || '',
      status: photographer.status || 'Active'
    })
    setIsEditModalOpen(true)
  }

  const openViewModal = (photographer) => {
    setSelectedPhotographer(photographer)
    setIsViewModalOpen(true)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCurrency = (amount) => {
    return amount ? '₹' + parseFloat(amount).toLocaleString('en-IN') : 'N/A'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading photographers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Photographers Manager</h1>
              <p className="text-gray-600">Manage your photography team</p>
            </div>
            
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 font-semibold"
            >
              <FaPlus /> Add Photographer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Photographers</p>
                <h3 className="text-3xl font-bold text-gray-800">{photographers.length}</h3>
              </div>
              <FaCamera className="text-4xl text-blue-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Active</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {photographers.filter(p => p.status === 'Active').length}
                </h3>
              </div>
              <FaCheckCircle className="text-4xl text-green-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Inactive</p>
                <h3 className="text-3xl font-bold text-gray-800">
                  {photographers.filter(p => p.status === 'Inactive').length}
                </h3>
              </div>
              <FaExclamationTriangle className="text-4xl text-orange-500 opacity-20" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Avg Daily Rate</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {formatCurrency(
                    photographers.reduce((sum, p) => sum + (parseFloat(p.dailyRate) || 0), 0) / 
                    (photographers.length || 1)
                  )}
                </h3>
              </div>
              <FaMoneyBillWave className="text-4xl text-purple-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Photographers Grid */}
        {filteredPhotographers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-20 text-center">
            <FaCamera className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No photographers found</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Photographer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotographers.map((photographer, index) => (
              <motion.div
                key={photographer.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
              >
                {/* Card Header */}
                <div className={`p-6 ${
                  photographer.status === 'Active' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                } text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-4xl" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      photographer.status === 'Active' 
                        ? 'bg-green-500' 
                        : 'bg-gray-500'
                    }`}>
                      {photographer.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{photographer.name}</h3>
                  <p className="text-sm text-white/80">{photographer.specialization}</p>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaPhone className="text-green-500" />
                    <span>{photographer.phone}</span>
                  </div>

                  {photographer.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-blue-500" />
                      <span className="truncate">{photographer.email}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaBriefcase className="text-purple-500" />
                    <span>{photographer.experience || 'N/A'} years experience</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMoneyBillWave className="text-orange-500" />
                    <span className="font-semibold">{formatCurrency(photographer.dailyRate)}/day</span>
                  </div>

                  {photographer.joinedDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendar className="text-red-500" />
                      <span>Joined: {new Date(photographer.joinedDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 flex gap-2">
                  <button
                    onClick={() => openViewModal(photographer)}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEye /> View
                  </button>
                  <button
                    onClick={() => openEditModal(photographer)}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDeletePhotographer(photographer)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAddModalOpen || isEditModalOpen) && (
          <PhotographerFormModal
            isOpen={isAddModalOpen || isEditModalOpen}
            isEdit={isEditModalOpen}
            formData={formData}
            onInputChange={handleInputChange}
            onSave={isEditModalOpen ? handleUpdatePhotographer : handleAddPhotographer}
            onClose={() => {
              isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false)
              resetForm()
            }}
          />
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {isViewModalOpen && selectedPhotographer && (
          <PhotographerViewModal
            photographer={selectedPhotographer}
            onClose={() => {
              setIsViewModalOpen(false)
              setSelectedPhotographer(null)
            }}
            onEdit={() => {
              setIsViewModalOpen(false)
              openEditModal(selectedPhotographer)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// ==================== FORM MODAL COMPONENT ====================
const PhotographerFormModal = ({ isOpen, isEdit, formData, onInputChange, onSave, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">
              {isEdit ? 'Edit Photographer' : 'Add New Photographer'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Basic Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => onInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => onInputChange('phone', e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => onInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Aadhar Number
                </label>
                <input
                  type="text"
                  value={formData.aadharNumber}
                  onChange={(e) => onInputChange('aadharNumber', e.target.value)}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Professional Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Specialization
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) => onInputChange('specialization', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Pre-Wedding">Pre-Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="All-Round">All-Round</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => onInputChange('experience', e.target.value)}
                  placeholder="Years of experience"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Daily Rate (₹)
                </label>
                <input
                  type="number"
                  value={formData.dailyRate}
                  onChange={(e) => onInputChange('dailyRate', e.target.value)}
                  placeholder="Daily rate in rupees"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => onInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center justify-center gap-2"
          >
            <FaSave /> {isEdit ? 'Update' : 'Save'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ==================== VIEW MODAL COMPONENT ====================
const PhotographerViewModal = ({ photographer, onClose, onEdit }) => {
  const formatCurrency = (amount) => {
    return amount ? '₹' + parseFloat(amount).toLocaleString('en-IN') : 'N/A'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className={`p-6 rounded-t-2xl ${
          photographer.status === 'Active'
            ? 'bg-gradient-to-r from-blue-600 to-purple-600'
            : 'bg-gradient-to-r from-gray-600 to-gray-700'
        } text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <FaUserCircle className="text-5xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{photographer.name}</h3>
                <p className="text-white/80">{photographer.specialization}</p>
              </div>
            </div>
            <button
              onClick={onClose}
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
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaUser /> Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-gray-800">{photographer.phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800">{photographer.email || 'N/A'}</p>
              </div>
              {photographer.aadharNumber && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Aadhar Number</p>
                  <p className="font-medium text-gray-800">{photographer.aadharNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaBriefcase /> Professional Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Specialization</p>
                <p className="font-medium text-gray-800">{photographer.specialization}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Experience</p>
                <p className="font-medium text-gray-800">{photographer.experience || 'N/A'} years</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Daily Rate</p>
                <p className="font-medium text-gray-800">{formatCurrency(photographer.dailyRate)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                  photographer.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {photographer.status}
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          {photographer.address && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt /> Address
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{photographer.address}</p>
              </div>
            </div>
          )}

          {/* Joined Date */}
          {photographer.joinedDate && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Joined On</p>
              <p className="font-semibold text-blue-800">
                {new Date(photographer.joinedDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 p-6 rounded-b-2xl flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <FaEdit /> Edit Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PhotographersManager
