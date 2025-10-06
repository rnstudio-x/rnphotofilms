import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaExclamationTriangle, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaCamera, FaPaperPlane, FaMapMarkerAlt, FaRupeeSign, FaClock, FaStar, FaHeart } from 'react-icons/fa'

const BookingForm = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    shootType: '',
    location: '',
    budget: '',
    guestCount: '',
    message: ''
  })

  // UI states
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [selectedPackage, setSelectedPackage] = useState(null)

  // Packages data
  const packages = [
    {
      id: 1,
      name: 'Essential',
      icon: '📸',
      price: '₹25,000',
      duration: '4 Hours',
      features: ['150+ Photos', 'Basic Editing', 'Online Gallery'],
      color: 'from-blue-500 to-purple-500'
    },
    {
      id: 2,
      name: 'Premium',
      icon: '🎬',
      price: '₹50,000',
      duration: '8 Hours',
      features: ['300+ Photos', 'Cinematic Video', 'Premium Album', 'Same Day Edit'],
      color: 'from-gold to-amber-600',
      popular: true
    },
    {
      id: 3,
      name: 'Luxury',
      icon: '⭐',
      price: '₹1,00,000',
      duration: 'Full Day',
      features: ['Unlimited Photos', '4K Video', 'Luxury Album', 'Drone Shots', 'Pre-Wedding'],
      color: 'from-purple-600 to-pink-600'
    },
  ]

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  // Form validation
  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
      else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) newErrors.phone = 'Invalid phone number'
    }

    if (step === 2) {
      if (!formData.shootType) newErrors.shootType = 'Please select shoot type'
      if (!formData.date) newErrors.date = 'Please select date'
      else {
        const selectedDate = new Date(formData.date)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) newErrors.date = 'Date cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateStep(currentStep)) return

    setIsSubmitting(true)
    setSubmitError('')

    const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE'

    try {
      const response = await fetch(scriptURL, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          package: selectedPackage ? packages[selectedPackage - 1].name : 'Not selected',
          timestamp: new Date().toISOString(),
          source: 'RN PhotoFilms Website'
        }),
      })

      const result = await response.json()

      if (result.status === 'success') {
        setSubmitSuccess(true)
        setFormData({
          name: '', email: '', phone: '', date: '', shootType: '', 
          location: '', budget: '', guestCount: '', message: ''
        })
        setCurrentStep(1)
        setTimeout(() => setSubmitSuccess(false), 8000)
      } else {
        throw new Error(result.message || 'Submission failed')
      }
    } catch (error) {
      setSubmitError('Oops! Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSteps = 3

  return (
    <section id="booking" className="relative min-h-screen py-24 bg-gradient-to-br from-cream via-white to-blush overflow-hidden" ref={ref}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-teal/20 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-4 px-4 py-2 bg-gold/10 rounded-full"
          >
            ✨ Reserve Your Date
          </motion.span>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-charcoal mb-6">
            Book Your{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-gold to-amber-600 bg-clip-text text-transparent">
                Dream Session
              </span>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-2 left-0 h-3 bg-gold/20 -z-0"
              />
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Let's capture your precious moments together. Simple, quick, and secure booking process.
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              className="max-w-4xl mx-auto mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
                transition={{ duration: 0.6 }}
              >
                <FaCheckCircle className="text-4xl" />
              </motion.div>
              <div>
                <p className="font-bold text-xl mb-1">🎉 Booking Received!</p>
                <p className="text-white/90">We'll contact you within 24 hours. Get ready for an amazing experience!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Layout - Split Design */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            
            {/* LEFT SIDE - Package Cards */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.3 } }
              }}
              className="space-y-6 sticky top-24"
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                <h3 className="text-3xl font-playfair font-bold text-charcoal mb-6 flex items-center gap-3">
                  <FaStar className="text-gold" />
                  Choose Your Package
                </h3>
                
                <div className="space-y-4">
                  {packages.map((pkg, index) => (
                    <motion.div
                      key={pkg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 ${
                        selectedPackage === pkg.id
                          ? 'ring-4 ring-gold shadow-2xl'
                          : 'hover:shadow-xl'
                      }`}
                      style={{
                        background: selectedPackage === pkg.id
                          ? `linear-gradient(135deg, ${pkg.color.split(' ')[1]} 0%, ${pkg.color.split(' ')[3]} 100%)`
                          : '#f8f9fa'
                      }}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 -right-3 bg-gold text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ⭐ Popular
                        </div>
                      )}
                      
                      <div className={`flex items-center justify-between mb-4 ${selectedPackage === pkg.id ? 'text-white' : 'text-charcoal'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{pkg.icon}</span>
                          <div>
                            <h4 className="text-2xl font-bold">{pkg.name}</h4>
                            <p className="text-sm opacity-80 flex items-center gap-1">
                              <FaClock /> {pkg.duration}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">{pkg.price}</p>
                        </div>
                      </div>
                      
                      <ul className={`space-y-2 ${selectedPackage === pkg.id ? 'text-white' : 'text-gray-700'}`}>
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <FaCheckCircle className={selectedPackage === pkg.id ? 'text-white' : 'text-gold'} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>

                {/* Why Choose Us */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                    <FaHeart className="text-gold" />
                    Why Choose Us?
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">✓ 10+ Years Experience</li>
                    <li className="flex items-center gap-2">✓ Award-Winning Team</li>
                    <li className="flex items-center gap-2">✓ 500+ Happy Clients</li>
                    <li className="flex items-center gap-2">✓ Same-Day Highlights</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE - Multi-Step Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.5 } }
              }}
            >
              {/* Progress Bar */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="flex justify-between items-center mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <motion.div
                        animate={{
                          scale: currentStep === step ? 1.2 : 1,
                          backgroundColor: currentStep >= step ? '#D4A574' : '#e5e7eb'
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all ${
                          currentStep >= step ? 'shadow-lg' : ''
                        }`}
                      >
                        {currentStep > step ? '✓' : step}
                      </motion.div>
                      {step < totalSteps && (
                        <div className="flex-1 h-1 mx-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            animate={{ width: currentStep > step ? '100%' : '0%' }}
                            className="h-full bg-gold"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Error Message */}
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
                  >
                    <FaExclamationTriangle />
                    <span>{submitError}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Personal Info */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <h3 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                          👋 Let's Get to Know You
                        </h3>

                        {/* Name */}
                        <div>
                          <label className="block text-charcoal font-semibold mb-2 flex items-center gap-2">
                            <FaUser className="text-gold" />
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                              errors.name ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                            }`}
                            placeholder="Enter your full name"
                          />
                          {errors.name && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <FaExclamationTriangle className="text-xs" />
                              {errors.name}
                            </p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-charcoal font-semibold mb-2 flex items-center gap-2">
                            <FaEnvelope className="text-gold" />
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                              errors.email ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                            }`}
                            placeholder="your@email.com"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <FaExclamationTriangle className="text-xs" />
                              {errors.email}
                            </p>
                          )}
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="block text-charcoal font-semibold mb-2 flex items-center gap-2">
                            <FaPhone className="text-gold" />
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                              errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                            }`}
                            placeholder="+91 XXXXX XXXXX"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <FaExclamationTriangle className="text-xs" />
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Event Details */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <h3 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                          📅 Event Details
                        </h3>

                        {/* Shoot Type */}
                        <div>
                          <label className="block text-charcoal font-semibold mb-3 flex items-center gap-2">
                            <FaCamera className="text-gold" />
                            Type of Shoot *
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {['Wedding', 'Pre-Wedding', 'Event', 'Maternity', 'Corporate', 'Fashion'].map((type) => (
                              <motion.button
                                key={type}
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFormData(prev => ({ ...prev, shootType: type }))}
                                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                                  formData.shootType === type
                                    ? 'bg-gold text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {type}
                              </motion.button>
                            ))}
                          </div>
                          {errors.shootType && (
                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                              <FaExclamationTriangle className="text-xs" />
                              {errors.shootType}
                            </p>
                          )}
                        </div>

                        {/* Date */}
                        <div>
                          <label className="block text-charcoal font-semibold mb-2 flex items-center gap-2">
                            <FaCalendarAlt className="text-gold" />
                            Preferred Date *
                          </label>
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className={`w-full px-5 py-4 border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                              errors.date ? 'border-red-500' : 'border-gray-200 focus:border-gold'
                            }`}
                          />
                          {errors.date && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <FaExclamationTriangle className="text-xs" />
                              {errors.date}
                            </p>
                          )}
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-charcoal font-semibold mb-2 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-gold" />
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                            placeholder="City or venue name"
                          />
                        </div>

                        {/* Guest Count */}
                        <div>
                          <label className="block text-charcoal font-semibold mb-2">
                            Expected Guests (Optional)
                          </label>
                          <select
                            name="guestCount"
                            value={formData.guestCount}
                            onChange={handleChange}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                          >
                            <option value="">Select range</option>
                            <option value="under-50">Under 50</option>
                            <option value="50-100">50-100</option>
                            <option value="100-200">100-200</option>
                            <option value="200-500">200-500</option>
                            <option value="above-500">Above 500</option>
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Final Details */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <h3 className="text-2xl font-playfair font-bold text-charcoal mb-6">
                          ✨ Almost Done!
                        </h3>

                        {/* Budget */}
                        <div>
                          <label className="block text-charcoal font-semibold mb-2 flex items-center gap-2">
                            <FaRupeeSign className="text-gold" />
                            Budget Range
                          </label>
                          <select
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
                          >
                            <option value="">Select budget range</option>
                            <option value="under-25k">Under ₹25,000</option>
                            <option value="25k-50k">₹25,000 - ₹50,000</option>
                            <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                            <option value="1l-2l">₹1,00,000 - ₹2,00,000</option>
                            <option value="above-2l">Above ₹2,00,000</option>
                          </select>
                        </div>

                        {/* Message */}
                        <div>
                          <label className="block text-charcoal font-semibold mb-2">
                            Tell Us Your Story
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold resize-none transition-all"
                            placeholder="Share your vision, special requests, or any questions..."
                          ></textarea>
                        </div>

                        {/* Summary */}
                        <div className="bg-gradient-to-br from-gold/10 to-amber-100/50 rounded-xl p-6 border-2 border-gold/30">
                          <h4 className="font-bold text-charcoal mb-4 flex items-center gap-2">
                            📋 Booking Summary
                          </h4>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p><strong>Name:</strong> {formData.name}</p>
                            <p><strong>Email:</strong> {formData.email}</p>
                            <p><strong>Phone:</strong> {formData.phone}</p>
                            <p><strong>Shoot Type:</strong> {formData.shootType}</p>
                            <p><strong>Date:</strong> {formData.date}</p>
                            {selectedPackage && (
                              <p><strong>Package:</strong> {packages[selectedPackage - 1].name} ({packages[selectedPackage - 1].price})</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 mt-8">
                    {currentStep > 1 && (
                      <motion.button
                        type="button"
                        onClick={prevStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-6 py-4 bg-gray-200 text-charcoal rounded-xl font-semibold hover:bg-gray-300 transition-all"
                      >
                        ← Back
                      </motion.button>
                    )}
                    
                    {currentStep < totalSteps ? (
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-gold to-amber-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                      >
                        Continue →
                      </motion.button>
                    ) : (
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                        className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${
                          isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-gold to-amber-600 text-white hover:shadow-2xl'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                            />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane />
                            Complete Booking
                          </>
                        )}
                      </motion.button>
                    )}
                  </div>
                </form>

                {/* Trust Badge */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                    🔒 Your information is secure and encrypted
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } }
          }}
          className="text-center mt-16"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl border border-white/50">
            <h3 className="text-2xl font-playfair font-bold text-charcoal mb-4">
              Need Help or Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to assist you. Reach out anytime!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+918239372489"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-all"
              >
                <FaPhone /> Call: +91 82393 72489
              </a>
              <a
                href="https://wa.me/918239372489"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700 transition-all"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default BookingForm
