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
  
  // ✅ NEW: Image loading & transitions (like ClientGallery)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState({})
  const [imageTransitioning, setImageTransitioning] = useState(false)

  // Slideshow States
  const [isSlideshow, setIsSlideshow] = useState(false)
  const [slideshowSpeed, setSlideshowSpeed] = useState(3000)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [musicVolume, setMusicVolume] = useState(0.5)
  const [isMuted, setIsMuted] = useState(false)
  
  // ✅ NEW: Refs for image caching & audio
  const slideshowInterval = useRef(null)
  const imageCache = useRef({})
  const audioRef = useRef(null)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbx2hS9aqJ9Mp9RIF52Yw2g7SeAv2nisSYRMXpvu9RFf3QXquD-8QgRVtLOj-vvK9Ibzzg/exec'
  const MUSIC_FILE = 'https://cdn.pixabay.com/audio/2021/11/23/audio_64b2dd1bce.mp3'

  // ✅ NEW: Get optimized image URLs (like ClientGallery)
  const getImageUrl = (photo, quality = 'hd') => {
  if (!photo || !photo.id) {
    console.warn('Invalid photo object:', photo)
    return 'https://via.placeholder.com/400?text=Image+Not+Found'
  }
  
  const sizes = {
    thumb: 'w400',
    preview: 'w800',
    hd: 'w1600',
    full: 'w2048'
  }
  
  // ✅ Use Drive's built-in thumbnail service
  const url = `https://drive.google.com/thumbnail?id=${photo.id}&sz=${sizes[quality]}`
  
  return url
}
// ✅ Add error handling for image loading
const handleImageError = (e, photo) => {
  console.error('Image load failed:', photo.id, photo.name)
  e.target.src = 'https://via.placeholder.com/400?text=Image+Error'
  e.target.onerror = null // Prevent infinite loop
}
  // ✅ NEW: Preload next images for smooth slideshow
  const preloadImages = (startIndex) => {
    const displayedPhotos = getDisplayedPhotos()
    for (let i = 1; i <= 3; i++) {
      const nextIndex = (startIndex + i) % displayedPhotos.length
      const photo = displayedPhotos[nextIndex]
      if (photo && !imageCache.current[photo.id]) {
        const img = new Image()
        img.src = getImageUrl(photo, 'hd')
        imageCache.current[photo.id] = img
      }
    }
  }

  // ✅ Audio initialization
  useEffect(() => {
    audioRef.current = new Audio(MUSIC_FILE)
    audioRef.current.loop = true
    audioRef.current.volume = musicVolume
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // ✅ Authentication & initialization
  useEffect(() => {
    checkAuthAndLoadGallery()
    
    const navbar = document.querySelector('nav')
    if (navbar) navbar.style.display = 'none'
    
    return () => {
      if (navbar) navbar.style.display = ''
      if (slideshowInterval.current) clearInterval(slideshowInterval.current)
    }
  }, [eventId])

  // ✅ Keyboard shortcuts (like ClientGallery)
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
      if (e.key === 'm' || e.key === 'M') {
        toggleMusic()
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedPhoto, currentImageIndex, isSlideshow, isMusicPlaying])

  // ✅ Slideshow management with auto music
  useEffect(() => {
    if (isSlideshow && selectedPhoto) {
      preloadImages(currentImageIndex)
      
      // Auto-start music in slideshow
      if (!isMusicPlaying && audioRef.current) {
        toggleMusic()
      }
      
      slideshowInterval.current = setInterval(() => {
        nextPhoto()
      }, slideshowSpeed)
    } else {
      if (slideshowInterval.current) {
        clearInterval(slideshowInterval.current)
      }
      // Auto-stop music when slideshow stops
      if (isMusicPlaying && audioRef.current && !isSlideshow) {
        audioRef.current.pause()
        setIsMusicPlaying(false)
      }
    }
    
    return () => {
      if (slideshowInterval.current) {
        clearInterval(slideshowInterval.current)
      }
    }
  }, [isSlideshow, selectedPhoto, slideshowSpeed, currentImageIndex])

  // ✅ Preload images when photo changes
  useEffect(() => {
    if (selectedPhoto) {
      preloadImages(currentImageIndex)
    }
  }, [selectedPhoto, currentImageIndex])

  // ✅ Touch swipe support (like ClientGallery)
  useEffect(() => {
    if (!selectedPhoto) return
    
    let touchStartX = 0
    let touchEndX = 0
    
    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX
    }
    
    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }
    
    const handleSwipe = () => {
      if (touchEndX < touchStartX - 50) nextPhoto()
      if (touchEndX > touchStartX + 50) prevPhoto()
    }
    
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [selectedPhoto, currentImageIndex])

  const checkAuthAndLoadGallery = async () => {
    console.log('🔐 Checking authentication...')
    
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
      
      // Check session expiry
      const sessionTime = new Date(session.timestamp).getTime()
      const now = new Date().getTime()
      const hoursSinceRegistration = (now - sessionTime) / (1000 * 60 * 60)
      
      if (hoursSinceRegistration >= 24) {
        console.error('❌ Session expired')
        alert('Your session has expired. Please register again.')
        localStorage.removeItem('guestSession')
        navigate(`/guest/register/${eventId}`)
        return
      }
      
      // Verify event ID
      if (session.eventId !== eventId) {
        console.error('❌ Event ID mismatch')
        alert('Invalid event access.')
        navigate(`/guest/register/${eventId}`)
        return
      }
      
      setGuestData({
        id: session.guestId,
        name: session.guestName,
        eventId: session.eventId,
        matchedCount: session.matchedCount,
        matchedPhotoIds: session.matchedPhotoIds || [],
        timestamp: session.timestamp
      })
      
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
      
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'getEventPhotosFromGallery',
          eventId: eventId
        })
      })

      const result = await response.json()
      console.log('✅ Gallery response:', result)

      if (result.success) {
        const allPhotos = result.photos || []
        console.log('📸 Total photos:', allPhotos.length)
        
        const matched = []
        const unmatched = []
        
        allPhotos.forEach(photo => {
          if (matchedPhotoIds.includes(photo.id)) {
            matched.push({ ...photo, isMatched: true })
          } else {
            unmatched.push({ ...photo, isMatched: false })
          }
        })
        
        console.log('✅ Matched:', matched.length)
        
        setPhotos([...matched, ...unmatched])
        setAiMatchedPhotos(matched)
        
        // ✅ Default to AI matched if available
        if (matched.length > 0) {
          setShowAiOnly(true)
        }
        
      } else {
        alert('Failed to load gallery')
        navigate(`/guest/register/${eventId}`)
      }
    } catch (error) {
      console.error('❌ Fetch error:', error)
      alert('Failed to load gallery')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('guestSession')
      navigate(`/guest/register/${eventId}`)
    }
  }

  const togglePhotoSelection = (photoId) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const selectAllPhotos = () => {
    const displayed = getDisplayedPhotos()
    setSelectedPhotos(displayed.map(p => p.id))
  }

  const deselectAllPhotos = () => {
    setSelectedPhotos([])
  }

  const downloadSelectedPhotos = () => {
    if (selectedPhotos.length === 0) {
      alert('Please select photos')
      return
    }

    selectedPhotos.forEach((photoId, index) => {
      const photo = photos.find(p => p.id === photoId)
      if (photo) {
        setTimeout(() => {
          window.open(getImageUrl(photo, 'full'), '_blank')
        }, index * 500)
      }
    })

    alert(`Downloading ${selectedPhotos.length} photos...`)
  }

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

  // ✅ NEW: Smooth photo change with transition
  const changePhoto = (newIndex) => {
    setImageTransitioning(true)
    setTimeout(() => {
      setCurrentImageIndex(newIndex)
      const displayedPhotos = getDisplayedPhotos()
      setSelectedPhoto(displayedPhotos[newIndex])
      setImageTransitioning(false)
    }, 150)
  }

  const nextPhoto = () => {
    const displayedPhotos = getDisplayedPhotos()
    const nextIndex = (currentImageIndex + 1) % displayedPhotos.length
    changePhoto(nextIndex)
  }

  const prevPhoto = () => {
    const displayedPhotos = getDisplayedPhotos()
    const prevIndex = (currentImageIndex - 1 + displayedPhotos.length) % displayedPhotos.length
    changePhoto(prevIndex)
  }

  const openLightbox = (photo, e) => {
    if (e) e.stopPropagation()
    const displayedPhotos = getDisplayedPhotos()
    const index = displayedPhotos.findIndex(p => p.id === photo.id)
    setCurrentImageIndex(index)
    setSelectedPhoto(photo)
  }

  const toggleSlideshow = () => {
    setIsSlideshow(prev => !prev)
  }

  const stopSlideshow = () => {
    setIsSlideshow(false)
    if (slideshowInterval.current) {
      clearInterval(slideshowInterval.current)
    }
    if (audioRef.current && isMusicPlaying) {
      audioRef.current.pause()
      setIsMusicPlaying(false)
    }
  }

  const startSlideshow = () => {
    const displayedPhotos = getDisplayedPhotos()
    if (!selectedPhoto && displayedPhotos.length > 0) {
      setCurrentImageIndex(0)
      setSelectedPhoto(displayedPhotos[0])
    }
    setIsSlideshow(true)
  }

  const toggleMusic = () => {
    if (!audioRef.current) return
    
    if (isMusicPlaying) {
      audioRef.current.pause()
      setIsMusicPlaying(false)
    } else {
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(err => console.log('Audio play failed:', err))
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setMusicVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // ✅ Get masonry pattern (like ClientGallery)
  const getMasonryClass = (index) => {
    const patterns = [
      'row-span-2', 
      'col-span-2', 
      'row-span-2 col-span-2', 
      '', 
      '', 
      'row-span-2', 
      '', 
      'col-span-2'
    ]
    return patterns[index % patterns.length]
  }

  const displayedPhotos = getDisplayedPhotos()

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-8 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <FaImages className="absolute inset-0 m-auto text-4xl text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            📸 Loading your gallery...
          </h2>
          <p className="text-white/60 text-lg">
            ✨ Powered by AI Face Recognition
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* HEADER */}
      <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaUser className="text-purple-400" />
                Welcome, {guestData?.name}! 👋
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {photos.length} photos total
                {aiMatchedPhotos.length > 0 && (
                  <span className="text-green-400 ml-2">
                    • {aiMatchedPhotos.length} matched for you ✨
                  </span>
                )}
              </p>
            </div>

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

            {aiMatchedPhotos.length > 0 && (
              <button
                onClick={() => setShowAiOnly(!showAiOnly)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  showAiOnly
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-white/10 text-white border border-white/20'
                }`}
              >
                <FaRobot />
                {showAiOnly ? `My Photos (${aiMatchedPhotos.length})` : 'Show All'}
              </button>
            )}

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

            <button
              onClick={selectedPhotos.length === displayedPhotos.length ? deselectAllPhotos : selectAllPhotos}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all"
            >
              <FaCheckCircle className="inline mr-2" />
              {selectedPhotos.length === displayedPhotos.length ? 'Deselect All' : 'Select All'}
            </button>

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
            <p className="text-white/60 text-xl mb-4">
              {showAiOnly
                ? 'No photos matched your face'
                : searchQuery
                ? 'No photos found'
                : 'No photos available'}
            </p>
            {showAiOnly && (
              <button
                onClick={() => setShowAiOnly(false)}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold"
              >
                View All Photos
              </button>
            )}
          </div>
        ) : (
          <div className={
            viewMode === 'masonry' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]'
              : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
          }>
            {displayedPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`relative group cursor-pointer overflow-hidden rounded-lg ${
                  viewMode === 'masonry' ? getMasonryClass(index) : ''
                }`}
                onClick={(e) => openLightbox(photo, e)}
              >
                {photo.isMatched && (
                  <div className="absolute top-2 left-2 z-10 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                    <FaCheckCircle />
                    You!
                  </div>
                )}

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

                {/* ✅ FIXED: Use getImageUrl for thumbnails */}
                <img
                    src={getImageUrl(photo, 'thumb')}
                    alt={photo.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    onLoad={() => setImageLoaded(prev => ({ ...prev, [photo.id]: true }))}
                    onError={(e) => handleImageError(e, photo)}
                  />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-semibold truncate">{photo.name}</p>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <FaExpand className="text-white text-3xl" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && !isSlideshow && (
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

            <button
              onClick={(e) => {
                e.stopPropagation()
                prevPhoto()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <FaChevronLeft className="text-2xl" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                nextPhoto()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <FaChevronRight className="text-2xl" />
            </button>

            <div
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedPhoto.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: imageTransitioning ? 0 : 1, scale: imageTransitioning ? 0.9 : 1 }}
                transition={{ duration: 0.2 }}
                src={getImageUrl(selectedPhoto, 'hd')}
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
                  onClick={() => window.open(getImageUrl(selectedPhoto, 'full'), '_blank')}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold flex items-center gap-2"
                >
                  <FaDownload />
                  Download
                </button>

                <button
                  onClick={() => togglePhotoSelection(selectedPhoto.id)}
                  className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                    selectedPhotos.includes(selectedPhoto.id)
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white'
                  }`}
                >
                  <FaHeart />
                  {selectedPhotos.includes(selectedPhoto.id) ? 'Selected' : 'Select'}
                </button>

                <button
                  onClick={startSlideshow}
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold flex items-center gap-2"
                >
                  <FaPlay />
                  Slideshow
                </button>
              </div>

              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm backdrop-blur-sm">
                {currentImageIndex + 1} / {displayedPhotos.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLIDESHOW MODAL */}
      <AnimatePresence>
        {isSlideshow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          >
            <button
              onClick={stopSlideshow}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
            >
              <FaTimes className="text-2xl" />
            </button>

            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <button
                onClick={() => setIsSlideshow(!isSlideshow)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              >
                {slideshowInterval.current ? <FaPause /> : <FaPlay />}
              </button>

              <button
                onClick={toggleMusic}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
              >
                {isMusicPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>

              <select
                value={slideshowSpeed}
                onChange={(e) => setSlideshowSpeed(Number(e.target.value))}
                className="px-4 py-2 bg-white/10 text-white rounded-lg border-none outline-none"
              >
                <option value="2000" className="bg-gray-900">Fast (2s)</option>
                <option value="3000" className="bg-gray-900">Normal (3s)</option>
                <option value="5000" className="bg-gray-900">Slow (5s)</option>
              </select>
            </div>

            <button
              onClick={prevPhoto}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <FaChevronLeft className="text-2xl" />
            </button>

            <button
              onClick={nextPhoto}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
              <FaChevronRight className="text-2xl" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
                className="relative max-w-6xl w-full px-20"
              >
                <img
                  src={getImageUrl(displayedPhotos[currentImageIndex], 'hd')}
                  alt={displayedPhotos[currentImageIndex]?.name}
                  className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
                />

                {displayedPhotos[currentImageIndex]?.isMatched && (
                  <div className="absolute top-4 left-4 px-4 py-2 bg-green-500 text-white font-bold rounded-full flex items-center gap-2 shadow-lg">
                    <FaCheckCircle />
                    You're Here!
                  </div>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/50 text-white rounded-full backdrop-blur-sm">
                  {currentImageIndex + 1} / {displayedPhotos.length}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-4 left-4 text-white/60 text-sm">
              ← → Navigate • SPACE Play/Pause • M Music • ESC Close
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING STATS */}
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

      {/* FLOATING DOWNLOAD BUTTON */}
      {selectedPhotos.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={downloadSelectedPhotos}
          className="fixed bottom-8 right-8 p-4 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl transition-all z-30 relative"
        >
          <FaCloudDownloadAlt className="text-2xl" />
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
            {selectedPhotos.length}
          </span>
        </motion.button>
      )}
    </div>
  )
}

export default GuestGallery
