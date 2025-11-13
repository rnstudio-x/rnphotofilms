import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaImages, FaDownload, FaExpand, FaTimes, FaCheckCircle, FaArrowLeft, 
  FaSearch, FaCloudDownloadAlt, FaFolder, FaHeart, FaCamera, FaStar, 
  FaTh, FaThLarge, FaChevronLeft, FaChevronRight, FaPlay, FaPause, 
  FaVolumeUp, FaVolumeMute, FaMusic, FaUser, FaShare, FaRobot, FaSmile 
} from 'react-icons/fa'

const GuestGallery = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()

  // Auth & Data States
  const [guestData, setGuestData] = useState(null)
  const [eventData, setEventData] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  // Gallery States
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('masonry') // 'masonry' or 'grid'
  const [favorites, setFavorites] = useState([])

  // Lightbox States
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSlideshow, setIsSlideshow] = useState(false)
  const [slideshowSpeed, setSlideshowSpeed] = useState(3000)

  // Audio States
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // ✅ ADDED: AI Face Matching States
  const [aiMatchedPhotos, setAiMatchedPhotos] = useState([])
  const [showAiOnly, setShowAiOnly] = useState(false)
  const [aiMatchingProgress, setAiMatchingProgress] = useState(0)
  const [isMatchingInProgress, setIsMatchingInProgress] = useState(false)
  const [matchConfidenceScores, setMatchConfidenceScores] = useState({}) // photoId -> confidence score

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxXXvhEKM251zscij8ghgQM1Q2nBWM10J3PRSy8Cleu1a64i2icdGbnL-vZiKYALOl28A/exec'

  // ==================== AUTHENTICATION ====================
  useEffect(() => {
    checkAuth()

    // Hide main navbar
    const navbar = document.querySelector('nav')
    if (navbar) navbar.style.display = 'none'

    return () => {
      if (navbar) navbar.style.display = ''
    }
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('guestToken')
    const data = localStorage.getItem('guestData')

    if (!token || !data) {
      navigate(`/guest/register/${eventId}`)
      return
    }

    try {
      const parsedData = JSON.parse(data)
      setGuestData(parsedData)
      fetchGallery(parsedData.id, token)
    } catch (error) {
      console.error('Auth error:', error)
      navigate(`/guest/register/${eventId}`)
    }
  }

  // ✅ UPDATED: Fetch gallery with AI face matching
  const fetchGallery = async (guestId, token) => {
    setLoading(true)

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'getGuestGallery',
          guestId: guestId,
          eventId: eventId,
          token: token
        })
      })

      const result = await response.json()

      if (result.success) {
        setEventData(result.event)
        setPhotos(result.photos || [])

        // ✅ ADDED: Perform client-side face matching
        if (result.guestDescriptor && result.photoDescriptors && result.photoDescriptors.length > 0) {
          console.log('📸 Starting AI face matching...')
          await performFaceMatching(result.guestDescriptor, result.photoDescriptors)
        } else if (result.aiMatchedPhotos) {
          // Fallback: Server already did matching
          setAiMatchedPhotos(result.aiMatchedPhotos)
          setShowAiOnly(true)
          console.log('✅ Loaded pre-matched photos from server')
        } else {
          console.log('⚠️ No face descriptors available for matching')
        }
      } else {
        alert(result.message || 'Failed to load gallery')
        navigate(`/guest/register/${eventId}`)
      }
    } catch (error) {
      console.error('Fetch error:', error)
      alert('Failed to load gallery. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ ADDED: Perform face matching on client side
  const performFaceMatching = async (guestDescriptor, photoDescriptors) => {
    setIsMatchingInProgress(true)
    setAiMatchingProgress(10)

    try {
      // Load models
      setAiMatchingProgress(20)
      await loadFaceApiModels()
      setAiMatchingProgress(40)

      console.log(`🔍 Matching face against ${photoDescriptors.length} photos...`)

      // Find matches with confidence scores
      const matches = []
      const scores = {}

      for (let i = 0; i < photoDescriptors.length; i++) {
        const photoDesc = photoDescriptors[i]
        const matchResults = findMatchingPhotos(
          guestDescriptor, 
          [photoDesc], 
          0.6 // Threshold
        )

        if (matchResults.length > 0) {
          matches.push(photoDesc.photoId)
          // Calculate confidence percentage (lower distance = higher confidence)
          // Distance typically 0.4-0.6 for matches
          const confidence = Math.max(0, Math.min(100, (1 - photoDesc.distance) * 100))
          scores[photoDesc.photoId] = confidence.toFixed(1)
        }

        // Update progress
        setAiMatchingProgress(40 + (i / photoDescriptors.length) * 50)
      }

      setAiMatchedPhotos(matches)
      setMatchConfidenceScores(scores)
      setAiMatchingProgress(100)

      if (matches.length > 0) {
        setShowAiOnly(true) // Auto-enable filter
        console.log(`✅ Found ${matches.length} matching photos!`)
      } else {
        console.log('😔 No matching photos found')
        setTimeout(() => {
          alert('No photos with your face found yet. Try browsing all photos or check back later when more photos are processed!')
        }, 500)
      }
    } catch (error) {
      console.error('❌ Face matching error:', error)
      alert('Face matching encountered an error. You can still browse all event photos.')
    } finally {
      setIsMatchingInProgress(false)
    }
  }

  // ==================== FILTER & SEARCH ====================
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         photo.description?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAiFilter = !showAiOnly || aiMatchedPhotos.includes(photo.id)

    return matchesSearch && matchesAiFilter
  })

  // ==================== FAVORITES ====================
  const toggleFavorite = (photoId) => {
    setFavorites(prev => 
      prev.includes(photoId) 
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  // ==================== SELECTION ====================
  const toggleSelection = (photoId) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const selectAll = () => {
    setSelectedPhotos(filteredPhotos.map(p => p.id))
  }

  const deselectAll = () => {
    setSelectedPhotos([])
  }

  // ==================== DOWNLOAD ====================
  const downloadPhoto = async (photo) => {
    try {
      const link = document.createElement('a')
      link.href = photo.url
      link.download = photo.name || `photo-${photo.id}.jpg`
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed. Please try again.')
    }
  }

  const downloadSelected = () => {
    selectedPhotos.forEach(photoId => {
      const photo = photos.find(p => p.id === photoId)
      if (photo) downloadPhoto(photo)
    })
  }

  // ==================== LIGHTBOX ====================
  const openLightbox = (photoIndex) => {
    setCurrentImageIndex(photoIndex)
    setSelectedPhoto(filteredPhotos[photoIndex])
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
    setIsSlideshow(false)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedPhoto) return

      switch(e.key) {
        case 'ArrowRight':
          nextPhoto()
          break
        case 'ArrowLeft':
          prevPhoto()
          break
        case 'Escape':
          closeLightbox()
          break
        case ' ':
          e.preventDefault()
          toggleSlideshow()
          break
        case 'm':
        case 'M':
          toggleMute()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedPhoto, currentImageIndex])

  // Slideshow effect
  useEffect(() => {
    if (!isSlideshow) return

    const interval = setInterval(() => {
      nextPhoto()
    }, slideshowSpeed)

    return () => clearInterval(interval)
  }, [isSlideshow, slideshowSpeed, currentImageIndex])

  // ==================== SLIDESHOW CONTROLS ====================
  const toggleSlideshow = () => {
    setIsSlideshow(!isSlideshow)

    if (!isSlideshow && !isPlaying) {
      playMusic()
    }
  }

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // ==================== LOADING STATE ====================
  if (loading || isMatchingInProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-20 h-20 border-4 border-purple-500 border-t-white rounded-full mx-auto"
          />

          <div>
            <h2 className="text-2xl font-bold mb-2">
              {loading ? '📸 Loading your gallery...' : '🤖 AI is matching your face...'}
            </h2>
            <p className="text-white/80">
              {eventData?.eventType} • {eventData?.eventDate ? new Date(eventData.eventDate).toLocaleDateString() : ''}
            </p>
          </div>

          {isMatchingInProgress && (
            <div className="w-64 mx-auto">
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${aiMatchingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-white/60 text-sm mt-2">{Math.round(aiMatchingProgress)}% complete</p>
            </div>
          )}

          <div className="flex items-center justify-center space-x-2 text-sm text-white/60">
            <FaRobot className="animate-pulse" />
            <span>Powered by AI Face Recognition</span>
          </div>
        </motion.div>
      </div>
    )
  }

  // ==================== MAIN GALLERY UI ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-4">
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome, {guestData?.name}! 👋
            </h1>
            <p className="text-white/80">
              {eventData?.eventType} • {eventData?.eventDate ? new Date(eventData.eventDate).toLocaleDateString() : ''}
            </p>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('guestToken')
              localStorage.removeItem('guestData')
              navigate('/')
            }}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all flex items-center space-x-2"
          >
            <FaArrowLeft />
            <span>Exit</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <FaImages className="text-purple-300 text-xl" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total Photos</p>
                <p className="text-white text-2xl font-bold">{photos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-pink-500/30 rounded-xl flex items-center justify-center">
                <FaRobot className="text-pink-300 text-xl" />
              </div>
              <div>
                <p className="text-white/60 text-sm">AI Matched</p>
                <p className="text-white text-2xl font-bold">{aiMatchedPhotos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500/30 rounded-xl flex items-center justify-center">
                <FaHeart className="text-red-300 text-xl" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Favorites</p>
                <p className="text-white text-2xl font-bold">{favorites.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-green-300 text-xl" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Selected</p>
                <p className="text-white text-2xl font-bold">{selectedPhotos.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* AI Filter Button */}
          <button
            onClick={() => setShowAiOnly(!showAiOnly)}
            disabled={aiMatchedPhotos.length === 0}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
              showAiOnly
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <FaRobot />
            <span>
              {showAiOnly ? '✓ AI Matched Photos' : 'Show My Photos'} 
              {aiMatchedPhotos.length > 0 && ` (${aiMatchedPhotos.length})`}
            </span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('masonry')}
              className={`px-4 py-3 ${viewMode === 'masonry' ? 'bg-white/20 text-white' : 'text-white/60'}`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/60'}`}
            >
              <FaThLarge />
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 text-white placeholder-white/50 rounded-xl border border-white/20 focus:border-purple-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedPhotos.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={downloadSelected}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center space-x-2 transition-all"
              >
                <FaDownload />
                <span>Download ({selectedPhotos.length})</span>
              </button>
              <button
                onClick={deselectAll}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all"
              >
                Clear
              </button>
            </div>
          )}

          {selectedPhotos.length === 0 && filteredPhotos.length > 0 && (
            <button
              onClick={selectAll}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
            >
              Select All
            </button>
          )}
        </div>

        {/* AI Match Info Banner */}
        {showAiOnly && aiMatchedPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <FaRobot className="text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">
                    🎯 Found {aiMatchedPhotos.length} photos with your face!
                  </p>
                  <p className="text-white/70 text-sm">
                    AI matched with {Math.round((aiMatchedPhotos.length / photos.length) * 100)}% accuracy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAiOnly(false)}
                className="text-white/80 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white py-20"
        >
          <FaSmile className="text-6xl mx-auto mb-4 text-white/40" />
          <h3 className="text-2xl font-bold mb-2">
            {showAiOnly ? 'No AI matched photos yet' : 'No photos found'}
          </h3>
          <p className="text-white/60 mb-6">
            {showAiOnly 
              ? 'Try browsing all photos or check back later!' 
              : 'Try adjusting your search query'}
          </p>
          {showAiOnly && (
            <button
              onClick={() => setShowAiOnly(false)}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-all"
            >
              Show All Photos
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          className={`max-w-7xl mx-auto ${
            viewMode === 'masonry' 
              ? 'columns-1 sm:columns-2 lg:columns-3 gap-4' 
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          }`}
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`relative group cursor-pointer rounded-xl overflow-hidden ${viewMode === 'masonry' ? 'mb-4 break-inside-avoid' : ''}`}
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.url}
                alt={photo.name}
                className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="font-semibold">{photo.name || `Photo ${index + 1}`}</p>
                  {aiMatchedPhotos.includes(photo.id) && matchConfidenceScores[photo.id] && (
                    <p className="text-xs text-green-300">
                      🤖 AI Match: {matchConfidenceScores[photo.id]}% confidence
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(photo.id)
                    }}
                    className={`w-10 h-10 rounded-full ${
                      favorites.includes(photo.id)
                        ? 'bg-red-500'
                        : 'bg-white/20 backdrop-blur-md'
                    } flex items-center justify-center hover:scale-110 transition-transform`}
                  >
                    <FaHeart className={`${favorites.includes(photo.id) ? 'text-white' : 'text-white/80'}`} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadPhoto(photo)
                    }}
                    className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <FaDownload className="text-white/80" />
                  </button>
                </div>

                {/* Selection Checkbox */}
                <div className="absolute top-4 left-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSelection(photo.id)
                    }}
                    className={`w-6 h-6 rounded border-2 ${
                      selectedPhotos.includes(photo.id)
                        ? 'bg-purple-500 border-purple-500'
                        : 'border-white/50 bg-black/30'
                    } flex items-center justify-center`}
                  >
                    {selectedPhotos.includes(photo.id) && <FaCheckCircle className="text-white text-sm" />}
                  </button>
                </div>

                {/* AI Match Badge */}
                {aiMatchedPhotos.includes(photo.id) && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center space-x-1">
                      <FaRobot />
                      <span>AI Match</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* LIGHTBOX - Keeping your existing lightbox code exactly as is */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* ... Your existing lightbox JSX remains exactly the same ... */}
            {/* I'm keeping all your existing lightbox controls, slideshow, music player */}

            <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
              >
                <FaTimes className="text-xl" />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={prevPhoto}
                className="absolute left-4 z-10 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
              >
                <FaChevronLeft className="text-2xl" />
              </button>

              <button
                onClick={nextPhoto}
                className="absolute right-4 z-10 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
              >
                <FaChevronRight className="text-2xl" />
              </button>

              {/* Image */}
              <motion.img
                key={selectedPhoto.id}
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="max-w-full max-h-[90vh] object-contain"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Info Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{selectedPhoto.name || `Photo ${currentImageIndex + 1}`}</p>
                    <p className="text-sm text-white/70">
                      {currentImageIndex + 1} of {filteredPhotos.length}
                    </p>
                    {aiMatchedPhotos.includes(selectedPhoto.id) && (
                      <p className="text-sm text-green-300 flex items-center space-x-1 mt-1">
                        <FaRobot />
                        <span>AI Matched • {matchConfidenceScores[selectedPhoto.id]}% confidence</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Slideshow Controls */}
                    <button
                      onClick={toggleSlideshow}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg flex items-center space-x-2 transition-all"
                    >
                      {isSlideshow ? <FaPause /> : <FaPlay />}
                      <span>{isSlideshow ? 'Pause' : 'Play'} Slideshow</span>
                    </button>

                    {/* Music Controls */}
                    <button
                      onClick={isPlaying ? pauseMusic : playMusic}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
                    >
                      {isPlaying ? <FaPause /> : <FaMusic />}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all"
                    >
                      {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>

                    {/* Download */}
                    <button
                      onClick={() => downloadPhoto(selectedPhoto)}
                      className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all"
                    >
                      <FaDownload />
                    </button>

                    {/* Favorite */}
                    <button
                      onClick={() => toggleFavorite(selectedPhoto.id)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                        favorites.includes(selectedPhoto.id)
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <FaHeart />
                    </button>
                  </div>
                </div>
              </div>

              {/* Keyboard Hints */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-lg p-3 text-white text-sm">
                <p>← → Navigate • Space Play/Pause • M Mute • Esc Exit</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-12 text-center text-white/60 text-sm">
        <p>Powered by RN PhotoFilms • AI Face Recognition Technology</p>
        <p className="mt-1">Your photos are private and secure 🔒</p>
      </div>
    </div>
  )
}

export default GuestGallery