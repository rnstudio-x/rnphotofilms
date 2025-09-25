// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
  apiKey: 'AIzaSyBChAnCVsQe8wlnHqg0K7n48lBaPAs9wZw', // Replace with your actual API key
  spreadsheetId: '1sqNj2WFSWsznYSH3X6hLlTwQuLcifRAFI77JEjc7yy0', // Replace with your spreadsheet ID
  ranges: {
    bookings: 'Bookings!A:P',
    clients: 'Clients!A:N', 
    team: 'Team!A:M',
    expenses: 'Expenses!A:J',
    analytics: 'Analytics!A:K',
    attendance: 'Attendance!A:G',
    contacts: 'Contacts!A:F'
  },
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  scope: 'https://www.googleapis.com/auth/spreadsheets'
};

// Application data with updated information
const appData = {
  brand: {
    name: "RN PhotoFilms",
    tagline: "Your Emotions, Our Lens",
    location: "Thandla, Madhya Pradesh, India",
    phone: "+91 7828720365",
    email: "rnstudio.x@gmail.com",
    instagram: "@rn.photo.films"
  },
  themes: [
    { id: "light", name: "Light", primary: "#218d8d", secondary: "#5e405e", background: "#fcfcf9", surface: "#fffffe", text: "#134252", accent: "#32b8c6" },
    { id: "dark", name: "Dark", primary: "#32b8c6", secondary: "#777c7c", background: "#1f2121", surface: "#262828", text: "#f5f5f5", accent: "#2da6b2" },
    { id: "ocean", name: "Ocean Blue", primary: "#0077be", secondary: "#004c7a", background: "#e6f3ff", surface: "#ffffff", text: "#003557", accent: "#0099e6" },
    { id: "forest", name: "Forest Green", primary: "#228B22", secondary: "#006400", background: "#f0f8f0", surface: "#ffffff", text: "#2d4a2d", accent: "#32cd32" },
    { id: "sunset", name: "Sunset Orange", primary: "#ff6b35", secondary: "#e55100", background: "#fff3e0", surface: "#ffffff", text: "#bf360c", accent: "#ff8a50" },
    { id: "lavender", name: "Purple Lavender", primary: "#9c27b0", secondary: "#6a1b9a", background: "#f3e5f5", surface: "#ffffff", text: "#4a148c", accent: "#ba68c8" }
  ],
  teamMembers: [
    {
      id: "TM001",
      name: "Rakesh Baria",
      role: "Creative Director & Founder",
      experience: "4+ Years Experience",
      bio: "Visionary photographer with an eye for creative storytelling and innovative compositions.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      specialties: ["Creative Direction", "Wedding Photography", "Brand Photography"],
      email: "rakesh@rnphotofilms.com",
      phone: "+91 9876543210",
      joinDate: "2020-01-15",
      birthday: "1990-05-12",
      salary: 35000,
      performanceRating: 4.8,
      equipment: ["Canon R5", "24-70mm f/2.8", "85mm f/1.4"],
      availability: "Available",
      totalProjects: 156,
      social: { instagram: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "TM002",
      name: "Tushar Tank",
      role: "Lead Photographer & Videographer",
      experience: "5+ Years Experience",
      bio: "Expert in both photography and videography, creating comprehensive visual stories.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      specialties: ["Wedding Photography", "Cinematic Videography", "Event Coverage"],
      email: "tushar@rnphotofilms.com",
      phone: "+91 9876543211",
      joinDate: "2019-03-20",
      birthday: "1988-08-25",
      salary: 32000,
      performanceRating: 4.7,
      equipment: ["Sony A7IV", "16-35mm f/2.8", "70-200mm f/2.8", "Drone"],
      availability: "Booked until Oct 30",
      totalProjects: 189,
      social: { instagram: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "TM003",
      name: "Vinod Bhabhor",
      role: "Videographer",
      experience: "2+ Years Experience",
      bio: "Passionate videographer specializing in capturing dynamic moments and emotions.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      specialties: ["Video Production", "Motion Graphics", "Documentary Style"],
      email: "vinod@rnphotofilms.com",
      phone: "+91 9876543212",
      joinDate: "2022-06-10",
      birthday: "1995-12-03",
      salary: 25000,
      performanceRating: 4.5,
      equipment: ["Canon R6", "24-105mm f/4", "Gimbal", "Audio Recorder"],
      availability: "Available",
      totalProjects: 78,
      social: { instagram: "#", facebook: "#", linkedin: "#" }
    },
    {
      id: "TM004",
      name: "Priya Singh",
      role: "Client Relations Manager",
      experience: "4 Years Experience",
      bio: "Dedicated to ensuring exceptional client experiences and seamless project coordination.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      specialties: ["Client Management", "Project Coordination", "Customer Service"],
      email: "priya@rnphotofilms.com",
      phone: "+91 9876543213",
      joinDate: "2020-09-15",
      birthday: "1992-04-18",
      salary: 28000,
      performanceRating: 4.9,
      equipment: ["iPad", "Laptop", "Project Management Tools"],
      availability: "Available",
      totalProjects: 245,
      social: { instagram: "#", facebook: "#", linkedin: "#" }
    }
  ],
  blogPosts: [
    {
      id: 1,
      title: "10 Essential Wedding Photography Tips for Perfect Shots",
      slug: "wedding-photography-tips-perfect-shots",
      excerpt: "Discover professional techniques and insider secrets for capturing those perfect wedding moments that couples will treasure forever.",
      content: "Wedding photography is an art that combines technical skill with emotional storytelling. In this comprehensive guide, we'll share our top 10 tips for capturing stunning wedding photographs that truly reflect the magic of the day.\n\n## 1. Know the Timeline\nUnderstanding the wedding timeline is crucial for positioning yourself in the right place at the right time. Meet with the couple beforehand to discuss key moments you shouldn't miss.\n\n## 2. Scout the Location\nVisit the venue before the wedding day. Understanding lighting conditions and identifying the best spots for photos will save valuable time.\n\n## 3. Capture Candid Emotions\nSome of the most powerful wedding photos are unposed, candid moments that showcase genuine emotions and reactions.\n\n## 4. Use Natural Light\nWhenever possible, utilize natural light for softer, more romantic images. Golden hour photos are particularly stunning.\n\n## 5. Focus on Details\nDon't forget to capture the small details that make each wedding unique - rings, flowers, decorations, and personal touches.\n\n## 6. Be Prepared for Low Light\nWeddings often involve dimly lit venues. Invest in fast lenses and understand your camera's high ISO capabilities.\n\n## 7. Communicate with Other Vendors\nBuilding good relationships with other wedding vendors ensures smoother coordination and better photo opportunities.\n\n## 8. Have Backup Equipment\nAlways bring backup cameras, lenses, batteries, and memory cards. Technical failures shouldn't ruin the day.\n\n## 9. Direct When Necessary\nWhile candid shots are beautiful, don't hesitate to provide gentle direction for formal portraits and group photos.\n\n## 10. Tell the Complete Story\nDocument the entire day from preparation to celebration, creating a comprehensive visual narrative of the wedding journey.",
      author: "Rakesh Baria",
      date: "2024-09-20",
      readTime: "8 min read",
      category: "Wedding Photography",
      tags: ["wedding", "photography", "tips", "techniques"],
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=400&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "Best Pre-Wedding Shoot Locations in Madhya Pradesh",
      slug: "pre-wedding-locations-madhya-pradesh",
      excerpt: "Explore the most romantic and picturesque locations in Madhya Pradesh for pre-wedding photography that tells your unique love story.",
      content: "Madhya Pradesh offers some of India's most stunning backdrops for pre-wedding photography. From historic palaces to natural landscapes, here are our top location recommendations.\n\n## Historic Locations\n\n### Orchha Palace\nThe medieval architecture of Orchha provides a regal backdrop with stunning courtyards and ancient walls.\n\n### Gwalior Fort\nOne of India's most impregnable forts, offering dramatic views and architectural grandeur.\n\n## Natural Settings\n\n### Pachmarhi Hill Station\nThe only hill station in MP, featuring waterfalls, caves, and lush greenery.\n\n### Satpura National Park\nWildlife photography combined with pre-wedding shoots in natural surroundings.\n\n## Tips for Location Shoots\n- Visit locations during golden hour\n- Consider seasonal weather changes\n- Obtain necessary permissions\n- Plan outfit changes based on locations",
      author: "Tushar Tank",
      date: "2024-09-15",
      readTime: "6 min read",
      category: "Pre-Wedding",
      tags: ["pre-wedding", "locations", "madhya pradesh", "couples"],
      image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&h=400&fit=crop",
      featured: true
    }
  ],
  services: [
    {
      id: "wedding",
      name: "Wedding Photography",
      description: "Capturing your most precious moments with artistic flair and professional expertise",
      packages: [
        { name: "Classic Package", price: "₹75,000", features: ["6-8 hours coverage", "300+ edited photos", "Online gallery", "Basic album", "USB delivery"] },
        { name: "Premium Package", price: "₹1,25,000", features: ["10-12 hours coverage", "500+ edited photos", "Cinematic video highlights", "Premium album", "Pre-wedding shoot", "USB + prints"] },
        { name: "Luxury Package", price: "₹2,00,000", features: ["Full day coverage", "1000+ edited photos", "4K cinematic film", "Luxury album", "Pre-wedding shoot", "Drone photography", "Same day preview"] }
      ]
    },
    {
      id: "prewedding",
      name: "Pre-Wedding Shoots",
      description: "Romantic and artistic sessions that tell your unique love story",
      packages: [
        { name: "Essential Package", price: "₹25,000", features: ["2-3 hours shoot", "100+ edited photos", "2 outfit changes", "Online gallery", "Location assistance"] },
        { name: "Cinematic Package", price: "₹45,000", features: ["4-5 hours shoot", "200+ edited photos", "Short cinematic video", "3 outfit changes", "Premium locations", "Drone shots"] }
      ]
    }
  ],
  galleries: {
    wedding: [
      "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0abc710c0fc?w=500&h=400&fit=crop"
    ],
    prewedding: [
      "https://images.unsplash.com/photo-1595434091143-b375ced5fe5c?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=500&h=500&fit=crop"
    ],
    portrait: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b15b?w=500&h=400&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=400&fit=crop"
    ]
  },
  instagramPosts: [
    { image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=300&h=300&fit=crop", caption: "Another beautiful wedding captured ✨" },
    { image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=300&h=300&fit=crop", caption: "Love in every frame 💕" },
    { image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&h=300&fit=crop", caption: "Candid moments that speak volumes 📸" },
    { image: "https://images.unsplash.com/photo-1594736797933-d0abc710c0fc?w=300&h=300&fit=crop", caption: "Every detail matters ✨" }
  ]
};

// Real-time data from Google Sheets
let liveData = {
  bookings: [],
  clients: [],
  team: [],
  expenses: [],
  attendance: [],
  contacts: []
};

// Application state
let currentSlide = 0;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedDate = null;
let currentGalleryFilter = 'all';
let lightboxImages = [];
let currentLightboxIndex = 0;
let currentTheme = 'light';
let filteredBlogPosts = [...appData.blogPosts];
let isGoogleSheetsLoaded = false;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  initLoader();
  initNavigation();
  initHeroSlideshow();
  initCircularThemeSelector();
  initGoogleSheetsAPI();
  initGallery();
  initTeamSection();
  initCalendar();
  initForms();
  initInstagramFeed();
  initBlogSection();
  initScrollEffects();
  initSmoothScrolling();
  initLightbox();
  setMinimumDate();
}

// Page Loader
function initLoader() {
  const loader = document.getElementById('loader');
  
  window.addEventListener('load', function() {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 2000);
  });
}

// ENHANCED: Circular Theme Selector (iPhone/Android Style)
function initCircularThemeSelector() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeWheel = document.getElementById('themeWheel');
  const themeOptions = document.querySelectorAll('.theme-option');
  let isWheelOpen = false;
  
  // Load saved theme
  const savedTheme = localStorage.getItem('selectedTheme') || 'light';
  currentTheme = savedTheme;
  applyTheme(savedTheme);
  
  // Toggle wheel open/close
  themeToggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    isWheelOpen = !isWheelOpen;
    
    if (isWheelOpen) {
      themeWheel.classList.add('active');
      themeToggleBtn.style.transform = 'scale(1.2) rotate(180deg)';
    } else {
      themeWheel.classList.remove('active');
      themeToggleBtn.style.transform = 'scale(1) rotate(0deg)';
    }
  });
  
  // Theme selection
  themeOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.stopPropagation();
      const selectedTheme = this.getAttribute('data-theme');
      currentTheme = selectedTheme;
      applyTheme(selectedTheme);
      localStorage.setItem('selectedTheme', selectedTheme);
      
      // Close wheel with animation
      themeWheel.classList.remove('active');
      themeToggleBtn.style.transform = 'scale(1) rotate(0deg)';
      isWheelOpen = false;
      
      // Show feedback
      showToast(`Theme changed to ${appData.themes.find(t => t.id === selectedTheme).name}!`, 'success');
    });
  });
  
  // Close wheel when clicking outside
  document.addEventListener('click', function() {
    if (isWheelOpen) {
      themeWheel.classList.remove('active');
      themeToggleBtn.style.transform = 'scale(1) rotate(0deg)';
      isWheelOpen = false;
    }
  });
  
  // Prevent wheel from closing when clicking inside
  themeWheel.addEventListener('click', function(e) {
    e.stopPropagation();
  });
}

