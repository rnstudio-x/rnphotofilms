import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { FaCamera, FaVideo, FaHeart, FaBaby, FaBriefcase, FaTshirt } from 'react-icons/fa'

const Services = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const services = [
    {
      icon: <FaHeart />,
      title: 'Wedding Photography',
      description: 'Comprehensive coverage of your special day with candid moments, rituals, and celebrations.',
      price: 'Starting at ₹50,000',
      features: ['Full-day coverage', 'Pre-wedding shoot', '500+ edited photos', 'Printed album']
    },
    {
      icon: <FaCamera />,
      title: 'Pre-Wedding Shoot',
      description: 'Romantic outdoor and studio sessions capturing your love story before the big day.',
      price: 'Starting at ₹25,000',
      features: ['Multiple locations', '6-hour shoot', '200+ edited photos', 'Cinematic video']
    },
    {
      icon: <FaVideo />,
      title: 'Event Photography',
      description: 'Professional coverage for corporate events, birthdays, festivals, and celebrations.',
      price: 'Starting at ₹15,000',
      features: ['Full event coverage', 'Same-day highlights', '300+ photos', 'Video highlights']
    },
    {
      icon: <FaBaby />,
      title: 'Maternity & Newborn',
      description: 'Gentle and artistic photography celebrating motherhood and precious newborn moments.',
      price: 'Starting at ₹12,000',
      features: ['Studio session', 'Props included', '100+ edited photos', 'Custom album']
    },
    {
      icon: <FaBriefcase />,
      title: 'Corporate Photography',
      description: 'Professional headshots, team photos, and event coverage for businesses.',
      price: 'Starting at ₹10,000',
      features: ['On-location shoot', 'Quick turnaround', '50+ edited photos', 'High-res files']
    },
    {
      icon: <FaTshirt />,
      title: 'Fashion Photography',
      description: 'Editorial and commercial fashion shoots for portfolios, brands, and magazines.',
      price: 'Starting at ₹20,000',
      features: ['Creative direction', 'Studio/outdoor', '150+ edited photos', 'Retouching']
    },
  ]

  return (
    <section id="services" className="py-20 bg-lightGrey" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-playfair font-bold text-charcoal mb-4">
            Our Services
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tailored photography packages designed to capture every special moment with elegance and creativity.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.1 } },
              }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all"
            >
              <div className="text-5xl text-gold mb-4">{service.icon}</div>
              <h3 className="text-2xl font-playfair font-semibold text-charcoal mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <p className="text-xl font-bold text-navy mb-4">{service.price}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="text-gold mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <motion.a
                href="#booking"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="block text-center bg-gold text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
              >
                Book Now
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
