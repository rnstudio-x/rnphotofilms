import React, { useState } from 'react'
import { FaHeart, FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLock } from 'react-icons/fa'
import { motion } from 'framer-motion'
import AdminLogin from '../crm/Components/AdminLogin'

const Footer = () => {
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  // Secret click handler - click 5 times on copyright to reveal admin button
  const handleSecretClick = () => {
    setClickCount(prev => prev + 1)
    if (clickCount + 1 >= 5) {
      // Reset after 10 seconds
      setTimeout(() => setClickCount(0), 10000)
    }
  }

  return (
    <>
      <footer className="bg-charcoal text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-playfair font-bold text-gold mb-4">RN PhotoFilms</h3>
              <p className="text-gray-400 text-sm mb-4">
                Your Emotions, Our Lens. Capturing precious moments since 2021.
              </p>
              <div className="flex gap-3">
                <a href="https://facebook.com" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                  <FaFacebookF />
                </a>
                <a href="https://instagram.com/rn.photo.films" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                  <FaInstagram />
                </a>
                <a href="https://twitter.com" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                  <FaTwitter />
                </a>
                <a href="https://youtube.com" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gold transition-colors">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-gold transition-colors text-sm">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-gold transition-colors text-sm">About</a></li>
                <li><a href="#portfolio" className="text-gray-400 hover:text-gold transition-colors text-sm">Portfolio</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-gold transition-colors text-sm">Services</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-gold transition-colors text-sm">Blog</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-gold transition-colors text-sm">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Wedding Photography</li>
                <li>Pre-Wedding Shoots</li>
                <li>Maternity Photography</li>
                <li>Birthday Events</li>
                <li>Corporate Events</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>+91 82393 72489</li>
                <li>+91 78287 20365</li>
                <li>rbaria736@gmail.com</li>
                <li>Church Gali, Thandla</li>
                <li>Jhabua, MP 457777</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p 
              className="text-gray-400 text-sm cursor-pointer select-none"
              onClick={handleSecretClick}
              title={clickCount > 0 ? `${5 - clickCount} more clicks to reveal admin` : ''}
            >
              © {new Date().getFullYear()} RN PhotoFilms. Made with <FaHeart className="inline text-red-500 mx-1" /> by RN Team
            </p>

            {/* Hidden Admin Button - Shows after 5 clicks */}
            {clickCount >= 5 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setShowAdminLogin(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gold/20 border border-gold text-gold rounded-full text-sm font-semibold hover:bg-gold hover:text-charcoal transition-all"
              >
                <FaLock /> Admin Access
              </motion.button>
            )}

            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLogin isOpen={showAdminLogin} onClose={() => setShowAdminLogin(false)} />
    </>
  )
}

export default Footer
