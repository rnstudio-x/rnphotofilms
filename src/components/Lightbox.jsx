import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Lightbox = ({ images, currentIndex, onClose }) => {
  const [current, setCurrent] = useState(currentIndex)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [current])

  const nextImage = () => {
    setCurrent((current + 1) % images.length)
  }

  const prevImage = () => {
    setCurrent((current - 1 + images.length) % images.length)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white text-3xl hover:text-gold transition-colors z-50"
        >
          <FaTimes />
        </button>

        {/* Previous Button */}
        <button
          onClick={(e) => { e.stopPropagation(); prevImage() }}
          className="absolute left-6 text-white text-4xl hover:text-gold transition-colors z-50"
        >
          <FaChevronLeft />
        </button>

        {/* Image */}
        <motion.img
          key={current}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          src={images[current]}
          alt="Gallery"
          className="max-w-[90vw] max-h-[90vh] object-contain"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Next Button */}
        <button
          onClick={(e) => { e.stopPropagation(); nextImage() }}
          className="absolute right-6 text-white text-4xl hover:text-gold transition-colors z-50"
        >
          <FaChevronRight />
        </button>

        {/* Counter */}
        <div className="absolute bottom-6 text-white text-lg">
          {current + 1} / {images.length}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Lightbox
