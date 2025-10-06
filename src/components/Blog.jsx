import React, { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'
import { FaClock, FaUser, FaArrowRight } from 'react-icons/fa'

const Blog = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const blogPosts = [
    {
      id: 1,
      title: '10 Tips for Perfect Wedding Photography',
      excerpt: 'Discover essential tips to ensure your wedding day is captured beautifully, from lighting to candid moments.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600',
      author: 'Raj Nair',
      date: 'October 1, 2025',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Choosing the Right Location for Pre-Wedding Shoots',
      excerpt: 'Learn how to select stunning backdrops that complement your love story and personality.',
      image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600',
      author: 'Neha Photography',
      date: 'September 25, 2025',
      readTime: '4 min read'
    },
    {
      id: 3,
      title: 'The Art of Maternity Photography',
      excerpt: 'Explore techniques for capturing the beauty and emotion of motherhood in elegant portraits.',
      image: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=600',
      author: 'Raj Nair',
      date: 'September 20, 2025',
      readTime: '6 min read'
    },
  ]

  return (
    <section id="blog" className="py-20 bg-white" ref={ref}>
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
            Latest from Our Blog
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Photography tips, behind-the-scenes stories, and inspiration for your next shoot
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial="hidden"
              animate={controls}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.2 } },
              }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all"
            >
              <div className="overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <FaUser /> {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaClock /> {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-playfair font-semibold text-charcoal mb-3 hover:text-gold transition-colors">
                  {post.title}
                </h3>

                <p className="text-gray-600 mb-4">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-gold font-semibold hover:underline"
                  >
                    Read More <FaArrowRight />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8, delay: 0.8 } },
          }}
          className="text-center mt-12"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-gold text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
          >
            View All Posts
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Blog
