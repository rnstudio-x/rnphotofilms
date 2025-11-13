import * as faceapi from 'face-api.js'

let modelsLoaded = false

/**
 * Load face-api.js models (call once at app initialization)
 */
export const loadFaceApiModels = async () => {
  if (modelsLoaded) return true

  try {
    const MODEL_URL = '/models'
    
    console.log('🔄 Loading face detection models...')
    
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
    ])

    modelsLoaded = true
    console.log('✅ Face-api models loaded successfully!')
    return true
  } catch (error) {
    console.error('❌ Error loading face-api models:', error)
    return false
  }
}

/**
 * Extract 128D face descriptor from base64 image
 * @param {string} base64Image - Base64 encoded image data
 * @returns {Promise<number[]|null>} Face descriptor array or null if no face detected
 */
export const extractFaceDescriptor = async (base64Image) => {
  try {
    if (!modelsLoaded) {
      await loadFaceApiModels()
    }

    // Convert base64 to image element
    const img = await faceapi.bufferToImage(base64Image)
    
    // Detect face with landmarks and descriptor
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor()

    if (!detection) {
      console.warn('⚠️ No face detected in image')
      return null
    }

    // Return descriptor as array
    return Array.from(detection.descriptor)
  } catch (error) {
    console.error('Error extracting face descriptor:', error)
    return null
  }
}

/**
 * Extract face descriptors from all faces in an image
 * @param {string} imageUrl - Image URL
 * @returns {Promise<Array<{descriptor: number[], box: object}>>}
 */
export const extractAllFaceDescriptors = async (imageUrl) => {
  try {
    if (!modelsLoaded) {
      await loadFaceApiModels()
    }

    const img = await faceapi.fetchImage(imageUrl)
    
    const detections = await faceapi
      .detectAllFaces(img)
      .withFaceLandmarks()
      .withFaceDescriptors()

    return detections.map((det, index) => ({
      descriptor: Array.from(det.descriptor),
      box: det.detection.box,
      faceIndex: index
    }))
  } catch (error) {
    console.error('Error extracting face descriptors:', error)
    return []
  }
}

/**
 * Compare two face descriptors and return similarity score
 * @param {number[]} descriptor1 - First face descriptor
 * @param {number[]} descriptor2 - Second face descriptor
 * @returns {number} Distance (lower = more similar, < 0.6 is a match)
 */
export const compareFaceDescriptors = (descriptor1, descriptor2) => {
  return faceapi.euclideanDistance(descriptor1, descriptor2)
}

/**
 * Find matching photos for a guest's face descriptor
 * @param {number[]} guestDescriptor - Guest's face descriptor
 * @param {Array} photoDescriptors - Array of {photoId, descriptor} objects
 * @param {number} threshold - Match threshold (default 0.6)
 * @returns {string[]} Array of matched photo IDs
 */
export const findMatchingPhotos = (guestDescriptor, photoDescriptors, threshold = 0.6) => {
  const matchedPhotoIds = []

  for (const photoDesc of photoDescriptors) {
    const distance = compareFaceDescriptors(guestDescriptor, photoDesc.descriptor)
    
    if (distance < threshold) {
      matchedPhotoIds.push(photoDesc.photoId)
      console.log(`✅ Match found! Photo ID: ${photoDesc.photoId}, Distance: ${distance.toFixed(3)}`)
    }
  }

  return matchedPhotoIds
}

export default {
  loadFaceApiModels,
  extractFaceDescriptor,
  extractAllFaceDescriptors,
  compareFaceDescriptors,
  findMatchingPhotos
}
