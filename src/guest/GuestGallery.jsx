import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaImages, FaDownload, FaExpand, FaTimes, FaCheckCircle, FaArrowLeft, 
  FaSearch, FaCloudDownloadAlt, FaFolder, FaHeart, FaCamera, FaStar, 
  FaTh, FaThLarge, FaChevronLeft, FaChevronRight, FaPlay, FaPause, 
  FaVolumeUp, FaVolumeMute, FaMusic, FaUser, FaShare, FaRobot, FaSmile,
  FaSignOutAlt 
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
  const [viewMode, setViewMode] = useState('masonry')
  const [showAiOnly, setShowAiOnly] = useState(false)
  const [aiMatchedPhotos, setAiMatchedPhotos] = useState([])

  // Slideshow States
  const [isSlideshow, setIsSlideshow] = useState(false)
  const [slideshowIndex, setSlideshowIndex] = useState(0)
  const [slideshowSpeed, setSlideshowSpeed] = useState(3000)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const slideshowIntervalRef = useRef(null)
  const audioRef = useRef(null)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbz9zCggAIoiuDer8YWLO89mlDFDFUEi4HAyMlDuJjML442wV3vA4I4r_g7yclz6Ix93LA/exec'

  // ==================== AUTHENTICATION & INITIALIZATION ====================
  useEffect(() => {
    checkAuthAndLoadGallery()
    
    const navbar = document.querySelector('nav')
    if (navbar) navbar.style.display = 'none'
    
    return () => {
      if (navbar) navbar.style.display = ''
      if (slideshowIntervalRef.current) clearInterval(slideshowIntervalRef.current)
    }
  }, [eventId])

  const checkAuthAndLoadGallery = async () => {
    console.log('🔐 Checking authentication...')
    console.log('📍 Event ID from URL:', eventId)
    
    const sessionData = localStorage.getItem('guestSession')
    
    if (!sessionData) {
      console.error('❌ No guest session found')
      alert('Please register first')
      navigate(`/guest/register/${eventId}`)
      return
    }
    
    try {
      const session = JSON.parse(sessionData)
      console.log('✅ Session loaded:', session)
      
      // Check session expiry (24 hours)
      const sessionTime = new Date(session.timestamp).getTime()
      const now = new Date().getTime()
      const hoursSinceRegistration = (now - sessionTime) / (1000 * 60 * 60)
      
      if (hoursSinceRegistration >= 24) {
        console.error('❌ Session expired (>24 hours)')
        alert('Your session has expired. Please register again.')
        localStorage.removeItem('guestSession')
        navigate(`/guest/register/${eventId}`)
        return
      }
      
      // Verify event ID
      if (session.eventId !== eventId) {
        console.error('❌ Event ID mismatch')
        alert('Invalid event access. Please register for this event.')
        navigate(`/guest/register/${eventId}`)
        return
      }
      
      // Set guest data
      setGuestData({
        id: session.guestId,
        name: session.guestName,
        eventId: session.eventId,
        matchedCount: session.matchedCount,
        matchedPhotoIds: session.matchedPhotoIds || [],
        timestamp: session.timestamp
      })
      
      console.log('✅ Calling fetchGallery...')
      await fetchGallery(session.guestId, session.token, session.matchedPhotoIds || [])
      
    } catch (error) {
      console.error('❌ Auth error:', error)
      alert('Session error. Please register again.')
      localStorage.removeItem('guestSession')
      navigate(`/guest/register/${eventId}`)
    }
  }

  const fetchGallery = async (guestId, token, matchedPhotoIds = []) => {
    setLoading(true)
    try {
      console.log('📸 Fetching gallery...')
      console.log('📊 Matched Photo IDs:', matchedPhotoIds)
      
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'getEventPhotosFromGallery',
          eventId: eventId
        })
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('❌ Non-JSON response:', text)
        throw new Error('Server returned non-JSON response.')
      }
      
      const result = await response.json()
      console.log('✅ Gallery response:', result)

      if (result.success) {
        const allPhotos = result.photos || []
        console.log('📸 Total photos loaded:', allPhotos.length)
        
        // Separate matched and unmatched
        const matched = []
        const unmatched = []
        
        allPhotos.forEach(photo => {
          if (matchedPhotoIds.includes(photo.id)) {
            matched.push({ ...photo, isMatched: true })
          } else {
            unmatched.push({ ...photo, isMatched: false })
          }
        })
        
        console.log('✅ Matched photos:', matched.length)
        console.log('✅ Other photos:', unmatched.length)
        
        setPhotos([...matched, ...unmatched])
        setAiMatchedPhotos(matched)
        
        if (matched.length > 0) {
          setShowAiOnly(true)
        }
        
      } else {
        console.error('❌ Gallery fetch failed:', result.message)
        alert('Failed to load gallery:\n\n' + result.message)
        navigate(`/guest/register/${eventId}`)
      }
    } catch (error) {
      console.error('❌ Fetch error:', error)
      alert('Failed to load gallery:\n\n' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      console.log('🚪 Logging out...')
      localStorage.removeItem('guestSession')
      navigate(`/guest/register/${eventId}`)
    }
  }

  // ==================== PHOTO SELECTION ====================
  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const selectAllPhotos = () => {
    const displayedPhotos = getDisplayedPhotos()
    setSelectedPhotos(displayedPhotos.map(p => p.id))
  }

  const deselectAllPhotos = () => {
    setSelectedPhotos([])
  }

  const downloadSelectedPhotos = () => {
    if (selectedPhotos.length === 0) {
      alert('Please select photos to download')
      return
    }

    selectedPhotos.forEach((photoId, index) => {
      const photo = photos.find(p => p.id === photoId)
      if (photo) {
        setTimeout(() => {
          const link = document.createElement('a')
          link.href = photo.url
          link.download = photo.name || `photo_${index + 1}.jpg`
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }, index * 500)
      }
    })

    alert(`Downloading ${selectedPhotos.length} photos...`)
  }

  // ==================== FILTERING ====================
  const getDisplayedPhotos = () => {
    let filtered = photos

    if (showAiOnly) {
      filtered = aiMatchedPhotos
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(photo =>
        photo.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }

  // ==================== SLIDESHOW ====================
  const startSlideshow = () => {
    setIsSlideshow(true)
    setSlideshowIndex(0)
    
    slideshowIntervalRef.current = setInterval(() => {
      setSlideshowIndex(prev => {
        const displayedPhotos = getDisplayedPhotos()
        return (prev + 1) % displayedPhotos.length
      })
    }, slideshowSpeed)
  }

  const stopSlideshow = () => {
    setIsSlideshow(false)
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current)
    }
  }

  const toggleSlideshowPlayPause = () => {
    if (slideshowIntervalRef.current) {
      clearInterval(slideshowIntervalRef.current)
      slideshowIntervalRef.current = null
    } else {
      slideshowIntervalRef.current = setInterval(() => {
        setSlideshowIndex(prev => {
          const displayedPhotos = getDisplayedPhotos()
          return (prev + 1) % displayedPhotos.length
        })
      }, slideshowSpeed)
    }
  }

  const nextSlide = () => {
    setSlideshowIndex(prev => {
      const displayedPhotos = getDisplayedPhotos()
      return (prev + 1) % displayedPhotos.length
    })
  }

  const prevSlide = () => {
    setSlideshowIndex(prev => {
      const displayedPhotos = getDisplayedPhotos()
      return (prev - 1 + displayedPhotos.length) % displayedPhotos.length
    })
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsMusicPlaying(!isMusicPlaying)
    }
  }

  const displayedPhotos = getDisplayedPhotos()

  // ==================== LOADING STATE ====================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-white mb-4"></div>
          <p className="text-white text-2xl font-semibold">📸 Loading your gallery...</p>
          <p className="text-white/60 mt-2">✨ Powered by AI Face Recognition</p>
        </div>
      </div>
    )
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* HEADER */}
      <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Welcome */}
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaUser className="text-purple-400" />
                Welcome, {guestData?.name}! 👋
              </h1>
              <p className="text-white/60 text-sm mt-1">
                Event: {eventId} • {photos.length} photos total
                {aiMatchedPhotos.length > 0 && (
                  <span className="text-green-400 ml-2">
                    • {aiMatchedPhotos.length} matched for you ✨
                  </span>
                )}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {selectedPhotos.length > 0 && (
                <button
                  onClick={downloadSelectedPhotos}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <FaDownload />
                  Download ({selectedPhotos.length})
                </button>
              )}

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg font-semibold transition-all flex items-center gap-2 border border-red-500/50"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* AI Filter */}
            {aiMatchedPhotos.length > 0 && (
              <button
                onClick={() => setShowAiOnly(!showAiOnly)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  showAiOnly
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                <FaRobot />
                {showAiOnly ? `My Photos (${aiMatchedPhotos.length})` : 'All Photos'}
              </button>
            )}

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('masonry')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'masonry' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white'
                }`}
              >
                <FaTh />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' ? 'bg-purple-500 text-white' : 'bg-white/10 text-white'
                }`}
              >
                <FaThLarge />
              </button>
            </div>

            {/* Select All */}
            <button
              onClick={selectedPhotos.length === displayedPhotos.length ? deselectAllPhotos : selectAllPhotos}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <FaCheckCircle />
              {selectedPhotos.length === displayedPhotos.length ? 'Deselect All' : 'Select All'}
            </button>

            {/* Slideshow */}
            <button
              onClick={startSlideshow}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
            >
              <FaPlay />
              Slideshow
            </button>
          </div>
        </div>
      </div>
      {/* PHOTO GRID */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {displayedPhotos.length === 0 ? (
          <div className="text-center py-20">
            <FaImages className="text-6xl text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-xl">
              {showAiOnly
                ? 'No photos matched your face. Try viewing all photos.'
                : searchQuery
                ? 'No photos found matching your search.'
                : 'No photos available.'}
            </p>
            {showAiOnly && (
              <button
                onClick={() => setShowAiOnly(false)}
                className="mt-4 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold"
              >
                View All Photos
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'masonry' ? 'columns-1 md:columns-2 lg:columns-3 gap-4' : 'grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'}>
            {displayedPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative group cursor-pointer ${viewMode === 'masonry' ? 'mb-4' : ''}`}
                onClick={() => setSelectedPhoto(photo)}
              >
                {/* Matched Badge */}
                {photo.isMatched && (
                  <div className="absolute top-2 left-2 z-10 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                    <FaCheckCircle />
                    You're Here!
                  </div>
                )}

                {/* Checkbox */}
                <div
                  className="absolute top-2 right-2 z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePhotoSelection(photo.id)
                  }}
                >
                  <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                    selectedPhotos.includes(photo.id)
                      ? 'bg-purple-500 border-purple-500'
                      : 'bg-black/50 border-white backdrop-blur-sm'
                  }`}>
                    {selectedPhotos.includes(photo.id) && (
                      <FaCheckCircle className="text-white text-sm" />
                    )}
                  </div>
                </div>

                {/* Image */}
                <img
                  src={photo.thumbnail}
                  alt={photo.name}
                  className="w-full rounded-lg shadow-lg group-hover:scale-105 transition-transform"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <FaExpand className="text-white text-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ==================== PHOTO VIEWER MODAL ==================== */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
            >
              <FaTimes className="text-2xl" />
            </button>

            <div
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />

              {selectedPhoto.isMatched && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-green-500 text-white font-bold rounded-full flex items-center gap-2 shadow-lg">
                  <FaCheckCircle />
                  You're in this photo!
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                <button
                  onClick={() => {
                    const link = document.createElement('a')
                    link.href = selectedPhoto.url
                    link.download = selectedPhoto.name
                    link.target = '_blank'
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                  }}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
                >
                  <FaDownload />
                  Download
                </button>

                <button
                  onClick={() => togglePhotoSelection(selectedPhoto.id)}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    selectedPhotos.includes(selectedPhoto.id)
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <FaHeart />
                  {selectedPhotos.includes(selectedPhoto.id) ? 'Selected' : 'Select'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== SLIDESHOW MODAL ==================== */}
      <AnimatePresence>
        {isSlideshow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={stopSlideshow}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
            >
              <FaTimes className="text-2xl" />
            </button>

            {/* Controls */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <button
                onClick={toggleSlideshowPlayPause}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              >
                {slideshowIntervalRef.current ? <FaPause /> : <FaPlay />}
              </button>

              <button
                onClick={toggleMusic}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              >
                {isMusicPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>

              <select
                value={slideshowSpeed}
                onChange={(e) => {
                  setSlideshowSpeed(Number(e.target.value))
                  if (slideshowIntervalRef.current) {
                    clearInterval(slideshowIntervalRef.current)
                    slideshowIntervalRef.current = setInterval(() => {
                      setSlideshowIndex(prev => {
                        const displayedPhotos = getDisplayedPhotos()
                        return (prev + 1) % displayedPhotos.length
                      })
                    }, Number(e.target.value))
                  }
                }}
                className="px-4 py-2 bg-white/10 text-white rounded-lg"
              >
                <option value="2000">Fast (2s)</option>
                <option value="3000">Normal (3s)</option>
                <option value="5000">Slow (5s)</option>
              </select>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <FaChevronLeft className="text-2xl" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <FaChevronRight className="text-2xl" />
            </button>

            {/* Image */}
            <motion.div
              key={slideshowIndex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="relative max-w-6xl w-full px-20"
            >
              <img
                src={displayedPhotos[slideshowIndex]?.url}
                alt={displayedPhotos[slideshowIndex]?.name}
                className="w-full h-auto max-h-[90vh] object-contain"
              />

              {displayedPhotos[slideshowIndex]?.isMatched && (
                <div className="absolute top-4 left-4 px-4 py-2 bg-green-500 text-white font-bold rounded-full flex items-center gap-2">
                  <FaCheckCircle />
                  You're Here!
                </div>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full">
                {slideshowIndex + 1} / {displayedPhotos.length}
              </div>
            </motion.div>

            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              src="https://www.bensound.com/bensound-music/bensound-memories.mp3"
              loop
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== FLOATING ACTION BUTTONS ==================== */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-30">
        {selectedPhotos.length > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={downloadSelectedPhotos}
            className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all relative"
            title="Download Selected"
          >
            <FaCloudDownloadAlt className="text-2xl" />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
              {selectedPhotos.length}
            </span>
          </motion.button>
        )}

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="p-4 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg transition-all"
          title="Back to Top"
        >
          <FaArrowLeft className="text-2xl rotate-90" />
        </button>
      </div>

      {/* ==================== STATS BANNER ==================== */}
      {displayedPhotos.length > 0 && (
        <div className="fixed bottom-8 left-8 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full text-white z-30">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              <FaImages />
              {displayedPhotos.length} photos
            </span>
            {selectedPhotos.length > 0 && (
              <span className="flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                {selectedPhotos.length} selected
              </span>
            )}
            {aiMatchedPhotos.length > 0 && (
              <span className="flex items-center gap-2">
                <FaRobot className="text-purple-400" />
                {aiMatchedPhotos.length} matched
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GuestGallery
