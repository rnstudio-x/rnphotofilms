import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView, useAnimation, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { FaCamera, FaVideo, FaHeart, FaBaby, FaBriefcase, FaTshirt, FaRing, FaCheckCircle, FaStar, FaCrown, FaFire, FaGem, FaChevronLeft, FaChevronRight, FaPause, FaPlay, FaTimes } from 'react-icons/fa'

const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()
  const [activeService, setActiveService] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showPackages, setShowPackages] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const autoRotateRef = useRef(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  // Auto-rotate services (paused on mobile for better control)
  useEffect(() => {
    if (!isPaused && !showPackages && !isMobile) {
      autoRotateRef.current = setInterval(() => {
        setActiveService((prev) => (prev + 1) % services.length)
      }, 4000)
    }
    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current)
      }
    }
  }, [isPaused, showPackages, isMobile])

  const services = [
    {
      id: 1,
      icon: <FaRing />,
      title: 'Wedding Photography',
      tagline: 'Your Love Story, Forever Captured',
      description: 'Cinematic wedding coverage that tells your unique love story',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      bgColor: 'bg-pink-50',
      packages: [
        {
          name: 'Bronze',
          price: '₹17,999',
          duration: '6 Hours',
          emoji: '🥉',
          features: [
            'Traditional Photography',
            'Unlimited Softcopies',
            'Traditional FHD Video (3-4M)',
            'One Pendrive',
          ],
          savings: '15% OFF'
        },
        {
          name: 'Silver',
          price: '₹34,999',
          duration: '8 Hours',
          emoji: '🥈',
          popular: true,
          features: [
            'Traditional Photography',
            'Unlimited Softcopies',
            'Traditional FHD Video (3-4M)',
            'One Photobook Album (30 pages)',
            'One Mini Book',
            'One Calander',
            'One Pendrive',
          ],
          savings: '20% OFF'
        },
        {
          name: 'Gold',
          price: '₹49,999',
          duration: 'Full Day',
          emoji: '🥇',
          features: [
            'Traditional Photography',
            'Unlimited Softcopies',
            'Traditional FHD Video (3-4M)',
            'Candid Photography with Light Setup',
            'One Photobook Album (30 pages)',
            'One Mini Book',
            'One Calander',
            'One Pendrive',
          ],
          savings: 'Best Value'
        },
      ]
    },
    {
      id: 2,
      icon: <FaHeart />,
      title: 'Pre-Wedding Shoot',
      tagline: 'Before The Big Day Magic',
      description: 'Romantic outdoor sessions capturing your chemistry',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      bgColor: 'bg-purple-50',
      packages: [
        {
          name: 'Basic',
          price: '₹14,999',
          duration: '4 Hours',
          emoji: '📸',
          features: [
            '1 Location',
            '150+ Edited Photos',
            'Unlimited Softcopies',
            '1 Costume Change',
            'Online Gallery',
          ]
        },
        {
          name: 'Premium',
          price: '₹25,000',
          duration: '6 Hours',
          emoji: '🎬',
          popular: true,
          features: [
            '2-3 Locations',
            '300+ Edited Photos',
            'Cinematic Video Shoot',
            '2 Costume Changes',
            'Printed Album',
            'Same Day Edit',
          ]
        },
        {
          name: 'Luxury',
          price: '₹40,000',
          duration: 'Full Day',
          emoji: '⭐',
          features: [
            'Multiple Locations',
            '500+ Edited Photos',
            '4K Cinematic Video',
            'Unlimited Costumes',
            'Drone Shots',
            'Premium Album',
            'Save The Date Video',
          ]
        },
      ]
    },
    {
      id: 3,
      icon: <FaVideo />,
      title: 'Event Photography',
      tagline: 'Every Celebration Deserves Excellence',
      description: 'Professional coverage for birthdays, festivals & celebrations',
      image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgColor: 'bg-blue-50',
      packages: [
        {
          name: 'Essential',
          price: '₹12,000',
          duration: '3 Hours',
          emoji: '🎉',
          features: [
            '200+ Photos',
            'Basic Editing',
            'Online Gallery',
            'Quick Delivery'
          ]
        },
        {
          name: 'Professional',
          price: '₹20,000',
          duration: '6 Hours',
          emoji: '🎊',
          popular: true,
          features: [
            '400+ Photos',
            'Video Highlights',
            'Premium Editing',
            'Printed Album',
            'Same Day Sneak Peek'
          ]
        },
        {
          name: 'Premium',
          price: '₹35,000',
          duration: 'Full Event',
          emoji: '🎆',
          features: [
            'Unlimited Photos',
            'Full HD Video',
            'Multiple Photographers',
            'Luxury Album',
            'Live Streaming Option'
          ]
        },
      ]
    },
    {
      id: 4,
      icon: <FaBaby />,
      title: 'Maternity & Newborn',
      tagline: 'Celebrating New Beginnings',
      description: 'Gentle photography celebrating motherhood & baby\'s first moments',
      image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=800',
      gradient: 'from-amber-400 via-yellow-500 to-orange-500',
      bgColor: 'bg-amber-50',
      packages: [
        {
          name: 'Basic',
          price: '₹5,999',
          duration: '1 Hour',
          emoji: '👶',
          features: [
            'Studio Session',
            '10 Edited Pictures',
            'Unlimited Softcopies',
            '1 Maternity Costume',
            'A4 Photo Frame',
          ],
          savings: '15% OFF'
        },
        {
          name: 'Standard',
          price: '₹6,999',
          duration: '2 Hours',
          emoji: '🍼',
          popular: true,
          features: [
            'Studio Session',
            '15 Edited Pictures',
            'Unlimited Softcopies',
            '2 Maternity Costumes',
            'A4 Photo Frame',
          ],
          savings: '20% OFF'
        },
        {
          name: 'Premium',
          price: '₹7,999',
          duration: '3 Hours',
          emoji: '💝',
          features: [
            'Studio Session',
            '19 Edited Pictures',
            'Unlimited Softcopies',
            'All Maternity Costumes',
            'A4 Photo Frame',
            'All Maternity Costume & Gowns',
          ],
          savings: 'Special Offer'
        },
      ]
    },
    {
      id: 5,
      icon: <FaBriefcase />,
      title: 'Corporate Photography',
      tagline: 'Professional Brand Identity',
      description: 'Headshots, team photos & corporate event coverage',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      gradient: 'from-gray-600 via-slate-700 to-zinc-800',
      bgColor: 'bg-gray-50',
      packages: [
        {
          name: 'Headshots',
          price: '₹8,000',
          duration: '2 Hours',
          emoji: '👔',
          features: [
            '20 Team Members',
            'Professional Backdrop',
            'Quick Turnaround',
            'High-res Files'
          ]
        },
        {
          name: 'Event',
          price: '₹18,000',
          duration: '4 Hours',
          emoji: '🏢',
          popular: true,
          features: [
            'Full Coverage',
            '300+ Photos',
            'Video Highlights',
            'Same Day Preview',
            'Branded Watermark'
          ]
        },
        {
          name: 'Complete',
          price: '₹35,000',
          duration: 'Full Day',
          emoji: '💼',
          features: [
            'Headshots + Event',
            'Unlimited Photos',
            '4K Video',
            'Drone Coverage',
            'Dedicated Team'
          ]
        },
      ]
    },
    {
      id: 6,
      icon: <FaTshirt />,
      title: 'Fashion Photography',
      tagline: 'Where Style Meets Art',
      description: 'Editorial shoots for portfolios, brands & magazines',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800',
      gradient: 'from-indigo-500 via-purple-600 to-fuchsia-600',
      bgColor: 'bg-indigo-50',
      packages: [
        {
          name: 'Portfolio',
          price: '₹15,000',
          duration: '3 Hours',
          emoji: '👗',
          features: [
            'Studio Shoot',
            '50+ Edited Photos',
            '3 Outfit Changes',
            'Professional Retouching'
          ]
        },
        {
          name: 'Editorial',
          price: '₹30,000',
          duration: '6 Hours',
          emoji: '📷',
          popular: true,
          features: [
            'Studio + Location',
            '100+ Edited Photos',
            'Unlimited Outfits',
            'Creative Direction',
            'Magazine-Ready'
          ]
        },
        {
          name: 'Campaign',
          price: '₹60,000',
          duration: 'Full Day',
          emoji: '✨',
          features: [
            'Multiple Locations',
            '200+ Photos',
            'Video Content',
            'Art Direction',
            'Full Production Team'
          ]
        },
      ]
    },
  ]

  const handleViewPackages = (index) => {
    setActiveService(index)
    setShowPackages(true)
    setIsPaused(true)
  }

  const handleNextService = () => {
    setActiveService((prev) => (prev + 1) % services.length)
  }

  const handlePrevService = () => {
    setActiveService((prev) => (prev - 1 + services.length) % services.length)
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
  }

  // Swipe handling for mobile
  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50
    if (info.offset.x > swipeThreshold) {
      handlePrevService()
    } else if (info.offset.x < -swipeThreshold) {
      handleNextService()
    }
  }

  return (
    <section id="services" className="relative py-16 md:py-24 bg-gradient-to-br from-cream via-white to-lightGrey overflow-hidden" ref={ref}>
      {/* Animated Background */}
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
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 35, repeat: Infinity }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal rounded-full blur-3xl"
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
          className="text-center mb-12 md:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-gold/10 rounded-full"
          >
            ✨ Our Services & Packages
          </motion.span>
          
          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-charcoal mb-4 sm:mb-6 px-4">
            Crafted{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-gold via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Experiences
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
            Award-winning photography packages designed to capture every emotion, every moment, every memory.
          </p>
        </motion.div>

        {/* Mobile-First: Swipeable Card Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, transition: { duration: 0.6, delay: 0.3 } }
          }}
          className="mb-12 md:mb-16"
        >
          {/* MOBILE VIEW: Swipeable Single Card */}
          <div className="md:hidden">
            <motion.div
              key={activeService}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-sm touch-pan-y"
            >
              <div
                onClick={() => handleViewPackages(activeService)}
                className="relative w-full h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-gold cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={services[activeService].image}
                  alt={services[activeService].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${services[activeService].gradient} opacity-70`}></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <motion.div
                    className="text-5xl mb-3"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {services[activeService].icon}
                  </motion.div>
                  <h3 className="text-2xl font-playfair font-bold mb-1">
                    {services[activeService].title}
                  </h3>
                  <p className="text-sm italic opacity-90 mb-4">{services[activeService].tagline}</p>
                  <p className="text-xs opacity-80">{services[activeService].description}</p>
                </div>

                {/* Swipe Hint */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-semibold flex items-center gap-2">
                  👈 Swipe 👉
                </div>

                {/* Active Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 bg-gold text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                >
                  <FaFire /> Active
                </motion.div>
              </div>
            </motion.div>

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveService(index)}
                  className={`transition-all duration-300 rounded-full ${
                    activeService === index
                      ? 'w-8 h-2 bg-gold'
                      : 'w-2 h-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Mobile Action Buttons */}
            <div className="flex gap-3 mt-6 px-4">
              <motion.button
                onClick={handlePrevService}
                whileTap={{ scale: 0.9 }}
                className="flex-1 bg-white text-charcoal py-3 px-4 rounded-xl shadow-lg font-semibold flex items-center justify-center gap-2"
              >
                <FaChevronLeft /> Prev
              </motion.button>
              <motion.button
                onClick={() => handleViewPackages(activeService)}
                whileTap={{ scale: 0.9 }}
                className="flex-1 bg-gradient-to-r from-gold to-amber-600 text-white py-3 px-4 rounded-xl shadow-lg font-semibold"
              >
                View Packages
              </motion.button>
              <motion.button
                onClick={handleNextService}
                whileTap={{ scale: 0.9 }}
                className="flex-1 bg-white text-charcoal py-3 px-4 rounded-xl shadow-lg font-semibold flex items-center justify-center gap-2"
              >
                Next <FaChevronRight />
              </motion.button>
            </div>
          </div>

          {/* DESKTOP VIEW: Stack Carousel (Existing Design) */}
          <div className="hidden md:block">
            <div className="relative h-[500px] flex items-center justify-center mb-12" style={{ perspective: '2000px' }}>
              {services.map((service, index) => {
                const diff = index - activeService
                const totalCards = services.length
                
                let position = {
                  x: 0,
                  z: 0,
                  scale: 1,
                  opacity: 1,
                  rotateY: 0,
                }

                if (diff === 0) {
                  position = { x: 0, z: 0, scale: 1, opacity: 1, rotateY: 0 }
                } else if (diff > 0 || diff < -totalCards / 2) {
                  const pos = diff > 0 ? diff : totalCards + diff
                  position = {
                    x: 40 + pos * 15,
                    z: -100 * pos,
                    scale: 1 - pos * 0.1,
                    opacity: Math.max(0.3, 1 - pos * 0.2),
                    rotateY: -10 - pos * 5,
                  }
                } else {
                  const pos = Math.abs(diff)
                  position = {
                    x: -40 - pos * 15,
                    z: -100 * pos,
                    scale: 1 - pos * 0.1,
                    opacity: Math.max(0.3, 1 - pos * 0.2),
                    rotateY: 10 + pos * 5,
                  }
                }
                
                return (
                  <motion.div
                    key={service.id}
                    animate={{
                      x: `${position.x}%`,
                      z: position.z,
                      scale: position.scale,
                      opacity: position.opacity,
                      rotateY: position.rotateY,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 20,
                      duration: 0.8,
                    }}
                    onClick={() => handleViewPackages(index)}
                    className="absolute cursor-pointer"
                    style={{
                      transformStyle: 'preserve-3d',
                      zIndex: index === activeService ? 50 : 40 - Math.abs(index - activeService),
                    }}
                  >
                    <div className={`w-80 h-96 rounded-3xl overflow-hidden shadow-2xl border-4 transition-all duration-500 ${
                      activeService === index ? 'border-gold' : 'border-white/50'
                    }`}>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-70`}></div>
                      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                        <motion.div
                          className="text-5xl mb-3"
                          animate={{
                            scale: activeService === index ? [1, 1.2, 1] : 1,
                            rotate: activeService === index ? [0, 360] : 0
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          {service.icon}
                        </motion.div>
                        <h3 className="text-2xl font-playfair font-bold mb-1">
                          {service.title}
                        </h3>
                        <p className="text-sm italic opacity-90">{service.tagline}</p>
                      </div>
                      {activeService === index && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 bg-gold text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
                        >
                          <FaFire /> Active
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Desktop Controls */}
            <div className="flex items-center justify-center gap-6">
              <motion.button
                onClick={handlePrevService}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white text-charcoal p-4 rounded-full shadow-xl hover:bg-gold hover:text-white transition-all"
              >
                <FaChevronLeft className="text-xl" />
              </motion.button>

              <motion.button
                onClick={togglePause}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-gold text-white px-6 py-3 rounded-full shadow-xl hover:bg-amber-600 transition-all font-semibold flex items-center gap-2"
              >
                {isPaused ? (
                  <>
                    <FaPlay /> Resume
                  </>
                ) : (
                  <>
                    <FaPause /> Pause
                  </>
                )}
              </motion.button>

              <motion.button
                onClick={handleNextService}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white text-charcoal p-4 rounded-full shadow-xl hover:bg-gold hover:text-white transition-all"
              >
                <FaChevronRight className="text-xl" />
              </motion.button>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {services.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveService(index)
                    setIsPaused(true)
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    activeService === index
                      ? 'w-12 h-3 bg-gold'
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            {!showPackages && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <motion.button
                  onClick={() => handleViewPackages(activeService)}
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(212, 165, 116, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-gold via-amber-500 to-orange-500 text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl"
                >
                  Explore Packages 📦
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Packages Display - Mobile First Responsive */}
        <AnimatePresence>
          {showPackages && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="mb-12 md:mb-16"
            >
              {/* Service Details Header - Mobile Optimized */}
              <div className={`${services[activeService].bgColor} rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border-2 border-gold/20 shadow-xl relative`}>
                {/* Close Button - Mobile */}
                <button
                  onClick={() => setShowPackages(false)}
                  className="absolute top-4 right-4 md:hidden bg-white text-charcoal p-2 rounded-full shadow-lg"
                >
                  <FaTimes />
                </button>

                <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className={`text-5xl sm:text-6xl md:text-7xl bg-gradient-to-br ${services[activeService].gradient} bg-clip-text text-transparent`}
                  >
                    {services[activeService].icon}
                  </motion.div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-charcoal mb-2 sm:mb-3">
                      {services[activeService].title}
                    </h3>
                    <p className="text-base sm:text-lg md:text-xl text-gold font-semibold mb-1 sm:mb-2">
                      {services[activeService].tagline}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-600">
                      {services[activeService].description}
                    </p>
                  </div>
                  
                  {/* Change Service Button - Desktop */}
                  <motion.button
                    onClick={() => setShowPackages(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="hidden md:block bg-white text-charcoal px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gold hover:text-white transition-all whitespace-nowrap"
                  >
                    Change Service
                  </motion.button>
                </div>
              </div>

              {/* Pricing Cards - Mobile First Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {services[activeService].packages.map((pkg, pkgIndex) => (
                  <motion.div
                    key={`${activeService}-${pkgIndex}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: pkgIndex * 0.15, duration: 0.5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPackage(`${activeService}-${pkgIndex}`)}
                    className={`relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 ${
                      pkg.popular
                        ? 'bg-gradient-to-br from-gold via-amber-500 to-orange-500 sm:scale-105 shadow-2xl'
                        : 'bg-white shadow-xl'
                    } ${
                      selectedPackage === `${activeService}-${pkgIndex}`
                        ? 'ring-4 ring-gold'
                        : ''
                    }`}
                  >
                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-3 -right-3 z-20">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          className="bg-white text-gold w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-2xl font-bold text-xs border-4 border-gold"
                        >
                          <div className="text-center">
                            <FaCrown className="text-xl sm:text-2xl mx-auto mb-1" />
                            <span className="text-xs">POPULAR</span>
                          </div>
                        </motion.div>
                      </div>
                    )}

                    {/* Savings Badge */}
                    {pkg.savings && !pkg.popular && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                        {pkg.savings}
                      </div>
                    )}

                    <div className={`p-6 sm:p-8 ${pkg.popular ? 'text-white' : 'text-charcoal'}`}>
                      {/* Package Header */}
                      <div className="text-center mb-6">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-5xl sm:text-6xl mb-4"
                        >
                          {pkg.emoji}
                        </motion.div>
                        <h4 className={`text-2xl sm:text-3xl font-playfair font-bold mb-2 ${
                          pkg.popular ? 'text-white' : 'text-charcoal'
                        }`}>
                          {pkg.name}
                        </h4>
                        <div className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-1 ${
                          pkg.popular ? 'text-white' : 'bg-gradient-to-r from-gold to-amber-600 bg-clip-text text-transparent'
                        }`}>
                          {pkg.price}
                        </div>
                        <p className={`text-xs sm:text-sm ${pkg.popular ? 'text-white/80' : 'text-gray-500'}`}>
                          {pkg.duration}
                        </p>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                        {pkg.features.map((feature, fIndex) => (
                          <motion.li
                            key={fIndex}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + fIndex * 0.1 }}
                            className={`flex items-start gap-2 sm:gap-3 text-xs sm:text-sm ${
                              pkg.popular ? 'text-white' : 'text-gray-700'
                            }`}
                          >
                            <FaCheckCircle className={`flex-shrink-0 mt-0.5 sm:mt-1 ${
                              pkg.popular ? 'text-white' : 'text-gold'
                            }`} />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <motion.a
                        href="#booking"
                        whileTap={{ scale: 0.95 }}
                        className={`block w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg text-center transition-all ${
                          pkg.popular
                            ? 'bg-white text-gold shadow-xl'
                            : 'bg-gradient-to-r from-gold to-amber-600 text-white shadow-lg'
                        }`}
                      >
                        Book Now →
                      </motion.a>
                    </div>

                    {/* 3D Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Bottom CTA - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-8 sm:mt-12"
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 sm:p-6 inline-block shadow-xl border border-gold/20 mx-4">
                  <p className="text-sm sm:text-base text-gray-700 mb-3">
                    Need a custom package? Let's create something perfect for you!
                  </p>
                  <motion.a
                    href="#contact"
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-amber-600 text-white px-6 sm:px-8 py-3 rounded-full font-semibold shadow-lg text-sm sm:text-base"
                  >
                    <FaGem /> Get Custom Quote
                  </motion.a>
                </div>
              </motion.div>

              {/* Mobile: Change Service Button at Bottom */}
              <div className="md:hidden text-center mt-6">
                <motion.button
                  onClick={() => setShowPackages(false)}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-charcoal px-8 py-3 rounded-full font-semibold shadow-lg"
                >
                  ← Back to Services
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative Film Strip - Hidden on Mobile */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 h-16 bg-charcoal overflow-hidden opacity-10">
        <div className="flex gap-4 h-full items-center animate-marquee">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="w-12 h-8 bg-gold/30 rounded flex-shrink-0"></div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
