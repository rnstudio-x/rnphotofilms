import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaRobot, FaPlay, FaSpinner, FaCheckCircle, FaSync, FaInfoCircle } from 'react-icons/fa'

const PhotoDescriptorProcessor = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [processingStatus, setProcessingStatus] = useState(null) // ✅ NEW

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbx2hS9aqJ9Mp9RIF52Yw2g7SeAv2nisSYRMXpvu9RFf3QXquD-8QgRVtLOj-vvK9Ibzzg/exec'

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'getAllEvents' })
      })
      
      const result = await response.json()
      
      if (result.success) {
        const allEvents = [...(result.leads || []), ...(result.events || [])]
        setEvents(allEvents)
      }
    } catch (error) {
      alert('Failed to load events: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // ✅ NEW: Check processing status when event is selected
  const handleEventChange = async (eId) => {
    setSelectedEvent(eId)
    setResults(null)
    setProcessingStatus(null)
    
    if (!eId) return
    
    // Check if this event is already processed
    setProgress('Checking processing status...')
    
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'getProcessingStatus',
          eventId: eId
        })
      })
      
      const result = await response.json()
      
      if (result.success && result.processed) {
        setProcessingStatus({
          isProcessed: true,
          totalPhotos: result.totalPhotos,
          processedDate: result.processedDate
        })
      } else {
        setProcessingStatus({ isProcessed: false })
      }
    } catch (error) {
      console.error('Status check failed:', error)
      setProcessingStatus({ isProcessed: false })
    } finally {
      setProgress('')
    }
  }

  const processPhotos = async () => {
    if (!selectedEvent) {
      alert('Please select an event')
      return
    }

    // ✅ Confirm if already processed
    if (processingStatus?.isProcessed) {
      const confirmReprocess = window.confirm(
        `This event was already processed on ${new Date(processingStatus.processedDate).toLocaleString()}.\n\n` +
        `${processingStatus.totalPhotos} photos were processed.\n\n` +
        'Do you want to process it again? (This will overwrite existing data)'
      )
      
      if (!confirmReprocess) return
    }

    setProcessing(true)
    setProgress('Processing photos on backend...')
    setResults(null)

    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'processEventPhotosSimple',
          eventId: selectedEvent
        }),
        redirect: 'follow'
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()

      if (result.success) {
        setResults({
          totalPhotos: result.processed || 0,
          skipped: result.skipped || 0
        })
        
        // Update processing status
        setProcessingStatus({
          isProcessed: true,
          totalPhotos: result.processed,
          processedDate: new Date().toISOString()
        })
        
        setProgress('')
        alert(`✅ Success!\n\nProcessed: ${result.processed}\nSkipped: ${result.skipped}`)
      } else {
        setProgress('')
        alert('❌ Error: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('❌ Failed:', error)
      setProgress('')
      alert('❌ Processing failed!\n\n' + error.message)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white mb-8 shadow-2xl"
        >
          <div className="flex items-center space-x-5">
            <FaRobot className="text-6xl" />
            <div>
              <h1 className="text-3xl font-bold mb-2">Photo Processing</h1>
              <p className="text-lg">Backend face detection - 100% FREE!</p>
            </div>
          </div>
        </motion.div>

        {/* Event Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Select Event</h3>
            <button
              onClick={fetchEvents}
              disabled={loading}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex items-center space-x-2"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          <select
            value={selectedEvent}
            onChange={(e) => handleEventChange(e.target.value)}
            disabled={processing}
            className="w-full px-5 py-4 text-lg border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 focus:outline-none disabled:bg-gray-100"
          >
            <option value="">-- Select Event --</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.eventType} - {event.clientName} ({new Date(event.eventDate).toLocaleDateString()})
              </option>
            ))}
          </select>

          {/* ✅ Processing Status Display */}
          {processingStatus && selectedEvent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`mt-4 p-4 rounded-xl border-2 ${
                processingStatus.isProcessed
                  ? 'bg-green-50 border-green-300'
                  : 'bg-blue-50 border-blue-300'
              }`}
            >
              {processingStatus.isProcessed ? (
                <>
                  <div className="flex items-center text-green-700 font-bold mb-2">
                    <FaCheckCircle className="mr-2" />
                    Already Processed
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>{processingStatus.totalPhotos} photos</strong> processed on{' '}
                    <strong>{new Date(processingStatus.processedDate).toLocaleString()}</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Click "Start Processing" to reprocess this event
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center text-blue-700 font-bold mb-2">
                    <FaInfoCircle className="mr-2" />
                    Not Processed Yet
                  </div>
                  <p className="text-sm text-gray-700">
                    This event hasn't been processed. Click "Start Processing" to begin.
                  </p>
                </>
              )}
            </motion.div>
          )}

          {progress && (
            <p className="mt-4 text-center text-gray-700 font-medium">{progress}</p>
          )}
        </div>

        {/* Process Button */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <button
            onClick={processPhotos}
            disabled={processing || !selectedEvent}
            className={`w-full py-6 rounded-xl font-bold text-white text-xl flex items-center justify-center space-x-3 transition-all transform ${
              processing || !selectedEvent
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl hover:scale-105 active:scale-95'
            }`}
          >
            {processing ? (
              <>
                <FaSpinner className="animate-spin text-2xl" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaPlay className="text-xl" />
                <span>
                  {processingStatus?.isProcessed ? 'Reprocess Event' : 'Start Processing'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FaCheckCircle className="text-green-500 mr-3 text-3xl" />
              Processing Complete!
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center border-2 border-green-300">
                <p className="text-5xl font-bold text-green-600 mb-2">{results.totalPhotos}</p>
                <p className="text-lg font-medium text-gray-700">Photos Processed</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center border-2 border-orange-300">
                <p className="text-5xl font-bold text-orange-600 mb-2">{results.skipped}</p>
                <p className="text-lg font-medium text-gray-700">Skipped</p>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-6">
              <p className="text-green-800 font-bold text-lg">
                ✅ Photos processed successfully! Guests can now register and view their photos.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PhotoDescriptorProcessor
