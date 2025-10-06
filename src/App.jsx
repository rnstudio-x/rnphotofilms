import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
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

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-cream">
        <div className="text-center">
          <h1 className="text-4xl font-playfair text-charcoal mb-4">RN PhotoFilms</h1>
          <p className="text-gold italic">Your Emotions, Our Lens</p>
        </div>
      </div>
    )
  }

  return (
    <Router basename="/rnphotofilms">
      <div className="App">
        <Navbar />
        <Hero />
        <About />
        <Portfolio />
        <Services />
        <InstagramFeed />
        <Testimonials />
        <BookingForm />
        <Blog />
        <Contact />
        <Footer />
      </div>
    </Router>
  )
}

export default App
