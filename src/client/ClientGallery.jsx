import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaImages, FaDownload, FaExpand, FaTimes, FaCheckCircle, 
  FaSpinner, FaArrowLeft, FaSearch, FaCloudDownloadAlt, 
  FaFolder, FaShareAlt, FaHeart, FaCamera, FaStar,
  FaPlay, FaTh, FaThLarge, FaFilter
} from 'react-icons/fa'

const ClientGallery = () => {
  const navigate = useNavigate()
  const [clientData, setClientData] = useState(null)
  const [eventData, setEventData] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('masonry')
  const [favorites, setFavorites] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState({})
  const [imageErrors, setImageErrors] = useState({})

  const hasFetched = useRef(false)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbx_hgymBZrVoQuBqUVOQd3LTHfAuq-uhhlh4BbtGqne-n88ASHHkuQrQfyY8kZvejnprg/exec'

 useEffect(() => {
    checkAuth()
    // ✅ Hide navbar
    const navbar = document.querySelector('nav')
    if (navbar) {
      navbar.style.display = 'none'
    }
    
    // ✅ Cleanup on unmount
    return () => {
      if (navbar) {
        navbar.style.display = ''
      }
    }
  }, []) // ✅ EMPTY DEPENDENCY - run once only!

  const checkAuth = () => {
    const token = localStorage.getItem('clientToken')
    const data = localStorage.getItem('clientData')

    if (!token || !data) {
      navigate('/client/login', { replace: true })
      return
    }

    try {
      const parsed = JSON.parse(data)
      setClientData(parsed)
      fetchGallery(parsed.id, token)
    } catch (error) {
      console.error('Auth error:', error)
      navigate('/client/login', { replace: true })
    }
  }

  const fetchGallery = async (clientId, token) => {
    setLoading(true)
    
    try {
      const requestBody = {
        action: 'getClientGallery',
        clientId: clientId,
        token: token
      }

      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()

      if (result.success) {
        setEventData(result.event)
        setPhotos(result.photos || [])
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Smart image loading with progressive enhancement
  const handleImageLoad = (photoId) => {
    setImageLoaded(prev => ({ ...prev, [photoId]: true }))
  }

  const handleImageError = (photoId, currentUrl, photo) => {
    setImageErrors(prev => {
      const errorCount = (prev[photoId] || 0) + 1
      return { ...prev, [photoId]: errorCount }
    })
  }

  // ✅ Get best URL based on context and error state
  const getImageUrl = (photo, size = 'thumbnail') => {
    const errorCount = imageErrors[photo.id] || 0
    
    if (size === 'thumbnail') {
      // Try thumbnail first, then preview, then full
      if (errorCount === 0) return photo.thumbnailUrl
      if (errorCount === 1) return photo.previewUrl
      if (errorCount === 2) return photo.fullUrl
      return photo.downloadUrl
    } else if (size === 'preview') {
      // For hover/modal preview
      if (errorCount === 0) return photo.previewUrl
      if (errorCount === 1) return photo.fullUrl
      return photo.downloadUrl
    } else {
      // For full lightbox
      return photo.fullUrl || photo.downloadUrl
    }
  }

  const downloadPhoto = (photo) => {
    window.open(photo.downloadUrl, '_blank')
  }

  const downloadSelected = () => {
    if (selectedPhotos.length === 0) {
      alert('Please select photos to download')
      return
    }

    selectedPhotos.forEach((photoId, index) => {
      const photo = photos.find(p => p.id === photoId)
      if (photo) {
        setTimeout(() => downloadPhoto(photo), index * 500)
      }
    })

    alert(`Downloading ${selectedPhotos.length} photos...`)
    setSelectedPhotos([])
  }

  const toggleSelection = (photoId, e) => {
    if (e) e.stopPropagation()
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const toggleFavorite = (photoId, e) => {
    if (e) e.stopPropagation()
    setFavorites(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const selectAll = () => {
    if (selectedPhotos.length === filteredPhotos.length) {
      setSelectedPhotos([])
    } else {
      setSelectedPhotos(filteredPhotos.map(p => p.id))
    }
  }

  const openLightbox = (photo, e) => {
    if (e) e.stopPropagation()
    const index = filteredPhotos.findIndex(p => p.id === photo.id)
    setCurrentImageIndex(index)
    setSelectedPhoto(photo)
  }

  const nextPhoto = () => {
    const nextIndex = (currentImageIndex + 1) % filteredPhotos.length
    setCurrentImageIndex(nextIndex)
    setSelectedPhoto(filteredPhotos[nextIndex])
  }

  const prevPhoto = () => {
    const prevIndex = (currentImageIndex - 1 + filteredPhotos.length) % filteredPhotos.length
    setCurrentImageIndex(prevIndex)
    setSelectedPhoto(filteredPhotos[prevIndex])
  }

  const filteredPhotos = photos.filter(photo =>
    photo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getMasonryClass = (index) => {
    const patterns = [
      'row-span-2',
      'col-span-2',
      'row-span-2 col-span-2',
      '',
      '',
      'row-span-2',
      '',
      'col-span-2',
    ]
    return patterns[index % patterns.length]
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-yellow-500 border-t-transparent"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Loading Your Gallery</h2>
          <p className="text-gray-400">Preparing your beautiful memories...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* HEADER - Same as before */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-[#0a0a0a] border-b border-white/10"
      >
        <div className="relative px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/client/dashboard')}
              className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 mb-6 transition-colors font-medium"
            >
              <FaArrowLeft /> Back to Dashboard
            </motion.button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg shadow-yellow-500/30">
                    <FaCamera className="text-2xl text-black" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      {eventData?.eventType} • {eventData?.eventDate ? new Date(eventData.eventDate).toLocaleDateString() : ''}
                    </p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                      {eventData?.name || 'Wedding Gallery'}
                    </h1>
                  </div>
                </motion.div>

                <p className="text-xl text-gray-300 flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  {photos.length} beautiful moments captured for you
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-right"
              >
                <div className="inline-block p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl border border-yellow-500/30">
                  <p className="text-sm text-gray-400 mb-1">Powered by</p>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    RN PhotoFilms
                  </h2>
                  <p className="text-xs text-gray-400 mt-1 italic">Your Emotions, Our Lens</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS - Same as before */}
      <div className="bg-gradient-to-r from-gray-900/50 via-gray-800/50 to-gray-900/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FaImages, color: 'yellow', label: 'Total Photos', value: photos.length },
              { icon: FaCheckCircle, color: 'green', label: 'Selected', value: selectedPhotos.length },
              { icon: FaHeart, color: 'pink', label: 'Favorites', value: favorites.length },
              { icon: FaFolder, color: 'blue', label: 'Total MB', value: (photos.reduce((sum, p) => sum + p.size, 0) / (1024 * 1024)).toFixed(1) }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm"
              >
                <stat.icon className={`text-3xl text-${stat.color}-500 mx-auto mb-2`} />
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* TOOLBAR - Same as before */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    viewMode === 'grid'
                      ? 'bg-yellow-500 text-black font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaTh /> Grid
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                    viewMode === 'masonry'
                      ? 'bg-yellow-500 text-black font-medium'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaThLarge /> Masonry
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={selectAll}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center gap-2 font-medium"
              >
                <FaCheckCircle /> {selectedPhotos.length === filteredPhotos.length ? 'Deselect All' : 'Select All'}
              </motion.button>

              <motion.button
                whileHover={{ scale: selectedPhotos.length > 0 ? 1.05 : 1 }}
                whileTap={{ scale: selectedPhotos.length > 0 ? 0.95 : 1 }}
                onClick={downloadSelected}
                disabled={selectedPhotos.length === 0}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-medium ${
                  selectedPhotos.length > 0
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:shadow-lg hover:shadow-yellow-500/50'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaCloudDownloadAlt /> Download ({selectedPhotos.length})
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY - OPTIMIZED IMAGE LOADING */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredPhotos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FaImages className="text-6xl text-gray-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {searchQuery ? 'No photos found' : 'Gallery Empty'}
            </h3>
            <p className="text-gray-400">
              {searchQuery ? 'Try a different search term' : 'Photos will appear here once uploaded'}
            </p>
          </motion.div>
        ) : (
          <div className={
            viewMode === 'masonry'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          }>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(index * 0.01, 0.5), duration: 0.3 }}
                className={`relative group cursor-pointer ${viewMode === 'masonry' ? getMasonryClass(index) : ''}`}
                onClick={(e) => openLightbox(photo, e)}
              >
                <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl bg-gray-900/50 border border-white/10 backdrop-blur-sm">
                  {/* Loading Skeleton */}
                  {!imageLoaded[photo.id] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 animate-pulse flex items-center justify-center">
                      <FaImages className="text-4xl text-gray-600" />
                    </div>
                  )}

                  {/* ✅ OPTIMIZED IMAGE with Smart URL Selection */}
                  <img
                    src={getImageUrl(photo, 'thumbnail')}
                    alt={photo.name}
                    onLoad={() => handleImageLoad(photo.id)}
                    onError={(e) => {
                      handleImageError(photo.id, e.target.src, photo)
                      // Auto-retry with next URL
                      const nextUrl = getImageUrl(photo, 'thumbnail')
                      if (e.target.src !== nextUrl) {
                        e.target.src = nextUrl
                      }
                    }}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-90"
                    loading="lazy"
                    style={{ 
                      opacity: imageLoaded[photo.id] ? 1 : 0, 
                      transition: 'opacity 0.3s ease'
                    }}
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium truncate text-sm mb-3">
                        {photo.name}
                      </p>

                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleSelection(photo.id, e)}
                          className={`flex-1 py-2 rounded-lg transition-all font-medium ${
                            selectedPhotos.includes(photo.id)
                              ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50'
                              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                          }`}
                        >
                          <FaCheckCircle className="mx-auto" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleFavorite(photo.id, e)}
                          className={`flex-1 py-2 rounded-lg transition-all ${
                            favorites.includes(photo.id)
                              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/50'
                              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                          }`}
                        >
                          <FaHeart className="mx-auto" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation()
                            downloadPhoto(photo)
                          }}
                          className="flex-1 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-all"
                        >
                          <FaDownload className="mx-auto" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => openLightbox(photo, e)}
                          className="flex-1 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-all"
                        >
                          <FaExpand className="mx-auto" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Indicators */}
                  <AnimatePresence>
                    {selectedPhotos.includes(photo.id) && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="absolute top-3 right-3 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 border-2 border-white z-10"
                      >
                        <FaCheckCircle className="text-black text-xl" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {favorites.includes(photo.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute top-3 left-3 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/50 border-2 border-white z-10"
                      >
                        <FaHeart className="text-white text-lg" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/98 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-7xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-14 right-0 w-12 h-12 bg-red-500/20 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all border border-red-500 z-50"
              >
                <FaTimes className="text-xl" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/20"
              >
                <FaArrowLeft className="text-xl" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm border border-white/20"
              >
                <FaArrowLeft className="rotate-180 text-xl" />
              </motion.button>

              {/* ✅ Full HD Image in Lightbox */}
              <img
                src={getImageUrl(selectedPhoto, 'full')}
                alt={selectedPhoto.name}
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />

              <div className="mt-4 p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between border border-white/20 gap-4">
                <div>
                  <p className="text-white font-medium text-lg">{selectedPhoto.name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Photo {currentImageIndex + 1} of {filteredPhotos.length} • {(selectedPhoto.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => toggleFavorite(selectedPhoto.id, e)}
                    className={`px-6 py-3 rounded-xl transition-all font-medium flex items-center gap-2 ${
                      favorites.includes(selectedPhoto.id)
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/50'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    <FaHeart /> {favorites.includes(selectedPhoto.id) ? 'Favorited' : 'Favorite'}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downloadPhoto(selectedPhoto)}
                    className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black rounded-xl transition-all font-medium flex items-center gap-2 shadow-lg shadow-yellow-500/50"
                  >
                    <FaDownload /> Download
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <div className="bg-gradient-to-t from-gray-900 to-transparent border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-center gap-3">
              <FaCamera className="text-2xl text-yellow-500" />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                RN PhotoFilms
              </h3>
            </div>
            <p className="text-gray-400 italic">Your Emotions, Our Lens</p>
            <p className="text-sm text-gray-500">
              © 2025 RN PhotoFilms • All rights reserved
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ClientGallery
