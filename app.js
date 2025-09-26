// RN PhotoFilms - Complete JavaScript Application

// Application Data
const appData = {
  services: [
    {
      id: "wedding",
      name: "Wedding Photography",
      description: "Capturing your most precious moments with artistic flair and professional expertise",
      packages: [
        {
          name: "Classic Package",
          price: "₹75,000",
          features: ["6-8 hours coverage", "300+ edited photos", "Online gallery", "Basic album"]
        },
        {
          name: "Premium Package", 
          price: "₹1,25,000",
          features: ["10-12 hours coverage", "500+ edited photos", "Cinematic video", "Premium album", "Pre-wedding shoot"]
        },
        {
          name: "Luxury Package",
          price: "₹2,00,000", 
          features: ["Full day coverage", "1000+ edited photos", "4K cinematic film", "Luxury album", "Pre-wedding shoot", "Drone photography"]
        }
      ]
    },
    {
      id: "prewedding",
      name: "Pre-Wedding Shoots",
      description: "Romantic and artistic sessions that tell your unique love story",
      packages: [
        {
          name: "Essential Package",
          price: "₹25,000",
          features: ["2-3 hours shoot", "100+ edited photos", "2 outfit changes", "Online gallery"]
        },
        {
          name: "Cinematic Package",
          price: "₹45,000", 
          features: ["4-5 hours shoot", "200+ edited photos", "Short cinematic video", "3 outfit changes", "Premium locations"]
        }
      ]
    },
    {
      id: "events", 
      name: "Event Photography",
      description: "Professional coverage for corporate events, parties, and special occasions",
      packages: [
        {
          name: "Basic Coverage",
          price: "₹15,000",
          features: ["4 hours coverage", "150+ edited photos", "Same day preview", "Online gallery"]
        },
        {
          name: "Extended Coverage",
          price: "₹30,000",
          features: ["8 hours coverage", "400+ edited photos", "Video highlights", "USB delivery"]
        }
      ]
    },
    {
      id: "portraits",
      name: "Portrait Photography", 
      description: "Professional headshots and personal portraits for individuals and families",
      packages: [
        {
          name: "Individual Session",
          price: "₹8,000",
          features: ["1 hour session", "25+ edited photos", "Multiple poses", "Digital delivery"]
        },
        {
          name: "Family Session",
          price: "₹15,000",
          features: ["2 hour session", "50+ edited photos", "Group and individual shots", "Print ready files"]
        }
      ]
    }
  ],
  team: [
    {
      name: "Rakesh Baria",
      position: "Creative Director & Founder", 
      experience: "4+ Years Experience",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      salary: "₹45,000",
      lastPaid: "2024-09-01",
      pending: "₹0",
      attendance: 95
    },
    {
      name: "Tushar Tank",
      position: "Lead Photographer & Videographer",
      experience: "5+ Years Experience", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      salary: "₹38,000",
      lastPaid: "2024-09-01",
      pending: "₹0",
      attendance: 92
    },
    {
      name: "Vinod Bhabhor", 
      position: "Videographer",
      experience: "2+ Years Experience",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      salary: "₹25,000",
      lastPaid: "2024-08-15",
      pending: "₹12,500",
      attendance: 88
    },
    {
      name: "Priya Singh",
      position: "Client Relations Manager",
      experience: "4 Years Experience",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b15b?w=300&h=300&fit=crop&crop=face",
      salary: "₹30,000",
      lastPaid: "2024-09-01",
      pending: "₹0",
      attendance: 96
    }
  ],
  galleryImages: {
    wedding: [
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0abc710c0fc?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=450&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=350&fit=crop"
    ],
    prewedding: [
      "https://images.unsplash.com/photo-1595434091143-b375ced5fe5c?w=400&h=500&fit=crop", 
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=450&fit=crop"
    ],
    events: [
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop", 
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=600&fit=crop"
    ],
    portraits: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b15b?w=400&h=500&fit=crop", 
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=450&fit=crop"
    ]
  },
  adminMetrics: [
    {"name": "Total Bookings", "value": "47", "change": "+12%", "icon": "📅"},
    {"name": "This Month Revenue", "value": "₹3,25,000", "change": "+25%", "icon": "💰"}, 
    {"name": "Pending Payments", "value": "₹45,000", "change": "-8%", "icon": "⏳"},
    {"name": "Active Clients", "value": "23", "change": "+5%", "icon": "👥"}
  ],
  recentBookings: [
    {"id": 1, "client": "Rajesh & Priya", "service": "Wedding", "date": "2024-10-15", "status": "Confirmed", "amount": "₹1,25,000", "photographer": "Tushar Tank"},
    {"id": 2, "client": "Amit & Sneha", "service": "Pre-Wedding", "date": "2024-10-08", "status": "Completed", "amount": "₹45,000", "photographer": "Rakesh Baria"},
    {"id": 3, "client": "Rohit & Kavya", "service": "Wedding", "date": "2024-11-02", "status": "Inquiry", "amount": "₹2,00,000", "photographer": "Unassigned"},
    {"id": 4, "client": "Neha & Vikram", "service": "Pre-Wedding", "date": "2024-09-28", "status": "Confirmed", "amount": "₹25,000", "photographer": "Vinod Bhabhor"},
    {"id": 5, "client": "Corporate Event XYZ", "service": "Event", "date": "2024-10-20", "status": "Inquiry", "amount": "₹15,000", "photographer": "Unassigned"}
  ],
  blogPosts: [
    {
      id: 1,
      title: "10 Essential Wedding Photography Tips for Perfect Shots", 
      excerpt: "Discover professional techniques and insider secrets for capturing those perfect wedding moments that couples will treasure forever.",
      date: "2024-09-20",
      author: "Rakesh Baria",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=400&fit=crop",
      category: "Wedding Tips"
    },
    {
      id: 2,
      title: "Best Pre-Wedding Shoot Locations in Mumbai",
      excerpt: "Explore the most romantic and picturesque locations for pre-wedding photography that tell your unique love story.",
      date: "2024-09-15", 
      author: "Tushar Tank",
      image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=400&fit=crop",
      category: "Locations"
    }
  ],
  clients: [
    {"id": 1, "name": "Rajesh & Priya", "email": "rajesh@email.com", "phone": "+91 9876543210", "address": "Mumbai", "eventType": "Wedding", "birthday": "1995-05-15", "anniversary": "2024-10-15"},
    {"id": 2, "name": "Amit & Sneha", "email": "amit@email.com", "phone": "+91 9876543211", "address": "Delhi", "eventType": "Pre-Wedding", "birthday": "1992-08-22", "anniversary": "2023-12-10"},
    {"id": 3, "name": "Rohit & Kavya", "email": "rohit@email.com", "phone": "+91 9876543212", "address": "Bangalore", "eventType": "Wedding", "birthday": "1990-03-10", "anniversary": "2024-11-02"}
  ],
  expenses: [
    {"id": 1, "category": "Equipment", "description": "Canon EOS R5 Camera", "amount": "₹2,50,000", "date": "2024-08-15"},
    {"id": 2, "category": "Travel", "description": "Client shoot travel expenses", "amount": "₹5,000", "date": "2024-09-10"},
    {"id": 3, "category": "Marketing", "description": "Instagram ads campaign", "amount": "₹15,000", "date": "2024-09-01"},
    {"id": 4, "category": "Software", "description": "Adobe Creative Suite subscription", "amount": "₹2,000", "date": "2024-09-01"}
  ],
  crmData: {
    leads: [
      {"id": 1, "name": "Sarah Johnson", "service": "Wedding", "status": "Hot Lead", "value": "₹1,50,000", "stage": "follow-up"},
      {"id": 2, "name": "Michael Chen", "service": "Pre-Wedding", "status": "Warm Lead", "value": "₹35,000", "stage": "proposal"},
      {"id": 3, "name": "Tech Corp", "service": "Event", "status": "Cold Lead", "value": "₹25,000", "stage": "contacted"}
    ]
  }
};

