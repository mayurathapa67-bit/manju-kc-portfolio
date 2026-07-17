export type NavLink = {
  label: string;
  href: string;
};

export type Nav = {
  logo: string;
  links: NavLink[];
};

export type Hero = {
  title: string;
  role: string;
  tagline: string;
  subtitle: string;
  cta_primary: string;
  cta_secondary: string;
  image: string;
};

export type Experience = {
  role: string;
  company: string;
  duration: string;
  story: string;
};

export type Personal = {
  hobbies: string[];
  photos: string[];
};

export type About = {
  headline: string;
  bio: string;
  philosophy: string;
  story: string;
  expertise: string[];
  experience: Experience[];
  personal: Personal;
  image: string;
};

export type Service = {
  title: string;
  description: string;
  icon: string;
  price?: string;
  deliverables: string[];
  process: string[];
};

export type ProjectResults = {
  engagement: string;
  reach: string;
  conversions: string;
};

export type ProjectTestimonial = {
  quote: string;
  name: string;
  role: string;
};

export type Project = {
  slug: string;
  title: string;
  category: "Brand Campaigns" | "Social Media" | "Content Strategy" | "Email Marketing";
  client: string;
  description: string;
  challenge: string;
  strategy: string;
  results: ProjectResults;
  images: string[];
  testimonial: ProjectTestimonial;
  published_date: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image: string;
  published_date: string;
  read_time: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
};

export type Contact = {
  email: string;
  phone: string;
  location: string;
  socials: { platform: string; url: string }[];
  availability: string;
};

export type Content = {
  nav: Nav;
  hero: Hero;
  about: About;
  services: Service[];
  portfolio: Project[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  contact: Contact;
};

export type Submission = {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
  createdAt: string;
};
