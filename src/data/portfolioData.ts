import { ProjectData, ServiceData, SkillData } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'nasrou',
  lastName: 'hm',
  fullName: 'nasrou hm',
  taglineKey: 'Web Dev & Meta Ads',
  roleKey: 'Web Developer',
  specialtyKey: 'Meta Specialist',
  email: 'chnakhtensloven@gmail.com',
  phone: '+213563277037',
  whatsappUrl: 'https://wa.me/213563277037',
  locationKey: 'Alger, Algeria',
  locationDetailKey: 'Algeria · Remote Global',
  statusKey: 'Active',
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    whatsapp: 'https://wa.me/213563277037',
    email: 'mailto:chnakhtensloven@gmail.com'
  },
  images: {
    avatar: '/hhh.jpg',
    avatarFallback: '/assets/aistudio/hhh_96a83c7b.jpg',
    about: '/2em.jpg',
    aboutFallback: '/assets/aistudio/2em_abe743d9.jpg'
  },
  metrics: [
    { value: '3+', labelKey: 'Years Experience' },
    { value: '50+', labelKey: 'Projects Done' },
    { value: '4.5x', labelKey: 'Average ROAS' },
    { value: '100%', labelKey: 'Satisfaction' }
  ]
};

export const PROJECTS_DATA: ProjectData[] = [
  {
    id: 'luxury-store',
    titleKey: 'E-Commerce Store',
    externalUrl: 'https://store-wewe-3ljp-git-master-chnakhtensloven-arch.vercel.app/',
    categoryKeys: ['Shopify', 'Web Dev', 'CRO'],
    descriptionKey: 'Modern fashion e-commerce shop with high conversion checkout and mobile-first design.',
    image: '/e-commrc.jpg',
    imageAltKey: 'Fashion models representing the luxury e-commerce store project',
    badge: {
      value: 'LUXURY STORE',
      labelKey: 'Shopify'
    },
    metrics: [
      { labelKey: 'Fast Page Load Speed', value: '0.8s' },
      { labelKey: 'Conversion Rate Optimization (CRO)', value: '+38%' },
      { labelKey: 'Satisfaction', value: '100%' }
    ],
    detailsKey: 'Complete end-to-end e-commerce infrastructure built with tailored product landing templates, responsive layout, lightning-fast checkout flow, and seamless payment gateway integration.',
    deliverablesKeys: [
      'Shopify & WooCommerce',
      'Conversion Rate Optimization (CRO)',
      'Payment Gateway Integration',
      'Responsive & Mobile-First'
    ]
  },
  {
    id: 'meta-ads-campaign',
    titleKey: 'Meta Ads Campaign',
    categoryKeys: ['Meta Ads', 'CAPI', 'Scaling'],
    descriptionKey: 'Targeted FB & IG marketing campaign achieving 5.4x ROAS and +230% monthly sales increase.',
    image: '/meta-ads.jpg',
    imageAltKey: 'Analytics dashboard representing the Meta Ads campaign project',
    badge: {
      value: '5.4x',
      labelKey: 'ROAS ACHIEVED'
    },
    metrics: [
      { labelKey: 'Average ROAS', value: '5.4x' },
      { labelKey: 'Data Analytics & Campaign Scaling', value: '+230%' },
      { labelKey: 'Pixel & CAPI Setup', value: '100%' }
    ],
    detailsKey: 'Hyper-targeted Meta Ads strategy covering dynamic creative testing, deep audience segmentation, Conversion API server tracking, and high-margin scale pipelines.',
    deliverablesKeys: [
      'High ROAS Ad Strategies',
      'Pixel & CAPI Setup',
      'A/B Testing & Scaling',
      'Data Analytics & Campaign Scaling'
    ]
  },
  {
    id: 'landing-page',
    titleKey: 'High-Converting Landing Page',
    externalUrl: 'https://store-wewe-3ljp-git-master-chnakhtensloven-arch.vercel.app/product/product-1793055108563',
    categoryKeys: ['HTML/CSS/JS', 'UI/UX', 'Fast Load'],
    descriptionKey: 'Ultra-fast product landing page with dynamic interactive elements and high opt-in rate.',
    image: '/leading-page.jpg',
    imageAltKey: 'Web design workspace representing the landing page project',
    badge: {
      value: 'LANDING PAGE',
      labelKey: 'UI/UX'
    },
    metrics: [
      { labelKey: 'Fast Page Load Speed', value: '99/100' },
      { labelKey: 'Responsive & Mobile-First', value: '100%' },
      { labelKey: 'Conversion Rate Optimization (CRO)', value: '+45%' }
    ],
    detailsKey: 'Engineered for maximum visitor retention and instantaneous loading, combining semantic DOM hierarchy with subtle interactive micro-animations and zero bounce friction.',
    deliverablesKeys: [
      'Responsive & Mobile-First',
      'Fast Page Load Speed',
      'Clean & Modern UI/UX',
      'Performance & Speed Optimization'
    ]
  }
];

export const SERVICES_DATA: ServiceData[] = [
  {
    id: 'web-dev',
    titleKey: 'Web Development',
    descriptionKey: 'Building high-performance, responsive, and SEO-optimized websites using clean and scalable code for businesses and startups.',
    icon: 'Code',
    isPopular: false,
    featuresKeys: [
      'Responsive & Mobile-First',
      'Fast Page Load Speed',
      'Clean & Modern UI/UX'
    ]
  },
  {
    id: 'ecommerce',
    titleKey: 'E-Commerce Solutions',
    descriptionKey: 'Creating high-converting online stores tailored to maximize sales, reduce cart abandonment, and streamline customer checkout.',
    icon: 'ShoppingCart',
    isPopular: true,
    featuresKeys: [
      'Shopify & WooCommerce',
      'Conversion Rate Optimization (CRO)',
      'Payment Gateway Integration'
    ]
  },
  {
    id: 'meta-ads',
    titleKey: 'Meta Ads Marketing',
    descriptionKey: 'Designing and scaling profitable Facebook & Instagram ad campaigns with advanced pixel tracking, retargeting, and audience research.',
    icon: 'TrendingUp',
    isPopular: false,
    featuresKeys: [
      'High ROAS Ad Strategies',
      'Pixel & CAPI Setup',
      'A/B Testing & Scaling'
    ]
  }
];

export const SKILLS_DATA: SkillData[] = [
  {
    nameKey: 'HTML5 / CSS3 / JavaScript',
    percentage: 92,
    category: 'tech',
    color: '#F8DD1B'
  },
  {
    nameKey: 'E-Commerce (Shopify / WooCommerce)',
    percentage: 88,
    category: 'tech',
    color: '#F5CE0D'
  },
  {
    nameKey: 'Responsive Web Design (UI/UX)',
    percentage: 95,
    category: 'tech',
    color: '#F8DD1B'
  },
  {
    nameKey: 'Performance & Speed Optimization',
    percentage: 85,
    category: 'tech',
    color: '#DDAC0D'
  },
  {
    nameKey: 'Meta Ads Manager (FB & IG)',
    percentage: 96,
    category: 'marketing',
    color: '#F8DD1B'
  },
  {
    nameKey: 'Meta Pixel & Conversions API (CAPI)',
    percentage: 90,
    category: 'marketing',
    color: '#F5CE0D'
  },
  {
    nameKey: 'Conversion Rate Optimization (CRO)',
    percentage: 87,
    category: 'marketing',
    color: '#F8DD1B'
  },
  {
    nameKey: 'Data Analytics & Campaign Scaling',
    percentage: 89,
    category: 'marketing',
    color: '#DDAC0D'
  }
];
