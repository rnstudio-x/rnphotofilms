import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaInstagram, FaHeart } from 'react-icons/fa'

const demoPosts = [
  { id: 1, image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400', likes: 234 },
  { id: 2, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', likes: 456 },
  { id: 3, image: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400', likes: 678 },
  { id: 4, image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400', likes: 345 },
  { id: 5, image: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400', likes: 567 },
  { id: 6, image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400', likes: 789 },
  { id: 7, image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400', likes: 412 },
  { id: 8, image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=400', likes: 382 },
  { id: 9, image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400', likes: 592 },
]

const AnimatedMosaicInstagram = ({ posts }) => {
  const feed = Array.isArray(posts) && posts.length ? posts : demoPosts
  const [highlight, setHighlight] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  // Rotate highlight for hero/top reel
  useEffect(() => {
    if (!autoplay) return
    const interval = setInterval(() => {
      setHighlight((h) => (h + 1) % feed.length)
    }, 4200)
    return () => clearInterval(interval)
  }, [autoplay, feed.length])

  // Grid utility: split into rows/columns
  const getGridMatrix = () => {
    // 2 rows, 4 cols (8 posts grid), rest go in reel
    const mainGrid = feed.slice(1, 9)
    return [mainGrid.slice(0, 4), mainGrid.slice(4, 8)]
  }
  const gridMatrix = getGridMatrix()

  return (
    <section className="relative bg-gradient-to-br from-cream via-white to-lightGrey py-16 overflow-hidden min-h-[600px]">
      <div className="container mx-auto px-4 md:px-8 flex flex-col items-center">

        {/* Top + CTA Header */}
        <div className="flex flex-col md:flex-row items-center mb-8 gap-5 w-full justify-between">
          <div className="flex items-center gap-3 flex-shrink-0">
            <FaInstagram className="text-4xl text-gradient-gold animate-pulse" />
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-charcoal">
              @rn.photo.films
            </h2>
          </div>
          <a
            href="https://www.instagram.com/rn.photo.films/"
            target="_blank"
            rel="noopener noreferrer"
            className="sticky top-3 z-40 py-2 px-6 bg-gradient-to-r from-pink-500 to-gold rounded-2xl text-white font-bold shadow-xl hover:scale-105 transition space-x-2 flex items-center"
          >
            <FaInstagram className="text-xl" />
            <span>Follow &rarr;</span>
          </a>
        </div>

        {/* GRID + HERO */}
        <div className="flex flex-col md:flex-row w-full gap-8 md:gap-12 items-start justify-between">
          {/* $$$ HERO Animated Reel left/top */}
          <AnimatePresence mode="wait">
            <motion.div
              key={feed[highlight]?.id}
              initial={{ opacity: 0, x: -40, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.92 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="flex flex-col items-center gap-3 md:sticky md:top-36 md:w-[340px] w-full mx-auto z-10"
              style={{ minWidth: 240 }}
            >
              <motion.div
                className="relative overflow-hidden w-full rounded-3xl shadow-xl border-4 border-gold cursor-pointer"
                style={{ aspectRatio: '1/1.18', background: '#4442' }}
                whileHover={{ scale: 1.03 }}
                onMouseEnter={() => setAutoplay(false)}
                onMouseLeave={() => setAutoplay(true)}
                onClick={() => window.open('https://www.instagram.com/rn.photo.films/', '_blank')}
              >
                <img src={feed[highlight]?.image} alt="Insta highlight" className="w-full h-full object-cover" loading="lazy" />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-lg font-bold text-white flex items-center gap-4"
                  animate={{
                    backgroundColor: ['#0e0c0cbb', '#d4a57477', '#0e0c0cbb'],
                  }}
                  transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
                >
                  <FaHeart className="text-rose-400" />
                  <span className="text-xl font-semibold">{feed[highlight]?.likes}</span>
                  <span className="italic text-gold ml-auto text-xs">Hero Reel</span>
                </motion.div>
                {/* Animated shine effect */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1.5 opacity-60 bg-gradient-to-r from-white via-gold to-transparent pointer-events-none"
                  animate={{ x: [-200, 400] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              </motion.div>
              <div className="mx-auto mt-2 rounded-full bg-gold text-white px-5 py-2 text-xs font-bold shadow-md select-none">
                Best Of RN.Photo.Films
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Grid Masonry */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-5">
            {gridMatrix.flat().map((post, i) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.07, zIndex: 11 }}
                className="relative overflow-hidden rounded-2xl shadow-md group cursor-pointer aspect-[1/1.08] bg-white"
                onClick={() => window.open('https://www.instagram.com/rn.photo.films/', '_blank')}
              >
                <img
                  src={post.image}
                  alt="Instagram grid"
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-200"
                />
                {/* Likes overlay */}
                <motion.div
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-gold font-semibold flex items-center gap-1 px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                >
                  <FaHeart className="text-rose-400" />
                  {post.likes}
                </motion.div>
                {/* Shine */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white via-gold/30 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{ x: [-120, 240] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Optional: Scrollable caption ticker at the bottom */}
        <div className="w-full flex justify-center mt-12 overflow-x-hidden">
          <motion.div
            className="bg-white/70 rounded-full px-7 py-3 shadow flex items-center gap-6 text-charcoal font-bold whitespace-nowrap text-md"
            animate={{ x: [0, -450, 0] }}
            transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
          >
            {feed.map((post, i) => (
              <span key={post.id} className="flex items-center font-medium">
                <FaInstagram className="text-pink-500 mr-2" /> 
                @{`rn.photo.films`}&nbsp;
                <span className="ml-2">{(post.caption || 'Captured Moment').slice(0, 35)}</span>
                <span className="mx-5">|</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AnimatedMosaicInstagram