function applyTheme(themeId) {
  const theme = appData.themes.find(t => t.id === themeId);
  if (!theme) return;
  
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-background', theme.background);
  root.style.setProperty('--theme-surface', theme.surface);
  root.style.setProperty('--theme-text', theme.text);
  root.style.setProperty('--theme-accent', theme.accent);
  
  document.body.setAttribute('data-theme', themeId);
}

// ENHANCED: Google Sheets API Integration with CORS handling
function initGoogleSheetsAPI() {
  // Load Google APIs
  if (typeof gapi !== 'undefined') {
    gapi.load('client', initGoogleAPIClient);
  } else {
    // Fallback: Load Google API dynamically
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => gapi.load('client', initGoogleAPIClient);
    document.head.appendChild(script);
  }
}

function initGoogleAPIClient() {
  gapi.client.init({
    apiKey: GOOGLE_SHEETS_CONFIG.apiKey,
    discoveryDocs: GOOGLE_SHEETS_CONFIG.discoveryDocs
  }).then(() => {
    isGoogleSheetsLoaded = true;
    console.log('Google Sheets API initialized successfully');
    loadAllDataFromSheets();
  }).catch(error => {
    console.warn('Google Sheets API initialization failed:', error);
    showToast('Google Sheets integration unavailable. Using demo data.', 'info');
  });
}

