import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCamera, FaUserPlus, FaCheckCircle, FaSpinner, FaRedo, FaArrowRight, FaMobile, FaEnvelope, FaUser, FaIdCard, FaImages, FaStar, FaHeart, FaCalendar, FaMapMarkerAlt, FaSignOutAlt } from 'react-icons/fa'
import Webcam from 'react-webcam'

const GuestRegistration = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const webcamRef = useRef(null)

  // ✅ NEW: Loading & Session States
  const [initialLoading, setInitialLoading] = useState(true)
  const [existingSession, setExistingSession] = useState(null)

  // Step management: 0 = event selection, 1 = registration form, 2 = selfie capture, 3 = success
  const [step, setStep] = useState(eventId ? 1 : 0)
  
  // Event related states
  const [events, setEvents] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(eventId || '')
  const [eventData, setEventData] = useState(null)
  const [loadingEvents, setLoadingEvents] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  })
  
  // Selfie states
  const [selfieData, setSelfieData] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  
  // Processing states
  const [loading, setLoading] = useState(false)
  const [matchedPhotos, setMatchedPhotos] = useState([])

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbx2hS9aqJ9Mp9RIF52Yw2g7SeAv2nisSYRMXpvu9RFf3QXquD-8QgRVtLOj-vvK9Ibzzg/exec'

  // ✅ CHECK EXISTING SESSION ON MOUNT
  useEffect(() => {
    checkExistingSession()
    
    // Hide navbar on this page
    const navbar = document.querySelector('nav')
    if (navbar) navbar.style.display = 'none'

    return () => {
      if (navbar) navbar.style.display = ''
    }
  }, [])

  // ✅ NEW: Check for existing valid session
  const checkExistingSession = () => {
    console.log('🔍 Checking for existing session...')
    
    const sessionData = localStorage.getItem('guestSession')
    
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData)
        console.log('✅ Found existing session:', session)
        
        // Check if session is still valid (24 hours)
        const sessionTime = new Date(session.timestamp).getTime()
        const now = new Date().getTime()
        const hoursSinceRegistration = (now - sessionTime) / (1000 * 60 * 60)
        
        if (hoursSinceRegistration < 24) {
          console.log('✅ Session is valid!')
          
          // If URL has eventId, check if matches
          if (eventId && eventId !== session.eventId) {
            console.log('⚠️ Different event - showing session banner')
            setExistingSession(session)
            
            // Load this event's data
            if (!eventId) {
              fetchPublicEvents()
            } else {
              fetchEventDetails(eventId)
            }
            
            setInitialLoading(false)
            return
          }
          
          // Same event or no event specified - redirect to gallery
          console.log('🔄 Redirecting to existing session gallery...')
          navigate(`/guest/gallery/${session.eventId}`)
          return
        } else {
          console.log('⚠️ Session expired (>24 hours)')
          localStorage.removeItem('guestSession')
        }
      } catch (error) {
        console.error('❌ Error parsing session:', error)
        localStorage.removeItem('guestSession')
      }
    }
    
    console.log('ℹ️ No valid session found - show registration')
    
    // Load events/event data
    if (!eventId) {
      fetchPublicEvents()
    } else {
      fetchEventDetails(eventId)
    }
    
    setInitialLoading(false)
  }

  // ✅ Fetch all public events with gallery
  const fetchPublicEvents = async () => {
    setLoadingEvents(true)
    try {
      console.log('🔍 Fetching public events...')
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getPublicEvents' })
      })

      const result = await response.json()
      console.log('📥 Backend response:', result)

      if (result.success) {
        console.log('✅ Events found:', result.count)
        setEvents(result.events || [])
      } else {
        console.error('❌ Failed:', result.message)
        alert('Failed to load events: ' + result.message)
      }
    } catch (error) {
      console.error('❌ Error:', error)
      alert('Failed to load events. Check console.')
    } finally {
      setLoadingEvents(false)
    }
  }

  // Fetch event details
  const fetchEventDetails = async (eId) => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'getEventDetails',
          eventId: eId
        })
      })

      const result = await response.json()
      if (result.success && result.event) {
        setEventData(result.event)
      }
    } catch (error) {
      console.error('Error fetching event details:', error)
    }
  }

  // Handle event selection
  const handleEventSelect = (eId) => {
    setSelectedEventId(eId)
    fetchEventDetails(eId)
    setStep(1)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Capture selfie from webcam
  const captureSelfie = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setSelfieData(imageSrc)
    setShowCamera(false)
  }

  // Retake selfie
  const retakeSelfie = () => {
    setSelfieData(null)
    setShowCamera(true)
  }

  // ✅ NEW: Clear session and start new registration
  const handleNewRegistration = () => {
    if (confirm('Start new registration? This will clear your current session.')) {
      localStorage.removeItem('guestSession')
      setExistingSession(null)
      setStep(eventId ? 1 : 0)
      setFormData({ name: '', phone: '', email: '' })
      setSelfieData(null)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (step === 0) {
      // Event selection
      if (!selectedEventId) {
        alert('Please select an event')
        return
      }

      fetchEventDetails(selectedEventId)
      setStep(1)
    } else if (step === 1) {
      // Form validation
      if (!formData.name.trim() || !formData.phone.trim()) {
        alert('Please fill in all required fields')
        return
      }

      setStep(2)
    } else if (step === 2) {
      // Selfie submission
      if (!selfieData) {
        alert('Please capture your selfie')
        return
      }

      setLoading(true)

      try {
        console.log('🚀 Submitting guest registration...')
        console.log('📝 Data:', {
          eventId: selectedEventId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email
        })

        const response = await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'matchGuestSelfieSimple',
            eventId: selectedEventId,
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            selfieData: selfieData
          })
        })

        const result = await response.json()
        console.log('✅ Backend response:', result)

        if (result.success) {
          console.log('✅ Registration successful!')
          console.log('📊 Matched photos:', result.totalMatches)
          console.log('🎫 Guest ID:', result.guestId)
          console.log('🔑 Token:', result.token)

          setMatchedPhotos(result.matchedPhotos || [])
          setStep(3)

          // ✅ Extract matched photo IDs
          const matchedPhotoIds = (result.matchedPhotos || []).map(p => p.id)

          // ✅ Store guest session for gallery access
          const guestSession = {
            eventId: selectedEventId,
            guestName: formData.name,
            guestId: result.guestId,
            token: result.token,
            matchedCount: matchedPhotoIds.length,
            matchedPhotoIds: matchedPhotoIds, // ✅ NEW: Store matched IDs
            timestamp: new Date().toISOString()
          }

          localStorage.setItem('guestSession', JSON.stringify(guestSession))
          console.log('💾 Session saved:', guestSession)

          // ✅ Redirect after 3 seconds
          console.log('⏳ Redirecting in 3 seconds...')
          setTimeout(() => {
            console.log('🔄 Redirecting to gallery...')
            navigate(`/guest/gallery/${selectedEventId}`)
          }, 3000)
        } else {
          console.error('❌ Registration failed:', result.message)
          alert(`❌ Registration failed!\n\n${result.message || 'Please try again'}`)
          setLoading(false)
        }
      } catch (error) {
        console.error('❌ Registration error:', error)
        alert('❌ Failed to register!\n\nPlease check your internet connection and try again.')
        setLoading(false)
      }
    }
  }

  // ✅ LOADING STATE
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">Checking your session...</p>
        </div>
      </div>
    )
  }

  // ✅ EXISTING SESSION BANNER
  const SessionBanner = () => existingSession && (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 bg-green-500/20 border-2 border-green-500 rounded-xl backdrop-blur-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-white font-bold text-lg flex items-center gap-2">
            <FaCheckCircle className="text-green-400" />
            Welcome back, {existingSession.guestName}! 👋
          </p>
          <p className="text-white/70 text-sm mt-1">
            You have an active session for <span className="text-green-300 font-semibold">{existingSession.eventId}</span>
          </p>
        </div>
      </div>
      
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => navigate(`/guest/gallery/${existingSession.eventId}`)}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-all shadow-lg flex items-center gap-2"
        >
          <FaImages />
          Continue to Gallery →
        </button>
        
        <button
          onClick={handleNewRegistration}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <FaUserPlus />
          Register for New Event
        </button>
      </div>
    </motion.div>
  )

  // ==================== REST OF YOUR COMPONENT (STEPS 0, 1, 2, 3) ====================
  // Keep all your existing step rendering logic below...

  // STEP 0: EVENT SELECTION
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-6xl mx-auto py-12">
          {/* ✅ Session Banner */}
          <SessionBanner />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500 rounded-full mb-6">
              <FaImages className="text-4xl text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Guest Registration
            </h1>
            <p className="text-xl text-white/80">
              Select your event to view and download your photos
            </p>
          </motion.div>

          {loadingEvents ? (
            <div className="text-center py-12">
              <FaSpinner className="animate-spin text-6xl text-white mx-auto mb-4" />
              <p className="text-white text-xl">Loading available events...</p>
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto text-center py-12"
            >
              <FaImages className="text-6xl text-white/40 mx-auto mb-6" />
              <p className="text-white/60 text-xl mb-4">
                There are no photo galleries available at the moment
              </p>
              <p className="text-white/40">
                Please check back later or contact the photographer
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleEventSelect(event.id)}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 cursor-pointer border-2 border-white/20 hover:border-purple-400 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <FaCamera className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {event.eventType}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {event.clientName}
                      </p>
                    </div>
                  </div>

                  {event.eventDate && (
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                      <FaCalendar />
                      <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {event.venue && (
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <FaMapMarkerAlt />
                      <span>{event.venue}</span>
                    </div>
                  )}

                  <button className="w-full mt-4 px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                    View Gallery <FaArrowRight />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }


  // ==================== STEP 0: EVENT SELECTION ====================
  
  if (step === 0) {
    return (
         <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto py-12">
        {/* ✅ Session Banner */}
        <SessionBanner />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <FaImages className="text-6xl text-purple-600 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              📸 Find Your Photos
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Select your event to view and download your photos
            </p>
          </motion.div>

          {/* Events List */}
          {loadingEvents ? (
            <div className="text-center py-20">
              <FaSpinner className="animate-spin text-6xl text-purple-600 mx-auto mb-6" />
              <p className="text-xl text-gray-600">Loading available events...</p>
            </div>
          ) : events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl p-12 text-center"
            >
              <FaImages className="text-8xl text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-4">
                No Events Available
              </h3>
              <p className="text-lg text-gray-500 mb-6">
                There are no photo galleries available at the moment
              </p>
              <p className="text-gray-400">
                Please check back later or contact the photographer
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEventSelect(event.id)}
                  className="bg-white rounded-2xl shadow-xl p-6 cursor-pointer hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500"
                >
                  <div className="mb-4">
                    <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      {event.eventType || 'Event'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {event.clientName}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center">
                      <FaCalendar className="mr-2 text-purple-500" />
                      {new Date(event.eventDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    {event.venue && (
                      <p className="text-gray-600 flex items-center text-sm">
                        <FaMapMarkerAlt className="mr-2 text-purple-500" />
                        {event.venue}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-purple-700 font-bold">View Photos</span>
                    <FaArrowRight className="text-2xl text-purple-600" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==================== STEP 1: REGISTRATION FORM ====================
  if (step === 1) {
    return (
         <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto py-12">
        {/* ✅ Session Banner */}
        <SessionBanner />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <FaUserPlus className="text-6xl text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Guest Registration
              </h2>
              {eventData && (
                <p className="text-lg text-gray-600">
                  {eventData.eventType} - {eventData.clientName}
                </p>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div className="w-16 h-1 bg-gray-300 mx-2"></div>
                <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">
                  2
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <FaMobile className="inline mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none text-lg"
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
              <p className="text-sm text-purple-800">
                <FaIdCard className="inline mr-2" />
                In the next step, you'll take a selfie to find your photos automatically using AI
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Continue to Selfie</span>
                  <FaArrowRight />
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ==================== STEP 2: SELFIE CAPTURE ====================
  if (step === 2) {
    return (
         <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-2xl mx-auto py-12">
        {/* ✅ Session Banner */}
        <SessionBanner />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <FaCamera className="text-6xl text-purple-600 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Capture Your Selfie
              </h2>
              <p className="text-lg text-gray-600">
                AI will match your face with event photos
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                  ✓
                </div>
                <div className="w-16 h-1 bg-purple-600 mx-2"></div>
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
              </div>
            </div>

            {/* Camera/Selfie Display */}
            <div className="mb-8">
              {!selfieData ? (
                showCamera ? (
                  <div className="relative">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-2xl shadow-xl"
                      videoConstraints={{
                        facingMode: 'user'
                      }}
                    />
                    <button
                      onClick={captureSelfie}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all"
                    >
                      <div className="w-12 h-12 bg-purple-600 rounded-full"></div>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                    <FaCamera className="text-6xl text-gray-300 mx-auto mb-4" />
                    <button
                      onClick={() => setShowCamera(true)}
                      className="px-8 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all"
                    >
                      Open Camera
                    </button>
                  </div>
                )
              ) : (
                <div className="relative">
                  <img
                    src={selfieData}
                    alt="Selfie"
                    className="w-full rounded-2xl shadow-xl"
                  />
                  <button
                    onClick={retakeSelfie}
                    className="absolute top-4 right-4 px-4 py-2 bg-white rounded-xl shadow-xl flex items-center space-x-2 hover:bg-gray-100"
                  >
                    <FaRedo />
                    <span>Retake</span>
                  </button>
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 font-bold mb-2">📸 Tips for best results:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Face the camera directly</li>
                <li>• Ensure good lighting</li>
                <li>• Remove sunglasses or masks</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selfieData || loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-2xl" />
                  <span>Matching your photos...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle />
                  <span>Find My Photos</span>
                </>
              )}
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  // ==================== STEP 3: SUCCESS ====================
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl text-center"
        >
          <FaCheckCircle className="text-8xl text-green-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Registration Successful! 🎉
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Welcome, <span className="font-bold text-purple-600">{formData.name}</span>!
          </p>
          
          <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-6 mb-8">
            <p className="text-2xl font-bold text-purple-600 mb-2">
              {matchedPhotos.length}
            </p>
            <p className="text-gray-700">
              {matchedPhotos.length === 0 ? 'No photos found' : 
               matchedPhotos.length === 1 ? 'Photo found matching your face' : 
               'Photos found matching your face'}
            </p>
          </div>

          <p className="text-gray-600 mb-6">
            Redirecting to your gallery...
          </p>
          
          <FaSpinner className="animate-spin text-4xl text-purple-600 mx-auto" />
        </motion.div>
      </div>
    )
  }

  return null
}

export default GuestRegistration
