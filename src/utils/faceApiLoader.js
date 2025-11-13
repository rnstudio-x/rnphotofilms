import * as faceapi from 'face-api.js'

let modelsLoaded = false
let loadingPromise = null

export const loadModels = async () => {
  if (modelsLoaded) {
    console.log('✅ Models already loaded')
    return true
  }

  if (loadingPromise) {
    return loadingPromise
  }

  loadingPromise = (async () => {
    try {
      console.log('📦 Loading face-api models from CDN...')
      
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model'
      
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ])
      
      modelsLoaded = true
      console.log('✅ Models loaded successfully')
      return true
    } catch (error) {
      console.error('❌ Model loading error:', error)
      loadingPromise = null
      throw new Error('Failed to load AI models')
    }
  })()

  return loadingPromise
}

export const extractAllFaceDescriptors = async (imageUrl) => {
  try {
    if (!modelsLoaded) {
      await loadModels()
    }

    console.log('🔍 Processing image:', imageUrl)

    // ✅ FIX: Convert to blob URL to bypass CORS
    let processUrl = imageUrl
    
    if (imageUrl.includes('drive.google.com')) {
      let fileId = null
      
      // Extract file ID
      if (imageUrl.includes('id=')) {
        fileId = imageUrl.split('id=')[1].split('&')[0]
      } else if (imageUrl.includes('/file/d/')) {
        fileId = imageUrl.split('/d/')[1].split('/')[0]
      }
      
      if (fileId) {
        // ✅ Download as blob and create object URL
        try {
          const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
          console.log('⬇️ Downloading image as blob...')
          
          const response = await fetch(downloadUrl, {
            method: 'GET',
            mode: 'no-cors' // Bypass CORS
          })
          
          // Create blob from response
          const blob = await response.blob()
          processUrl = URL.createObjectURL(blob)
          console.log('✅ Created blob URL')
        } catch (fetchError) {
          console.error('❌ Blob creation failed:', fetchError)
          // Fallback to original URL
          throw new Error('Failed to download image: ' + fetchError.message)
        }
      }
    }

    // Load image
    const img = await faceapi.fetchImage(processUrl)
    console.log('✅ Image loaded successfully')
    
    // Clean up blob URL
    if (processUrl.startsWith('blob:')) {
      URL.revokeObjectURL(processUrl)
    }
    
    // Detect faces
    const detections = await faceapi
      .detectAllFaces(img, new faceapi.SsdMobilenetv1Options({ 
        minConfidence: 0.4
      }))
      .withFaceLandmarks()
      .withFaceDescriptors()

    if (!detections || detections.length === 0) {
      console.log('⚠️ No faces detected')
      return []
    }

    console.log(`✅ Found ${detections.length} face(s)`)

    return detections.map((detection, index) => ({
      descriptor: Array.from(detection.descriptor),
      box: {
        x: Math.round(detection.detection.box.x),
        y: Math.round(detection.detection.box.y),
        width: Math.round(detection.detection.box.width),
        height: Math.round(detection.detection.box.height)
      },
      landmarks: detection.landmarks,
      index: index
    }))
  } catch (error) {
    console.error('❌ Face extraction error:', error)
    throw error
  }
}

export const compareFaces = (descriptor1, descriptor2, threshold = 0.6) => {
  try {
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2)
    return {
      isSamePerson: distance < threshold,
      distance: distance.toFixed(3),
      similarity: Math.round((1 - distance) * 100)
    }
  } catch (error) {
    console.error('❌ Comparison error:', error)
    return { isSamePerson: false, distance: 1, similarity: 0 }
  }
}

export default {
  loadModels,
  extractAllFaceDescriptors,
  compareFaces
}
