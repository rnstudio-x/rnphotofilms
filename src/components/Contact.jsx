import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <section id="contact" className="py-20 bg-lightGrey" ref={ref}>
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
            Get in Touch
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: -50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.2 } },
            }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-3xl font-playfair font-semibold text-charcoal mb-6">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-8">
                Reach out to us through any of the following channels. We're here to help bring your vision to life.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-gold text-white p-3 rounded-full">
                  <FaPhone />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">Phone</h4>
                  <p className="text-gray-600">+91 82393 72489</p>
                  <p className="text-gray-600">+91 78287 20365</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gold text-white p-3 rounded-full">
                  <FaEnvelope />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">Email</h4>
                  <p className="text-gray-600">rbaria736@gmail.com</p>
                  <p className="text-gray-600">rnstudio.x@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-gold text-white p-3 rounded-full">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">Address</h4>
                  <p className="text-gray-600">Church Gali, Thandla</p>
                  <p className="text-gray-600">Jhabua, Madhya Pradesh 457777</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-500 text-white p-3 rounded-full">
                  <FaWhatsapp />
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal mb-1">WhatsApp</h4>
                  <a href="https://wa.me/918239372489" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h4 className="font-semibold text-charcoal mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className="bg-gold text-white p-3 rounded-full hover:bg-opacity-90 transition-all">
                  <FaFacebookF />
                </a>
                <a href="#" className="bg-gold text-white p-3 rounded-full hover:bg-opacity-90 transition-all">
                  <FaInstagram />
                </a>
                <a href="#" className="bg-gold text-white p-3 rounded-full hover:bg-opacity-90 transition-all">
                  <FaTwitter />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Google Map */}
          <motion.div
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, x: 50 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, delay: 0.4 } },
            }}
            className="rounded-lg overflow-hidden shadow-lg h-[500px]"
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
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
