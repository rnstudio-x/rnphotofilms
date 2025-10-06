import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { FaCamera, FaHeart, FaAward, FaUsers } from 'react-icons/fa'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const stats = [
    { icon: <FaUsers />, number: '500+', label: 'Happy Clients', color: 'text-gold' },
    { icon: <FaCamera />, number: '1000+', label: 'Events Covered', color: 'text-teal' },
    { icon: <FaHeart />, number: '10+', label: 'Years Experience', color: 'text-gold' },
    { icon: <FaAward />, number: '50+', label: 'Awards Won', color: 'text-teal' },
  ]

  return (
    <section id="about" className="relative py-24 md:py-32 bg-cream overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gold text-sm font-semibold tracking-widest uppercase mb-4 block"
          >
            Our Story
          </motion.span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-charcoal mb-6">
            About Us
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={controls}
            variants={{
              visible: { width: '100px', transition: { duration: 0.8, delay: 0.4 } }
            }}
            className="h-1 bg-gold mx-auto"
          />
        </motion.div>

        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left: Image Grid */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: -80 },
              visible: { opacity: 1, x: 0, transition: { duration: 1, delay: 0.3 } },
            }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Large Image */}
              <motion.div 
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="col-span-2 relative overflow-hidden rounded-2xl shadow-2xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80"
                  alt="Photography Team"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </motion.div>

              {/* Small Images */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-2xl shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&q=80"
                  alt="Behind the scenes"
                  className="w-full h-48 object-cover"
                />
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-2xl shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80"
                  alt="Equipment"
                  className="w-full h-48 object-cover"
                />
              </motion.div>
            </div>

            {/* Floating Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={controls}
              variants={{
                visible: { scale: 1, rotate: 0, transition: { duration: 0.8, delay: 0.8 } }
              }}
              className="absolute -top-6 -right-6 bg-gold text-white w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-2xl"
            >
              <span className="text-3xl font-bold">10+</span>
              <span className="text-xs font-semibold">Years</span>
            </motion.div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: 80 },
              visible: { opacity: 1, x: 0, transition: { duration: 1, delay: 0.5 } },
            }}
          >
            <h3 className="text-3xl md:text-4xl font-playfair font-semibold text-charcoal mb-6 leading-tight">
              Capturing Life's<br/>
              <span className="text-gold">Precious Moments</span>
            </h3>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                At <strong className="text-charcoal">RN PhotoFilms</strong>, we believe every moment tells a unique story. 
                With over a decade of experience in wedding, event, and lifestyle photography, our passionate 
                team transforms fleeting emotions into timeless visual narratives.
              </p>

              <p>
                Our approach combines <span className="text-gold font-semibold">artistic vision</span> with technical 
                excellence, ensuring each frame reflects authenticity, elegance, and the unique essence of your 
                celebration. From intimate pre-wedding shoots to grand wedding ceremonies, we're dedicated to 
                preserving your most cherished memories.
              </p>

              <p className="text-gray-600 italic border-l-4 border-gold pl-6 py-2">
                "Photography is the art of frozen time... the ability to store emotion and feelings within a frame." 
                - Meshack Otieno
              </p>
            </div>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, x: 10 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 mt-8 bg-gold text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-2xl transition-all group"
            >
              Get in Touch
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } },
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { delay: 1 + index * 0.1 } }
              }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className={`text-5xl ${stat.color} mb-4 flex justify-center`}>
                {stat.icon}
              </div>
              <h4 className="text-4xl font-bold text-charcoal mb-2">{stat.number}</h4>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default About
