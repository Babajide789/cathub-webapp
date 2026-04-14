import type { Cat } from "@/types/cats";
import type { CatCardProps } from "@/customComponents/components/CatCard";

/**
 * API → UI transformation layer
 */
export function mapCatToCatCard(cat: Cat): CatCardProps {
  return {
    id: cat.id,
    name: cat.name,
    image: cat.image,
    breed: cat.breed,
    age: cat.age,
    gender: cat.gender,
    location: cat.location,
  };
}