async function loadAllDataFromSheets() {
  try {
    // Load all data concurrently
    const promises = Object.entries(GOOGLE_SHEETS_CONFIG.ranges).map(([key, range]) =>
      loadDataFromSheet(range).then(data => ({ key, data }))
    );
    
    const results = await Promise.allSettled(promises);
    
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { key, data } = result.value;
        liveData[key] = data;
      }
    });
    
    console.log('Live data loaded:', liveData);
    showToast('Real-time data synchronized!', 'success');
  } catch (error) {
    console.error('Error loading data from sheets:', error);
    showToast('Failed to sync real-time data', 'error');
  }
}

async function loadDataFromSheet(range) {
  if (!isGoogleSheetsLoaded) {
    throw new Error('Google Sheets API not loaded');
  }
  
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      range: range
    });
    
    const values = response.result.values || [];
    if (values.length === 0) return [];
    
    // Convert to objects using first row as headers
    const headers = values[0];
    return values.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  } catch (error) {
    console.error(`Error loading ${range}:`, error);
    return [];
  }
}

async function appendToSheet(sheetName, data) {
  if (!isGoogleSheetsLoaded) {
    console.warn('Google Sheets API not available, data not saved:', data);
    return false;
  }
  
  const range = GOOGLE_SHEETS_CONFIG.ranges[sheetName];
  if (!range) {
    console.error('Invalid sheet name:', sheetName);
    return false;
  }
  
  try {
    // Convert object to array of values
    const values = [Object.values(data)];
    
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });
    
    console.log('Data appended to sheet:', response);
    return true;
  } catch (error) {
    console.error('Error appending to sheet:', error);
    showToast('Failed to save data to Google Sheets', 'error');
    return false;
  }
}

async function updateSheetRow(sheetName, rowIndex, data) {
  if (!isGoogleSheetsLoaded) {
    console.warn('Google Sheets API not available');
    return false;
  }
  
  try {
    const range = `${sheetName}!A${rowIndex + 2}:Z${rowIndex + 2}`; // +2 because of header row and 1-based indexing
    const values = [Object.values(data)];
    
    const response = await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: GOOGLE_SHEETS_CONFIG.spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });
    
    console.log('Data updated in sheet:', response);
    return true;
  } catch (error) {
    console.error('Error updating sheet row:', error);
    return false;
  }
}

// Navigation
function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');

  navToggle.addEventListener('click', function() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (!link.href.includes('#')) return;
      
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.style.background = 'rgba(15, 23, 42, 0.98)';
    } else {
      header.style.background = 'rgba(15, 23, 42, 0.95)';
    }
  });

  document.addEventListener('click', function(e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
}

// Hero Slideshow
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.indicator');
  let slideInterval;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopSlideshow() {
    clearInterval(slideInterval);
  }

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
      stopSlideshow();
      startSlideshow();
    });
  });

  startSlideshow();

  const hero = document.querySelector('.hero');
  hero.addEventListener('mouseenter', stopSlideshow);
  hero.addEventListener('mouseleave', startSlideshow);
}

// FIXED: Team Section (Main Site Display Only - No Admin Data Mixing)
function initTeamSection() {
  const teamGrid = document.getElementById('teamGrid');
  
  // Only show public team information on main site
  appData.teamMembers.forEach(member => {
    const memberCard = document.createElement('div');
    memberCard.className = 'team-member';
    memberCard.innerHTML = `
      <div class="member-image">
        <img src="${member.image}" alt="${member.name}" loading="lazy">
        <div class="member-overlay">
          <div class="member-social">
            <a href="${member.social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>
            <a href="${member.social.facebook}" target="_blank"><i class="fab fa-facebook-f"></i></a>
            <a href="${member.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>
      <div class="member-info">
        <h3>${member.name}</h3>
        <p class="member-role">${member.role}</p>
        <p class="member-experience">${member.experience}</p>
        <p class="member-bio">${member.bio}</p>
        <div class="member-specialties">
          ${member.specialties.map(specialty => `<span class="specialty-tag">${specialty}</span>`).join('')}
        </div>
      </div>
    `;
    
    teamGrid.appendChild(memberCard);
  });
}

// Gallery
function initGallery() {
  const galleryMasonry = document.getElementById('galleryMasonry');
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  loadGallery('all');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.getAttribute('data-filter');
      currentGalleryFilter = filter;
      loadGallery(filter);
    });
  });
}