// State Management
let currentGalleryFilter = 'all';
let currentImageIndex = 0;
let currentGalleryImages = [];
let isAdminLoggedIn = false;

// DOM Elements
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  renderServices();
  renderGallery();
  renderTeam();
  renderBlog();
  setupNavigation();
  setupScrollEffects();
  fixDateInputs();
}

// Fix date inputs to ensure proper functionality
function fixDateInputs() {
  // Set minimum date to today for booking forms
  const today = new Date().toISOString().split('T')[0];
  const dateInputs = document.querySelectorAll('input[type="date"]');
  
  dateInputs.forEach(input => {
    if (input.id.includes('event-date') || input.id.includes('booking-date')) {
      input.min = today;
    }
    
    // Ensure date inputs display selected values correctly
    input.addEventListener('change', function() {
      this.setAttribute('data-selected', this.value);
      // Force update display
      if (this.value) {
        this.classList.add('has-value');
      } else {
        this.classList.remove('has-value');
      }
    });
    
    // Check if input already has a value
    if (input.value) {
      input.classList.add('has-value');
    }
  });
}

// Event Listeners Setup
function setupEventListeners() {
  // Navigation toggle for mobile
  navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Gallery filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentGalleryFilter = e.target.dataset.filter;
      renderGallery();
    });
  });

  // Form submissions
  document.getElementById('booking-form')?.addEventListener('submit', handleBookingSubmission);
  document.getElementById('contact-form')?.addEventListener('submit', handleContactSubmission);
  document.getElementById('login-form')?.addEventListener('submit', handleAdminLogin);
  document.getElementById('add-booking-form')?.addEventListener('submit', handleAddBooking);
  document.getElementById('add-client-form')?.addEventListener('submit', handleAddClient);
  document.getElementById('add-expense-form')?.addEventListener('submit', handleAddExpense);

  // Admin navigation
  document.querySelectorAll('.admin-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      switchAdminSection(e.target.dataset.section);
    });
  });

  // Service selection change in booking form
  document.getElementById('booking-service')?.addEventListener('change', updatePackageOptions);
}

// Navigation Functions
function setupNavigation() {
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Close mobile menu if open
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  });
}

function setupScrollEffects() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Render Functions
function renderServices() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;

  servicesGrid.innerHTML = appData.services.map(service => `
    <div class="service-card">
      <h3 class="service-title">${service.name}</h3>
      <p class="service-description">${service.description}</p>
      <div class="service-packages">
        ${service.packages.map(pkg => `
          <div class="package">
            <div class="package-header">
              <span class="package-name">${pkg.name}</span>
              <span class="package-price">${pkg.price}</span>
            </div>
            <ul class="package-features">
              ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;

  let imagesToShow = [];
  
  if (currentGalleryFilter === 'all') {
    imagesToShow = Object.entries(appData.galleryImages).flatMap(([category, images]) =>
      images.map(img => ({ src: img, category }))
    );
  } else {
    imagesToShow = appData.galleryImages[currentGalleryFilter]?.map(img => 
      ({ src: img, category: currentGalleryFilter })
    ) || [];
  }

  currentGalleryImages = imagesToShow.map(img => img.src);

  galleryGrid.innerHTML = imagesToShow.map((img, index) => `
    <div class="gallery-item" data-category="${img.category}" onclick="openLightbox(${index})">
      <img src="${img.src}" alt="${img.category} photography" loading="lazy">
    </div>
  `).join('');
}

function renderTeam() {
  const teamGrid = document.getElementById('team-grid');
  if (!teamGrid) return;

  teamGrid.innerHTML = appData.team.map(member => `
    <div class="team-member">
      <div class="team-member-image">
        <img src="${member.image}" alt="${member.name}">
      </div>
      <h4 class="team-member-name">${member.name}</h4>
      <p class="team-member-position">${member.position}</p>
      <p class="team-member-experience">${member.experience}</p>
    </div>
  `).join('');
}

function renderBlog() {
  const blogGrid = document.getElementById('blog-grid');
  if (!blogGrid) return;

  blogGrid.innerHTML = appData.blogPosts.map(post => `
    <article class="blog-post">
      <div class="blog-post-image">
        <img src="${post.image}" alt="${post.title}">
      </div>
      <div class="blog-post-content">
        <div class="blog-post-meta">
          <span class="blog-post-category">${post.category}</span>
          <span class="blog-post-date">${formatDate(post.date)}</span>
        </div>
        <h3 class="blog-post-title">${post.title}</h3>
        <p class="blog-post-excerpt">${post.excerpt}</p>
      </div>
    </article>
  `).join('');
}

// Admin Panel Functions
function showAdminLogin() {
  document.getElementById('admin-panel').classList.remove('hidden');
  document.getElementById('admin-login').classList.remove('hidden');
  document.getElementById('admin-dashboard').classList.add('hidden');
}

function hideAdminPanel() {
  document.getElementById('admin-panel').classList.add('hidden');
  document.getElementById('admin-login').classList.add('hidden');
  document.getElementById('admin-dashboard').classList.add('hidden');
  isAdminLoggedIn = false;
}

function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;

  // Simple authentication (in real app, this would be server-side)
  if (email === 'admin@rnphotofilms.com' && password === 'admin123') {
    isAdminLoggedIn = true;
    document.getElementById('admin-login').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    renderAdminDashboard();
    showToast('Login successful!', 'success');
  } else {
    showToast('Invalid credentials!', 'error');
  }
}

function renderAdminDashboard() {
  renderMetrics();
  renderRecentBookings();
  renderBookingsTable();
  renderClientsTable();
  renderTeamManagement();
  renderExpensesTable();
  renderCRMPipeline();
  renderAnalyticsCharts();
}

function renderMetrics() {
  const metricsGrid = document.getElementById('metrics-grid');
  if (!metricsGrid) return;

  metricsGrid.innerHTML = appData.adminMetrics.map(metric => `
    <div class="metric-card">
      <div class="metric-header">
        <span class="metric-icon">${metric.icon}</span>
        <span class="metric-change ${metric.change.startsWith('+') ? 'positive' : 'negative'}">${metric.change}</span>
      </div>
      <div class="metric-value">${metric.value}</div>
      <div class="metric-label">${metric.name}</div>
    </div>
  `).join('');
}

function renderRecentBookings() {
  const table = document.getElementById('recent-bookings-table');
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>Client</th>
        <th>Service</th>
        <th>Date</th>
        <th>Status</th>
        <th>Amount</th>
        <th>Photographer</th>
      </tr>
    </thead>
    <tbody>
      ${appData.recentBookings.slice(0, 5).map(booking => `
        <tr>
          <td>${booking.client}</td>
          <td>${booking.service}</td>
          <td>${formatDate(booking.date)}</td>
          <td><span class="status status--${getStatusClass(booking.status)}">${booking.status}</span></td>
          <td>${booking.amount}</td>
          <td>${booking.photographer}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function renderBookingsTable() {
  const table = document.getElementById('bookings-table');
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Client</th>
        <th>Service</th>
        <th>Date</th>
        <th>Status</th>
        <th>Amount</th>
        <th>Photographer</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${appData.recentBookings.map(booking => `
        <tr>
          <td>#${booking.id}</td>
          <td>${booking.client}</td>
          <td>${booking.service}</td>
          <td>${formatDate(booking.date)}</td>
          <td>
            <select class="form-control" onchange="updateBookingStatus(${booking.id}, this.value)">
              <option value="Inquiry" ${booking.status === 'Inquiry' ? 'selected' : ''}>Inquiry</option>
              <option value="Confirmed" ${booking.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Completed" ${booking.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${booking.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>${booking.amount}</td>
          <td>
            <select class="form-control" onchange="assignPhotographer(${booking.id}, this.value)">
          initModals();
  initLightbox();
  initToast();
  initScrollEffects();

  console.log('✅ Application initialized successfully!');
}

// ==================== LOADING SCREEN ====================
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');

  // Simulate loading time
  setTimeout(() => {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }, 2000);
}

// ==================== NAVIGATION ====================
function initNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Close mobile menu when clicking on links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Remove active class from all links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add active class to clicked link
      link.classList.add('active');

      // Close mobile menu
      if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }

      // Smooth scroll to section
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const offsetTop = targetElement.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.backdropFilter = 'blur(10px)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// ==================== HERO SECTION ====================
function initHeroSection() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');

  if (slides.length === 0) return;

  let slideInterval;

  function showSlide(index) {
    // Remove active class from all slides and indicators
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    // Add active class to current slide and indicator
    if (slides[index]) slides[index].classList.add('active');
    if (indicators[index]) indicators[index].classList.add('active');

    appState.currentSlide = index;
  }

  function nextSlide() {
    const nextIndex = (appState.currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }

  function startSlideshow() {
    slideInterval = setInterval(nextSlide, CONFIG.SLIDESHOW_INTERVAL);
  }

  function stopSlideshow() {
    clearInterval(slideInterval);
  }

  // Initialize first slide
  showSlide(0);

  // Set up indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      showSlide(index);
      stopSlideshow();
      startSlideshow();
    });
  });

  // Auto slideshow
  startSlideshow();

  // Pause on hover
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', stopSlideshow);
    hero.addEventListener('mouseleave', startSlideshow);
  }
}

// Global functions for hero navigation
function changeSlide(index) {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');

  slides.forEach(slide => slide.classList.remove('active'));
  indicators.forEach(indicator => indicator.classList.remove('active'));

  if (slides[index]) slides[index].classList.add('active');
  if (indicators[index]) indicators[index].classList.add('active');

  appState.currentSlide = index;
}

function scrollToGallery() {
  const gallerySection = document.getElementById('gallery');
  if (gallerySection) {
    const offsetTop = gallerySection.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// ==================== SERVICES SECTION ====================
function initServices() {
  const servicesGrid = document.getElementById('services-grid');
  if (!servicesGrid) return;

  const servicesHTML = appState.appData.services.map(service => `
    <div class="service-card" data-aos="fade-up">
      <div class="service-icon">${service.icon}</div>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <div class="service-packages">
        ${service.packages.map(pkg => `
          <div class="package-item">
            <span class="package-name">${pkg.name}</span>
            <span class="package-price">${pkg.price}</span>
          </div>
        `).join('')}
      </div>
      <button class="btn btn--primary" onclick="openBookingModal('${service.id}')">
        <i class="fas fa-calendar-plus"></i>
        Book Now
      </button>
    </div>
  `).join('');

  servicesGrid.innerHTML = servicesHTML;
}

// ==================== GALLERY SECTION ====================
function initGallery() {
  const galleryMasonry = document.getElementById('gallery-masonry');
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!galleryMasonry) return;

  // Initialize gallery with all images
  loadGallery('all');

  // Filter button functionality
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      // Get filter value and load gallery
      const filter = btn.getAttribute('data-filter');
      appState.currentGalleryFilter = filter;
      loadGallery(filter);
    });
  });
}

function loadGallery(filter) {
  const galleryMasonry = document.getElementById('gallery-masonry');
  if (!galleryMasonry) return;

  let images = [];
  appState.lightboxImages = [];

  if (filter === 'all') {
    // Load all images from all categories
    Object.keys(appState.appData.galleryImages).forEach(category => {
      appState.appData.galleryImages[category].forEach(img => {
        images.push({ src: img, category: category });
      });
    });
  } else {
    // Load images from specific category
    if (appState.appData.galleryImages[filter]) {
      images = appState.appData.galleryImages[filter].map(img => ({ src: img, category: filter }));
    }
  }

  // Create gallery HTML
  const galleryHTML = images.map((img, index) => `
    <div class="gallery-item" data-category="${img.category}" onclick="openLightbox(${index})">
      <img src="${img.src}" alt="${img.category} photography" loading="lazy">
      <div class="gallery-overlay">
        <div class="gallery-info">
          <div class="gallery-category">${img.category}</div>
        </div>
      </div>
    </div>
  `).join('');

  galleryMasonry.innerHTML = galleryHTML;
  appState.lightboxImages = images.map(img => img.src);
}

// ==================== TEAM SECTION ====================
function initTeam() {
  const teamGrid = document.getElementById('team-grid');
  if (!teamGrid) return;

  const teamHTML = appState.appData.team.map(member => `
    <div class="team-member" data-aos="fade-up">
      <div class="team-image">
        <img src="${member.image}" alt="${member.name}" loading="lazy">
      </div>
      <div class="team-info">
        <h3 class="team-name">${member.name}</h3>
        <div class="team-position">${member.position}</div>
        <div class="team-experience">${member.experience}</div>
      </div>
    </div>
  `).join('');

  teamGrid.innerHTML = teamHTML;
}

// ==================== BLOG SECTION ====================
function initBlog() {
  const blogGrid = document.getElementById('blog-grid');
  if (!blogGrid) return;

  const blogHTML = appState.appData.blogPosts.map(post => `
    <div class="blog-card" data-aos="fade-up">
      <div class="blog-image">
        <img src="${post.image}" alt="${post.title}" loading="lazy">
      </div>
      <div class="blog-content">
        <span class="blog-category">${post.category}</span>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt}</p>
        <div class="blog-meta">
          <span class="blog-author">By ${post.author}</span>
          <span class="blog-date">${formatDate(post.date)}</span>
        </div>
      </div>
    </div>
  `).join('');

  blogGrid.innerHTML = blogHTML;
}

// ==================== CONTACT FORM ====================
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    try {
      // Simulate API call (replace with actual implementation)
      await new Promise(resolve => setTimeout(resolve, 2000));

      showToast('Message sent successfully! We will get back to you soon.', 'success');
      contactForm.reset();
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Error sending message. Please try again.', 'error');
    } finally {
      // Reset button state
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }
  });
}

