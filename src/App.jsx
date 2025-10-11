import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Website Components
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Portfolio from './components/Portfolio'
import Services from './components/Services'
import InstagramFeed from './components/InstagramFeed'
import Testimonials from './components/Testimonials'
import BookingForm from './components/BookingForm'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import BlogPostModal from './components/BlogPostModal'

// CRM Components
import CRMDashboard from './crm/CRMDashboard'

function MainWebsite({ setSelectedBlogPost }) {
  return (
    <div className="App">
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <InstagramFeed />
      <Testimonials />
      <Blog onPostClick={setSelectedBlogPost} />
      <BookingForm />
      <Contact />
      <Footer />
    </div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBlogPost, setSelectedBlogPost] = useState(null)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cream via-white to-lightGrey">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-charcoal mb-4">
            RN PhotoFilms
          </h1>
          <p className="text-xl text-gold italic">Your Emotions, Our Lens</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      {/* Navbar is now INSIDE Router - this fixes the useLocation error */}
      <Navbar />
      
      <Routes>
        {/* Main Website Route */}
        <Route 
          path="/rnphotofilms" 
          element={<MainWebsite setSelectedBlogPost={setSelectedBlogPost} />} 
        />

        {/* CRM Routes */}
        <Route path="/crm/*" element={<CRMDashboard />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Blog Post Modal */}
      {selectedBlogPost && (
        <BlogPostModal 
          post={selectedBlogPost} 
          onClose={() => setSelectedBlogPost(null)} 
        />
      )}
    </Router>
  )
}

export default App