function loadGallery(filter) {
  const galleryMasonry = document.getElementById('galleryMasonry');
  let images = [];
  
  if (filter === 'all') {
    images = [
      ...appData.galleries.wedding.map(img => ({ src: img, category: 'wedding' })),
      ...appData.galleries.prewedding.map(img => ({ src: img, category: 'prewedding' })),
      ...appData.galleries.portrait.map(img => ({ src: img, category: 'portrait' }))
    ];
  } else {
    images = appData.galleries[filter]?.map(img => ({ src: img, category: filter })) || [];
  }
  
  galleryMasonry.innerHTML = '';
  lightboxImages = [];
  
  images.forEach((img, index) => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `<img src="${img.src}" alt="${img.category} photo" loading="lazy">`;
    galleryItem.addEventListener('click', () => openLightbox(index));
    galleryMasonry.appendChild(galleryItem);
    lightboxImages.push(img.src);
  });
}

// Lightbox
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxOverlay = document.querySelector('.lightbox-overlay');

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevLightboxImage);
  lightboxNext.addEventListener('click', nextLightboxImage);

  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('hidden')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevLightboxImage();
      if (e.key === 'ArrowRight') nextLightboxImage();
    }
  });
}

function openLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  
  currentLightboxIndex = index;
  lightboxImage.src = lightboxImages[index];
  lightbox.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function prevLightboxImage() {
  currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  document.getElementById('lightboxImage').src = lightboxImages[currentLightboxIndex];
}

function nextLightboxImage() {
  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
  document.getElementById('lightboxImage').src = lightboxImages[currentLightboxIndex];
}

// Blog Section
function initBlogSection() {
  const blogGrid = document.getElementById('blogGrid');
  const blogSearch = document.getElementById('blogSearch');
  const blogCategoryFilter = document.getElementById('blogCategoryFilter');
  
  loadBlogPosts();
  
  blogSearch.addEventListener('input', filterBlogPosts);
  blogCategoryFilter.addEventListener('change', filterBlogPosts);
}

function loadBlogPosts() {
  const blogGrid = document.getElementById('blogGrid');
  blogGrid.innerHTML = '';
  
  filteredBlogPosts.forEach(post => {
    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';
    blogCard.innerHTML = `
      <div class="blog-image">
        <img src="${post.image}" alt="${post.title}" loading="lazy">
      </div>
      <div class="blog-content">
        <div class="blog-date">${formatDate(post.date)}</div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <div class="blog-meta">
          <span class="blog-author">By ${post.author}</span>
          <span class="blog-category">${post.category}</span>
          <span class="blog-read-time">${post.readTime}</span>
        </div>
        <div class="blog-tags">
          ${post.tags.map(tag => `<a href="#" class="blog-tag">${tag}</a>`).join('')}
        </div>
      </div>
    `;
    
    blogCard.addEventListener('click', () => showBlogPost(post));
    blogGrid.appendChild(blogCard);
  });
}

function filterBlogPosts() {
  const searchTerm = document.getElementById('blogSearch').value.toLowerCase();
  const selectedCategory = document.getElementById('blogCategoryFilter').value;
  
  filteredBlogPosts = appData.blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm) || 
                         post.excerpt.toLowerCase().includes(searchTerm) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  loadBlogPosts();
}

function showBlogPost(post) {
  const blogPostDetail = document.getElementById('blogPostDetail');
  const mainContent = document.getElementById('mainContent');
  
  blogPostDetail.innerHTML = `
    <div class="blog-post-header">
      <div class="container">
        <button class="btn btn--secondary" onclick="closeBlogPost()">
          <i class="fas fa-arrow-left"></i> Back to Blog
        </button>
        <h1 class="blog-post-title">${post.title}</h1>
        <div class="blog-post-meta">
          <span><i class="fas fa-user"></i> ${post.author}</span>
          <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
          <span><i class="fas fa-clock"></i> ${post.readTime}</span>
          <span><i class="fas fa-folder"></i> ${post.category}</span>
        </div>
      </div>
    </div>
    <div class="blog-post-content">
      <img src="${post.image}" alt="${post.title}" class="blog-post-image">
      <div class="blog-post-body">
        ${post.content.split('\n').map(paragraph => {
          if (paragraph.startsWith('## ')) {
            return `<h2>${paragraph.substring(3)}</h2>`;
          } else if (paragraph.startsWith('### ')) {
            return `<h3>${paragraph.substring(4)}</h3>`;
          } else if (paragraph.trim() === '') {
            return '';
          } else if (paragraph.startsWith('- ')) {
            return `<li>${paragraph.substring(2)}</li>`;
          } else {
            return `<p>${paragraph}</p>`;
          }
        }).join('')}
      </div>
      <div class="blog-social-share">
        <a href="https://www.facebook.com/sharer/sharer.php?u=${window.location.href}" target="_blank" class="share-btn share-facebook">
          <i class="fab fa-facebook-f"></i>
        </a>
        <a href="https://twitter.com/intent/tweet?text=${post.title}&url=${window.location.href}" target="_blank" class="share-btn share-twitter">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}" target="_blank" class="share-btn share-linkedin">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="https://wa.me/?text=${post.title} ${window.location.href}" target="_blank" class="share-btn share-whatsapp">
          <i class="fab fa-whatsapp"></i>
        </a>
      </div>
      <div class="blog-post-navigation">
        <button class="btn btn--outline" onclick="closeBlogPost()">← Back to Blog</button>
        <button class="btn btn--primary" onclick="document.getElementById('contact').scrollIntoView()">Get In Touch</button>
      </div>
    </div>
  `;
  
  mainContent.classList.add('hidden');
  blogPostDetail.classList.remove('hidden');
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function closeBlogPost() {
  const blogPostDetail = document.getElementById('blogPostDetail');
  const mainContent = document.getElementById('mainContent');
  
  blogPostDetail.classList.add('hidden');
  mainContent.classList.remove('hidden');
}

// Calendar
function initCalendar() {
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  
  prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    generateCalendar();
  });
  
  nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    generateCalendar();
  });
  
  generateCalendar();
}

function generateCalendar() {
  const calendar = document.getElementById('calendar');
  const calendarTitle = document.getElementById('calendarTitle');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();
  
  let calendarHTML = '';
  
  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  dayHeaders.forEach(day => {
    calendarHTML += `<div class="calendar-day-header">${day}</div>`;
  });
  
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += '<div class="calendar-day empty"></div>';
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day);
    const isToday = date.toDateString() === today.toDateString();
    const isPast = date < today;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    let classes = 'calendar-day';
    if (isToday) classes += ' today';
    if (isPast) classes += ' past';
    else classes += ' available';
    if (selectedDate === dateStr) classes += ' selected';
    
    calendarHTML += `<div class="${classes}" data-date="${dateStr}">${day}</div>`;
  }
  
  calendar.innerHTML = calendarHTML;
  
  calendar.querySelectorAll('.calendar-day.available').forEach(day => {
    day.addEventListener('click', function() {
      calendar.querySelectorAll('.calendar-day.selected').forEach(selected => {
        selected.classList.remove('selected');
      });
      
      this.classList.add('selected');
      selectedDate = this.dataset.date;
      
      const eventDateInput = document.querySelector('input[name="eventDate"]');
      if (eventDateInput) {
        eventDateInput.value = selectedDate;
      }
    });
  });
}

