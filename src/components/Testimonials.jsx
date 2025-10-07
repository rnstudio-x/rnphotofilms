import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'

const testimonials = [
  {
    name: 'Priya & Rahul',
    event: 'Wedding Photography',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    rating: 5,
    text: 'RN PhotoFilms captured our wedding day beautifully! Every emotion, every moment preserved perfectly.'
  },
  {
    name: 'Anjali Sharma',
    event: 'Maternity Shoot',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    rating: 5,
    text: 'The maternity shoot was incredible! They made me feel comfortable and beautiful. Highly recommended!'
  },
  {
    name: 'Tech Corp India',
    event: 'Corporate Event',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    rating: 5,
    text: 'Professional, punctual, and creative. RN PhotoFilms documented our conference flawlessly.'
  },
  {
    name: 'Sneha & Arjun',
    event: 'Pre-Wedding Shoot',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    rating: 5,
    text: 'Our pre-wedding shoot was magical! Beautiful locations, amazing candid moments. Thank you!'
  },
  {
    name: 'Ravi Kumar',
    event: 'Birthday Photography',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    rating: 5,
    text: 'They captured my daughter\'s 1st birthday perfectly. Professional team with creative ideas!'
  },
  {
    name: 'Meera & Vikram',
    event: 'Anniversary Shoot',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    rating: 5,
    text: 'Beautiful memories captured for our 10th anniversary. Couldn\'t be happier with the results!'
  }
]

// Utility: duplicate testimonials for ultra-smooth loop
const marqueeTestimonials = [...testimonials, ...testimonials]

const TestimonialsAutoScroll = () => {
  const [paused, setPaused] = useState(false)
  const marqueeRef = useRef(null)

  // Pause on hover/touch for usability
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

  return (
    <section className="relative py-10 bg-gradient-to-br from-cream via-white to-lightGrey overflow-hidden">
      <div className="max-w-7xl mx-auto px-2">
        <h2 className="text-center text-2xl md:text-3xl font-playfair font-bold text-charcoal mb-8 flex items-center gap-2 justify-center">
          <FaQuoteLeft className="text-gold" />
          Why our clients love us
        </h2>

        {/* Horizontal Marquee Carousel */}
        <div
          ref={marqueeRef}
          className="relative overflow-x-hidden w-full select-none"
          style={{ maskImage: 'linear-gradient(90deg, transparent, #fff 60%, #fff 96%, transparent)' }}
        >
          <motion.div
            className="flex gap-5 items-stretch"
            animate={{
              x: paused ? 0 : ['0%', '-50%'],
            }}
            transition={{
              duration: 32,
              ease: 'linear',
              repeat: Infinity,
              repeatType: 'loop',
            }}
          >
            {marqueeTestimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                whileHover={{
                  scale: 1.07,
                  y: -8,
                  boxShadow: '0 8px 24px #f6e0aa88'
                }}
                className="relative min-w-[290px] max-w-sm bg-white/80 backdrop-blur-xl rounded-2xl p-4 mx-1 shadow-md border border-gold/10 cursor-pointer"
              >
                {/* Avatar + name/event */}
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold shadow"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-bold text-charcoal">{testimonial.name}</div>
                    <div className="text-xs text-gold">{testimonial.event}</div>
                  </div>
                </div>
                {/* Text */}
                <div className="italic text-gray-700 mt-2 mb-2 text-sm">
                  "{testimonial.text}"
                </div>
                {/* Star rating */}
                <div className="flex gap-1 mt-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar className="text-yellow-400 text-xs" key={i} />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        {/* Note/CTA below */}
        <div className="text-center mt-5 text-sm text-gray-500">
          <span>Hover or tap to pause scrolling</span>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsAutoScroll
