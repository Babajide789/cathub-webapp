// /lib/data.ts

import { Cat, Product, Service, Post } from "@/types";

export const cats: Cat[] = [
  {
    id: "1",
    name: "Luna",
    age: "2 years",
    breed: "Persian",
    location: "San Francisco, CA",
    description: "Luna is a gentle and affectionate Persian cat who loves cuddles and quiet environments.",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800",
    gender: "Female",
    health: ["Healthy", "Dewormed", "Flea treated"],
    vaccinated: true,
    neutered: true,
    ownerName: "Paws Rescue Center",
    ownerAvatar: "https://ui-avatars.com/api/?name=Paws+Rescue",
    ownerType: "shelter",
    gallery: [
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800",
      "https://images.unsplash.com/photo-1568152950566-c1bf43f4ab28?w=800",
      "https://images.unsplash.com/photo-1573865526739-10c1d3a9c1b9?w=800"
    ]
  },
  {
    id: "2",
    name: "Milo",
    age: "1 year",
    breed: "British Shorthair",
    location: "New York, NY",
    description: "Milo is a playful and energetic British Shorthair who loves toys and exploring. He's very social and would do well in an active household.",
    image: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800",
    gender: "Male",
    health: ["Healthy", "Dewormed"],
    vaccinated: true,
    neutered: false,
    ownerName: "Sarah Johnson",
    ownerAvatar: "https://ui-avatars.com/api/?name=Sarah+Johnson",
    ownerType: "individual",
    gallery: [
      "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800",
      "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=800"
    ]
  },
  {
    id: "3",
    name: "Bella",
    age: "3 years",
    breed: "Siamese",
    location: "Los Angeles, CA",
    description: "Bella is a vocal and intelligent Siamese who loves attention and conversation. She's very loyal and forms strong bonds with her family.",
    image: "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800",
    gender: "Female",
    health: ["Healthy", "Dewormed", "Flea treated"],
    vaccinated: true,
    neutered: true,
    ownerName: "Happy Tails Shelter",
    ownerAvatar: "https://ui-avatars.com/api/?name=Happy+Tails",
    ownerType: "shelter",
    gallery: [
      "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800"
    ]
  },
  {
    id: "4",
    name: "Oliver",
    age: "6 months",
    breed: "Maine Coon",
    location: "Seattle, WA",
    description: "Oliver is a young Maine Coon kitten with a big personality. He's curious, playful, and loves to explore every corner of the house.",
    image: "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800",
    gender: "Male",
    health: ["Healthy"],
    vaccinated: true,
    neutered: false,
    ownerName: "Mike Chen",
    ownerAvatar: "https://ui-avatars.com/api/?name=Mike+Chen",
    ownerType: "individual",
    gallery: [
      "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=800"
    ]
  },
  {
    id: "5",
    name: "Chloe",
    age: "4 years",
    breed: "Ragdoll",
    location: "Austin, TX",
    description: "Chloe is a laid-back Ragdoll who loves lounging and being pampered. She's great with other pets and very gentle.",
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800",
    gender: "Female",
    health: ["Healthy", "Dewormed", "Flea treated"],
    vaccinated: true,
    neutered: true,
    ownerName: "Austin Animal Center",
    ownerAvatar: "https://ui-avatars.com/api/?name=Austin+Animal",
    ownerType: "shelter",
    gallery: [
      "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800"
    ]
  },
  {
    id: "6",
    name: "Max",
    age: "2 years",
    breed: "Bengal",
    location: "Miami, FL",
    description: "Max is an active Bengal with beautiful spotted coat. He loves climbing and playing, perfect for experienced cat owners.",
    image: "https://images.unsplash.com/photo-1598188306155-25e400eb5078?w=800",
    gender: "Male",
    health: ["Healthy", "Dewormed"],
    vaccinated: true,
    neutered: true,
    ownerName: "Emma Wilson",
    ownerAvatar: "https://ui-avatars.com/api/?name=Emma+Wilson",
    ownerType: "individual",
    gallery: [
      "https://images.unsplash.com/photo-1598188306155-25e400eb5078?w=800"
    ]
  }
  // 👉 paste ALL other cats here
];

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Cat Food - Chicken & Rice",
    price: 24.99,
    category: "food",
    image: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=800",
    rating: 4.5,
    reviews: 124,
    description: "High-quality cat food made with real chicken and rice.",
    inStock: true
  },
  {
    id: "2",
    name: "Interactive Cat Toy Bundle",
    price: 15.99,
    category: "toys",
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800",
    rating: 4.8,
    reviews: 89,
    description: "Set of 5 interactive toys including feather wands, balls, and catnip mice to keep your cat entertained.",
    inStock: true
  },
  {
    id: "3",
    name: "Luxury Cat Bed",
    price: 39.99,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1617472451039-9cb926f2d28d?w=800",
    rating: 4.6,
    reviews: 67,
    description: "Soft, plush cat bed with removable cushion. Machine washable and perfect for cats up to 15 lbs.",
    inStock: true
  },
  {
    id: "4",
    name: "Automatic Water Fountain",
    price: 29.99,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
    rating: 4.7,
    reviews: 156,
    description: "Ultra-quiet water fountain with triple filtration system. Encourages cats to drink more water.",
    inStock: true
  },
  {
    id: "5",
    name: "Cat Tree Tower",
    price: 79.99,
    category: "furniture",
    image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800",
    rating: 4.4,
    reviews: 92,
    description: "Multi-level cat tree with scratching posts, platforms, and cozy hideouts. Sturdy construction.",
    inStock: true
  },
  {
    id: "6",
    name: "Premium Grooming Kit",
    price: 19.99,
    category: "grooming",
    image: "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=800",
    rating: 4.5,
    reviews: 73,
    description: "Complete grooming kit with brush, nail clippers, and comb. Perfect for maintaining your cat's coat.",
    inStock: false
  }
  // 👉 paste ALL products here
];

