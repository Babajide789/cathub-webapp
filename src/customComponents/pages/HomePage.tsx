import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingBag,
  Stethoscope,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { CatCard } from "../components/CatCard";
import { ProductCard } from "../components/ProductCard";
import { ServiceCard } from "../components/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockCats, mockProducts, mockServices } from "../data/mockData";
import { Input } from "@/components/ui/input";

export function HomePage() {
  const featuredCats = mockCats.slice(0, 4);
  const recommendedProducts = mockProducts.slice(0, 4);
  const nearbyServices = mockServices.slice(0, 2);

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-3 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Find Your Purrfect Companion
            </h1>
            <p className="mx-auto mb-6 max-w-2xl text-base text-muted-foreground sm:text-lg md:mb-8">
              Connect with cats looking for homes, shop for supplies, and join a community of cat lovers
            </p>
            <div className="mx-auto max-w-xl">
              <div className="flex flex-col gap-3 sm:relative sm:block">
                <Search className="absolute left-4 top-6 hidden h-5 w-5 -translate-y-1/2 text-muted-foreground sm:block" />
                <Input
                  type="search"
                  placeholder="Search by breed, location, or keyword..."
                  className="h-12 bg-white text-base sm:pl-12 sm:pr-28"
                />
                <Button className="h-11 w-full sm:absolute sm:right-2 sm:top-1/2 sm:h-9 sm:w-auto sm:-translate-y-1/2">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            <Link href="/adopt">
              <Card className="group cursor-pointer p-4 text-center transition-shadow hover:shadow-md sm:p-6">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 transition-colors group-hover:bg-red-200 sm:h-12 sm:w-12">
                  <Heart className="h-5 w-5 text-red-600 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-sm leading-snug">Adopt a Cat</h3>
              </Card>
            </Link>
            <Link href="/shop">
              <Card className="group cursor-pointer p-4 text-center transition-shadow hover:shadow-md sm:p-6">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200 sm:h-12 sm:w-12">
                  <ShoppingBag className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-sm leading-snug">Shop Supplies</h3>
              </Card>
            </Link>
            <Link href="/services">
              <Card className="group cursor-pointer p-4 text-center transition-shadow hover:shadow-md sm:p-6">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 transition-colors group-hover:bg-green-200 sm:h-12 sm:w-12">
                  <Stethoscope className="h-5 w-5 text-green-600 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-sm leading-snug">Find Services</h3>
              </Card>
            </Link>
            <Link href="/community">
              <Card className="group cursor-pointer p-4 text-center transition-shadow hover:shadow-md sm:p-6">
                <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 transition-colors group-hover:bg-purple-200 sm:h-12 sm:w-12">
                  <BookOpen className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-sm leading-snug">Community</h3>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-semibold leading-tight sm:text-3xl">
                Featured Cats for Adoption
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">Find your new best friend</p>
            </div>
            <Link href="/adopt">
              <Button variant="ghost" className="w-fit px-0 sm:px-4">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {featuredCats.map((cat) => (
              <CatCard key={cat.id} {...cat} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-semibold leading-tight sm:text-3xl">
                Recommended Products
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">Everything your cat needs</p>
            </div>
            <Link href="/shop">
              <Button variant="ghost" className="w-fit px-0 sm:px-4">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="mb-1 text-2xl font-semibold leading-tight sm:text-3xl">
                Nearby Vets & Services
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">Professional care for your cat</p>
            </div>
            <Link href="/services">
              <Button variant="ghost" className="w-fit px-0 sm:px-4">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {nearbyServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-linear-to-br from-blue-50 to-indigo-50 py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="mb-5 text-center text-2xl font-semibold leading-tight sm:mb-6 sm:text-3xl">
            Cat Care Tips & Resources
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
            <Card className="p-5 transition-shadow hover:shadow-md sm:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2">First-Time Owner Guide</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Everything you need to know about bringing a cat home for the first time.
              </p>
              <Button variant="link" className="h-auto p-0">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Card>
            <Card className="p-5 transition-shadow hover:shadow-md sm:p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2">Health & Wellness</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Tips for keeping your cat healthy, happy, and thriving.
              </p>
              <Button variant="link" className="h-auto p-0">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Card>
            <Card className="p-5 transition-shadow hover:shadow-md sm:col-span-2 sm:p-6 md:col-span-1">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Heart className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2">Adoption Process</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Step-by-step guide to adopting your perfect feline companion.
              </p>
              <Button variant="link" className="h-auto p-0">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
