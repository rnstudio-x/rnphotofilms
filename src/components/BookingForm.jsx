import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapMarkerAlt, 
  FaCamera, FaRupeeSign, FaTimes, FaCheckCircle, FaArrowRight, 
  FaArrowLeft, FaUsers, FaClock, FaCommentDots 
} from 'react-icons/fa'

const BookingForm = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Client Info
    clientName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    
    // Event Details
    eventType: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    venueAddress: '',
    guestCount: '',
    
    // Package & Budget
    packageCategory: '',
    budget: '',
    customRequirements: '',
    
    // Auto fields
    source: 'Website',
    status: 'New Lead',
    createdAt: new Date().toISOString()
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const totalSteps = 4

  // Event Types
  const eventTypes = [
    { value: 'Wedding', icon: '💍', label: 'Wedding', color: 'from-pink-500 to-rose-500' },
    { value: 'Pre-Wedding', icon: '💑', label: 'Pre-Wedding', color: 'from-purple-500 to-pink-500' },
    { value: 'Birthday', icon: '🎂', label: 'Birthday', color: 'from-yellow-500 to-orange-500' },
    { value: 'Anniversary', icon: '💐', label: 'Anniversary', color: 'from-red-500 to-pink-500' },
    { value: 'Corporate', icon: '🏢', label: 'Corporate', color: 'from-blue-500 to-indigo-500' },
    { value: 'Other', icon: '📸', label: 'Other', color: 'from-gray-500 to-gray-600' }
  ]

  // Packages
  const packages = {
    Wedding: [
      { value: 'Basic Wedding', price: '₹35,000', features: ['6 Hours Coverage', '300 Edited Photos', '1 Videographer'] },
      { value: 'Premium Wedding', price: '₹75,000', features: ['Full Day Coverage', '600+ Photos', 'Drone Shots', '2 Videographers'] },
      { value: 'Luxury Wedding', price: '₹1,50,000', features: ['2 Days Coverage', '1000+ Photos', 'Full Team', 'Premium Album'] }
    ],
    'Pre-Wedding': [
      { value: 'Standard Pre-Wedding', price: '₹25,000', features: ['4 Hours', '200 Photos', '1 Location'] },
      { value: 'Premium Pre-Wedding', price: '₹45,000', features: ['8 Hours', '400 Photos', '2 Locations'] }
    ],
    Birthday: [
      { value: 'Basic Birthday', price: '₹8,000', features: ['3 Hours', '150 Photos'] },
      { value: 'Premium Birthday', price: '₹15,000', features: ['5 Hours', '300 Photos', 'Video'] }
    ],
    Corporate: [
      { value: 'Half Day Corporate', price: '₹12,000', features: ['4 Hours', '200 Photos'] },
      { value: 'Full Day Corporate', price: '₹20,000', features: ['8 Hours', '500 Photos'] }
    ],
    Anniversary: [
      { value: 'Couple Shoot', price: '₹10,000', features: ['2 Hours', '100 Photos'] },
      { value: 'Celebration Package', price: '₹18,000', features: ['4 Hours', '250 Photos'] }
    ],
    Other: [
      { value: 'Custom Package', price: 'Quote Based', features: ['Customized as per your needs'] }
    ]
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.clientName.trim()) newErrors.clientName = 'Name is required'
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone is required'
      } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
        newErrors.phone = 'Invalid phone number'
      }
    }
    
    if (step === 2) {
      if (!formData.eventType) newErrors.eventType = 'Select event type'
      if (!formData.eventDate) newErrors.eventDate = 'Event date is required'
      if (!formData.venue.trim()) newErrors.venue = 'Venue is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }
    
const handleSubmit = async () => {
  if (!validateStep(currentStep)) return
  
  setIsSubmitting(true)
  
  try {
    // ✅ Your deployed Google Apps Script URL
    const GAS_URL = 'https://script.google.com/macros/s/AKfycbzX0rollFXcrI5d8qKhWlLslCX71JDSnlwAVtLLsqmDze2Jhi9_FbpMg-wIvELxe83fZQ/exec'
    
    // Prepare data
    const submitData = {
      action: 'addLead',
      ...formData,
      submittedAt: new Date().toISOString()
    }
    
    console.log('📤 Sending to GAS:', submitData)
    
    // ✅ Use fetch with proper CORS handling
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain', // ← Important for GAS
      },
      body: JSON.stringify(submitData),
      redirect: 'follow'
    })
    
    console.log('📥 Response status:', response.status)
    
    // Get response text first
    const responseText = await response.text()
    console.log('📥 Response text:', responseText)
    
    // Try to parse as JSON
    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      console.error('❌ JSON parse error:', e)
      throw new Error('Invalid response from server')
    }
    
    console.log('📥 Parsed result:', result)
    
    if (result.success) {
      // ✅ Success
      setShowSuccess(true)
      
      // Reset form
      setFormData({
        clientName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        eventType: '',
        eventDate: '',
        eventTime: '',
        venue: '',
        venueAddress: '',
        guestCount: '',
        packageCategory: '',
        budget: '',
        customRequirements: '',
        source: 'Website',
        status: 'New Lead',
        createdAt: new Date().toISOString()
      })
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onClose()
        setCurrentStep(1)
      }, 3000)
      
    } else {
      throw new Error(result.error || 'Submission failed')
    }
    
  } catch (error) {
    console.error('❌ Submission error:', error)
    alert(
      '❌ Submission Failed\n\n' +
      'Error: ' + error.message + '\n\n' +
      'Please try again or contact us:\n' +
      '📞 +91 82393 72489\n' +
      '📧 info@rnphotofilms.com'
    )
  } finally {
    setIsSubmitting(false)
  }
}



  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <FaTimes className="text-gray-600" size={20} />
            </button>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-3xl"
                >
                  <div className="text-center p-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-charcoal mb-3">Booking Received!</h3>
                    <p className="text-gray-600 text-lg">We'll contact you within 24 hours</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="p-8 pb-6 border-b border-gray-200">
              <h2 className="text-3xl font-playfair font-bold text-charcoal mb-2">
                Book Your Session
              </h2>
              <p className="text-gray-600">Let's capture your precious moments together</p>
              
              {/* Progress Bar */}
              <div className="mt-6 flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                          step <= currentStep
                            ? 'bg-gradient-to-r from-gold to-amber-500 text-white shadow-lg'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {step}
                      </div>
                      <span className={`text-xs mt-2 ${step <= currentStep ? 'text-gold font-semibold' : 'text-gray-400'}`}>
                        {step === 1 ? 'Contact' : step === 2 ? 'Event' : step === 3 ? 'Package' : 'Review'}
                      </span>
                    </div>
                    {step < 4 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                          step < currentStep ? 'bg-gradient-to-r from-gold to-amber-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Contact Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-charcoal flex items-center gap-3 mb-6">
                      <FaUser className="text-gold" />
                      Your Information
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.clientName
                            ? 'border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-gold focus:ring-gold/20'
                        }`}
                      />
                      {errors.clientName && <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.email
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-gold focus:ring-gold/20'
                          }`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.phone
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-gold focus:ring-gold/20'
                          }`}
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Alternate Phone <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="alternatePhone"
                        value={formData.alternatePhone}
                        onChange={handleChange}
                        placeholder="Backup contact"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Event Details */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-charcoal flex items-center gap-3 mb-6">
                      <FaCamera className="text-gold" />
                      Event Details
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-3">
                        Event Type <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {eventTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, eventType: type.value, packageCategory: '' }))}
                            className={`p-4 rounded-xl border-2 transition-all hover:scale-105 ${
                              formData.eventType === type.value
                                ? 'border-gold bg-gold/10 shadow-lg'
                                : 'border-gray-200 hover:border-gold'
                            }`}
                          >
                            <div className="text-3xl mb-2">{type.icon}</div>
                            <div className="text-sm font-semibold text-charcoal">{type.label}</div>
                          </button>
                        ))}
                      </div>
                      {errors.eventType && <p className="text-red-500 text-sm mt-2">{errors.eventType}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Event Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="eventDate"
                          value={formData.eventDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.eventDate
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-gold focus:ring-gold/20'
                          }`}
                        />
                        {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Event Time
                        </label>
                        <input
                          type="time"
                          name="eventTime"
                          value={formData.eventTime}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Venue Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="venue"
                          value={formData.venue}
                          onChange={handleChange}
                          placeholder="e.g., Taj Hotel, Home"
                          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.venue
                              ? 'border-red-500 focus:ring-red-200'
                              : 'border-gray-200 focus:border-gold focus:ring-gold/20'
                          }`}
                        />
                        {errors.venue && <p className="text-red-500 text-sm mt-1">{errors.venue}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Guest Count
                        </label>
                        <input
                          type="number"
                          name="guestCount"
                          value={formData.guestCount}
                          onChange={handleChange}
                          placeholder="Approx guests"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Venue Address
                      </label>
                      <textarea
                        name="venueAddress"
                        value={formData.venueAddress}
                        onChange={handleChange}
                        placeholder="Full address with landmark"
                        rows="2"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Package Selection */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-charcoal flex items-center gap-3 mb-6">
                      <FaRupeeSign className="text-gold" />
                      Select Package
                    </h3>

                    {formData.eventType && packages[formData.eventType] ? (
                      <div className="space-y-4">
                        {packages[formData.eventType].map((pkg) => (
                          <button
                            key={pkg.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, packageCategory: pkg.value }))}
                            className={`w-full p-6 rounded-xl border-2 text-left transition-all hover:scale-[1.02] ${
                              formData.packageCategory === pkg.value
                                ? 'border-gold bg-gold/10 shadow-lg'
                                : 'border-gray-200 hover:border-gold'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="font-bold text-lg text-charcoal">{pkg.value}</div>
                              <div className="text-2xl font-bold text-gold">{pkg.price}</div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {pkg.features.map((feature, idx) => (
                                <span key={idx} className="text-sm bg-white px-3 py-1 rounded-full border border-gray-200">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        Please select an event type first
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Your Budget <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="e.g., ₹50,000 - ₹75,000"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Review & Requirements */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-bold text-charcoal flex items-center gap-3 mb-6">
                      <FaCommentDots className="text-gold" />
                      Review & Submit
                    </h3>

                    {/* Summary */}
                    <div className="bg-cream rounded-xl p-6 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold text-charcoal">{formData.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold text-charcoal">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-semibold text-charcoal">{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Event:</span>
                        <span className="font-semibold text-charcoal">{formData.eventType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold text-charcoal">{formData.eventDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Venue:</span>
                        <span className="font-semibold text-charcoal">{formData.venue}</span>
                      </div>
                      {formData.packageCategory && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Package:</span>
                          <span className="font-semibold text-charcoal">{formData.packageCategory}</span>
                        </div>
                      )}
                    </div>

                    {/* Requirements */}
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Special Requirements
                      </label>
                      <textarea
                        name="customRequirements"
                        value={formData.customRequirements}
                        onChange={handleChange}
                        placeholder="Any specific requirements or questions..."
                        rows="4"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none"
                      />
                    </div>

                    <p className="text-center text-sm text-gray-500">
                      🔒 Your information is secure and encrypted
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Buttons */}
            <div className="p-8 pt-0 flex gap-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="flex-1 py-3 rounded-full border-2 border-gray-300 font-semibold text-gray-700 hover:border-gold hover:text-gold transition-all flex items-center justify-center gap-2"
                >
                  <FaArrowLeft />
                  Previous
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-gold via-amber-500 to-orange-500 font-semibold text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  Next
                  <FaArrowRight />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 py-3 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-gold via-amber-500 to-orange-500 hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  <FaCheckCircle />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BookingForm
