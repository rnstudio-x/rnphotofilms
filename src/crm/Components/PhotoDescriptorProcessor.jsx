import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FaRobot, FaImages, FaSpinner, FaCheckCircle, FaExclamationTriangle, FaPlay, FaFolder, FaSync } from 'react-icons/fa'
import { extractAllFaceDescriptors } from '../../utils/faceApiLoader'

const PhotoDescriptorProcessor = () => {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState('')
  const [photos, setPhotos] = useState([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentPhoto, setCurrentPhoto] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fetchAttemptRef = useRef(0)
  const isMountedRef = useRef(false)

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbxKf4OGvheQFQ6Yqma-lPrqTKlRf8FapRJ2F2nGgClYRiZER333Q42P8Nnq0aSCDOgQCg/exec'

  useEffect(() => {
    isMountedRef.current = true
    
    // ✅ FIX: Delay initial fetch to avoid race condition
    const timer = setTimeout(() => {
      if (isMountedRef.current && events.length === 0 && !loading) {
        fetchEvents()
      }
    }, 800) // Increased delay
    
    return () => {
      isMountedRef.current = false
      clearTimeout(timer)
    }
  }, [])

  const fetchEvents = async (isRetry = false) => {
    // ✅ Prevent multiple simultaneous calls
    if (loading) {
      console.log('⏳ Already loading, skipping...')
      return
    }

    // ✅ Limit retries
    if (fetchAttemptRef.current >= 3) {
      console.warn('⚠️ Max retry attempts reached')
      setError('Unable to connect after 3 attempts. Please refresh.')
      setLoading(false)
      return
    }

    fetchAttemptRef.current += 1
    console.log(`🔄 Fetch attempt ${fetchAttemptRef.current}`)
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'text/plain; charset=utf-8',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ action: 'getAllEvents' })
      })

      console.log('📡 Response status:', response.status)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('📦 Result:', result)

      if (result.success) {
        const allEvents = [
          ...(result.leads || []),
          ...(result.events || [])
        ].sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate))

        if (allEvents.length === 0) {
          setError('No events found in database')
        } else {
          setEvents(allEvents)
          setError(null)
          fetchAttemptRef.current = 0 // Reset on success
          console.log(`✅ Loaded ${allEvents.length} events`)
        }
      } else {
        throw new Error(result.message || 'Backend returned error')
      }
    } catch (error) {
      console.error('❌ Fetch error:', error)
      
      // ✅ Only show error alert after final retry
      if (fetchAttemptRef.current >= 3) {
        setError(error.message)
        // Don't show alert, just log
        console.error('Final error:', error.message)
      } else if (!isRetry) {
        // Retry after delay
        console.log(`🔄 Retrying in 2 seconds...`)
        setTimeout(() => {
          if (isMountedRef.current) {
            fetchEvents(true)
          }
        }, 2000)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchEventPhotos = async (eventId) => {
    if (!eventId) return

    setLoading(true)
    
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'text/plain; charset=utf-8'
        },
        body: JSON.stringify({
          action: 'getEventPhotosFromGallery',
          eventId: eventId
        })
      })

      const result = await response.json()

      if (result.success) {
        if (result.photos.length === 0) {
          alert('⚠️ No photos found\n\nPlease add photos in Gallery Manager')
        }
        setPhotos(result.photos)
      } else {
        alert('Error: ' + (result.message || 'Failed to load photos'))
        setPhotos([])
      }
    } catch (error) {
      console.error('❌ Fetch photos error:', error)
      alert('Failed to load photos: ' + error.message)
      setPhotos([])
    } finally {
      setLoading(false)
    }
  }

  const processPhotos = async () => {
    if (!selectedEvent || photos.length === 0) {
      alert('Please select an event with photos')
      return
    }

    setProcessing(true)
    setProgress(0)
    setResults(null)
    const descriptors = []
    let photosWithFaces = 0

    try {
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i]
        setCurrentPhoto(photo.name)

        try {
          const faces = await extractAllFaceDescriptors(photo.url)

          if (faces.length > 0) {
            photosWithFaces++
            faces.forEach((face, faceIndex) => {
              descriptors.push({
                photoId: photo.id,
                photoName: photo.name,
                photoUrl: photo.url,
                faceIndex: faceIndex,
                descriptor: face.descriptor,
                boundingBox: face.box
              })
            })
          }
        } catch (photoError) {
          console.error(`Error processing ${photo.name}:`, photoError)
        }

        setProgress(Math.round(((i + 1) / photos.length) * 100))
      }

      if (descriptors.length === 0) {
        alert('⚠️ No faces detected')
        setProcessing(false)
        return
      }

      await saveDescriptors(selectedEvent, descriptors)

      setResults({
        totalPhotos: photos.length,
        photosWithFaces: photosWithFaces,
        totalFaces: descriptors.length
      })

      alert(`✅ Success!\n\n📸 ${photos.length} photos\n👤 ${descriptors.length} faces`)

    } catch (error) {
      console.error('Processing error:', error)
      alert('Failed: ' + error.message)
    } finally {
      setProcessing(false)
      setCurrentPhoto('')
    }
  }

  const saveDescriptors = async (eventId, descriptors) => {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        action: 'savePhotoDescriptors',
        eventId: eventId,
        descriptors: descriptors
      })
    })

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.message || 'Failed to save')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white mb-8 shadow-2xl"
        >
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
              <FaRobot className="text-4xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">AI Photo Descriptor Processor</h1>
              <p className="text-white/90 text-lg">Extract face descriptors for guest matching</p>
            </div>
          </div>
        </motion.div>

        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Backend Status</p>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className={`font-semibold ${error ? 'text-red-600' : 'text-green-600'}`}>
                  {error ? 'Error' : 'Connected'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Events</p>
              <p className="text-3xl font-bold text-purple-600">{events.length}</p>
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
        </motion.div>

        {/* Event Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold flex items-center">
              <FaFolder className="mr-3 text-purple-500" />
              Step 1: Select Event
            </h3>
            <button
              onClick={() => {
                fetchAttemptRef.current = 0
                fetchEvents()
              }}
              disabled={loading}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 disabled:opacity-50"
            >
              <FaSync className={`inline mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {loading && !processing ? (
            <div className="flex flex-col items-center py-12">
              <FaSpinner className="animate-spin text-purple-500 text-5xl mb-4" />
              <p className="text-gray-600">Loading events...</p>
            </div>
          ) : (
            <>
              <select
                value={selectedEvent}
                onChange={(e) => {
                  setSelectedEvent(e.target.value)
                  setPhotos([])
                  setResults(null)
                  if (e.target.value) {
                    fetchEventPhotos(e.target.value)
                  }
                }}
                disabled={processing}
                className="w-full px-5 py-4 text-lg border-2 border-purple-300 rounded-xl focus:ring-4 focus:ring-purple-200 focus:outline-none"
              >
                <option value="">-- Select Event --</option>
                {events.map(event => (
                  <option key={event.id} value={event.id}>
                    {event.eventType} - {event.clientName} ({new Date(event.eventDate).toLocaleDateString()})
                  </option>
                ))}
              </select>

              {events.length === 0 && !loading && (
                <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                  <p className="text-yellow-800 mb-3">No events found</p>
                  <button
                    onClick={() => {
                      fetchAttemptRef.current = 0
                      fetchEvents()
                    }}
                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    Retry
                  </button>
                </div>
              )}

              {photos.length > 0 && (
                <div className="mt-6 p-5 bg-blue-50 border-2 border-blue-300 rounded-xl">
                  <p className="text-blue-800 font-semibold">
                    <FaImages className="inline mr-2" />
                    {photos.length} photos loaded
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Processing */}
        {photos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">Step 2: Process</h3>

            <button
              onClick={processPhotos}
              disabled={processing}
              className={`w-full py-5 rounded-xl font-bold text-lg text-white ${
                processing ? 'bg-gray-400' : 'bg-gradient-to-r from-purple-600 to-pink-600'
              }`}
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-3" />
                  {progress}%
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaPlay className="mr-3" />
                  Start
                </span>
              )}
            </button>

            {processing && (
              <div className="mt-6">
                <div className="bg-gray-200 rounded-full h-5">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center mt-3 text-sm">{currentPhoto}</p>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6">Results</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <p className="text-5xl font-bold text-blue-600">{results.totalPhotos}</p>
                <p className="text-sm mt-2">Photos</p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-5xl font-bold text-green-600">{results.photosWithFaces}</p>
                <p className="text-sm mt-2">With Faces</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <p className="text-5xl font-bold text-purple-600">{results.totalFaces}</p>
                <p className="text-sm mt-2">Total Faces</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PhotoDescriptorProcessor
