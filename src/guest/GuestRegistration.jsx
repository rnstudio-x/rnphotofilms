import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCamera, FaUserPlus, FaCheckCircle, FaSpinner,
  FaRedo, FaArrowRight, FaMobile, FaEnvelope, FaUser
} from 'react-icons/fa'
import Webcam from 'react-webcam'

const GuestRegistration = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const webcamRef = useRef(null)
  
  const [step, setStep] = useState(1) // 1: Info, 2: Selfie, 3: Success
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [selfieData, setSelfieData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [eventData, setEventData] = useState(null)
  const [showCamera, setShowCamera] = useState(false)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzgXRokuDgbWtBd9KCznfxcNYHgx2nQCOkIbe-CloIA2hexG9GuWqtaxSqvnMZM0yBavw/exec'

  useEffect(() => {
    fetchEventDetails()
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

  const captureSelfie = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    setSelfieData(imageSrc)
    setShowCamera(false)
  }

  const retakeSelfie = () => {
    setSelfieData(null)
    setShowCamera(true)
  }

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

      setLoading(true)

      try {
        // Upload selfie and register guest
        const response = await fetch(GAS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'registerGuest',
            eventId: eventId,
            name: name,
            phone: phone,
            email: email,
            selfie: selfieData // Base64 image
          })
        })

        const result = await response.json()

        if (result.success) {
          setStep(3)
          
          // Store guest token for later access
          localStorage.setItem('guestToken', result.token)
          localStorage.setItem('guestData', JSON.stringify({
            id: result.guestId,
            name: name,
            eventId: eventId
          }))

          // Redirect to guest gallery after 3 seconds
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

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-purple-50 via-white to-pink-50 overflow-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Event Info Banner */}
          {eventData && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-6 mb-6 text-white text-center"
            >
              <h1 className="text-2xl font-bold mb-2">{eventData.eventType}</h1>
              <p className="text-sm opacity-90">{eventData.clientName}'s Event</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <FaCamera className="text-xl" />
                <p className="text-sm">Find Your Photos!</p>
              </div>
            </motion.div>
          )}

          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <div className={`h-2 rounded-full transition-all ${
                  step >= 1 ? 'bg-purple-600' : 'bg-gray-200'
                }`}></div>
                <p className="text-xs text-center mt-2 font-semibold text-gray-600">Info</p>
              </div>
              <div className="w-8"></div>
              <div className="flex-1">
                <div className={`h-2 rounded-full transition-all ${
                  step >= 2 ? 'bg-purple-600' : 'bg-gray-200'
                }`}></div>
                <p className="text-xs text-center mt-2 font-semibold text-gray-600">Selfie</p>
              </div>
              <div className="w-8"></div>
              <div className="flex-1">
                <div className={`h-2 rounded-full transition-all ${
                  step >= 3 ? 'bg-green-600' : 'bg-gray-200'
                }`}></div>
                <p className="text-xs text-center mt-2 font-semibold text-gray-600">Done</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaUserPlus className="text-3xl text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Welcome Guest!
                    </h2>
                    <p className="text-gray-600">
                      Register to find and download your photos
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <FaMobile className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email (Optional)
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold flex items-center justify-center gap-2"
                  >
                    Next: Take Selfie
                    <FaArrowRight />
                  </button>
                </motion.div>
              )}

              {/* Step 2: Selfie Capture */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCamera className="text-3xl text-purple-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      Capture Your Selfie
                    </h2>
                    <p className="text-gray-600">
                      We'll use this to find your photos automatically
                    </p>
                  </div>

                  <div className="bg-gray-100 rounded-xl overflow-hidden mb-6 aspect-[3/4] max-h-96">
                    {showCamera && !selfieData ? (
                      <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                          facingMode: 'user',
                          width: 480,
                          height: 640
                        }}
                        className="w-full h-full object-cover"
                      />
                    ) : selfieData ? (
                      <img
                        src={selfieData}
                        alt="Your selfie"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center">
                          <FaCamera className="text-6xl text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">Camera will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {selfieData ? (
                      <>
                        <button
                          onClick={retakeSelfie}
                          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
                        >
                          <FaRedo />
                          Retake
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {loading ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaCheckCircle />
                              Complete Registration
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={captureSelfie}
                        disabled={!showCamera}
                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <FaCamera />
                        Capture Selfie
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full mt-4 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors font-semibold"
                  >
                    ← Back
                  </button>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <FaCheckCircle className="text-5xl text-green-600" />
                  </motion.div>

                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Registration Complete! 🎉
                  </h2>
                  
                  <p className="text-gray-600 mb-6">
                    Welcome, <span className="font-semibold text-purple-600">{name}</span>!
                  </p>

                  <div className="bg-purple-50 rounded-xl p-6 mb-6">
                    <p className="text-gray-700 mb-2">
                      We're finding your photos using AI...
                    </p>
                    <div className="flex items-center justify-center gap-2 text-purple-600">
                      <FaSpinner className="animate-spin" />
                      <span className="font-semibold">Processing</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    Redirecting to your photo gallery...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Powered by RN PhotoFilms</p>
            <p className="mt-2">Your photos are private and secure 🔒</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default GuestRegistration