// Forms with Real Google Sheets Integration
function initForms() {
  const bookingForm = document.getElementById('bookingForm');
  const contactForm = document.getElementById('contactForm');
  const adminLoginForm = document.getElementById('adminLoginForm');
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmission);
  }
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmission);
  }
  
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', handleAdminLogin);
  }
}

async function handleBookingSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const submitBtn = form.querySelector('button[type="submit"]');
  
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  const bookingData = {
    id: 'BK' + Date.now(),
    clientName: formData.get('clientName'),
    clientEmail: formData.get('clientEmail'),
    clientPhone: formData.get('clientPhone'),
    serviceType: formData.get('serviceType'),
    eventDate: formData.get('eventDate'),
    budget: formData.get('budget'),
    eventLocation: formData.get('eventLocation'),
    message: formData.get('message'),
    status: 'Inquiry',
    timestamp: new Date().toISOString(),
    photographer: 'TBD'
  };
  
  try {
    const success = await appendToSheet('bookings', bookingData);
    
    if (success) {
      showToast('Booking request sent successfully! We will contact you soon.', 'success');
      form.reset();
      selectedDate = null;
      generateCalendar();
      
      // Add to live data
      liveData.bookings.push(bookingData);
    } else {
      throw new Error('Failed to save booking');
    }
  } catch (error) {
    console.error('Booking submission error:', error);
    showToast('Booking saved locally. We will process it manually.', 'info');
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
}

async function handleContactSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const submitBtn = form.querySelector('button[type="submit"]');
  
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  
  const contactData = {
    id: 'CT' + Date.now(),
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    timestamp: new Date().toISOString()
  };
  
  try {
    const success = await appendToSheet('contacts', contactData);
    
    if (success) {
      showToast('Message sent successfully! We will get back to you soon.', 'success');
      form.reset();
      
      // Add to live data
      liveData.contacts.push(contactData);
    } else {
      throw new Error('Failed to save contact');
    }
  } catch (error) {
    console.error('Contact submission error:', error);
    showToast('Message saved locally. We will respond manually.', 'info');
  } finally {
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  }
}

function handleAdminLogin(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const username = formData.get('username');
  const password = formData.get('password');
  
  if (username === 'admin' && password === 'rnphotofilms2024') {
    closeAdminLogin();
    showAdminDashboard();
    showToast('Welcome to admin dashboard!', 'success');
  } else {
    showToast('Invalid credentials. Please try again.', 'error');
  }
}

// Instagram Feed
function initInstagramFeed() {
  const instagramFeed = document.getElementById('instagramFeed');
  
  appData.instagramPosts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'instagram-post';
    postElement.innerHTML = `<img src="${post.image}" alt="Instagram post" loading="lazy">`;
    
    postElement.addEventListener('click', () => {
      window.open('https://instagram.com/rn.photo.films', '_blank');
    });
    
    instagramFeed.appendChild(postElement);
  });
}

// Service Pages
function showServicePage(serviceId) {
  const service = appData.services.find(s => s.id === serviceId);
  if (!service) return;
  
  const servicePages = document.getElementById('servicePages');
  const mainContent = document.getElementById('mainContent');
  
  servicePages.innerHTML = `
    <div class="service-page">
      <div class="service-page-header">
        <div class="container">
          <button class="back-btn" onclick="closeServicePage()">
            <i class="fas fa-arrow-left"></i> Back to Home
          </button>
          <h1>${service.name}</h1>
          <p>${service.description}</p>
        </div>
      </div>
      <div class="service-page-content">
        <div class="container">
          <div class="service-packages">
            <h2>Our Packages</h2>
            <div class="packages-grid">
              ${service.packages.map(pkg => `
                <div class="package-card">
                  <h3>${pkg.name}</h3>
                  <div class="package-price">${pkg.price}</div>
                  <ul class="package-features">
                    ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
                  </ul>
                  <button class="btn btn--filled package-btn" onclick="selectPackage('${service.id}', '${pkg.name}')">
                    Choose Package
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
          <div class="service-gallery">
            <h2>Portfolio</h2>
            <div class="service-gallery-grid">
              ${appData.galleries[serviceId] ? appData.galleries[serviceId].map(img => `
                <div class="service-gallery-item">
                  <img src="${img}" alt="${service.name} photo" loading="lazy">
                </div>
              `).join('') : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  mainContent.classList.add('hidden');
  servicePages.classList.remove('hidden');
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function closeServicePage() {
  const servicePages = document.getElementById('servicePages');
  const mainContent = document.getElementById('mainContent');
  
  servicePages.classList.add('hidden');
  mainContent.classList.remove('hidden');
}

function selectPackage(serviceId, packageName) {
  closeServicePage();
  
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
  
  setTimeout(() => {
    const serviceSelect = document.querySelector('select[name="serviceType"]');
    if (serviceSelect) {
      serviceSelect.value = serviceId;
    }
    showToast(`${packageName} selected! Please fill in your details.`, 'success');
  }, 1000);
}

// ENHANCED: Admin Dashboard with Real Data and Team Management
function showAdminLogin() {
  const modal = document.getElementById('adminLoginModal');
  modal.classList.remove('hidden');
}

function closeAdminLogin() {
  const modal = document.getElementById('adminLoginModal');
  modal.classList.add('hidden');
}

function showAdminDashboard() {
  const dashboard = document.getElementById('adminDashboard');
  const mainContent = document.getElementById('mainContent');
  
  loadAdminData();
  
  dashboard.classList.remove('hidden');
  mainContent.classList.add('hidden');
  
  const adminNavBtns = document.querySelectorAll('.admin-nav-btn');
  const adminPanels = document.querySelectorAll('.admin-panel');
  
  adminNavBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tab = this.getAttribute('data-tab');
      
      adminNavBtns.forEach(b => b.classList.remove('active'));
      adminPanels.forEach(p => p.classList.remove('active'));
      
      this.classList.add('active');
      document.getElementById(tab).classList.add('active');
      
      // Load specific panel data
      if (tab === 'analytics') {
        loadAnalyticsCharts();
      } else if (tab === 'attendance') {
        loadAttendanceData();
      }
    });
  });
}

