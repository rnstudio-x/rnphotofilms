import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaSearch, FaEdit, FaTrash, FaUserTie, FaTimes, FaPhone, FaEnvelope } from 'react-icons/fa'
import googleSheetsAPI from '../Utils/googleSheets'

const PhotographersManager = () => {
  const [photographers, setPhotographers] = useState([])
  const [filteredPhotographers, setFilteredPhotographers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dailyRate: '',
    expertise: 'Wedding',
    status: 'Active'
  })

  useEffect(() => {
    fetchPhotographers()
  }, [])

  useEffect(() => {
    filterPhotographers()
  }, [searchTerm, photographers])

  const fetchPhotographers = async () => {
    setLoading(true)
    try {
      const response = await googleSheetsAPI.getPhotographers()
      if (response.success) {
        setPhotographers(response.data)
      }
    } catch (error) {
      console.error('Error fetching photographers:', error)
    }
    setLoading(false)
  }

  const filterPhotographers = () => {
    let filtered = photographers
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone.includes(searchTerm)
      )
    }
    setFilteredPhotographers(filtered)
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await googleSheetsAPI.addPhotographer(formData)
      if (response.success) {
        setShowAddModal(false)
        fetchPhotographers()
        resetForm()
      }
    } catch (error) {
      console.error('Error adding photographer:', error)
    }
  }

  const handleDelete = async (photographerId) => {
    if (window.confirm('Are you sure you want to delete this photographer?')) {
      try {
        await googleSheetsAPI.deletePhotographer(photographerId)
        fetchPhotographers()
      } catch (error) {
        console.error('Error deleting photographer:', error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      dailyRate: '',
      expertise: 'Wedding',
      status: 'Active'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search photographers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
            />
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="bg-gold text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
        >
          <FaPlus /> Add Photographer
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredPhotographers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">No photographers found</div>
        ) : (
          filteredPhotographers.map((photographer, index) => (
            <motion.div
              key={photographer.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {photographer.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-charcoal">{photographer.name}</h3>
                  <p className="text-sm text-gray-500">{photographer.expertise}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <a href={`tel:${photographer.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold">
                  <FaPhone /> {photographer.phone}
                </a>
                <a href={`mailto:${photographer.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gold">
                  <FaEnvelope /> {photographer.email}
                </a>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Daily Rate</p>
                <p className="text-xl font-bold text-green-600">₹{parseFloat(photographer.dailyRate || 0).toLocaleString()}</p>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleDelete(photographer.id)}
                  className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 flex items-center justify-center gap-2"
                >
                  <FaTrash /> Delete
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
            >
              <div className="bg-gold text-white px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="text-2xl font-bold">Add Photographer</h3>
                <button onClick={() => setShowAddModal(false)} className="text-2xl">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">Daily Rate (₹) *</label>
                    <input
                      type="number"
                      name="dailyRate"
                      value={formData.dailyRate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal mb-2">Expertise</label>
                  <select
                    name="expertise"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Pre-Wedding">Pre-Wedding</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gold text-white rounded-xl font-semibold"
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhotographersManager
