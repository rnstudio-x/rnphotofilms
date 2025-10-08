import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaInstagram, FaFacebook, FaWhatsapp, FaPaperPlane, FaCheckCircle } from 'react-icons/fa'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000)
    }, 2000)
  }

  const contactInfo = [
    {
      icon: <FaPhone />,
      title: 'Call Us',
      details: ['+91 82393 72489', '+91 78287 20365'],
      color: 'from-green-500 to-emerald-600',
      link: 'tel:+918239372489'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email Us',
      details: ['rbaria736@gmail.com', 'rnstudio.x@gmail.com'],
      color: 'from-blue-500 to-cyan-600',
      link: 'mailto:rbaria736@gmail.com'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Visit Us',
      details: ['Church Gali, Thandla', 'Jhabua, MP 457777'],
      color: 'from-red-500 to-orange-600',
      link: 'https://maps.google.com/?q=Church+Gali+Thandla+Jhabua'
    }
  ]

  const socialLinks = [
    { icon: <FaInstagram />, name: 'Instagram', url: 'https://instagram.com/rn.photo.films', color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500' },
    { icon: <FaFacebook />, name: 'Facebook', url: '#', color: 'bg-blue-600' },
    { icon: <FaWhatsapp />, name: 'WhatsApp', url: 'https://wa.me/918239372489', color: 'bg-green-500' }
  ]

  return (
    <section id="contact" className="relative py-16 md:py-20 bg-gradient-to-br from-cream via-white to-lightGrey overflow-hidden" ref={ref}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 180, 360],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gold rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [360, 180, 0],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{ duration: 30, repeat: Infinity }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-block text-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3 sm:mb-4 px-4 sm:px-6 py-1.5 sm:py-2 bg-gold/10 rounded-full"
          >
            ✨ Get In Touch
          </motion.span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-charcoal mb-4 sm:mb-6">
            Let's Create{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-gold via-amber-500 to-orange-500 bg-clip-text text-transparent">
                Magic Together
              </span>
              <motion.div
                animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 1] }}
                transition={{ duration: 1, delay: 0.5 }}
                className="absolute bottom-1 sm:bottom-2 left-0 right-0 h-2 sm:h-4 bg-gold/20"
              />
            </span>
          </h2>

          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-7xl mx-auto">
          
          {/* Left Side - Contact Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.3 } }
            }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal mb-6">
              Reach Out Through
            </h3>

            {/* Contact Info Cards */}
            {contactInfo.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={controls}
                variants={{
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 + index * 0.1 } }
                }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="block bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gold/10"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xl shadow-lg`}
                  >
                    {item.icon}
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-bold text-charcoal mb-1">{item.title}</h4>
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}

            {/* Social Media Links */}
            <div className="pt-6">
              <h4 className="text-lg font-bold text-charcoal mb-4">Connect With Us</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-full ${social.color} flex items-center justify-center text-white text-xl shadow-lg hover:shadow-2xl transition-all`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Map Embed */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, scale: 1, transition: { duration: 0.6, delay: 0.7 } }
              }}
              className="rounded-2xl overflow-hidden shadow-xl border-4 border-gold/20 h-64"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.3263955302664!2d74.5811578!3d23.011785000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39613fb059c6fa65%3A0x1baf7defdb7dee00!2sRN%20Studio!5e0!3m2!1sen!2sin!4v1759750119769!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RN PhotoFilms Location"
              />
            </motion.div>
          </motion.div>

          {/* Right Side - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={controls}
            variants={{
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.4 } }
            }}
          >
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border border-gold/20">
              <h3 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal mb-6">
                Send Us a Message
              </h3>

              {/* Success Message */}
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
                >
                  <FaCheckCircle className="text-green-500 text-2xl" />
                  <div>
                    <p className="text-green-700 font-semibold">Message Sent Successfully!</p>
                    <p className="text-green-600 text-sm">We'll get back to you soon.</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-charcoal mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gold focus:outline-none transition-all bg-white/50 backdrop-blur-sm"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-charcoal mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gold focus:outline-none transition-all bg-white/50 backdrop-blur-sm"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-charcoal mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gold focus:outline-none transition-all bg-white/50 backdrop-blur-sm"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-charcoal mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gold focus:outline-none transition-all resize-none bg-white/50 backdrop-blur-sm"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-gold via-amber-500 to-orange-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
