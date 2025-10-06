import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion'
import Masonry from 'react-masonry-css'
import Lightbox from './Lightbox'

const Portfolio = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()
  const [activeCategory, setActiveCategory] = useState('All')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const categories = ['All', 'Weddings', 'Pre-Weddings', 'Events', 'Maternity', 'Corporate', 'Fashion']

  // Sample portfolio images (replace with your actual images)
  const portfolioItems = [
    { id: 1, category: 'Weddings', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600', title: 'Wedding Ceremony' },
    { id: 2, category: 'Pre-Weddings', image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600', title: 'Love Story' },
    { id: 3, category: 'Events', image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600', title: 'Corporate Event' },
    { id: 4, category: 'Maternity', image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=600', title: 'Maternity Shoot' },
    { id: 5, category: 'Corporate', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600', title: 'Business Portrait' },
    { id: 6, category: 'Fashion', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600', title: 'Fashion Editorial' },
    { id: 7, category: 'Weddings', image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600', title: 'Bride Portrait' },
    { id: 8, category: 'Pre-Weddings', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600', title: 'Couple Shoot' },
    { id: 9, category: 'Events', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600', title: 'Party Photography' },
    { id: 10, category: 'Weddings', image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600', title: 'Reception' },
    { id: 11, category: 'Fashion', image: 'https://images.unsplash.com/photo-1558769132-cb1aea398f70?w=600', title: 'Model Portfolio' },
    { id: 12, category: 'Corporate', image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600', title: 'Team Photo' },
  ]

  // Filter items based on active category
  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1
  }

  const openLightbox = (index) => {
    setCurrentImage(index)
    setLightboxOpen(true)
  }

  // Handle category change with animation
  const handleCategoryChange = (category) => {
    setActiveCategory(category)
  }

  return (
    <section id="portfolio" className="py-20 bg-white" ref={ref}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gold text-sm font-semibold tracking-widest uppercase mb-4 block"
          >
            Our Work
          </motion.span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-charcoal mb-6">
            Our Portfolio
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={controls}
            variants={{
              visible: { width: '100px', transition: { duration: 0.8, delay: 0.4 } }
            }}
            className="h-1 bg-gold mx-auto mb-6"
          />
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of captured emotions and timeless memories across various genres.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8, delay: 0.2 } },
          }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              onClick={() => handleCategoryChange(category)}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-medium transition-all shadow-md ${
                activeCategory === category
                  ? 'bg-gold text-white shadow-lg scale-105'
                  : 'bg-lightGrey text-charcoal hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Active Category Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-gray-600"
            >
              Showing <span className="font-semibold text-gold">{filteredItems.length}</span> {activeCategory === 'All' ? 'images' : `${activeCategory} images`}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Masonry Gallery */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8, delay: 0.4 } },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Masonry
                breakpointCols={breakpointColumns}
                className="flex gap-6 -ml-6"
                columnClassName="pl-6 bg-clip-padding"
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, zIndex: 10 }}
                    onClick={() => openLightbox(index)}
                    className="mb-6 cursor-pointer overflow-hidden rounded-lg shadow-lg group relative"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-6">
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-white text-xl font-playfair font-semibold mb-2"
                      >
                        {item.title}
                      </motion.p>
                      <motion.span
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gold text-sm font-medium"
                      >
                        {item.category}
                      </motion.span>
                    </div>
                    {/* Corner Badge */}
                    <div className="absolute top-4 right-4 bg-gold text-white px-3 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      View
                    </div>
                  </motion.div>
                ))}
              </Masonry>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-gray-500 text-xl">No images found in this category.</p>
          </motion.div>
        )}

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } }
          }}
          className="text-center mt-12"
        >
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(212, 165, 116, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gold text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-opacity-90 transition-all"
          >
            Want to see more? Contact Us
          </motion.a>
        </motion.div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={filteredItems.map(item => item.image)}
          currentIndex={currentImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  )
}

export default Portfolio
