import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaPhone, FaEnvelope } from 'react-icons/fa'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <>
      {/* Top Info Bar - Optional but eye-catching */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: scrolled ? -50 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 w-full bg-charcoal text-white z-50 py-2 text-sm"
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+918239372489" className="flex items-center gap-2 hover:text-gold transition-colors">
              <FaPhone className="text-gold" />
              +91 82393 72489
            </a>
            <a href="mailto:rnstudio.x@gmail.com" className="hidden md:flex items-center gap-2 hover:text-gold transition-colors">
              <FaEnvelope className="text-gold" />
              info@rnphotofilms.com
            </a>
          </div>
          <div className="text-gold font-semibold">
            4+ Years Excellence
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed w-full z-40 transition-all duration-500 ${
          scrolled 
            ? 'top-0 bg-white/95 backdrop-blur-xl shadow-2xl py-3' 
            : 'top-10 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-md py-5'
        }`}
        style={{
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo with Animation */}
            <motion.a
              href="#home"
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <motion.h1
                className={`text-3xl md:text-4xl font-playfair font-bold tracking-wide transition-all duration-300 ${
                  scrolled ? 'text-charcoal' : 'text-white'
                }`}
              >
                RN PhotoFilms
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="h-0.5 bg-gold absolute bottom-0 left-0"
              />
              <p className={`text-xs font-lora italic mt-1 ${
                scrolled ? 'text-gold' : 'text-gold/90'
              }`}>
                Your Emotions, Our Lens
              </p>
            </motion.a>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 group ${
                    scrolled ? 'text-charcoal' : 'text-white'
                  }`}
                >
                  {link.name}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"
                  />
                </motion.a>
              ))}
              
              {/* Book Now Button - Eye-catching */}
              <motion.a
                href="#booking"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: 'spring' }}
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: '0 10px 30px rgba(212, 165, 116, 0.5)',
                  rotate: [0, -5, 5, 0]
                }}
                whileTap={{ scale: 0.95 }}
                className="relative ml-4 bg-gradient-to-r from-gold to-amber-600 text-white px-8 py-3 rounded-full font-semibold text-sm shadow-lg overflow-hidden group"
              >
                <motion.span
                  className="relative z-10 flex items-center gap-2"
                >
                  Book Now
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.span>
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
                />
              </motion.a>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileTap={{ scale: 0.9 }}
              className={`lg:hidden text-2xl transition-colors ${
                scrolled ? 'text-charcoal' : 'text-white'
              }`}
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <FaTimes /> : <FaBars />}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 lg:hidden"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-charcoal text-2xl"
            >
              <FaTimes />
            </button>

            {/* Mobile Menu Content */}
            <div className="flex flex-col h-full pt-20 pb-8 px-8">
              <div className="mb-8">
                <h2 className="text-3xl font-playfair font-bold text-charcoal mb-2">
                  RN PhotoFilms
                </h2>
                <p className="text-gold font-lora italic">Your Emotions, Our Lens</p>
              </div>

              <div className="flex-1 flex flex-col space-y-2">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsOpen(false)}
                    className="text-charcoal font-medium text-lg py-3 px-4 rounded-lg hover:bg-cream hover:text-gold transition-all"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <motion.a
                href="#booking"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onClick={() => setIsOpen(false)}
                className="bg-gold text-white px-8 py-4 rounded-full font-semibold text-center shadow-lg"
              >
                Book Now
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar
