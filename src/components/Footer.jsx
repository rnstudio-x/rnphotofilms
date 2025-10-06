import React from 'react'
import { FaHeart, FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-charcoal text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-2xl font-playfair font-bold mb-4">RN PhotoFilms</h3>
            <p className="text-gray-400 mb-4 italic">Your Emotions, Our Lens</p>
            <p className="text-gray-400">
              Capturing life's precious moments with elegance, artistry, and timeless beauty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-gold transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-gold transition-colors">About Us</a></li>
              <li><a href="#portfolio" className="text-gray-400 hover:text-gold transition-colors">Portfolio</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-gold transition-colors">Services</a></li>
              <li><a href="#blog" className="text-gray-400 hover:text-gold transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-gray-400 hover:text-gold transition-colors">Wedding Photography</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-gold transition-colors">Pre-Wedding Shoots</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-gold transition-colors">Event Photography</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-gold transition-colors">Maternity & Newborn</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-gold transition-colors">Corporate Photography</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Church Gali, Thandla</li>
              <li>Jhabua, Madhya Pradesh 457777</li>
              <li>+91 82393 72489</li>
              <li>rnstudio.x@gmail.com</li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="bg-gold text-white p-2 rounded-full hover:bg-opacity-90 transition-all">
                <FaFacebookF />
              </a>
              <a href="#" className="bg-gold text-white p-2 rounded-full hover:bg-opacity-90 transition-all">
                <FaInstagram />
              </a>
              <a href="#" className="bg-gold text-white p-2 rounded-full hover:bg-opacity-90 transition-all">
                <FaTwitter />
              </a>
              <a href="#" className="bg-gold text-white p-2 rounded-full hover:bg-opacity-90 transition-all">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 RN PhotoFilms. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            Made with <FaHeart className="text-gold" /> for beautiful memories
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