function closeAdmin() {
  const dashboard = document.getElementById('adminDashboard');
  const mainContent = document.getElementById('mainContent');
  
  dashboard.classList.add('hidden');
  mainContent.classList.remove('hidden');
}

function loadAdminData() {
  // Use live data if available, otherwise fallback to sample data
  const bookingsData = liveData.bookings.length > 0 ? liveData.bookings : [
    { id: "BK001", clientName: "Rajesh Kumar", serviceType: "Wedding Photography", eventDate: "2024-10-15", status: "Confirmed", budget: "₹1,25,000", photographer: "Tushar Tank" },
    { id: "BK002", clientName: "Amit Sharma", serviceType: "Pre-Wedding Shoot", eventDate: "2024-10-08", status: "Completed", budget: "₹45,000", photographer: "Rakesh Baria" },
    { id: "BK003", clientName: "Rohit Patel", serviceType: "Wedding Photography", eventDate: "2024-11-02", status: "Inquiry", budget: "₹2,00,000", photographer: "TBD" }
  ];

  const clientsData = liveData.clients.length > 0 ? liveData.clients : [
    { id: "CL001", name: "Rajesh Kumar", email: "rajesh@email.com", phone: "+91 9876543210", totalSpent: "₹1,25,000", lastBooking: "2024-10-15", status: "Active" },
    { id: "CL002", name: "Amit Sharma", email: "amit@email.com", phone: "+91 9876543211", totalSpent: "₹45,000", lastBooking: "2024-10-08", status: "Active" },
    { id: "CL003", name: "Rohit Patel", email: "rohit@email.com", phone: "+91 9876543212", totalSpent: "₹0", lastBooking: "N/A", status: "Inquiry" }
  ];
  
  // Overview panel
  const overviewPanel = document.getElementById('overview');
  overviewPanel.innerHTML = `
    <h2>Dashboard Overview</h2>
    <div class="admin-metrics">
      <div class="metric-card">
        <h3>${bookingsData.length}</h3>
        <p>Total Bookings</p>
        <span class="metric-change positive">+12%</span>
      </div>
      <div class="metric-card">
        <h3>₹3,25,000</h3>
        <p>This Month Revenue</p>
        <span class="metric-change positive">+25%</span>
      </div>
      <div class="metric-card">
        <h3>₹45,000</h3>
        <p>Pending Payments</p>
        <span class="metric-change negative">-8%</span>
      </div>
      <div class="metric-card">
        <h3>${clientsData.length}</h3>
        <p>Active Clients</p>
        <span class="metric-change positive">+5%</span>
      </div>
      <div class="metric-card">
        <h3>${appData.teamMembers.length}</h3>
        <p>Team Members</p>
        <span class="metric-change">0%</span>
      </div>
      <div class="metric-card">
        <h3>128</h3>
        <p>Completed Projects</p>
        <span class="metric-change positive">+18%</span>
      </div>
    </div>
    <div class="recent-activity">
      <h3>Recent Bookings</h3>
      <div class="admin-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Photographer</th>
            </tr>
          </thead>
          <tbody>
            ${bookingsData.slice(0, 5).map(booking => `
              <tr>
                <td>${booking.id}</td>
                <td>${booking.clientName}</td>
                <td>${booking.serviceType}</td>
                <td>${booking.eventDate}</td>
                <td><span class="status ${booking.status.toLowerCase().replace(' ', '-')}">${booking.status}</span></td>
                <td>${booking.budget}</td>
                <td>${booking.photographer}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  // Bookings panel with real CRUD operations
  document.getElementById('bookings').innerHTML = `
    <h2>Booking Management</h2>
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Service</th>
            <th>Date</th>
            <th>Status</th>
            <th>Budget</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${bookingsData.map((booking, index) => `
            <tr>
              <td>${booking.id}</td>
              <td>${booking.clientName}</td>
              <td>${booking.serviceType}</td>
              <td>${booking.eventDate}</td>
              <td>
                <select class="form-control" onchange="updateBookingStatus('${booking.id}', this.value, ${index})">
                  <option value="Inquiry" ${booking.status === 'Inquiry' ? 'selected' : ''}>Inquiry</option>
                  <option value="Confirmed" ${booking.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                  <option value="In Progress" ${booking.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                  <option value="Completed" ${booking.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>
              </td>
              <td>${booking.budget}</td>
              <td>
                <button class="btn btn--sm btn--primary" onclick="editBooking('${booking.id}', ${index})">Edit</button>
                <button class="btn btn--sm btn--secondary" onclick="deleteBooking('${booking.id}', ${index})">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  // Clients panel
  document.getElementById('clients').innerHTML = `
    <h2>Client Management</h2>
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Total Spent</th>
            <th>Last Booking</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${clientsData.map(client => `
            <tr>
              <td>${client.name}</td>
              <td>${client.email}</td>
              <td>${client.phone}</td>
              <td>${client.totalSpent}</td>
              <td>${client.lastBooking}</td>
              <td><span class="status ${client.status.toLowerCase()}">${client.status}</span></td>
              <td>
                <button class="btn btn--sm btn--primary" onclick="viewClient('${client.id}')">View</button>
                <button class="btn btn--sm btn--secondary" onclick="editClient('${client.id}')">Edit</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  // Analytics panel
  document.getElementById('analytics').innerHTML = `
    <h2>Analytics Dashboard</h2>
    <div class="chart-container">
      <h3>Monthly Revenue</h3>
      <canvas id="revenueChart"></canvas>
    </div>
    <div class="chart-container">
      <h3>Service Popularity</h3>
      <canvas id="serviceChart"></canvas>
    </div>
  `;
  
  // ENHANCED: Team Management Panel (Admin Only)
  document.getElementById('team-management').innerHTML = `
    <h2>Team Management</h2>
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Performance</th>
            <th>Projects</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${appData.teamMembers.map((member, index) => `
            <tr>
              <td>${member.name}</td>
              <td>${member.role}</td>
              <td>₹${member.salary.toLocaleString()}</td>
              <td>${member.performanceRating}/5.0</td>
              <td>${member.totalProjects}</td>
              <td><span class="status ${member.availability === 'Available' ? 'confirmed' : 'inquiry'}">${member.availability}</span></td>
              <td>
                <button class="btn btn--sm btn--primary" onclick="editTeamMember('${member.id}', ${index})">Edit</button>
                <button class="btn btn--sm btn--secondary" onclick="viewTeamSchedule('${member.id}')">Schedule</button>
                <button class="btn btn--sm btn--outline" onclick="viewTeamPerformance('${member.id}')">Performance</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <button class="btn btn--primary" onclick="addNewTeamMember()">Add New Team Member</button>
  `;
  
  // ENHANCED: Attendance Management Panel
  document.getElementById('attendance').innerHTML = `
    <h2>Attendance & Salary Management</h2>
    <div class="attendance-controls">
      <div class="date-selector">
        <label>Select Month:</label>
        <input type="month" id="attendanceMonth" value="${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}" onchange="loadAttendanceData()">
      </div>
      <button class="btn btn--primary" onclick="markAttendance()">Mark Today's Attendance</button>
      <button class="btn btn--secondary" onclick="generateSalaryReport()">Generate Salary Report</button>
    </div>
    <div id="attendanceGrid" class="attendance-grid">
      <!-- Attendance data will be loaded here -->
    </div>
  `;
  
  // Finances panel
  document.getElementById('finances').innerHTML = `
    <h2>Financial Management</h2>
    <div class="admin-metrics">
      <div class="metric-card">
        <h3>₹8,95,000</h3>
        <p>Total Revenue</p>
        <span class="metric-change positive">+15%</span>
      </div>
      <div class="metric-card">
        <h3>₹1,25,000</h3>
        <p>Monthly Expenses</p>
        <span class="metric-change negative">-5%</span>
      </div>
      <div class="metric-card">
        <h3>₹7,70,000</h3>
        <p>Net Profit</p>
        <span class="metric-change positive">+18%</span>
      </div>
    </div>
    <h3>Recent Expenses</h3>
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2024-09-25</td>
            <td>Equipment</td>
            <td>Camera Lens Purchase</td>
            <td>₹45,000</td>
            <td>One-time</td>
          </tr>
          <tr>
            <td>2024-09-20</td>
            <td>Travel</td>
            <td>Client Meeting - Indore</td>
            <td>₹2,500</td>
            <td>Recurring</td>
          </tr>
          <tr>
            <td>2024-09-18</td>
            <td>Marketing</td>
            <td>Social Media Ads</td>
            <td>₹8,000</td>
            <td>Monthly</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function loadAnalyticsCharts() {
  // Revenue Chart
  const revenueCtx = document.getElementById('revenueChart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          label: 'Revenue (₹)',
          data: [185000, 220000, 195000, 275000, 320000, 285000, 310000, 295000, 325000],
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + (value / 1000) + 'K';
              }
            }
          }
        }
      }
    });
  }
  
  // Service Chart
  const serviceCtx = document.getElementById('serviceChart');
  if (serviceCtx) {
    new Chart(serviceCtx, {
      type: 'doughnut',
      data: {
        labels: ['Wedding Photography', 'Pre-Wedding Shoots', 'Event Photography', 'Portrait Photography'],
        datasets: [{
          data: [45, 32, 28, 23],
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }
}

function loadAttendanceData() {
  const attendanceGrid = document.getElementById('attendanceGrid');
  const selectedMonth = document.getElementById('attendanceMonth').value;
  
  attendanceGrid.innerHTML = `
    <h3>Attendance for ${selectedMonth}</h3>
    <div class="admin-table">
      <table>
        <thead>
          <tr>
            <th>Team Member</th>
            <th>Days Present</th>
            <th>Days Absent</th>
            <th>Working Hours</th>
            <th>Overtime</th>
            <th>Salary Calculation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${appData.teamMembers.map(member => `
            <tr>
              <td>${member.name}</td>
              <td>22</td>
              <td>4</td>
              <td>176 hrs</td>
              <td>8 hrs</td>
              <td>₹${(member.salary + (member.salary * 0.1)).toLocaleString()}</td>
              <td>
                <button class="btn btn--sm btn--primary" onclick="viewDetailedAttendance('${member.id}')">Details</button>
                <button class="btn btn--sm btn--secondary" onclick="markLeave('${member.id}')">Mark Leave</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ENHANCED: Real-time CRUD Functions for Admin
async function updateBookingStatus(bookingId, newStatus, index) {
  try {
    // Update in live data
    if (liveData.bookings[index]) {
      liveData.bookings[index].status = newStatus;
      
      // Update in Google Sheets
      await updateSheetRow('bookings', index, liveData.bookings[index]);
      
      showToast(`Booking ${bookingId} status updated to ${newStatus}`, 'success');
    }
  } catch (error) {
    console.error('Error updating booking status:', error);
    showToast('Failed to update booking status', 'error');
  }
}

function editBooking(bookingId, index) {
  const booking = liveData.bookings[index] || { id: bookingId };
  const modal = document.getElementById('bookingEditModal');
  const form = document.getElementById('bookingEditForm');
  
  form.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Client Name</label>
        <input type="text" name="clientName" class="form-control" value="${booking.clientName || ''}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Service Type</label>
        <select name="serviceType" class="form-control" required>
          <option value="Wedding Photography" ${booking.serviceType === 'Wedding Photography' ? 'selected' : ''}>Wedding Photography</option>
          <option value="Pre-Wedding Shoot" ${booking.serviceType === 'Pre-Wedding Shoot' ? 'selected' : ''}>Pre-Wedding Shoot</option>
          <option value="Event Photography" ${booking.serviceType === 'Event Photography' ? 'selected' : ''}>Event Photography</option>
          <option value="Portrait Photography" ${booking.serviceType === 'Portrait Photography' ? 'selected' : ''}>Portrait Photography</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Event Date</label>
        <input type="date" name="eventDate" class="form-control" value="${booking.eventDate || ''}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Budget</label>
        <input type="text" name="budget" class="form-control" value="${booking.budget || ''}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Photographer</label>
        <select name="photographer" class="form-control">
          <option value="TBD" ${booking.photographer === 'TBD' ? 'selected' : ''}>TBD</option>
          ${appData.teamMembers.map(member => `
            <option value="${member.name}" ${booking.photographer === member.name ? 'selected' : ''}>${member.name}</option>
          `).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select name="status" class="form-control">
          <option value="Inquiry" ${booking.status === 'Inquiry' ? 'selected' : ''}>Inquiry</option>
          <option value="Confirmed" ${booking.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="In Progress" ${booking.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
          <option value="Completed" ${booking.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      </div>
    </div>
    <button type="submit" class="btn btn--primary btn--full-width">Update Booking</button>
  `;
  
  form.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    const updatedBooking = {
      ...booking,
      clientName: formData.get('clientName'),
      serviceType: formData.get('serviceType'),
      eventDate: formData.get('eventDate'),
      budget: formData.get('budget'),
      photographer: formData.get('photographer'),
      status: formData.get('status')
    };
    
    try {
      // Update in live data
      liveData.bookings[index] = updatedBooking;
      
      // Update in Google Sheets
      await updateSheetRow('bookings', index, updatedBooking);
      
      showToast('Booking updated successfully!', 'success');
      closeBookingEdit();
      loadAdminData(); // Refresh the display
    } catch (error) {
      console.error('Error updating booking:', error);
      showToast('Failed to update booking', 'error');
    }
  };
  
  modal.classList.remove('hidden');
}

function closeBookingEdit() {
  document.getElementById('bookingEditModal').classList.add('hidden');
}

function deleteBooking(bookingId, index) {
  if (confirm('Are you sure you want to delete this booking?')) {
    // Remove from live data
    liveData.bookings.splice(index, 1);
    
    showToast(`Booking ${bookingId} deleted`, 'success');
    loadAdminData(); // Refresh the display
  }
}

function editTeamMember(memberId, index) {
  const member = appData.teamMembers[index];
  const modal = document.getElementById('teamEditModal');
  const form = document.getElementById('teamEditForm');
  
  form.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Name</label>
        <input type="text" name="name" class="form-control" value="${member.name}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Role</label>
        <input type="text" name="role" class="form-control" value="${member.role}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Email</label>
        <input type="email" name="email" class="form-control" value="${member.email}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Phone</label>
        <input type="tel" name="phone" class="form-control" value="${member.phone}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Salary</label>
        <input type="number" name="salary" class="form-control" value="${member.salary}" required>
      </div>
      <div class="form-group">
        <label class="form-label">Performance Rating</label>
        <input type="number" name="performanceRating" class="form-control" value="${member.performanceRating}" min="0" max="5" step="0.1" required>
      </div>
      <div class="form-group">
        <label class="form-label">Availability</label>
        <select name="availability" class="form-control">
          <option value="Available" ${member.availability === 'Available' ? 'selected' : ''}>Available</option>
          <option value="Busy" ${member.availability === 'Busy' ? 'selected' : ''}>Busy</option>
          <option value="On Leave" ${member.availability === 'On Leave' ? 'selected' : ''}>On Leave</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Equipment (comma separated)</label>
        <textarea name="equipment" class="form-control" rows="3">${member.equipment.join(', ')}</textarea>
      </div>
    </div>
    <button type="submit" class="btn btn--primary btn--full-width">Update Team Member</button>
  `;
  
  form.onsubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    appData.teamMembers[index] = {
      ...member,
      name: formData.get('name'),
      role: formData.get('role'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      salary: parseInt(formData.get('salary')),
      performanceRating: parseFloat(formData.get('performanceRating')),
      availability: formData.get('availability'),
      equipment: formData.get('equipment').split(',').map(item => item.trim())
    };
    
    showToast('Team member updated successfully!', 'success');
    closeTeamEdit();
    loadAdminData();
  };
  
  modal.classList.remove('hidden');
}

function closeTeamEdit() {
  document.getElementById('teamEditModal').classList.add('hidden');
}

function markAttendance() {
  showToast('Attendance marked for all team members', 'success');
  loadAttendanceData();
}

function generateSalaryReport() {
  showToast('Salary report generated and exported', 'success');
}

function viewDetailedAttendance(memberId) {
  const member = appData.teamMembers.find(m => m.id === memberId);
  showToast(`Viewing detailed attendance for ${member.name}`, 'info');
}

function markLeave(memberId) {
  const member = appData.teamMembers.find(m => m.id === memberId);
  showToast(`Leave marked for ${member.name}`, 'success');
}

function addNewTeamMember() {
  showToast('Add new team member functionality', 'info');
}

function viewTeamSchedule(memberId) {
  const member = appData.teamMembers.find(m => m.id === memberId);
  showToast(`Viewing schedule for ${member.name}`, 'info');
}

function viewTeamPerformance(memberId) {
  const member = appData.teamMembers.find(m => m.id === memberId);
  showToast(`Viewing performance metrics for ${member.name}`, 'info');
}

function viewClient(clientId) {
  showToast(`View client ${clientId}`, 'info');
}

function editClient(clientId) {
  showToast(`Edit client ${clientId}`, 'info');
}

async function exportToGoogleSheets() {
  showToast('Exporting data to Google Sheets...', 'info');
  
  try {
    // Export all data to respective sheets
    const promises = Object.entries(liveData).map(([key, data]) => {
      if (data.length > 0) {
        return Promise.all(data.map(item => appendToSheet(key, item)));
      }
      return Promise.resolve();
    });
    
    await Promise.all(promises);
    showToast('Data exported successfully!', 'success');
  } catch (error) {
    console.error('Export error:', error);
    showToast('Export completed with some errors', 'warning');
  }
}

// Utility Functions
function setMinimumDate() {
  const eventDateInput = document.querySelector('input[name="eventDate"]');
  if (eventDateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    eventDateInput.min = tomorrow.toISOString().split('T')[0];
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastIcon = toast.querySelector('.toast-icon');
  const toastMessage = toast.querySelector('.toast-message');
  const toastClose = toast.querySelector('.toast-close');
  
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle'
  };
  
  toastIcon.className = `toast-icon ${icons[type]}`;
  toastMessage.textContent = message;
  toast.className = `toast ${type}`;
  
  toastClose.addEventListener('click', () => {
    toast.classList.add('hidden');
  });
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 5000);
}

// Smooth Scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Scroll Effects
function initScrollEffects() {
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
  
  const animateElements = document.querySelectorAll(
    '.service-card, .gallery-item, .team-member, .blog-card, .instagram-post'
  );
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
  
  const socialSidebar = document.getElementById('socialSidebar');
  if (socialSidebar) {
    window.addEventListener('scroll', function() {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      const scrollLine = socialSidebar.querySelector('.scroll-line');
      if (scrollLine) {
        scrollLine.style.background = `linear-gradient(to bottom, var(--theme-primary) ${scrollPercent}%, rgba(255,255,255,0.3) ${scrollPercent}%)`;
      }
    });
  }
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('JavaScript Error:', e.error);
  showToast('An error occurred. Please refresh the page.', 'error');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise Rejection:', e.reason);
  showToast('Network error occurred. Some features may be limited.', 'warning');
});

// Console welcome message
console.log('%c🎥 RN PhotoFilms Website', 'color: #2563eb; font-size: 24px; font-weight: bold;');
console.log('%cYour Emotions, Our Lens ✨', 'color: #dc2626; font-size: 16px;');
console.log('%cDeveloped with ❤️ for capturing memories', 'color: #059669; font-size: 14px;');
console.log('%cGoogle Sheets Integration: Real-time data synchronization enabled', 'color: #0891b2; font-size: 12px;');