// ==================== MODALS ====================
function initModals() {
  // Close modals when clicking outside
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target.id);
    }
  });

  // Close modals with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        closeModal(activeModal.id);
      }
    }
  });

  // Initialize booking form
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  // Initialize admin booking form
  const addBookingForm = document.getElementById('add-booking-form');
  if (addBookingForm) {
    addBookingForm.addEventListener('submit', handleAddBookingSubmit);
  }

  // Initialize client form
  const addClientForm = document.getElementById('add-client-form');
  if (addClientForm) {
    addClientForm.addEventListener('submit', handleAddClientSubmit);
  }

  // Initialize team member form
  const addTeamMemberForm = document.getElementById('add-team-member-form');
  if (addTeamMemberForm) {
    addTeamMemberForm.addEventListener('submit', handleAddTeamMemberSubmit);
  }

  // Initialize expense form
  const addExpenseForm = document.getElementById('add-expense-form');
  if (addExpenseForm) {
    addExpenseForm.addEventListener('submit', handleAddExpenseSubmit);
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function openBookingModal(serviceType = '') {
  const modal = document.getElementById('booking-modal');
  const serviceSelect = modal.querySelector('select[name="serviceType"]');

  if (serviceType && serviceSelect) {
    serviceSelect.value = serviceType;
  }

  // Set minimum date to tomorrow
  const dateInput = modal.querySelector('input[name="eventDate"]');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  openModal('booking-modal');
}

// ==================== FORM HANDLERS ====================
async function handleBookingSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const bookingData = Object.fromEntries(formData.entries());

  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
  submitButton.disabled = true;

  try {
    // Add booking via Google Apps Script
    const result = await addBooking(bookingData);

    if (result.success) {
      showToast('Booking request submitted successfully! We will contact you soon.', 'success');
      e.target.reset();
      closeModal('booking-modal');
    } else {
      showToast(result.message || 'Error submitting booking. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error submitting booking:', error);
    showToast('Error submitting booking. Please try again.', 'error');
  } finally {
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

async function handleAddBookingSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const bookingData = Object.fromEntries(formData.entries());

  try {
    const result = await addBooking(bookingData);

    if (result.success) {
      showToast('Booking added successfully!', 'success');
      e.target.reset();
      closeModal('add-booking-modal');
      await loadDashboardData();
    } else {
      showToast(result.message || 'Error adding booking.', 'error');
    }
  } catch (error) {
    console.error('Error adding booking:', error);
    showToast('Error adding booking. Please try again.', 'error');
  }
}

async function handleAddClientSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const clientData = Object.fromEntries(formData.entries());

  try {
    const result = await addClient(clientData);

    if (result.success) {
      showToast('Client added successfully!', 'success');
      e.target.reset();
      closeModal('add-client-modal');
      await loadClientsData();
    } else {
      showToast(result.message || 'Error adding client.', 'error');
    }
  } catch (error) {
    console.error('Error adding client:', error);
    showToast('Error adding client. Please try again.', 'error');
  }
}

async function handleAddTeamMemberSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const memberData = Object.fromEntries(formData.entries());

  try {
    const result = await addTeamMember(memberData);

    if (result.success) {
      showToast('Team member added successfully!', 'success');
      e.target.reset();
      closeModal('add-team-member-modal');
      await loadTeamData();
    } else {
      showToast(result.message || 'Error adding team member.', 'error');
    }
  } catch (error) {
    console.error('Error adding team member:', error);
    showToast('Error adding team member. Please try again.', 'error');
  }
}

async function handleAddExpenseSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const expenseData = Object.fromEntries(formData.entries());

  try {
    const result = await addExpense(expenseData);

    if (result.success) {
      showToast('Expense added successfully!', 'success');
      e.target.reset();
      closeModal('add-expense-modal');
      await loadFinanceData();
    } else {
      showToast(result.message || 'Error adding expense.', 'error');
    }
  } catch (error) {
    console.error('Error adding expense:', error);
    showToast('Error adding expense. Please try again.', 'error');
  }
}

// ==================== ADMIN PANEL ====================
function initAdminPanel() {
  // Initialize admin navigation
  const adminNavItems = document.querySelectorAll('.admin-nav-item');
  adminNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      // Remove active class from all nav items
      adminNavItems.forEach(nav => nav.classList.remove('active'));
      // Add active class to clicked item
      item.classList.add('active');

      // Show corresponding section
      const sectionId = item.getAttribute('data-section');
      showAdminSection(sectionId);
    });
  });

  // Initialize admin login form
  const adminLoginForm = document.getElementById('admin-login-form');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleAdminLogin);
  }
}

