import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaFolder, FaPlus, FaEdit, FaTrash, FaSave, FaTimes,
  FaImages, FaSync, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa'

const GalleryManager = () => {
  const [galleries, setGalleries] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGallery, setEditingGallery] = useState(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    eventId: '',
    folderIds: ['', '', ''],
    accountEmails: ['', '', '']
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycby6Ph2hqgkYfoeMu_rIrvPvf0dU-NoG8N8vXACD8O9pWqGvdxFbXZ176XZRhukvaBDUFg/exec'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
  setLoading(true)
  try {
    // Fetch galleries
    const galleryResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'getAllGalleryConfigs' })
    })
    const galleryResult = await galleryResponse.json()
    if (galleryResult.success) {
      setGalleries(galleryResult.galleries || [])
    }

    // Fetch events/leads
    const eventsResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action: 'getLeads' })
    })
    const eventsResult = await eventsResponse.json()
    
    if (eventsResult.success) {
      // ✅ Filter out events without Lead ID
      const validEvents = (eventsResult.leads || []).filter(event => event.id && event.id.startsWith('LEAD-'))
      setEvents(validEvents)
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    setLoading(false)
  }
}

  const handleAddGallery = () => {
    setFormData({
      eventId: '',
      folderIds: ['', '', ''],
      accountEmails: ['', '', '']
    })
    setEditingGallery(null)
    setShowAddModal(true)
  }

  const handleEditGallery = (gallery) => {
    setFormData({
      eventId: gallery.eventId,
      folderIds: [
        gallery.folderIds[0] || '',
        gallery.folderIds[1] || '',
        gallery.folderIds[2] || ''
      ],
      accountEmails: [
        gallery.accountEmails?.[0] || '',
        gallery.accountEmails?.[1] || '',
        gallery.accountEmails?.[2] || ''
      ]
    })
    setEditingGallery(gallery)
    setShowAddModal(true)
  }

  const handleSaveGallery = async () => {
    if (!formData.eventId) {
      alert('Please select an event')
      return
    }

    const validFolderIds = formData.folderIds.filter(id => id.trim() !== '')
    if (validFolderIds.length === 0) {
      alert('Please add at least one folder ID')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateGalleryFolders',
          eventId: formData.eventId,
          folderIds: validFolderIds,
          accountEmails: formData.accountEmails.filter(email => email.trim() !== '')
        })
      })

      const result = await response.json()

      if (result.success) {
        alert(`Gallery ${editingGallery ? 'updated' : 'added'} successfully!\n${result.totalPhotos} photos found.`)
        setShowAddModal(false)
        fetchData() // Refresh list
      } else {
        alert(result.message || 'Failed to save gallery')
      }
    } catch (error) {
      console.error('Error saving gallery:', error)
      alert('Failed to save gallery')
    } finally {
      setSaving(false)
    }
  }

  const handleFolderIdChange = (index, value) => {
    const newFolderIds = [...formData.folderIds]
    newFolderIds[index] = value
    setFormData({ ...formData, folderIds: newFolderIds })
  }

  const handleEmailChange = (index, value) => {
    const newEmails = [...formData.accountEmails]
    newEmails[index] = value
    setFormData({ ...formData, accountEmails: newEmails })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gallery Manager</h1>
          <p className="text-gray-600 mt-1">
            Manage photo folders for client galleries
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaSync />
            Refresh
          </button>
          <button
            onClick={handleAddGallery}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Add Gallery
          </button>
        </div>
      </div>

      {/* Gallery List */}
      {galleries.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <FaFolder className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Galleries Configured</h3>
          <p className="text-gray-600 mb-6">
            Add folder mappings to enable client photo galleries
          </p>
          <button
            onClick={handleAddGallery}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Gallery
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery, index) => (
            <motion.div
              key={gallery.eventId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-start justify-between mb-2">
                  <FaImages className="text-2xl" />
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold">
                    {gallery.folderIds?.length || 0} Folders
                  </span>
                </div>
                <h3 className="text-lg font-bold">{gallery.eventName}</h3>
                <p className="text-sm opacity-90">{gallery.clientName}</p>
              </div>

              {/* Card Body */}
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Event ID:</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {gallery.eventId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Photos:</span>
                    <span className="font-bold text-green-600">
                      {gallery.totalPhotos || 0}
                    </span>
                  </div>

                  {gallery.lastUpdated && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(gallery.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Folder IDs Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Folder IDs:</p>
                    <div className="space-y-1">
                      {gallery.folderIds?.map((folderId, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <FaFolder className="text-blue-600" />
                          <span className="font-mono truncate text-gray-600">
                            {folderId.substring(0, 20)}...
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleEditGallery(gallery)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this gallery configuration?')) {
                        // TODO: Implement delete
                        alert('Delete functionality coming soon')
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingGallery ? 'Edit Gallery' : 'Add Gallery'}
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Event Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Event *
                  </label>
                  <select
                    value={formData.eventId}
                    onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={editingGallery}
                  >
                    <option value="">-- Select Event --</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.clientName} - {event.eventType} ({event.id})
                      </option>
                    ))}
                  </select>
                  {editingGallery && (
                    <p className="text-xs text-gray-500 mt-1">Event cannot be changed while editing</p>
                  )}
                </div>

                {/* Folder IDs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Drive Folder IDs
                  </label>
                  <div className="space-y-3">
                    {[0, 1, 2].map((index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2 mb-1">
                          <FaFolder className="text-blue-600" />
                          <span className="text-sm text-gray-600">Folder {index + 1}</span>
                          {index === 0 && <span className="text-xs text-red-600">*Required</span>}
                        </div>
                        <input
                          type="text"
                          value={formData.folderIds[index]}
                          onChange={(e) => handleFolderIdChange(index, e.target.value)}
                          placeholder={`Folder ID ${index + 1}`}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-700">
                      💡 <strong>How to get Folder ID:</strong>
                      <br />
                      1. Open Google Drive folder
                      <br />
                      2. Copy from URL: drive.google.com/drive/folders/<strong className="text-blue-600">[FOLDER_ID]</strong>
                    </p>
                  </div>
                </div>

                {/* Account Emails */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Account Emails (Optional)
                  </label>
                  <div className="space-y-2">
                    {[0, 1, 2].map((index) => (
                      <input
                        key={index}
                        type="email"
                        value={formData.accountEmails[index]}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        placeholder={`Account ${index + 1} email`}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FaExclamationTriangle className="text-yellow-600 text-xl flex-shrink-0 mt-1" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-semibold mb-1">Important:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Make sure folders are shared with "Anyone with link"</li>
                        <li>Folder must contain images only</li>
                        <li>Changes may take a few moments to reflect</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGallery}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {editingGallery ? 'Update Gallery' : 'Add Gallery'}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GalleryManager
