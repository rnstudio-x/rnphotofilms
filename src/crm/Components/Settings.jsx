import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FaUser, FaLock, FaBell, FaPalette, FaDatabase, FaCog,
  FaSave, FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaGlobe, FaInstagram, FaFacebook, FaWhatsapp, FaEdit,
  FaSpinner, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState(null) // 'success', 'error', null

  const [settings, setSettings] = useState({
    // Business Profile
    businessName: 'RN PhotoFilms',
    ownerName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: 'Gujarat',
    pincode: '',
    
    // Social Media
    website: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    
    // Business Settings
    currency: '₹',
    taxRate: 18,
    advancePercentage: 15,
    balancePercentage: 85,
    defaultPaymentTerms: 'Advance: 15% at booking, Balance: 85% before event',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    newLeadAlert: true,
    paymentAlert: true,
    eventReminder: true,
    
    // Appearance
    theme: 'light',
    primaryColor: '#3B82F6',
    accentColor: '#D4A574'
  })

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzX0rollFXcrI5d8qKhWlLslCX71JDSnlwAVtLLsqmDze2Jhi9_FbpMg-wIvELxe83fZQ/exec' // Replace with your actual URL

  useEffect(() => {
    fetchSettings()
  }, [])

  // ==================== FETCH SETTINGS ====================
  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ 
          action: 'getSettings'
        })
      })

      const result = await response.json()
      
      if (result.success && result.settings) {
        // Merge fetched settings with defaults
        setSettings(prev => ({
          ...prev,
          ...result.settings
        }))
      } else {
        // If no settings found, use localStorage as fallback
        const localSettings = localStorage.getItem('crm_settings')
        if (localSettings) {
          setSettings(prev => ({
            ...prev,
            ...JSON.parse(localSettings)
          }))
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      
      // Fallback to localStorage
      const localSettings = localStorage.getItem('crm_settings')
      if (localSettings) {
        setSettings(prev => ({
          ...prev,
          ...JSON.parse(localSettings)
        }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  // ==================== SAVE SETTINGS ====================
  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus(null)
    
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'saveSettings',
          settings: settings,
          updatedAt: new Date().toISOString()
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Also save to localStorage as backup
        localStorage.setItem('crm_settings', JSON.stringify(settings))
        
        setSaveStatus('success')
        
        // Show success message for 3 seconds
        setTimeout(() => setSaveStatus(null), 3000)
      } else {
        setSaveStatus('error')
        alert('❌ Failed to save settings: ' + result.error)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      
      // Save to localStorage as fallback
      localStorage.setItem('crm_settings', JSON.stringify(settings))
      
      setSaveStatus('error')
      alert('⚠️ Saved to local storage only. Please check your internet connection.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleReset = () => {
    const confirmed = window.confirm('⚠️ Are you sure you want to reset all settings to default? This cannot be undone!')
    
    if (confirmed) {
      setSettings({
        businessName: 'RN PhotoFilms',
        ownerName: '',
        email: '',
        phone: '',
        alternatePhone: '',
        address: '',
        city: '',
        state: 'Gujarat',
        pincode: '',
        website: '',
        instagram: '',
        facebook: '',
        whatsapp: '',
        currency: '₹',
        taxRate: 18,
        advancePercentage: 15,
        balancePercentage: 85,
        defaultPaymentTerms: 'Advance: 15% at booking, Balance: 85% before event',
        emailNotifications: true,
        smsNotifications: false,
        newLeadAlert: true,
        paymentAlert: true,
        eventReminder: true,
        theme: 'light',
        primaryColor: '#3B82F6',
        accentColor: '#D4A574'
      })
      
      alert('✅ Settings reset to default!')
    }
  }

  const tabs = [
    { id: 'profile', label: 'Business Profile', icon: FaUser },
    { id: 'payments', label: 'Payment Settings', icon: FaDatabase },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your CRM preferences and business information</p>
            </div>

            {/* Save Status Indicator */}
            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  saveStatus === 'success' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {saveStatus === 'success' ? (
                  <>
                    <FaCheckCircle />
                    <span className="font-semibold">Settings saved!</span>
                  </>
                ) : (
                  <>
                    <FaExclamationTriangle />
                    <span className="font-semibold">Save failed</span>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              
              {/* Business Profile Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaUser /> Business Profile
                    </h2>
                    <p className="text-gray-600 mb-6">Update your business information and contact details</p>
                  </div>

                  {/* Business Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        value={settings.businessName}
                        onChange={(e) => handleChange('businessName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Owner Name *
                      </label>
                      <input
                        type="text"
                        value={settings.ownerName}
                        onChange={(e) => handleChange('ownerName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaEnvelope className="inline mr-2" />Email *
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FaPhone className="inline mr-2" />Phone *
                      </label>
                      <input
                        type="tel"
                        value={settings.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Alternate Phone
                      </label>
                      <input
                        type="tel"
                        value={settings.alternatePhone}
                        onChange={(e) => handleChange('alternatePhone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={settings.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={settings.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={settings.pincode}
                        onChange={(e) => handleChange('pincode', e.target.value)}
                        maxLength={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />Business Address
                    </label>
                    <textarea
                      value={settings.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Social Media */}
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaGlobe className="inline mr-2" />Website
                        </label>
                        <input
                          type="url"
                          value={settings.website}
                          onChange={(e) => handleChange('website', e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaInstagram className="inline mr-2" />Instagram
                        </label>
                        <input
                          type="text"
                          value={settings.instagram}
                          onChange={(e) => handleChange('instagram', e.target.value)}
                          placeholder="@username"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaFacebook className="inline mr-2" />Facebook
                        </label>
                        <input
                          type="text"
                          value={settings.facebook}
                          onChange={(e) => handleChange('facebook', e.target.value)}
                          placeholder="facebook.com/yourpage"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          <FaWhatsapp className="inline mr-2" />WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={settings.whatsapp}
                          onChange={(e) => handleChange('whatsapp', e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment Settings Tab */}
              {activeTab === 'payments' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaDatabase /> Payment Settings
                    </h2>
                    <p className="text-gray-600 mb-6">Configure payment terms and default values</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Advance Percentage (%)
                      </label>
                      <input
                        type="number"
                        value={settings.advancePercentage}
                        onChange={(e) => handleChange('advancePercentage', parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Default: 15%</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Balance Percentage (%)
                      </label>
                      <input
                        type="number"
                        value={settings.balancePercentage}
                        onChange={(e) => handleChange('balancePercentage', parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Auto-calculated: {100 - settings.advancePercentage}%</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        GST/Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        value={settings.taxRate}
                        onChange={(e) => handleChange('taxRate', parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">Default: 18%</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Currency Symbol
                      </label>
                      <input
                        type="text"
                        value={settings.currency}
                        onChange={(e) => handleChange('currency', e.target.value)}
                        maxLength={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Default Payment Terms
                    </label>
                    <textarea
                      value={settings.defaultPaymentTerms}
                      onChange={(e) => handleChange('defaultPaymentTerms', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">This will be shown in invoices and quotations</p>
                  </div>

                  {/* Preview */}
                  <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-3">Payment Breakdown Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Example Amount:</span>
                        <span className="font-semibold">{settings.currency}50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Advance ({settings.advancePercentage}%):</span>
                        <span className="font-semibold text-green-600">{settings.currency}{(50000 * settings.advancePercentage / 100).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Balance ({100 - settings.advancePercentage}%):</span>
                        <span className="font-semibold text-orange-600">{settings.currency}{(50000 * (100 - settings.advancePercentage) / 100).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-blue-300">
                        <span className="text-gray-700">GST ({settings.taxRate}%):</span>
                        <span className="font-semibold">{settings.currency}{(50000 * settings.taxRate / 100).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between font-bold text-blue-800 pt-2 border-t border-blue-300">
                        <span>Total Amount:</span>
                        <span>{settings.currency}{(50000 + (50000 * settings.taxRate / 100)).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaBell /> Notification Preferences
                    </h2>
                    <p className="text-gray-600 mb-6">Choose how you want to be notified</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-800">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-800">SMS Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-800">New Lead Alerts</h4>
                        <p className="text-sm text-gray-600">Get notified when new lead arrives</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.newLeadAlert}
                          onChange={(e) => handleChange('newLeadAlert', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-800">Payment Alerts</h4>
                        <p className="text-sm text-gray-600">Notifications for payment updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.paymentAlert}
                          onChange={(e) => handleChange('paymentAlert', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-800">Event Reminders</h4>
                        <p className="text-sm text-gray-600">Reminders for upcoming events</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.eventReminder}
                          onChange={(e) => handleChange('eventReminder', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaPalette /> Appearance
                    </h2>
                    <p className="text-gray-600 mb-6">Customize the look and feel of your CRM</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Theme
                      </label>
                      <select
                        value={settings.theme}
                        onChange={(e) => handleChange('theme', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={settings.primaryColor}
                          onChange={(e) => handleChange('primaryColor', e.target.value)}
                          className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.primaryColor}
                          onChange={(e) => handleChange('primaryColor', e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Accent Color
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => handleChange('accentColor', e.target.value)}
                          className="h-12 w-20 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.accentColor}
                          onChange={(e) => handleChange('accentColor', e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Color Preview */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-700 mb-4">Color Preview</h4>
                      <div className="flex gap-4">
                        <div 
                          className="flex-1 h-20 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: settings.primaryColor }}
                        >
                          Primary
                        </div>
                        <div 
                          className="flex-1 h-20 rounded-lg shadow-lg flex items-center justify-center text-white font-semibold"
                          style={{ backgroundColor: settings.accentColor }}
                        >
                          Accent
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Save Button */}
              <div className="pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Reset to Default
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold min-w-[140px] justify-center"
                >
                  {isSaving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
