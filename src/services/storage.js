const storageGet = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (error) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
};

const storageSet = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const STORAGE_KEYS = {
  authToken: 'sit_admin_token',
  authUser: 'sit_admin_user',
  packagesDomestic: 'sit_packages_domestic',
  blogs: 'sit_blogs',
  reviews: 'sit_reviews',
  enquiries: 'sit_enquiries',
  cms: 'sit_cms',
  activity: 'sit_activity'
};

const seedData = {
  packagesDomestic: [
    {
      id: 'dom-1',
      title: 'Golden Triangle Escape',
      description: 'Delhi, Agra, and Jaipur highlights with guided tours.',
      duration: '5 Days',
      price: '15999',
      location: 'Delhi - Agra - Jaipur',
      inclusions: 'Hotels, breakfast, transfers, sightseeing',
      exclusions: 'Flights, personal expenses',
      images: [],
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ],
  blogs: [
    {
      id: 'blog-1',
      title: 'Best Time to Visit Rajasthan',
      description: 'A seasonal guide to Rajasthan travel.',
      content: 'Plan your trip between October and March for pleasant weather.',
      author: 'Soulful India Tours',
      date: new Date().toISOString().slice(0, 10),
      location: 'Rajasthan',
      coverImage: null,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ],
  reviews: [
    {
      id: 'rev-1',
      name: 'Priya Sharma',
      location: 'Mumbai, India',
      review: 'Wonderful service and memorable itinerary.',
      rating: 5,
      isActive: true,
      createdAt: new Date().toISOString()
    }
  ],
  enquiries: [
    {
      id: 'enq-1',
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      mobile: '+91 90000 00000',
      message: 'Interested in Kerala packages for April.',
      date: new Date().toISOString(),
      isRead: false
    }
  ],
  cms: {
    heroTitle: 'Soulful India Tours',
    heroSubtitle: 'Curated journeys across India and beyond.',
    whyChooseUs: 'Verified itineraries, local expertise, and transparent pricing.',
    locationText: 'Serving travelers worldwide with India-first experiences.',
    footerText: 'Soulful India Tours. All rights reserved.',
    contactEmail: 'info@soulfulindiatours.com',
    contactPhone: '+91 90000 00000',
    contactAddress: 'New Delhi, India',
    sectionHeadings: {
      domestic: 'Domestic Tours',
      blogs: 'Travel Stories',
      reviews: 'Guest Reviews'
    }
  },
  activity: [
    {
      id: 'act-1',
      message: 'Seed data loaded for admin panel.',
      date: new Date().toISOString()
    }
  ]
};

const initStorage = () => {
  const entries = Object.entries(seedData);
  entries.forEach(([key, value]) => {
    const storageKey = STORAGE_KEYS[key];
    if (!localStorage.getItem(storageKey)) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  });
};

export {
  STORAGE_KEYS,
  seedData,
  storageGet,
  storageSet,
  initStorage
};