export const services: Service[] = [
  {
    id: "1",
    name: "Central Vet Clinic",
    type: "vet",
    rating: 4.8,
    distance: "0.5 mi",
    address: "123 Main St",
    phone: "(415) 555-0123",
    image: "https://images.unsplash.com/photo-1628276877524-7f0ab45d5b30?w=800",
    description: "Full-service veterinary clinic with emergency care, surgery, and wellness exams."
  },
  {
    id: "2",
    name: "Purrfect Grooming Spa",
    type: "grooming",
    rating: 4.6,
    distance: "1.2 mi",
    address: "456 Oak Ave, San Francisco, CA",
    phone: "(415) 555-0456",
    image: "https://images.unsplash.com/photo-1544026527-d26297d5b9c7?w=800",
    description: "Professional cat grooming services including baths, nail trimming, and fur styling."
  },
  {
    id: "3",
    name: "Cozy Cat Hotel",
    type: "boarding",
    rating: 4.7,
    distance: "2.1 mi",
    address: "789 Pine St, San Francisco, CA",
    phone: "(415) 555-0789",
    image: "https://images.unsplash.com/photo-1516750930-0ccfb770d8db?w=800",
    description: "Luxury cat boarding with private suites, playtime, and 24/7 care."
  },
  {
    id: "4",
    name: "Bay Area Animal Hospital",
    type: "vet",
    rating: 4.9,
    distance: "1.8 mi",
    address: "321 Elm St, San Francisco, CA",
    phone: "(415) 555-0321",
    image: "https://images.unsplash.com/photo-1628276877524-7f0ab45d5b30?w=800",
    description: "State-of-the-art animal hospital with specialists in feline medicine and surgery."
  }
  // 👉 rest here
];

export const posts: Post[] = [
  {
    id: "1",
    user: {
      name: "Jessica Smith",
      avatar: "https://ui-avatars.com/api/?name=Jessica+Smith",
    },
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800",
    content: "My Luna enjoying her favorite spot ☀️",
    likes: 234,
    comments: 18,
    createdAt: "2 hours ago",
  },
  {
    id: "2",
    user: {
      name: "David Lee",
      avatar: "https://ui-avatars.com/api/?name=David+Lee",
    },
    image: "https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?w=800",
    content: "Milo's first adventure in the garden! He loved it 🌿",
    likes: 189,
    comments: 12,
    createdAt: "5 hours ago",
  },
  {
    id: "3",
    user: {
      name: "Amanda Chen",
      avatar: "https://ui-avatars.com/api/?name=Amanda+Chen",
    },
    image: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800",
    content: "Lazy Sunday with this beautiful girl 💕",
    likes: 312,
    comments: 24,
    createdAt: "1 day ago",
  },
];