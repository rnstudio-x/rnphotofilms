import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'

// Your Google Apps Script URL (same jo baaki APIs mein use ho raha hai)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxf5SaytPeRb85aQZ3snyvwlNpZXL7TMO8ZydJSo-QnTMKocQhlMhR7zwC8j2aPqsup9g/exec'

// Demo testimonials as fallback
const DEMO_TESTIMONIALS = [
  {
    id: 'demo-1',
    name: 'Priya & Rahul',
    event: 'Wedding Photography',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    rating: 5,
    text: 'RN PhotoFilms captured our wedding day beautifully! Every emotion, every moment preserved perfectly.'
  },
  {
    id: 'demo-2',
    name: 'Anjali Sharma',
    event: 'Maternity Shoot',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    rating: 5,
    text: 'The maternity shoot was incredible! They made me feel comfortable and beautiful. Highly recommended!'
  },
  {
    id: 'demo-3',
    name: 'Tech Corp India',
    event: 'Corporate Event',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    rating: 5,
    text: 'Professional, punctual, and creative. RN PhotoFilms documented our conference flawlessly.'
  },
  {
    id: 'demo-4',
    name: 'Sneha & Arjun',
    event: 'Pre-Wedding Shoot',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    rating: 5,
    text: 'Our pre-wedding shoot was dreamy! They captured our love story perfectly. Amazing work!'
  }
]

const useClientFeedback = () => {
  const [testimonials, setTestimonials] = useState(DEMO_TESTIMONIALS)
  const [loading, setLoading] = useState(true)
  const [isLiveData, setIsLiveData] = useState(false)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        const response = await fetch(SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'getClientFeedback'
          }),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        
        const result = await response.json()
        
        if (result.success && result.data && result.data.length > 0) {
          const formattedData = result.data.map(item => ({
            id: item.id,
            name: item.name,
            event: item.event || 'Photography Service',
            image: item.image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
            rating: parseInt(item.rating) || 5,
            text: item.feedback,
            submittedAt: item.submittedAt
          }))
          
          setTestimonials(formattedData)
          setIsLiveData(true)
          console.log('✅ Live feedback loaded:', formattedData.length)
        }
        
      } catch (err) {
        console.log('ℹ️ Using demo testimonials (API unavailable)')
        setTestimonials(DEMO_TESTIMONIALS)
        setIsLiveData(false)
      } finally {
        setLoading(false)
      }
    }

    fetchFeedback()
  }, [])

  return { testimonials, loading, isLiveData }
}

const TestimonialsAutoScroll = () => {
  const { testimonials, loading, isLiveData } = useClientFeedback()
  const [paused, setPaused] = useState(false)
  const marqueeRef = useRef(null)

  const marqueeTestimonials = testimonials.length > 0 
    ? [...testimonials, ...testimonials] 
    : []

  useEffect(() => {
    const el = marqueeRef.current
    if (!el) return

    const pause = () => setPaused(true)
    const resume = () => setPaused(false)

    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    el.addEventListener('touchstart', pause)
    el.addEventListener('touchend', resume)

    return () => {
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
    }
  }, [])

  if (loading) {
    return (
      <section className="relative bg-gradient-to-br from-lightGrey via-white to-cream py-20 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-8">
            Why our clients love us
          </h2>
          <div className="flex justify-center items-center gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative bg-gradient-to-br from-lightGrey via-white to-cream py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-center text-charcoal mb-12">
          Why our clients love us
        </h2>

        <div
          ref={marqueeRef}
          className="relative flex items-center overflow-hidden"
          style={{ maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}
        >
          <motion.div
            className="flex gap-8"
            animate={paused ? {} : { x: ['0%', '-50%'] }}
            transition={{
              duration: marqueeTestimonials.length * 5,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {marqueeTestimonials.map((testimonial, idx) => (
              <motion.div
                key={`${testimonial.id}-${idx}`}
                className="min-w-[380px] bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 border-2 border-gold/20 relative"
                whileHover={{ scale: 1.05, borderColor: '#d4a574' }}
              >
                <FaQuoteLeft className="text-gold text-3xl opacity-20 absolute top-4 right-4" />

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gold shadow"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-charcoal">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.event}</p>
                  </div>
                </div>

                <p className="text-gray-700 italic leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex gap-1 mt-auto">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-gold" />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Hover to pause • {testimonials.length} testimonials
          {!isLiveData && <span className="ml-2 text-xs">• Demo Mode</span>}
        </p>
      </div>
    </section>
  )
}

export default TestimonialsAutoScroll
