import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { FaInstagram } from 'react-icons/fa'

const InstagramFeed = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  // Sample Instagram posts (replace with actual API integration)
  const instaPosts = [
    { id: 1, image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400', likes: 234 },
    { id: 2, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', likes: 456 },
    { id: 3, image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400', likes: 678 },
    { id: 4, image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400', likes: 345 },
    { id: 5, image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400', likes: 567 },
    { id: 6, image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400', likes: 789 },
  ]

  return (
    <section id="instagram" className="py-20 bg-white" ref={ref}>
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
            Follow Us on Instagram
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Stay updated with our latest work and behind-the-scenes moments
          </p>
          <a
            href="https://instagram.com/rnphotofilms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold text-xl font-semibold hover:underline"
          >
            <FaInstagram /> @rnphotofilms
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {instaPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: index * 0.1 } },
              }}
              whileHover={{ scale: 1.05 }}
              className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FaInstagram className="text-4xl mb-2" />
                  <p className="font-semibold">❤️ {post.likes}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default InstagramFeed
