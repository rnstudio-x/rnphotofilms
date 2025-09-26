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
              <option value="">Select Photographer</option>
              ${appData.team.map(member => `
                <option value="${member.name}" ${booking.photographer === member.name ? 'selected' : ''}>${member.name}</option>
              `).join('')}
            </select>
          </td>
          <td class="table-actions">
            <button class="btn-icon btn-icon--edit" onclick="editBooking(${booking.id})" title="Edit">✏️</button>
            <button class="btn-icon btn-icon--delete" onclick="deleteBooking(${booking.id})" title="Delete">🗑️</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function renderClientsTable() {
  const table = document.getElementById('clients-table');
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Event Type</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${appData.clients.map(client => `
        <tr>
          <td>#${client.id}</td>
          <td>${client.name}</td>
          <td>${client.email}</td>
          <td>${client.phone}</td>
          <td>${client.eventType}</td>
          <td class="table-actions">
            <button class="btn-icon" onclick="viewClient(${client.id})" title="View">👁️</button>
            <button class="btn-icon btn-icon--edit" onclick="editClient(${client.id})" title="Edit">✏️</button>
            <button class="btn-icon btn-icon--delete" onclick="deleteClient(${client.id})" title="Delete">🗑️</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function renderTeamManagement() {
  const grid = document.getElementById('team-management-grid');
  if (!grid) return;

  grid.innerHTML = appData.team.map(member => `
    <div class="team-member-card">
      <div class="team-member-header">
        <div class="team-member-avatar">
          <img src="${member.image}" alt="${member.name}">
        </div>
        <div class="team-member-info">
          <h4>${member.name}</h4>
          <p>${member.position}</p>
        </div>
      </div>
      <div class="team-member-stats">
        <div class="stat-item">
          <span class="stat-value">${member.attendance}%</span>
          <span class="stat-label">Attendance</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${member.salary}</span>
          <span class="stat-label">Salary</span>
        </div>
      </div>
      <div class="team-member-stats">
        <div class="stat-item">
          <span class="stat-value">${formatDate(member.lastPaid)}</span>
          <span class="stat-label">Last Paid</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${member.pending}</span>
          <span class="stat-label">Pending</span>
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn btn--sm btn--outline" onclick="markAttendance('${member.name}')">Mark Attendance</button>
        <button class="btn btn--sm btn--primary" onclick="processSalary('${member.name}')">Process Salary</button>
      </div>
    </div>
  `).join('');
}

function renderExpensesTable() {
  const table = document.getElementById('expenses-table');
  if (!table) return;

  table.innerHTML = `
    <thead>
      <tr>
        <th>ID</th>
        <th>Category</th>
        <th>Description</th>
        <th>Amount</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      ${appData.expenses.map(expense => `
        <tr>
          <td>#${expense.id}</td>
          <td>${expense.category}</td>
          <td>${expense.description}</td>
          <td>${expense.amount}</td>
          <td>${formatDate(expense.date)}</td>
          <td class="table-actions">
            <button class="btn-icon btn-icon--edit" onclick="editExpense(${expense.id})" title="Edit">✏️</button>
            <button class="btn-icon btn-icon--delete" onclick="deleteExpense(${expense.id})" title="Delete">🗑️</button>
          </td>
        </tr>
      `).join('')}
    </tbody>
  `;
}

function renderCRMPipeline() {
  const pipeline = document.getElementById('crm-pipeline');
  if (!pipeline) return;

  const stages = {
    'contacted': { title: 'Contacted', leads: [] },
    'proposal': { title: 'Proposal Sent', leads: [] },
    'follow-up': { title: 'Follow Up', leads: [] },
    'closed': { title: 'Closed Won', leads: [] }
  };

  // Distribute leads into stages
  appData.crmData.leads.forEach(lead => {
    if (stages[lead.stage]) {
      stages[lead.stage].leads.push(lead);
    }
  });

  pipeline.innerHTML = Object.entries(stages).map(([key, stage]) => `
    <div class="pipeline-stage">
      <div class="stage-header">
        <span class="stage-title">${stage.title}</span>
        <span class="stage-count">${stage.leads.length}</span>
      </div>
      <div class="pipeline-items">
        ${stage.leads.map(lead => `
          <div class="pipeline-item">
            <h5>${lead.name}</h5>
            <p>${lead.service} - ${lead.value}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderAnalyticsCharts() {
  // Revenue Chart
  const revenueCtx = document.getElementById('revenue-chart');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          label: 'Revenue',
          data: [150000, 180000, 220000, 200000, 280000, 320000, 300000, 350000, 325000],
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.4,
          fill: true
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
                return '₹' + (value / 1000) + 'k';
              }
            }
          }
        }
      }
    });
  }

  // Bookings Chart
  const bookingsCtx = document.getElementById('bookings-chart');
  if (bookingsCtx) {
    new Chart(bookingsCtx, {
      type: 'doughnut',
      data: {
        labels: ['Wedding', 'Pre-Wedding', 'Events', 'Portraits'],
        datasets: [{
          data: [45, 25, 20, 10],
          backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
          borderWidth: 0
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

// Admin Action Functions
function switchAdminSection(sectionName) {
  // Update navigation
  document.querySelectorAll('.admin-nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

  // Update content sections
  document.querySelectorAll('.admin-content-section').forEach(section => section.classList.remove('active'));
  document.getElementById(`admin-${sectionName}`).classList.add('active');
}

function showAddBookingForm() {
  showModal('add-booking-modal');
  // Set today's date as minimum for date inputs
  const today = new Date().toISOString().split('T')[0];
  const eventDateInput = document.getElementById('add-event-date');
  if (eventDateInput) {
    eventDateInput.min = today;
  }
}

function showAddClientForm() {
  showModal('add-client-modal');
}

function showAddExpenseForm() {
  showModal('add-expense-modal');
  // Set today's date as default for expense date
  const today = new Date().toISOString().split('T')[0];
  const expenseDateInput = document.getElementById('expense-date');
  if (expenseDateInput) {
    expenseDateInput.value = today;
    expenseDateInput.max = today; // Can't add future expenses
  }
}

function showAddTeamMemberForm() {
  showToast('Add Team Member form opened', 'info');
}

function handleAddBooking(e) {
  e.preventDefault();
  
  // Get form values directly
  const clientName = document.getElementById('add-client-name').value.trim();
  const serviceType = document.getElementById('add-service-type').value;
  const eventDate = document.getElementById('add-event-date').value;
  const packageType = document.getElementById('add-package').value;
  const amount = document.getElementById('add-amount').value;
  const status = document.getElementById('add-status').value;
  const photographer = document.getElementById('add-photographer').value;
  
  // Validation
  if (!clientName || !serviceType || !eventDate || !amount) {
    showToast('Please fill in all required fields', 'error');
    return;
  }
  
  const newBooking = {
    id: appData.recentBookings.length + 1,
    client: clientName,
    service: serviceType,
    date: eventDate,
    status: status,
    amount: '₹' + amount,
    photographer: photographer || 'Unassigned'
  };

  appData.recentBookings.push(newBooking);
  renderBookingsTable();
  renderRecentBookings();
  hideModal('add-booking-modal');
  showToast('Booking added successfully!', 'success');
  
  // Send to Google Sheets (placeholder)
  sendToGoogleSheets('bookings', newBooking);
}

function handleAddClient(e) {
  e.preventDefault();
  const newClient = {
    id: appData.clients.length + 1,
    name: document.getElementById('client-name').value,
    email: document.getElementById('client-email').value,
    phone: document.getElementById('client-phone').value,
    address: document.getElementById('client-address').value,
    eventType: document.getElementById('client-event-type').value,
    birthday: document.getElementById('client-birthday').value,
    anniversary: document.getElementById('client-anniversary').value,
    notes: document.getElementById('client-notes').value
  };

  appData.clients.push(newClient);
  renderClientsTable();
  hideModal('add-client-modal');
  showToast('Client added successfully!', 'success');
  
  // Send to Google Sheets (placeholder)
  sendToGoogleSheets('clients', newClient);
}

function handleAddExpense(e) {
  e.preventDefault();
  const newExpense = {
    id: appData.expenses.length + 1,
    category: document.getElementById('expense-category').value,
    description: document.getElementById('expense-description').value,
    amount: '₹' + document.getElementById('expense-amount').value,
    date: document.getElementById('expense-date').value
  };

  appData.expenses.push(newExpense);
  renderExpensesTable();
  hideModal('add-expense-modal');
  showToast('Expense added successfully!', 'success');
  
  // Send to Google Sheets (placeholder)
  sendToGoogleSheets('expenses', newExpense);
}

function exportBookings() {
  // Create PDF using jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('RN PhotoFilms - Bookings Report', 20, 20);
  
  doc.setFontSize(12);
  let yPosition = 40;
  
  appData.recentBookings.forEach((booking, index) => {
    doc.text(`${index + 1}. ${booking.client} - ${booking.service}`, 20, yPosition);
    doc.text(`   Date: ${booking.date} | Status: ${booking.status} | Amount: ${booking.amount}`, 20, yPosition + 10);
    yPosition += 25;
  });
  
  doc.save('bookings-report.pdf');
  showToast('Bookings exported successfully!', 'success');
}

function sendBirthdayReminders() {
  const today = new Date();
  const upcomingBirthdays = appData.clients.filter(client => {
    if (!client.birthday) return false;
    const birthday = new Date(client.birthday);
    const nextBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 7;
  });

  showToast(`Found ${upcomingBirthdays.length} upcoming birthdays. Reminders sent!`, 'success');
}

function sendAnniversaryReminders() {
  const today = new Date();
  const upcomingAnniversaries = appData.clients.filter(client => {
    if (!client.anniversary) return false;
    const anniversary = new Date(client.anniversary);
    const nextAnniversary = new Date(today.getFullYear(), anniversary.getMonth(), anniversary.getDate());
    const daysUntil = Math.ceil((nextAnniversary - today) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 7;
  });

  showToast(`Found ${upcomingAnniversaries.length} upcoming anniversaries. Reminders sent!`, 'success');
}

function markAttendance(memberName) {
  showToast(`Attendance marked for ${memberName}`, 'success');
  // Update attendance in Google Sheets
}

function processSalary(memberName) {
  const member = appData.team.find(m => m.name === memberName);
  if (member) {
    member.pending = '₹0';
    member.lastPaid = new Date().toISOString().split('T')[0];
    renderTeamManagement();
    showToast(`Salary processed for ${memberName}`, 'success');
  }
}

function updateBookingStatus(bookingId, newStatus) {
  const booking = appData.recentBookings.find(b => b.id === bookingId);
  if (booking) {
    booking.status = newStatus;
    renderRecentBookings();
    showToast('Booking status updated!', 'success');
  }
}

function assignPhotographer(bookingId, photographer) {
  const booking = appData.recentBookings.find(b => b.id === bookingId);
  if (booking) {
    booking.photographer = photographer || 'Unassigned';
    renderRecentBookings();
    showToast('Photographer assigned!', 'success');
  }
}

function addLead() {
  showToast('Lead management form opened', 'info');
}

function setupAutomation() {
  showToast('Automation settings configured', 'success');
}

function exportCRM() {
  showToast('CRM data exported successfully', 'success');
}

function generateFinanceReport() {
  showToast('Finance report generated successfully', 'success');
}

// Placeholder functions for edit/delete actions
function editBooking(id) {
  showToast(`Edit booking #${id}`, 'info');
}

function deleteBooking(id) {
  if (confirm('Are you sure you want to delete this booking?')) {
    appData.recentBookings = appData.recentBookings.filter(b => b.id !== id);
    renderBookingsTable();
    renderRecentBookings();
    showToast('Booking deleted successfully', 'success');
  }
}

function viewClient(id) {
  const client = appData.clients.find(c => c.id === id);
  if (client) {
    showToast(`Viewing client: ${client.name}`, 'info');
  }
}

function editClient(id) {
  showToast(`Edit client #${id}`, 'info');
}

function deleteClient(id) {
  if (confirm('Are you sure you want to delete this client?')) {
    appData.clients = appData.clients.filter(c => c.id !== id);
    renderClientsTable();
    showToast('Client deleted successfully', 'success');
  }
}

function editExpense(id) {
  showToast(`Edit expense #${id}`, 'info');
}

function deleteExpense(id) {
  if (confirm('Are you sure you want to delete this expense?')) {
    appData.expenses = appData.expenses.filter(e => e.id !== id);
    renderExpensesTable();
    showToast('Expense deleted successfully', 'success');
  }
}

// Modal Functions
function showModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
  // Reset form if it exists
  const form = document.querySelector(`#${modalId} form`);
  if (form) form.reset();
}

// Form Handlers
function showBookingForm() {
  showModal('booking-modal');
}

function showContactForm() {
  showModal('contact-modal');
}

function handleBookingSubmission(e) {
  e.preventDefault();
  const button = e.target.querySelector('button[type="submit"]');
  setButtonLoading(button, true);

  // Simulate API call
  setTimeout(() => {
    setButtonLoading(button, false);
    hideModal('booking-modal');
    showToast('Booking request submitted successfully! We will contact you soon.', 'success');
    e.target.reset();
    
    // Send to Google Sheets (placeholder)
    const formData = new FormData(e.target);
    sendToGoogleSheets('bookings', Object.fromEntries(formData));
  }, 2000);
}

function handleContactSubmission(e) {
  e.preventDefault();
  const button = e.target.querySelector('button[type="submit"]');
  setButtonLoading(button, true);

  // Simulate API call
  setTimeout(() => {
    setButtonLoading(button, false);
    hideModal('contact-modal');
    showToast('Message sent successfully! We will get back to you soon.', 'success');
    e.target.reset();
    
    // Send to Google Sheets (placeholder)
    const formData = new FormData(e.target);
    sendToGoogleSheets('contacts', Object.fromEntries(formData));
  }, 2000);
}

function updatePackageOptions() {
  const serviceSelect = document.getElementById('booking-service');
  const packageSelect = document.getElementById('booking-package');
  
  if (!serviceSelect || !packageSelect) return;
  
  const selectedService = appData.services.find(s => s.id === serviceSelect.value);
  
  packageSelect.innerHTML = '<option value="">Select Package</option>';
  
  if (selectedService) {
    selectedService.packages.forEach(pkg => {
      const option = document.createElement('option');
      option.value = pkg.name;
      option.textContent = `${pkg.name} - ${pkg.price}`;
      packageSelect.appendChild(option);
    });
  }
}

// Lightbox Functions
function openLightbox(index) {
  currentImageIndex = index;
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  
  lightboxImage.src = currentGalleryImages[index];
  lightbox.classList.remove('hidden');
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
}

function hideLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = 'auto';
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
  document.getElementById('lightbox-image').src = currentGalleryImages[currentImageIndex];
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  document.getElementById('lightbox-image').src = currentGalleryImages[currentImageIndex];
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox.classList.contains('hidden')) {
    switch(e.key) {
      case 'Escape':
        hideLightbox();
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

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN');
}

function getStatusClass(status) {
  const statusMap = {
    'Confirmed': 'success',
    'Completed': 'success',
    'Inquiry': 'warning',
    'Cancelled': 'error'
  };
  return statusMap[status] || 'info';
}

function setButtonLoading(button, loading) {
  if (loading) {
    button.classList.add('loading');
  } else {
    button.classList.remove('loading');
  }
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div class="toast-message">${message}</div>`;
  
  container.appendChild(toast);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s reverse';
    setTimeout(() => {
      container.removeChild(toast);
    }, 300);
  }, 5000);
}

// Google Sheets Integration (Placeholder)
function sendToGoogleSheets(sheetName, data) {
  // This function would integrate with Google Apps Script
  console.log(`Sending to ${sheetName}:`, data);
  
  // Placeholder for Google Apps Script integration
  /*
  const scriptUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
  fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sheet: sheetName,
      data: data
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log('Success:', result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
  */
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.add('hidden');
  }
});
