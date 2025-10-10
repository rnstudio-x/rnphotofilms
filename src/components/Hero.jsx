import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BookingForm from './BookingForm'

const TypewriterMorphHero = () => {
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  const categories = [
    { 
      name: 'Weddings',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920',
      href: '#portfolio'
    },
    { 
      name: 'Events',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920',
      href: '#portfolio'
    },
    { 
      name: 'Love Stories',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920',
      href: '#portfolio'
    },
    { 
      name: 'Maternity',
      image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=1920',
      href: '#portfolio'
    },
    { 
      name: 'Memories',
      image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=1920',
      href: '#portfolio'
    },
  ]

  // Typewriter effect
  useEffect(() => {
    if (charIndex < categories[textIndex].name.length) {
      const timeout = setTimeout(() => {
        setCharIndex(charIndex + 1)
      }, 100)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCharIndex(0)
        setTextIndex((textIndex + 1) % categories.length)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [charIndex, textIndex])

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* ADD PADDING TOP FOR NAVBAR - THIS IS THE FIX */}
      <div className="pt-24 md:pt-28 min-h-screen flex flex-col">
        
        {/* Morphing Backgrounds */}
        <AnimatePresence mode="wait">
          <motion.div
            key={textIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${categories[textIndex].image}')` }}
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>

        {/* Main Content Container */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
          
          {/* Top Section - Brand */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8 md:mb-12"
          >
            <motion.h1 
              className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-4"
              style={{ textShadow: '0 10px 30px rgba(0,0,0,0.7)' }}
            >
              RN PhotoFilms
            </motion.h1>
            <motion.p 
              className="text-xl md:text-3xl font-lora italic text-gold"
              style={{ textShadow: '0 5px 15px rgba(0,0,0,0.5)' }}
            >
              Your Emotions, Our Lens
            </motion.p>
          </motion.div>

          {/* Middle Section - Typewriter */}
          <div className="mb-8 md:mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-2xl text-white/80 mb-4 tracking-widest"
            >
              WE CAPTURE
            </motion.div>
            
            <div className="h-24 md:h-40 flex items-center justify-center">
              <motion.h2
                key={textIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl md:text-8xl lg:text-9xl font-playfair font-bold"
                style={{
                  background: 'linear-gradient(135deg, #fff 0%, #D4A574 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 40px rgba(212, 165, 116, 0.5)',
                }}
              >
                {categories[textIndex].name.substring(0, charIndex)}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-1 md:w-2 h-16 md:h-28 bg-gold ml-2 align-middle"
                />
              </motion.h2>
            </div>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-8 md:mb-12"
          >
            <motion.a
              href="#portfolio"
              whileHover={{ 
                scale: 1.08, 
                boxShadow: '0 20px 40px rgba(212, 165, 116, 0.6)',
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative bg-gold text-white px-8 md:px-12 py-4 rounded-full text-base md:text-lg font-semibold shadow-2xl overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Portfolio
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-200%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.a>

            <motion.a
             onClick={() => setIsBookingOpen(true)}
              whileHover={{ 
                scale: 1.08,
                backgroundColor: 'rgba(255,255,255,1)',
                color: '#2C2C2C',
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-white text-white px-8 md:px-12 py-4 rounded-full text-base md:text-lg font-semibold backdrop-blur-sm transition-all shadow-2xl"
            >
              Book a Session
            </motion.a>
          </motion.div>

          {/* Category Pills - ACCESSIBLE & VISIBLE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="w-full max-w-4xl"
          >
            <motion.p 
              className="text-white/70 text-sm md:text-base mb-4 tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
            >
              EXPLORE OUR WORK
            </motion.p>
            
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              {categories.map((cat, i) => (
                <motion.a
                  key={cat.name}
                  href={cat.href}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 + i * 0.1, type: 'spring' }}
                  whileHover={{ 
                    scale: 1.15, 
                    backgroundColor: '#D4A574',
                    borderColor: '#D4A574',
                    y: -3
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 md:px-7 py-2 md:py-3 bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-full text-white text-sm md:text-base font-medium cursor-pointer transition-all hover:shadow-2xl"
                >
                  {cat.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="relative z-10 pb-8 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-white/60 text-xs tracking-widest">SCROLL</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-gold rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Floating Elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-32 left-10 w-32 h-32 bg-gold/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [0, -10, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-32 right-10 w-40 h-40 bg-teal/20 rounded-full blur-3xl"
      />
            <BookingForm 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </section>
    
  )
}

export default TypewriterMorphHero
