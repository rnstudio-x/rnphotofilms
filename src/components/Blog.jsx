import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { FaClock, FaUser, FaArrowRight } from 'react-icons/fa'

// Blog data directly inside component
const blogPosts = [
  {
    id: 1,
    slug: 'perfect-wedding-photography-tips',
    title: '10 Tips for Perfect Wedding Photography',
    excerpt: 'Discover essential tips to ensure your wedding day is captured beautifully, from lighting to candid moments.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    author: 'Raj Nair',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    date: 'October 1, 2025',
    readTime: '5 min read',
    category: 'Wedding',
    tags: ['Wedding', 'Tips', 'Photography'],
    content: `
      <h2>Introduction</h2>
      <p>Wedding photography is one of the most rewarding yet challenging genres in photography. Capturing the magic, emotions, and fleeting moments of someone's special day requires skill, preparation, and creativity.</p>

      <h2>1. Scout the Location Beforehand</h2>
      <p>Visit the wedding venue before the big day. Understand the lighting conditions, identify the best photo spots, and plan your shots.</p>

      <h2>2. Communicate with the Couple</h2>
      <p>Understanding the couple's vision is crucial. Discuss their preferences, must-have shots, and any special moments they want captured.</p>

      <h2>3. Master Natural Light</h2>
      <p>Natural light creates magical wedding photos. Use golden hour for romantic portraits. Learn to work with window light during indoor ceremonies.</p>

      <h2>4. Capture Candid Moments</h2>
      <p>The most memorable wedding photos are often unposed. Keep your camera ready to capture genuine emotions and spontaneous interactions.</p>

      <h2>5. Use Multiple Angles</h2>
      <p>Don't shoot everything from eye level. Get creative with low angles, high perspectives, and unique compositions.</p>

      <h2>Conclusion</h2>
      <p>Wedding photography combines technical skill with emotional storytelling. Practice these tips to create stunning albums couples will treasure forever!</p>
    `
  },
  {
    id: 2,
    slug: 'pre-wedding-shoot-locations',
    title: 'Choosing the Right Location for Pre-Wedding Shoots',
    excerpt: 'Learn how to select stunning backdrops that complement your love story and personality.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
    author: 'Neha Sharma',
    authorImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    date: 'September 25, 2025',
    readTime: '4 min read',
    category: 'Pre-Wedding',
    tags: ['Pre-Wedding', 'Locations', 'Outdoor'],
    content: `
      <h2>Why Location Matters</h2>
      <p>The location of your pre-wedding shoot sets the tone for your entire photo story. It should reflect your personality as a couple.</p>

      <h2>Urban vs. Natural Settings</h2>
      <p>Urban locations offer modern architecture and city energy. Natural settings provide romantic landscapes and serene atmospheres.</p>

      <h2>Popular Locations</h2>
      <ul>
        <li><strong>Beaches:</strong> Romantic sunsets and ocean waves</li>
        <li><strong>Mountains:</strong> Dramatic vistas</li>
        <li><strong>Heritage Sites:</strong> Timeless architecture</li>
        <li><strong>Gardens:</strong> Colorful blooms</li>
      </ul>

      <h2>Final Tips</h2>
      <p>Choose locations meaningful to you. Whether it's where you first met or your favorite cafe, personal connections make photos special!</p>
    `
  },
  {
    id: 3,
    slug: 'art-of-maternity-photography',
    title: 'The Art of Maternity Photography',
    excerpt: 'Explore techniques for capturing the beauty and emotion of motherhood in elegant portraits.',
    image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=800',
    author: 'Raj Nair',
    authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    date: 'September 20, 2025',
    readTime: '6 min read',
    category: 'Maternity',
    tags: ['Maternity', 'Portrait', 'Studio'],
    content: `
      <h2>Celebrating Motherhood</h2>
      <p>Maternity photography celebrates the journey of pregnancy, creating memories cherished for generations.</p>

      <h2>Best Timing</h2>
      <p>The ideal time is between 28-36 weeks when the baby bump is beautifully prominent.</p>

      <h2>Lighting Techniques</h2>
      <p>Soft, diffused lighting is key. Window light works wonderfully for natural, glowing looks.</p>

      <h2>Posing Tips</h2>
      <p>Focus on poses emphasizing the baby bump. Side profiles, hands cradling belly, and partner shots work beautifully.</p>

      <h2>Conclusion</h2>
      <p>Maternity photography celebrates life, love, and anticipation. Approach with sensitivity and creativity!</p>
    `
  }
]

const Blog = ({ onPostClick }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()
  const [selectedCategory, setSelectedCategory] = useState('All')

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const categories = ['All', ...new Set(blogPosts.map(post => post.category))]

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  return (
    <section id="blog" className="relative py-12 md:py-20 bg-gradient-to-br from-cream via-white to-lightGrey overflow-hidden" ref={ref}>
      {/* Decorative Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-gold rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
          }}
          className="text-center mb-10 md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-gold/10 rounded-full"
          >
            ✨ Our Blog
          </motion.span>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal mb-4 sm:mb-6 px-4">
            Latest from{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-gold via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Our Studio
              </span>
              <motion.div
                animate={{
                  scaleX: [0, 1, 1],
                  opacity: [0, 1, 1]
                }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-2 sm:h-4 bg-gold/20"
              />
            </span>
          </h2>
          
          <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Photography tips, behind-the-scenes stories, and inspiration for your next shoot
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }
          }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 md:mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 rounded-full font-semibold transition-all text-sm sm:text-base ${
                selectedCategory === category
                  ? 'bg-gold text-white shadow-lg'
                  : 'bg-white text-charcoal hover:bg-gold/10'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={`${post.id}-${selectedCategory}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
              onClick={() => onPostClick && onPostClick(post)}
              className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Featured Image */}
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gold text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                  {post.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  <div className="flex items-center gap-1">
                    <FaUser className="text-gold text-xs" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="text-gold text-xs" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-playfair font-bold text-charcoal mb-2 sm:mb-3 hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">{post.excerpt}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {post.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-xs bg-gold/10 text-gold px-2 sm:px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Read More */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200">
                  <span className="text-xs sm:text-sm text-gray-500">{post.date}</span>
                  <div className="flex items-center gap-1 sm:gap-2 text-gold font-semibold text-sm sm:text-base hover:gap-2 sm:hover:gap-3 transition-all">
                    Read More
                    <FaArrowRight className="text-xs sm:text-sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <p className="text-xl sm:text-2xl text-gray-500">No posts found in this category</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Blog
