import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCamera, FaUserPlus, FaCheckCircle, FaSpinner, FaRedo, FaArrowRight, FaMobile, FaEnvelope, FaUser, FaIdCard, FaImages, FaStar, FaHeart } from 'react-icons/fa'
import Webcam from 'react-webcam'
import { loadFaceApiModels, extractFaceDescriptor } from '../utils/faceApiLoader' // ✅ ADDED

const GuestRegistration = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const webcamRef = useRef(null)
  
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [selfieData, setSelfieData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [eventData, setEventData] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  
  // ✅ ADDED: Face detection states
  const [modelsLoading, setModelsLoading] = useState(true)
  const [modelsLoaded, setModelsLoaded] = useState(false)
  const [faceDescriptor, setFaceDescriptor] = useState(null)
  const [processingFace, setProcessingFace] = useState(false)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbyy0mtYZpuBCcxxx_VVwJ5famgpJPula1ljY82ubZz_ujIkk4XjwXVAf14upVr2hvZxFQ/exec'

  // ✅ ADDED: Load face-api models on mount
  useEffect(() => {
    initializeFaceApi()
  }, [])

  const initializeFaceApi = async () => {
    setModelsLoading(true)
    const loaded = await loadFaceApiModels()
    setModelsLoaded(loaded)
    setModelsLoading(false)
    
    if (!loaded) {
      alert('⚠️ Face recognition models failed to load. You can still register but AI matching may not work.')
    }
  }

  useEffect(() => {
    fetchEventDetails()
    
    // Hide navbar
    const navbar = document.querySelector('nav')
    if (navbar) navbar.style.display = 'none'
    
    return () => {
      if (navbar) navbar.style.display = ''
    }
  }, [])

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ 
          action: 'getEventDetails', 
          eventId: eventId 
        })
      })
      
      const result = await response.json()
      if (result.success) {
        setEventData(result.event)
      }
    } catch (error) {
      console.error('Error fetching event:', error)
    }
  }

  // ✅ UPDATED: Capture selfie and extract face descriptor
  const captureSelfie = async () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setSelfieData(imageSrc)
    setShowCamera(false)

    // Extract face descriptor
    if (modelsLoaded) {
      setProcessingFace(true)
      const descriptor = await extractFaceDescriptor(imageSrc)
      
      if (!descriptor) {
        alert('⚠️ No face detected! Please retake your selfie with your face clearly visible.')
        setSelfieData(null)
        setShowCamera(true)
        setProcessingFace(false)
        return
      }

      setFaceDescriptor(descriptor)
      setProcessingFace(false)
      console.log('✅ Face descriptor extracted successfully!')
    }
  }

  const retakeSelfie = () => {
    setSelfieData(null)
    setFaceDescriptor(null)
    setShowCamera(true)
  }

  // ✅ UPDATED: Submit registration with face descriptor
  const handleSubmit = async () => {
    if (step === 1) {
      if (!name || !phone) {
        alert('Please enter your name and phone number')
        return
      }
      setStep(2)
      setShowCamera(true)
      return
    }

    if (step === 2) {
      if (!selfieData) {
        alert('Please capture your selfie')
        return
      }

      if (processingFace) {
        alert('Please wait, processing your face...')
        return
      }

      setLoading(true)

      try {
        const response = await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'registerGuest',
            eventId: eventId,
            name: name,
            phone: phone,
            email: email,
            selfie: selfieData, // Still send base64 for storage
            faceDescriptor: faceDescriptor // ✅ ADDED: Send face descriptor
          })
        })

        const result = await response.json()

        if (result.success) {
          setStep(3)
          
          // Store guest data
          localStorage.setItem('guestToken', result.token)
          localStorage.setItem('guestData', JSON.stringify({
            id: result.guestId,
            name: name,
            eventId: eventId
          }))

          // Redirect after 3 seconds
          setTimeout(() => {
            navigate(`/guest/gallery/${eventId}`)
          }, 3000)
        } else {
          alert(result.message || 'Registration failed')
        }
      } catch (error) {
        console.error('Registration error:', error)
        alert('Failed to register. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  // Loading state while models load
  if (modelsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div 
          className="text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FaSpinner className="animate-spin text-6xl mx-auto mb-4" />
          <p className="text-xl">Loading AI face recognition...</p>
        </motion.div>
      </div>
    )
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <FaSpinner className="animate-spin text-white text-4xl" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <FaCamera className="text-white text-3xl" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">Find Your Photos! 📸</h1>
          <p className="text-white/80">
            {eventData?.eventDate ? new Date(eventData.eventDate).toLocaleDateString() : ''} • {eventData?.eventType}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          {[
            { step: 1, icon: FaUser, label: 'Details' },
            { step: 2, icon: FaCamera, label: 'Selfie' },
            { step: 3, icon: FaCheckCircle, label: 'Done' }
          ].map((item, index) => (
            <div key={item.step} className="flex items-center">
              <motion.div
                animate={{
                  scale: step === item.step ? 1.2 : 1,
                  backgroundColor: step >= item.step ? '#10b981' : '#374151'
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center"
              >
                <item.icon className="text-white text-xl" />
              </motion.div>
              {index < 2 && (
                <div className={`w-12 h-1 mx-2 ${step > item.step ? 'bg-green-500' : 'bg-gray-600'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Details */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-white mb-2 font-medium">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white mb-2 font-medium">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <span>Next: Take Selfie</span>
                <FaArrowRight />
              </button>

              <p className="text-white/60 text-sm text-center">
                ℹ️ We'll use facial recognition to find photos with you
              </p>
            </motion.div>
          )}

          {/* Step 2: Selfie Capture */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <div className="text-center text-white mb-4">
                <h3 className="text-2xl font-bold mb-2">Take Your Selfie 🤳</h3>
                <p className="text-white/80">
                  {modelsLoaded 
                    ? "We'll use this to find your photos automatically" 
                    : "⚠️ AI matching may not work, but you can still browse photos"}
                </p>
              </div>

              <div className="relative">
                {showCamera && !selfieData && (
                  <div className="rounded-2xl overflow-hidden">
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="w-full rounded-2xl"
                      videoConstraints={{
                        facingMode: 'user',
                        width: 1280,
                        height: 720
                      }}
                    />
                  </div>
                )}

                {selfieData && (
                  <div className="relative">
                    <img
                      src={selfieData}
                      alt="Your selfie"
                      className="w-full rounded-2xl"
                    />
                    {processingFace && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                        <div className="text-center text-white">
                          <FaSpinner className="animate-spin text-4xl mx-auto mb-2" />
                          <p>Detecting face...</p>
                        </div>
                      </div>
                    )}
                    {faceDescriptor && !processingFace && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                        <FaCheckCircle />
                        <span>Face detected!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-4">
                {!selfieData && showCamera && (
                  <button
                    onClick={captureSelfie}
                    disabled={processingFace}
                    className="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
                  >
                    <FaCamera />
                    <span>Capture</span>
                  </button>
                )}

                {selfieData && !processingFace && (
                  <>
                    <button
                      onClick={retakeSelfie}
                      className="flex-1 py-4 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all flex items-center justify-center space-x-2"
                    >
                      <FaRedo />
                      <span>Retake</span>
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          <span>Complete</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>

              {!showCamera && !selfieData && (
                <button
                  onClick={() => setShowCamera(true)}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <FaCamera />
                  <span>Open Camera</span>
                </button>
              )}
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center text-white space-y-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center"
              >
                <FaCheckCircle className="text-white text-5xl" />
              </motion.div>

              <div>
                <h3 className="text-3xl font-bold mb-2">🎉 Registration Complete!</h3>
                <p className="text-white/80 mb-4">
                  {modelsLoaded 
                    ? "We're finding your photos using AI..." 
                    : "Browse all event photos..."}
                </p>
                <p className="text-white/60 text-sm">Redirecting to your photo gallery...</p>
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                {[
                  { icon: FaImages, label: 'AI Matching', color: 'from-purple-500 to-pink-500' },
                  { icon: FaHeart, label: 'Your Moments', color: 'from-pink-500 to-red-500' },
                  { icon: FaStar, label: 'HD Quality', color: 'from-yellow-500 to-orange-500' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className={`p-4 bg-gradient-to-br ${item.color} rounded-xl`}
                  >
                    <item.icon className="text-white text-2xl mx-auto mb-2" />
                    <p className="text-white text-xs font-medium">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm">RN PhotoFilms</p>
          <p className="text-white/40 text-xs mt-1">Your photos are private and secure 🔒</p>
        </div>
      </motion.div>
    </div>
  )
}

export default GuestRegistration
