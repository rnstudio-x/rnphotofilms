import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Testimonials = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const testimonials = [
    {
      name: 'Priya & Rahul',
      event: 'Wedding Photography',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      rating: 5,
      text: 'RN PhotoFilms captured our wedding day beautifully! Every emotion, every tear, every smile - preserved perfectly. Their team was professional, unobtrusive, and incredibly talented. We couldn\'t have asked for better photographers.'
    },
    {
      name: 'Anjali Sharma',
      event: 'Maternity Shoot',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      rating: 5,
      text: 'The maternity shoot was an incredible experience. They made me feel comfortable and beautiful. The photos are stunning and capture this special time in my life perfectly. Highly recommend their services!'
    },
    {
      name: 'Tech Corp India',
      event: 'Corporate Event',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      rating: 5,
      text: 'Professional, punctual, and creative. RN PhotoFilms documented our annual conference flawlessly. The photos exceeded our expectations and perfectly captured the energy of our event.'
    },
    {
      name: 'Sneha & Arjun',
      event: 'Pre-Wedding Shoot',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      rating: 5,
      text: 'Our pre-wedding shoot was magical! They took us to beautiful locations and made us feel like models. The candid moments they captured are priceless. Thank you for making our shoot so memorable!'
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((currentIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((currentIndex - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <section id="testimonials" className="py-20 bg-blush" ref={ref}>
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
            Client Testimonials
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear what our happy clients have to say about their experience with us
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-2xl p-8 md:p-12"
          >
            <FaQuoteLeft className="text-5xl text-gold mb-6" />
            
            <p className="text-lg text-gray-700 mb-8 italic leading-relaxed">
              "{testimonials[currentIndex].text}"
            </p>

            <div className="flex items-center gap-4">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gold"
              />
              <div>
                <h4 className="text-xl font-semibold text-charcoal">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-600">{testimonials[currentIndex].event}</p>
                <div className="flex gap-1 mt-2">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <FaStar key={i} className="text-gold" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-gold text-white p-4 rounded-full hover:bg-opacity-90 transition-all"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-gold text-white p-4 rounded-full hover:bg-opacity-90 transition-all"
          >
            <FaChevronRight />
          </button>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-gold w-8' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
