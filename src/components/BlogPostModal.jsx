import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaClock, FaUser, FaCalendar, FaTag } from 'react-icons/fa'

const BlogPostModal = ({ post, onClose }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  if (!post) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25 }}
          className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="sticky top-4 right-4 float-right bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-all z-10"
          >
            <FaTimes />
          </button>

          {/* Hero Image */}
          <div className="relative h-[40vh] overflow-hidden rounded-t-3xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="inline-block bg-gold text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                {post.category}
              </div>
              <h1 className="text-3xl md:text-5xl font-playfair font-bold mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <img src={post.authorImage} alt={post.author} className="w-10 h-10 rounded-full border-2 border-white" />
                  <span className="font-semibold">{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendar />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <article
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                fontFamily: 'inherit',
                lineHeight: '1.8',
                color: '#333'
              }}
            />

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-3 flex-wrap">
                <FaTag className="text-gold" />
                {post.tags.map((tag, i) => (
                  <span key={i} className="bg-gold/10 text-gold px-4 py-2 rounded-full text-sm font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BlogPostModal
