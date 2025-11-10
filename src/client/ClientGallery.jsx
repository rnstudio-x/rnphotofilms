import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaImages, FaDownload, FaExpand, FaTimes, FaCheckCircle, 
  FaSpinner, FaArrowLeft, FaSearch, FaCloudDownloadAlt, 
  FaFolder, FaHeart, FaCamera, FaStar, FaTh, FaThLarge,
  FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaRedoAlt
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
  const [lightboxImageLoading, setLightboxImageLoading] = useState(false)
  const [isSlideshow, setIsSlideshow] = useState(false)
  const [slideshowSpeed, setSlideshowSpeed] = useState(3000)

  const hasFetched = useRef(false)
  const slideshowInterval = useRef(null)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycby6Ph2hqgkYfoeMu_rIrvPvf0dU-NoG8N8vXACD8O9pWqGvdxFbXZ176XZRhukvaBDUFg/exec'

  const filteredPhotos = photos.filter(photo =>
    photo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true
    checkAuth()
    
    const navbar = document.querySelector('nav')
    if (navbar) navbar.style.display = 'none'
    
    return () => {
      if (navbar) navbar.style.display = ''
      stopSlideshow()
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedPhoto) return
      
      if (e.key === 'ArrowLeft') prevPhoto()
      if (e.key === 'ArrowRight') nextPhoto()
      if (e.key === 'Escape') {
        setSelectedPhoto(null)
        stopSlideshow()
      }
      if (e.key === ' ') {
        e.preventDefault()
        toggleSlideshow()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedPhoto, currentImageIndex, filteredPhotos, isSlideshow])

  // ✅ Slideshow control
  useEffect(() => {
    if (isSlideshow && selectedPhoto) {
      slideshowInterval.current = setInterval(() => {
        nextPhoto()
      }, slideshowSpeed)
    } else {
      if (slideshowInterval.current) {
        clearInterval(slideshowInterval.current)
      }
    }
    
    return () => {
      if (slideshowInterval.current) {
        clearInterval(slideshowInterval.current)
      }
    }
  }, [isSlideshow, selectedPhoto, slideshowSpeed, currentImageIndex])

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

  // ✅ Get HD lightbox image URL (w1600 for better quality)
  const getLightboxImageUrl = (photo) => {
    return `https://drive.google.com/thumbnail?id=${photo.id}&sz=w1600`
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
    setLightboxImageLoading(true)
  }

  const nextPhoto = () => {
    const nextIndex = (currentImageIndex + 1) % filteredPhotos.length
    setCurrentImageIndex(nextIndex)
    setSelectedPhoto(filteredPhotos[nextIndex])
    setLightboxImageLoading(true)
  }

  const prevPhoto = () => {
    const prevIndex = (currentImageIndex - 1 + filteredPhotos.length) % filteredPhotos.length
    setCurrentImageIndex(prevIndex)
    setSelectedPhoto(filteredPhotos[prevIndex])
    setLightboxImageLoading(true)
  }

  const toggleSlideshow = () => {
    setIsSlideshow(prev => !prev)
  }

  const stopSlideshow = () => {
    setIsSlideshow(false)
    if (slideshowInterval.current) {
      clearInterval(slideshowInterval.current)
    }
  }

  const startSlideshow = () => {
    if (!selectedPhoto && filteredPhotos.length > 0) {
      setCurrentImageIndex(0)
      setSelectedPhoto(filteredPhotos[0])
    }
    setIsSlideshow(true)
  }

  const getMasonryClass = (index) => {
    const patterns = ['row-span-2', 'col-span-2', 'row-span-2 col-span-2', '', '', 'row-span-2', '', 'col-span-2']
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
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-[#0a0a0a] border-b border-white/10"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        
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

      {/* STATS */}
      <div className="bg-gradient-to-r from-gray-900/50 via-gray-800/50 to-gray-900/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: FaImages, color: 'from-yellow-500 to-orange-500', label: 'Total Photos', value: photos.length },
              { icon: FaCheckCircle, color: 'from-green-500 to-emerald-500', label: 'Selected', value: selectedPhotos.length },
              { icon: FaHeart, color: 'from-pink-500 to-rose-500', label: 'Favorites', value: favorites.length },
              { icon: FaFolder, color: 'from-blue-500 to-cyan-500', label: 'Total MB', value: (photos.reduce((sum, p) => sum + p.size, 0) / (1024 * 1024)).toFixed(1) }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05, y: -2 }}
                className="text-center p-4 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/10 backdrop-blur-sm"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="text-2xl text-white" />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
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
              {/* ✅ Slideshow Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startSlideshow}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all flex items-center gap-2 font-medium text-sm shadow-lg shadow-purple-500/50"
              >
                <FaPlay /> Start Slideshow
              </motion.button>

              <div className="flex bg-white/10 rounded-xl p-1 border border-white/20">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                    viewMode === 'grid' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaTh /> Grid
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium ${
                    viewMode === 'masonry' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <FaThLarge /> Masonry
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={selectAll}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all flex items-center gap-2 font-medium text-sm"
              >
                <FaCheckCircle /> {selectedPhotos.length === filteredPhotos.length ? 'Deselect All' : 'Select All'}
              </motion.button>

              <motion.button
                whileHover={{ scale: selectedPhotos.length > 0 ? 1.05 : 1 }}
                whileTap={{ scale: selectedPhotos.length > 0 ? 0.95 : 1 }}
                onClick={downloadSelected}
                disabled={selectedPhotos.length === 0}
                className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-medium text-sm ${
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

      {/* GALLERY */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {filteredPhotos.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <FaImages className="text-5xl text-gray-600" />
            </div>
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
                  {!imageLoaded[photo.id] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 animate-pulse flex items-center justify-center">
                      <FaSpinner className="text-4xl text-gray-600 animate-spin" />
                    </div>
                  )}

                  {/* ✅ HD Thumbnail (w800) */}
                  <img
                    src={`https://drive.google.com/thumbnail?id=${photo.id}&sz=w800`}
                    alt={photo.name}
                    onLoad={() => setImageLoaded(prev => ({ ...prev, [photo.id]: true }))}
                    onError={(e) => {
                      if (!e.target.dataset.retry) {
                        e.target.dataset.retry = '1'
                        e.target.src = photo.thumbnailUrl
                      }
                    }}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-90"
                    loading="lazy"
                    style={{ opacity: imageLoaded[photo.id] ? 1 : 0, transition: 'opacity 0.3s ease' }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium truncate text-sm mb-3">{photo.name}</p>
                      <div className="flex gap-2">
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleSelection(photo.id, e)}
                          className={`flex-1 py-2 rounded-lg transition-all font-medium ${
                            selectedPhotos.includes(photo.id)
                              ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50'
                              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                          }`}>
                          <FaCheckCircle className="mx-auto text-lg" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={(e) => toggleFavorite(photo.id, e)}
                          className={`flex-1 py-2 rounded-lg transition-all ${
                            favorites.includes(photo.id)
                              ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/50'
                              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                          }`}>
                          <FaHeart className="mx-auto text-lg" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={(e) => { e.stopPropagation(); downloadPhoto(photo) }}
                          className="flex-1 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-all">
                          <FaDownload className="mx-auto text-lg" />
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={(e) => openLightbox(photo, e)}
                          className="flex-1 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-lg transition-all">
                          <FaExpand className="mx-auto text-lg" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {selectedPhotos.includes(photo.id) && (
                      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 180 }}
                        className="absolute top-3 right-3 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50 border-2 border-white z-10">
                        <FaCheckCircle className="text-black text-xl" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {favorites.includes(photo.id) && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute top-3 left-3 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/50 border-2 border-white z-10">
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

      {/* ✅ PROFESSIONAL LIGHTBOX WITH SLIDESHOW */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => { setSelectedPhoto(null); stopSlideshow(); }}>
            
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent z-20">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-white">
                  <p className="text-xl font-bold">{selectedPhoto.name}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    Photo {currentImageIndex + 1} of {filteredPhotos.length} • {(selectedPhoto.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <div className="flex gap-3">
                  {/* Slideshow Speed Control */}
                  <select
                    value={slideshowSpeed}
                    onChange={(e) => setSlideshowSpeed(Number(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="2000" className="bg-gray-900">2s</option>
                    <option value="3000" className="bg-gray-900">3s</option>
                    <option value="5000" className="bg-gray-900">5s</option>
                    <option value="10000" className="bg-gray-900">10s</option>
                  </select>

                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); toggleSlideshow(); }}
                    className={`px-6 py-2 rounded-xl flex items-center gap-2 font-medium transition-all ${
                      isSlideshow 
                        ? 'bg-red-500 hover:bg-red-600 text-white' 
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                    }`}>
                    {isSlideshow ? <><FaPause /> Pause</> : <><FaPlay /> Play</>}
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); stopSlideshow(); }}
                    className="w-12 h-12 bg-red-500/20 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all border border-red-500">
                    <FaTimes className="text-xl" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <motion.button whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }} 
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm border-2 border-white/20">
              <FaChevronLeft className="text-3xl" />
            </motion.button>

            <motion.button whileHover={{ scale: 1.1, x: 5 }} whileTap={{ scale: 0.9 }} 
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-sm border-2 border-white/20">
              <FaChevronRight className="text-3xl" />
            </motion.button>

            {/* Main Image */}
            <div className="relative w-full h-full flex items-center justify-center p-20" onClick={(e) => e.stopPropagation()}>
              {lightboxImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaSpinner className="text-6xl text-yellow-500 animate-spin" />
                </div>
              )}

              {/* ✅ HD Image (w1600 for best quality) */}
              <motion.img 
                key={selectedPhoto.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={getLightboxImageUrl(selectedPhoto)}
                alt={selectedPhoto.name}
                onLoad={() => setLightboxImageLoading(false)}
                onError={(e) => {
                  setLightboxImageLoading(false)
                  if (!e.target.dataset.fallback) {
                    e.target.dataset.fallback = 'true'
                    e.target.src = `https://drive.google.com/thumbnail?id=${selectedPhoto.id}&sz=w1200`
                  }
                }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{ opacity: lightboxImageLoading ? 0 : 1, transition: 'opacity 0.3s ease' }}
              />
            </div>

            {/* Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
              <div className="max-w-7xl mx-auto flex justify-center gap-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(selectedPhoto.id, e); }}
                  className={`px-8 py-3 rounded-xl transition-all font-medium flex items-center gap-2 ${
                    favorites.includes(selectedPhoto.id)
                      ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/50'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 backdrop-blur-sm'
                  }`}>
                  <FaHeart /> {favorites.includes(selectedPhoto.id) ? 'Favorited' : 'Add to Favorites'}
                </motion.button>

                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); downloadPhoto(selectedPhoto); }}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black rounded-xl transition-all font-medium flex items-center gap-2 shadow-lg shadow-yellow-500/50">
                  <FaDownload /> Download Full Quality
                </motion.button>
              </div>

              <p className="text-center text-sm text-gray-300 mt-4">
                ← → Navigate • SPACE Play/Pause • ESC Close • Perfect for SmartTV viewing 📺
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <div className="bg-gradient-to-t from-gray-900 to-transparent border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                <FaCamera className="text-xl text-black" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                RN PhotoFilms
              </h3>
            </div>
            <p className="text-gray-400 italic">Your Emotions, Our Lens</p>
            <p className="text-sm text-gray-500">© 2025 RN PhotoFilms • All rights reserved</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ClientGallery