function showAdminLogin() {
  const adminPanel = document.getElementById('admin-panel');
  const adminLogin = document.getElementById('admin-login');

  if (adminPanel && adminLogin) {
    adminPanel.classList.remove('hidden');
    adminLogin.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeAdminPanel() {
  const adminPanel = document.getElementById('admin-panel');
  const adminLogin = document.getElementById('admin-login');
  const adminDashboard = document.getElementById('admin-dashboard');

  if (adminPanel) {
    adminPanel.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  if (adminLogin) adminLogin.classList.add('hidden');
  if (adminDashboard) adminDashboard.classList.add('hidden');

  // Reset login state
  appState.isLoggedIn = false;
  appState.currentUser = null;
}

async function handleAdminLogin(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const credentials = Object.fromEntries(formData.entries());

  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
  submitButton.disabled = true;

  try {
    const result = await authenticateUser(credentials.username, credentials.password);

    if (result.success) {
      appState.isLoggedIn = true;
      appState.currentUser = result.user;

      showAdminDashboard();
      await loadDashboardData();

      showToast(`Welcome back, ${result.user.username}!`, 'success');
    } else {
      showToast(result.message || 'Invalid credentials. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Error during login:', error);
    showToast('Login error. Please try again.', 'error');
  } finally {
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
  }
}

function showAdminDashboard() {
  const adminLogin = document.getElementById('admin-login');
  const adminDashboard = document.getElementById('admin-dashboard');
  const adminUsername = document.getElementById('admin-username');

  if (adminLogin) adminLogin.classList.add('hidden');
  if (adminDashboard) adminDashboard.classList.remove('hidden');

  if (adminUsername && appState.currentUser) {
    adminUsername.textContent = `Welcome, ${appState.currentUser.username}`;
  }

  // Show dashboard section by default
  showAdminSection('dashboard');
}

function showAdminSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.admin-section');
  sections.forEach(section => section.classList.remove('active'));

  // Show selected section
  const targetSection = document.getElementById(`${sectionId}-section`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  appState.currentAdminSection = sectionId;

  // Load section data
  loadSectionData(sectionId);
}

async function loadSectionData(sectionId) {
  switch (sectionId) {
    case 'dashboard':
      await loadDashboardData();
      break;
    case 'bookings':
      await loadBookingsData();
      break;
    case 'clients':
      await loadClientsData();
      break;
    case 'team':
      await loadTeamData();
      break;
    case 'analytics':
      await loadAnalyticsData();
      break;
    case 'finances':
      await loadFinanceData();
      break;
    case 'crm':
      await loadCRMData();
      break;
  }
}

function logoutAdmin() {
  closeAdminPanel();
  showToast('Logged out successfully.', 'success');
}

// ==================== ADMIN DATA LOADING ====================
async function loadDashboardData() {
  try {
    // Load dashboard metrics
    const metricsContainer = document.getElementById('dashboard-metrics');
    if (metricsContainer) {
      metricsContainer.innerHTML = generateMetricsHTML();
    }

    // Load recent bookings
    const recentBookingsBody = document.getElementById('recent-bookings-body');
    if (recentBookingsBody) {
      recentBookingsBody.innerHTML = generateRecentBookingsHTML();
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('Error loading dashboard data.', 'error');
  }
}

async function loadBookingsData() {
  try {
    const bookingsTableBody = document.getElementById('bookings-table-body');
    if (bookingsTableBody) {
      bookingsTableBody.innerHTML = generateBookingsTableHTML();
    }
  } catch (error) {
    console.error('Error loading bookings data:', error);
    showToast('Error loading bookings data.', 'error');
  }
}

async function loadClientsData() {
  try {
    const clientsTableBody = document.getElementById('clients-table-body');
    if (clientsTableBody) {
      clientsTableBody.innerHTML = generateClientsTableHTML();
    }
  } catch (error) {
    console.error('Error loading clients data:', error);
    showToast('Error loading clients data.', 'error');
  }
}

async function loadTeamData() {
  try {
    const teamGridAdmin = document.getElementById('team-grid-admin');
    if (teamGridAdmin) {
      teamGridAdmin.innerHTML = generateTeamGridHTML();
    }
  } catch (error) {
    console.error('Error loading team data:', error);
    showToast('Error loading team data.', 'error');
  }
}

async function loadAnalyticsData() {
  // Analytics data loading logic
  console.log('Loading analytics data...');
}

async function loadFinanceData() {
  // Finance data loading logic
  console.log('Loading finance data...');
}

async function loadCRMData() {
  // CRM data loading logic
  console.log('Loading CRM data...');
}

// ==================== HTML GENERATORS ====================
function generateMetricsHTML() {
  const sampleMetrics = [
    { title: 'Total Bookings', value: '47', change: '+12%', positive: true, icon: '📅' },
    { title: 'Monthly Revenue', value: '₹3,25,000', change: '+25%', positive: true, icon: '💰' },
    { title: 'Pending Payments', value: '₹45,000', change: '-8%', positive: false, icon: '⏳' },
    { title: 'Active Clients', value: '23', change: '+5%', positive: true, icon: '👥' }
  ];

  return sampleMetrics.map(metric => `
    <div class="metric-card">
      <div class="metric-header">
        <div class="metric-title">${metric.title}</div>
        <div class="metric-icon">${metric.icon}</div>
      </div>
      <div class="metric-value">${metric.value}</div>
      <div class="metric-change ${metric.positive ? 'positive' : 'negative'}">${metric.change}</div>
    </div>
  `).join('');
}

function generateRecentBookingsHTML() {
  const sampleBookings = [
    { client: 'Rajesh & Priya', service: 'Wedding', date: '2024-10-15', status: 'confirmed', amount: '₹1,25,000' },
    { client: 'Amit & Sneha', service: 'Pre-Wedding', date: '2024-10-08', status: 'completed', amount: '₹45,000' },
    { client: 'Rohit & Kavya', service: 'Wedding', date: '2024-11-02', status: 'pending', amount: '₹2,00,000' }
  ];

  return sampleBookings.map(booking => `
    <tr>
      <td>${booking.client}</td>
      <td>${booking.service}</td>
      <td>${booking.date}</td>
      <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
      <td>${booking.amount}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editBooking('${booking.client}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteBooking('${booking.client}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function generateBookingsTableHTML() {
  const sampleBookings = [
    { id: 'BK001', client: 'Rajesh & Priya', service: 'Wedding', date: '2024-10-15', package: 'Premium', amount: '₹1,25,000', status: 'confirmed', photographer: 'Tushar Tank' },
    { id: 'BK002', client: 'Amit & Sneha', service: 'Pre-Wedding', date: '2024-10-08', package: 'Cinematic', amount: '₹45,000', status: 'completed', photographer: 'Rakesh Baria' },
    { id: 'BK003', client: 'Rohit & Kavya', service: 'Wedding', date: '2024-11-02', package: 'Luxury', amount: '₹2,00,000', status: 'pending', photographer: 'Unassigned' }
  ];

  return sampleBookings.map(booking => `
    <tr>
      <td>${booking.id}</td>
      <td>${booking.client}</td>
      <td>${booking.service}</td>
      <td>${booking.date}</td>
      <td>${booking.package}</td>
      <td>${booking.amount}</td>
      <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
      <td>${booking.photographer}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editBooking('${booking.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteBooking('${booking.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function generateClientsTableHTML() {
  const sampleClients = [
    { id: 'CL001', name: 'Rajesh & Priya', email: 'rajesh.priya@email.com', phone: '+91 9876543210', eventType: 'Wedding', status: 'Active' },
    { id: 'CL002', name: 'Amit & Sneha', email: 'amit.sneha@email.com', phone: '+91 9876543211', eventType: 'Pre-Wedding', status: 'Completed' },
    { id: 'CL003', name: 'Rohit & Kavya', email: 'rohit.kavya@email.com', phone: '+91 9876543212', eventType: 'Wedding', status: 'Active' }
  ];

  return sampleClients.map(client => `
    <tr>
      <td>${client.id}</td>
      <td>${client.name}</td>
      <td>${client.email}</td>
      <td>${client.phone}</td>
      <td>${client.eventType}</td>
      <td><span class="status-badge ${client.status.toLowerCase()}">${client.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="action-btn edit" onclick="editClient('${client.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteClient('${client.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function generateTeamGridHTML() {
  return appState.appData.team.map(member => `
    <div class="team-card-admin">
      <div class="team-avatar">
        <img src="${member.image}" alt="${member.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">
      </div>
      <h4>${member.name}</h4>
      <p>${member.position}</p>
      <p>${member.experience}</p>
      <div class="action-buttons">
        <button class="btn btn--sm btn--outline" onclick="editTeamMember('${member.name}')">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn--sm btn--secondary" onclick="markAttendance('${member.name}')">
          <i class="fas fa-check"></i> Attendance
        </button>
      </div>
    </div>
  `).join('');
}

// ==================== GOOGLE APPS SCRIPT INTEGRATION ====================
async function authenticateUser(username, password) {
  if (CONFIG.WEB_APP_URL === 'https://script.google.com/macros/s/AKfycby3TyJGvOwXoHBzITaHJOtpmVfPb_Hj9W8p3DTtfgzUAC3mcVWWRQr2bmovJPek7I_sig/exec') {
    // Fallback authentication for testing
    if (username === CONFIG.DEFAULT_ADMIN.username && password === CONFIG.DEFAULT_ADMIN.password) {
      return {
        success: true,
        user: { username: username, role: 'Admin', lastLogin: new Date() }
      };
    }
    return { success: false, message: 'Invalid credentials' };
  }

  try {
    const response = await fetch(CONFIG.WEB_APP_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'authenticate', username, password })
    });

    return await response.json();
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Authentication failed. Please check your connection.' };
  }
}

async function addBooking(bookingData) {
  if (CONFIG.WEB_APP_URL === 'https://script.google.com/macros/s/AKfycby3TyJGvOwXoHBzITaHJOtpmVfPb_Hj9W8p3DTtfgzUAC3mcVWWRQr2bmovJPek7I_sig/exec') {
    // Simulate successful booking for testing
    console.log('Booking data:', bookingData);
    return { success: true, message: 'Booking added successfully', bookingId: 'BK' + Date.now() };
  }

  try {
    const response = await fetch(CONFIG.WEB_APP_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addBooking', bookingData })
    });

    return await response.json();
  } catch (error) {
    console.error('Error adding booking:', error);
    return { success: false, message: 'Failed to add booking. Please try again.' };
  }
}

async function addClient(clientData) {
  if (CONFIG.WEB_APP_URL === 'https://script.google.com/macros/s/AKfycby3TyJGvOwXoHBzITaHJOtpmVfPb_Hj9W8p3DTtfgzUAC3mcVWWRQr2bmovJPek7I_sig/exec') {
    console.log('Client data:', clientData);
    return { success: true, message: 'Client added successfully', clientId: 'CL' + Date.now() };
  }

  try {
    const response = await fetch(CONFIG.WEB_APP_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addClient', clientData })
    });

    return await response.json();
  } catch (error) {
    console.error('Error adding client:', error);
    return { success: false, message: 'Failed to add client. Please try again.' };
  }
}

async function addTeamMember(memberData) {
  if (CONFIG.WEB_APP_URL === 'https://script.google.com/macros/s/AKfycby3TyJGvOwXoHBzITaHJOtpmVfPb_Hj9W8p3DTtfgzUAC3mcVWWRQr2bmovJPek7I_sig/exec') {
    console.log('Team member data:', memberData);
    return { success: true, message: 'Team member added successfully', memberId: 'TM' + Date.now() };
  }

  try {
    const response = await fetch(CONFIG.WEB_APP_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addTeamMember', memberData })
    });

    return await response.json();
  } catch (error) {
    console.error('Error adding team member:', error);
    return { success: false, message: 'Failed to add team member. Please try again.' };
  }
}

async function addExpense(expenseData) {
  if (CONFIG.WEB_APP_URL === 'https://script.google.com/macros/s/AKfycby3TyJGvOwXoHBzITaHJOtpmVfPb_Hj9W8p3DTtfgzUAC3mcVWWRQr2bmovJPek7I_sig/exec') {
    console.log('Expense data:', expenseData);
    return { success: true, message: 'Expense added successfully', expenseId: 'EX' + Date.now() };
  }

  try {
    const response = await fetch(CONFIG.WEB_APP_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'addExpense', expenseData })
    });

    return await response.json();
  } catch (error) {
    console.error('Error adding expense:', error);
    return { success: false, message: 'Failed to add expense. Please try again.' };
  }
}

// ==================== LIGHTBOX ====================
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  // Close lightbox when clicking outside image
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    }
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');

  if (lightbox && lightboxImage && appState.lightboxImages[index]) {
    appState.currentLightboxIndex = index;
    lightboxImage.src = appState.lightboxImages[index];
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

function prevImage() {
  if (appState.lightboxImages.length === 0) return;

  appState.currentLightboxIndex = (appState.currentLightboxIndex - 1 + appState.lightboxImages.length) % appState.lightboxImages.length;

  const lightboxImage = document.getElementById('lightbox-image');
  if (lightboxImage) {
    lightboxImage.src = appState.lightboxImages[appState.currentLightboxIndex];
  }
}

function nextImage() {
  if (appState.lightboxImages.length === 0) return;

  appState.currentLightboxIndex = (appState.currentLightboxIndex + 1) % appState.lightboxImages.length;

  const lightboxImage = document.getElementById('lightbox-image');
  if (lightboxImage) {
    lightboxImage.src = appState.lightboxImages[appState.currentLightboxIndex];
  }
}

// ==================== TOAST NOTIFICATIONS ====================
function initToast() {
  // Toast initialization if needed
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastIcon = toast.querySelector('.toast-icon');
  const toastMessage = toast.querySelector('.toast-message');

  if (!toast || !toastIcon || !toastMessage) return;

  // Set icon based on type
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };

  toastIcon.className = `toast-icon ${icons[type]}`;
  toastMessage.textContent = message;

  // Remove existing type classes and add new type
  toast.classList.remove('success', 'error', 'warning', 'info');
  toast.classList.add(type, 'active');

  // Auto hide after duration
  setTimeout(() => {
    toast.classList.remove('active');
  }, CONFIG.TOAST_DURATION);
}

function closeToast() {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.classList.remove('active');
  }
}

// ==================== SCROLL EFFECTS ====================
function initScrollEffects() {
  // Scroll to top on page load
  window.scrollTo(0, 0);

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  const animatedElements = document.querySelectorAll(
    '.service-card, .gallery-item, .team-member, .blog-card, .contact-item'
  );

  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ==================== ADMIN FUNCTIONS ====================
function openAddBookingModal() {
  openModal('add-booking-modal');
}

function openAddClientModal() {
  openModal('add-client-modal');
}

function openAddTeamMemberModal() {
  openModal('add-team-member-modal');
}

function openAddExpenseModal() {
  openModal('add-expense-modal');
}

function refreshDashboard() {
  loadDashboardData();
  showToast('Dashboard refreshed successfully!', 'success');
}

function exportBookingsPDF() {
  // PDF export functionality
  showToast('Exporting bookings to PDF...', 'info');

  setTimeout(() => {
    showToast('PDF export completed!', 'success');
  }, 2000);
}

function sendBirthdayReminders() {
  showToast('Sending birthday reminders...', 'info');

  setTimeout(() => {
    showToast('Birthday reminders sent successfully!', 'success');
  }, 1500);
}

function sendAnniversaryReminders() {
  showToast('Sending anniversary reminders...', 'info');

  setTimeout(() => {
    showToast('Anniversary reminders sent successfully!', 'success');
  }, 1500);
}

function generateSalaryReport() {
  showToast('Generating salary report...', 'info');

  setTimeout(() => {
    showToast('Salary report generated successfully!', 'success');
  }, 2000);
}

function generateAnalyticsReport() {
  showToast('Generating analytics report...', 'info');

  setTimeout(() => {
    showToast('Analytics report generated successfully!', 'success');
  }, 2000);
}

function exportFinanceReport() {
  showToast('Exporting finance report...', 'info');

  setTimeout(() => {
    showToast('Finance report exported successfully!', 'success');
  }, 2000);
}

function setupAutomation() {
  showToast('Setting up CRM automation...', 'info');

  setTimeout(() => {
    showToast('CRM automation configured successfully!', 'success');
  }, 1500);
}

function exportCRMData() {
  showToast('Exporting CRM data...', 'info');

  setTimeout(() => {
    showToast('CRM data exported successfully!', 'success');
  }, 2000);
}

function editBooking(id) {
  showToast(`Opening booking ${id} for editing...`, 'info');
}

function deleteBooking(id) {
  if (confirm(`Are you sure you want to delete booking ${id}?`)) {
    showToast(`Booking ${id} deleted successfully!`, 'success');
  }
}

function editClient(id) {
  showToast(`Opening client ${id} for editing...`, 'info');
}

function deleteClient(id) {
  if (confirm(`Are you sure you want to delete client ${id}?`)) {
    showToast(`Client ${id} deleted successfully!`, 'success');
  }
}

function editTeamMember(name) {
  showToast(`Opening ${name} profile for editing...`, 'info');
}

function markAttendance(name) {
  showToast(`Attendance marked for ${name}`, 'success');
}

// ==================== UTILITY FUNCTIONS ====================
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ==================== ERROR HANDLING ====================
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
  showToast('An unexpected error occurred. Please refresh the page.', 'error');
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
  showToast('A network error occurred. Please check your connection.', 'error');
});

// ==================== PERFORMANCE MONITORING ====================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// ==================== CONSOLE BRANDING ====================
console.log(
  '%c🎥 RN PhotoFilms Website %c⚡ Powered by Modern Web Technologies',
  'color: #2563eb; font-size: 24px; font-weight: bold;',
  'color: #059669; font-size: 16px;'
);

console.log(
  '%cFeatures: ✨ Modern UI/UX ⚡ Fast Performance 📱 Mobile Responsive 🔐 Admin Panel 📊 Analytics 💾 Google Sheets Integration',
  'color: #6b7280; font-size: 14px;'
);

// ==================== EXPORT FOR MODULE SYSTEMS ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    appState,
    CONFIG,
    initializeApp,
    showToast,
    formatDate,
    formatCurrency
  };
}
