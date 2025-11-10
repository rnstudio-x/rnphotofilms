import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaArrowLeft, FaImages, FaDownload, FaExpand, FaTimes,
  FaCheckCircle, FaSpinner, FaHeart, FaShare, FaUser
} from 'react-icons/fa'

const GuestGallery = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [guestData, setGuestData] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [selectedPhotos, setSelectedPhotos] = useState([])

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzgXRokuDgbWtBd9KCznfxcNYHgx2nQCOkIbe-CloIA2hexG9GuWqtaxSqvnMZM0yBavw/exec'

  useEffect(() => {
    checkGuestAuth()
  }, [])

  const checkGuestAuth = () => {
    const token = localStorage.getItem('guestToken')
    const data = localStorage.getItem('guestData')
    
    if (!token || !data) {
      navigate(`/guest/register/${eventId}`)
      return
    }
    
    try {
      const parsed = JSON.parse(data)
      setGuestData(parsed)
      fetchGuestPhotos(parsed.id, token)
    } catch (error) {
      console.error('Auth error:', error)
      navigate(`/guest/register/${eventId}`)
    }
  }

  const fetchGuestPhotos = async (guestId, token) => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'getGuestPhotos',
          guestId: guestId,
          eventId: eventId,
          token: token
        })
      })

      const responseText = await response.text()
      const result = JSON.parse(responseText)

      if (result.success) {
        setPhotos(result.photos || [])
      }
    } catch (error) {
      console.error('Error fetching photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPhoto = (photo) => {
    const link = document.createElement('a')
    link.href = photo.url
    link.download = photo.filename || 'photo.jpg'
    link.click()
  }

  const downloadSelected = () => {
    selectedPhotos.forEach(photoId => {
      const photo = photos.find(p => p.id === photoId)
      if (photo) downloadPhoto(photo)
    })
    alert(`Downloading ${selectedPhotos.length} photos...`)
    setSelectedPhotos([])
  }

  const toggleSelection = (photoId) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-6xl text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Finding your photos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-auto">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Your Photos
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome, {guestData?.name}! • {photos.length} photos found
                </p>
              </div>
            </div>

            {selectedPhotos.length > 0 && (
              <button
                onClick={downloadSelected}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                <FaDownload />
                Download ({selectedPhotos.length})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white text-center"
        >
          <FaHeart className="text-5xl mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">
            AI Found {photos.length} Photos of You! 🎉
          </h2>
          <p className="text-lg opacity-90">
            Select and download your favorite moments
          </p>
        </motion.div>

        {/* Photos Grid */}
        {photos.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaImages className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Photos Found Yet
            </h3>
            <p className="text-gray-600">
              Our AI is still processing. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group cursor-pointer"
              >
                <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                  <img
                    src={photo.url || 'https://via.placeholder.com/400'}
                    alt={photo.filename}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onClick={() => setSelectedPhoto(photo)}
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        downloadPhoto(photo)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-3 bg-white rounded-full hover:bg-purple-600 hover:text-white transition-all"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPhoto(photo)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-3 bg-white rounded-full hover:bg-pink-600 hover:text-white transition-all"
                    >
                      <FaExpand />
                    </button>
                  </div>

                  {/* Selection Checkbox */}
                  <div
                    className="absolute top-2 right-2 z-10"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSelection(photo.id)
                    }}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedPhotos.includes(photo.id)
                        ? 'bg-purple-600 border-purple-600'
                        : 'bg-white/50 border-white backdrop-blur-sm'
                    }`}>
                      {selectedPhotos.includes(photo.id) && (
                        <FaCheckCircle className="text-white text-sm" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[10000] p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white text-2xl transition-colors"
            >
              <FaTimes />
            </button>

            <div className="max-w-5xl max-h-[90vh]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.filename}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  downloadPhoto(selectedPhoto)
                }}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center gap-2"
              >
                <FaDownload />
                Download Photo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GuestGallery
