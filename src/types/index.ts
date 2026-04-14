// /types/index.ts

export interface Cat {
  id: string;
  name: string;
  age: string;
  breed: string;
  location: string;
  description: string;
  image: string;
  gender: string;
  health: string[];
  vaccinated: boolean;
  neutered: boolean;
  ownerName: string;
  ownerAvatar: string;
  ownerType: "individual" | "shelter";
  gallery: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  inStock: boolean;
}

export interface Service {
  id: string;
  name: string;
  type: "vet" | "grooming" | "boarding";
  rating: number;
  distance: string;
  address: string;
  phone: string;
  image: string;
  description: string;
  
}

export interface Post {
  id: string;

  user: {
    name: string;
    avatar: string;
  };

  content: string;

  image?: string;

  createdAt: string;

  likes: number;

  comments: number;
}